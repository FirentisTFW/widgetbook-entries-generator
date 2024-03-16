import { DartClassConstructor, DartClassField } from "../../data/dart_class";

interface FileContentGenerator {
  imports(): string;

  manualComponentDeclaration(): string;

  useCases(): string;

  useCaseAnnotation(constructor: DartClassConstructor): string;

  useCase(constructor: DartClassConstructor): string;

  knobForField(field: DartClassField): string;
}

export { FileContentGenerator };
