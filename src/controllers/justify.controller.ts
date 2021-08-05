import { Request, Response, Router } from 'express';
import Container from 'typedi';
import { HeaderContentType } from '../common/header-content-type.enum';
import { TextAlignmentService } from '../core/services/text-alignment.service';

const justifyController = Router();

justifyController.route('/').post(async function (req: Request, res: Response) {
  const text = req.body as string;
  const { email } = req.user as { email: string };

  const textAlignmentService = Container.get(TextAlignmentService);
  const response = await textAlignmentService.justify(email, text);
  if (response.error) {
    return res
      .status(response.httpCode)
      .json({ message: response.error.message });
  }

  res.setHeader('content-type', HeaderContentType.PlainText);
  res.send(response.data);
});

export default justifyController;
