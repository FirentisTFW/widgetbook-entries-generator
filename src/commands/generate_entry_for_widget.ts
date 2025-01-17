import * as vscode from "vscode";
import { FileContentGeneratorFactory } from "../generators/file_content/factory";
import { PathGeneratorFactory } from "../generators/path/factory";
import { CustomKnobsProvider } from "../providers/custom_knobs_provider";
import { parseTextToClasses } from "../util/dart_class_parser";
import {
  createDirectoryIfNotExists,
  writeWidgetbookEntry,
} from "../util/file_util";

async function generateWidgetbookEntryForWidgetInScope(): Promise<void> {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) return;

  const text = activeEditor.document.getText();
  const currentLineIndex = activeEditor.selection.active.line;
  const fileContentFromCurrentLine = text
    .split("\n")
    .slice(currentLineIndex)
    .join("\n");

  const classes = parseTextToClasses(fileContentFromCurrentLine);

  for (const clazz of classes) {
    const pathGenerator = PathGeneratorFactory.create();
    const customKnobsFilePath = pathGenerator.prepareCustomKnobsFilePath(
      activeEditor.document.uri.path
    );
    const customKnobs = await new CustomKnobsProvider().getCustomKnobs(
      customKnobsFilePath
    );
    const fileContentGenerator = FileContentGeneratorFactory.create(
      clazz,
      customKnobs
    );
    const filePath = activeEditor.document.fileName;

    await createDirectoryIfNotExists(
      pathGenerator.prepareWidgetbookWidgetsDirectoryPath(filePath)
    );

    await writeWidgetbookEntry(
      clazz,
      filePath,
      pathGenerator,
      fileContentGenerator
    );
  }
}

export { generateWidgetbookEntryForWidgetInScope };
