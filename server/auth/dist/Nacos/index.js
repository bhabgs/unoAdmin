"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNacosConfig = exports.startNacos = void 0;
const nacos_1 = require("nacos");
const yml = require("yaml");
const config_1 = require("../config");
const logger = console;
const serverList = config_1.default.nacos.host + ':' + config_1.default.nacos.port;
const client = new nacos_1.NacosNamingClient({
    serverList,
    namespace: 'public',
    logger,
});
const startNacos = async (serverName) => {
    let serverPort = 3000;
    try {
        const nc = await (0, exports.getNacosConfig)({
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
    }
    catch (error) {
        console.log('startNacos error :>> ', error);
    }
    return { port: serverPort };
};
exports.startNacos = startNacos;
const clientConfig = new nacos_1.NacosConfigClient({
    serverAddr: serverList,
    namespace: 'public',
});
const nacosConfigMap = new Map();
const getNacosConfig = async ({ name, group = 'DEFAULT_GROUP', }) => {
    if (!clientConfig.ready) {
        await clientConfig.ready();
    }
    const tim = new Date().getTime();
    if (!nacosConfigMap.has(name) ||
        tim - nacosConfigMap.get(name).time >
            1000 * 60 * (config_1.default.nacos.cacheTime || 1)) {
        const config = await clientConfig.getConfig(name, group);
        nacosConfigMap.set(name, { value: config, time: tim });
    }
    return yml.parse(nacosConfigMap.get(name).value);
};
exports.getNacosConfig = getNacosConfig;
//# sourceMappingURL=index.js.map