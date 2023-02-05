/* eslint-disable prettier/prettier */
import { HttpException } from '@nestjs/common';

export class ExpiredException extends HttpException {
  constructor() {
    super('Expired JWT', 445);
  }
}
