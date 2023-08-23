import { snakeCase } from "change-case";
import * as vscode from "vscode";
import { Configuration } from "../../configuration/configuration";

interface PathGenerator {
  prepareWidgetbookEntryFilePath(className: string): string | null;
}

class PathGeneratorImpl implements PathGenerator {
  prepareWidgetbookEntryFilePath(className: string): string | null {
    const activeTextEditor = vscode.window.activeTextEditor;
    if (!activeTextEditor) return null;

    const currentPath = activeTextEditor.document.fileName;
    const rootDir = Configuration.rootProjectDirectoryName();
    const widgetbookWidgetsDir = Configuration.widgetsDirectoryPath();
    const classNameSnakeCase = snakeCase(className);
    const projectRootPath = currentPath.substringUpToAndIncluding(rootDir);
    const widgetFilePath = `${projectRootPath}/${widgetbookWidgetsDir}/${classNameSnakeCase}.dart`;

    return widgetFilePath;
  }
}

export { PathGenerator, PathGeneratorImpl };
