import bcrypt from 'bcrypt';
import { HttpStatusCode } from '../../../src/common/http-status-code.constant';
import { User } from '../../../src/core/models/user.entity';
import { LoginForm } from '../../../src/core/request-data/login.form';
import { RegisterForm } from '../../../src/core/request-data/register.form';
import { AuthService } from '../../../src/core/services/auth.service';
import { AppDbContext } from '../../../src/infrastructure/data-access/app-db-context';
import { UserRepository } from '../../../src/infrastructure/repositories/user.repo';

describe(AuthService.name, () => {
  let authService: AuthService;
  const AppDbContextMock = <jest.Mock<AppDbContext>>AppDbContext;
  const userRepo = new UserRepository(new AppDbContextMock());
  beforeEach(() => jest.clearAllMocks());

  describe(`quand on appelle ${AuthService.name}.register()`, () => {
    describe(`et que l'utilisateur est déjà inscrit`, () => {
      beforeEach(() => {
        const user: Partial<User> = {};
        jest.spyOn(userRepo, 'findOne').mockResolvedValue(user as User);

        authService = new AuthService(userRepo);
      });

      it(`devrait retourner un message d'erreur`, async () => {
        const registerForm: RegisterForm = {
          email: 'willyfkouadio@gmail.com',
          password: 'tictac3',
        };

        const response = await authService.register(registerForm);
        const message = response?.error?.message;
        expect(message).toBe(`Utilisateur déjà inscrit.`);
      });
    });

    describe(`et que le mot de passe fait moins de 6 caractères`, () => {
      beforeEach(() => {
        jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
        authService = new AuthService(userRepo);
      });

      it(`devrait retourner un message d'erreur`, async () => {
        const registerForm: RegisterForm = {
          email: 'willyfkouadio@gmail.com',
          password: 'tic',
        };

        const response = await authService.register(registerForm);
        const message = response?.error?.message;
        expect(message).toBe(
          `Le mot de passe doit être d'au moins 6 caractères`,
        );
      });
    });

    describe(`et que les données sont valides`, () => {
      beforeEach(() => {
        const user: Partial<User> = {};
        jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
        jest.spyOn(userRepo, 'create').mockResolvedValue(user as User);
        authService = new AuthService(userRepo);
      });

      it(`devrait retourner un message de succès`, async () => {
        const registerForm: RegisterForm = {
          email: 'willyfkouadio@gmail.com',
          password: 'tictac3',
        };

        const response = await authService.register(registerForm);
        expect(response.data).toStrictEqual({
          message: `Utilisateur créé avec succès !`,
        });
      });
    });
  });

  describe(`quand on appelle ${AuthService.name}.generateToken()`, () => {
    describe(`et que l'email n'est pas valide`, () => {
      beforeEach(() => {
        jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
        authService = new AuthService(userRepo);
      });

      it(`devrait retourner une erreur 401`, async () => {
        const stubLogin: LoginForm = {
          email: 'willyfkouadio@gmail.com',
          password: 'tictac3',
        };

        const response = await authService.generateToken(stubLogin);
        const message = response?.error?.message;
        expect(response.httpCode).toBe(HttpStatusCode.UNAUTHORIZED);
        expect(message).toBe('Email ou mot de passe incorrect');
      });
    });

    describe(`et que le mot de passe n'est pas valide`, () => {
      beforeEach(() => {
        const user: Partial<User> = {};
        jest.spyOn(userRepo, 'findOne').mockResolvedValue(user as User);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
        authService = new AuthService(userRepo);
      });

      it(`devrait retourner une erreur 401`, async () => {
        const stubLogin: LoginForm = {
          email: 'willyfkouadio@gmail.com',
          password: 'tictac3',
        };

        const response = await authService.generateToken(stubLogin);
        const message = response?.error?.message;
        expect(response.httpCode).toBe(HttpStatusCode.UNAUTHORIZED);
        expect(message).toBe('Email ou mot de passe incorrect');
      });
    });

    describe(`et que entrées sont valides`, () => {
      beforeEach(() => {
        const user: Partial<User> = { email: 'willyfkouadio@gmail.com' };
        jest.spyOn(userRepo, 'findOne').mockResolvedValue(user as User);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
        authService = new AuthService(userRepo);
      });

      it(`devrait retourner le token`, async () => {
        const stubLogin: LoginForm = {
          email: 'willyfkouadio@gmail.com',
          password: 'tictac3',
        };

        const response = await authService.generateToken(stubLogin);
        expect(response.httpCode).toBe(HttpStatusCode.OK);
        const { expiresIn } = response.data as { expiresIn: number };
        expect(expiresIn).toBe(7 * 24 * 60 * 60);
      });
    });
  });
});
