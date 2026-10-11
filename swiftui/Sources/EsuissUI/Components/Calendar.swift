import PhosphorSwift
import SwiftUI

public struct DateRange: Hashable, Sendable {
  public var from: Date
  public var to: Date?

  public init(from: Date, to: Date? = nil) {
    self.from = from
    self.to = to
  }

  public static func adding(_ day: Date, to range: DateRange?, calendar: Foundation.Calendar) -> DateRange? {
    guard let range else { return DateRange(from: day) }
    let from = range.from
    guard let to = range.to else {
      if calendar.isDate(day, inSameDayAs: from) { return DateRange(from: from, to: day) }
      return day < from ? DateRange(from: day, to: from) : DateRange(from: from, to: day)
    }
    let sameFrom = calendar.isDate(day, inSameDayAs: from)
    let sameTo = calendar.isDate(day, inSameDayAs: to)
    if sameFrom && sameTo { return nil }
    if sameFrom { return DateRange(from: to) }
    if sameTo { return DateRange(from: from) }
    if day < from { return DateRange(from: day, to: to) }
    return DateRange(from: from, to: day)
  }
}

public struct CalendarDayModifiers: Hashable, Sendable {
  public var today = false
  public var selected = false
  public var rangeStart = false
  public var rangeMiddle = false
  public var rangeEnd = false
  public var outside = false
  public var disabled = false

  public init(
    today: Bool = false,
    selected: Bool = false,
    rangeStart: Bool = false,
    rangeMiddle: Bool = false,
    rangeEnd: Bool = false,
    outside: Bool = false,
    disabled: Bool = false
  ) {
    self.today = today
    self.selected = selected
    self.rangeStart = rangeStart
    self.rangeMiddle = rangeMiddle
    self.rangeEnd = rangeEnd
    self.outside = outside
    self.disabled = disabled
  }

  var selectedSingle: Bool { selected && !rangeStart && !rangeEnd && !rangeMiddle }
}

enum CalendarMonthGrid {
  static func startOfMonth(_ date: Date, calendar: Foundation.Calendar) -> Date {
    calendar.date(from: calendar.dateComponents([.year, .month], from: date)) ?? date
  }

  static func weeks(for month: Date, calendar: Foundation.Calendar) -> [[Date]] {
    let first = startOfMonth(month, calendar: calendar)
    let days = calendar.range(of: .day, in: .month, for: first)?.count ?? 30
    let lead = (calendar.component(.weekday, from: first) - calendar.firstWeekday + 7) % 7
    let count = Int((Double(lead + days) / 7).rounded(.up))
    guard let start = calendar.date(byAdding: .day, value: -lead, to: first) else { return [] }
    return (0..<count).map { week in
      (0..<7).compactMap { day in
        calendar.date(byAdding: .day, value: week * 7 + day, to: start)
      }
    }
  }

  static func weekdaySymbols(calendar: Foundation.Calendar, locale: Locale, format: String) -> [String] {
    let formatter = DateFormatter()
    formatter.locale = locale
    formatter.calendar = calendar
    formatter.dateFormat = format
    let reference = weeks(for: Date(timeIntervalSince1970: 0), calendar: calendar).first ?? []
    return reference.map { formatter.string(from: $0) }
  }
}

enum CalendarSelection {
  case single(Binding<Date?>)
  case range(Binding<DateRange?>)
  case multiple(Binding<Set<Date>>)
}

extension EnvironmentValues {
  @Entry var calendarTransparent = false
}

public struct DateCalendar: View {
  public enum Size: CaseIterable, Sendable {
    case sm, `default`, lg

    var cell: CGFloat {
      switch self {
      case .sm: 24
      case .default: 32
      case .lg: 40
      }
    }

    var padding: CGFloat {
      switch self {
      case .sm: 8
      case .default: 12
      case .lg: 16
      }
    }

    var caption: TextStyle {
      switch self {
      case .sm: .xs
      case .default: .sm
      case .lg: .base
      }
    }

