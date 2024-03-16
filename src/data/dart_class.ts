class DartClass {
  constructor(
    public name: string,
    public fields: Array<DartClassField>,
    public constructors: Array<DartClassConstructor>
  ) {}
}

class DartClassConstructor {
  constructor(
    public named: boolean,
    public fields: Array<DartClassField>,
    public name: string | null
  ) {}

  get useCaseName(): string {
    return this.named ? `.${this.name}` : "default";
  }
}

class DartClassField {
  constructor(
    public name: string,
    public type: string,
    public nullable = false
  ) {}
}

export { DartClass, DartClassConstructor, DartClassField };
