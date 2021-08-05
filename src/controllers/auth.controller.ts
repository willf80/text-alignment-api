import { Request, Response, Router } from 'express';
import Container from 'typedi';
import { LoginForm } from '../core/request-data/login.form';
import { RegisterForm } from '../core/request-data/register.form';
import { AuthService } from '../core/services/auth.service';

const authController = Router();

authController
  .route('/register')
  .post(async function (req: Request, res: Response) {
    const registerForm = req.body as RegisterForm;
    // TODO: Valider les données reçues

    const authService = Container.get(AuthService);

    const response = await authService.register(registerForm);
    if (response.error) {
      return res
        .status(response.httpCode)
        .json({ message: response.error.message });
    }

    res.json(response.data);
  });

authController
  .route('/token')
  .post(async function (req: Request, res: Response) {
    const loginForm = req.body as LoginForm;
    // TODO: Valider les données reçues

    const authService = Container.get(AuthService);

    const response = await authService.generateToken(loginForm);
    if (response.error) {
      return res
        .status(response.httpCode)
        .json({ message: response.error.message });
    }

    res.json(response.data);
  });

export default authController;
