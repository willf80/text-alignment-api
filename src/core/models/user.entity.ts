import { DataTypes, Model, Sequelize } from 'sequelize';

export interface UserAttributes {
  email: string;
  password: string;
}

export class User extends Model<UserAttributes> implements UserAttributes {
  email!: string;
  password!: string;
}

export function UserBuilder(sequelize: Sequelize): typeof User {
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
    },
    {
      sequelize,
      tableName: 'users',
      underscored: true,
    },
  );

  return User;
}
