import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class AuthUserDto extends OmitType(CreateUserDto, [
  'username',
] as const) {}
