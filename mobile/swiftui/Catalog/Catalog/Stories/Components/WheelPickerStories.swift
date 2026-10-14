import EsuissUI
import SwiftUI

enum WheelPickerStories {
  static let group = StoryGroup(.components, "Wheel Picker", stories: [
    Story("Default") {
      WheelPickerFrame {
        FruitDemo()
      }
    },
    Story("DisabledItems") {
      WheelPickerFrame {
        SlotsDemo()
      }
    },
    Story("DateTime") {
      WheelPickerFrame {
        DateTimeDemo()
      }
    },
  ])
}

private struct WheelPickerFrame<Content: View>: View {
  @ViewBuilder let content: () -> Content

  @Environment(\.colorScheme) private var colorScheme

  var body: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
    content()
      .padding(16)
      .frame(width: 320)
      .background(Color.surfaceRaised, in: shape)
      .overlay {
        shape.strokeBorder(Color.label.opacity(colorScheme == .dark ? 0.1 : 0.05))
      }
      .shadow(Shadow.md)
  }
}

private let wheelFruits = ["Apple", "Banana", "Cherry", "Grape", "Lemon", "Mango", "Orange", "Peach", "Pear", "Plum"]

private struct FruitDemo: View {
  @State private var fruit = "Lemon"

  var body: some View {
    WheelPicker {
      WheelPickerColumn(selection: $fruit) {
        ForEach(wheelFruits, id: \.self) { item in
          WheelPickerItem(verbatim: item, value: item)
        }
      }
      .accessibilityLabel(Text("Fruit"))
    }
  }
}

private let wheelSlots: [String] = (0..<11).map { index in
  let minutes = 18 * 60 + index * 30
  return String(format: "%d:%02d", minutes / 60, minutes % 60)
}

private let wheelBooked: Set<String> = ["19:30", "20:00", "20:30"]

private struct SlotsDemo: View {
  @State private var slot = "19:00"

  var body: some View {
    WheelPicker {
      WheelPickerColumn(selection: $slot) {
        ForEach(wheelSlots, id: \.self) { item in
          WheelPickerItem(verbatim: item, value: item)
            .disabled(wheelBooked.contains(item))
        }
      }
      .accessibilityLabel(Text("Reservation time"))
    }
  }
}

private struct WheelDay {
  let value: String
  let label: String
}

private let wheelDays: [WheelDay] = {
  var calendar = Calendar(identifier: .gregorian)
  calendar.timeZone = TimeZone(identifier: "UTC") ?? .current
  let today = calendar.date(from: DateComponents(year: 2026, month: 10, day: 4)) ?? .now
  let label = Date.FormatStyle(timeZone: calendar.timeZone)
    .weekday(.abbreviated)
    .month(.abbreviated)
    .day()
    .locale(Locale(identifier: "en_US"))
  return (0..<15).map { index in
    let date = calendar.date(byAdding: .day, value: index - 7, to: today) ?? today
    let parts = calendar.dateComponents([.year, .month, .day], from: date)
    let value = String(format: "%04d-%02d-%02d", parts.year ?? 0, parts.month ?? 0, parts.day ?? 0)
    return WheelDay(value: value, label: index == 7 ? "Today" : date.formatted(label))
  }
}()

private let wheelHours = (0..<24).map { String(format: "%02d", $0) }
private let wheelMinutes = (0..<12).map { String(format: "%02d", $0 * 5) }

private struct DateTimeDemo: View {
  @State private var day = "2026-10-04"
  @State private var hour = "19"
  @State private var minute = "30"

  var body: some View {
    VStack(spacing: 12) {
      WheelPicker {
        WheelPickerColumn(selection: $day, alignment: .trailing) {
          ForEach(wheelDays, id: \.value) { item in
            WheelPickerItem(verbatim: item.label, value: item.value)
          }
        }
        .frame(minWidth: 150, maxWidth: .infinity, alignment: .trailing)
        .accessibilityLabel(Text("Day"))
        WheelPickerColumn(selection: $hour) {
          ForEach(wheelHours, id: \.self) { item in
            WheelPickerItem(verbatim: item, value: item)
          }
        }
        .accessibilityLabel(Text("Hour"))
        WheelPickerColumn(selection: $minute, alignment: .leading) {
          ForEach(wheelMinutes, id: \.self) { item in
            WheelPickerItem(verbatim: item, value: item)
          }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .accessibilityLabel(Text("Minute"))
      }
      Text(verbatim: "\(day) \(hour):\(minute)")
        .textStyle(.sm)
        .monospacedDigit()
        .foregroundStyle(Color.labelSecondary)
        .multilineTextAlignment(.center)
        .frame(maxWidth: .infinity)
    }
  }
}
