import { doesLookingFurtherMakeSense, parseLinesToClassName } from "../dart_class_parser";

describe("doesLookingFurtherMakeSense", () => {
  test("when passed a line which is build() method signature, returns false ", () => {
    expect(doesLookingFurtherMakeSense("Widget build(BuildContext context)")).toBe(false);
  });

  test("when passed a line which is createState() method signature, returns false ", () => {
    expect(doesLookingFurtherMakeSense("createState() =>")).toBe(false);
  });

  test("when passed a line which is a variable declaration, returns true ", () => {
    expect(doesLookingFurtherMakeSense("final String name")).toBe(true);
  });

  test("when passed a line which is a closing parenthesis, returns true ", () => {
    expect(doesLookingFurtherMakeSense("),")).toBe(true);
  });
});

describe("parseLinesToClassName", () => {
  test("when passed empty array, returns empty string", () => {
    expect(parseLinesToClassName([])).toBe("");
  });

  test("when passed lines which don't contain class name declaration, returns empty string", () => {
    const lines = [
      "const Person({",
      "  required this.name,",
      "  required this.person,",
      "});",
      "",
      "final String name;",
      "final int age;",
    ];

    expect(parseLinesToClassName(lines)).toBe("");
  });

  test("when passed lines which contain class name declaration in one line, returns properly class name", () => {
    const lines = ["class MyWidget extends StatefulWidget {"];

    expect(parseLinesToClassName(lines)).toBe("MyWidget");
  });

  test("when passed lines which contain class name declaration in multiple lines, along with mixin, returns properly class name", () => {
    const lines = [
      "class ClassWithVeryLongNameThatWouldNotFitInOneLineBecauseItsTooLong",
      "   extends StatefulWidget with GreatWidgetMixin {",
    ];

    expect(parseLinesToClassName(lines)).toBe("ClassWithVeryLongNameThatWouldNotFitInOneLineBecauseItsTooLong");
  });
});
