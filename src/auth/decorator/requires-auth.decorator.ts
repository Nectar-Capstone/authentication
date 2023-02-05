import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { User_Type } from 'src/auth/enums/user_type.enum';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { UserTypeGuard } from '../guards/user_type.guard';

export const USER_TYPE_KEY = 'user_type';
export const RequiresAuth = (...user_types: User_Type[]) =>
  applyDecorators(UseGuards(JwtAuthGuard, UserTypeGuard), SetMetadata(USER_TYPE_KEY, user_types));
