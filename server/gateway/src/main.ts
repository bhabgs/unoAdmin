import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startNacos } from './Nacos';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { port, api } = await startNacos('gateway');
  app.setGlobalPrefix(api);
  await app.listen(port);
}
bootstrap();
