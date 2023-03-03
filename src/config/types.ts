export interface BaseConfigInterface {
  host?: string;
  port?: number;
}

export interface CacheConfigInterface {
  cacheHost?: string;
  cachePort?: number;
}

export interface FlightProviderInterface {
  parser: string;
  url: string;
}

export interface FlightsProvidersConfigInterface {
  flightsProviders: FlightProviderInterface[];
}
