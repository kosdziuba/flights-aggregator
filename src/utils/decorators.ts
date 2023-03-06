import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { decamelize } from 'fast-case';

export function SCApiProperty(options?: ApiPropertyOptions): PropertyDecorator {
  return function (target: () => unknown, propertyKey: string): void {
    ApiProperty({ ...options, name: decamelize(propertyKey) })(target, propertyKey);
  };
}