    var day: TextStyle {
      switch self {
      case .sm: .xs3
      case .default: .sm
      case .lg: .lg
      }
    }

    var weekday: TextStyle {
      self == .lg ? .xs : .xs3
    }
  }

  public enum CaptionLayout: CaseIterable, Sendable {
    case label, dropdown, dropdownMonths, dropdownYears
  }

  let selection: CalendarSelection
  let externalMonth: Binding<Date>?
  let size: Size
  let buttonVariant: VariantButtonStyle.Variant
  let captionLayout: CaptionLayout
  let numberOfMonths: Int
  let showOutsideDays: Bool
  let showWeekNumber: Bool
  let startMonth: Date?
  let endMonth: Date?
  let isDisabled: (Date) -> Bool

  @State private var internalMonth: Date
  @Environment(\.calendar) private var environmentCalendar
  @Environment(\.locale) private var locale
  @Environment(\.calendarTransparent) private var transparent
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  init(
    selection: CalendarSelection,
    initial: Date?,
    month: Binding<Date>?,
    size: Size,
    buttonVariant: VariantButtonStyle.Variant,
    captionLayout: CaptionLayout,
    numberOfMonths: Int,
    showOutsideDays: Bool,
    showWeekNumber: Bool,
    startMonth: Date?,
    endMonth: Date?,
    isDisabled: @escaping (Date) -> Bool
  ) {
    self.selection = selection
    externalMonth = month
    self.size = size
    self.buttonVariant = buttonVariant
    self.captionLayout = captionLayout
    self.numberOfMonths = max(1, numberOfMonths)
    self.showOutsideDays = showOutsideDays
    self.showWeekNumber = showWeekNumber
    self.startMonth = startMonth
    self.endMonth = endMonth
    self.isDisabled = isDisabled
    _internalMonth = State(initialValue: initial ?? Date())
  }

  public init(
    selection: Binding<Date?>,
    month: Binding<Date>? = nil,
    size: Size = .default,
    buttonVariant: VariantButtonStyle.Variant = .plain,
    captionLayout: CaptionLayout = .label,
    numberOfMonths: Int = 1,
    showOutsideDays: Bool = false,
    showWeekNumber: Bool = false,
    startMonth: Date? = nil,
    endMonth: Date? = nil,
    isDisabled: @escaping (Date) -> Bool = { _ in false }
  ) {
    self.init(
      selection: .single(selection),
      initial: selection.wrappedValue,
      month: month,
      size: size,
      buttonVariant: buttonVariant,
      captionLayout: captionLayout,
      numberOfMonths: numberOfMonths,
      showOutsideDays: showOutsideDays,
      showWeekNumber: showWeekNumber,
      startMonth: startMonth,
      endMonth: endMonth,
      isDisabled: isDisabled
    )
  }

  public init(
    selection: Binding<DateRange?>,
    month: Binding<Date>? = nil,
    size: Size = .default,
    buttonVariant: VariantButtonStyle.Variant = .plain,
    captionLayout: CaptionLayout = .label,
    numberOfMonths: Int = 1,
    showOutsideDays: Bool = false,
    showWeekNumber: Bool = false,
    startMonth: Date? = nil,
    endMonth: Date? = nil,
    isDisabled: @escaping (Date) -> Bool = { _ in false }
  ) {
    self.init(
      selection: .range(selection),
      initial: selection.wrappedValue?.from,
      month: month,
      size: size,
      buttonVariant: buttonVariant,
      captionLayout: captionLayout,
      numberOfMonths: numberOfMonths,
      showOutsideDays: showOutsideDays,
      showWeekNumber: showWeekNumber,
      startMonth: startMonth,
      endMonth: endMonth,
      isDisabled: isDisabled
    )
  }

