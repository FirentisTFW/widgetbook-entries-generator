declare global {
  interface String {
    substringAfter(text: string): string;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Array<T> {
    whereType<T>(): Array<T>;
  }
}

export {};
