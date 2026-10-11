import PhosphorSwift
import SwiftUI

public enum QRScannerState: CaseIterable, Sendable {
  case idle, success, error
}

enum QRScannerMath {
  static func frame(in size: CGSize, maxSide: CGFloat = 280) -> CGRect {
    let side = max(0, min(size.width * 0.72, size.height * 0.6, maxSide))
    return CGRect(x: (size.width - side) / 2, y: (size.height - side) / 2 - size.height * 0.04, width: side, height: side)
  }

  static func cutout(in size: CGSize, frame: CGRect, radius: CGFloat) -> Path {
    var path = Path(CGRect(origin: .zero, size: size))
    path.addPath(Path(roundedRect: frame, cornerRadius: radius, style: .continuous))
    return path
  }

  static func brackets(frame: CGRect, radius: CGFloat, length: CGFloat) -> Path {
    var path = Path()
    let inset: CGFloat = 0
    let rect = frame.insetBy(dx: inset, dy: inset)
    let corners: [(CGPoint, CGFloat, CGFloat)] = [
      (CGPoint(x: rect.minX, y: rect.minY), 1, 1),
      (CGPoint(x: rect.maxX, y: rect.minY), -1, 1),
      (CGPoint(x: rect.maxX, y: rect.maxY), -1, -1),
      (CGPoint(x: rect.minX, y: rect.maxY), 1, -1),
    ]
    for (corner, dx, dy) in corners {
      path.move(to: CGPoint(x: corner.x, y: corner.y + dy * length))
      path.addLine(to: CGPoint(x: corner.x, y: corner.y + dy * radius))
      path.addQuadCurve(
        to: CGPoint(x: corner.x + dx * radius, y: corner.y),
        control: corner
      )
      path.addLine(to: CGPoint(x: corner.x + dx * length, y: corner.y))
    }
    return path
  }
}

public struct QRScanner<Preview: View>: View {
  let state: QRScannerState
  let title: Text?
  let hint: Text?
  let scanLine: Bool
  let isTorchOn: Bool
  let onTorchToggle: (() -> Void)?
  let preview: Preview

  @State private var shakes = 0
  @State private var sweep = false
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    state: QRScannerState = .idle,
    title: LocalizedStringKey? = nil,
    hint: LocalizedStringKey? = nil,
    scanLine: Bool = true,
    isTorchOn: Bool = false,
    onTorchToggle: (() -> Void)? = nil,
    @ViewBuilder preview: () -> Preview
  ) {
    self.state = state
    self.title = title.map { Text($0) }
    self.hint = hint.map { Text($0) }
    self.scanLine = scanLine
    self.isTorchOn = isTorchOn
    self.onTorchToggle = onTorchToggle
    self.preview = preview()
  }

  public var body: some View {
    ZStack {
      preview
      GeometryReader { proxy in
        let size = proxy.size
        let frame = QRScannerMath.frame(in: size)
        let radius = Radius.xl3
        let color = accent
        ZStack(alignment: .topLeading) {
          QRScannerMath.cutout(in: size, frame: frame, radius: radius)
            .fill(Color.scrim, style: FillStyle(eoFill: true))
            .overlay {
              QRScannerMath.cutout(in: size, frame: frame, radius: radius)
                .fill(Color.scrim.opacity(0.5), style: FillStyle(eoFill: true))
            }
          ZStack {
            RoundedRectangle(cornerRadius: radius, style: .continuous)
              .fill(state == .idle ? Color.clear : color.opacity(0.12))
            QRScannerMath.brackets(frame: CGRect(origin: .zero, size: frame.size), radius: radius, length: 44)
              .stroke(color, style: StrokeStyle(lineWidth: 5, lineCap: .round, lineJoin: .round))
            if scanLine && state == .idle {
              scanLineView(height: frame.height)
            }
            if state != .idle {
              (state == .success ? Ph.checkCircle.fill : Ph.xCircle.fill)
                .frame(width: 56, height: 56)
                .foregroundStyle(color)
                .transition(.scale(scale: 0.6).combined(with: .opacity))
            }
          }
          .frame(width: frame.width, height: frame.height)
          .shake(trigger: shakes)
          .offset(x: frame.minX, y: frame.minY)
          VStack(spacing: 8) {
            if let title {
              title
                .scaledTextStyle(.lg, weight: .semibold)
                .foregroundStyle(Color.label)
            }
          }
          .multilineTextAlignment(.center)
          .frame(width: size.width - 48)
          .frame(height: max(frame.minY - 24, 0), alignment: .bottom)
          .offset(x: 24)
          VStack(spacing: 24) {
            if let hint {
              hint
                .scaledTextStyle(.sm)
                .foregroundStyle(Color.labelSecondary)
                .multilineTextAlignment(.center)
                .fixedSize(horizontal: false, vertical: true)
            }
            if let onTorchToggle {
              Button(action: onTorchToggle) {
                (isTorchOn ? Ph.flashlight.fill : Ph.flashlight.regular)
                  .frame(width: 24, height: 24)
                  .foregroundStyle(isTorchOn ? Color.surface : .label)
                  .frame(width: 56, height: 56)
                  .background(isTorchOn ? Color.label : Color.label.opacity(0.2), in: Circle())
              }
              .buttonStyle(QRScannerTorchStyle())
              .accessibilityLabel(Text(isTorchOn ? "Turn off flashlight" : "Turn on flashlight"))
              .accessibilityAddTraits(isTorchOn ? .isSelected : [])
            }
          }
          .frame(width: size.width - 48)
          .offset(x: 24, y: frame.maxY + 24)
        }
        .animation(.spring(duration: 0.35, bounce: 0.2), value: state)
      }
      .environment(\.colorScheme, .dark)
    }
    .clipped()
    .onChange(of: state) { _, value in
      if value == .error { shakes += 1 }
    }
    .hapticFeedback(.success, trigger: state) { _, new in new == .success }
    .hapticFeedback(.error, trigger: state) { _, new in new == .error }
    .accessibilityElement(children: .contain)
  }

  private var accent: Color {
    switch state {
    case .idle: .label
    case .success: .success
    case .error: .danger
    }
  }

  private func scanLineView(height: CGFloat) -> some View {
    let animate = !reduceMotion
    return LinearGradient(
      colors: [Color.accent.opacity(0), Color.accent, Color.accent.opacity(0)],
      startPoint: .leading,
      endPoint: .trailing
    )
    .frame(height: 2)
    .shadow(color: Color.accent.opacity(0.8), radius: 6)
    .padding(.horizontal, 20)
    .offset(y: animate ? (sweep ? height / 2 - 24 : -height / 2 + 24) : 0)
    .onAppear {
      guard animate else { return }
      withAnimation(.easeInOut(duration: 1.8).repeatForever(autoreverses: true)) { sweep = true }
    }
    .accessibilityHidden(true)
  }
}

extension QRScanner where Preview == Color {
  public init(
    state: QRScannerState = .idle,
    title: LocalizedStringKey? = nil,
    hint: LocalizedStringKey? = nil,
    scanLine: Bool = true,
    isTorchOn: Bool = false,
    onTorchToggle: (() -> Void)? = nil
  ) {
    self.init(state: state, title: title, hint: hint, scanLine: scanLine, isTorchOn: isTorchOn, onTorchToggle: onTorchToggle) {
      Color.clear
    }
  }
}

private struct QRScannerTorchStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .scaleEffect(configuration.isPressed ? 0.94 : 1)
      .animation(.spring(duration: 0.2), value: configuration.isPressed)
  }
}
