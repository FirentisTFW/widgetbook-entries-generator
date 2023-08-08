const input =
  `class SHSlider extends StatefulWidget {
  const SHSlider.continuous({
    super.key,
    required this.labels,
    this.thumbSize = SHSliderThumbSize.large,
    required this.value,
    required this.onChangedonChangedonChangedonChangedonChangedonChangedonChangedonChanged,
    this.enabledenabledenabledenabledenabledenabledenabledenabledenabledenabledenabled =
        true,
  })  : discrete = false,
        segments = false,
        assert(value >= 0 && value <= 1);

  SHSlider.discrete({
    super.key,
    required this.labels,
    this.thumbSize = SHSliderThumbSize.large,
    this.segments = false,
    required this.value,
    bool good = true,
    required bool bad,
    required this.onChangedonChangedonChangedonChangedonChangedonChangedonChangedonChanged,
    this.enabledenabledenabledenabledenabledenabledenabledenabledenabledenabledenabled =
        true,
  })  : discrete = true,
        assert(value >= 0 && value <= 1),
        assert(
          () {
            final segmentWidth = 1 / (labels.stops - 1);
            final remainder = (value / segmentWidth) % 1;

            return remainder == 0;
          }(),
          'Initial value must fall on an actual stop for discrete slider.',
        );

  final SHSliderLabels labels;
  final SHSliderThumbSize thumbSize;
  final double value;
  final ValueChanged<double>
      onChangedonChangedonChangedonChangedonChangedonChangedonChangedonChanged;
  final bool discrete;
  final bool segments;
  final bool
      enabledenabledenabledenabledenabledenabledenabledenabledenabledenabledenabled;

  static const skeleton = _Skeleton.new;

  @override
  SHSliderState createState() => SHSliderState();
}

@visibleForTesting
class SHSliderState extends State<SHSlider>
    with SingleTickerProviderStateMixin {
  late final AnimationController _animationController;
  // Value of the slider without any animations. Useful for checking whether
  // the slider value should be updated with a new value.
  late var _targetValue = widget.value;

  var _duringDrag = false;

  final _sliderKey = GlobalKey();
  final _startLabelKey = GlobalKey();
  final _endLabelKey = GlobalKey();

  SHSliderLabels get _labels => widget.labels;

  @visibleForTesting
  double get thumbPosition => _animationController.value;

  @override
  void initState() {
    super.initState();

    _animationController = AnimationController(
      value: _targetValue,
      vsync: this,
      duration: const Duration(milliseconds: 200),
    );
  }

  @override
  void didUpdateWidget(SHSlider oldWidget) {
    super.didUpdateWidget(oldWidget);

    if (_targetValue != widget.value && !_duringDrag) {
      // Look also at _handleDragEnd.
      _targetValue = widget.value;
      _rawAnimateTo(_targetValue);
    }
  }

  @override
  void dispose() {
    _animationController.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final valueFormat = NumberFormat.percentPattern(context.locale);

    return AnimatedBuilder(
      animation: _animationController,
      builder: (_, child) => Semantics(
        container: true,
        slider: true,
        enabled: widget.enabled,
        hint: _labels.getSemanticsLabel(context.l10n),
        value: valueFormat.format(_animationController.value),
        increasedValue: valueFormat
            .format((_animationController.value + _step).clamp(0.0, 1.0)),
        decreasedValue: valueFormat
            .format((_animationController.value - _step).clamp(0.0, 1.0)),
        onIncrease: _onIncrease,
        onDecrease: _onDecrease,
        excludeSemantics: true,
        child: child,
      ),
      child: GestureDetector(
        key: _sliderKey,
        behavior: HitTestBehavior.opaque,
        onHorizontalDragStart: _handleDragStart,
        onHorizontalDragUpdate: _handleDragUpdate,
        onHorizontalDragEnd: _handleDragEnd,
        onTapUp: _handleTapUp,
        child: Column(
          children: [
            if (_labels.labels.isNotEmpty)
              _buildTopLabels(
                _labels.labels,
                context.colorTheme.defaultContentSecondary,
              ),
            SHIconTheme(
              color: context.colorTheme.defaultContentSecondary,
              child: _buildTrackAndSideLabels(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopLabels(List<String> labels, SHColor color) {
    return Padding(
      padding: EdgeInsets.only(bottom: widget.thumbSize.labelBottomMargin),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          for (final label in labels)
            SHText(label, style: SHTextStyles.overline, color: color),
        ],
      ),
    );
  }

  Widget _buildTrackAndSideLabels() {
    final largeThumb = widget.thumbSize == SHSliderThumbSize.large;

    return LayoutBuilder(
      builder: (context, constraints) {
        final maxLabelWidth = constraints.maxWidth / 3;

        return Row(
          children: [
            if (_labels.start != null)
              ConstrainedBox(
                key: _startLabelKey,
                constraints: BoxConstraints(maxWidth: maxLabelWidth),
                child: Padding(
                  padding: largeThumb ? SHSpacings.md.end : SHSpacings.sm.end,
                  child: _labels.start,
                ),
              ),
            Expanded(
              child: CustomPaint(
                painter: _SliderPainter(
                  value: _animationController,
                  color: context.colorTheme,
                  thumbSize: widget.thumbSize.size,
                  segmentCount: _labels.stops,
                  drawSegment: widget.segments,
                  enabled: widget.enabled,
                ),
                size: const Size.fromHeight(_sliderHeight),
              ),
            ),
            if (_labels.end != null)
              ConstrainedBox(
                key: _endLabelKey,
                constraints: BoxConstraints(maxWidth: maxLabelWidth),
                child: Padding(
                  padding:
                      largeThumb ? SHSpacings.md.start : SHSpacings.sm.start,
                  child: _labels.end,
                ),
              ),
          ],
        );
      },
    );
  }

  void _animateTo(double value) {
    if (_targetValue == value) {
      return;
    }

    _targetValue = value;
    _rawAnimateTo(value);
    widget.onChanged(value);

    _hapticFeedback();
  }

  void _rawAnimateTo(double value) =>
      _animationController.animateTo(value, curve: Curves.ease);

  void _hapticFeedback() => HapticFeedback.mediumImpact();

  void _jumpTo(double value) {
    if (_targetValue == value) {
      return;
    }

    _targetValue = value;
    _animationController.value = value;
    widget.onChanged(value);
  }

  void _handleDragStart(DragStartDetails _) {
    _duringDrag = true;
  }

  void _handleDragUpdate(DragUpdateDetails details) {
    final trackValue = _localToTrackValue(details.localPosition.dx);
    final newValue = _nearestStop(trackValue);
    if (widget.discrete) {
      _animateTo(newValue);
    } else {
      _jumpTo(newValue);
    }
  }

  void _handleDragEnd(DragEndDetails _) {
    assert(_duringDrag);
    // If the user is _duringDrag and the didUpdateWidget was called with
    // a new value, we ignore the new value, but we still need to send
    // the value that the user ended the drag at with invoking the onChanged.
    _duringDrag = false;
    widget.onChanged(_targetValue);
  }

  void _handleTapUp(TapUpDetails details) {
    final trackValue = _localToTrackValue(details.localPosition.dx);
    final newValue = _nearestStop(trackValue);
    _animateTo(newValue);
  }

  double get _step => widget.discrete ? 1 / (_labels.stops - 1) : 0.1;

  void _onIncrease() => _animateTo(_animationController.value + _step);

  void _onDecrease() => _animateTo(_animationController.value - _step);

  double? _width(GlobalKey key) =>
      (key.currentContext?.findRenderObject() as RenderBox?)?.size.width;

  double _localToTrackValue(double x) {
    final ltr = Directionality.of(context) == TextDirection.ltr;

    final labelLeft = _width(ltr ? _startLabelKey : _endLabelKey) ?? 0;
    final labelRight = _width(ltr ? _endLabelKey : _startLabelKey) ?? 0;

    final sliderWidth = _width(_sliderKey)!;
    final trackWidth = sliderWidth - labelLeft - labelRight;

    return ((x - labelLeft) / trackWidth).clamp(0.0, 1.0);
  }

  double _nearestStop(double value) {
    if (!widget.discrete) {
      return value;
    }

    final segments = _labels.stops - 1;

    return (value * segments).round() / segments;
  }
}

class _SliderPainter extends CustomPainter {
  const _SliderPainter({
    required this.value,
    required this.color,
    required this.thumbSize,
    required this.segmentCount,
    required this.drawSegment,
    required this.enabled,
  }) : super(repaint: value);

  final Animation<double> value;
  final SHColors color;
  final double thumbSize;
  final int segmentCount;
  final bool drawSegment;
  final bool enabled;

  @override
  void paint(Canvas canvas, Size size) {
    final activeTrack = Paint()
      ..color = color.ctaSurfacePrimary
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2
      ..strokeCap = StrokeCap.round;

    final inactiveTrack = Paint()
      ..color = color.defaultBorderPrimary
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2
      ..strokeCap = StrokeCap.round;

    final thumbPaint = Paint()
      ..color = color.ctaSurfacePrimary
      ..style = PaintingStyle.fill;

    final thumbPosition = value.value * size.width;
    final thumbCenter = Offset(thumbPosition, size.height / 2);
    final thumbRadius = thumbSize / 2;

    final activeTrackStart = Offset(0, size.height / 2);
    final activeTrackEnd = Offset(thumbPosition, size.height / 2);
    final inactiveTrackStart =
        Offset(enabled ? thumbPosition : 0, size.height / 2);
    final inactiveTrackEnd = Offset(size.width, size.height / 2);

    _drawSegments(canvas, size, thumbPaint);

    if (enabled) {
      canvas
        ..drawLine(
          activeTrackStart,
          activeTrackEnd,
          activeTrack,
        )
        ..drawLine(
          inactiveTrackStart,
          inactiveTrackEnd,
          inactiveTrack,
        )
        ..drawCircle(thumbCenter, thumbRadius, thumbPaint);
    } else {
      canvas.drawLine(
        inactiveTrackStart,
        inactiveTrackEnd,
        inactiveTrack,
      );
    }
  }

  @override
  bool shouldRepaint(_SliderPainter oldDelegate) =>
      oldDelegate.value != value ||
      oldDelegate.color != color ||
      oldDelegate.thumbSize != thumbSize ||
      oldDelegate.segmentCount != segmentCount ||
      oldDelegate.drawSegment != drawSegment;

  void _drawSegments(
    Canvas canvas,
    Size size,
    Paint thumbPaint,
  ) {
    if (segmentCount <= 1 || !drawSegment) {
      return;
    }

    final segmentWidth = size.width / (segmentCount - 1);
    final thumbPosition = value.value * size.width;
    final segmentPaint = Paint()
      ..color = color.defaultBorderPrimary
      ..style = PaintingStyle.fill;

    for (var i = 1; i < segmentCount - 1; i++) {
      final segmentCenter = Offset(i * segmentWidth, size.height / 2);

      // Check if the segment is behind the thumb
      if (segmentCenter.dx <= thumbPosition && enabled) {
        canvas.drawCircle(segmentCenter, 3, thumbPaint);
      } else {
        canvas.drawCircle(segmentCenter, 3, segmentPaint);
      }
    }
  }
}

class _Skeleton extends StatelessWidget {
  const _Skeleton({
    super.key,
    required this.topLabels,
    this.thumbSize = SHSliderThumbSize.medium,
  });

  final bool topLabels;
  final SHSliderThumbSize thumbSize;

  @override
  Widget build(BuildContext context) {
    const slider = SkeletonLeaf(
      size: Size.fromHeight(_sliderHeight),
    );

    if (topLabels) {
      return Column(
        children: [
          Opacity(
            opacity: 0,
            child: SHText.skeleton(
              text: 'foo', // doesn't matter as we don't paint it anyway
              style: SHTextStyles.overline,
            ),
          ),
          SizedBox(height: thumbSize.labelBottomMargin),
          slider,
        ],
      );
    }

    return slider;
  }
}
`;
function parseTextToClass(text: string): DartClass {
  const lines = text.split('\n').filter((line) => line != '');

  const classFields = parseLinesToClassFields(lines);
  const className = parseLinesToClassName(lines);
  const construtors = parseLinesToConstructors(lines, className, classFields);

  const clazz = new DartClass(className, classFields, construtors);

  return clazz;
}

