import PhosphorSwift
import SwiftUI

enum DatePart: Hashable, Sendable {
  case day, month, year

  static func order(locale: Locale) -> [DatePart] {
    let format = DateFormatter.dateFormat(fromTemplate: "yMd", options: 0, locale: locale) ?? ""
    var parts: [DatePart] = []
    for character in format {
      let part: DatePart? = switch character {
      case "d": .day
      case "M", "L": .month
      case "y": .year
      default: nil
      }
      if let part, !parts.contains(part) { parts.append(part) }
    }
    return parts.count == 3 ? parts : [.month, .day, .year]
  }
}

enum DateWheelMath {
  static func days(year: Int, month: Int, calendar: Foundation.Calendar) -> Int {
    guard let date = calendar.date(from: DateComponents(year: year, month: month, day: 1)) else { return 31 }
    return calendar.range(of: .day, in: .month, for: date)?.count ?? 31
  }

  static func update(_ date: Date, year: Int? = nil, month: Int? = nil, day: Int? = nil, calendar: Foundation.Calendar) -> Date {
    let current = calendar.dateComponents([.year, .month, .day], from: date)
    let nextYear = year ?? current.year ?? 2000
    let nextMonth = month ?? current.month ?? 1
    let nextDay = min(day ?? current.day ?? 1, days(year: nextYear, month: nextMonth, calendar: calendar))
    return calendar.date(from: DateComponents(year: nextYear, month: nextMonth, day: nextDay)) ?? date
  }
}

public struct DatePickerField: View {
  let selection: Binding<Date?>
  let placeholder: LocalizedStringKey
  let fromYear: Int
  let toYear: Int
  let title: LocalizedStringKey?
  let showCloseButton: Bool
  let closeLabel: LocalizedStringKey?

  @State private var open = false
  @CompactLayout private var compact
  @Environment(\.isEnabled) private var isEnabled
  @Environment(\.isInvalid) private var invalid
  @Environment(\.colorScheme) private var colorScheme
  @Environment(\.locale) private var locale

  public init(
    selection: Binding<Date?>,
    placeholder: LocalizedStringKey = "Pick a date",
    fromYear: Int? = nil,
    toYear: Int? = nil,
    title: LocalizedStringKey? = nil,
    showCloseButton: Bool = false,
    closeLabel: LocalizedStringKey? = nil
  ) {
    let year = Foundation.Calendar.current.component(.year, from: Date())
    self.selection = selection
    self.placeholder = placeholder
    self.fromYear = fromYear ?? year - 100
    self.toYear = toYear ?? year + 10
    self.title = title
    self.showCloseButton = showCloseButton
    self.closeLabel = closeLabel
  }

  public var body: some View {
    let binding = selection
    let isOpen = $open
    trigger
      .drawer(isPresented: $open.gated(compact)) {
        DatePickerSheet(
          selection: binding,
          fromYear: fromYear,
          toYear: toYear,
          title: title,
          showCloseButton: showCloseButton,
          closeLabel: closeLabel
        )
        .environment(\.locale, locale)
      }
      .popover(isPresented: $open.gated(!compact)) {
        DateCalendar(
          selection: Binding(
            get: { binding.wrappedValue },
            set: { value in
              binding.wrappedValue = value
              isOpen.wrappedValue = false
            }
          ),
          startMonth: Foundation.Calendar.current.date(from: DateComponents(year: fromYear, month: 1)),
          endMonth: Foundation.Calendar.current.date(from: DateComponents(year: toYear, month: 12))
        )
        .environment(\.calendarTransparent, true)
        .environment(\.locale, locale)
        .presentationCompactAdaptation(.popover)
        .presentationBackground(Color.surfaceRaised)
      }
  }

  private var label: Text {
    guard let value = selection.wrappedValue else { return Text(placeholder) }
    return Text(value.formatted(Date.FormatStyle(date: .abbreviated, time: .omitted).locale(locale)))
  }

