import { DartClass } from "../data/dart_class";

async function writeWidgetbookEntry(clazz: DartClass): Promise<void> {
  // FIXME Do this the right way - a class which handles different settings
  //  and chooses strategy based on that.
  console.log("writeWidgetbookEntry");
}

export { writeWidgetbookEntry };
