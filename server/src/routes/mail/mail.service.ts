import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { join } from 'path';
// import * as fs from 'fs';
import { UserEntity } from 'src/database/entities/user.entity';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async sendVerificationMail(user: UserEntity) {
    // const emailIcon = fs.readFileSync(
    //   join(__dirname, '../../', 'public/img/mail-open-check-svgrepo-com.png'),
    // );
    // const logo = fs.readFileSync(
    //   join(__dirname, '../../', 'public/img/mail-logo.png'),
    // );
    // const mailHeader = fs.readFileSync(
    //   join(__dirname, '../../', 'public/img/verifyEmail.png'),
    // );

    // const emailIconCid = 'emailIcon';
    // const logoCid = 'logo';
    // const mailHeaderCid = 'mailHeader';
    console.log(user.email);
    return await this.mailerService.sendMail({
      to: user.email,
      from: this.configService.get<string>('SMTP_AUTH_USER'),
      subject: 'verification email',
      text: `testing ${user}`,
      //   template: 'email-verification',
      //   context: {
      //     baseURL: this.configService.get<string>('BASE_URL'),
      //     token: token,
      //     emailIconCid,
      //     logoCid,
      //     mailHeaderCid,
      //   },
      //   attachments: [
      //     {
      //       filename: 'emailVerifIcon.png',
      //       content: emailIcon,
      //       encoding: 'base64',
      //       cid: emailIconCid,
      //     },
      //     {
      //       filename: 'logo.png',
      //       content: logo,
      //       encoding: 'base64',
      //       cid: logoCid,
      //     },
      //     {
      //       filename: 'mailHeader.png',
      //       content: mailHeader,
      //       encoding: 'base64',
      //       cid: mailHeaderCid,
      //     },
      //   ],
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async sendPasswordResetMail(user: UserEntity) {
    // const emailIcon = fs.readFileSync(
    //   join(__dirname, '../../', 'public/img/reset-password.png'),
    // );
    // const logo = fs.readFileSync(
    //   join(__dirname, '../../', 'public/img/mail-logo.png'),
    // );
    // const mailHeader = fs.readFileSync(
    //   join(__dirname, '../../', 'public/img/reset-password-email-icon.png'),
    // );

    // const emailIconCid = 'emailIcon';
    // const logoCid = 'logo';
    // const mailHeaderCid = 'mailHeader';
    return await this.mailerService.sendMail({
      to: user.email,
      from: this.configService.get<string>('SMTP_AUTH_USER'),
      subject: '오늘 뭐 해먹지? - 비밀번호 재설정',
      text: `testing ${user}`,
      //   template: 'reset-password',
      //   context: {
      //     baseURL: this.configService.get<string>('BASE_URL'),
      //     userId: user.verificationValue,
      //     token: token,
      //     emailIconCid,
      //     logoCid,
      //     mailHeaderCid,
      //   },
      //   attachments: [
      //     {
      //       filename: 'emailIcon.png',
      //       content: emailIcon,
      //       encoding: 'base64',
      //       cid: emailIconCid,
      //     },
      //     {
      //       filename: 'logo.png',
      //       content: logo,
      //       encoding: 'base64',
      //       cid: logoCid,
      //     },
      //     {
      //       filename: 'mailHeader.png',
      //       content: mailHeader,
      //       encoding: 'base64',
      //       cid: mailHeaderCid,
      //     },
      //   ],
    });
  }
}
