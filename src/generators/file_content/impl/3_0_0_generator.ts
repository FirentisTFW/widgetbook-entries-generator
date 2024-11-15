import { camelCase } from "change-case";
import {
  DartClassConstructor,
  DartClassConstructorFieldPositionType,
} from "../../../data/dart_class";
import { BaseFileContentGenerator } from "../base_generator";

class FileContentGenerator3_0_0 extends BaseFileContentGenerator {
  manualComponentDeclaration(): string {
    let output = `
    final ${camelCase(this.clazz.name)}Component = WidgetbookComponent(
      name: '${this.clazz.name}',
      useCases: [
    `;

    for (const constructor of this.clazz.constructors) {
      const useCaseName = this.useCaseName(constructor.name);

      output += `
        WidgetbookUseCase(
          name: '${constructor.useCaseName}',
          builder: ${useCaseName},
        ),`;
    }

    output += `
      ],
    );
    `;

    return output;
  }

  useCaseAnnotation(constructor: DartClassConstructor): string {
    return `
    @${this.widgetbookAnnotation}.WidgetbookUseCase(
      name: '${constructor.useCaseName}',
      type: ${this.clazz.name},
    )
    `;
  }

  useCase(constructor: DartClassConstructor): string {
    const useCaseName = this.useCaseName(constructor.name);
    const fullConstructorName = constructor.named
      ? `${this.clazz.name}.${constructor.name}`
      : this.clazz.name;

    let output = `
    Widget ${useCaseName}(BuildContext context) {
        return ${fullConstructorName}(
    `;

    for (const field of constructor.fields) {
      if (field.positionType == DartClassConstructorFieldPositionType.named) {
        output += `${field.name}: ${this.knobForField(field)},\n`;
      } else {
        output += `${this.knobForField(field)},\n`;
      }
    }

    output += `
        );
    }`;

    return output;
  }
}

export { FileContentGenerator3_0_0 };
