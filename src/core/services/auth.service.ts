import bcrypt from 'bcrypt';
import { Service } from 'typedi';
import { ApiResponse } from '../../common/api-response';
import { UserRepository } from '../../infrastructure/repositories/user.repo';
import { LoginForm } from '../request-data/login.form';
import { RegisterForm } from '../request-data/register.form';

@Service()
export class AuthService {
  constructor(readonly userRepo: UserRepository) {}

  public async register(registerForm: RegisterForm): Promise<ApiResponse> {
    // Vérifier si l'utilisateur n'est pas déjà inscrit
    const userExisted = await this.userRepo.findOne(registerForm.email);

    if (userExisted) {
      return ApiResponse.withError(new Error(`Utilisateur déjà inscrit.`));
    }

    if (registerForm.password.length < 6) {
      return ApiResponse.withError(
        new Error(`Le mot de passe doit être d'au moins 6 caractères`),
      );
    }

    // Crypter le mot de passe
    const salt = await bcrypt.genSalt();
    const passwordCrypted = await bcrypt.hash(registerForm.password, salt);

    await this.userRepo.create({ email: registerForm.email, password: passwordCrypted });

    return ApiResponse.withSuccess({message: `Utilisateur créé avec succès !`});
  }

  public generateToken(loginForm: LoginForm): ApiResponse {
    return ApiResponse.withSuccess(null);
  }
}
