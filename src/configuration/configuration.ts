import * as vscode from "vscode";
import { Approach, parseApproach } from "./enums/approach";
import { DoubleKnobType, parseDoubleKnobType } from "./enums/double_knob_type";
import {
  WidgetbookVersion,
  parseWidgetbookVersion,
} from "./enums/widgetbook_version";

const configurationEntry = "widgetbook-generator";

const approachKey = "approach";
const barrelFileImportKey = "barrelFileImport";
const doubleKnobTypeKey = "doubleKnobType";
const rootProjectDirectoryNameKey = "rootDirectoryName";
const widgetbookVersionKey = "widgetbookVersion";
const widgetsDirectoryPathKey = "widgetsDirectoryPath";

class Configuration {
  private static readSetting<T>(key: string): T {
    // TODO Use section or scope in getConfiguration method to improve performance
    return vscode.workspace
      .getConfiguration()
      .get(`${configurationEntry}.` + key) as T;
  }

  static approach(): Approach {
    const approach = Configuration.readSetting<string>(approachKey);

    return parseApproach(approach);
  }

  static barrelFileImport(): string {
    return Configuration.readSetting(barrelFileImportKey);
  }

  static doubleKnobType(): DoubleKnobType {
    const knobType = Configuration.readSetting<string>(doubleKnobTypeKey);

    return parseDoubleKnobType(knobType);
  }

  static rootProjectDirectoryName(): string {
    return Configuration.readSetting(rootProjectDirectoryNameKey);
  }

  static widgetbookVersion(): WidgetbookVersion {
    const version = Configuration.readSetting<string>(widgetbookVersionKey);

    return parseWidgetbookVersion(version);
  }

  static widgetsDirectoryPath(): string {
    return Configuration.readSetting(widgetsDirectoryPathKey);
  }
}

export { Configuration };
