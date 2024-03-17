interface PathGenerator {
  prepareWidgetbookEntryFilePath(
    className: string,
    widgetFilePath: string
  ): string | null;

  prepareCustomKnobsFilePath(currentPath: string): string | null;
}

export { PathGenerator };
