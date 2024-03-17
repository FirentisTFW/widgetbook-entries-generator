import { snakeCase } from "change-case";
import * as path from "path";
import { Configuration } from "../../configuration/configuration";
import { PathGenerator } from "./generator";

class PathGeneratorImpl implements PathGenerator {
  prepareWidgetbookEntryFilePath(
    className: string,
    widgetFilePath: string
  ): string | null {
    const rootDirectory = Configuration.rootProjectDirectoryName();
    const widgetbookWidgetsDirectory = Configuration.widgetsDirectoryPath();
    const classNameSnakeCase = snakeCase(className);
    const projectRootPath =
      widgetFilePath.substringUpToAndIncluding(rootDirectory);
    const outputFilePath = path.join(
      projectRootPath,
      widgetbookWidgetsDirectory,
      `${classNameSnakeCase}.dart`
    );

    return outputFilePath;
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
