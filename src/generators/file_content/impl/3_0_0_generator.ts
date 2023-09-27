import { camelCase, pascalCase } from "change-case";
import { DartClassConstructor } from "../../../data/dart_class";
import { BaseFileContentGenerator } from "../base_generator";

class FileContentGenerator3_0_0 extends BaseFileContentGenerator {
  manualComponentDeclaration(): string {
    let output = `
    const ${camelCase(this.clazz.name)}Component = WidgetbookComponent(
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
      output += `${field.name}: ${this.knobForField(field)},\n`;
    }

    output += `
        );
    }`;

    return output;
  }

  protected knobForEnum(name: string, type: string) {
    return `context.knobs.options(label: '${name}', options: ${type}.values)`;
  }

  private useCaseName(constructorName: string | null): string {
    return `useCase${this.clazz.name}${pascalCase(constructorName ?? "")}`;
  }
}

export { FileContentGenerator3_0_0 };
