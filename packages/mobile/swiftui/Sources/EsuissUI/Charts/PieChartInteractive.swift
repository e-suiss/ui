import Charts
import SwiftUI

private enum Device: String, CaseIterable {
  case phone, cloud

  var label: String {
    switch self {
    case .phone: "Phone"
    case .cloud: "Cloud"
    }
  }

  var total: Double {
    switch self {
    case .phone: 256
    case .cloud: 200
    }
  }

  var used: [String: Double] {
    switch self {
    case .phone: ["apps": 62.4, "photos": 48.1, "system": 25.8, "messages": 9.8, "other": 6.3]
    case .cloud: ["photos": 96.2, "backups": 31.4, "drive": 18.7, "messages": 7.9, "mail": 2.3]
    }
  }

  var sizes: [Double] {
    let taken = used.values.reduce(0, +)
    return kinds.map { $0 == "free" ? total - taken : used[$0] ?? 0 }
  }
}

private let kinds = ["apps", "photos", "system", "backups", "drive", "messages", "mail", "other", "free"]

private let chartConfig: ChartConfig = [
  "apps": .init("Apps", color: Palette.red500),
  "photos": .init("Photos", color: EsuissColor.chart4),
  "system": .init("System", color: EsuissColor.chart5),
  "backups": .init("Backups", color: Palette.purple500),
  "drive": .init("Drive", color: EsuissColor.chart1),
  "messages": .init("Messages", color: Palette.green500),
  "mail": .init("Mail", color: Palette.cyan500),
  "other": .init("Other", color: Palette.yellow500),
  "free": .init("Free", color: EsuissColor.secondary),
]

public struct PieChartInteractive: View {
  @State private var device: Device = .phone
  @State private var active: Int?
  @Environment(\.locale) private var locale
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init() {}

  private var deviceBinding: Binding<Device?> {
    Binding(
      get: { device },
      set: { value in
        guard let value, value != device else { return }
        withAnimation(reduceMotion ? nil : .timingCurve(0.65, 0, 0.35, 1, duration: 0.7)) {
          device = value
          active = nil
        }
      }
    )
  }

  private var activeBinding: Binding<Int?> {
    Binding(
      get: { active },
      set: { value in
        withAnimation(reduceMotion ? nil : .easeOut(duration: 0.26)) { active = value }
      }
    )
  }

  private func size(_ value: Double) -> String {
    max(0, value).formatted(.number.precision(.fractionLength(1)).locale(locale))
  }

  private func gigabytes(_ value: Double) -> String {
    "\(size(value)) GB"
  }

  public var body: some View {
    let sizes = device.sizes
    let total = sizes.reduce(0, +)
    let used = total - (sizes.last ?? 0)
    let value = active.map { sizes[$0] } ?? used
    Card(.filled, size: .sm) {
      HStack(alignment: .top, spacing: 16) {
        VStack(alignment: .leading, spacing: 2) {
          Text("\(device.label) storage")
            .textStyle(.lg, weight: .semibold)
          Text("\(size(used)) GB of \(Int(device.total)) GB used")
            .textStyle(.sm)
            .monospacedDigit()
            .foregroundStyle(EsuissColor.mutedForeground)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        ToggleGroup(selection: deviceBinding, size: .sm, spacing: 0) {
          ForEach(Device.allCases, id: \.self) { item in
            ToggleGroupItem(LocalizedStringKey(item.label), value: item)
          }
        }
        .accessibilityLabel("Device")
      }
      .padding(.horizontal, 16)
      CardContent {
        VStack(spacing: 20) {
          storageBar(sizes: sizes, total: total)
          ChartContainer(config: chartConfig) {
            Chart {
              ForEach(kinds.indices, id: \.self) { index in
                SectorMark(
                  angle: .value("Size", sizes[index]),
                  innerRadius: .ratio(0.62),
                  outerRadius: .ratio(index == active ? 0.9 : 0.85),
                  angularInset: 1.5
                )
                .cornerRadius(4)
                .foregroundStyle(chartConfig.color(kinds[index]))
              }
            }
            .background {
              VStack(spacing: 0) {
                Text(LocalizedStringKey(active.map { chartConfig.label(kinds[$0]) } ?? "Used"))
                  .textStyle(.sm)
                  .foregroundStyle(EsuissColor.mutedForeground)
                Text(verbatim: gigabytes(value))
                  .textStyle(.xl3, weight: .semibold)
                  .monospacedDigit()
                  .lineLimit(1)
                  .minimumScaleFactor(0.6)
                  .frame(maxWidth: 124)
                  .contentTransition(.numericText(value: value))
                Text(verbatim: "\(Int((value / max(total, 1) * 100).rounded()))%")
                  .textStyle(.sm)
                  .monospacedDigit()
                  .foregroundStyle(EsuissColor.mutedForeground)
              }
              .multilineTextAlignment(.center)
            }
            .chartTooltip(
              angle: sizes,
              labels: kinds.map { chartConfig.label($0) },
              innerRadius: 0.62,
              outerRadius: 0.9,
              selection: activeBinding,
              accessibilityLabel: "\(device.label) storage",
              items: { [ChartTooltipItem(kinds[$0], value: (sizes[$0] * 10).rounded() / 10)] }
            ) { _ in
              EmptyView()
            }
            .padding(5)
          }
          .frame(width: 280, height: 280)
          VStack(spacing: 0) {
            ForEach(kinds.indices, id: \.self) { index in
              if sizes[index] > 0 {
                row(index, value: sizes[index])
                  .transition(.opacity)
              }
            }
          }
        }
      }
    }
  }

  private func storageBar(sizes: [Double], total: Double) -> some View {
    GeometryReader { geometry in
      HStack(spacing: 0) {
        ForEach(kinds.indices.dropLast(), id: \.self) { index in
          let share = max(0, sizes[index]) / max(total, 1)
          Rectangle()
            .fill(chartConfig.color(kinds[index]))
            .opacity(active == nil || active == index ? 1 : 0.35)
            .frame(width: geometry.size.width * share)
            .padding(.trailing, min(2, share * 400))
        }
      }
    }
    .frame(height: 10)
    .background(EsuissColor.secondary)
    .clipShape(Capsule())
    .accessibilityHidden(true)
  }

  private func row(_ index: Int, value: Double) -> some View {
    let kind = kinds[index]
    return Button {
      activeBinding.wrappedValue = active == index ? nil : index
    } label: {
      HStack(spacing: 10) {
        Circle()
          .fill(chartConfig.color(kind))
          .overlay {
            if kind == "free" {
              Circle().strokeBorder(EsuissColor.input, lineWidth: 1)
            }
          }
          .frame(width: 10, height: 10)
        Text(LocalizedStringKey(chartConfig.label(kind)))
          .textStyle(.base)
          .foregroundStyle(EsuissColor.foreground)
          .frame(maxWidth: .infinity, alignment: .leading)
        Text(verbatim: gigabytes(value))
          .textStyle(.base)
          .monospacedDigit()
          .foregroundStyle(EsuissColor.mutedForeground)
      }
      .padding(.horizontal, 8)
      .padding(.vertical, 9)
      .background(active == index ? EsuissColor.secondary : .clear, in: RoundedRectangle(cornerRadius: Radius.lg, style: .continuous))
      .contentShape(Rectangle())
    }
    .buttonStyle(.plain)
    .accessibilityAddTraits(active == index ? .isSelected : [])
  }
}
