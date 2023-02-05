import { applyDecorators, Type, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponseOptions, getSchemaPath } from '@nestjs/swagger';
import { PaginatedDto } from '../globalDtos/paginated.dto';
import { PaginatedResultsInterceptor } from 'src/interceptors/paginated-results-interceptor.interceptor';

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel, options?: ApiResponseOptions) => {
  return applyDecorators(
    ApiOkResponse({
      ...options,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
    UseInterceptors(PaginatedResultsInterceptor),
    ApiOperation({
      description:
        'Get paginated results. <br> Advanced filters guide: <br> for integer keys -> use /?id=xx&shopId=xx <br> for string keys -> use /?name=.... the search operation is always startsWith <br> for advanced operations -> use (for nested search) /?filter[keyname:subkeyName:operand]=value or array, or use(for 1-level string operations) /?filter[keyName:operand]=... <br> ex. /?filter[product_entries:id:in]=[1,2,3]  or /?filter[name:contains]=kluayob ',
    }),
  );
};
