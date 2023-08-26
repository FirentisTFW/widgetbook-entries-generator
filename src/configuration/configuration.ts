import * as vscode from "vscode";

const configurationEntry = "widgetbook-generator";

const barrelFileImport = "barrel-file-import";
const rootProjectDirectoryNameKey = "root-directory-name";
const widgetbookVersionKey = "widgetbook-version";
const widgetsDirectoryPathKey = "widgets-directory-path";

class Configuration {
  private static readSetting<T>(key: string): T {
    // TODO Use section or scope in getConfiguration method to improve performance
    return vscode.workspace
      .getConfiguration()
      .get(`${configurationEntry}.` + key) as T;
  }

  static barrelFileImport(): string {
    return Configuration.readSetting(barrelFileImport);
  }

  static rootProjectDirectoryName(): string {
    return Configuration.readSetting(rootProjectDirectoryNameKey);
  }

  static widgetbookVersion(): string {
    return Configuration.readSetting(widgetbookVersionKey);
  }

  static widgetsDirectoryPath(): string {
    return Configuration.readSetting(widgetsDirectoryPathKey);
  }
}

export { Configuration };
