import PhosphorSwift
import SwiftUI
import UIKit

public struct SignatureStroke: Hashable, Sendable {
  public var points: [CGPoint]

  public init(_ points: [CGPoint]) {
    self.points = points
  }
}

enum SignatureMath {
  static func path(for stroke: [CGPoint], strokeWidth: CGFloat) -> Path {
    var path = Path()
    guard let first = stroke.first else { return path }
    if stroke.count == 1 {
      let radius = strokeWidth / 2
      path.addEllipse(in: CGRect(x: first.x - radius, y: first.y - radius, width: radius * 2, height: radius * 2))
      return path
    }
    path.move(to: first)
    if stroke.count == 2 {
      path.addLine(to: stroke[1])
      return path
    }
    for index in 1..<(stroke.count - 1) {
      let point = stroke[index]
      let next = stroke[index + 1]
      let middle = CGPoint(x: (point.x + next.x) / 2, y: (point.y + next.y) / 2)
      path.addQuadCurve(to: middle, control: point)
    }
    if let last = stroke.last {
      path.addLine(to: last)
    }
    return path
  }

  static func path(for strokes: [SignatureStroke], strokeWidth: CGFloat) -> Path {
    var path = Path()
    for stroke in strokes {
      path.addPath(self.path(for: stroke.points, strokeWidth: strokeWidth))
    }
    return path
  }

  static func appending(_ point: CGPoint, to stroke: [CGPoint], minDistance: CGFloat = 1.5) -> [CGPoint] {
    guard let last = stroke.last else { return [point] }
    let distance = hypot(point.x - last.x, point.y - last.y)
    return distance < minDistance ? stroke : stroke + [point]
  }

  static func clamp(_ point: CGPoint, to size: CGSize) -> CGPoint {
    CGPoint(x: min(max(point.x, 0), size.width), y: min(max(point.y, 0), size.height))
  }
}

public struct SignaturePad: View {
  @Binding var value: [SignatureStroke]
  let strokeWidth: CGFloat
  let placeholder: Text
  let clearable: Bool

  @State private var current: [CGPoint] = []
  @Environment(\.isEnabled) private var isEnabled
  @Environment(\.isInvalid) private var invalid

  public init(
    value: Binding<[SignatureStroke]>,
    strokeWidth: CGFloat = 2.5,
    placeholder: LocalizedStringKey = "Sign here",
    clearable: Bool = true
  ) {
    _value = value
    self.strokeWidth = strokeWidth
    self.placeholder = Text(placeholder)
    self.clearable = clearable
  }

  public static func path(_ strokes: [SignatureStroke], strokeWidth: CGFloat = 2.5) -> Path {
    SignatureMath.path(for: strokes, strokeWidth: strokeWidth)
  }

  @MainActor
  public static func image(
    _ strokes: [SignatureStroke],
    size: CGSize,
    strokeWidth: CGFloat = 2.5,
    color: Color = EsuissColor.foreground,
    colorScheme: ColorScheme = .light,
    scale: CGFloat = 3
  ) -> UIImage? {
    let shape = path(strokes, strokeWidth: strokeWidth)
    let dots = strokes.filter { $0.points.count == 1 }
    let renderer = ImageRenderer(
      content: ZStack {
        shape.stroke(color, style: StrokeStyle(lineWidth: strokeWidth, lineCap: .round, lineJoin: .round))
        SignatureMath.path(for: dots, strokeWidth: strokeWidth).fill(color)
      }
      .frame(width: size.width, height: size.height)
      .environment(\.colorScheme, colorScheme)
    )
    renderer.scale = scale
    renderer.isOpaque = false
    return renderer.uiImage
  }

  public var body: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl, style: .continuous)
    let empty = value.isEmpty && current.isEmpty
    GeometryReader { proxy in
      let size = proxy.size
      ZStack(alignment: .bottomLeading) {
        VStack(alignment: .leading, spacing: 6) {
          HStack(alignment: .lastTextBaseline, spacing: 8) {
            Ph.x.bold
              .frame(width: 14, height: 14)
              .foregroundStyle(EsuissColor.mutedForeground)
            if empty {
              placeholder
                .scaledFont(.sm)
                .foregroundStyle(EsuissColor.mutedForeground)
                .transition(.opacity)
            }
          }
          Rectangle()
            .fill(EsuissColor.input)
            .frame(height: 1)
        }
        .padding(.horizontal, 20)
        .padding(.bottom, 28)
        .accessibilityHidden(true)
        strokes
          .frame(width: size.width, height: size.height)
          .allowsHitTesting(false)
      }
      .frame(width: size.width, height: size.height)
      .contentShape(shape)
      .gesture(drawGesture(size: size), including: isEnabled ? .all : .subviews)
    }
    .frame(minHeight: 160)
    .background(EsuissColor.muted, in: shape)
    .overlay {
      shape.strokeBorder(invalid ? EsuissColor.destructive : EsuissColor.border, lineWidth: 1)
    }
    .overlay(alignment: .topTrailing) {
      if clearable && !value.isEmpty && isEnabled {
        Button {
          withAnimation(.easeOut(duration: 0.2)) { value = [] }
        } label: {
          Text("Clear")
        }
        .buttonStyle(.variant(.ghost, size: .sm))
        .padding(8)
        .transition(.opacity)
      }
    }
    .opacity(isEnabled ? 1 : 0.5)
    .animation(.easeOut(duration: 0.15), value: empty)
    .accessibilityElement(children: .contain)
    .accessibilityLabel(Text("Signature"))
    .accessibilityValue(Text(value.isEmpty ? "Empty" : "Signed"))
  }

  private var strokes: some View {
    let width = strokeWidth
    let committed = value
    let active = current
    return Canvas { context, _ in
      let style = StrokeStyle(lineWidth: width, lineCap: .round, lineJoin: .round)
      for stroke in committed + [SignatureStroke(active)] where !stroke.points.isEmpty {
        let path = SignatureMath.path(for: stroke.points, strokeWidth: width)
        if stroke.points.count == 1 {
          context.fill(path, with: .color(EsuissColor.foreground))
        } else {
          context.stroke(path, with: .color(EsuissColor.foreground), style: style)
        }
      }
    }
  }

  private func drawGesture(size: CGSize) -> some Gesture {
    DragGesture(minimumDistance: 0, coordinateSpace: .local)
      .onChanged { gesture in
        current = SignatureMath.appending(SignatureMath.clamp(gesture.location, to: size), to: current)
      }
      .onEnded { _ in
        guard !current.isEmpty else { return }
        value.append(SignatureStroke(current))
        current = []
      }
  }
}
