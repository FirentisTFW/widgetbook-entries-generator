import * as vscode from "vscode";
import { WidgetbookEntriesCodeActions } from "./code_actions/widgetbook_entries";
import { parseTextToClass } from "./util/dart_class_parser";
import { writeWidgetbookEntry } from "./util/file_util";

const DART_MODE = { language: "dart", scheme: "file" };

export function activate(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand(
    "widgetbook-generator.generate.widget",
    generateWidgetbookEntryForWidgetInScope
  );

  context.subscriptions.push(
    command,
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
