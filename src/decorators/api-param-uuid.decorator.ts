import { applyDecorators } from '@nestjs/common';
import { ApiParam, ApiParamOptions } from '@nestjs/swagger';

export const ApiParamUUID = (options?: ApiParamOptions) =>
  applyDecorators(ApiParam({ name: 'id', ...options, type: 'string' }));
