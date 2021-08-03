import { Service } from 'typedi';
import { TextOptions } from '../utils/text-options.enum';
import { TextWrapper } from '../utils/text-wrapper.util';

@Service()
export class TextAlignmentService {
  private readonly maxLength = TextOptions.MaxLength;

  public justify(text: string): string {
    const textWrapped = TextWrapper.wrap(text, this.maxLength);

    const jusitfiedText = textWrapped
      .split(`\n`)
      .map((line, i, lines) =>
        this.canJustify(line, i, lines) ? line : this.justifyLine(line),
      )
      .join('\n');

    return jusitfiedText;
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
