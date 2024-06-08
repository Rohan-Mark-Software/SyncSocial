import { Module } from '@nestjs/common';
import { SocketGateway } from 'src/gateway/socket.gateway';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [UserModule, AuthModule, MessageModule],
  providers: [SocketGateway],
})
export class SocketModule {}
