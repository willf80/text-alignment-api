import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { ApiResponse } from '../../common/api-response';
import { HttpStatusCode } from '../../common/http-status-code.constant';
import { Token } from '../../core/models/token.model';
import { UserRepository } from '../../infrastructure/repositories/user.repo';
import { LoginForm } from '../request-data/login.form';
import { RegisterForm } from '../request-data/register.form';

@Service()
export class AuthService {
  constructor(private readonly userRepo: UserRepository) {}

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

    await this.userRepo.create({
      email: registerForm.email,
      password: passwordCrypted,
    });

    return ApiResponse.withSuccess({
      message: `Utilisateur créé avec succès !`,
    });
  }

  public async generateToken({
    email,
    password,
  }: LoginForm): Promise<ApiResponse> {
    const errorMessage = `Email ou mot de passe incorrect`;

    const user = await this.userRepo.findOne(email);
    if (!user) {
      return ApiResponse.withError(
        new Error(errorMessage),
        null,
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    // Comparer les mots de passes
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return ApiResponse.withError(
        new Error(errorMessage),
        null,
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    return ApiResponse.withSuccess(this.generateJwtToken(user.email));
  }

  private generateJwtToken(email: string): Token {
    const jwtSecret = `${process.env.JWT_SECRET}`;
    const accessToken = jwt.sign({ email }, jwtSecret, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      expiresIn: 604800, // 7 * 24 * 60 * 60,
    };
  }
}
