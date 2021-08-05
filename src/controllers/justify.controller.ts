import { Request, Response, Router } from 'express';
import Container from 'typedi';
import { HeaderContentType } from '../common/header-content-type.enum';
import { TextAlignmentService } from '../core/services/text-alignment.service';

const justifyController = Router();

justifyController.route('/').post(function (req: Request, res: Response) {
  const text = req.body as string;
  const textAlignmentService = Container.get(TextAlignmentService);
  const textJustify = textAlignmentService.justify(text);

  res.setHeader('content-type', HeaderContentType.PlainText);
  res.send(textJustify);
});

export default justifyController;
