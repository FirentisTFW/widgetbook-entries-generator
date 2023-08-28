import { writeFile } from "fs";
import { DartClass } from "../data/dart_class";
import { FileContentGeneratorFactory } from "../generators/file_content/factory";
import { PathGeneratorFactory } from "../generators/path/factory";

const ENCODING = "utf8";

async function writeWidgetbookEntry(clazz: DartClass): Promise<void> {
  const pathGenerator = PathGeneratorFactory.create();

  const filePath = pathGenerator.prepareWidgetbookEntryFilePath(clazz.name);

  if (filePath === null) {
    // TODO Show error dialog or something
    return;
  }

  const fileContent = prepareWidgetbookEntryFor(clazz);

  // FIXME Check whether a file already exists, offer different options then

  writeFile(filePath, fileContent, ENCODING, (error) => {
    if (error) {
      console.log(error);
    }
  });
}

function prepareWidgetbookEntryFor(clazz: DartClass) {
  const fileContentGenerator = FileContentGeneratorFactory.create(clazz);

  const imports = fileContentGenerator.imports();
  const componentDeclaration = fileContentGenerator.componentDeclaration();
  const useCases = fileContentGenerator.useCases();

  const output = [imports, componentDeclaration, useCases].join("\n");

  return output;
}

export { writeWidgetbookEntry };
