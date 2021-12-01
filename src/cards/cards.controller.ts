import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardEntity } from './card.entity';
import { AuthGuard, UserIsUserGuard } from '../users/guards';
import { CreateCardDto, UpdateCardDto } from './dto';
import { ColumnsService } from '../columns/columns.service';
import { DeleteResult } from 'typeorm';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Card } from '../types/types';

@Controller('users/:userId/columns/:columnId/cards')
@ApiTags('Cards')
@UseGuards(AuthGuard, UserIsUserGuard)
@ApiForbiddenResponse({ description: 'Forbidden' })
@ApiNotFoundResponse()
@ApiBearerAuth()
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
    private readonly columnsService: ColumnsService,
  ) {}

  @Get()
  async findAllCards(
    @Param('columnId') columnId: number,
  ): Promise<CardEntity[]> {
    await this.columnsService.findColumn(columnId);
    return await this.cardsService.findAllCards(columnId);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: CreateCardDto })
  @ApiCreatedResponse({
    description: 'The record has been successfully created',
    type: Card,
  })
  async createCard(
    @Param('columnId') columnId: number,
    @Body() createCardDto: CreateCardDto,
  ): Promise<CardEntity> {
    const column = await this.columnsService.findColumn(columnId);
    return await this.cardsService.createCard(column, createCardDto);
  }

  @Get(':id')
  async getCard(
    @Param() params: { columnId: number; id: number },
  ): Promise<CardEntity> {
    await this.columnsService.findColumn(params.columnId);
    return await this.cardsService.getCard(params.id, params.columnId);
  }

  @Delete(':id')
  async deleteCard(
    @Param() params: { columnId: number; id: number },
  ): Promise<DeleteResult> {
    await this.columnsService.findColumn(params.columnId);
    return await this.cardsService.deleteCard(params.id, params.columnId);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: UpdateCardDto })
  @ApiCreatedResponse({
    description: 'The record has been successfully created',
    type: Card,
  })
  async updateCard(
    @Param() params: { columnId: number; id: number },
    @Body() updateCardDto: UpdateCardDto,
  ): Promise<CardEntity> {
    await this.columnsService.findColumn(params.columnId);
    updateCardDto.columnId &&
      (await this.columnsService.findColumn(updateCardDto.columnId));
    return await this.cardsService.updateCard(
      params.id,
      params.columnId,
      updateCardDto,
    );
  }
}
