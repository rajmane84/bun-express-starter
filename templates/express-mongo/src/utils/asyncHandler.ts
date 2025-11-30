import { type Request, type Response, type NextFunction } from 'express';

export const asyncHandler = (
  requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<any> | void
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch(err => next(err));
  };
};
