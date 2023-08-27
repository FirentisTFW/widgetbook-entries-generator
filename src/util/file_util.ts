import { DartClass } from "../data/dart_class";
import { BaseFileContentGenerator } from "../generators/file_content/base_generator";
import { PathGeneratorFactory } from "../generators/path/factory";

async function writeWidgetbookEntry(clazz: DartClass): Promise<void> {
  // FIXME Do this the right way - a class which handles different settings
  //  and chooses strategy based on that.

  const pathGenerator = PathGeneratorFactory.create();

  const filePath = pathGenerator.prepareWidgetbookEntryFilePath(clazz.name);

  let output = "";

  const fileContentGenerator = new BaseFileContentGenerator(clazz);

  const imports = fileContentGenerator.imports();
  const componentDeclaration = fileContentGenerator.componentDeclaration();
  const useCases = fileContentGenerator.useCases();

  output = [imports, componentDeclaration, useCases].join("\n");

  console.log(output);
}

export { writeWidgetbookEntry };
