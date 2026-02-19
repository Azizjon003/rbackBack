/******************************************************************************
                                 Constants
******************************************************************************/

// NOTE: These need to match the names of your ".env" files
export const NodeEnvs = {
  DEV: 'development',
  TEST: 'test',
  PRODUCTION: 'production',
} as const;

/******************************************************************************
                                 Setup
******************************************************************************/

/* eslint-disable no-process-env */
const EnvVars = {
  NodeEnv: (process.env.NODE_ENV ??
    NodeEnvs.DEV) as (typeof NodeEnvs)[keyof typeof NodeEnvs],
  Port: Number(process.env.PORT ?? 3000),
  Jwt: {
    Secret: process.env.JWT_SECRET ?? '',
  },
};
/* eslint-enable no-process-env */

/******************************************************************************
                            Export default
******************************************************************************/

export default EnvVars;
