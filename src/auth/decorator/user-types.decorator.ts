/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
import { User_Type } from '../enums/user_type.enum';

export const USER_TYPE_KEY = 'user_type';
export const UserTypes = (...user_types: User_Type[]) => SetMetadata(USER_TYPE_KEY, user_types);
