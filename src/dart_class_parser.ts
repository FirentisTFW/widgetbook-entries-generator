import {
  DartClass,
  DartClassConstructor,
  DartClassField,
} from "./data/dart_class";

function parseTextToClass(text: string): DartClass {
  const lines = text.split("\n").filter((line) => line !== "");

  const classFields = parseLinesToClassFields(lines);
  const className = parseLinesToClassName(lines);
  const construtors = parseLinesToConstructors(lines, className, classFields);

  const clazz = new DartClass(className, classFields, construtors);

  return clazz;
}

function parseLinesToClassFields(input: Array<string>): Array<DartClassField> {
  // Two spaces in the beginning - it has to be a class property.
  const classFieldLinePrefix = "  final";

  const lines = removeComments(input);
  const fieldListStartIndex = lines.findIndex((line) =>
    line.startsWith(classFieldLinePrefix)
  );
  if (fieldListStartIndex === -1) return [];

  let fieldListEndIndex = fieldListStartIndex;
  for (let i = fieldListStartIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!doesLookingFurtherMakeSense(line)) break;

    const isClassFieldLine =
      line.endsWith(";") && line.startsWith(classFieldLinePrefix);

    // Class fields can occupy two lines if the field name is long.
    const isPreviousLineUnfinishedClassField =
      lines[i - 1].startsWith(classFieldLinePrefix) &&
      !lines[i - 1].includes(";");

    if (isClassFieldLine || isPreviousLineUnfinishedClassField) {
      fieldListEndIndex = i;
    }
  }

  const fieldListLines = lines
    .slice(fieldListStartIndex, fieldListEndIndex + 1)
    .join("")
    .replace(/\s+/g, " ")
    .trim()
    .split(";")
    .filter((line) => line !== "");

  return fieldListLines.map((line) => {
    const lineParts = line.trim().split(" ");
    const type = lineParts[1];
    const name = lineParts[2].replace(";", "");

    return new DartClassField(name, type);
  });
}

function parseLinesToClassName(lines: Array<string>): string {
  // TODO What about class modifiers? Are they used in widgets too?
  return lines.find((line) => line.startsWith("class "))?.split(" ")[1] ?? "";
}

function parseLinesToConstructors(
  lines: Array<string>,
  className: string,
  classFields: Array<DartClassField>
): Array<DartClassConstructor> {
  const constructors: Array<DartClassConstructor> = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!doesLookingFurtherMakeSense(line)) break;

    if (!isConstructorLine(line, className)) {
      i++;
      continue;
    }

    for (let j = i; j < lines.length; j++) {
      // TODO Consider counting open and closed parenthesis to check whether constructor got closed
      if (!isEndOfMainConstructorPart(line)) continue;

      const constructorContent = lines.slice(i, j + 1);
      const constructor = parseLinesToConstructor(
        constructorContent,
        className,
        classFields
      );
      if (constructor !== null) constructors.push(constructor);

      i = j + 1;
      break;
    }
  }

  return constructors;
}

function isConstructorLine(line: string, className: string): boolean {
  return (
    line.includes(`${className}(`) ||
    (line.includes(`${className}.`) && line.includes("("))
  );
}

function isEndOfMainConstructorPart(line: string): boolean {
  return (
    line.includes("});") || line.includes("}) :") || line.includes("})  :")
  );
}

function parseLinesToConstructor(
  lines: Array<string>,
  className: string,
  allClassFields: Array<DartClassField>
): DartClassConstructor | null {
  if (!lines.length) return null;
  const classFieldReference = "this.";
  const nameLine = lines.shift() as string;

  const isNamed = nameLine.includes(`${className}.`);
  const constructorName = isNamed
    ? nameLine.substring(nameLine.indexOf(".") + 1, nameLine.indexOf("({"))
    : null;

  const fieldsLines = lines
    .join("")
    .split(",")
    // TODO Modify the line below when adding support for one-line constructors
    .filter((line) => line !== "" && !line.includes("})"));
  const classFieldsLines = fieldsLines.filter((line) =>
    line.includes(classFieldReference)
  );

  const classFieldsNames = classFieldsLines.map((line) => {
    const lineFromFieldName = line.substringAfter(classFieldReference);
    const hasDefaultValue = lineFromFieldName.includes(" = ");
    if (hasDefaultValue) {
      return lineFromFieldName.substring(0, lineFromFieldName.indexOf(" = "));
    }
    return lineFromFieldName;
  });

  const classFields = classFieldsNames
    .map((fieldName) =>
      allClassFields.find((field) => field.name === fieldName)
    )
    .whereType<DartClassField>();

  const customFieldsLines = fieldsLines.filter(
    (line) => !line.includes(classFieldReference) && !line.includes("super.")
  );

  const customFields = customFieldsLines.map((line) => {
    const lineParts = line.trim().split(" ");
    if (line.includes("required")) {
      return new DartClassField(lineParts[2], lineParts[1]);
    }
    return new DartClassField(lineParts[1], lineParts[0]);
  });

  return new DartClassConstructor(
    constructorName !== null,
    [...classFields, ...customFields],
    constructorName
  );
}

function doesLookingFurtherMakeSense(line: string): boolean {
  return (
    !line.includes("Widget build(BuildContext context)") &&
    !line.includes("createState() =>")
  );
}

function removeComments(lines: Array<string>): Array<string> {
  return lines.filter((line) => !line.trim().startsWith("//"));
}

export {
  doesLookingFurtherMakeSense,
  isConstructorLine,
  parseLinesToClassFields,
  parseLinesToClassName,
  parseLinesToConstructor,
};
