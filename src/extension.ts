import * as vscode from "vscode";
import { WidgetbookEntriesCodeActions } from "./code_actions/widgetbook_entries";

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

function generateWidgetbookEntryForWidgetInScope(): void {
  // FIXME Implement
  console.log("generateWidgetbookEntryForWidgetInScope");
}
