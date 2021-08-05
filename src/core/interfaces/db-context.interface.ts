import { Sequelize } from 'sequelize/types';
import { LimitRate } from '../models/limit-rate.entity';
import { User } from '../models/user.entity';

export interface DbContext {
  sequelize: Sequelize;
  user: typeof User;
  limitRate: typeof LimitRate;
}
