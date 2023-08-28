import { sentenceCase } from "change-case";
import { Configuration } from "../../configuration/configuration";
import {
  DartClass,
  DartClassConstructor,
  DartClassField,
} from "../../data/dart_class";
import { FileContentGenerator } from "./generator";

// FIXME Implement generating content for two widgetbook versions (3.0.0 and 3.2.0),
//  identify common parts and refactor the class to make adding support
//  for new versions as easy as possible.
abstract class BaseFileContentGenerator implements FileContentGenerator {
  clazz: DartClass;

  constructor(clazz: DartClass) {
    this.clazz = clazz;
  }

  /**
   * Holds key-value pairs for known types. The key is a field type and value is a function that can be passed field name
   * to generate knob entry.
   * This field can be overriden in child classes (for instance if widgetbook API changed or a given type is supported differently).
   */
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
    ["ValueChanged", () => `(_) {}`],
    ["VoidCallback", () => `() {}`],
    ["Key", (fieldName) => `const ValueKey('${fieldName}')`],
  ]);

  /**
   * Works the same way as [knobForType] but for nullable values, @see knobForType.
   */
  protected knobForNullableType = new Map<
    string,
    (fieldName: string) => string
  >([
    [
      "bool",
      (fieldName) => `context.knobs.nullableBoolean(label: '${fieldName}')`,
    ],
    [
      "String",
      (fieldName) => `context.knobs.nullableText(label: '${fieldName}')`,
    ],
    [
      "int",
      (fieldName) =>
        `context.knobs.nullableNumber(label: '${fieldName}').toInt()`,
    ],
    [
      "double",
      (fieldName) =>
        `context.knobs.nullableNumber(label: '${fieldName}').toDouble()`,
    ],
  ]);

  abstract componentDeclaration(): string;

  abstract useCase(constructor: DartClassConstructor): string;

  protected abstract knobForEnum(name: string, type: string): string;

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

  useCases(): string {
    let output = "";
    for (const constructor of this.clazz.constructors) {
      const useCase = this.useCase(constructor);
      output += useCase + "\n\n";
    }

    return output;
  }

  knobForField(field: DartClassField): string {
    const type = field.type.includes("<")
      ? field.type.substringUpTo("<")
      : field.type;
    const name = sentenceCase(field.name);

    // TODO Preserve default values (to be done also in parsing)

    let knob: string | undefined;
    if (field.nullable) {
      knob = this.knobForNullableType.get(type)?.(name);
    }
    knob ??= this.knobForType.get(type)?.(name);

    if (knob !== undefined) {
      return knob;
    }

    // If none of the cases from [knobForType] matches, it's probably a custom enum.
    return this.knobForEnum(name, type);
  }
}

export { BaseFileContentGenerator };
