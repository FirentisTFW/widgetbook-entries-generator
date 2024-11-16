import {
  DartClassConstructor,
  DartClassConstructorField,
  DartClassConstructorFieldPositionType,
  DartClassField,
} from "../data/dart_class";
import {
  doesLookingFurtherMakeSense,
  isConstructorLine,
  parseLinesToClassFields,
  parseLinesToClassName,
  parseLinesToConstructors,
} from "../util/dart_class_parser";
import "../util/extensions";

describe("doesLookingFurtherMakeSense", () => {
  test("when passed a line which is build() method signature, returns false ", () => {
    expect(
      doesLookingFurtherMakeSense("Widget build(BuildContext context)")
    ).toBe(false);
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
  test("when passed an empty array, returns empty string", () => {
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

  test("when passed lines which contain class name declaration in one line, returns class name", () => {
    const lines = ["class MyWidget extends StatefulWidget {"];

    expect(parseLinesToClassName(lines)).toBe("MyWidget");
  });

  test("when passed lines which contain class name declaration in multiple lines, along with mixin, returns class name", () => {
    const lines = [
      "class ClassWithVeryLongNameThatWouldNotFitInOneLineBecauseItsTooLong",
      "   extends StatefulWidget with GreatWidgetMixin {",
    ];

    expect(parseLinesToClassName(lines)).toBe(
      "ClassWithVeryLongNameThatWouldNotFitInOneLineBecauseItsTooLong"
    );
  });
});

describe("parseLinesToClassFields", () => {
  test("when passed empty array, returns an empty array", () => {
    expect(parseLinesToClassFields([])).toEqual([]);
  });

  test("when passed single final field with correct indent, returns it", () => {
    const lines = ["  final String name;"];

    expect(parseLinesToClassFields(lines)).toEqual([
      new DartClassField("name", "String"),
    ]);
  });

  test("when passed multiple final fields with correct indents, returns them", () => {
    const lines = [
      "  final String name;",
      "  final int age;",
      "  final Gender? gender;",
    ];

    expect(parseLinesToClassFields(lines)).toEqual([
      new DartClassField("name", "String"),
      new DartClassField("age", "int"),
      new DartClassField("gender", "Gender", true),
    ]);
  });

  test("when passed a single line which is not a class field, returns an empty arrays", () => {
    const lines = ["Widget build(BuildContext context) {"];

    expect(parseLinesToClassFields(lines)).toEqual([]);
  });

  test("when passed multiple lines which are not class fields, returns an empty arrays", () => {
    const lines = [
      "@override",
      "Widget build(BuildContext context) {",
      "  return IconButton(",
      "    icon: Icons.arrowLeft,",
      "    semanticsLabel: context.l10n.back,",
      "    onTap: context.pop,",
      "  );",
      "}",
    ];

    expect(parseLinesToClassFields(lines)).toEqual([]);
  });

  test("when passed multiple final fields, some with not correct indents (so no class fields) and some with correct indents, returns fields with correct indents", () => {
    const lines = [
      "final String name;",
      "final int? age;",
      "  final String nameCorrect;",
      "  final int? ageCorrect;",
    ];

    expect(parseLinesToClassFields(lines)).toEqual([
      new DartClassField("nameCorrect", "String"),
      new DartClassField("ageCorrect", "int", true),
    ]);
  });

  describe("when passed a StatelessWidget", () => {
    test("with fields after constructor, returns them", () => {
      const lines = [
        "class Button extends StatelessWidget {",
        "  const Button({",
        "    super.key,",
        "    required this.title,",
        "    required this.type,",
        "    this.onTap,",
        "  });",
        "",
        "  final String title;",
        "  final ButtonType type;",
        "  final VoidCallback? onTap;",
        "",
        "  @override",
        "  Widget build(BuildContext context) {",
        "    return const SizedBox.shrink();",
        "  }",
        "}",
      ];

      expect(parseLinesToClassFields(lines)).toEqual([
        new DartClassField("title", "String"),
        new DartClassField("type", "ButtonType"),
        new DartClassField("onTap", "VoidCallback", true),
      ]);
    });

    test("with fields before constructor, returns them", () => {
      const lines = [
        "class Button extends StatelessWidget {",
        "  final String title;",
        "  final ButtonType type;",
        "  final VoidCallback? onTap;",
        "",
        "  const Button({",
        "    super.key,",
        "    required this.title,",
        "    required this.type,",
        "    this.onTap,",
        "  });",
        "",
        "  @override",
        "  Widget build(BuildContext context) {",
        "    return const SizedBox.shrink();",
        "  }",
        "}",
      ];

      expect(parseLinesToClassFields(lines)).toEqual([
        new DartClassField("title", "String"),
        new DartClassField("type", "ButtonType"),
        new DartClassField("onTap", "VoidCallback", true),
      ]);
    });

    test("with no fields, returns an empty array", () => {
      const lines = [
        "class Button extends StatelessWidget {",
        "  const Button({super.key});",
        "",
        "  @override",
        "  Widget build(BuildContext context) {",
        "    return const SizedBox.shrink();",
        "  }",
        "}",
      ];

      expect(parseLinesToClassFields(lines)).toEqual([]);
    });

    test("with fields that are functions, returns them", () => {
      const lines = [
        "class Button extends StatelessWidget {",
        "  final void Function() fun1;",
        "  final CustomClass Function(_) fun2;",
        "  final CustomClass Function(CustomClass param1, CustomClass param2)? fun3;",
        "  final (CustomClass, CustomClass2) Function(CustomClass param1, param2)? fun4;",
        "",
        "  const Button({",
        "    super.key,",
        "    required this.fun1,",
        "    required this.fun2,",
        "    this.fun3,",
        "    this.fun4,",
        "  });",
        "",
        "  @override",
        "  Widget build(BuildContext context) {",
        "    return const SizedBox.shrink();",
        "  }",
        "}",
      ];

      expect(parseLinesToClassFields(lines)).toEqual([
        new DartClassField("fun1", "void Function()"),
        new DartClassField("fun2", "CustomClass Function(_)"),
        new DartClassField(
          "fun3",
          "CustomClass Function(CustomClass param1, CustomClass param2)",
          true
        ),
        new DartClassField(
          "fun4",
          "(CustomClass, CustomClass2) Function(CustomClass param1, param2)",
          true
        ),
      ]);
    });
  });
  describe("when passed a StatefulWidget", () => {
    test("with fields after constructor, returns them", () => {
      const lines = [
        "class Button extends StatefulWidget {",
        "  const Button({",
        "    super.key,",
        "    required this.title,",
        "    required this.type,",
        "    this.onTap,",
        "  });",
        "",
        "  final String title;",
        "  final ButtonType type;",
        "  final VoidCallback? onTap;",
        "",
        "@override",
        "State<Button> createState() => _ButtonState();",
        "}",
      ];

      expect(parseLinesToClassFields(lines)).toEqual([
        new DartClassField("title", "String"),
        new DartClassField("type", "ButtonType"),
        new DartClassField("onTap", "VoidCallback", true),
      ]);
    });

    test("with fields before constructor, returns them", () => {
      const lines = [
        "class Button extends StatefulWidget {",
        "  final String title;",
        "  final ButtonType type;",
        "  final VoidCallback? onTap;",
        "",
        "  const Button({",
        "    super.key,",
        "    required this.title,",
        "    required this.type,",
        "    this.onTap,",
        "  });",
        "",
        "@override",
        "State<Button> createState() => _ButtonState();",
        "}",
      ];

      expect(parseLinesToClassFields(lines)).toEqual([
        new DartClassField("title", "String"),
        new DartClassField("type", "ButtonType"),
        new DartClassField("onTap", "VoidCallback", true),
      ]);
    });

    test("with no fields, returns an empty array", () => {
      const lines = [
        "class Button extends StatefulWidget {",
        "  const Button({super.key});",
        "",
        "@override",
        "State<Button> createState() => _ButtonState();",
        "}",
      ];

      expect(parseLinesToClassFields(lines)).toEqual([]);
    });
  });

  test("when passed two widgets with fields, returns only fields from the first widget", () => {
    const lines = [
      "class FirstWidget extends StatelessWidget {",
      "  const FirstWidget({",
      "    super.key,",
      "    required this.title1,",
      "    required this.onTap1,",
      "  });",
      "",
      "  final String title1;",
      "  final VoidCallback onTap1;",
      "",
      "  @override",
      "  Widget build(BuildContext context) {",
      "    return const SizedBox.shrink();",
      "  }",
      "}",
      "",
      "class SecondWidget extends StatelessWidget {",
      "  const SecondWidget({",
      "    super.key,",
      "    required this.title2,",
      "    required this.onTap2,",
      "  });",
      "",
      "  final String title2;",
      "  final VoidCallback onTap2;",
      "",
      "  @override",
      "  Widget build(BuildContext context) {",
      "    return const SizedBox.shrink();",
      "  }",
      "}",
    ];

    expect(parseLinesToClassFields(lines)).toEqual([
      new DartClassField("title1", "String"),
      new DartClassField("onTap1", "VoidCallback"),
    ]);
  });
});

describe("isConstructorLine", () => {
  test("when passed an empty line, returns false", () => {
    expect(isConstructorLine("", "Loader")).toBe(false);
  });

  test("when passed a empty line which contains class name and parenthesis, returns false", () => {
    expect(isConstructorLine("void foo(Loader bar) {", "Loader")).toBe(false);
  });

  describe("constructor only with named parameters", () => {
    test("when passed a regular constructor declaration, returns true", () => {
      expect(isConstructorLine("Loader({", "Loader")).toBe(true);
    });

    test("when passed a regular constructor declaration wit all parameters in one line, returns true", () => {
      expect(
        isConstructorLine(
          "const Loader({super.key, this.active = true, this.semanticsLabel});",
          "Loader"
        )
      ).toBe(true);
    });

    test("when passed a named constructor declaration, returns true", () => {
      expect(isConstructorLine("Loader.named({", "Loader")).toBe(true);
    });

    test("when passed other class' regular constructor declaration that starts with desired class' name, returns false", () => {
      expect(isConstructorLine("LoaderButDifferent({", "Loader")).toBe(false);
    });

    test("when passed other class' named constructor declaration that starts with desired class' name, returns false", () => {
      expect(isConstructorLine("LoaderButDifferent.named({", "Loader")).toBe(
        false
      );
    });
  });

  describe("constructor with positional parameters", () => {
    test("when passed a regular constructor declaration, returns true", () => {
      expect(isConstructorLine("Loader(", "Loader")).toBe(true);
    });

    test("when passed a named constructor declaration, returns true", () => {
      expect(isConstructorLine("Loader.named(", "Loader")).toBe(true);
    });

    test("when passed other class' regular constructor declaration that starts with desired class' name, returns false", () => {
      expect(isConstructorLine("LoaderButDifferent(", "Loader")).toBe(false);
    });

    test("when passed other class' named constructor declaration that starts with desired class' name, returns false", () => {
      expect(isConstructorLine("LoaderButDifferent.named(", "Loader")).toBe(
        false
      );
    });
  });
});

describe("parseLinesToConstructors", () => {
  test("when passed an empty array, returns an empty array", () => {
    expect(parseLinesToConstructors([], "Loader", [])).toEqual([]);
  });

  describe("regular constructor", () => {
    test("does not use super params", () => {
      const lines = [
        "  const Loader({",
        "    super.key,",
        "    required super.active,",
        "  })",
      ];
      const classFields = [new DartClassField("active", "bool")];

      expect(parseLinesToConstructors(lines, "Loader", classFields)).toEqual([
        new DartClassConstructor(false, [], null),
      ]);
    });

    test("with named fields that are all class fields", () => {
      const lines = [
        "  const Loader({",
        "    super.key,",
        "    this.active = true,",
        "    this.semanticsLabel,",
        "  })",
      ];
      const classFields = [
        new DartClassField("active", "bool"),
        new DartClassField("semanticsLabel", "String"),
        // class can have more fields which are not in the main constructor part because they are in its initializer list
        new DartClassField("text", "String"),
        new DartClassField("icon", "IconData"),
      ];

      expect(parseLinesToConstructors(lines, "Loader", classFields)).toEqual([
        new DartClassConstructor(
          false,
          [
            new DartClassConstructorField("active", "bool"),
            new DartClassConstructorField("semanticsLabel", "String"),
          ],
          null
        ),
      ]);
    });

    test("with only positional fields that are all class fields", () => {
      const lines = [
        "  const Loader(",
        "    this.active,",
        "    this.semanticsLabel,",
        "  )",
      ];
      const classFields = [
        new DartClassField("active", "bool"),
        new DartClassField("semanticsLabel", "String"),
        // class can have more fields which are not in the main constructor part because they are in its initializer list
        new DartClassField("text", "String"),
        new DartClassField("icon", "IconData"),
      ];

      expect(parseLinesToConstructors(lines, "Loader", classFields)).toEqual([
        new DartClassConstructor(
          false,
          [
            new DartClassConstructorField(
              "active",
              "bool",
              DartClassConstructorFieldPositionType.positional
            ),
            new DartClassConstructorField(
              "semanticsLabel",
              "String",
              DartClassConstructorFieldPositionType.positional
            ),
          ],
          null
        ),
      ]);
    });

    // TODO Add support for one-line constructors and constructors without trailing comma
    // test("all parameters in one line", () => {
    //   const lines = [
    //     "  const Loader({super.key, this.active = true, this.semanticsLabel});",
    //   ];
    //   const classFields = [
    //     new DartClassConstructorField("active", "bool"),
    //     new DartClassConstructorField("semanticsLabel", "String"),
    //   ];

    //   expect(parseLinesToConstructors(lines, "Loader", classFields)).toEqual([
    //     new DartClassConstructor(false, classFields, null)
    //   ]);
    // });

    test("with named fields of which some are class fields and some are custom fields", () => {
      const lines = [
        "  const Loader({",
        "    super.key,",
        "    this.active = true,",
        "    this.semanticsLabel,",
        "    bool big = false,",
        "    required bool animated,",
        "  })",
      ];
      const classFields = [
        new DartClassField("active", "bool"),
        new DartClassField("semanticsLabel", "String"),
        new DartClassField("text", "String"),
        new DartClassField("icon", "IconData"),
      ];

      expect(parseLinesToConstructors(lines, "Loader", classFields)).toEqual([
        new DartClassConstructor(
          false,
          [
            new DartClassConstructorField("active", "bool"),
            new DartClassConstructorField("semanticsLabel", "String"),
            new DartClassConstructorField("big", "bool"),
            new DartClassConstructorField("animated", "bool"),
          ],
          null
        ),
      ]);
    });

    test("with positional fields and named fields", () => {
      const lines = [
        "  const Loader(",
        "    this.active, {",
        "    super.key,",
        "    this.semanticsLabel,",
        "    bool big = false,",
        "    required bool animated,",
        "  })",
      ];
      const classFields = [
        new DartClassField("active", "bool"),
        new DartClassField("semanticsLabel", "String"),
        new DartClassField("text", "String"),
        new DartClassField("icon", "IconData"),
      ];

      expect(parseLinesToConstructors(lines, "Loader", classFields)).toEqual([
        new DartClassConstructor(
          false,
          [
            new DartClassConstructorField(
              "active",
              "bool",
              DartClassConstructorFieldPositionType.positional
            ),
            new DartClassConstructorField("semanticsLabel", "String"),
            new DartClassConstructorField("big", "bool"),
            new DartClassConstructorField("animated", "bool"),
          ],
          null
        ),
      ]);
    });

    test("with assert at the end", () => {
      const lines = [
        "  const Loader(",
        "    this.active, {",
        "    super.key,",
        "    this.semanticsLabel,",
        "    bool big = false,",
        "    required bool animated,",
        "  }) : assert(animated || big);",
      ];
      const classFields = [
        new DartClassField("active", "bool"),
        new DartClassField("semanticsLabel", "String"),
        new DartClassField("text", "String"),
        new DartClassField("icon", "IconData"),
      ];

      expect(parseLinesToConstructors(lines, "Loader", classFields)).toEqual([
        new DartClassConstructor(
          false,
          [
            new DartClassConstructorField(
              "active",
              "bool",
              DartClassConstructorFieldPositionType.positional
            ),
            new DartClassConstructorField("semanticsLabel", "String"),
            new DartClassConstructorField("big", "bool"),
            new DartClassConstructorField("animated", "bool"),
          ],
          null
        ),
      ]);
    });

    test("with multiline assert with message at the end", () => {
      const lines = [
        "  const Loader(",
        "    this.active, {",
        "    super.key,",
        "    this.semanticsLabel,",
        "    bool big = false,",
        "    required bool animated,",
        "  }) : assert(",
        "          animated || big,",
        "          'Either animated or big',",
        "        );",
      ];
      const classFields = [
        new DartClassField("active", "bool"),
        new DartClassField("semanticsLabel", "String"),
        new DartClassField("text", "String"),
        new DartClassField("icon", "IconData"),
      ];

      expect(parseLinesToConstructors(lines, "Loader", classFields)).toEqual([
        new DartClassConstructor(
          false,
          [
            new DartClassConstructorField(
              "active",
              "bool",
              DartClassConstructorFieldPositionType.positional
            ),
            new DartClassConstructorField("semanticsLabel", "String"),
            new DartClassConstructorField("big", "bool"),
            new DartClassConstructorField("animated", "bool"),
          ],
          null
        ),
      ]);
    });
  });

  describe("named constructor", () => {
    test("does not use super params", () => {
      const lines = [
        "  const Loader.small({",
        "    super.key,",
        "    required super.active,",
        "  })",
      ];
      const classFields = [new DartClassConstructorField("active", "bool")];

      expect(parseLinesToConstructors(lines, "Loader", classFields)).toEqual([
        new DartClassConstructor(true, [], "small"),
      ]);
    });

    test("with named fields that are all class fields", () => {
      const lines = [
        "  const Loader.small({",
        "    super.key,",
        "    this.active = true,",
        "    this.semanticsLabel,",
        "  }) : big = false,",
      ];
      const classFields = [
        new DartClassField("active", "bool"),
        new DartClassField("semanticsLabel", "String"),
        // class can have more fields which are not in the main constructor part because they are in its initializer list
        new DartClassField("text", "String"),
        new DartClassField("icon", "IconData"),
      ];

      expect(parseLinesToConstructors(lines, "Loader", classFields)).toEqual([
        new DartClassConstructor(
          true,
          [
            new DartClassConstructorField("active", "bool"),
            new DartClassConstructorField("semanticsLabel", "String"),
          ],
          "small"
        ),
      ]);
    });

    test("with named fields of which some are class fields and some are custom fields", () => {
      const lines = [
        "  const Loader.small({",
        "    super.key,",
        "    this.active = true,",
        "    this.semanticsLabel,",
        "    bool big = false,",
        "    required bool animated,",
        "  })",
      ];
      const classFields = [
        new DartClassField("active", "bool"),
        new DartClassField("semanticsLabel", "String"),
        new DartClassField("text", "String"),
        new DartClassField("icon", "IconData"),
      ];

      expect(parseLinesToConstructors(lines, "Loader", classFields)).toEqual([
        new DartClassConstructor(
          true,
          [
            new DartClassConstructorField("active", "bool"),
            new DartClassConstructorField("semanticsLabel", "String"),
            new DartClassConstructorField("big", "bool"),
            new DartClassConstructorField("animated", "bool"),
          ],
          "small"
        ),
      ]);
    });

    test("with positional fields and named fields", () => {
      const lines = [
        "  Loader.small(",
        "    this.active,",
        "    this.semanticsLabel, {",
        "    super.key,",
        "    bool big = false,",
        "    required bool animated,",
        "  })",
      ];
      const classFields = [
        new DartClassField("active", "bool"),
        new DartClassField("semanticsLabel", "String"),
        new DartClassField("text", "String"),
        new DartClassField("icon", "IconData"),
      ];

      expect(parseLinesToConstructors(lines, "Loader", classFields)).toEqual([
        new DartClassConstructor(
          true,
          [
            new DartClassConstructorField(
              "active",
              "bool",
              DartClassConstructorFieldPositionType.positional
            ),
            new DartClassConstructorField(
              "semanticsLabel",
              "String",
              DartClassConstructorFieldPositionType.positional
            ),
            new DartClassConstructorField("big", "bool"),
            new DartClassConstructorField("animated", "bool"),
          ],
          "small"
        ),
      ]);
    });

    test("with complicated expressions in initializer list", () => {
      const lines = [
        "  Loader.small(",
        "    this.active, {",
        "    super.key,",
        "    bool big = false,",
        "    required bool animated,",
        "  }) : semanticsLabel = List.filled(40, '*').join()",
      ];
      const classFields = [
        new DartClassField("active", "bool"),
        new DartClassField("semanticsLabel", "String"),
        new DartClassField("text", "String"),
        new DartClassField("icon", "IconData"),
      ];

      expect(parseLinesToConstructors(lines, "Loader", classFields)).toEqual([
        new DartClassConstructor(
          true,
          [
            new DartClassConstructorField(
              "active",
              "bool",
              DartClassConstructorFieldPositionType.positional
            ),
            new DartClassConstructorField("big", "bool"),
            new DartClassConstructorField("animated", "bool"),
          ],
          "small"
        ),
      ]);
    });

    test("with complicated multiline expressions in initializer list", () => {
      const lines = [
        "  Loader.small(",
        "    this.active, {",
        "    super.key,",
        "    bool big = false,",
        "    required bool animated,",
        "  })  : semanticsLabel = List.filled(40, '*').join(",
        "          'lala',",
        "        ),",
      ];
      const classFields = [
        new DartClassField("active", "bool"),
        new DartClassField("semanticsLabel", "String"),
        new DartClassField("text", "String"),
        new DartClassField("icon", "IconData"),
      ];

      expect(parseLinesToConstructors(lines, "Loader", classFields)).toEqual([
        new DartClassConstructor(
          true,
          [
            new DartClassConstructorField(
              "active",
              "bool",
              DartClassConstructorFieldPositionType.positional
            ),
            new DartClassConstructorField("big", "bool"),
            new DartClassConstructorField("animated", "bool"),
          ],
          "small"
        ),
      ]);
    });
  });

  describe("factory constructor", () => {
    test("without parameters", () => {
      const lines = [
        "  factory Loader.randomText() {",
        "    return Loader.text(",
        "      text: 'Random Text',",
        "    );",
        "  }",
      ];
      const classFields = [new DartClassField("icon", "IconData")];

      expect(parseLinesToConstructors(lines, "Loader", classFields)).toEqual([
        new DartClassConstructor(true, [], "randomText"),
      ]);
    });

    test("with positional parameters", () => {
      const lines = [
        "  factory Loader.randomText(",
        "    bool active,",
        "    String label,",
        "  ) {",
        "    return Loader.text(",
        "      text: 'Random Text',",
        "    );",
        "  }",
      ];
      const classFields = [new DartClassField("icon", "IconData")];

      expect(parseLinesToConstructors(lines, "Loader", classFields)).toEqual([
        new DartClassConstructor(
          true,
          [
            new DartClassConstructorField(
              "active",
              "bool",
              DartClassConstructorFieldPositionType.positional
            ),
            new DartClassConstructorField(
              "label",
              "String",
              DartClassConstructorFieldPositionType.positional
            ),
          ],
          "randomText"
        ),
      ]);
    });

    test("with named parameters", () => {
      const lines = [
        "  factory Loader.randomText({",
        "    required bool active,",
        "    required String label,",
        "  }) {",
        "    return Loader.text(",
        "      text: 'Random Text',",
        "    );",
        "  }",
      ];
      const classFields = [new DartClassField("icon", "IconData")];

      expect(parseLinesToConstructors(lines, "Loader", classFields)).toEqual([
        new DartClassConstructor(
          true,
          [
            new DartClassConstructorField("active", "bool"),
            new DartClassConstructorField("label", "String"),
          ],
          "randomText"
        ),
      ]);
    });
  });
});
