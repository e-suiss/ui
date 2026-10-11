import EsuissUI
import SwiftUI

enum CalendarStories {
  static let group = StoryGroup(.components, "Calendar", stories: [
    Story("Default") {
      CalendarSingleDemo()
    },
    Story("Sizes") {
      VStack(alignment: .leading, spacing: 24) {
        CalendarSingleDemo(size: .sm)
        CalendarSingleDemo(size: .default)
        CalendarSingleDemo(size: .lg)
      }
    },
    Story("Range") {
      CalendarRangeDemo()
    },
    Story("Multiple") {
      CalendarMultipleDemo()
    },
    Story("DropdownCaption") {
      CalendarSingleDemo(captionLayout: .dropdown)
    },
    Story("WeekNumbers") {
      CalendarSingleDemo(showWeekNumber: true)
    },
    Story("DisabledDays") {
      CalendarSingleDemo(weekendsDisabled: true)
    },
    Story("OutsideDays") {
      CalendarSingleDemo(showOutsideDays: true)
    },
    Story("ButtonVariants") {
      VStack(alignment: .leading, spacing: 24) {
        CalendarSingleDemo(buttonVariant: .ghost)
        CalendarSingleDemo(buttonVariant: .secondary)
        CalendarSingleDemo(buttonVariant: .tinted)
      }
    },
    Story("Locale") {
      CalendarSingleDemo()
        .environment(\.locale, Locale(identifier: "tr_TR"))
    },
  ])
}

private enum CalendarDates {
  static func day(_ offset: Int) -> Date {
    let calendar = Foundation.Calendar.current
    let start = calendar.startOfDay(for: Date())
    return calendar.date(byAdding: .day, value: offset, to: start) ?? start
  }

  static func dayOfMonth(_ day: Int) -> Date {
    let calendar = Foundation.Calendar.current
    var components = calendar.dateComponents([.year, .month], from: Date())
    components.day = day
    return calendar.date(from: components) ?? Date()
  }
}

private struct CalendarBordered: ViewModifier {
  func body(content: Content) -> some View {
    content
      .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
      .overlay {
        RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous).strokeBorder(Color.separator)
      }
  }
}

private struct CalendarSingleDemo: View {
  var size: DateCalendar.Size = .default
  var buttonVariant: VariantButtonStyle.Variant = .plain
  var captionLayout: DateCalendar.CaptionLayout = .label
  var showOutsideDays = false
  var showWeekNumber = false
  var weekendsDisabled = false

  @State private var date: Date? = CalendarDates.day(3)

  var body: some View {
    DateCalendar(
      selection: $date,
      size: size,
      buttonVariant: buttonVariant,
      captionLayout: captionLayout,
      showOutsideDays: showOutsideDays,
      showWeekNumber: showWeekNumber,
      isDisabled: { day in
        guard weekendsDisabled else { return false }
        let weekday = Foundation.Calendar.current.component(.weekday, from: day)
        return weekday == 1 || weekday == 7
      }
    )
    .modifier(CalendarBordered())
  }
}

private struct CalendarRangeDemo: View {
  @State private var range: DateRange? = DateRange(from: CalendarDates.day(0), to: CalendarDates.day(6))

  var body: some View {
    DateCalendar(selection: $range, numberOfMonths: 2)
      .modifier(CalendarBordered())
  }
}

private struct CalendarMultipleDemo: View {
  @State private var dates: Set<Date> = [
    CalendarDates.dayOfMonth(8),
    CalendarDates.dayOfMonth(15),
    CalendarDates.dayOfMonth(22),
  ]

  var body: some View {
    DateCalendar(selection: $dates)
      .modifier(CalendarBordered())
  }
}
