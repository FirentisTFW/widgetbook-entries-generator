import * as vscode from "vscode";
import { CodeAction, CodeActionKind } from "vscode";
import { doesLineContainClassDeclaration } from "../util/dart_class_parser";
import "../util/extensions";

class WidgetbookEntriesCodeActions implements vscode.CodeActionProvider {
  provideCodeActions(): Array<CodeAction> {
    if (!this.isCursorAtWidgetClassDeclaration()) return [];

    const commands = [
      {
        command: "widgetbook-generator.generate.widget",
        title: "Create widgetbook entry for this widget",
      },
    ];

    return commands.map((c) => {
      const action = new CodeAction(c.title, CodeActionKind.Refactor);
      action.command = {
        command: c.command,
        title: c.title,
      };
      return action;
    });
  }

  private isCursorAtWidgetClassDeclaration(): boolean {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) return false;

    const lineIndex = activeEditor.selection.active.line;
    const currentLine = activeEditor.document.lineAt(lineIndex).text;
    const lineBelow = activeEditor.document.lineAt(lineIndex + 1).text;

    return doesLineContainClassDeclaration(currentLine, lineBelow);
  }
}

export { WidgetbookEntriesCodeActions };
