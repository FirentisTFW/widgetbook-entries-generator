import { Configuration } from "../../configuration/configuration";
import { WidgetbookVersion } from "../../configuration/enums/widgetbook_version";
import { CustomKnob } from "../../data/custom_knob";
import { DartClass } from "../../data/dart_class";
import { FileContentGenerator } from "./generator";
import { FileContentGenerator3_0_0 } from "./impl/3_0_0_generator";
import { FileContentGenerator3_2_0 } from "./impl/3_2_0_generator";
import { FileContentGenerator3_4_0 } from "./impl/3_4_0_generator";

abstract class FileContentGeneratorFactory {
  static create(
    clazz: DartClass,
    customKnobs: Array<CustomKnob> = []
  ): FileContentGenerator {
    const widgetbookVersion = Configuration.widgetbookVersion();

    switch (widgetbookVersion) {
      case WidgetbookVersion.v3_0_0:
        return new FileContentGenerator3_0_0(clazz, customKnobs);
      case WidgetbookVersion.v3_2_0:
        return new FileContentGenerator3_2_0(clazz, customKnobs);
      case WidgetbookVersion.v3_4_0:
        return new FileContentGenerator3_4_0(clazz, customKnobs);
    }
  }
}

export { FileContentGeneratorFactory };
