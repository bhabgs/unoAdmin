import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { startNacos } from './nacos';
import config from './config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      port: config.servers.user.port,
    },
  });

  startNacos({
    ip: 'localhost',
    port: config.servers.user.port,
    serverName: 'user',
  });

  await app.listen();
}
bootstrap();
