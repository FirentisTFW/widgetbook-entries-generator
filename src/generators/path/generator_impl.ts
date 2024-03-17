import { snakeCase } from "change-case";
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
    const outputFilePath = `${projectRootPath}/${widgetbookWidgetsDirectory}/${classNameSnakeCase}.dart`;

    return outputFilePath;
  }

  prepareCustomKnobsFilePath(currentPath: string): string | null {
    const rootDirectory = Configuration.rootProjectDirectoryName();
    const relativeFilePath = Configuration.customKnobsPath();
    const projectRootPath =
      currentPath.substringUpToAndIncluding(rootDirectory);

    if (relativeFilePath === "") return null;

    return `${projectRootPath}/${relativeFilePath}`;
  }
}
export { PathGeneratorImpl };
