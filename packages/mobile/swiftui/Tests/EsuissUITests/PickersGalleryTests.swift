import SwiftUI
import XCTest

@testable import EsuissUI

private let gregorian: Foundation.Calendar = {
  var calendar = Foundation.Calendar(identifier: .gregorian)
  calendar.locale = Locale(identifier: "en_US")
  return calendar
}()

private func day(_ year: Int, _ month: Int, _ day: Int) -> Date {
  gregorian.date(from: DateComponents(year: year, month: month, day: day)) ?? Date()
}

private func fromToday(_ days: Int) -> Date {
  gregorian.date(byAdding: .day, value: days, to: gregorian.startOfDay(for: Date())) ?? Date()
}

private struct PickersBackdrop: View {
  var body: some View {
    Color.surface
      .overlay(alignment: .top) {
        VStack(alignment: .leading, spacing: 12) {
          ForEach(0..<14) { _ in
            RoundedRectangle(cornerRadius: Radius.md).fill(Color.surfaceSecondary).frame(height: 40)
          }
        }
        .padding(16)
      }
      .clipped()
  }
}

private struct SheetStage<Content: View>: View {
  let height: CGFloat
  var fits = true
  @ViewBuilder let content: () -> Content

  var body: some View {
    ZStack(alignment: .bottom) {
      PickersBackdrop()
      Color.scrim
      content()
        .environment(\.drawerFitsContent, fits)
        .frame(maxHeight: fits ? nil : height - 40)
        .clipShape(UnevenRoundedRectangle(topLeadingRadius: Radius.xl3, topTrailingRadius: Radius.xl3, style: .continuous))
    }
    .frame(width: 402, height: height)
    .clipped()
  }
}

private struct RaisedCard<Content: View>: View {
  @ViewBuilder let content: () -> Content

  var body: some View {
    content()
      .padding(16)
      .frame(width: 320)
      .background(Color.surfaceRaised, in: RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
      .shadow(Shadow.md)
  }
}

private struct Caption: View {
  let text: String

  var body: some View {
    Text(verbatim: text)
      .font(TextStyle.xs.font(weight: .semibold))
      .foregroundStyle(Color.labelSecondary)
  }
}

private let fruits = ["Apple", "Banana", "Cherry", "Grape", "Lemon", "Mango", "Orange", "Peach", "Pear", "Plum"]
private let slots = (0..<11).map { index -> String in
  let minutes = 18 * 60 + index * 30
  return "\(minutes / 60):\(String(format: "%02d", minutes % 60))"
}
private let booked: Set<String> = ["19:30", "20:00", "20:30"]

private struct WheelGallery: View {
  @State private var fruit = "Lemon"
  @State private var slot = "19:00"
  @State private var dayValue = 7
  @State private var hour = "19"
  @State private var minute = "30"

