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
}
export { PathGeneratorImpl };
