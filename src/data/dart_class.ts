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
    public fields: Array<DartClassConstructorField>,
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

class DartClassConstructorField extends DartClassField {
  constructor(
    public name: string,
    public type: string,
    public positionType = DartClassConstructorFieldPositionType.named,
    public nullable = false
  ) {
    super(name, type, nullable);
  }
}

enum DartClassConstructorFieldPositionType {
  named,
  positional,
}

export {
  DartClass,
  DartClassConstructor,
  DartClassConstructorField,
  DartClassConstructorFieldPositionType,
  DartClassField,
};
