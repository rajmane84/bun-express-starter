import { Router } from 'express';
import UserRouter from './user.route';
import AuthRouter from './auth.route';
import HealthRouter from './health.route';

const V1Router = Router();

V1Router.use('/user', UserRouter);
V1Router.use('/auth', AuthRouter);
V1Router.use('/health-check', HealthRouter);

export default V1Router;
