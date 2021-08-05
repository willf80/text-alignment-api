import { Sequelize } from 'sequelize/types';
import { User } from '../models/user.entity';

export interface DbContext {
  sequelize: Sequelize;
  user: typeof User;
}
