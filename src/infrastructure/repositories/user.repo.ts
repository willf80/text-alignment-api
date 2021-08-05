import { Service } from 'typedi';
import { User, UserAttributes } from '../../core/models/user.entity';
import { AppDbContext } from '../data-access/app-db-context';

@Service()
export class UserRepository {
  constructor(private readonly app: AppDbContext) {}

  public async create(user: UserAttributes): Promise<User> {
    const userCreated = await this.app.context.user.create(user);
    return userCreated;
  }

  public async findOne(email: string): Promise<User | null> {
    return this.app.context.user.findOne({
      where: { email },
    });
  }
}
