import { TextOptions } from './text-options.enum';

export class TextWrapper {

  public static wrap(text: string, maxLine: number): string {
    if (maxLine < TextOptions.MinLine) {
      throw new Error(
        `maxLine must be greater than or equal to ${TextOptions.MinLine}`,
      );
    }
  
    if (!text?.trim() || text.trim().length <= TextOptions.MaxLine) return text;
  
    const lines = this.splitText(text);
  
    const words = lines.map((line) => {
      if (line.length <= TextOptions.MaxLine) {
        return line;
      }
  
      const lineWords = line.split(` `).map(w => w.trim()).filter((word) => word);
      let start = 0;
      let wrapContent = '';
      for (let end = 1; end <= lineWords.length; end++) {
          const chunk = lineWords.slice(start, end).join(' ').length;
          if (chunk > TextOptions.MaxLine) {
            wrapContent += lineWords.slice(start, end-1).join(' ') + '\n';
            start = end - 1;
          }
      }
  
      return wrapContent + lineWords.slice(start).join(' ');
    }).map(line => line.trim());
  
    return words.join(`\n`);
  }

  private static splitText(text: string): string[] {
    return text
    .trim()
    .split(`\n`)
    .map((t) => t.trim());
  }
}

