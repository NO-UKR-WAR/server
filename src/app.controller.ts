import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { RealIP } from 'nestjs-real-ip';
import { ClickRequset } from './dto/request/click.request';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('click')
  async get(@RealIP() ip: string, @Query() clickRequest: ClickRequset) {
    return this.appService.click(ip, clickRequest);
  }
}
