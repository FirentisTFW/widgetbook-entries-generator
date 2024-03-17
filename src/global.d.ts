declare global {
  interface String {
    includesAll(text: Array<string>): boolean;

    removeTrailing(charactersCount: number): string;

    sortLines(): string;

    substringAfter(text: string): string;

    substringBetween(start: string, end: string): string;

    substringUpTo(text: string): string;

    substringUpToAndIncluding(text: string): string;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Array<T> {
    whereNotNull(): Array<T>;

    whereType<T>(): Array<T>;
  }
}

export {};
