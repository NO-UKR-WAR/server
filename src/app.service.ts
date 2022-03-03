import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { lookup } from 'geoip-lite';
import { ClickRequset } from './dto/request/click.request';
import { TokenService } from './token/token.service';

@Injectable()
export class AppService {
  constructor(private readonly tokenService: TokenService) {}

  async click(ip: string, clickRequest: ClickRequset) {
    let token = clickRequest.authorization;

    this.addCount(ip, clickRequest.click);

    if (
      clickRequest.authorization === undefined ||
      this.tokenService.getIpByToken(clickRequest.authorization) !== ip
    ) {
      //새로 토큰 발급 clickRequest.authorization.ip !=== ip
      token = await this.tokenService.generateToken(ip);
    } else {
      try {
        await this.tokenService.verify(clickRequest.authorization);
      } catch (e: any) {
        throw new BadRequestException('expired token, please remove token');
      }
    }

    return {
      location: lookup(ip).country,
      token: token,
    };
  }

  private async addCount(ip: string, click: number) {
    // if(redis.find({ip: ip}).exist()) {
    //   throw new HttpException('Too many Request', 409)
    // }
    // redis.save({ip: ip, ttl: 20})
    // db.save({click: click + click})
  }
}
