import { snakeCase } from "change-case";
import * as path from "path";
import { Configuration } from "../../configuration/configuration";
import { PathGenerator } from "./generator";

class PathGeneratorImpl implements PathGenerator {
  prepareWidgetbookEntryFilePath(
    className: string,
    widgetFilePath: string
  ): string {
    const classNameSnakeCase = snakeCase(className);
    const outputFilePath = path.join(
      this.prepareWidgetbookWidgetsDirectoryPath(widgetFilePath),
      `${classNameSnakeCase}.dart`
    );

    return outputFilePath;
  }

  prepareWidgetbookWidgetsDirectoryPath(widgetFilePath: string): string {
    const rootDirectory = Configuration.rootProjectDirectoryName();
    const widgetbookWidgetsDirectory = Configuration.widgetsDirectoryPath();
    const projectRootPath =
      widgetFilePath.substringUpToAndIncluding(rootDirectory);
    const outputDirectoryPath = path.join(
      projectRootPath,
      widgetbookWidgetsDirectory
    );

    return outputDirectoryPath;
  }

  prepareCustomKnobsFilePath(currentPath: string): string | null {
    const rootDirectory = Configuration.rootProjectDirectoryName();
    const relativeFilePath = Configuration.customKnobsPath();
    const projectRootPath =
      currentPath.substringUpToAndIncluding(rootDirectory);

    if (relativeFilePath === "") return null;

    return path.join(projectRootPath, relativeFilePath);
  }
}
export { PathGeneratorImpl };
