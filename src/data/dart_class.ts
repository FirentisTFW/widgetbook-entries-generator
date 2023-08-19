class DartClass {
  name: string;
  fields: Array<DartClassField>;
  constructors: Array<DartClassConstructor>;

  constructor(
    name: string,
    fields: Array<DartClassField>,
    constructors: Array<DartClassConstructor>
  ) {
    this.name = name;
    this.fields = fields;
    this.constructors = constructors;
  }
}

class DartClassConstructor {
  named: boolean;
  fields: Array<DartClassField>;
  name: string | null;

  constructor(
    named: boolean,
    fields: Array<DartClassField>,
    name: string | null
  ) {
    this.named = named;
    this.fields = fields;
    this.name = name;
  }
}

class DartClassField {
  name: string;
  type: string;

  constructor(name: string, type: string) {
    this.name = name;
    this.type = type;
  }
}

export { DartClass, DartClassConstructor, DartClassField };