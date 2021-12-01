import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { CardEntity } from '../cards/card.entity';
import { CardsService } from '../cards/cards.service';
import { ColumnEntity } from '../columns/column.entity';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/user.entity';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, CardsService, UsersService],
  imports: [
    TypeOrmModule.forFeature([
      CommentEntity,
      CardEntity,
      UserEntity,
      ColumnEntity,
    ]),
  ],
})
export class CommentsModule {}
