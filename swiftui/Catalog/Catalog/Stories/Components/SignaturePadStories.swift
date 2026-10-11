import EsuissUI
import SwiftUI

enum SignaturePadStories {
  static let group = StoryGroup(.components, "Signature Pad", stories: [
    Story("Default") {
      SignaturePadDemo(initial: [])
    },
    Story("Signed") {
      SignaturePadDemo(initial: signaturePadSample)
    },
    Story("ThickStroke") {
      SignaturePadDemo(initial: signaturePadSample, strokeWidth: 5)
    },
    Story("Disabled") {
      SignaturePadDemo(initial: signaturePadSample)
        .disabled(true)
    },
    Story("Controlled") {
      SignaturePadExportDemo()
    },
  ])
}

private func signaturePadWave(startX: CGFloat, baseY: CGFloat, length: CGFloat, amplitude: CGFloat, turns: CGFloat) -> SignatureStroke {
  SignatureStroke((0..<48).map { index in
    let progress = CGFloat(index) / 47
    return CGPoint(
      x: startX + progress * length,
      y: baseY - sin(progress * .pi * turns) * amplitude * (1 - progress * 0.4)
    )
  })
}

private let signaturePadSample: [SignatureStroke] = [
  signaturePadWave(startX: 40, baseY: 120, length: 70, amplitude: 40, turns: 3),
  signaturePadWave(startX: 110, baseY: 115, length: 110, amplitude: 22, turns: 5),
  SignatureStroke([CGPoint(x: 60, y: 140), CGPoint(x: 140, y: 136), CGPoint(x: 230, y: 134)]),
]

private struct SignaturePadDemo: View {
  var strokeWidth: CGFloat = 2.5

  @State private var strokes: [SignatureStroke]

  init(initial: [SignatureStroke], strokeWidth: CGFloat = 2.5) {
    self.strokeWidth = strokeWidth
    _strokes = State(initialValue: initial)
  }

  var body: some View {
    SignaturePad(value: $strokes, strokeWidth: strokeWidth)
      .frame(height: 192)
      .frame(maxWidth: .infinity)
  }
}

private struct SignaturePadExportDemo: View {
  @State private var strokes = signaturePadSample
  @State private var exported = ""
  @State private var width: CGFloat = 0
  @Environment(\.colorScheme) private var colorScheme

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      SignaturePad(value: $strokes)
        .frame(height: 192)
        .frame(maxWidth: .infinity)
        .onGeometryChange(for: CGFloat.self) { $0.size.width } action: { width = $0 }
        .onChange(of: strokes) { _, _ in exported = "" }
      Button {
        let image = SignaturePad.image(strokes, size: CGSize(width: width, height: 192), colorScheme: colorScheme)
        if let image {
          exported = "Image: \(Int(image.size.width * image.scale))×\(Int(image.size.height * image.scale)) px"
        }
      } label: {
        Text("Export image").frame(maxWidth: .infinity)
      }
      .buttonStyle(.variant(.outline))
      Text(verbatim: exported.isEmpty ? "\(strokes.count) strokes" : "\(strokes.count) strokes · \(exported)")
        .textStyle(.sm)
        .foregroundStyle(Color.labelSecondary)
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}
