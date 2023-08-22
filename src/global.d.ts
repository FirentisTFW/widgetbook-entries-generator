declare global {
  interface String {
    includesAll(text: Array<string>): boolean;

    removeTrailing(charactersCount: number): string;

    substringAfter(text: string): string;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Array<T> {
    whereType<T>(): Array<T>;
  }
}

export {};
