enum WidgetbookVersion {
  v3_0_0,
  v3_2_0,
}

function parseWidgetbookVersion(version: string): WidgetbookVersion {
  switch (version) {
    case "3.0.0":
      return WidgetbookVersion.v3_0_0;
    case "3.2.0":
      return WidgetbookVersion.v3_2_0;
  }

  throw new Error(`This widgetbook version is not handled: ${version}`);
}

export { WidgetbookVersion, parseWidgetbookVersion };
