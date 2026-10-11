import EsuissUI
import SwiftUI

enum QRScannerStories {
  static let group = StoryGroup(.components, "QR Scanner", stories: [
    Story("Default") {
      QRScannerDemo(hint: "Point your camera at a code to pay or connect.")
    },
    Story("Success") {
      QRScannerDemo(state: .success, hint: "Code recognised")
    },
    Story("ErrorState", name: "Error") {
      QRScannerDemo(state: .error, hint: "This code is not supported.")
    },
    Story("WithoutScanLine") {
      QRScannerDemo(hint: "Hold steady over the code.", scanLine: false)
    },
    Story("WithoutTorch") {
      QRScanner(title: "Scan to sign in", hint: "Open Settings on your other device.") {
        QRScannerCameraPlaceholder()
      }
      .frame(height: 560)
      .frame(maxWidth: .infinity)
      .clipShape(RoundedRectangle(cornerRadius: Radius.xl3, style: .continuous))
    },
  ])
}

private struct QRScannerDemo: View {
  var state: QRScannerState = .idle
  let hint: LocalizedStringKey
  var scanLine = true

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
    .frame(height: 560)
    .frame(maxWidth: .infinity)
    .clipShape(RoundedRectangle(cornerRadius: Radius.xl3, style: .continuous))
  }
}

private struct QRScannerCameraPlaceholder: View {
  var body: some View {
    ZStack {
      Color.surfaceTertiary
      Circle()
        .fill(Color.labelQuaternary)
        .frame(width: 96, height: 96)
        .padding(.top, 40)
        .padding(.leading, 32)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
      RoundedRectangle(cornerRadius: Radius.xl3, style: .continuous)
        .fill(Color.labelTertiary)
        .frame(width: 160, height: 128)
        .padding(.trailing, 24)
        .padding(.bottom, 64)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomTrailing)
      FlowRow(spacing: 6) {
        ForEach(0..<16, id: \.self) { cell in
          RoundedRectangle(cornerRadius: Radius.xs, style: .continuous)
            .fill(cell % 3 == 0 ? Color.label : Color.surface)
            .frame(width: 24, height: 24)
        }
      }
      .frame(width: 120, height: 120, alignment: .topLeading)
      .padding(12)
      .background(Color.surface, in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
      .rotationEffect(.degrees(6))
    }
    .accessibilityHidden(true)
  }
}
