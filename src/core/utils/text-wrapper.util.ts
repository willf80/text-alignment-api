import { TextOptions } from './text-options.enum';

export class TextWrapper {
  public static wrap(text: string, maxLine: number): string {
    if (maxLine < TextOptions.MinLength) {
      throw new Error(
        `maxLine must be greater than or equal to ${TextOptions.MinLength}`,
      );
    }

    if (!text?.trim() || text.trim().length <= TextOptions.MaxLength) return text;

    const lines = TextWrapper.splitPerNewLine(text);
    const words = lines.map((line) =>
      line.length <= TextOptions.MaxLength
        ? line.trim()
        : TextWrapper.wrapInContainer(line).trim(),
    );

    return words.join(`\n`);
  }

  private static wrapInContainer(line: string): string {
    const lineWords = line
      .split(` `)
      .map((w) => w.trim())
      .filter((word) => word);

    let start = 0;
    let wrapContent = '';
    for (let end = 1; end <= lineWords.length; end++) {
      const chunk = lineWords.slice(start, end).join(' ').length;
      if (chunk > TextOptions.MaxLength) {
        wrapContent += lineWords.slice(start, end - 1).join(' ') + '\n';
        start = end - 1;
      }
    }

    return wrapContent + lineWords.slice(start).join(' ');
  }

  private static splitPerNewLine(text: string): string[] {
    return text
      .trim()
      .split(`\n`)
      .map((t) => t.trim());
  }
}
