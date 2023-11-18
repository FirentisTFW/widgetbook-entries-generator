import * as vscode from "vscode";
import { parseTextToClass } from "../util/dart_class_parser";
import { writeWidgetbookEntry } from "../util/file_util";

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

export { generateWidgetbookEntryForWidgetInScope };
