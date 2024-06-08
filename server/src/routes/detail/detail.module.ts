import { Module } from '@nestjs/common';
import { DetailController } from './detail.controller';
import { DetailService } from './detail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import { PlanEntity } from 'src/database/entities/plan.entity';
import { DetailEntity } from 'src/database/entities/detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PlanEntity, DetailEntity])],
  controllers: [DetailController],
  providers: [DetailService],
  exports: [DetailService],
})
export class DetailModule {}
