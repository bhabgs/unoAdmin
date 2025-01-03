import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startNacos } from '@uno/nacos';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { port, api } = await startNacos('gateway');
  app.setGlobalPrefix(api);
  await app.listen(port);
}
bootstrap();
