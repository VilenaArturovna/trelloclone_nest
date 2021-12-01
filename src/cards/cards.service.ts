import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from './card.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateCardDto, UpdateCardDto } from './dto';
import { ColumnEntity } from '../columns/column.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardsRepository: Repository<CardEntity>,
    @InjectRepository(ColumnEntity)
    private readonly columnRepository: Repository<ColumnEntity>,
  ) {}

  async findCard(id: number, columnId: number): Promise<CardEntity> {
    const card = await this.cardsRepository.findOne(id, {
      relations: ['column'],
    });
    if (!card || card.column.id !== +columnId) {
      throw new HttpException('Card does not exist', HttpStatus.NOT_FOUND);
    }
    return card;
  }

  async findAllCards(columnId: number): Promise<CardEntity[]> {
    return await this.cardsRepository.find({
      where: { column: { id: columnId } },
    });
  }

  async createCard(
    column: ColumnEntity,
    createCardDto: CreateCardDto,
  ): Promise<CardEntity> {
    const newCard = new CardEntity();
    Object.assign(newCard, createCardDto);
    newCard.column = column;
    return await this.cardsRepository.save(newCard);
  }

  async getCard(id: number, columnId: number) {
    return await this.findCard(id, columnId);
  }

  async deleteCard(id: number, columnId: number): Promise<DeleteResult> {
    await this.findCard(id, columnId);
    return this.cardsRepository.delete(id);
  }

  async updateCard(
    id: number,
    columnId: number,
    updateCardDto: UpdateCardDto,
  ): Promise<CardEntity> {
    const card = await this.findCard(id, columnId);
    Object.assign(card, updateCardDto);
    return await this.cardsRepository.save(card);
  }
}
