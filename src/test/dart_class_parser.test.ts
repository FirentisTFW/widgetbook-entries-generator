import { doesLookingFurtherMakeSense } from "../dart_class_parser";

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
