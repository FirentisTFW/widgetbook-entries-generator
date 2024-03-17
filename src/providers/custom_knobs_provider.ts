import * as vscode from "vscode";
import { CustomKnob } from "../data/custom_knob";

class CustomKnobsProvider {
  async getCustomKnobs(filePath: string | null): Promise<Array<CustomKnob>> {
    if (!filePath) return [];

    try {
      const fileContent = await vscode.workspace.fs.readFile(
        vscode.Uri.file(filePath)
      );
      const fileContentString = Buffer.from(fileContent).toString("utf-8");
      const parsedContent = JSON.parse(fileContentString);
      return parsedContent
        .map((item: object) => {
          try {
            return CustomKnob.fromJson(item);
          } catch (error) {
            console.error("Error parsing custom knob:", error);
            return null;
          }
        })
        .whereNotNull();
    } catch (error) {
      console.error("Error reading JSON file:", error);
      return [];
    }
  }
}

export { CustomKnobsProvider };
