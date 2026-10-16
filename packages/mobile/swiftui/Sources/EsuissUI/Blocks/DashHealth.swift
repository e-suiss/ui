import PhosphorSwift
import SwiftUI

public struct DashHealth: View {
  struct Category {
    let value: String
    let icon: Image
    let tint: Color
  }

  struct Metric: Identifiable {
    let category: String
    let label: String
    let value: String
    var unit: String?
    let color: Color
    let data: [Double]
    var bars = false

    var id: String { label }
  }

  static var categories: [Category] {
    [
      Category(value: "Activity", icon: Ph.flame.fill, tint: Palette.orange500),
      Category(value: "Heart", icon: Ph.heart.fill, tint: Palette.red500),
      Category(value: "Sleep", icon: Ph.moon.fill, tint: Palette.cyan500),
      Category(value: "Mobility", icon: Ph.chartBar.fill, tint: Palette.green500),
    ]
  }

  static var metrics: [Metric] {
    [
      Metric(category: "Activity", label: "Move", value: "486", unit: "kcal", color: Palette.red500, data: [40, 62, 38, 70, 55, 81, 65], bars: true),
      Metric(category: "Activity", label: "Steps", value: "8,412", unit: "steps", color: Palette.orange500, data: [60, 80, 45, 90, 70, 95, 52], bars: true),
      Metric(category: "Heart", label: "Resting Heart Rate", value: "58", unit: "bpm", color: Palette.red500, data: [61, 60, 59, 58, 60, 57, 58]),
      Metric(category: "Sleep", label: "Sleep", value: "7 hr 12 min", color: Palette.cyan500, data: [68, 74, 59, 79, 64, 86, 72], bars: true),
      Metric(category: "Heart", label: "Cardio Fitness", value: "42.1", unit: "VO₂ max", color: Palette.red500, data: [40, 40, 41, 41, 42, 42, 42]),
      Metric(category: "Mobility", label: "Walking Speed", value: "5.1", unit: "km/h", color: Palette.green500, data: [48, 50, 49, 51, 50, 52, 51]),
    ]
  }

  static let defaultPinned = ["Move", "Steps", "Resting Heart Rate", "Sleep"]

  static func cards(section: String, editing: Bool, pinned: [String]) -> [Metric] {
    metrics.filter { metric in
      section == "Summary" ? editing || pinned.contains(metric.label) : metric.category == section
    }
  }

