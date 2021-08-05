import { User } from '../../../src/core/models/user.entity';
import { RegisterForm } from '../../../src/core/request-data/register.form';
import { AuthService } from '../../../src/core/services/auth.service';
import { AppDbContext } from '../../../src/infrastructure/data-access/app-db-context';
import { UserRepository } from '../../../src/infrastructure/repositories/user.repo';

describe(`quand on appelle ${AuthService.name}.register()`, () => {
  let authService: AuthService;
  const AppDbContextMock = <jest.Mock<AppDbContext>>AppDbContext;
  const userRepo = new UserRepository(new AppDbContextMock());

  beforeEach(() => jest.clearAllMocks());

  describe(`et que l'utilisateur est déjà inscrit`, () => {
    beforeEach(() => {
      const user: Partial<User> = {};
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(user as User);

      authService = new AuthService(userRepo);
    });

    it(`devrait retourner un message d'erreur`, async () => {
      const stubLogin: RegisterForm = {
        email: 'willyfkouadio@gmail.com',
        password: 'tictac3',
      };

      const response = await authService.register(stubLogin);
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
      const stubLogin: RegisterForm = {
        email: 'willyfkouadio@gmail.com',
        password: 'tic',
      };

      const response = await authService.register(stubLogin);
      const message = response?.error?.message;
      expect(message).toBe(`Le mot de passe doit être d'au moins 6 caractères`);
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
      const stubLogin: RegisterForm = {
        email: 'willyfkouadio@gmail.com',
        password: 'tictac3',
      };

      const response = await authService.register(stubLogin);
      expect(response.data).toStrictEqual({
        message: `Utilisateur créé avec succès !`,
      });
    });
  });
});
