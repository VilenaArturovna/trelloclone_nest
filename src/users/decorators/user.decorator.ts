import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExpressRequest } from '../../types/types';

export const User = createParamDecorator(
  (id: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<ExpressRequest>();

    if (!request.user) {
      return null;
    }

    if (id) {
      return request.user[id];
    }

    return request.user;
  },
);
