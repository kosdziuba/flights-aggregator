import { ApiProperty } from '@nestjs/swagger';

export class GetFlightsResponseType {
  @ApiProperty()
  data: object;

  @ApiProperty()
  count: number;
}
