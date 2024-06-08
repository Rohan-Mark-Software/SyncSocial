import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from 'src/database/entities/message.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { PlanService } from '../plan/plan.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
    private userService: UserService,
    private planService: PlanService,
  ) {}
  async addMessage(userId: string, planId: string, content: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new BadRequestException('user not found');
    }
    const plan = await this.planService.findPlan(planId);
    if (!plan) {
      throw new BadRequestException('plan not found');
    }
    return await this.messageRepository.save({
      user,
      plan,
      content,
    });
  }

  async getMessagesByPlanId(
    planId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const [messages, total] = await this.messageRepository.findAndCount({
      where: { plan: { id: planId } },
      relations: ['user', 'plan'],
      take: limit,
      skip: skip,
      order: { createdAt: 'DESC' },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      messages,
      page,
      totalPages,
      totalItems: total,
    };
  }
}
