import { Sequelize } from 'sequelize';
import { Service } from 'typedi';
import { DbContext } from '../../core/interfaces/db-context.interface';
import { UserBuilder } from '../../core/models/user.entity';

@Service()
export class AppDbContext {
  public readonly context: DbContext;

  public constructor() {
    this.context = this.initializeDb();
  }

  private initializeDb(): DbContext {
    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: 'tictactrip_justify.sqlite',
    });

    const user = UserBuilder(sequelize);

    return {
      sequelize,
      user
    };
  }
}
