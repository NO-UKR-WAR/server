import * as redisStore from 'cache-manager-ioredis';
import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenModule } from './token/token.module';
import { prototype } from 'events';
import { CountRepository } from './count/domain/repository/count.repository';
import { Count } from './count/domain/count.entity';

@Module({
  imports: [
    TokenModule,
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [Count],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([CountRepository]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
