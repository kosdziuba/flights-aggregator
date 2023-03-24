import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { FlightsService } from '@providers/flights';

import { GetFlightsResponseType } from './types';

@ApiTags('flights')
@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get()
  @ApiOkResponse({
    description: 'Returns a list of available flights',
    type: GetFlightsResponseType,
  })
  async findAll(): Promise<GetFlightsResponseType> {
    const flights = await this.flightsService.getFlights();
    return plainToClass(
      GetFlightsResponseType,
      { data: flights, total: flights.length },
      {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      },
    );
  }
}