  public init(
    selection: Binding<Set<Date>>,
    month: Binding<Date>? = nil,
    size: Size = .default,
    buttonVariant: VariantButtonStyle.Variant = .plain,
    captionLayout: CaptionLayout = .label,
    numberOfMonths: Int = 1,
    showOutsideDays: Bool = false,
    showWeekNumber: Bool = false,
    startMonth: Date? = nil,
    endMonth: Date? = nil,
    isDisabled: @escaping (Date) -> Bool = { _ in false }
  ) {
    self.init(
      selection: .multiple(selection),
      initial: selection.wrappedValue.min(),
      month: month,
      size: size,
      buttonVariant: buttonVariant,
      captionLayout: captionLayout,
      numberOfMonths: numberOfMonths,
      showOutsideDays: showOutsideDays,
      showWeekNumber: showWeekNumber,
      startMonth: startMonth,
      endMonth: endMonth,
      isDisabled: isDisabled
    )
  }

  private var calendar: Foundation.Calendar {
    var resolved = Foundation.Calendar(identifier: environmentCalendar.identifier)
    resolved.locale = locale
    resolved.timeZone = environmentCalendar.timeZone
    return resolved
  }

  private var displayed: Date {
    CalendarMonthGrid.startOfMonth(externalMonth?.wrappedValue ?? internalMonth, calendar: calendar)
  }

  private func setDisplayed(_ month: Date) {
    let start = CalendarMonthGrid.startOfMonth(month, calendar: calendar)
    if let externalMonth {
      externalMonth.wrappedValue = start
    } else {
      internalMonth = start
    }
  }

  private func shift(_ months: Int) -> Date {
    calendar.date(byAdding: .month, value: months, to: displayed) ?? displayed
  }

  private var canGoBack: Bool {
    guard let startMonth else { return true }
    return displayed > CalendarMonthGrid.startOfMonth(startMonth, calendar: calendar)
  }

  private var canGoForward: Bool {
    guard let endMonth else { return true }
    return shift(numberOfMonths - 1) < CalendarMonthGrid.startOfMonth(endMonth, calendar: calendar)
  }

