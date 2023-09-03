# Widgetbook Generator

## Overview

A [VSCode](https://code.visualstudio.com/) extension which helps you automate the process of adding new widget entries for [Widgetbook](https://www.widgetbook.io/) - a widget library for Flutter.

## Installation

The extension can be installed from the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=TODO).

## Configuration

A couple of settings need to be specified for the extension to work. They can be set in VSCode Settings after typing "widgetbook" in the searchbar.

- **Widgetbook Version** - should be set as the same version you use in your `pubspec.yaml` file.
- **Widgets Directory Path** - a directory in which you want to create new widgetbook entries. Whenever you use the extension to generate an entry for the widget, the generated file will be placed in this directory. The path is relative to the directory you have open in the VSCode.
- **Root Directory Name** - root name of the directory you have open in the VSCode. It's shown by default on the VSCode's app bar or on top of the file explorer tab. It's needed to correctly generate widgetbook path.
- **Barrel File Import** - the file which exports all your custom widgets. E.g. `package:my_common_ui/widgets.dart`

FIXME We need to add support for apps that don't use barrel files.

Those settings are purely project specific. If you work on multiple projects at the same time and all of them use widgetbook, you can override above settings for each of them. Just create `settings.json` file under `.vscode` directory in your project. You can override specific settings there just for the current workspace:

```json
{
  "widgetbook-generator.rootDirectoryName": "another-project",
  "widgetbook-generator.widgetbookVersion": "3.2.0"
}
```

## Usage

Put the cursor on the line with class name declaration, press a shortcut for `Quick Fix` action (FIXME Write defaults for different OSes here), then select option `Create widgetbook entry for this widget`. Make sure you've configured your extension first by following steps described in [Configuration](#configuration).

![demo](https://raw.githubusercontent.com/FirentisTFW/widgetbook-entries-generator/main/demo_gifs/generate_widgetbook_entry_preview.gif)

## Notes

This project is still in very early stage of development. If you find that something is not working properly or you think some features are missing, feel free to create an issue or even a pull request.

**Disclaimer**: This is not an official Widgetbook extension. It's made and maintained by the community.

<!-- ---------------------------------------------------------------- -->

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

Since the project is still in very early stage of development, some rules need to be followed for the extension to work correctly.

1. File must be formatted when generating entries.
2. Trailing commas in widget constructors must be used.

   Good:

   ```dart
   const Button({
       super.key,
       required this.label,
       required this.icon,
       this.onTap,
   });
   ```

   Bad:

   ```dart
   const Button(
       {super.key,
       required this.label,
       required this.icon,
       this.onTap});
   ```

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

- `myExtension.enable`: Enable/disable this extension.
- `myExtension.thing`: Set to `blah` to do something.
