import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './database/entities/user.entity';
import { PlanEntity } from './database/entities/plan.entity';
import { MessageEntity } from './database/entities/message.entity';
import { UnsentMessageEntity } from './database/entities/unsend-message.entity';
import { DetailEntity } from './database/entities/detail.entity';

@ApiExtraModels(
  UserEntity,
  PlanEntity,
  MessageEntity,
  UnsentMessageEntity,
  DetailEntity,
)
@ApiTags('index')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