  private func navigate(_ step: Int) {
    guard step < 0 ? canGoBack : canGoForward else { return }
    if reduceMotion {
      setDisplayed(shift(step))
    } else {
      withAnimation(.timingCurve(0.32, 0.72, 0, 1, duration: 0.3)) { setDisplayed(shift(step)) }
    }
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      ForEach(0..<numberOfMonths, id: \.self) { index in
        month(shift(index), index: index)
      }
    }
    .padding(size.padding)
    .fixedSize()
    .background(transparent ? Color.clear : Color.surface)
    .contentShape(Rectangle())
    .gesture(
      DragGesture(minimumDistance: 24)
        .onEnded { value in
          let dx = value.translation.width
          guard abs(dx) > 48, abs(dx) > abs(value.translation.height) else { return }
          navigate(dx < 0 ? 1 : -1)
        }
    )
  }

  private func month(_ month: Date, index: Int) -> some View {
    let weeks = CalendarMonthGrid.weeks(for: month, calendar: calendar)
    return VStack(alignment: .leading, spacing: 16) {
      HStack(spacing: 2) {
        caption(month)
          .padding(.leading, 6)
          .frame(maxWidth: .infinity, alignment: .leading)
        if index == 0 {
          navButton(icon: Ph.caretLeft.regular, enabled: canGoBack, label: Text("Previous month")) { navigate(-1) }
          navButton(icon: Ph.caretRight.regular, enabled: canGoForward, label: Text("Next month")) { navigate(1) }
        }
      }
      .frame(height: size.cell)
      VStack(spacing: 8) {
        weekdayRow
        ForEach(weeks, id: \.self) { week in
          weekRow(week, month: month)
        }
      }
      .accessibilityElement(children: .contain)
      .accessibilityLabel(Text(verbatim: captionText(month)))
    }
    .frame(width: size.cell * CGFloat(showWeekNumber ? 8 : 7))
  }

  private func captionText(_ month: Date) -> String {
    let formatter = DateFormatter()
    formatter.locale = locale
    formatter.calendar = calendar
    formatter.setLocalizedDateFormatFromTemplate("LLLLy")
    return formatter.string(from: month)
  }

  @ViewBuilder private func caption(_ month: Date) -> some View {
    switch captionLayout {
    case .label:
      Text(verbatim: captionText(month))
        .font(size.caption.font(weight: .semibold))
        .tracking(size.caption.letterSpacing)
        .foregroundStyle(Color.label)
        .lineLimit(1)
    case .dropdown:
      HStack(spacing: 6) {
        monthMenu(month)
        yearMenu(month)
      }
    case .dropdownMonths:
      HStack(spacing: 6) {
        monthMenu(month)
        Text(verbatim: String(calendar.component(.year, from: month)))
          .font(size.caption.font(weight: .semibold))
          .foregroundStyle(Color.label)
      }
    case .dropdownYears:
      HStack(spacing: 6) {
        Text(verbatim: monthSymbol(month, short: false))
          .font(size.caption.font(weight: .semibold))
          .foregroundStyle(Color.label)
        yearMenu(month)
      }
    }
  }

  private func monthSymbol(_ month: Date, short: Bool) -> String {
    let symbols = short ? calendar.shortStandaloneMonthSymbols : calendar.standaloneMonthSymbols
    return symbols[calendar.component(.month, from: month) - 1]
  }

  private var yearBounds: ClosedRange<Int> {
    let current = calendar.component(.year, from: Date())
    let lower = startMonth.map { calendar.component(.year, from: $0) } ?? current - 100
    let upper = endMonth.map { calendar.component(.year, from: $0) } ?? current + 10
    return lower...max(lower, upper)
  }

  private func monthMenu(_ month: Date) -> some View {
    let selected = Binding<Int>(
      get: { calendar.component(.month, from: displayed) },
      set: { value in
        var components = calendar.dateComponents([.year], from: displayed)
        components.month = value
        if let date = calendar.date(from: components) { setDisplayed(date) }
      }
    )
    return Menu {
      Picker(selection: selected) {
        ForEach(1...12, id: \.self) { value in
          Text(verbatim: calendar.standaloneMonthSymbols[value - 1]).tag(value)
        }
      } label: {
        EmptyView()
      }
      .pickerStyle(.inline)
    } label: {
      dropdownLabel(monthSymbol(month, short: true))
    }
  }

  private func yearMenu(_ month: Date) -> some View {
    let selected = Binding<Int>(
      get: { calendar.component(.year, from: displayed) },
      set: { value in
        var components = calendar.dateComponents([.month], from: displayed)
        components.year = value
        if let date = calendar.date(from: components) { setDisplayed(date) }
      }
    )
    return Menu {
      Picker(selection: selected) {
        ForEach(Array(yearBounds), id: \.self) { value in
          Text(verbatim: String(value)).tag(value)
        }
      } label: {
        EmptyView()
      }
      .pickerStyle(.inline)
    } label: {
      dropdownLabel(String(calendar.component(.year, from: month)))
    }
  }

  private func dropdownLabel(_ text: String) -> some View {
    HStack(spacing: 4) {
      Text(verbatim: text)
        .font(size.caption.font(weight: .semibold))
        .tracking(size.caption.letterSpacing)
        .foregroundStyle(Color.label)
      Ph.caretDown.regular
        .frame(width: 14, height: 14)
        .foregroundStyle(Color.labelSecondary)
    }
  }

  private func navButton(icon: some View, enabled: Bool, label: Text, action: @escaping () -> Void) -> some View {
    Button(action: action) {
      icon.frame(width: 16, height: 16)
    }
    .buttonStyle(CalendarNavButtonStyle(variant: buttonVariant, size: size.cell))
    .disabled(!enabled)
    .accessibilityLabel(label)
  }

  private var weekdayRow: some View {
    let symbols = CalendarMonthGrid.weekdaySymbols(calendar: calendar, locale: locale, format: "cccccc")
    return HStack(spacing: 0) {
      if showWeekNumber {
        Color.clear.frame(width: size.cell, height: 1)
      }
      ForEach(Array(symbols.enumerated()), id: \.offset) { _, symbol in
        Text(verbatim: size == .sm ? symbol : symbol.uppercased(with: locale))
          .font(size.weekday.font(weight: .semibold))
          .tracking(size.weekday.letterSpacing)
          .foregroundStyle(Color.labelSecondary)
          .lineLimit(1)
          .frame(maxWidth: .infinity)
      }
    }
    .accessibilityHidden(true)
  }

  private func weekRow(_ week: [Date], month: Date) -> some View {
    HStack(spacing: 0) {
      if showWeekNumber, let first = week.first {
        Text(verbatim: String(calendar.component(.weekOfYear, from: first)))
          .font(TextStyle.xs.font())
          .tracking(TextStyle.xs.letterSpacing)
          .foregroundStyle(Color.labelSecondary)
          .frame(width: size.cell, height: size.cell)
      }
      ForEach(Array(week.enumerated()), id: \.offset) { position, day in
        let modifiers = modifiers(for: day, month: month)
        let hidden = modifiers.outside && !showOutsideDays
        ZStack {
          if !hidden {
            band(modifiers, first: position == 0, last: position == week.count - 1)
            CalendarDayButton(date: day, modifiers: modifiers, size: size) {
              select(day)
            }
          }
        }
        .frame(width: size.cell, height: size.cell)
      }
    }
  }

  @ViewBuilder private func band(_ modifiers: CalendarDayModifiers, first: Bool, last: Bool) -> some View {
    let inBand = modifiers.rangeMiddle || ((modifiers.rangeStart || modifiers.rangeEnd) && !(modifiers.rangeStart && modifiers.rangeEnd))
    if inBand {
      let radius = size.cell / 2
      let leading = modifiers.rangeStart || first ? radius : 0
      let trailing = modifiers.rangeEnd || last ? radius : 0
      UnevenRoundedRectangle(
        topLeadingRadius: leading,
        bottomLeadingRadius: leading,
        bottomTrailingRadius: trailing,
        topTrailingRadius: trailing,
        style: .continuous
      )
      .fill(Color.surfaceSecondary)
    }
  }

  private func modifiers(for day: Date, month: Date) -> CalendarDayModifiers {
    var result = CalendarDayModifiers()
    result.today = calendar.isDateInToday(day)
    result.outside = !calendar.isDate(day, equalTo: month, toGranularity: .month)
    result.disabled = isDisabled(day)
    switch selection {
    case .single(let binding):
      result.selected = binding.wrappedValue.map { calendar.isDate($0, inSameDayAs: day) } ?? false
    case .multiple(let binding):
      result.selected = binding.wrappedValue.contains { calendar.isDate($0, inSameDayAs: day) }
    case .range(let binding):
      guard let range = binding.wrappedValue else { break }
      let start = calendar.isDate(range.from, inSameDayAs: day)
      let end = range.to.map { calendar.isDate($0, inSameDayAs: day) } ?? false
      let middle = range.to.map { day > range.from && day < $0 && !end } ?? false
      result.rangeStart = start
      result.rangeEnd = end || (start && range.to == nil)
      result.rangeMiddle = middle && !start
      result.selected = start || end || result.rangeMiddle
    }
    if result.outside && !showOutsideDays { result.selected = false }
    return result
  }

  private func select(_ day: Date) {
    let normalized = calendar.startOfDay(for: day)
    switch selection {
    case .single(let binding):
      if let current = binding.wrappedValue, calendar.isDate(current, inSameDayAs: normalized) {
        binding.wrappedValue = nil
      } else {
        binding.wrappedValue = normalized
      }
    case .multiple(let binding):
      if let existing = binding.wrappedValue.first(where: { calendar.isDate($0, inSameDayAs: normalized) }) {
        binding.wrappedValue.remove(existing)
      } else {
        binding.wrappedValue.insert(normalized)
      }
    case .range(let binding):
      binding.wrappedValue = DateRange.adding(normalized, to: binding.wrappedValue, calendar: calendar)
    }
    if !calendar.isDate(normalized, equalTo: displayed, toGranularity: .month), numberOfMonths == 1 {
      setDisplayed(normalized)
    }
  }
}

