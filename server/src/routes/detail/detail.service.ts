import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailEntity } from 'src/database/entities/detail.entity';
import { Repository } from 'typeorm';
import {
  CreateDetailReqDto,
  DetailRelations,
  UpdateDetailReqDto,
} from './dto/req.dto';
import { UserEntity } from 'src/database/entities/user.entity';
import { PlanEntity } from 'src/database/entities/plan.entity';

@Injectable()
export class DetailService {
  constructor(
    @InjectRepository(DetailEntity)
    private detailRepository: Repository<DetailEntity>,
  ) {}

  async findAllDetailByUserAndPlan(
    planId: string,
    user: UserEntity,
    relations?: DetailRelations[],
  ) {
    return await this.detailRepository.find({
      where: { user: { id: user.id }, plan: { id: planId } },
      relations: [...(relations || [])],
    });
  }

  async findOne(id: string, relations?: DetailRelations[]) {
    return await this.detailRepository.findOne({
      where: { id },
      relations: [...(relations || [])],
    });
  }

  async findDetailByUserAndPlan(
    user: UserEntity,
    plan: PlanEntity,
    relations?: DetailRelations[],
  ): Promise<DetailEntity> {
    const result = await this.detailRepository.findOne({
      where: { user: { id: user.id }, plan: { id: plan.id } },
      relations: [...(relations || [])],
    });
    return result;
  }

  async createDetail(data: CreateDetailReqDto): Promise<DetailEntity> {
    const { budget, mood, date, user, plan } = data;
    const detail = this.detailRepository.create();
    detail.mood = mood;
    detail.budget = budget;
    detail.date = date;
    detail.plan = plan;
    detail.user = user;
    return await this.detailRepository.save(detail);
  }

  async updateDetail(
    detail: DetailEntity,
    data: UpdateDetailReqDto,
  ): Promise<DetailEntity> {
    const { budget, mood, date } = data;
    detail.mood = mood;
    detail.budget = budget;
    detail.date = date;
    return await this.detailRepository.save(detail);
  }

  async deleteDetail(detail: DetailEntity) {
    await this.detailRepository.remove(detail);
    return;
  }
}
