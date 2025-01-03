import { Controller, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @MessagePattern('')
  login(): string {
    return this.appService.getHello();
  }

  @MessagePattern('oauth')
  getAaa(): string {
    return 'oauth';
  }
}
