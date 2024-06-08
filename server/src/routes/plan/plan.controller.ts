import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { CreatePlanReqDto, JoinPlanReqDto } from './dto/req.dto';
import { PlanService } from './plan.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PlanEntity } from 'src/database/entities/plan.entity';

@ApiTags('plan')
@Controller('plan')
export class PlanController {
  constructor(private planService: PlanService) {}

  @ApiOperation({ summary: 'Find Plan by its id (uuid)' })
  @ApiResponse({ status: 200, description: 'Plan found.' })
  @ApiBearerAuth()
  @Get(':id')
  async getPlan(@Param('id') id: string): Promise<PlanEntity> {
    return await this.planService.findPlan(id);
  }

  @ApiOperation({ summary: 'Create Plan' })
  @ApiResponse({ status: 201, description: 'Plan Created.' })
  @ApiBearerAuth()
  @Post()
  async createPlan(
    @Body() data: CreatePlanReqDto,
    @Req() req,
  ): Promise<PlanEntity> {
    const user = req.user;
    return await this.planService.createPlan(data, user);
  }

  @ApiOperation({ summary: 'Join Plan' })
  @ApiResponse({ status: 200, description: 'Joined Plan.' })
  @ApiResponse({ status: 404, description: 'Plan Not Found.' })
  @ApiBearerAuth()
  @Put(':code')
  async joinPlan(
    @Param('code') code: string,
    @Body() data: JoinPlanReqDto,
    @Req() req,
  ): Promise<PlanEntity> {
    const user = req.user;
    return await this.planService.joinPlan(code, data, user);
  }

  @ApiOperation({
    summary: 'Leave Plan',
    description:
      'The plan will be automatically deleted if everyone in the plan leaves',
  })
  @ApiResponse({ status: 200, description: 'Leave Plan.' })
  @ApiResponse({ status: 404, description: 'Plan Not Found.' })
  @ApiBearerAuth()
  @Delete(':id')
  async leavePlan(@Param('id') id: string, @Req() req): Promise<void> {
    const user = req.user;
    return await this.planService.leavePlan(id, user);
  }
}
