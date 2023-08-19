String.prototype.includesAll = function (texts: Array<string>) {
  for (const text of texts) {
    if (!this.includes(text)) return false;
  }
  return true;
};

String.prototype.substringAfter = function (text: string) {
  return this.substring(this.indexOf(text) + text.length);
};

Array.prototype.whereType = function <T>() {
  return this.filter((element): element is T => !!element);
};

export {};
