import { Module } from '@nestjs/common';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnEntity } from './column.entity';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/user.entity';

@Module({
  controllers: [ColumnsController],
  providers: [ColumnsService, UsersService],
  imports: [TypeOrmModule.forFeature([ColumnEntity, UserEntity])],
  exports: [ColumnsService],
})
export class ColumnsModule {}
