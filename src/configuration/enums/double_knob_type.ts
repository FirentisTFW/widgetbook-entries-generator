enum DoubleKnobType {
  input,
  slider,
  askEachTime,
}

function parseDoubleKnobType(knobType: string): DoubleKnobType {
  // TODO Consider better way of handling this. Does TypeScript offer something cool here?
  switch (knobType) {
    case "Input":
      return DoubleKnobType.input;
    case "Slider":
      return DoubleKnobType.slider;
    case "Ask each time":
      return DoubleKnobType.askEachTime;
  }

  throw new Error(`This double knob type is not handled: ${knobType}`);
}

export { DoubleKnobType, parseDoubleKnobType };