  var body: some View {
    VStack(alignment: .leading, spacing: 20) {
      Caption(text: "Default")
      RaisedCard {
        WheelPicker {
          WheelPickerColumn(selection: $fruit) {
            ForEach(fruits, id: \.self) { item in
              WheelPickerItem(verbatim: item, value: item)
            }
          }
        }
      }
      Caption(text: "Disabled items")
      RaisedCard {
        WheelPicker {
          WheelPickerColumn(selection: $slot) {
            ForEach(slots, id: \.self) { item in
              WheelPickerItem(verbatim: item, value: item).disabled(booked.contains(item))
            }
          }
        }
      }
      Caption(text: "Date and time")
      RaisedCard {
        VStack(spacing: 12) {
          WheelPicker {
            WheelPickerColumn(selection: $dayValue, alignment: .trailing) {
              ForEach(0..<15, id: \.self) { index in
                WheelPickerItem(verbatim: index == 7 ? "Today" : day(2026, 10, index - 3).formatted(.dateTime.weekday(.abbreviated).month(.abbreviated).day().locale(Locale(identifier: "en_US"))), value: index)
              }
            }
            .frame(maxWidth: .infinity, alignment: .trailing)
            WheelPickerColumn(selection: $hour) {
              ForEach(0..<24, id: \.self) { value in
                WheelPickerItem(verbatim: String(format: "%02d", value), value: String(format: "%02d", value))
              }
            }
            WheelPickerColumn(selection: $minute, alignment: .leading) {
              ForEach(0..<12, id: \.self) { value in
                WheelPickerItem(verbatim: String(format: "%02d", value * 5), value: String(format: "%02d", value * 5))
              }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
          }
          Text(verbatim: "2026-10-04 \(hour):\(minute)")
            .font(TextStyle.sm.font())
            .monospacedDigit()
            .foregroundStyle(Color.labelSecondary)
        }
      }
    }
  }
}

private struct CalendarGallery: View {
  @State private var single: Date? = fromToday(3)
  @State private var small: Date? = fromToday(3)
  @State private var large: Date? = fromToday(3)
  @State private var range: DateRange? = DateRange(from: fromToday(0), to: fromToday(6))
  @State private var many: Set<Date> = [fromToday(1), fromToday(2), fromToday(8)]

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      Caption(text: "Single")
      bordered(DateCalendar(selection: $single))
      Caption(text: "Sizes")
      HStack(alignment: .top, spacing: 12) {
        bordered(DateCalendar(selection: $small, size: .sm))
        Spacer(minLength: 0)
      }
      bordered(DateCalendar(selection: $large, size: .lg))
      Caption(text: "Range")
      bordered(DateCalendar(selection: $range, numberOfMonths: 2))
      Caption(text: "Multiple, week numbers, outside days")
      bordered(DateCalendar(selection: $many, showOutsideDays: true, showWeekNumber: true))
      Caption(text: "Disabled weekends, secondary nav")
      bordered(DateCalendar(selection: $single, buttonVariant: .secondary, isDisabled: { date in
        gregorian.isDateInWeekend(date)
      }))
      Caption(text: "Dropdown caption")
      bordered(DateCalendar(selection: $single, captionLayout: .dropdown))
    }
  }

  private func bordered(_ calendar: some View) -> some View {
    calendar
      .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
      .overlay {
        RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous).strokeBorder(Color.separator)
      }
  }
}

private struct DateGallery: View {
  @State private var empty: Date? = nil
  @State private var value: Date? = day(2026, 10, 4)
  @State private var birthday: Date? = day(1990, 6, 15)

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      VStack(alignment: .leading, spacing: 12) {
        DatePickerField(selection: $empty)
        DatePickerField(selection: $value)
        DatePickerField(selection: $value, placeholder: "Tarih seç")
          .environment(\.locale, Locale(identifier: "tr_TR"))
        DatePickerField(selection: $empty).disabled(true)
        DatePickerField(selection: $empty).invalid(true)
      }
      .frame(width: 240)
      .padding(.horizontal, 16)
      SheetStage(height: 360) {
        DatePickerSheet(
          selection: $birthday,
          fromYear: 1940,
          toYear: 2010,
          title: "Date of birth",
          showCloseButton: false,
          closeLabel: nil
        )
      }
      SheetStage(height: 360) {
        DatePickerSheet(
          selection: $value,
          fromYear: 1926,
          toYear: 2036,
          title: nil,
          showCloseButton: true,
          closeLabel: nil
        )
        .environment(\.locale, Locale(identifier: "tr_TR"))
      }
      ZStack(alignment: .topLeading) {
        PickersBackdrop()
        VStack(alignment: .leading, spacing: 8) {
          DatePickerField(selection: $value)
            .frame(width: 240)
          DateCalendar(selection: $value)
            .environment(\.calendarTransparent, true)
            .background(Color.surfaceRaised, in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
            .shadow(Shadow.lg)
        }
        .padding(16)
      }
      .environment(\.patternCompact, false)
      .frame(width: 402, height: 420)
      .clipped()
    }
    .frame(width: 402, alignment: .leading)
  }
}

