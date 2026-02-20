import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import EnvVars, { NodeEnvs } from '@src/common/constants/env';
import errorHandler from '@src/middleware/errorHandler';
import apiRouter from '@src/routes/index';

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.DEV) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.PRODUCTION) {
  // eslint-disable-next-line no-process-env
  if (!process.env.DISABLE_HELMET) {
    app.use(helmet());
  }
}

// API routes
app.use('/api', apiRouter);

// Error handler
app.use(errorHandler);

export default app;
