enum NumberKnobType {
  input,
  slider,
  askEachTime,
}

function parseNumberKnobType(knobType: string): NumberKnobType {
  // TODO Consider better way of handling this. Does TypeScript offer something cool here?
  switch (knobType) {
    case "Input":
      return NumberKnobType.input;
    case "Slider":
      return NumberKnobType.slider;
    case "Ask each time":
      return NumberKnobType.askEachTime;
  }

  throw new Error(`This number knob type is not handled: ${knobType}`);
}

export { NumberKnobType, parseNumberKnobType };
