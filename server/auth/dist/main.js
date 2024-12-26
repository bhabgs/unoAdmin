"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const app_module_1 = require("./app.module");
const nacos_1 = require("./nacos");
const config_1 = require("./config");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.TCP,
        options: {
            port: config_1.default.servers.auth.port,
        },
    });
    (0, nacos_1.startNacos)({
        ip: 'localhost',
        port: config_1.default.servers.auth.port,
        serverName: 'auth',
    });
    await app.listen();
}
bootstrap();
//# sourceMappingURL=main.js.map