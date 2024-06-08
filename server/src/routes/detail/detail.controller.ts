import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DetailService } from './detail.service';
import { DetailEntity } from 'src/database/entities/detail.entity';
import { UpdateDetailReqDto } from './dto/req.dto';

@ApiTags('detail')
@Controller('detail')
export class DetailController {
  constructor(private detailService: DetailService) {}

  @ApiOperation({ summary: 'get moods from plan using plan id' })
  @ApiResponse({ status: 200, description: 'Plan found.' })
  @ApiBearerAuth()
  @Get(':id')
  async getDetail(
    @Param('id') id: string,
    @Req() req,
  ): Promise<DetailEntity[]> {
    return await this.detailService.findAllDetailByUserAndPlan(id, req.user);
  }

  @ApiOperation({ summary: 'update detail' })
  @ApiResponse({ status: 200, description: 'detail updated.' })
  @ApiResponse({ status: 404, description: 'detail Not Found.' })
  @ApiBearerAuth()
  @Put(':id')
  async updateDetail(
    @Param('id') id: string,
    @Body() data: UpdateDetailReqDto,
    @Req() req,
  ) {
    const detail = await this.detailService.findOne(id, ['user']);
    if (!detail) {
      throw new BadRequestException('detail Not Found.');
    }
    if (detail.user.id !== req.user.id) {
      throw new BadRequestException('User does not own this detail');
    }
    return await this.detailService.updateDetail(detail, data);
  }
}
