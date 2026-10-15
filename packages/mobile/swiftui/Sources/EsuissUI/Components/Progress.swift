import SwiftUI

public struct BarProgressViewStyle: ProgressViewStyle {
  public init() {}

  public func makeBody(configuration: Configuration) -> some View {
    BarProgress(configuration: configuration)
  }
}

private struct BarProgress: View {
  let configuration: ProgressViewStyleConfiguration

  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  var body: some View {
    let fraction = min(max(configuration.fractionCompleted ?? 0, 0), 1)
    VStack(alignment: .leading, spacing: 12) {
      HStack(alignment: .firstTextBaseline, spacing: 12) {
        configuration.label
          .foregroundStyle(EsuissColor.foreground)
        Spacer(minLength: 0)
        configuration.currentValueLabel
          .monospacedDigit()
          .foregroundStyle(EsuissColor.mutedForeground)
      }
      .scaledTextStyle(.sm)
      Capsule()
        .fill(EsuissColor.muted)
        .frame(height: 4)
        .overlay(alignment: .leading) {
          GeometryReader { proxy in
            Rectangle()
              .fill(EsuissColor.primary)
              .frame(width: proxy.size.width * fraction)
              .animation(reduceMotion ? nil : .spring(response: 0.4, dampingFraction: 1), value: fraction)
          }
        }
        .clipShape(Capsule())
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}

extension ProgressViewStyle where Self == BarProgressViewStyle {
  public static var bar: BarProgressViewStyle { BarProgressViewStyle() }
}
