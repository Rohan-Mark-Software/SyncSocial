import { Module } from '@nestjs/common';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import { DetailEntity } from 'src/database/entities/detail.entity';
import { PlanEntity } from 'src/database/entities/plan.entity';
import { UserModule } from '../user/user.module';
import { DetailModule } from '../detail/detail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PlanEntity, DetailEntity]),
    UserModule,
    DetailModule,
  ],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [PlanService],
})
export class PlanModule {}
