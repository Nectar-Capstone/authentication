/* eslint-disable prettier/prettier */
import { HttpException } from '@nestjs/common';

export class ExpiredTooLongException extends HttpException {
  constructor() {
    super('Expired JWT for too long, can not refresh', 446);
  }
}
