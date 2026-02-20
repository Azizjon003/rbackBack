import { Router } from 'express';

import authMiddleware from '@src/middleware/authMiddleware';

import AuthController from './auth.controller';

const authRouter = Router();

authRouter.post('/login', AuthController.login);
authRouter.post('/register', AuthController.register);
authRouter.get('/me', authMiddleware, AuthController.me);

export default authRouter;
