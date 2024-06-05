import { existsSync, writeFile } from "fs";
import * as vscode from "vscode";
import { Configuration } from "../configuration/configuration";
import { Approach } from "../configuration/enums/approach";
import { DartClass } from "../data/dart_class";
import { FileContentGenerator } from "../generators/file_content/generator";
import { PathGenerator } from "../generators/path/generator";

const ENCODING = "utf8";

async function writeWidgetbookEntry(
  clazz: DartClass,
  widgetFilePath: string,
  pathGenerator: PathGenerator,
  fileContentGenerator: FileContentGenerator
): Promise<void> {
  const filePath = pathGenerator.prepareWidgetbookEntryFilePath(
    clazz.name,
    widgetFilePath
  );

  if (filePath === null) {
    // TODO Show error dialog or something
    return;
  }

  const fileContent = prepareWidgetbookEntry(fileContentGenerator);

  if (existsSync(filePath)) {
    const shouldOverrideFile = await showOverrideFileDialog(fileContent);
    if (!shouldOverrideFile) return;
  }

  writeFile(filePath, fileContent, ENCODING, (error) => {
    if (error) {
      console.log(error);
    }
  });

  await formatAndSaveFile(filePath);
}

async function createDirectoryIfNotExists(
  directoryPath: string
): Promise<void> {
  const uri = vscode.Uri.file(directoryPath);

  if (!existsSync(uri.fsPath)) {
    await vscode.workspace.fs.createDirectory(uri);
  }
}

async function showOverrideFileDialog(fileContent: string): Promise<boolean> {
  const yesOption = "YES";
  const noOption = `NO`;
  const copyOption =
    "NO, COPY GENERATED CONTENT (UNFORMATTED) TO THE CLIPBOARD";

  const result = await vscode.window.showQuickPick(
    [yesOption, noOption, copyOption],
    {
      placeHolder: `This widget already has its representation in the widgetbook. Do you want to override it?`,
    }
  );

  if (result === copyOption) {
    await vscode.env.clipboard.writeText(fileContent);
  }

  return result === yesOption;
}

async function formatAndSaveFile(path: string): Promise<void> {
  const document = await vscode.workspace.openTextDocument(path);
  await vscode.window.showTextDocument(document);

  // Does not work without additional delay :(
  await delay(100);

  await vscode.commands.executeCommand("editor.action.formatDocument");
  await vscode.commands.executeCommand("workbench.action.files.save");
}

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function prepareWidgetbookEntry(
  fileContentGenerator: FileContentGenerator
): string {
  const useGenerationApproach =
    Configuration.approach() === Approach.generation;

  const imports = fileContentGenerator.imports();
  const componentDeclaration = useGenerationApproach
    ? ""
    : fileContentGenerator.manualComponentDeclaration();
  const useCases = fileContentGenerator.useCases();

  const output = [imports, componentDeclaration, useCases].join("\n");

  return output;
}

export { createDirectoryIfNotExists, writeWidgetbookEntry };
