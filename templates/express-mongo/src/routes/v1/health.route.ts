import { Router } from 'express';
import { ApiResponse } from '../../utils/apiResponse';

const HealthRouter = Router();

HealthRouter.get('/', (req, res) => {
  return res.status(200).json(new ApiResponse(200, null, 'Service is healthy'));
});

export default HealthRouter;
