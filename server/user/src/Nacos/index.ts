import { NacosNamingClient, NacosConfigClient } from 'nacos';
import * as yml from 'yaml';
import config from '../config';

const logger = console;
/**
 * Constants
 */
// Nacos 服务地址
const serverList = config.nacos.host + ':' + config.nacos.port;

const client = new NacosNamingClient({
  serverList,
  namespace: 'public',
  logger,
});

export const startNacos = async (serverName: string) => {
  let serverPort = 3000;
  try {
    const nc = await getNacosConfig({
      name: 'server.yaml',
    });
    serverPort = nc.servers[serverName].port;
    await client.ready();
    await client.registerInstance(serverName, {
      ip: 'localhost',
      port: serverPort,
      weight: 1,
      enabled: true,
      healthy: true,
      instanceId: 'auth',
    });
  } catch (error) {
    console.log('startNacos error :>> ', error);
  }
  return { port: serverPort };
};

// 获取配置
const clientConfig = new NacosConfigClient({
  serverAddr: serverList,
  namespace: 'public',
});

const nacosConfigMap = new Map<string, { value: any; time: number }>();
export const getNacosConfig = async ({
  name,
  group = 'DEFAULT_GROUP',
}: {
  name: string;
  group?: string;
}) => {
  if (!clientConfig.ready) {
    await clientConfig.ready();
  }
  const tim = new Date().getTime();
  // 如果缓存中没有或者缓存过期
  if (
    !nacosConfigMap.has(name) ||
    tim - nacosConfigMap.get(name).time >
      1000 * 60 * (config.nacos.cacheTime || 1)
  ) {
    // 获取配置
    const config = await clientConfig.getConfig(name, group);
    nacosConfigMap.set(name, { value: config, time: tim });
  }
  return yml.parse(nacosConfigMap.get(name).value);
};
