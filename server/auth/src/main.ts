import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { startNacos } from './nacos';
import config from './config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      port: config.servers.auth.port,
    },
  });

  startNacos({
    ip: 'localhost',
    port: config.servers.auth.port,
    serverName: 'auth',
  });

  await app.listen();
}
bootstrap();
