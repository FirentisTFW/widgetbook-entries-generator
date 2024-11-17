# Change Log

## 0.2.0

- Added multiple fixes and improvements to the widget parsing logic, including:
  - Factory constructors support,
  - Positional parameters support,
  - Constructors with assertions support.
  - Multiple classes in one line support.
- Added proper error handling.
- Removed parsing of not-widget classes (encoutered during use-case generation for the whole widget directory).
- Updated README to give more details on the setup part.

## 0.1.0

- First public release.
- Create widgets directory if it's not created yet when generating an entry.

## 0.0.3

- Added support for Widgetbook 3.4.0 and its knobs.
- Added support for custom user-defined knobs.
- Handled functions with multiple parameters as widget parameters.

## 0.0.2

- Fixed nullable number knobs.
- Added Widgetbook approach (manual/generation) to settings.
- Added a setting for number knob (input/slider).
- Added initial value for non-nullable text knobs.

## 0.0.1

- First internal release.
