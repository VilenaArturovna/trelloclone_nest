import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardEntity } from './card.entity';
import { ColumnEntity } from '../columns/column.entity';
import { ColumnsService } from '../columns/columns.service';

@Module({
  controllers: [CardsController],
  providers: [CardsService, ColumnsService],
  imports: [TypeOrmModule.forFeature([CardEntity, ColumnEntity])],
  exports: [CardsService],
})
export class CardsModule {}
