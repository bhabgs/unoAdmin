"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const nacos_1 = require("@uno/nacos");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const { port } = await (0, nacos_1.startNacos)('auth');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map