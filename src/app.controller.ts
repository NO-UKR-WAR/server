import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { RealIP } from 'nestjs-real-ip';
import { ClickRequset } from './dto/request/click.request';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('click')
  async click(@RealIP() ip: string, @Query() clickRequest: ClickRequset) {
    return this.appService.click(ip, clickRequest);
  }

  @Get('countries')
  async queryCountryList(@Query('page') page: number) {
    return this.appService.queryCountryList(page);
  }

  @Get('countries/:country_code')
  async query(@Param('country_code') countryCode: string) {
    return this.appService.queryCountry(countryCode);
  }
}