struct CalendarNavButtonStyle: ButtonStyle {
  let variant: VariantButtonStyle.Variant
  let size: CGFloat

  @Environment(\.isEnabled) private var isEnabled

  func makeBody(configuration: Configuration) -> some View {
    let pressed = configuration.isPressed && isEnabled
    configuration.label
      .foregroundStyle(foreground)
      .frame(width: size, height: size)
      .background(background(pressed: pressed), in: Circle())
      .contentShape(Circle())
  }

  private var foreground: Color {
    guard isEnabled else { return .labelQuaternary }
    switch variant {
    case .plain, .tinted, .link: return .link
    case .default: return .onAccent
    case .destructive: return .danger
    case .outline, .secondary, .ghost: return .label
    }
  }

  private func background(pressed: Bool) -> Color {
    switch variant {
    case .default: return pressed ? .accentPressed : .accent
    case .secondary: return pressed ? .controlPressed : .control
    case .tinted: return pressed ? .accentSurfacePressed : .accentSurface
    case .destructive: return pressed ? .dangerSurfacePressed : .dangerSurface
    case .outline, .ghost, .plain: return pressed ? .itemPressed : .clear
    case .link: return .clear
    }
  }
}

public struct CalendarDayButton: View {
  let date: Date
  let modifiers: CalendarDayModifiers
  let size: DateCalendar.Size
  let action: () -> Void

