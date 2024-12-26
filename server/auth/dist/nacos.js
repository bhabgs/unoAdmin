"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startNacos = void 0;
const nacos_config_1 = require("nacos-config");
const nacos_naming_1 = require("nacos-naming");
const config_1 = require("./config");
const serverAddr = config_1.default.nacos.host + ':' + config_1.default.nacos.port;
const startNacos = async (props) => {
    const { group = 'uno', namespace = 'public', ip, port, serverName } = props;
    const naming = new nacos_naming_1.NacosNamingClient({
        logger: console,
        namespace,
        serverList: serverAddr,
    });
    await naming.ready();
    await naming.registerInstance(serverName, {
        enabled: true,
        healthy: true,
        instanceId: `${ip}:${port}`,
        ip,
        port,
    }, group);
    naming.subscribe(serverName, (value) => {
    });
    const config = new nacos_config_1.NacosConfigClient({
        namespace,
        serverAddr,
    });
    config.subscribe({
        dataId: serverName,
        group,
    }, (value) => {
    });
};
exports.startNacos = startNacos;
//# sourceMappingURL=nacos.js.map