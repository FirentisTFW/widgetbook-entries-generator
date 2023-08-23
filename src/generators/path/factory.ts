import { PathGenerator, PathGeneratorImpl } from "./generator";

abstract class PathGeneratorFactory {
  static create(): PathGenerator {
    // FIXME Write a comment explaining we can have more implementations in the future,
    //  for that we use the factory.
    return new PathGeneratorImpl();
  }
}

export { PathGeneratorFactory };