  private var onMetricPress: ((String) -> Void)?
  private var onPinnedChange: (([String]) -> Void)?
  @State private var section: String?
  @State private var editing: Bool
  @State private var pinned: [String]
  @Environment(\.colorScheme) private var colorScheme
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onMetricPress: ((_ metric: String) -> Void)? = nil,
    onPinnedChange: ((_ pinned: [String]) -> Void)? = nil
  ) {
    self.init(section: nil)
    self.onMetricPress = onMetricPress
    self.onPinnedChange = onPinnedChange
  }

  init(section: String?, editing: Bool = false, pinned: [String] = DashHealth.defaultPinned) {
    _section = State(initialValue: section)
    _editing = State(initialValue: editing)
    _pinned = State(initialValue: pinned)
  }

  private var dark: Bool { colorScheme == .dark }

  public var body: some View {
    Screen(background: dark ? .background : .muted) {
      ZStack {
        if let section {
          detail(section)
            .transition(reduceMotion ? .opacity : .move(edge: .trailing))
            .zIndex(1)
        } else {
          root
            .transition(reduceMotion ? .opacity : .move(edge: .leading).combined(with: .opacity))
        }
      }
    }
    .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.45), value: section)
  }

  private var root: some View {
    HeaderScrollView {
      HeaderLargeTitle("Health")
      VStack(alignment: .leading, spacing: 10) {
        group {
          sectionRow("Summary", icon: Ph.heart.fill, tint: Palette.pink500)
          ItemSeparator().padding(.leading, 40)
          sectionRow("Sharing", icon: Ph.users.fill, tint: Palette.blue500)
        }
        Text("Categories")
          .scaledFont(.xl, weight: .bold)
          .padding(.top, 14)
          .accessibilityAddTraits(.isHeader)
        group {
          ForEach(Array(Self.categories.enumerated()), id: \.offset) { index, category in
            if index > 0 {
              ItemSeparator().padding(.leading, 40)
            }
            sectionRow(category.value, icon: category.icon, tint: category.tint)
          }
        }
      }
      .padding(.horizontal, 16)
      .padding(.top, 4)
      .padding(.bottom, 24)
    } header: {
      Header {
        HeaderTitle("Health")
      } trailing: {
        Text(verbatim: "JR")
          .scaledFont(.xs, weight: .semibold)
          .lineLimit(1)
          .minimumScaleFactor(0.5)
          .foregroundStyle(EsuissColor.primaryForeground)
          .frame(width: 34, height: 34)
          .background(Palette.indigo500, in: Circle())
          .padding(.trailing, 8)
          .accessibilityHidden(true)
      }
    }
  }

  private func group<Content: View>(@ViewBuilder content: () -> Content) -> some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl, style: .continuous)
    return VStack(alignment: .leading, spacing: 0) {
      content()
    }
    .environment(\.itemGroupInset, true)
    .background(dark ? EsuissColor.muted : EsuissColor.background, in: shape)
    .clipShape(shape)
  }

  private func sectionRow(_ value: String, icon: Image, tint: Color) -> some View {
    Item(size: .sm, action: {
      editing = false
      section = value
    }) {
      ItemMedia {
        DashHealthTile(icon: icon, tint: tint)
      }
      ItemContent {
        ItemTitle { Text(LocalizedStringKey(value)).fontWeight(.regular) }
      }
      ItemActions {
        Ph.caretRight.bold
          .frame(width: 12, height: 12)
          .foregroundStyle(EsuissColor.mutedForeground)
          .flipsForRightToLeftLayoutDirection(true)
      }
    }
  }

  private func detail(_ section: String) -> some View {
    let summary = section == "Summary"
    let cards = Self.cards(section: section, editing: editing, pinned: pinned)
    return HeaderScrollView {
      HeaderLargeTitle(LocalizedStringKey(section))
      VStack(alignment: .leading, spacing: 10) {
        HStack(spacing: 8) {
          Text(summary ? "Pinned" : "Last 7 days")
            .scaledFont(.xl, weight: .bold)
            .frame(maxWidth: .infinity, alignment: .leading)
            .accessibilityAddTraits(.isHeader)
          if summary {
            Button {
              withAnimation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.4)) { editing.toggle() }
            } label: {
              Text(editing ? "Done" : "Edit")
                .fontWeight(editing ? .semibold : .regular)
            }
            .buttonStyle(.variant(.plain, size: .sm))
          }
        }
        .frame(minHeight: 32)
        .padding(.top, 4)
        if cards.isEmpty {
          Text("No pinned items. Use Edit to add some.")
            .scaledFont(.base)
            .foregroundStyle(EsuissColor.mutedForeground)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 30)
        } else {
          cardList(cards)
        }
      }
      .padding(.horizontal, 16)
      .padding(.bottom, 24)
    } header: {
      Header {
        HeaderTitle(LocalizedStringKey(section))
      } leading: {
        HeaderBack("Health") {
          editing = false
          self.section = nil
        }
      }
    }
  }

  private func cardList(_ cards: [Metric]) -> some View {
    VStack(spacing: 10) {
      ForEach(cards) { metric in
        let isPinned = pinned.contains(metric.label)
        HStack(spacing: 12) {
          if editing && section == "Summary" {
            Button {
              toggle(metric.label)
            } label: {
              (isPinned ? Ph.minus.bold : Ph.plus.bold)
                .frame(width: 12, height: 12)
                .foregroundStyle(EsuissColor.primaryForeground)
                .frame(width: 24, height: 24)
                .background(isPinned ? EsuissColor.destructive : Palette.green500, in: Circle())
                .frame(width: 44, height: 44)
                .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            .padding(-10)
            .accessibilityLabel(Text(isPinned ? "Unpin \(metric.label)" : "Pin \(metric.label)"))
            .transition(.scale.combined(with: .opacity))
          }
          DashHealthCard(
            metric: metric,
            category: Self.categories.first { $0.value == metric.category } ?? Self.categories[0],
            dimmed: editing && !isPinned
          ) {
            onMetricPress?(metric.label)
          }
        }
        .transition(.opacity.combined(with: .offset(y: 8)))
      }
    }
  }

  private func toggle(_ label: String) {
    withAnimation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.3)) {
      if pinned.contains(label) {
        pinned.removeAll { $0 == label }
      } else {
        pinned.append(label)
      }
    }
    onPinnedChange?(pinned)
  }
}

