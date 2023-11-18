import * as vscode from "vscode";
import { parseTextToClass } from "../util/dart_class_parser";
import { writeWidgetbookEntry } from "../util/file_util";
import path = require("path");

async function generateWidgetbookEntriesForDirectory(
  uri: vscode.Uri
): Promise<void> {
  const directoryPath = uri.fsPath;

  await generateWidgetbookEntriesForDirectoryImpl(directoryPath);
}

// FIXME Refactor the naming
async function generateWidgetbookEntriesForDirectoryImpl(
  directoryPath: string
): Promise<void> {
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

      await writeWidgetbookEntry(clazz, filePath);
    } else if (fileType === vscode.FileType.Directory) {
      const subdirectoryPath = path.join(directoryPath, fileName);

      await generateWidgetbookEntriesForDirectoryImpl(subdirectoryPath);
    }
  }
}

export { generateWidgetbookEntriesForDirectory };
