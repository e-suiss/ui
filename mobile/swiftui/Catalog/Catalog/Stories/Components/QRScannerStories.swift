import EsuissUI
import SwiftUI

enum QRScannerStories {
  static let group = StoryGroup(.components, "QR Scanner", stories: [
    Story("Default", fullScreen: true) {
      QRScannerDemo(hint: "Point your camera at a code to pay or connect.")
    },
    Story("Success", fullScreen: true) {
      QRScannerDemo(state: .success, hint: "Code recognised")
    },
    Story("ErrorState", name: "Error", fullScreen: true) {
      QRScannerDemo(state: .error, hint: "This code is not supported.")
    },
    Story("WithScanLine", fullScreen: true) {
      QRScannerDemo(hint: "Hold steady over the code.", scanLine: true)
    },
    Story("WithoutTorch", fullScreen: true) {
      QRScanner(title: "Scan to sign in", hint: "Open Settings on your other device.") {
        QRScannerCameraPlaceholder()
      }
      .ignoresSafeArea()
    },
  ])
}

private struct QRScannerDemo: View {
  var state: QRScannerState = .idle
  let hint: LocalizedStringKey
  var scanLine = false

  @State private var torch = false

  var body: some View {
    QRScanner(
      state: state,
      title: "Scan QR code",
      hint: hint,
      scanLine: scanLine,
      isTorchOn: torch,
      onTorchToggle: { torch.toggle() }
    ) {
      QRScannerCameraPlaceholder()
    }
    .ignoresSafeArea()
  }
}

private enum QRCodeSample {
  static let count = 21
  static let module: CGFloat = 6
  static let padding: CGFloat = 10
  static let side = CGFloat(count) * module + padding * 2

  static func isDark(_ r: Int, _ c: Int) -> Bool {
    for (fr, fc) in [(0, 0), (0, 14), (14, 0)] {
      let i = r - fr
      let j = c - fc
      if (0...6).contains(i) && (0...6).contains(j) {
        return i == 0 || i == 6 || j == 0 || j == 6 || ((2...4).contains(i) && (2...4).contains(j))
      }
    }
    if r <= 7 && c <= 7 { return false }
    if r <= 7 && c >= 13 { return false }
    if r >= 13 && c <= 7 { return false }
    return (r * 7 + c * 11 + r * c) % 5 < 2
  }

  static let modules: Path = {
    var path = Path()
    for r in 0..<count {
      for c in 0..<count where isDark(r, c) {
        path.addRect(CGRect(x: padding + CGFloat(c) * module, y: padding + CGFloat(r) * module, width: module, height: module))
      }
    }
    return path
  }()
}

private struct QRScannerCameraPlaceholder: View {
  var body: some View {
    GeometryReader { proxy in
      Canvas { context, _ in
        let card = CGRect(origin: .zero, size: CGSize(width: QRCodeSample.side, height: QRCodeSample.side))
        context.fill(Path(roundedRect: card, cornerRadius: Radius.xl, style: .continuous), with: .color(.onMedia))
        context.fill(QRCodeSample.modules, with: .color(.media))
      }
      .frame(width: QRCodeSample.side, height: QRCodeSample.side)
      .rotationEffect(.degrees(-6))
      .position(x: proxy.size.width / 2, y: proxy.size.height / 2 - 24)
    }
    .background(Color.media)
    .accessibilityHidden(true)
  }
}
