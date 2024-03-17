class CustomKnob {
  constructor(
    public type: string,
    public nullabilitty: CustomKnobNullability,
    public value: string
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJson(json: any): CustomKnob {
    const type = json.type;
    const nullability = customKnobNullabilityFromString(json.nullability);
    const value = json.value;
    return new CustomKnob(type, nullability, value);
  }

  get nullable(): boolean {
    return this.nullabilitty != CustomKnobNullability.nonNullable;
  }

  get nonNullable(): boolean {
    return this.nullabilitty != CustomKnobNullability.nullable;
  }
}

enum CustomKnobNullability {
  nullable,
  nonNullable,
  both,
}

function customKnobNullabilityFromString(value: string): CustomKnobNullability {
  switch (value) {
    case "nullable":
      return CustomKnobNullability.nullable;
    case "nonNullable":
      return CustomKnobNullability.nonNullable;
    case "both":
      return CustomKnobNullability.both;
    default:
      throw new Error(`Invalid CustomKnobNullability value: ${value}`);
  }
}

export { CustomKnob, CustomKnobNullability };
