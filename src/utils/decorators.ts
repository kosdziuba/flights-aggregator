import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { Expose } from 'class-transformer';
import { decamelize } from 'fast-case';

// automatically formats swagger response example keys to snake_case
export function SCApiProperty(options?: ApiPropertyOptions): PropertyDecorator {
  return function (target: () => unknown, propertyKey: string): void {
    ApiProperty({ ...options, name: decamelize(propertyKey) })(target, propertyKey);
    Expose()(target, propertyKey);
  };
}
