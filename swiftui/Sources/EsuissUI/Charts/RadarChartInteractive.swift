import SwiftUI

private let axes = ["Camera", "Battery", "Performance", "Display", "Weight", "Price"]

private let models = ["pro", "standard", "air", "lite"]

private let scores: [String: [Double]] = [
  "pro": [98, 90, 98, 95, 58, 52],
  "standard": [85, 82, 88, 90, 74, 80],
  "air": [78, 68, 92, 90, 98, 64],
  "lite": [70, 80, 76, 72, 80, 95],
]

private let maxSelected = 3

private let chartConfig: ChartConfig = [
  "pro": .init("Phone Pro", color: .orange),
  "standard": .init("Phone", color: .blue),
  "air": .init("Phone Air", color: .cyan),
  "lite": .init("Phone Lite", color: .purple),
]

private func average(_ model: String) -> Double {
  let values = scores[model] ?? []
  return (values.reduce(0, +) / Double(max(axes.count, 1))).rounded()
}

private struct ModelChipStyle: ToggleStyle {
  let color: Color

  func makeBody(configuration: Configuration) -> some View {
    HapticButton(style: PressReader { pressed in
      let shape = RoundedRectangle(cornerRadius: Radius.lg, style: .continuous)
      HStack(spacing: 6) {
        Circle()
          .fill(configuration.isOn ? color : .labelQuaternary)
          .frame(width: 8, height: 8)
        configuration.label
      }
      .scaledFont(.sm, weight: .semibold)
      .lineLimit(1)
      .foregroundStyle(Color.label)
      .padding(.horizontal, 12)
      .frame(minHeight: 32)
      .background(background(configuration.isOn, pressed: pressed), in: shape)
      .contentShape(shape)
    }) {
      configuration.isOn.toggle()
      return true
    }
    .accessibilityAddTraits(configuration.isOn ? .isSelected : [])
  }

  private func background(_ isOn: Bool, pressed: Bool) -> Color {
    if isOn { return color.opacity(pressed ? 0.28 : 0.16) }
    return pressed ? .controlPressed : .control
  }
}

public struct RadarChartInteractive: View {
  @State private var selected: [String]
  @State private var visible: Set<String>
  @State private var axis: Int?
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init() {
    _selected = State(initialValue: ["pro", "air"])
    _visible = State(initialValue: [])
  }

  init(selected: [String], axis: Int?) {
    _selected = State(initialValue: selected)
    _visible = State(initialValue: Set(selected))
    _axis = State(initialValue: axis)
  }

  public var body: some View {
    Card(.filled, size: .sm) {
      VStack(alignment: .leading, spacing: 2) {
        Text("Compare phone models")
          .textStyle(.lg, weight: .semibold)
        Text("Up to three models · scores out of 100, sample data")
          .textStyle(.sm)
          .foregroundStyle(Color.labelSecondary)
      }
      .padding(.horizontal, 16)
      CardContent {
        VStack(alignment: .leading, spacing: 16) {
          ChartLegendLayout(horizontalSpacing: 8, verticalSpacing: 8, centered: false) {
            ForEach(models, id: \.self) { model in
              Toggle(isOn: Binding(get: { selected.contains(model) }, set: { toggle(model, pressed: $0) })) {
                Text(LocalizedStringKey(chartConfig.label(model)))
              }
              .toggleStyle(ModelChipStyle(color: chartConfig.color(model)))
            }
          }
          .accessibilityElement(children: .contain)
          .accessibilityLabel("Models")
          ChartContainer(config: chartConfig) {
            RadarChart(
              models.map { model in
                let shown: Double = visible.contains(model) ? 1 : 0
                return Radar(
                  model,
                  values: (scores[model] ?? []).map { $0 * shown },
                  fillOpacity: 0.14 * shown,
                  strokeWidth: 2,
                  strokeOpacity: shown,
                  dot: 3 * shown
                )
              },
              labels: axes,
              domain: 0...100,
              outerRadius: 0.74,
              margin: EdgeInsets(top: 8, leading: 56, bottom: 8, trailing: 56),
              angleAxis: PolarAngleAxis(textStyle: .sm, highlightsSelection: true),
              selection: $axis,
              accessibilityLabel: "Compare phone models",
              items: { index in
                models.filter(selected.contains).map { model in
                  ChartTooltipItem(model, value: scores[model]?[index] ?? 0)
                }
              }
            ) { payload in
              ChartTooltipContent(payload, indicator: .line) { item in
                Capsule()
                  .fill(chartConfig.color(item.key))
                  .frame(width: 3, height: 12)
                Text(LocalizedStringKey(chartConfig.label(item.key)))
                  .foregroundStyle(Color.labelSecondary)
                  .frame(maxWidth: .infinity, alignment: .leading)
                Text(item.value, format: .number)
                  .font(TextStyle.xs.font(weight: .semibold))
                  .monospacedDigit()
              }
            }
          }
          .frame(height: 344)
          VStack(spacing: 10) {
            ForEach(models.filter(selected.contains), id: \.self) { model in
              row(model)
                .transition(.opacity.combined(with: .scale(scale: 0.96)))
            }
          }
          .animation(reduceMotion ? nil : .timingCurve(0.45, 0, 0.2, 1, duration: 0.5), value: selected)
        }
      }
    }
    .onAppear { sync() }
    .onChange(of: selected) { _, _ in sync() }
  }

  private func sync() {
    let target = Set(selected)
    guard visible != target else { return }
    withAnimation(reduceMotion ? nil : .timingCurve(0.65, 0, 0.35, 1, duration: 0.6)) {
      visible = target
    }
  }

  private func toggle(_ model: String, pressed: Bool) {
    if !pressed {
      if selected.count > 1 { selected.removeAll { $0 == model } }
    } else if !selected.contains(model) {
      selected = selected.count >= maxSelected ? Array(selected.dropFirst()) + [model] : selected + [model]
    }
  }

  private func row(_ model: String) -> some View {
    let index = axis.flatMap { axes.indices.contains($0) ? $0 : nil }
    let value = index.map { scores[model]?[$0] ?? 0 } ?? average(model)
    return HStack(spacing: 12) {
      Circle()
        .fill(chartConfig.color(model))
        .frame(width: 10, height: 10)
      VStack(alignment: .leading, spacing: 2) {
        Text(LocalizedStringKey(chartConfig.label(model)))
          .textStyle(.base, weight: .semibold)
        Text(LocalizedStringKey(index.map { axes[$0] } ?? "Overall score"))
          .textStyle(.xs)
          .foregroundStyle(Color.labelSecondary)
      }
      .frame(maxWidth: .infinity, alignment: .leading)
      Text(value, format: .number)
        .textStyle(.xl2, weight: .semibold)
        .monospacedDigit()
    }
    .padding(.horizontal, 14)
    .padding(.vertical, 12)
    .background(Color.surface, in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
    .accessibilityElement(children: .combine)
  }
}
