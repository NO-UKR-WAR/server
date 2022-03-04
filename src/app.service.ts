import {
  BadRequestException,
  CACHE_MANAGER,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { lookup } from 'geoip-lite';
import { CountRepository } from './count/domain/repository/count.repository';
import { ClickRequset } from './dto/request/click.request';
import { TokenService } from './token/token.service';

@Injectable()
export class AppService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly countRepository: CountRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async click(ip: string, clickRequest: ClickRequset) {
    let token = clickRequest.authorization;
    let country = 'KR';
    try {
      country = lookup(ip).country;
    } catch (e: any) {
      throw new BadRequestException('Invalid IP Address');
    }

    await this.addCount(ip, clickRequest.click, country);

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
      location: country,
      token: token,
    };
  }

  private async addCount(ip: string, click: number, country: string) {
    const value = await this.cacheManager.get(ip);
    this.cacheManager.set(ip, '', { ttl: 20 });
    if (value !== null) {
      throw new HttpException('Too many Request', 409);
    } else {
      let value = 0;
      const countEntity = await this.countRepository.findOne({
        country_code: country,
      });
      if (countEntity !== undefined) {
        value = countEntity.count;
      }
      this.countRepository.save({
        country_code: country,
        count: Number(click + Number(value)),
      });
    }
  }
}