  private var trigger: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.lg, style: .continuous)
    let empty = selection.wrappedValue == nil
    return Button {
      open = true
    } label: {
      HStack(spacing: 8) {
        Ph.calendarBlank.regular
          .frame(width: 16, height: 16)
          .foregroundStyle(isEnabled ? Color.labelSecondary : .labelQuaternary)
          .accessibilityHidden(true)
        label
          .font(TextStyle.base.font())
          .tracking(TextStyle.base.letterSpacing)
          .lineLimit(1)
          .foregroundStyle(!isEnabled ? Color.labelQuaternary : empty ? .labelSecondary : .label)
          .frame(maxWidth: .infinity, alignment: .leading)
      }
      .padding(.horizontal, 12)
      .frame(height: 44)
      .background(background, in: shape)
      .overlay {
        if invalid { shape.strokeBorder(Color.danger) }
      }
      .contentShape(shape)
    }
    .buttonStyle(.plain)
    .accessibilityHint(Text("Shows date picker"))
  }

  private var background: Color {
    if !isEnabled { return .controlDisabled }
    if invalid { return .danger.opacity(colorScheme == .dark ? 0.1 : 0.05) }
    return .control
  }
}

struct DatePickerSheet: View {
  let selection: Binding<Date?>
  let fromYear: Int
  let toYear: Int
  let title: LocalizedStringKey?
  let showCloseButton: Bool
  let closeLabel: LocalizedStringKey?

  var body: some View {
    DrawerContent(showCloseButton: showCloseButton, closeLabel: closeLabel) {
      if let title {
        DrawerHeader {
          DrawerTitle(title)
        }
      }
      DateWheels(
        selection: Binding(
          get: { selection.wrappedValue ?? Date() },
          set: { selection.wrappedValue = $0 }
        ),
        fromYear: fromYear,
        toYear: toYear
      )
      .padding(16)
      .padding(.top, showCloseButton && title == nil ? 48 : 0)
    }
  }
}

struct DateWheels: View {
  let selection: Binding<Date>
  let fromYear: Int
  let toYear: Int

  @Environment(\.locale) private var locale
  @Environment(\.calendar) private var environmentCalendar

  private var calendar: Foundation.Calendar {
    var resolved = Foundation.Calendar(identifier: .gregorian)
    resolved.locale = locale
    resolved.timeZone = environmentCalendar.timeZone
    return resolved
  }

  var body: some View {
    let calendar = calendar
    let components = calendar.dateComponents([.year, .month, .day], from: selection.wrappedValue)
    let year = components.year ?? fromYear
    let month = components.month ?? 1
    let day = components.day ?? 1
    let binding = selection
    WheelPicker(spacing: 24) {
      ForEach(DatePart.order(locale: locale), id: \.self) { part in
        switch part {
        case .day:
          WheelPickerColumn(
            selection: Binding(
              get: { day },
              set: { binding.wrappedValue = DateWheelMath.update(binding.wrappedValue, day: $0, calendar: calendar) }
            ),
            alignment: .trailing
          ) {
            ForEach(1...DateWheelMath.days(year: year, month: month, calendar: calendar), id: \.self) { value in
              WheelPickerItem(verbatim: String(value), value: value)
            }
          }
          .frame(minWidth: 48, alignment: .trailing)
          .accessibilityLabel(Text("Day"))
        case .month:
          WheelPickerColumn(
            selection: Binding(
              get: { month },
              set: { binding.wrappedValue = DateWheelMath.update(binding.wrappedValue, month: $0, calendar: calendar) }
            ),
            alignment: .leading
          ) {
            ForEach(Array(calendar.standaloneMonthSymbols.enumerated()), id: \.offset) { index, name in
              WheelPickerItem(verbatim: name, value: index + 1)
            }
          }
          .frame(minWidth: 96, alignment: .leading)
          .accessibilityLabel(Text("Month"))
        case .year:
          WheelPickerColumn(
            selection: Binding(
              get: { year },
              set: { binding.wrappedValue = DateWheelMath.update(binding.wrappedValue, year: $0, calendar: calendar) }
            ),
            alignment: .leading
          ) {
            ForEach(fromYear...max(fromYear, toYear), id: \.self) { value in
              WheelPickerItem(verbatim: String(value), value: value)
            }
          }
          .frame(minWidth: 64, alignment: .leading)
          .accessibilityLabel(Text("Year"))
        }
      }
    }
    .environment(\.wheelPickerItemInset, 0)
  }
}
