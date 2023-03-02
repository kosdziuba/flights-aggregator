import { Injectable } from '@nestjs/common';
import { FlightsType } from './types';

@Injectable()
export class FlightsService {
  getFlights(): FlightsType {
    return { data: {}, count: 0 };
  }
}
