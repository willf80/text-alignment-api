import { DataTypes, Model, Sequelize } from 'sequelize';

export interface LimitRateAttributes {
  email: string;
  totalWords: number;
  rateDate?: Date;
}

export class LimitRate
  extends Model<LimitRateAttributes>
  implements LimitRateAttributes
{
  email!: string;
  totalWords!: number;
}

export function LimitRateBuilder(sequelize: Sequelize): typeof LimitRate {
  LimitRate.init(
    {
      email: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      totalWords: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
      },
      rateDate: {
        type: DataTypes.DATEONLY,
        primaryKey: true,
        defaultValue: new Date()
      },
    },
    {
      sequelize,
      tableName: 'limit_rates',
      underscored: true,
    },
  );

  return LimitRate;
}
