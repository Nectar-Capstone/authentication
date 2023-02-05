/* eslint-disable prettier/prettier */
import { applyDecorators } from '@nestjs/common';
import { ApiParam, ApiParamOptions } from '@nestjs/swagger';

export const ApiParamID = (options?: ApiParamOptions) =>
  applyDecorators(ApiParam({ name: 'id', ...options, type: 'number' }));
