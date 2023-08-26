import { camelCase, pascalCase } from "change-case";
import { Configuration } from "../../configuration/configuration";
import { DartClass, DartClassField } from "../../data/dart_class";
import { FileContentGenerator } from "./generator";

class BaseFileContentGenerator implements FileContentGenerator {
  clazz: DartClass;

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
    throw new Error("Method not implemented.");
  }

  useCase(): string {
    throw new Error("Method not implemented.");
  }

  knobForField(field: DartClassField): string {
    throw new Error("Method not implemented.");
  }
}

export { BaseFileContentGenerator };
