import EsuissUI
import PhosphorSwift
import SwiftUI

enum WidgetStories {
  static let group = StoryGroup(.components, "Widget", stories: [
    Story("Default") {
      Widget(.small) {
        WidgetWeather()
      }
    },
    Story("Sizes") {
      ScrollView(.horizontal, showsIndicators: false) {
        HStack(alignment: .top, spacing: 16) {
          ForEach(widgetSizeNames, id: \.title) { entry in
            Widget(entry.size) {
              WidgetHeader {
                WidgetTitle(verbatim: entry.title)
              }
              WidgetFooter(verbatim: entry.span)
            }
          }
        }
      }
    },
    Story("Editing") {
      VStack(alignment: .leading, spacing: 0) {
        WidgetEditable(initial: .large) {
          WidgetSales()
        }
        WidgetHint(text: "Drag the corner handle to snap between sizes. Double tap it to reset.")
      }
      .frame(maxWidth: .infinity, alignment: .leading)
    },
    Story("InsideHandle") {
      VStack(alignment: .leading, spacing: 0) {
        WidgetEditable(initial: .medium, handle: .inside) {
          WidgetSales()
        }
        WidgetHint(text: "The handle sits inside the corner.")
      }
      .frame(maxWidth: .infinity, alignment: .leading)
    },
    Story("LimitedSizes") {
      VStack(alignment: .leading, spacing: 0) {
        WidgetEditable(initial: .medium, sizes: [.small, .medium]) {
          WidgetReservations()
        }
        WidgetHint(text: "Only small and medium are offered.")
      }
      .frame(maxWidth: .infinity, alignment: .leading)
    },
    Story("Controlled") {
      WidgetControlled()
    },
    Story("Centered") {
      Widget(.small, align: .center) {
        WidgetHeader {
          WidgetIcon(size: .lg) {
            Ph.cashRegister.regular
          }
          WidgetTitle("Point of sale")
        }
        WidgetDescription("3 open orders")
      }
    },
    Story("Auto") {
      Widget(nil) {
        WidgetWeather()
      }
      .frame(maxWidth: .infinity)
      .frame(height: 192)
    },
    Story("Dashboard") {
      VStack(spacing: 16) {
        HStack(spacing: 16) {
          Widget(nil) {
            WidgetHeader {
              WidgetIcon {
                Ph.sun.fill
              }
              WidgetTitle("Istanbul")
            }
            WidgetValue(verbatim: "24°")
            WidgetFooter("Partly cloudy")
          }
          Widget(nil, align: .center) {
            WidgetHeader {
              WidgetIcon(size: .lg) {
                Ph.cookingPot.regular
              }
              WidgetTitle("Kitchen display")
            }
            WidgetDescription("5 tickets")
          }
        }
        .frame(height: 168)
        Widget(nil) {
          WidgetSalesHeader()
          WidgetValue(verbatim: "₺18,240")
          WidgetFooter("Today's revenue · 42 orders")
        }
        .frame(height: 168)
      }
      .frame(maxWidth: .infinity)
    },
  ])
}

private struct WidgetSizeName {
  let size: WidgetSize
  let title: String
  let span: String
}

private let widgetSizeNames = [
  WidgetSizeName(size: .small, title: "Small", span: "1 × 1"),
  WidgetSizeName(size: .medium, title: "Medium", span: "2 × 1"),
  WidgetSizeName(size: .large, title: "Large", span: "2 × 2"),
  WidgetSizeName(size: .extraLarge, title: "Extra large", span: "4 × 2"),
]

private func widgetSizeValue(_ size: WidgetSize) -> String {
  switch size {
  case .small: "small"
  case .medium: "medium"
  case .large: "large"
  case .extraLarge: "extra-large"
  }
}

private let widgetHourly: [CGFloat] = [12, 18, 14, 30, 44, 34, 22, 40, 100, 46, 30, 14]

private struct WidgetTopItem {
  let name: String
  let count: Int
}

private let widgetTopItems = [
  WidgetTopItem(name: "Grilled meatballs", count: 38),
  WidgetTopItem(name: "Lahmacun", count: 31),
  WidgetTopItem(name: "Adana kebab", count: 24),
]

private struct WidgetReservation {
  let time: String
  let place: String
}

private let widgetReservations = [
  WidgetReservation(time: "18:00", place: "Table 4"),
  WidgetReservation(time: "19:00", place: "Garden 3"),
  WidgetReservation(time: "20:00", place: "Table 12"),
  WidgetReservation(time: "21:00", place: "Table 7"),
]

private struct WidgetHint: View {
  let text: String

  var body: some View {
    Text(verbatim: text)
      .textStyle(.xs)
      .foregroundStyle(EsuissColor.mutedForeground)
      .padding(.top, 24)
  }
}

private struct WidgetEditable<Content: View>: View {
  let sizes: [WidgetSize]
  let handle: WidgetHandlePlacement
  let resetSize: WidgetSize
  @ViewBuilder let content: () -> Content

