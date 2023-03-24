export interface BaseConfigInterface {
  appScope?: string;
  host?: string;
  port?: number;
  loadersTimeout?: number;
}

export interface FlightProviderInterface {
  parser: string;
  url: string;
  ttl: number;
}

export interface FlightsProvidersConfigInterface {
  flightsProviders: FlightProviderInterface[];
}
