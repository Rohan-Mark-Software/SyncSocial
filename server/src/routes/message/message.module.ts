import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import { PlanEntity } from 'src/database/entities/plan.entity';
import { MessageController } from './message.controller';
import { UserModule } from '../user/user.module';
import { PlanModule } from '../plan/plan.module';
import { MessageEntity } from 'src/database/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, MessageEntity, PlanEntity]),
    UserModule,
    PlanModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