private struct StepperGallery: View {
  @State private var quantity = 1
  @State private var copies = 1
  @State private var scale = 100.0
  @State private var pages = 1
  @State private var top = 10

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      ValueStepper(value: $quantity, in: 0...10) {
        StepperInput()
        StepperGroup {
          StepperDecrement()
          StepperSeparator()
          StepperIncrement()
        }
      }
      ValueStepper(value: $top, in: 0...10) {
        StepperInput()
        StepperGroup {
          StepperDecrement()
          StepperSeparator()
          StepperIncrement()
        }
      }
      VStack(spacing: 0) {
        row("Copies") {
          ValueStepper(value: $copies, in: 1...999) { parts }
        }
        Separator()
        row("Scale") {
          ValueStepper(value: $scale, in: 25...400, step: 5, format: FloatingPointFormatStyle<Double>.Percent(locale: Locale(identifier: "en_US")).scale(1)) { parts }
        }
        Separator()
        row("Pages per sheet") {
          ValueStepper(value: $pages) { parts }.disabled(true)
        }
      }
      .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
      .overlay {
        RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous).strokeBorder(Color.separator)
      }
      Text(verbatim: "\(copies) \(copies == 1 ? "copy" : "copies") at \(Int(scale))%")
        .font(TextStyle.sm.font())
        .foregroundStyle(Color.labelSecondary)
    }
  }

  @ViewBuilder private var parts: some View {
    StepperInput()
    StepperGroup {
      StepperDecrement()
      StepperSeparator()
      StepperIncrement()
    }
  }

  private func row(_ label: String, @ViewBuilder stepper: () -> some View) -> some View {
    HStack(spacing: 16) {
      Text(verbatim: label)
        .font(TextStyle.base.font())
        .foregroundStyle(Color.label)
      Spacer(minLength: 0)
      stepper()
    }
    .padding(.horizontal, 16)
    .padding(.vertical, 6)
    .frame(minHeight: 44)
  }
}

private let frameworks = [
  SearchPickerItem(value: "next", label: "Next.js"),
  SearchPickerItem(value: "remix", label: "Remix"),
  SearchPickerItem(value: "astro", label: "Astro"),
  SearchPickerItem(value: "sveltekit", label: "SvelteKit"),
  SearchPickerItem(value: "nuxt", label: "Nuxt"),
  SearchPickerItem(value: "gatsby", label: "Gatsby", disabled: true),
]

private let cities = [
  SearchPickerItem(value: "nyc", label: "New York", group: "Americas"),
  SearchPickerItem(value: "chi", label: "Chicago", group: "Americas"),
  SearchPickerItem(value: "sao", label: "São Paulo", group: "Americas"),
  SearchPickerItem(value: "lon", label: "London", group: "Europe"),
  SearchPickerItem(value: "ber", label: "Berlin", group: "Europe"),
  SearchPickerItem(value: "ist", label: "Istanbul", group: "Europe"),
  SearchPickerItem(value: "tyo", label: "Tokyo", group: "Asia"),
  SearchPickerItem(value: "sin", label: "Singapore", group: "Asia"),
]

