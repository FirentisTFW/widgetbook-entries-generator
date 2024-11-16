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
      (uri: vscode.Uri) =>
        runCatching(() => generateWidgetbookEntriesForDirectory(uri))
    ),
    vscode.commands.registerCommand(
      "widgetbook-generator.generate.widget",
      () => runCatching(() => generateWidgetbookEntryForWidgetInScope())
    ),
    vscode.languages.registerCodeActionsProvider(
      DART_MODE,
      new WidgetbookEntriesCodeActions()
    )
  );
}

async function runCatching(callback: () => Promise<void>) {
  const createIssueText = "Create issue";

  try {
    await callback();
  } catch (error) {
    vscode.window
      .showErrorMessage(
        `Failed to execute action. Error: ${error}. ` +
          `Please create an issue in extension's repository with minimal reproducible example.`,
        createIssueText
      )
      .then((selected) => {
        if (selected === createIssueText) {
          vscode.env.openExternal(
            vscode.Uri.parse(
              "https://github.com/leancodepl/widgetbook-entries-generator/issues"
            )
          );
        }
      });
  }
}

export { activate };
