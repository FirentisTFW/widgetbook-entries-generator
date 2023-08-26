interface PathGenerator {
  prepareWidgetbookEntryFilePath(className: string): string | null;
}

export { PathGenerator };
