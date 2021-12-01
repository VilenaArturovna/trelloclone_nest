import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { CreateCardDto } from './create-card.dto';

export class UpdateCardDto extends PickType(CreateCardDto, [
  'title',
  'description',
] as const) {
  @ApiPropertyOptional()
  readonly columnId: number;
}
