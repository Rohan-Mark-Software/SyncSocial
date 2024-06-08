import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MessageService } from './message.service';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOperation({ summary: 'get messages by plan (pagination)' })
  @ApiResponse({
    status: 200,
    description: 'returns list of messages in plan.',
  })
  @ApiResponse({ status: 404, description: 'Plan Not Found.' })
  @ApiBearerAuth()
  @Get()
  async getMessagesByPlanId(
    @Param('planId') planId: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.messageService.getMessagesByPlanId(planId, page, limit);
  }
}
