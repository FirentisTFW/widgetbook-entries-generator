import { camelCase, pascalCase } from "change-case";
import { DartClassConstructor } from "../../../data/dart_class";
import { BaseFileContentGenerator } from "../base_generator";

class FileContentGenerator3_2_0 extends BaseFileContentGenerator {
  applyMigrations(): void {
    this.knobForType.set(
      "String",
      (fieldName) =>
        `context.knobs.string(label: '${fieldName}', initialValue: '${fieldName}')`
    );
    this.knobForType.set(
      "double",
      (fieldName) => `context.knobs.double.input(label: '${fieldName}')`
    );
    this.knobForType.set(
      "int",
      (fieldName) => `context.knobs.double.input(label: '${fieldName}').toInt()`
    );

    this.knobForNullableType.set(
      "bool",
      (fieldName) => `context.knobs.booleanOrNull(label: '${fieldName}')`
    );
    this.knobForNullableType.set(
      "String",
      (fieldName) => `context.knobs.stringOrNull(label: '${fieldName}')`
    );
    this.knobForNullableType.set(
      "double",
      (fieldName) => `context.knobs.doubleOrNull.input(label: '${fieldName}')`
    );
    this.knobForNullableType.set(
      "int",
      (fieldName) =>
        `context.knobs.doubleOrNull.input(label: '${fieldName}')?.toInt()`
    );
  }

  manualComponentDeclaration(): string {
    // TODO Allow ommiting widget name prefixes
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
    @${this.widgetbookAnnotation}.UseCase(
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

  private useCaseName(constructorName: string | null): string {
    return `useCase${this.clazz.name}${pascalCase(constructorName ?? "")}`;
  }

  protected knobForEnum(name: string, type: string) {
    return `context.knobs.list(label: '${name}', options: ${type}.values)`;
  }
}

export { FileContentGenerator3_2_0 };
