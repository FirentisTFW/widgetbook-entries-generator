import * as vscode from "vscode";

const configurationEntry = "widgetbook_generator";

const rootProjectDirectoryNameKey = "root_directory_name";
const widgetsDirectoryPathKey = "widgets_directory_path";

class Configuration {
  private static readSetting(key: string): string | undefined {
    // TODO Use section or scope in getConfiguration method to improve performance
    return vscode.workspace
      .getConfiguration()
      .get(`${configurationEntry}.` + key);
  }

  static rootProjectDirectoryName(): string | undefined {
    return Configuration.readSetting(rootProjectDirectoryNameKey);
  }

  static widgetsDirectoryPath(): string | undefined {
    return Configuration.readSetting(widgetsDirectoryPathKey);
  }
}

export { Configuration };
