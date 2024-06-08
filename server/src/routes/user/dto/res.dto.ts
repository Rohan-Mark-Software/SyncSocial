import { DetailEntity } from 'src/database/entities/detail.entity';
import { MessageEntity } from 'src/database/entities/message.entity';
import { PlanEntity } from 'src/database/entities/plan.entity';
import { UnsentMessageEntity } from 'src/database/entities/unsend-message.entity';
import { UserEntity } from 'src/database/entities/user.entity';

export function toResUserEntity(user: UserEntity): resUserEntity {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    accessTokenVersion: user.accessTokenVersion,
    refreshTokenVersion: user.refreshTokenVersion,
    emailConfirmed: user.emailConfirmed,
    createdAt: user.createdAt.toISOString(),
    plans: user.plans,
    unsent_messages: user.unsent_messages,
    messages: user.messages,
    details: user.details,
  };
}

export class resUserEntity {
  id: string;
  username: string;
  email: string;
  accessTokenVersion: number;
  refreshTokenVersion: number;
  emailConfirmed: boolean;
  createdAt: string;
  plans?: PlanEntity[];
  unsent_messages?: UnsentMessageEntity[];
  messages?: MessageEntity[];
  details?: DetailEntity[];
}
