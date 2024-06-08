import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
// import path from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: process.env.SUPPORT_EMAIL,
        },
        // template: {
        //   dir: `${path.resolve(__dirname, './templates')}`,
        //   adapter: new EjsAdapter(),
        //   options: {
        //     strict: true,
        //   },
        // },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