private struct SearchGallery: View {
  @State private var empty: String? = nil
  @State private var astro: String? = "astro"
  @State private var city: String? = "ist"

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      VStack(alignment: .leading, spacing: 12) {
        SearchPicker(items: frameworks, selection: $empty, placeholder: "Select a framework")
        SearchPicker(items: frameworks, selection: $astro, placeholder: "Select a framework")
        SearchPicker(items: frameworks, selection: $empty, placeholder: "Select a framework").disabled(true)
        SearchPicker(items: frameworks, selection: $empty, placeholder: "Select a framework").invalid(true)
      }
      .frame(width: 224)
      .padding(.horizontal, 16)
      SheetStage(height: 460, fits: false) {
        SearchPickerSheet(
          items: frameworks,
          selection: $astro,
          searchPlaceholder: "Search frameworks...",
          emptyText: "No framework found.",
          title: "Framework",
          showCloseButton: false,
          closeLabel: nil,
          autofocus: false
        )
      }
      SheetStage(height: 560, fits: false) {
        SearchPickerSheet(
          items: cities,
          selection: $city,
          searchPlaceholder: "Search cities...",
          emptyText: "No city found.",
          title: nil,
          showCloseButton: true,
          closeLabel: nil,
          autofocus: false
        )
      }
      SheetStage(height: 300, fits: false) {
        SearchPickerSheet(
          items: frameworks,
          selection: $empty,
          searchPlaceholder: "Search frameworks...",
          emptyText: "No framework found.",
          title: nil,
          showCloseButton: true,
          closeLabel: "Done",
          initialQuery: "zzz",
          autofocus: false
        )
      }
    }
    .frame(width: 402, alignment: .leading)
  }
}

