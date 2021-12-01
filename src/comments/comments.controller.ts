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
import { AuthGuard, UserIsUserGuard } from '../users/guards';
import { CommentsService } from './comments.service';
import { CardsService } from '../cards/cards.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentEntity } from './comment.entity';
import { UsersService } from '../users/users.service';
import { DeleteResult } from 'typeorm';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Comment } from '../types/types';

@Controller('users/:userId/columns/:columnId/cards/:cardId/comments')
@ApiTags('Comments')
@UseGuards(AuthGuard, UserIsUserGuard)
@ApiForbiddenResponse({ description: 'Forbidden' })
@ApiNotFoundResponse()
@ApiBearerAuth()
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly cardsService: CardsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async findAllComments(
    @Param() params: { columnId: number; cardId: number },
  ): Promise<CommentEntity[]> {
    await this.cardsService.findCard(params.cardId, params.columnId);
    return await this.commentsService.findAllComments(params.cardId);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: CreateCommentDto })
  @ApiCreatedResponse({
    description: 'The record has been successfully created',
    type: Comment,
  })
  async createComment(
    @Param() params: { userId: number; columnId: number; cardId: number },
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    const card = await this.cardsService.findCard(
      params.cardId,
      params.columnId,
    );
    const user = await this.usersService.findById(params.userId);
    return await this.commentsService.createComment(
      user,
      card,
      createCommentDto,
    );
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: CreateCommentDto })
  @ApiCreatedResponse({
    description: 'The record has been successfully created',
    type: Comment,
  })
  async changeComment(
    @Param() params: { columnId: number; cardId: number; id: number },
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    await this.cardsService.findCard(params.cardId, params.columnId);
    return await this.commentsService.changeComment(
      params.cardId,
      params.id,
      createCommentDto,
    );
  }

  @Delete(':id')
  async deleteComment(
    @Param() params: { columnId: number; cardId: number; id: number },
  ): Promise<DeleteResult> {
    await this.cardsService.findCard(params.cardId, params.columnId);
    return await this.commentsService.deleteComment(params.cardId, params.id);
  }
}
