interface PathGenerator {
  prepareWidgetbookEntryFilePath(
    className: string,
    widgetFilePath: string
  ): string;

  prepareWidgetbookWidgetsDirectoryPath(widgetFilePath: string): string;

  prepareCustomKnobsFilePath(currentPath: string): string | null;
}

export { PathGenerator };