  @Environment(\.locale) private var locale
  @Environment(\.calendar) private var calendar

  public init(date: Date, modifiers: CalendarDayModifiers, size: DateCalendar.Size = .default, action: @escaping () -> Void) {
    self.date = date
    self.modifiers = modifiers
    self.size = size
    self.action = action
  }

  public var body: some View {
    Button(action: action) {
      Text(verbatim: String(calendar.component(.day, from: date)))
    }
    .buttonStyle(PressReader { pressed in
      label(pressed: pressed)
    })
    .disabled(modifiers.disabled)
    .accessibilityLabel(Text(verbatim: accessibilityText))
    .accessibilityAddTraits(modifiers.selected ? .isSelected : [])
  }

  private var accessibilityText: String {
    let formatter = DateFormatter()
    formatter.locale = locale
    formatter.dateStyle = .full
    let full = formatter.string(from: date)
    guard modifiers.today else { return full }
    let relative = RelativeDateTimeFormatter()
    relative.locale = locale
    relative.dateTimeStyle = .named
    let today = relative.localizedString(from: DateComponents(day: 0))
    return "\(today.prefix(1).uppercased())\(today.dropFirst()), \(full)"
  }

  private var accent: Bool {
    modifiers.rangeStart || modifiers.rangeEnd || (modifiers.today && modifiers.selectedSingle)
  }

  private func label(pressed: Bool) -> some View {
    let bold = modifiers.today || modifiers.selectedSingle
    let style = size.day
    let cell = size.cell
    return Text(verbatim: String(calendar.component(.day, from: date)))
      .font(style.font(weight: bold ? .semibold : .regular))
      .tracking(style.letterSpacing)
      .monospacedDigit()
      .foregroundStyle(foreground)
      .frame(width: cell, height: cell)
      .background(background(pressed: pressed && !modifiers.disabled), in: Circle())
      .contentShape(Circle())
  }

  private var foreground: Color {
    if accent { return .onAccent }
    if modifiers.disabled { return .labelQuaternary }
    if modifiers.rangeMiddle { return .label }
    if modifiers.selectedSingle || modifiers.today { return .link }
    if modifiers.outside { return .labelSecondary }
    return .label
  }

  private func background(pressed: Bool) -> Color {
    if accent { return pressed ? .accentPressed : .accent }
    if modifiers.rangeMiddle { return pressed ? .itemPressed : .clear }
    if modifiers.selectedSingle { return pressed ? .accentSurfacePressed : .accentSurface }
    return pressed ? .itemPressed : .clear
  }
}
