import exp = require("constants");
import { Configuration } from "../../../configuration/configuration";
import { NumberKnobType } from "../../../configuration/enums/double_knob_type";
import { FileContentGenerator3_2_0 } from "./3_2_0_generator";

class FileContentGenerator3_4_0 extends FileContentGenerator3_2_0 {
  applyMigrations(): void {
    super.applyMigrations();

    this.knobForType.set(
      "Duration",
      (fieldName) => `context.knobs.duration(label: '${fieldName}')`
    );
    this.knobForType.set(
      "DateTime",
      (fieldName) => `context.knobs.dateTime(label: '${fieldName}')`
    );
    this.knobForType.set("int", (fieldName) => this.intKnob(fieldName));

    this.knobForNullableType.set(
      "Color",
      (fieldName) => `context.knobs.colorOrNull(label: '${fieldName}')`
    );
    this.knobForNullableType.set("int", (fieldName) =>
      this.nullableIntKnob(fieldName)
    );
  }

  protected intKnob(fieldName: string): string {
    const knobType = Configuration.numberKnobType();

    switch (knobType) {
      case NumberKnobType.input:
        return `context.knobs.int.input(label: '${fieldName}')`;
      case NumberKnobType.slider:
        return `context.knobs.int.slider(label: '${fieldName}')`;
    }
  }
  protected nullableIntKnob(fieldName: string): string {
    const knobType = Configuration.numberKnobType();

    switch (knobType) {
      case NumberKnobType.input:
        return `context.knobs.intOrNull.input(label: '${fieldName}')`;
      case NumberKnobType.slider:
        return `context.knobs.intOrNull.slider(label: '${fieldName}')`;
    }
  }
}

export { FileContentGenerator3_4_0 };
