import { camelCase, pascalCase, sentenceCase } from "change-case";
import { Configuration } from "../../configuration/configuration";
import {
  DartClass,
  DartClassConstructor,
  DartClassField,
} from "../../data/dart_class";
import { FileContentGenerator } from "./generator";

class BaseFileContentGenerator implements FileContentGenerator {
  clazz: DartClass;
  // FIXME Add a comment for this field
  protected knobForType = new Map<string, (fieldName: string) => string>([
    ["bool", (fieldName) => `context.knobs.boolean(label: '${fieldName}')`],
    ["String", (fieldName) => `context.knobs.text(label: '${fieldName}')`],
    [
      "int",
      (fieldName) => `context.knobs.number(label: '${fieldName}').toInt()`,
    ],
    [
      "double",
      (fieldName) => `context.knobs.number(label: '${fieldName}').toDouble()`,
    ],
    ["ValueChanged<", () => `(_) {}`],
    ["VoidCallback", () => `() {}`],
    ["Key", (fieldName) => `const ValueKey('${fieldName}')`],
  ]);

  constructor(clazz: DartClass) {
    this.clazz = clazz;
  }

  imports(): string {
    // TODO Add support for direct path instead of a barrel file?
    const appWidgetsImport = Configuration.barrelFileImport();

    return `
    import '${appWidgetsImport}';
    import 'package:flutter/widgets.dart';
    import 'package:widgetbook/widgetbook.dart';
    import 'package:widgetbook_annotation/widgetbook_annotation.dart' as wa;
    `.sortLines();
  }

  componentDeclaration(): string {
    // TODO Allow ommiting widget name prefixes
    let output = `
    const ${camelCase(this.clazz.name)}Component = WidgetbookComponent(
      name: '${this.clazz.name}',
      useCases: [
    `;

    for (const constructor of this.clazz.constructors) {
      const constructorName = constructor.name ?? "default";
      const useCaseName = `useCase${this.clazz.name}${pascalCase(
        constructor.name ?? ""
      )}`;

      output += `
        WidgetbookUseCase(
          name: '${constructorName}',
          builder: ${useCaseName},
        ),`;
    }

    output += `
      ],
    );
    `;

    return output;
  }

  useCases(): string {
    let output = "";
    for (const constructor of this.clazz.constructors) {
      const useCase = this.useCase(constructor);
      output += useCase + "\n\n";
    }

    return output;
  }

  useCase(constructor: DartClassConstructor): string {
    const constructorName = constructor.name ?? "default";
    // FIXME useCaseName to a separate function, it's used twice in this file
    const useCaseName = `useCase${this.clazz.name}${pascalCase(
      constructor.name ?? ""
    )}`;
    const fullConstructorName = constructor.named
      ? `${this.clazz.name}.${constructor.name}`
      : this.clazz.name;

    let output = `
    @wa.WidgetbookUseCase(
        name: '${constructorName}',
        type: ${this.clazz.name},
    )
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

  knobForField(field: DartClassField): string {
    const type = field.type;
    const name = sentenceCase(field.name);

    // TODO Add support for nullalble types
    // TODO Preserve default values (to be done also in parsing)

    const knob = this.knobForType.get(type)?.(name);

    if (knob !== undefined) {
      return knob;
    }

    // If none of the cases in [knobForType] matches, it's probably a custom enum.
    return `context.knobs.options(label: '${name}', options: ${type}.values)`;
  }
}

export { BaseFileContentGenerator };
