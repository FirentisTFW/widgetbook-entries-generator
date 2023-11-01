String.prototype.includesAll = function (texts: Array<string>) {
  for (const text of texts) {
    if (!this.includes(text)) return false;
  }
  return true;
};

String.prototype.removeTrailing = function (charactersCount: number) {
  return this.slice(0, -charactersCount);
};

String.prototype.sortLines = function () {
  return this.split("\n").sort().join("\n");
};

String.prototype.substringAfter = function (text: string) {
  return this.substring(this.indexOf(text) + text.length);
};

String.prototype.substringBetween = function (start: string, end: string) {
  return this.substring(this.indexOf(start) + start.length, this.indexOf(end));
};

String.prototype.substringUpTo = function (text: string) {
  return this.substring(0, this.indexOf(text));
};

String.prototype.substringUpToAndIncluding = function (text: string) {
  return this.substring(0, this.indexOf(text) + text.length);
};

Array.prototype.whereType = function <T>(): Array<T> {
  return this.filter((element): element is T => !!element);
};

export {};
