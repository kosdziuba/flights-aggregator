import * as process from 'process';

import { BaseConfigInterface } from './types';

export const APP_SCOPES = {
  API: 'api',
  TASKS: 'tasks',
};

export const base = (): BaseConfigInterface => ({
  appScope: process.env.APP_SCOPE || APP_SCOPES.API,
  host: process.env.HOST || 'localhost',
  port: parseInt(process.env.PORT) || 3000,
  loadersTimeout: parseInt(process.env.LOADERS_TIMEOUT) || 0,
});
