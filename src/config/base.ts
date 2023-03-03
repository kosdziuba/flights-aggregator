import { BaseConfigInterface } from './types';

export const base = (): BaseConfigInterface => ({
  host: process.env.HOST || 'localhost',
  port: parseInt(process.env.PORT) || 3000,
});
