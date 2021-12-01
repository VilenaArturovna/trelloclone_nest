import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ColumnEntity } from './column.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateColumnDto } from './dto/create-column.dto';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(ColumnEntity)
    private readonly columnRepository: Repository<ColumnEntity>,
  ) {}

  async findAllColumns(userId): Promise<ColumnEntity[]> {
    return await this.columnRepository.find({
      where: { user: { id: userId } },
    });
  }

  async createColumn(
    user: UserEntity,
    createColumnDto: CreateColumnDto,
  ): Promise<ColumnEntity> {
    const newColumn = new ColumnEntity();
    Object.assign(newColumn, createColumnDto);
    newColumn.user = user;
    return await this.columnRepository.save(newColumn);
  }

  async findColumn(columnId: number): Promise<ColumnEntity> {
    const column = await this.columnRepository.findOne(columnId);
    if (!column) {
      throw new HttpException('Column does not exist', HttpStatus.NOT_FOUND);
    }
    return column;
  }

  async updateColumn(
    id: number,
    createColumnDto: CreateColumnDto,
  ): Promise<ColumnEntity> {
    const column = await this.findColumn(id);

    Object.assign(column, createColumnDto);
    return await this.columnRepository.save(column);
  }

  async deleteColumn(id: number): Promise<DeleteResult> {
    return await this.columnRepository.delete({ id });
  }
}
