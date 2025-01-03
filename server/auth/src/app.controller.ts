import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  login(): string {
    return this.appService.getHello();
  }
  @Get()
  getAaa(): string {
    return 'oauth';
  }
}