function parseLinesToClassFields(lines: Array<string>): Array<DartClassField> {
  lines = lines.filter((line) => !line.startsWith('  ///'));
  // Two spaces in the beginning - it has to be a class property.
  const fieldListStartIndex = lines.findIndex((line) => line.startsWith('  final'));
  let fieldListEndIndex = fieldListStartIndex;
  for (let i = fieldListStartIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!doesLookingFurtherMakeSense(line)) {
      break;
    }
    if (line.endsWith(';') && (line.startsWith('  final') || (lines[i - 1].startsWith('  final') && !lines[i - 1].includes(';')))) {
      fieldListEndIndex = i;
    }
  }

  const fieldListLines = lines.slice(fieldListStartIndex, fieldListEndIndex + 1).join('').replace(/\s+/g, ' ').trim()
    .split(';').filter((line) => line != '' && !line.startsWith('///'));

  return fieldListLines.map(function (line) {
    const lineParts = line.trim().split(' ');
    const type = lineParts[1];
    const name = lineParts[2].replace(';', '');

    return new DartClassField(name, type);
  });
}

function parseLinesToClassName(lines: Array<string>): string {
  return lines.find((line) => line.startsWith('class '))!.split(' ')[1];
}

function parseLinesToConstructors(lines: Array<string>, className: string, classFields: Array<DartClassField>): Array<DartClassConstructor> {
  const constructors: Array<DartClassConstructor> = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!doesLookingFurtherMakeSense(line)) {
      break;
    }

    const isConstructorLine = line.includes(`${className}({`) || (line.includes(`${className}`) && line.includes('({'));
    if (!isConstructorLine) {
      i++;
      continue;
    }


    for (let j = i; j < lines.length; j++) {
      // TODO Consider counting open and closed parenthesis to check whether constructor got closed
      if (lines[j].includes('});') || lines[j].includes('}) :') || lines[j].includes('})  :')) {
        const constructorContent = lines.slice(i, j + 1);
        const constructor = parseLinesToConstructor(constructorContent, className, classFields);
        constructors.push(constructor);

        i = j + 1;
        break;
      }
    }
  }

  return constructors;
}

