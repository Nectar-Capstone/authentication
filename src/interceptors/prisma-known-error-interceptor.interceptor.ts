import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { catchError, Observable } from 'rxjs';

@Injectable()
export class PrismaKnownErrorInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next.handle().pipe(
      catchError((e) => {
        if (e instanceof PrismaClientKnownRequestError) {
          switch (e.code) {
            case 'P2025':
              throw new NotFoundException(`Entity with the given identifier could not be found`);

            case 'P2003':
              throw new BadRequestException(
                `An entity referenced by the '${(e.meta as any)?.field_name}' identifier does not exist.`,
              );
            case 'P2002':
              throw new BadRequestException(`Duplicate entry on unqiue field. Field: ${(e.meta as any)?.field_name}`);
            default:
              break;
          }
        }

        throw e;
      }),
    );
  }
}
