import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { map, Observable } from 'rxjs';
import { PaginatedDto } from '../globalDtos/paginated.dto';

@Injectable()
export class PaginatedResultsInterceptor implements NestInterceptor<any, PaginatedDto<any>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<PaginatedDto<any>> | Promise<Observable<PaginatedDto<any>>> {
    const { page } = context.switchToHttp().getRequest<Request>().query;

    return next.handle().pipe(
      map<any, PaginatedDto<any>>((results) => {
        const isArray = Array.isArray(results);

        return {
          total: isArray ? results.length : 1,
          page: page ? Number(page) : 1,
          results: isArray ? results : [results],
        };
      }),
    );
  }
}
