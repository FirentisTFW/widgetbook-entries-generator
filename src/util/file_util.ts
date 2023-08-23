import { DartClass } from "../data/dart_class";
import { PathGeneratorFactory } from "../generators/path/factory";

async function writeWidgetbookEntry(clazz: DartClass): Promise<void> {
  // FIXME Do this the right way - a class which handles different settings
  //  and chooses strategy based on that.

  const pathGenerator = PathGeneratorFactory.create();

  const filePath = pathGenerator.prepareWidgetbookEntryFilePath(clazz.name);

  console.log(filePath);
}

export { writeWidgetbookEntry };
