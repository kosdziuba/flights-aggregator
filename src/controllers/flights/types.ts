import { Type } from 'class-transformer';

import { SCApiProperty } from '@utils/decorators';

export class FlightInfoType {
  @SCApiProperty()
  originName: string;

  @SCApiProperty()
  destinationName: string;

  @SCApiProperty()
  departureDateTimeUtc: Date;

  @SCApiProperty()
  arrivalDateTimeUtc: Date;

  @SCApiProperty()
  flightNumber: string;

  @SCApiProperty()
  duration: number;
}

export class FlightsType {
  @SCApiProperty({ type: FlightInfoType })
  departingFlight: FlightInfoType;

  @SCApiProperty({ type: FlightInfoType })
  returnFlight: FlightInfoType;

  @SCApiProperty()
  price: number;
}

export class GetFlightsResponseType {
  @SCApiProperty({ type: [FlightsType] })
  @Type(() => FlightsType)
  data: FlightsType[];

  @SCApiProperty()
  total: number;
}