private struct DashHealthTile: View {
  let icon: Image
  let tint: Color

  var body: some View {
    icon
      .frame(width: 14, height: 14)
      .foregroundStyle(EsuissColor.primaryForeground)
      .frame(width: 26, height: 26)
      .background(tint, in: RoundedRectangle(cornerRadius: Radius.md, style: .continuous))
      .accessibilityHidden(true)
  }
}

private struct DashHealthCard: View {
  let metric: DashHealth.Metric
  let category: DashHealth.Category
  let dimmed: Bool
  let action: () -> Void

  @Environment(\.colorScheme) private var colorScheme

  var body: some View {
    Button(action: action) {
      VStack(alignment: .leading, spacing: 10) {
        HStack(spacing: 6) {
          category.icon
            .frame(width: 16, height: 16)
          Text(LocalizedStringKey(metric.label))
            .scaledFont(.base, weight: .semibold)
            .frame(maxWidth: .infinity, alignment: .leading)
          Text(verbatim: "9:41")
            .scaledFont(.sm)
            .foregroundStyle(EsuissColor.mutedForeground)
          Ph.caretRight.bold
            .frame(width: 12, height: 12)
            .foregroundStyle(EsuissColor.mutedForeground)
            .flipsForRightToLeftLayoutDirection(true)
        }
        .foregroundStyle(category.tint)
        HStack(alignment: .bottom, spacing: 16) {
          HStack(alignment: .firstTextBaseline, spacing: 4) {
            Text(verbatim: metric.value)
              .scaledFont(.xl3, weight: .bold)
              .foregroundStyle(EsuissColor.foreground)
            if let unit = metric.unit {
              Text(verbatim: unit)
                .scaledFont(.base, weight: .semibold)
                .foregroundStyle(EsuissColor.mutedForeground)
            }
          }
            .monospacedDigit()
            .lineLimit(1)
            .minimumScaleFactor(0.7)
            .frame(maxWidth: .infinity, alignment: .leading)
          DashHealthSpark(data: metric.data, color: metric.color, bars: metric.bars)
        }
      }
      .padding(.horizontal, 16)
      .padding(.vertical, 12)
      .background(colorScheme == .dark ? EsuissColor.muted : EsuissColor.background, in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
      .contentShape(RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
      .opacity(dimmed ? 0.55 : 1)
      .animation(.easeOut(duration: 0.2), value: dimmed)
    }
    .buttonStyle(DashHealthCardStyle())
    .accessibilityElement(children: .combine)
  }
}

private struct DashHealthCardStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .opacity(configuration.isPressed ? 0.8 : 1)
  }
}

private struct DashHealthSpark: View {
  let data: [Double]
  let color: Color
  let bars: Bool

  var body: some View {
    let high = data.max() ?? 1
    let low = data.min() ?? 0
    Group {
      if bars {
        HStack(alignment: .bottom, spacing: 4) {
          ForEach(Array(data.enumerated()), id: \.offset) { index, value in
            RoundedRectangle(cornerRadius: Radius.xs, style: .continuous)
              .fill(color)
              .opacity(index == data.count - 1 ? 1 : 0.45)
              .frame(width: 8, height: max(2, 36 * value / max(high, 1)))
          }
        }
        .frame(height: 36, alignment: .bottom)
      } else {
        Path { path in
          for (index, value) in data.enumerated() {
            let x = CGFloat(index) / CGFloat(max(data.count - 1, 1)) * 120
            let y = 36 - CGFloat((value - low) / max(1, high - low)) * 30 - 3
            if index == 0 {
              path.move(to: CGPoint(x: x, y: y))
            } else {
              path.addLine(to: CGPoint(x: x, y: y))
            }
          }
        }
        .stroke(color, style: StrokeStyle(lineWidth: 2.2, lineCap: .round, lineJoin: .round))
        .frame(width: 120, height: 36)
      }
    }
    .accessibilityHidden(true)
  }
}
