import { Injectable } from '@nestjs/common';
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';
import { NacosNamingClient } from 'nacos';
import { serverList, getNacosConfig } from '@uno/nacos';
import { IncomingMessage, ServerResponse } from 'http';

@Injectable()
export class AppService {
  // 客户端
  naming: NacosNamingClient;

  // 服务列表
  serviceList = {
    count: 0,
    data: [],
    map: {},
  };
  microservices: Map<
    string,
    RequestHandler<
      IncomingMessage,
      ServerResponse<IncomingMessage>,
      (err?: any) => void
    >
  > = new Map();
  async initMicroService() {
    this.naming = new NacosNamingClient({
      logger: console,
      namespace: 'public',
      serverList: serverList,
    });
    await this.naming.ready();

    // 查询服务列表
    //@ts-ignore
    this.naming._serverProxy
      .getServiceList(1, 20, 'DEFAULT_GROUP')
      .then((service) => {
        this.serviceList.count = service.count;
        this.serviceList.data = service.data;

        service.data.forEach((serviceName) => {
          // 获取 serviceName 服务下 可用 实例列表
          this.naming.selectInstances(serviceName).then((instance) => {
            this.serviceList.map[serviceName] = instance;
          });

          // 监听 serviceName 服务下实例变化
          this.naming.subscribe(serviceName, (hosts) => {
            console.log('subscribe :>> ', hosts);

            // 获取 serviceName 服务下 可用 实例列表
            this.naming.selectInstances(serviceName).then((instance) => {
              this.serviceList.map[serviceName] = instance;
            });
          });
        });
      });
  }
  async getServerName(str: string): Promise<{
    serviceName: string;
    message: string;
  }> {
    const { servers } = await getNacosConfig({
      name: 'server.yaml',
    });

    for (const i of this.serviceList.data) {
      const url = servers.gateway.api + '/' + i;
      if (str.includes(url)) {
        const message = i + '/' + str.replace(url, '');
        return {
          serviceName: i,
          message,
        };
      }
    }
  }
  async createProxy(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
  ) {
    const { serviceName, message } = await this.getServerName(req.url);

    const target =
      'http://' +
      this.serviceList.map[serviceName][0].ip +
      ':' +
      this.serviceList.map[serviceName][0].port +
      message;
    try {
      const proxy = createProxyMiddleware({
        target,
        changeOrigin: true,
      });

      return proxy(req, res);
    } catch (error) {
      console.log('error :>> ', error);
    }
  }
}
