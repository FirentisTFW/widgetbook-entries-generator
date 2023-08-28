import { Configuration } from "../../configuration/configuration";
import { DartClass } from "../../data/dart_class";
import { BaseFileContentGenerator } from "./base_generator";
import { FileContentGenerator } from "./generator";

abstract class FileContentGeneratorFactory {
  static create(clazz: DartClass): FileContentGenerator {
    const widgetbookVersion = parseWidgetbookVersion(
      Configuration.widgetbookVersion()
    );

    // FIXME Return a proper implementation class based on user settings.
    switch (widgetbookVersion) {
      case WidgetbookVersion.v3_0_0:
        return new BaseFileContentGenerator(clazz);
      case WidgetbookVersion.v3_2_0:
        return new BaseFileContentGenerator(clazz);
    }
  }
}

enum WidgetbookVersion {
  v3_0_0,
  v3_2_0,
}

function parseWidgetbookVersion(version: string): WidgetbookVersion {
  // TODO Consider better way of handling this. Does TypeScript offer something cool here?
  switch (version) {
    case "3.0.0":
      return WidgetbookVersion.v3_0_0;
    case "3.2.0":
      return WidgetbookVersion.v3_2_0;
  }

  throw new Error(`This widgetbook version is not handled: ${version}`);
}

export { FileContentGeneratorFactory };
