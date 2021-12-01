import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserEntity } from '../users/user.entity';
import { CardEntity } from '../cards/card.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,
  ) {}

  async findAllComments(cardId: number): Promise<CommentEntity[]> {
    return await this.commentsRepository.find({
      where: { card: { id: cardId } },
    });
  }

  async createComment(
    user: UserEntity,
    card: CardEntity,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    const newComment = new CommentEntity();
    Object.assign(newComment, createCommentDto);
    newComment.card = card;
    newComment.author = user;
    return await this.commentsRepository.save(newComment);
  }

  async findComment(cardId: number, id: number): Promise<CommentEntity> {
    const comment = await this.commentsRepository.findOne(id, {
      relations: ['card'],
    });
    if (!comment || comment.card.id !== +cardId) {
      throw new HttpException('Comment does not exist', HttpStatus.NOT_FOUND);
    }
    return comment;
  }

  async changeComment(
    cardId: number,
    id: number,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    const comment = await this.findComment(cardId, id);
    Object.assign(comment, createCommentDto);
    return comment;
  }

  async deleteComment(cardId: number, id: number): Promise<DeleteResult> {
    await this.findComment(cardId, id);
    return this.commentsRepository.delete(id);
  }
}
