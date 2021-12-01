import { UserEntity } from './user.entity';

export type UserResponse = Omit<UserEntity, 'hashPassword'> & { token: string };
