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
