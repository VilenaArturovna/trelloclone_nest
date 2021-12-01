import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserResponse } from './users.types';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity';
import { AuthUserDto, CreateUserDto, UpdateProfileDto } from './dto';
import { AuthGuard, UserIsUserGuard } from './guards';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../types/types';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sign-up')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse()
  async signUp(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    const user = await this.usersService.signUp(createUserDto);
    return this.usersService.buildUserResponse(user);
  }

  @Post('sign-in')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: AuthUserDto })
  @ApiCreatedResponse()
  async signIn(@Body() authUserDto: AuthUserDto): Promise<UserResponse> {
    const user = await this.usersService.signIn(authUserDto);
    return this.usersService.buildUserResponse(user);
  }

  @Get(':userId')
  @UseGuards(AuthGuard, UserIsUserGuard)
  @ApiCreatedResponse({
    description: 'The record has been successfully created',
    type: User,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBearerAuth()
  async getUser(@Param('userId') id: number): Promise<UserEntity> {
    return await this.usersService.getUser(id);
  }

  @Put(':userId')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard, UserIsUserGuard)
  @ApiBody({ type: UpdateProfileDto })
  @ApiCreatedResponse({
    description: 'The record has been successfully created',
    type: User,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBearerAuth()
  async updateProfile(
    @Param('userId') id: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UserEntity> {
    console.log(updateProfileDto);
    return await this.usersService.updateProfile(id, updateProfileDto);
  }
}
