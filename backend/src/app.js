import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { config } from './config/env.js';
import { router } from './routes/index.js';
import { errorHandler } from './utils/errors.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({
    origin: config.corsOrigin === '*' ? true : config.corsOrigin,
    exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Limit']
  }));
  app.use(express.json({ limit: '1mb' }));

  app.use(router);

  app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
  });

  app.use(errorHandler);
  return app;
}
