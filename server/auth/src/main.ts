import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startNacos } from './Nacos';

async function bootstrap() {
  const { port } = await startNacos('auth');

  const app = await NestFactory.create(AppModule);

  await app.listen(port);
}
bootstrap();
