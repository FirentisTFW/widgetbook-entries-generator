import { Configuration } from "../../../configuration/configuration";
import { NumberKnobType } from "../../../configuration/enums/double_knob_type";
import { DartClassConstructor } from "../../../data/dart_class";
import { FileContentGenerator3_0_0 } from "./3_0_0_generator";

class FileContentGenerator3_2_0 extends FileContentGenerator3_0_0 {
  applyMigrations(): void {
    super.applyMigrations();

    this.knobForType.set("double", (fieldName) =>
      this.numberKnob(fieldName, "")
    );
    this.knobForNullableType.set("double", (fieldName) =>
      this.nullableNumberKnob(fieldName, "")
    );
  }

  useCaseAnnotation(constructor: DartClassConstructor): string {
    return `
    @${this.widgetbookAnnotation}.UseCase(
        name: '${constructor.useCaseName}',
        type: ${this.clazz.name},
    )
    `;
  }

  protected numberKnob(fieldName: string, castSuffix: string): string {
    const knobType = Configuration.numberKnobType();

    switch (knobType) {
      case NumberKnobType.input:
        return `context.knobs.double.input(label: '${fieldName}')${castSuffix}`;
      case NumberKnobType.slider:
        return `context.knobs.double.slider(label: '${fieldName}')${castSuffix}`;
    }
  }
  protected nullableNumberKnob(fieldName: string, castSuffix: string): string {
    const knobType = Configuration.numberKnobType();

    switch (knobType) {
      case NumberKnobType.input:
        return `context.knobs.doubleOrNull.input(label: '${fieldName}')${castSuffix}`;
      case NumberKnobType.slider:
        return `context.knobs.doubleOrNull.slider(label: '${fieldName}')${castSuffix}`;
    }
  }
}

export { FileContentGenerator3_2_0 };
