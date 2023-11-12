import * as vscode from "vscode";
import { CodeAction, CodeActionKind } from "vscode";
import "../util/extensions";

class WidgetbookEntriesCodeActions implements vscode.CodeActionProvider {
  provideCodeActions(): Array<CodeAction> {
    if (!this.isCursorAtWidgetClassDeclaration()) return [];

    const commands = [
      {
        command: "widgetbook-generator.generate.widget",
        title: "Create widgetbook entry for this widget",
      },
      {
        command: "widgetbook-generator.generate.directory",
        title: "Widgetbook: generate entry for each file in the directory",
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

    return (
      currentLine.includes("class") &&
      (currentLine.includes("Widget") || lineBelow.includes("Widget"))
    );
  }
}

export { WidgetbookEntriesCodeActions };
