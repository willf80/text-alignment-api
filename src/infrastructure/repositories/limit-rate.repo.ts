import { Op } from 'sequelize';
import { Service } from 'typedi';
import { LimitRate } from '../../core/models/limit-rate.entity';
import { AppDbContext } from '../data-access/app-db-context';

@Service()
export class LimitRateRepository {
  constructor(private readonly app: AppDbContext) {}

  public async create(email: string): Promise<LimitRate | null> {
    return this.app.context.limitRate.create({
      email,
      totalWords: 0,
    });
  }

  public async updateTotalWords(
    email: string,
    totalWords: number,
  ): Promise<[number, LimitRate[]]> {
    const [today, nexDay] = this.getTodayDateRange();

    const limitRateCreated = await this.app.context.limitRate.update(
      {
        totalWords,
      },
      {
        where: {
          email,
          rateDate: {
            [Op.between]: [today, nexDay],
          },
        },
      },
    );
    return limitRateCreated;
  }

  public async findTodayRate(email: string): Promise<LimitRate | null> {
    const [today, nexDay] = this.getTodayDateRange();

    return this.app.context.limitRate.findOne({
      where: {
        email,
        rateDate: {
          [Op.between]: [today, nexDay],
        },
      },
    });
  }

  private getTodayDateRange() {
    const [today] = new Date().toISOString().split('T');
    const nextDate = new Date(today);
    nextDate.setDate(nextDate.getDate() + 1);
    const [nextDay] = nextDate.toISOString().split('T');

    return [today, nextDay];
  }
}
