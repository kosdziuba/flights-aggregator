import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

import { FlightsProvidersConfigInterface } from './types';

const CONFIG_FILENAME =
  process.env.FLIGHTS_PROVIDERS_CONFIG_PATH || join(__dirname, '../flights-providers-config.yaml');

export const flightsProviders = (): FlightsProvidersConfigInterface => {
  return yaml.load(readFileSync(CONFIG_FILENAME, 'utf8')) as FlightsProvidersConfigInterface;
};
