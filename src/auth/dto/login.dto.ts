/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class LoginBodyDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
