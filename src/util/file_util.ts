import { writeFile } from "fs";
import { DartClass } from "../data/dart_class";
import { BaseFileContentGenerator } from "../generators/file_content/base_generator";
import { PathGeneratorFactory } from "../generators/path/factory";

const ENCODING = "utf8";

async function writeWidgetbookEntry(clazz: DartClass): Promise<void> {
  // FIXME Do this the right way - a class which handles different settings
  //  and chooses strategy based on that.

  const pathGenerator = PathGeneratorFactory.create();

  const filePath = pathGenerator.prepareWidgetbookEntryFilePath(clazz.name);

  if (filePath === null) {
    // TODO Show error dialog or something
    return;
  }

  const fileContentGenerator = new BaseFileContentGenerator(clazz);

  const imports = fileContentGenerator.imports();
  const componentDeclaration = fileContentGenerator.componentDeclaration();
  const useCases = fileContentGenerator.useCases();

  const output = [imports, componentDeclaration, useCases].join("\n");

  console.log(output);

  writeFile(filePath, output, ENCODING, (error) => {
    if (error) {
      console.log(error);
    }
  });
}

export { writeWidgetbookEntry };
