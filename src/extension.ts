import * as vscode from "vscode";
import { WidgetbookEntriesCodeActions } from "./code_actions/widgetbook_entries";
import { parseTextToClass } from "./util/dart_class_parser";
import { writeWidgetbookEntry } from "./util/file_util";
import path = require("path");

const DART_MODE = { language: "dart", scheme: "file" };

function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "widgetbook-generator.generate.directory",
      generateWidgetbookEntriesForDirectory
    ),
    vscode.commands.registerCommand(
      "widgetbook-generator.generate.widget",
      generateWidgetbookEntryForWidgetInScope
    ),
    vscode.languages.registerCodeActionsProvider(
      DART_MODE,
      new WidgetbookEntriesCodeActions()
    )
  );
}

async function generateWidgetbookEntryForWidgetInScope(): Promise<void> {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) return;

  const text = activeEditor.document.getText();
  const currentLineIndex = activeEditor.selection.active.line;
  const fileContentFromCurrentLine = text
    .split("\n")
    .slice(currentLineIndex)
    .join("\n");

  const clazz = parseTextToClass(fileContentFromCurrentLine);

  await writeWidgetbookEntry(clazz);
}
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

      await writeWidgetbookEntry(clazz);
    }
  }
}

export { activate };
