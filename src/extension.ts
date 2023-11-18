import * as vscode from "vscode";
import { WidgetbookEntriesCodeActions } from "./code_actions/widgetbook_entries";
import {
  generateWidgetbookEntriesForDirectory,
  generateWidgetbookEntryForWidgetInScope,
} from "./commands";

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

export { activate };
