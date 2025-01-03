import { Controller, Req, All, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    // 创建客户端
    this.appService.initMicroService();
  }

  @All('*')
  get(@Req() req: Request, @Res() res: Response) {
    return this.appService.createProxy(req as any, res as any);
  }
}
