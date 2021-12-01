import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserResponse } from './users.types';
import { UserEntity } from './user.entity';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { compare } from 'bcrypt';
import { AuthUserDto, CreateUserDto, UpdateProfileDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    const userByUsername = await this.userRepository.findOne({
      username: createUserDto.username,
    });

    if (userByEmail) {
      throw new HttpException('email is taken', HttpStatus.FORBIDDEN);
    }
    if (userByUsername) {
      throw new HttpException('username is taken', HttpStatus.FORBIDDEN);
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  async signIn(authUserDto: AuthUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne(
      { email: authUserDto.email },
      { select: ['id', 'email', 'username', 'about', 'password'] },
    );

    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordCorrect = await compare(
      authUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException('password is not valid', HttpStatus.FORBIDDEN);
    }

    delete user.password;

    return user;
  }

  async findById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne(id);
  }

  async getUser(id: number): Promise<UserEntity> {
    const user = await this.findById(id);

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    delete user.password;

    return user;
  }

  async updateProfile(
    id: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserEntity> {
    const user = await this.findById(id);

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    Object.assign(user, updateProfileDto);
    return await this.userRepository.save(user);
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
    );
  }

  buildUserResponse(user: UserEntity): UserResponse {
    return {
      ...user,
      token: this.generateJwt(user),
    };
  }
}