function parseLinesToConstructor(lines: Array<string>, className: string, classFields: Array<DartClassField>): DartClassConstructor {
  // FIXME Constructor can accept some fields that are not class fields

  const thiss = 'this.';

  let constructorName: string | null = null;
  const named = lines[0].includes(`${className}.`);
  if (named) {
    constructorName = lines[0].substring(lines[0].indexOf('.') + 1, lines[0].indexOf('({'));
  }

  const fieldLines = lines.slice(1).join('').split(',').filter((line) => line != '' && !line.includes('})'));
  const fieldLinesForClassFields = fieldLines.filter((line) => line.includes(thiss));
  const fieldNames = fieldLinesForClassFields.map((line) => {
    const lineFromFieldName = line.substring(line.indexOf(thiss) + thiss.length);
    const hasDefaultValue = lineFromFieldName.indexOf(' ') != -1;
    if (hasDefaultValue) {
      return lineFromFieldName.substring(0, lineFromFieldName.indexOf(' '));
    }
    return lineFromFieldName;
  })

  const cutomFieldLines = fieldLines.filter((line) => !line.includes(thiss) && !line.includes('super.'));

  const customFields = cutomFieldLines.map((line) => {
    const lineParts = line.trim().split(' ');
    if (line.includes('required')) {
      return new DartClassField(lineParts[2], lineParts[1]);
    }
    return new DartClassField(lineParts[1], lineParts[0]);
  })

  const fields = fieldNames.map((fieldName) => classFields.find((field) => field.name == fieldName)!);

  return new DartClassConstructor(constructorName != null, [...fields, ...customFields], constructorName);
}

function doesLookingFurtherMakeSense(line: string): boolean {
  return !line.includes('Widget build(BuildContext context)') && !line.includes('createState() =>');
}

class DartClass {
  name: string;
  fields: Array<DartClassField>;
  constructors: Array<DartClassConstructor>;

  constructor(name: string, fields: Array<DartClassField>, constructors: Array<DartClassConstructor>) {
    this.name = name;
    this.fields = fields;
    this.constructors = constructors;
  }
}

class DartClassConstructor {
  named: boolean;
  fields: Array<DartClassField>;
  name: string | null;

  constructor(named: boolean, fields: Array<DartClassField>, name: string | null) {
    this.named = named;
    this.fields = fields;
    this.name = name;
  }
}

class DartClassField {
  name: string = "";
  type: string = "";

  constructor(name: string, type: string) {
    this.name = name;
    this.type = type;
  }
}

parseTextToClass(input);