  @State private var size: WidgetSize

  init(
    initial: WidgetSize,
    sizes: [WidgetSize] = WidgetSize.allCases,
    handle: WidgetHandlePlacement = .outside,
    @ViewBuilder content: @escaping () -> Content
  ) {
    self.sizes = sizes
    self.handle = handle
    resetSize = initial
    self.content = content
    _size = State(initialValue: initial)
  }

  var body: some View {
    Widget(size: $size, sizes: sizes, editing: true, handle: handle, resetSize: resetSize) {
      content()
    }
  }
}

private struct WidgetControlled: View {
  @State private var size: WidgetSize = .small

  var body: some View {
    VStack(alignment: .leading, spacing: 0) {
      Widget(size: $size, editing: true) {
        WidgetWeather()
      }
      WidgetHint(text: "Size: \(widgetSizeValue(size))")
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}

private struct WidgetWeather: View {
  var body: some View {
    WidgetHeader {
      WidgetIcon {
        Ph.sun.fill
      }
      WidgetTitle("Istanbul")
    }
    WidgetContent {
      WidgetValue(verbatim: "24°")
      WidgetDescription("Partly cloudy")
    }
    WidgetFooter(verbatim: "H 27° · L 18°")
  }
}

private struct WidgetSalesHeader: View {
  var body: some View {
    WidgetHeader {
      WidgetIcon(size: .sm) {
        Ph.cashRegister.fill.foregroundStyle(Color.adaptive(light: Palette.amber600, dark: Palette.amber400))
      }
      WidgetTitle("Hestia")
        .foregroundStyle(Color.adaptive(light: Palette.amber600, dark: Palette.amber400))
    }
  }
}

private struct WidgetBars: View {
  var body: some View {
    GeometryReader { proxy in
      HStack(alignment: .bottom, spacing: 4) {
        ForEach(Array(widgetHourly.enumerated()), id: \.offset) { _, value in
          RoundedRectangle(cornerRadius: Radius.sm, style: .continuous)
            .fill(value == 100 ? Palette.amber500 : Palette.amber500.opacity(0.4))
            .frame(height: proxy.size.height * value / 100)
            .frame(maxWidth: .infinity)
        }
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottom)
    }
    .accessibilityHidden(true)
  }
}

private struct WidgetSales: View {
  @Environment(\.widgetSize) private var size

  var body: some View {
    WidgetSalesHeader()
    if size == .medium {
      HStack(alignment: .bottom, spacing: 12) {
        revenue
        WidgetBars()
      }
      .frame(maxHeight: .infinity)
    } else {
      VStack(alignment: .leading, spacing: 12) {
        revenue
        if size != .small {
          WidgetBars().frame(height: 56)
        }
      }
    }
    if size == .large || size == .extraLarge {
      VStack(spacing: 0) {
        ForEach(widgetTopItems, id: \.name) { item in
          HStack {
            Text(verbatim: item.name)
              .textStyle(.sm)
            Spacer(minLength: 8)
            Text(verbatim: "\(item.count)")
              .textStyle(.sm)
              .foregroundStyle(EsuissColor.mutedForeground)
          }
          .padding(.vertical, 6)
          .overlay(alignment: .bottom) {
            EsuissColor.border.frame(height: 1)
          }
        }
      }
      .clipped()
    }
    WidgetFooter(verbatim: "42 orders · 18:42")
  }

  private var revenue: some View {
    WidgetContent {
      WidgetValue(verbatim: "₺18,240")
      WidgetDescription("Today's revenue")
    }
    .fixedSize(horizontal: true, vertical: false)
  }
}

private struct WidgetReservations: View {
  @Environment(\.widgetSize) private var size

  var body: some View {
    WidgetHeader {
      WidgetIcon(size: .sm) {
        Ph.calendarBlank.fill.foregroundStyle(EsuissColor.primary)
      }
      WidgetTitle("Reservations")
        .foregroundStyle(EsuissColor.primary)
    }
    HStack(alignment: .bottom, spacing: 16) {
      WidgetContent {
        WidgetValue(verbatim: "12")
        WidgetDescription("Tonight")
      }
      .fixedSize(horizontal: true, vertical: false)
      if size == .medium {
        VStack(alignment: .leading, spacing: 4) {
          ForEach(widgetReservations.prefix(3), id: \.time) { item in
            HStack(spacing: 12) {
              Text(verbatim: item.time)
                .textStyle(.sm)
                .foregroundStyle(EsuissColor.mutedForeground)
                .frame(width: 44, alignment: .leading)
              Text(verbatim: item.place)
                .textStyle(.sm)
                .lineLimit(1)
                .frame(maxWidth: .infinity, alignment: .leading)
            }
          }
        }
        .frame(maxWidth: .infinity)
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomLeading)
  }
}
