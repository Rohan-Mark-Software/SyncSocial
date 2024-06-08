import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import postgresConfig from './config/postgres.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './routes/user/user.module';
import { PlanModule } from './routes/plan/plan.module';
import { AuthModule } from './routes/auth/auth.module';
import { MailModule } from './routes/mail/mail.module';
import jwtConfig from './config/jwt.config';
import { APP_GUARD } from '@nestjs/core';
import { JWTAuthGuard } from './guards/jwt-auth.guard';
import { UserEntity } from './database/entities/user.entity';
import { PlanEntity } from './database/entities/plan.entity';
import { MessageEntity } from './database/entities/message.entity';
import { UnsentMessageEntity } from './database/entities/unsend-message.entity';
import { DetailEntity } from './database/entities/detail.entity';
import { SocketModule } from './routes/socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.production.env'
          : '.development.env',
      load: [postgresConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        let obj: TypeOrmModuleOptions = {
          type: 'postgres',
          host: configService.get('postgres.host'),
          port: configService.get('postgres.port'),
          username: configService.get('postgres.username'),
          password: configService.get('postgres.password'),
          database: configService.get('postgres.database'),
          entities: [
            UserEntity,
            PlanEntity,
            MessageEntity,
            UnsentMessageEntity,
            DetailEntity,
          ],
        };
        if (process.env.NODE_ENV === 'development') {
          obj = Object.assign(obj, {
            syncronize: true,
            logging: true,
          });
        } else {
          obj = Object.assign(obj, {
            syncronize: false,
            logging: false,
          });
        }
        return obj;
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 600,
        limit: 100,
      },
    ]),
    UserModule,
    PlanModule,
    AuthModule,
    MailModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JWTAuthGuard,
    },
  ],
})
export class AppModule {}
