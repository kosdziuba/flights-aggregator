import { HashTable } from '@utils/types';

export interface FlightInfoType {
  originName: string;
  destinationName: string;
  departureDateTimeUtc: Date;
  arrivalDateTimeUtc: Date;
  flightNumber: string;
  duration: number;
}

export interface ParsedFlightType {
  departingFlight: FlightInfoType;
  returnFlight: FlightInfoType;
  price: number;
}

export interface MakeFlightsMethodResultType {
  uid: string;
  flights: ParsedFlightType;
}

export interface BaseCachedFlightsType {
  data?: HashTable<ParsedFlightType>;
}

export interface CachedFlightsType extends BaseCachedFlightsType {
  etag?: string;
}
