import { pascalCase, sentenceCase } from "change-case";
import { Configuration } from "../../configuration/configuration";
import { Approach } from "../../configuration/enums/approach";
import { NumberKnobType } from "../../configuration/enums/double_knob_type";
import {
  DartClass,
  DartClassConstructor,
  DartClassField,
} from "../../data/dart_class";
import { FileContentGenerator } from "./generator";

abstract class BaseFileContentGenerator implements FileContentGenerator {
  clazz: DartClass;

  constructor(clazz: DartClass) {
    this.clazz = clazz;
    this.applyMigrations();
  }

  /**
   * Holds key-value pairs for known types. The key is a field type and value is a function that can be passed field name
   * to generate knob entry.
   * This field can be overriden in child classes (for instance if widgetbook API changed or a given type is supported differently).
   */
  protected knobForType = new Map<string, (fieldName: string) => string>([
    ["bool", (fieldName) => `context.knobs.boolean(label: '${fieldName}')`],
    [
      "String",
      (fieldName) =>
        `context.knobs.string(label: '${fieldName}', initialValue: '${fieldName}')`,
    ],
    ["int", (fieldName) => this.doubleKnob(fieldName, ".toInt()")],
    ["double", (fieldName) => this.doubleKnob(fieldName, ".toDouble()")],
    ["ValueChanged", () => `(_) {}`],
    ["VoidCallback", () => `() {}`],
    [
      "Duration",
      (fieldName) =>
        `Duration(milliseconds: ` +
        this.doubleKnob(`${fieldName} in milliseconds`, ".toInt()") +
        `,)`,
    ],
    ["Key", (fieldName) => `const ValueKey('${fieldName}')`],
    ["Color", (fieldName) => `context.knobs.color(label: '${fieldName}')`],
    ["Widget", () => `const SizedBox.shrink()`],
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
      (fieldName) => `context.knobs.booleanOrNull(label: '${fieldName}')`,
    ],
    [
      "String",
      (fieldName) => `context.knobs.stringOrNull(label: '${fieldName}')`,
    ],
    ["int", (fieldName) => this.nullableDoubleKnob(fieldName, "?.toInt()")],
    [
      "double",
      (fieldName) => this.nullableDoubleKnob(fieldName, "?.toDouble()"),
    ],
    ["Widget", () => `const SizedBox.shrink()`],
  ]);

  protected widgetbookAnnotation = "widgetbook";

  abstract manualComponentDeclaration(): string;

  abstract useCaseAnnotation(constructor: DartClassConstructor): string;

  abstract useCase(constructor: DartClassConstructor): string;

  /**
   * This method should be overriden in child classes in order to apply changes that happened
   * in different versions of widgetbook in relation to setup present in BaseFileContentGenerator.
   *
   * `super.applyMigrations()` should always be called first.
   */
  protected applyMigrations(): void {
    // To be overriden in child classes.
  }

  imports(): string {
    // TODO Add support for direct path instead of a barrel file?
    const appWidgetsImport = Configuration.barrelFileImport();
    const useGenerationApproach =
      Configuration.approach() === Approach.generation;

    let fixedImports = `
    import '${appWidgetsImport}';
    import 'package:flutter/widgets.dart';
    import 'package:widgetbook/widgetbook.dart';
    `;

    if (useGenerationApproach) {
      fixedImports += `import 'package:widgetbook_annotation/widgetbook_annotation.dart' as ${this.widgetbookAnnotation};`;
    }

    return fixedImports.sortLines();
  }

  useCases(): string {
    let output = "";
    for (const constructor of this.clazz.constructors) {
      const useCase = this.useCase(constructor);
      const useGenerationApproach =
        Configuration.approach() === Approach.generation;

      if (useGenerationApproach) {
        output += this.useCaseAnnotation(constructor);
      }

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
    knob ??= this.checkForFunction(type);

    if (knob !== undefined) {
      return knob;
    }

    // If none of the cases from [knobForType] matches, it's probably a custom enum.
    return this.knobForEnum(name, type, field.nullable);
  }

  private checkForFunction(type: string): string | undefined {
    const functionRegex = /.*\bFunction\s*\(.*/;

    if (!functionRegex.test(type)) return undefined;

    const parametersSeparator = ",";
    const parameters = type
      .substringAfter("Function")
      .substringBetween("(", ")");
    const parametersCount =
      parameters === "" ? 0 : parameters.split(parametersSeparator).length;

    const underscoresForParameters = Array.from(
      { length: parametersCount },
      (_, i) => "_".repeat(i + 1)
    ).join(", ");

    return `(${underscoresForParameters}) {}`;
  }

  protected knobForEnum(name: string, type: string, nullable: boolean): string {
    if (nullable) {
      return `context.knobs.listOrNull(label: '${name}', options: [null, ...${type}.values])`;
    }
    return `context.knobs.list(label: '${name}', options: ${type}.values)`;
  }

  protected doubleKnob(fieldName: string, castSuffix: string): string {
    const knobType = Configuration.numberKnobType();

    switch (knobType) {
      case NumberKnobType.input:
        return `context.knobs.number(label: '${fieldName}')${castSuffix}`;
      case NumberKnobType.slider:
        return `context.knobs.slider(label: '${fieldName}')${castSuffix}`;
    }
  }

  protected nullableDoubleKnob(fieldName: string, castSuffix: string): string {
    const knobType = Configuration.numberKnobType();

    switch (knobType) {
      case NumberKnobType.input:
        return `context.knobs.nullableNumber(label: '${fieldName}')${castSuffix}`;
      case NumberKnobType.slider:
        return `context.knobs.nullableSlider(label: '${fieldName}')${castSuffix}`;
    }
  }

  protected useCaseName(constructorName: string | null): string {
    return `useCase${this.clazz.name}${pascalCase(constructorName ?? "")}`;
  }
}

export { BaseFileContentGenerator };
