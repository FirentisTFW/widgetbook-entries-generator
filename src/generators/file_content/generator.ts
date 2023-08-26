import { DartClass, DartClassField } from "../../data/dart_class";

interface FileContentGenerator {
  clazz: DartClass;

  imports(): string;

  componentDeclaration(): string;

  useCases(): string;

  useCase(): string;

  knobForField(field: DartClassField): string;
}

export { FileContentGenerator };
