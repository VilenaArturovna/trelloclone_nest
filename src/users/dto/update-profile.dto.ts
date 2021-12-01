import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateProfileDto extends PickType(CreateUserDto, [
  'username',
] as const) {
  @ApiPropertyOptional({ type: String })
  readonly about: string;
}
