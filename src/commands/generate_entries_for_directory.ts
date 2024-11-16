import * as vscode from "vscode";
import { FileContentGeneratorFactory } from "../generators/file_content/factory";
import { PathGeneratorFactory } from "../generators/path/factory";
import { CustomKnobsProvider } from "../providers/custom_knobs_provider";
import { parseTextToClass } from "../util/dart_class_parser";
import {
  createDirectoryIfNotExists,
  writeWidgetbookEntry,
} from "../util/file_util";
import path = require("path");

async function generateWidgetbookEntriesForDirectory(
  uri: vscode.Uri
): Promise<void> {
  const directoryPath = uri.fsPath;

  const files = await vscode.workspace.fs.readDirectory(
    vscode.Uri.file(directoryPath)
  );

  for (const [fileName, fileType] of files) {
    if (fileType === vscode.FileType.File) {
      const filePath = path.join(directoryPath, fileName);

      const fileContent = await vscode.workspace.fs.readFile(
        vscode.Uri.file(filePath)
      );
      const fileContentString = new TextDecoder().decode(fileContent);

      const clazz = parseTextToClass(fileContentString);

      if (!clazz) return;

      const pathGenerator = PathGeneratorFactory.create();
      const customKnobsFilePath = pathGenerator.prepareCustomKnobsFilePath(
        uri.path
      );
      const customKnobs = await new CustomKnobsProvider().getCustomKnobs(
        customKnobsFilePath
      );
      const fileContentGenerator = FileContentGeneratorFactory.create(
        clazz,
        customKnobs
      );

      await createDirectoryIfNotExists(
        pathGenerator.prepareWidgetbookWidgetsDirectoryPath(filePath)
      );

      await writeWidgetbookEntry(
        clazz,
        filePath,
        pathGenerator,
        fileContentGenerator
      );
    } else if (fileType === vscode.FileType.Directory) {
      const subdirectoryPath = path.join(directoryPath, fileName);

      await generateWidgetbookEntriesForDirectory(
        vscode.Uri.file(subdirectoryPath)
      );
    }
  }
}

export { generateWidgetbookEntriesForDirectory };
