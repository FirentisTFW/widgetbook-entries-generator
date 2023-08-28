import { Configuration } from "../../configuration/configuration";
import { DartClass } from "../../data/dart_class";
import { FileContentGenerator } from "./generator";
import { FileContentGenerator3_0_0 } from "./impl/3_0_0_generator";

abstract class FileContentGeneratorFactory {
  static create(clazz: DartClass): FileContentGenerator {
    const widgetbookVersion = parseWidgetbookVersion(
      Configuration.widgetbookVersion()
    );

    switch (widgetbookVersion) {
      case WidgetbookVersion.v3_0_0:
        return new FileContentGenerator3_0_0(clazz);
      case WidgetbookVersion.v3_2_0:
        // FIXME Implement v3_2_0 generator
        return new FileContentGenerator3_0_0(clazz);
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
