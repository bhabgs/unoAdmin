import { NestFactory } from '@nestjs/core';
import { startNacos } from '@uno/nacos';
import { AppModule } from './app.module';

async function bootstrap() {
  const { port } = await startNacos('auth');

  const app = await NestFactory.create(AppModule);

  await app.listen(port);
}
bootstrap();
