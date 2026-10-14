import SwiftUI

private let rings: [(key: String, label: String, value: Double, goal: Double, color: Color)] = [
  ("move", "Move", 720, 600, .red),
  ("exercise", "Exercise", 62, 30, .green),
  ("stand", "Stand", 12, 12, .cyan),
]

private let size: CGFloat = 200
private let bar: CGFloat = 16

public struct RadialChartRings: View {
  public init() {}

  public var body: some View {
    Card(.filled, size: .sm) {
      CardHeader("Activity rings", description: "Move, exercise and stand")
      CardContent {
        ZStack {
          ForEach(rings.indices, id: \.self) { index in
            let ring = rings[index]
            let radius = size / 2 - bar / 2 - CGFloat(index) * (bar + 2)
            Circle()
              .stroke(ring.color.opacity(0.22), lineWidth: bar)
              .frame(width: radius * 2, height: radius * 2)
            Circle()
              .trim(from: 0, to: min(1, ring.value / ring.goal))
              .stroke(ring.color, style: StrokeStyle(lineWidth: bar, lineCap: .round))
              .rotationEffect(.degrees(-90))
              .frame(width: radius * 2, height: radius * 2)
          }
        }
        .frame(width: size, height: size)
        .frame(maxWidth: .infinity)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text(verbatim: rings.map { "\($0.label) \(Int($0.value)) of \(Int($0.goal))" }.joined(separator: ", ")))
      }
    }
  }
}
