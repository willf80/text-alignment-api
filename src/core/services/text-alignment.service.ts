import { Service } from 'typedi';
import { ApiResponse } from '../../common/api-response';
import {
  HttpStatusCode,
  HttpStatusReason
} from '../../common/http-status-code.constant';
import { LimitRateRepository } from '../../infrastructure/repositories/limit-rate.repo';
import { TextOptions } from '../utils/text-options.enum';
import { TextWrapper } from '../utils/text-wrapper.util';

@Service()
export class TextAlignmentService {
  private readonly maxLength = TextOptions.MaxLength;
  private readonly limitRateMax = 80_000;

  constructor(private readonly limitRateRepo: LimitRateRepository) {}

  public async justify(email: string, text: string): Promise<ApiResponse> {
    const errorMessage = `Une erreur s'est produite pendant le traitement, merci de réessayer plus tard`;

    let limitRate = await this.limitRateRepo.findTodayRate(email);
    if (!limitRate) {
      // Une nouvelle journée commence
      limitRate = await this.limitRateRepo.create(email);
    }

    if (!limitRate) {
      return ApiResponse.withError(new Error(errorMessage));
    }

    const totalWordsOfText = this.countWords(text);

    if (limitRate.totalWords + totalWordsOfText > this.limitRateMax) {
      return ApiResponse.withError(
        new Error(HttpStatusReason.get(HttpStatusCode.PAYMENT_REQUIRED)),
        null,
        HttpStatusCode.PAYMENT_REQUIRED,
      );
    }

    const jusitfiedText = this.justifyText(text);

    const [totalLineAffected] = await this.limitRateRepo.updateTotalWords(
      email,
      limitRate.totalWords + totalWordsOfText,
    );
    if (totalLineAffected) {
      return ApiResponse.withSuccess(jusitfiedText);
    }

    return ApiResponse.withError(new Error(errorMessage));
  }

  private justifyText(text: string) {
    const textWrapped = TextWrapper.wrap(text, this.maxLength);

    const jusitfiedText = textWrapped
      .split(`\n`)
      .map((line, i, lines) =>
        this.canJustify(line, i, lines) ? line : this.justifyLine(line),
      )
      .join('\n');
    return jusitfiedText;
  }

  private countWords(text: string): number {
    return text
      .split('\n')
      .filter((t) => t)
      .reduce((count, line) => {
        count += line
          .trim()
          .split(` `)
          .filter((word) => word)
          .map((word) => word.trim()).length;
        return count;
      }, 0);
  }

  private canJustify(line: string, index: number, lines: string[]): boolean {
    return line.length === this.maxLength || index + 1 === lines.length;
  }

  private justifyLine(text: string): string {
    const words = text.split(` `);

    const totalCharactersWithoutSpace = words.join('').length;
    const spreadSpace = this.maxLength - totalCharactersWithoutSpace;
    const spaceBetweenWords = words.length - 1;

    const averageSpaceBetweenWords = Math.trunc(
      spreadSpace / spaceBetweenWords,
    );

    const defaultSpaceAdjustment = averageSpaceBetweenWords * spaceBetweenWords;
    const moreSpaceIndex =
      spaceBetweenWords - (spreadSpace - defaultSpaceAdjustment);

    let jusitfiedText = words[0];
    for (let i = 1; i <= spaceBetweenWords; i++) {
      const moreSpace = i > moreSpaceIndex ? 1 : 0;
      jusitfiedText +=
        ' '.repeat(averageSpaceBetweenWords + moreSpace) + words[i];
    }

    return jusitfiedText;
  }
}
