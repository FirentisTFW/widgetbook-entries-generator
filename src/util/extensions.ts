String.prototype.substringAfter = function (text: string) {
  return this.substring(this.indexOf(text) + text.length);
};

Array.prototype.whereType = function <T>() {
  return this.filter((element): element is T => !!element);
};

export {};
