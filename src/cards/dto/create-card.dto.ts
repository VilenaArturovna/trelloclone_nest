import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCardDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @ApiProperty()
  readonly title: string;

  @ApiPropertyOptional()
  readonly description: string;
}
