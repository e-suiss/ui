import PhosphorSwift
import SwiftUI

public enum QRScannerState: CaseIterable, Sendable {
  case idle, success, error
}

enum QRScannerMath {
  static let radius: CGFloat = 32
  static let arm: CGFloat = 48
  static let lift: CGFloat = 24

  static func side(in size: CGSize, frameSize: CGFloat? = nil) -> CGFloat {
    if let frameSize { return max(0, frameSize) }
    return max(0, min(260, (min(size.width, size.height) * 0.66).rounded()))
  }

  static func frame(in size: CGSize, frameSize: CGFloat? = nil) -> CGRect {
    let side = side(in: size, frameSize: frameSize)
    return CGRect(
      x: (size.width - side) / 2,
      y: max(0, (size.height - side) / 2 - lift),
      width: side,
      height: side
    )
  }

  static func cutout(in size: CGSize, frame: CGRect) -> Path {
    var path = Path(CGRect(origin: .zero, size: size))
    let r = min(radius, frame.width / 2)
    path.addPath(Path(roundedRect: frame, cornerRadius: r, style: .circular))
    return path
  }

  static func brackets(side: CGFloat) -> Path {
    var path = Path()
    let r = min(radius, side / 2)
    let length = max(r, min(arm, side / 2))
    let corners: [(CGPoint, CGFloat, CGFloat)] = [
      (CGPoint(x: 0, y: 0), 1, 1),
      (CGPoint(x: side, y: 0), -1, 1),
      (CGPoint(x: side, y: side), -1, -1),
      (CGPoint(x: 0, y: side), 1, -1),
    ]
    for (corner, dx, dy) in corners {
      path.move(to: CGPoint(x: corner.x, y: corner.y + dy * length))
      path.addLine(to: CGPoint(x: corner.x, y: corner.y + dy * r))
      path.addArc(tangent1End: corner, tangent2End: CGPoint(x: corner.x + dx * r, y: corner.y), radius: r)
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
  let frameSize: CGFloat?
  let preview: Preview

  @State private var shakes = 0
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    state: QRScannerState = .idle,
    title: LocalizedStringKey? = nil,
    hint: LocalizedStringKey? = nil,
    scanLine: Bool = false,
    isTorchOn: Bool = false,
    onTorchToggle: (() -> Void)? = nil,
    frameSize: CGFloat? = nil,
    @ViewBuilder preview: () -> Preview
  ) {
    self.state = state
    self.title = title.map { Text($0) }
    self.hint = hint.map { Text($0) }
    self.scanLine = scanLine
    self.isTorchOn = isTorchOn
    self.onTorchToggle = onTorchToggle
    self.frameSize = frameSize
    self.preview = preview()
  }

  public var body: some View {
    ZStack {
      preview
      GeometryReader { proxy in
        let size = proxy.size
        let frame = QRScannerMath.frame(in: size, frameSize: frameSize)
        ZStack(alignment: .topLeading) {
          QRScannerMath.cutout(in: size, frame: frame)
            .fill(Color.scrim, style: FillStyle(eoFill: true))
          ZStack {
            QRScannerMath.brackets(side: frame.width)
              .stroke(color, style: StrokeStyle(lineWidth: 6, lineCap: .round, lineJoin: .round))
              .animation(.easeOut(duration: 0.2), value: state)
            if scanLine && state == .idle && frame.width > 48 {
              QRScannerLine(side: frame.width)
            }
          }
          .frame(width: frame.width, height: frame.height)
          .scaleEffect(state == .success && !reduceMotion ? 0.94 : 1)
          .animation(.spring(duration: 0.35, bounce: 0.3), value: state)
          .shake(trigger: shakes)
          .offset(x: frame.minX, y: frame.minY)
          if let title {
            title
              .scaledTextStyle(.lg, weight: .semibold)
              .foregroundStyle(Color.onMedia)
              .multilineTextAlignment(.center)
              .frame(width: max(size.width - 48, 0))
              .frame(height: max(frame.minY - 32, 0), alignment: .bottom)
              .offset(x: 24)
          }
          if let hint {
            hint
              .scaledTextStyle(.sm)
              .foregroundStyle(Color.onMedia)
              .multilineTextAlignment(.center)
              .fixedSize(horizontal: false, vertical: true)
              .frame(maxWidth: min(280, size.width))
              .frame(width: size.width)
              .offset(y: frame.maxY + 20)
          }
          if let onTorchToggle {
            Button(action: onTorchToggle) {
              (isTorchOn ? Ph.flashlight.fill : Ph.flashlight.regular)
                .frame(width: 24, height: 24)
                .foregroundStyle(isTorchOn ? Color.media : Color.onMedia)
                .frame(width: 56, height: 56)
                .background(isTorchOn ? Color.onMedia : Color.scrim, in: Circle())
                .contentShape(Circle())
            }
            .buttonStyle(QRScannerTorchStyle())
            .accessibilityLabel(Text(isTorchOn ? "Turn off flashlight" : "Turn on flashlight"))
            .accessibilityAddTraits(isTorchOn ? .isSelected : [])
            .frame(width: size.width)
            .offset(y: max(size.height - 48 - 56, 0))
          }
        }
      }
    }
    .clipped()
    .onChange(of: state) { _, value in
      if value == .error { shakes += 1 }
    }
    .hapticFeedback(.success, trigger: state) { _, new in new == .success }
    .hapticFeedback(.error, trigger: state) { _, new in new == .error }
    .accessibilityElement(children: .contain)
  }

  private var color: Color {
    switch state {
    case .idle: .onMedia
    case .success: .success
    case .error: .danger
    }
  }
}

extension QRScanner where Preview == Color {
  public init(
    state: QRScannerState = .idle,
    title: LocalizedStringKey? = nil,
    hint: LocalizedStringKey? = nil,
    scanLine: Bool = false,
    isTorchOn: Bool = false,
    onTorchToggle: (() -> Void)? = nil,
    frameSize: CGFloat? = nil
  ) {
    self.init(
      state: state,
      title: title,
      hint: hint,
      scanLine: scanLine,
      isTorchOn: isTorchOn,
      onTorchToggle: onTorchToggle,
      frameSize: frameSize
    ) {
      Color.clear
    }
  }
}

private struct QRScannerLine: View {
  let side: CGFloat

  @State private var down = false
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  var body: some View {
    let travel = side / 2 - 24
    Capsule()
      .fill(Color.accent)
      .frame(height: 2)
      .padding(.horizontal, 24)
      .offset(y: reduceMotion ? 0 : (down ? travel : -travel))
      .onAppear {
        guard !reduceMotion else { return }
        withAnimation(.easeInOut(duration: 1.8).repeatForever(autoreverses: true)) { down = true }
      }
      .accessibilityHidden(true)
  }
}

private struct QRScannerTorchStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .opacity(configuration.isPressed ? 0.7 : 1)
      .animation(.easeOut(duration: 0.15), value: configuration.isPressed)
  }
}
