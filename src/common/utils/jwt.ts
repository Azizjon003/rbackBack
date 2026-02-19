import jwt from 'jsonwebtoken';

import EnvVars from '@src/common/constants/env';

export interface JwtPayload {
  id: number;
}

const JWT_EXPIRATION = '24h';

function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, EnvVars.Jwt.Secret, {
    expiresIn: JWT_EXPIRATION,
  });
}

function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, EnvVars.Jwt.Secret) as JwtPayload;
}

export default {
  generateToken,
  verifyToken,
} as const;
