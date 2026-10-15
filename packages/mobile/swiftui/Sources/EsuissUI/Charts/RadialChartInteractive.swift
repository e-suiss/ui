import SwiftUI

private let rings: [(key: String, label: String, unit: String, goal: Double, color: Color)] = [
  ("move", "Move", "kcal", 600, Palette.red500),
  ("exercise", "Exercise", "min", 30, Palette.green500),
  ("stand", "Stand", "hr", 12, Palette.cyan500),
]

private let week: [(day: String, values: [Double])] = [
  ("Monday", [520, 34, 11]),
  ("Tuesday", [610, 42, 12]),
  ("Wednesday", [380, 18, 9]),
  ("Thursday", [640, 45, 12]),
  ("Friday", [470, 28, 10]),
  ("Saturday", [720, 62, 12]),
  ("Sunday", [486, 24, 10]),
]

private struct Rings: View {
  let values: [Double]
  let size: CGFloat
  let bar: CGFloat

  var body: some View {
    ZStack {
      ForEach(rings.indices, id: \.self) { index in
        let ring = rings[index]
        let radius = size / 2 - bar / 2 - CGFloat(index) * (bar + max(1, bar * 0.12))
        let progress = max(0, min(1, (values[index]) / ring.goal))
        Circle()
          .stroke(ring.color.opacity(0.22), lineWidth: bar)
          .frame(width: radius * 2, height: radius * 2)
        Circle()
          .trim(from: 0, to: progress)
          .stroke(ring.color, style: StrokeStyle(lineWidth: bar, lineCap: .round))
          .rotationEffect(.degrees(-90))
          .frame(width: radius * 2, height: radius * 2)
          .opacity(progress > 0.001 ? 1 : 0)
      }
    }
    .frame(width: size, height: size)
    .accessibilityHidden(true)
  }
}

public struct RadialChartInteractive: View {
  @State private var selected = 6
  @State private var values: [Double] = [0, 0, 0]
  @Environment(\.colorScheme) private var colorScheme
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init() {}

  init(selected: Int, filled: Bool) {
    _selected = State(initialValue: selected)
    _values = State(initialValue: filled ? week[selected].values : [0, 0, 0])
  }

  public var body: some View {
    let target = week[selected].values
    Card(.filled, size: .sm) {
      VStack(alignment: .leading, spacing: 2) {
        Text("Activity")
          .textStyle(.lg, weight: .semibold)
        Text("This week · pick a day")
          .textStyle(.sm)
          .foregroundStyle(EsuissColor.mutedForeground)
      }
      .padding(.horizontal, 16)
      CardContent {
        VStack(spacing: 24) {
          HStack(spacing: 4) {
            ForEach(week.indices, id: \.self) { index in
              day(index)
            }
          }
          .hapticFeedback(.selection, trigger: selected)
          .accessibilityElement(children: .contain)
          .accessibilityLabel("Day")
          ViewThatFits(in: .horizontal) {
            HStack(spacing: 32) {
              Rings(values: values, size: 260, bar: 24)
              stats(target)
            }
            VStack(spacing: 24) {
              Rings(values: values, size: 260, bar: 24)
              stats(target)
            }
          }
          .frame(maxWidth: .infinity)
        }
      }
    }
    .onAppear { fill(target) }
    .onChange(of: selected) { _, _ in fill(week[selected].values) }
  }

  private func fill(_ target: [Double]) {
    guard values != target else { return }
    withAnimation(reduceMotion ? nil : .timingCurve(0.65, 0, 0.35, 1, duration: 0.75)) {
      values = target
    }
  }

  private func day(_ index: Int) -> some View {
    let active = index == selected
    return Button {
      selected = index
    } label: {
      VStack(spacing: 6) {
        Text(verbatim: String(week[index].day.prefix(3)))
          .textStyle(.xs, weight: .semibold)
          .foregroundStyle(active ? EsuissColor.foreground : EsuissColor.mutedForeground)
        Rings(values: week[index].values, size: 40, bar: 4)
      }
      .padding(.vertical, 8)
      .frame(maxWidth: .infinity)
      .background(active ? EsuissColor.background : .clear, in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
      .contentShape(RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
    }
    .buttonStyle(.plain)
    .accessibilityLabel(Text(LocalizedStringKey(week[index].day)))
    .accessibilityAddTraits(active ? .isSelected : [])
  }

  private func stats(_ target: [Double]) -> some View {
    VStack(alignment: .leading, spacing: 16) {
      ForEach(rings.indices, id: \.self) { index in
        let ring = rings[index]
        let percent = Int((target[index] / ring.goal * 100).rounded())
        VStack(alignment: .leading, spacing: 2) {
          Text(LocalizedStringKey(ring.label))
            .textStyle(.base, weight: .semibold)
          HStack(alignment: .firstTextBaseline, spacing: 2) {
            Text(verbatim: "\(Int(target[index]))/\(Int(ring.goal))")
              .textStyle(.xl3, weight: .semibold)
              .monospacedDigit()
              .contentTransition(.numericText(value: target[index]))
            Text(LocalizedStringKey(ring.unit.uppercased()))
              .textStyle(.base, weight: .semibold)
          }
          .foregroundStyle(tint(ring.color))
          Text(verbatim: "\(percent)%\(percent >= 100 ? " · goal met" : "")")
            .textStyle(.xs)
            .foregroundStyle(EsuissColor.mutedForeground)
        }
        .accessibilityElement(children: .combine)
      }
    }
    .frame(minWidth: 176, alignment: .leading)
    .animation(reduceMotion ? nil : .default, value: selected)
  }

  private func tint(_ color: Color) -> Color {
    guard colorScheme != .dark else { return color }
    if #available(iOS 18, *) {
      return color.mix(with: EsuissColor.foreground, by: 0.45)
    }
    return color
  }
}
