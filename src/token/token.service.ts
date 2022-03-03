import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  public async generateToken(ip: string) {
    return await this.jwtService.signAsync(
      {
        sub: `${ip}`,
      },
      {
        secret: process.env.ACCESS_JWT,
        algorithm: 'HS256',
        expiresIn: '1h',
      },
    );
  }

  public async verify(token: string) {
    return await this.jwtService.verifyAsync(token, {
      secret: process.env.ACCESS_JWT,
    });
  }

  public getIpByToken(token: string): string {
    return this.jwtService.decode(token).sub;
  }
}
