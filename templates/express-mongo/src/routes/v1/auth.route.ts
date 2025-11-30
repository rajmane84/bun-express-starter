import Router from 'express';

const AuthRouter = Router();

AuthRouter.post('/sign-in', () => {});
AuthRouter.post('/sign-up', () => {});
AuthRouter.patch('/change-password', () => {});
AuthRouter.patch('/forgot-password', () => {});

export default AuthRouter;
