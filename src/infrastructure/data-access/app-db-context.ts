import { Sequelize } from 'sequelize';
import { Service } from 'typedi';
import { DbContext } from '../../core/interfaces/db-context.interface';
import { LimitRateBuilder } from '../../core/models/limit-rate.entity';
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
      storage: process.env.DB_NAME,
    });

    const user = UserBuilder(sequelize);
    const limitRate = LimitRateBuilder(sequelize);

    return {
      sequelize,
      user,
      limitRate,
    };
  }
}
