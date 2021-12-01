import { Request } from 'express';
import { UserEntity } from '../users/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export type ExpressRequest = Request & { user?: UserEntity };

export class User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  about: string;
}

export class Column {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  user: User;
}

export class Card {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  column: Column;
}

export class Comment {
  @ApiProperty()
  id: number;

  @ApiProperty()
  body: string;

  @ApiProperty()
  card: Card;

  @ApiProperty()
  author: User;
}
