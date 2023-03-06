import * as process from 'process';

import { BaseConfigInterface } from './types';

export const base = (): BaseConfigInterface => ({
  host: process.env.HOST || 'localhost',
  port: parseInt(process.env.PORT) || 3000,
  loadersTimeout: parseInt(process.env.LOADERS_TIMEOUT) || 0,
});
