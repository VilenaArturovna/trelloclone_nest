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
import { ColumnsService } from './columns.service';
import { ColumnEntity } from './column.entity';
import { CreateColumnDto } from './dto/create-column.dto';
import { DeleteResult } from 'typeorm';
import { UsersService } from '../users/users.service';
import { AuthGuard, UserIsUserGuard } from '../users/guards';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Column } from '../types/types';

@Controller('users/:userId/columns')
@ApiTags('Columns')
@UseGuards(AuthGuard, UserIsUserGuard)
@ApiForbiddenResponse({ description: 'Forbidden' })
@ApiNotFoundResponse()
@ApiBearerAuth()
export class ColumnsController {
  constructor(
    private readonly columnsService: ColumnsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async findAllColumns(
    @Param('userId') userId: string,
  ): Promise<ColumnEntity[]> {
    return await this.columnsService.findAllColumns(userId);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: CreateColumnDto })
  @ApiCreatedResponse({
    description: 'The record has been successfully created',
    type: Column,
  })
  async createColumn(
    @Param('userId') userId: number,
    @Body() createColumnDto: CreateColumnDto,
  ): Promise<ColumnEntity> {
    const user = await this.usersService.findById(userId);
    return await this.columnsService.createColumn(user, createColumnDto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: CreateColumnDto })
  @ApiCreatedResponse({
    description: 'The record has been successfully created',
    type: Column,
  })
  async updateColumn(
    @Param('id') id: number,
    @Body() createColumnDto: CreateColumnDto,
  ): Promise<ColumnEntity> {
    return await this.columnsService.updateColumn(id, createColumnDto);
  }

  @Delete(':id')
  async deleteColumn(@Param('id') id: number): Promise<DeleteResult> {
    return await this.columnsService.deleteColumn(id);
  }
}
