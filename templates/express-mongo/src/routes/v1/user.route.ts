import Router from 'express';

const UserRouter = Router();

UserRouter.get('/', () => {});
UserRouter.get('/:userId', () => {});
UserRouter.patch('/:userId', () => {});
UserRouter.delete('/:userId', () => {});

export default UserRouter;
