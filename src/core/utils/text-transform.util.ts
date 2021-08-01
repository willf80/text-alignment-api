import { TextOptions } from "./text-options.enum";

export function wrapText(text: string, maxLine: number): string {
  if (maxLine < TextOptions.MinLine) {
    throw new Error(`maxLine must be greater than or equal to ${TextOptions.MinLine}`);
  }

  if (!text?.trim()) {
    return text;
  }

  return '';
}