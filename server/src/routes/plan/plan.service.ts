import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlanReqDto, JoinPlanReqDto, PlanRelations } from './dto/req.dto';
import { UserEntity } from 'src/database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanEntity } from 'src/database/entities/plan.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { DetailService } from '../detail/detail.service';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(PlanEntity)
    private planRepository: Repository<PlanEntity>,

    private userService: UserService,
    private detailService: DetailService,
  ) {}

  async findPlan(id: string, relations?: PlanRelations[]): Promise<PlanEntity> {
    return this.planRepository.findOne({
      where: { id },
      relations: [...(relations || [])],
    });
  }

  async findPlanByCode(
    code: string,
    relations?: PlanRelations[],
  ): Promise<PlanEntity> {
    return this.planRepository.findOne({
      where: { code },
      relations: [...(relations || [])],
    });
  }

  async createPlan(
    data: CreatePlanReqDto,
    user: UserEntity,
  ): Promise<PlanEntity> {
    const { name, budget, mood, date } = data;
    let plan = this.planRepository.create();

    let found = false;
    let code = '';
    while (!found) {
      code = this.generateRandomCode();
      const planWithSameCode = await this.findPlanByCode(code);
      if (!planWithSameCode) {
        found = true;
      }
    }
    plan.code = code;
    plan.name = name;
    plan = await this.planRepository.save(plan);

    const detail = await this.detailService.createDetail({
      budget,
      mood,
      date,
      user,
      plan,
    });

    user = await this.userService.findOne(user.id, ['plans', 'details']);
    user.plans.push(plan);
    user.details.push(detail);
    await this.userService.updateWithUserEntity(user);

    return plan;
  }

  async joinPlan(
    code: string,
    data: JoinPlanReqDto,
    user: UserEntity,
  ): Promise<PlanEntity> {
    const { budget, mood, date } = data;
    const plan = await this.findPlanByCode(code);
    if (!plan) {
      throw new NotFoundException('User or plan not found');
    }
    user = await this.userService.findOne(user.id, ['plans', 'details']);
    if (user.plans.some((userPlan) => userPlan.id === plan.id)) {
      throw new BadRequestException('User is already in the plan');
    }
    const detail = await this.detailService.createDetail({
      budget,
      mood,
      date,
      user,
      plan,
    });
    user.plans.push(plan);
    user.details.push(detail);
    await this.userService.updateWithUserEntity(user);
    return plan;
  }

  async leavePlan(id: string, user: UserEntity): Promise<void> {
    user = await this.userService.findOne(user.id, ['plans', 'details']);
    const plan = await this.findPlan(id, ['users', 'details']);

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    if (!user.plans.some((userPlan) => userPlan.id === plan.id)) {
      throw new BadRequestException('User is not in this plan');
    }

    user.plans = user.plans.filter((userPlan) => userPlan.id !== plan.id);
    await this.userService.updateWithUserEntity(user);

    const detail = await this.detailService.findDetailByUserAndPlan(user, plan);
    await this.detailService.deleteDetail(detail);
    //check if there is no users in plan
    const updatedPlan = await this.findPlan(plan.id, ['users', 'details']);
    if (updatedPlan.users.length === 0) {
      await this.deletePlan(plan);
    }
    return;
  }

  async deletePlan(plan: PlanEntity): Promise<void> {
    await this.planRepository.remove(plan);
    return;
  }

  generateRandomCode() {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }

    return result;
  }
}
