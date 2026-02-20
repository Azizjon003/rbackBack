export const NodeEnvs = {
  DEV: 'development',
  TEST: 'test',
  PRODUCTION: 'production',
} as const;

const EnvVars = {
  NodeEnv: (process.env.NODE_ENV ??
    NodeEnvs.DEV) as (typeof NodeEnvs)[keyof typeof NodeEnvs],
  Port: Number(process.env.PORT ?? 3000),
  Jwt: {
    Secret: process.env.JWT_SECRET ?? '',
  },
};

export default EnvVars;
