import { Request, Response, Router } from 'express';

const justifyController = Router();

justifyController.route('/').post(function (req: Request, res: Response) {
  //
});

export default justifyController;