@MainActor
final class PickersGalleryTests: XCTestCase {
  private func snapshot<V: View>(_ view: V, name: String, padding: CGFloat = 16) throws {
    let output = ProcessInfo.processInfo.environment["GALLERY_OUTPUT"] ?? NSTemporaryDirectory()
    for scheme in [ColorScheme.light, .dark] {
      let host = UIHostingController(rootView: view
        .padding(padding)
        .frame(width: 402, alignment: .leading)
        .background(Color.surface)
        .environment(\.locale, Locale(identifier: "en_US")))
      host.safeAreaRegions = []
      let size = host.sizeThatFits(in: CGSize(width: 402, height: CGFloat.greatestFiniteMagnitude))
      let scene = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }.first
      let window = scene.map { UIWindow(windowScene: $0) } ?? UIWindow()
      window.frame = CGRect(origin: .zero, size: size)
      window.overrideUserInterfaceStyle = scheme == .dark ? .dark : .light
      window.rootViewController = host
      window.makeKeyAndVisible()
      host.view.frame = window.bounds
      host.view.layoutIfNeeded()
      RunLoop.main.run(until: Date().addingTimeInterval(0.6))
      let format = UIGraphicsImageRendererFormat()
      format.scale = 3
      let image = UIGraphicsImageRenderer(size: size, format: format).image {
        host.view.layer.render(in: $0.cgContext)
      }
      window.isHidden = true
      let data = try XCTUnwrap(image.pngData())
      let file = "\(name)-\(scheme == .dark ? "dark" : "light").png"
      try data.write(to: URL(fileURLWithPath: output).appendingPathComponent(file))
    }
  }

  func testRendersWheelPickerGallery() throws {
    try snapshot(WheelGallery(), name: "pickers-wheel")
  }

  func testRendersCalendarGallery() throws {
    try snapshot(CalendarGallery(), name: "pickers-calendar")
  }

  func testRendersDatePickerGallery() throws {
    try snapshot(DateGallery(), name: "pickers-date", padding: 0)
  }

  func testRendersStepperGallery() throws {
    try snapshot(StepperGallery(), name: "pickers-stepper")
  }

  func testRendersSearchPickerGallery() throws {
    try snapshot(SearchGallery(), name: "pickers-search", padding: 0)
  }

  func testRangeSelectionFollowsTaps() {
    let first = day(2026, 10, 10)
    let earlier = day(2026, 10, 4)
    let later = day(2026, 10, 20)
    var range = DateRange.adding(first, to: nil, calendar: gregorian)
    XCTAssertEqual(range, DateRange(from: first))
    range = DateRange.adding(earlier, to: range, calendar: gregorian)
    XCTAssertEqual(range, DateRange(from: earlier, to: first))
    range = DateRange.adding(later, to: range, calendar: gregorian)
    XCTAssertEqual(range, DateRange(from: earlier, to: later))
    range = DateRange.adding(earlier, to: range, calendar: gregorian)
    XCTAssertEqual(range, DateRange(from: later))
    range = DateRange.adding(later, to: range, calendar: gregorian)
    XCTAssertEqual(range, DateRange(from: later, to: later))
    XCTAssertNil(DateRange.adding(later, to: range, calendar: gregorian))
  }

  func testMonthGridStartsOnLocaleWeekday() {
    let sunday = CalendarMonthGrid.weeks(for: day(2026, 10, 15), calendar: gregorian)
    XCTAssertEqual(sunday.count, 5)
    XCTAssertEqual(sunday.first?.first, day(2026, 9, 27))
    XCTAssertTrue(sunday.allSatisfy { $0.count == 7 })
    var monday = Foundation.Calendar(identifier: .gregorian)
    monday.locale = Locale(identifier: "tr_TR")
    let weeks = CalendarMonthGrid.weeks(for: day(2026, 10, 15), calendar: monday)
    XCTAssertEqual(weeks.first?.first, day(2026, 9, 28))
    XCTAssertEqual(weeks.last?.last, day(2026, 11, 1))
  }

  func testStepperClampsAndRounds() {
    XCTAssertEqual(StepperMath.next(1, direction: -1, step: 1, bounds: 0...10), 0)
    XCTAssertNil(StepperMath.next(0, direction: -1, step: 1, bounds: 0...10))
    XCTAssertNil(StepperMath.next(10, direction: 1, step: 1, bounds: 0...10))
    XCTAssertEqual(StepperMath.next(398, direction: 1, step: 5, bounds: 25...400), 400)
    XCTAssertEqual(StepperMath.next(0.2, direction: 1, step: 0.1, bounds: 0...1), 0.3)
    XCTAssertEqual(StepperMath.delay(after: 0), .milliseconds(400))
    XCTAssertEqual(StepperMath.delay(after: 1), .milliseconds(154))
    XCTAssertEqual(StepperMath.delay(after: 40), .milliseconds(35))
  }

  func testWheelPickerSkipsDisabledRows() {
    let disabled = [false, true, true, false, false]
    XCTAssertEqual(WheelPickerNavigation.nearestEnabled(disabled, from: 1), 0)
    XCTAssertEqual(WheelPickerNavigation.nearestEnabled(disabled, from: 2), 3)
    XCTAssertEqual(WheelPickerNavigation.enabled(disabled, from: 1, step: 1), 3)
    XCTAssertEqual(WheelPickerNavigation.enabled(disabled, from: 2, step: -1), 0)
    XCTAssertNil(WheelPickerNavigation.nearestEnabled([true, true], from: 0))
    XCTAssertEqual(WheelPickerNavigation.centered(offset: 47, count: 5), 1)
    XCTAssertEqual(WheelPickerNavigation.centered(offset: 900, count: 5), 4)
  }

  func testDateWheelsFollowLocaleAndClampDays() {
    XCTAssertEqual(DatePart.order(locale: Locale(identifier: "en_US")), [.month, .day, .year])
    XCTAssertEqual(DatePart.order(locale: Locale(identifier: "tr_TR")), [.day, .month, .year])
    XCTAssertEqual(DatePart.order(locale: Locale(identifier: "ja_JP")), [.year, .month, .day])
    let updated = DateWheelMath.update(day(2026, 1, 31), month: 2, calendar: gregorian)
    XCTAssertEqual(updated, day(2026, 2, 28))
  }

  func testSearchPickerFiltersWithinGroups() {
    let groups = SearchPickerGroup.grouping(cities, query: "in")
    XCTAssertEqual(groups.map(\.name), ["Europe", "Asia"])
    XCTAssertEqual(groups.flatMap(\.items).map(\.value), ["ber", "sin"])
    XCTAssertEqual(SearchPickerGroup.grouping(cities, query: "").count, 3)
    XCTAssertTrue(SearchPickerGroup.grouping(frameworks, query: "zzz").isEmpty)
  }
}
