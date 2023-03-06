export interface BaseConfigInterface {
  host?: string;
  port?: number;
  loadersTimeout?: number;
}

export interface CacheConfigInterface {
  cacheHost?: string;
  cachePort?: number;
}

export interface FlightProviderInterface {
  parser: string;
  url: string;
  ttl: number;
}

export interface FlightsProvidersConfigInterface {
  flightsProviders: FlightProviderInterface[];
}
