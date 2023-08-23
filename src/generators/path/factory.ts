import { PathGenerator, PathGeneratorImpl } from "./generator";

abstract class PathGeneratorFactory {
  static create(): PathGenerator {
    // For now we only have one implementation of PathGenerator, but in the future
    // various strategies of generating widgetbook entries might be available.
    // That's why we use a factory here.
    //
    // In this function, based on some configuration settings,
    // a particular strategy might be chosen.
    return new PathGeneratorImpl();
  }
}

export { PathGeneratorFactory };
