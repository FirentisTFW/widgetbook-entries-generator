interface PathGenerator {
  prepareWidgetbookEntryFilePath(
    className: string,
    widgetFilePath: string
  ): string | null;
}

export { PathGenerator };
