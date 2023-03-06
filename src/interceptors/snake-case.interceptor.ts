import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { decamelizeKeys } from 'fast-case';
import { map, Observable } from 'rxjs';

export interface Response<T> {
  data: T;
}

@Injectable()
export class SnakeCaseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => decamelizeKeys(data)));
  }
}
