import PhosphorSwift
import SwiftUI
import XCTest

@testable import EsuissUI

private struct Caption: View {
  let text: String

  var body: some View {
    Text(verbatim: text)
      .font(TextStyle.xs.font(weight: .semibold))
      .foregroundStyle(Color.labelSecondary)
      .frame(maxWidth: .infinity, alignment: .leading)
  }
}

private struct GallerySection<Content: View>: View {
  let title: String
  let content: Content

  init(_ title: String, @ViewBuilder content: () -> Content) {
    self.title = title
    self.content = content()
  }

  var body: some View {
    VStack(spacing: 20) {
      Caption(text: title)
      content
    }
  }
}

private struct PinPadGallery: View {
  var body: some View {
    VStack(spacing: 32) {
      GallerySection("Default") {
        PinPad(value: .constant(""))
      }
      GallerySection("Filled · biometric key") {
        PinPad(value: .constant("123"), onBiometric: {})
      }
    }
  }
}

private struct PinPadStatesGallery: View {
  var body: some View {
    VStack(spacing: 32) {
      GallerySection("Error") {
        PinPad(value: .constant("123456"), error: true)
      }
      GallerySection("Disabled") {
        PinPad(value: .constant("12"), onBiometric: {})
          .disabled(true)
      }
      GallerySection("Length 4 · face key") {
        PinPad(value: .constant("1"), length: 4, biometricIcon: Ph.scanSmiley.regular, onBiometric: {})
      }
    }
  }
}

private struct KeypadGallery: View {
  var body: some View {
    GallerySection("Keypad · decimal accessory · delete disabled") {
      Keypad(accessory: .decimal(","), deleteDisabled: true) { _ in }
    }
  }
}

private struct AmountGallery: View {
  var body: some View {
    GallerySection("USD · en_US") {
      AmountInput(value: .constant("1234.5"), currency: "USD")
    }
  }
}

private struct AmountRow: View {
  let title: String
  let value: String
  let currency: String?
  let locale: String

  var body: some View {
    VStack(spacing: 4) {
      Caption(text: title)
      AmountDisplay(
        value: value,
        format: AmountFormat(locale: Locale(identifier: locale), currency: currency),
        placeholder: "0",
        label: "Amount"
      )
    }
  }
}

private struct AmountCurrenciesGallery: View {
  var body: some View {
    VStack(spacing: 20) {
      AmountRow(title: "Placeholder · USD", value: "", currency: "USD", locale: "en_US")
      AmountRow(title: "USD · en_US", value: "1234.5", currency: "USD", locale: "en_US")
      AmountRow(title: "EUR · de_DE", value: "1234.56", currency: "EUR", locale: "de_DE")
      AmountRow(title: "TRY · tr_TR", value: "2500", currency: "TRY", locale: "tr_TR")
      AmountRow(title: "JPY · ja_JP (no decimals)", value: "150000", currency: "JPY", locale: "ja_JP")
      AmountRow(title: "Trailing separator · EUR · de_DE", value: "12.", currency: "EUR", locale: "de_DE")
      AmountRow(title: "No currency", value: "98.6", currency: nil, locale: "en_US")
      AmountRow(title: "Long amount · USD", value: "123456789012.34", currency: "USD", locale: "en_US")
      AmountRow(title: "Long amount · TRY · tr_TR", value: "987654321098765", currency: "TRY", locale: "tr_TR")
    }
  }
}

private struct AmountStatesGallery: View {
  var body: some View {
    VStack(spacing: 32) {
      GallerySection("JPY · ja_JP (no decimal key)") {
        AmountInput(value: .constant("3000"), currency: "JPY")
          .environment(\.locale, Locale(identifier: "ja_JP"))
      }
      GallerySection("Disabled · EUR · de_DE") {
        AmountInput(value: .constant("42.5"), currency: "EUR")
          .environment(\.locale, Locale(identifier: "de_DE"))
          .disabled(true)
      }
    }
  }
}

private struct OtpStatus: View {
  let state: OtpAutofillState

  var body: some View {
    Text(verbatim: text)
      .font(TextStyle.sm.font())
      .foregroundStyle(color)
      .frame(minHeight: 20)
  }

  private var text: String {
    switch state {
    case .verifying: "Verifying…"
    case .verified: "Verified"
    case .invalid: "That code didn't work. Try again."
    case .idle, .filling: ""
    }
  }

  private var color: Color {
    switch state {
    case .verified: .success
    case .invalid: .danger
    default: .labelSecondary
    }
  }
}

@MainActor
private func otpModel(_ value: String, _ state: OtpAutofillState, focused: Bool = false) -> OtpAutofillModel {
  let model = OtpAutofillModel(length: 6) { _ in true }
  model.value = value
  model.state = state
  model.focused = focused
  return model
}

private struct OtpExample: View {
  let title: String
  let model: OtpAutofillModel
  var suggestion: String?

  var body: some View {
    VStack(spacing: 12) {
      Caption(text: title)
      OtpAutofill(model: model) { state in
        OtpAutofillInput {
          InputOTPGroup {
            InputOTPSlot(index: 0)
            InputOTPSlot(index: 1)
            InputOTPSlot(index: 2)
          }
          InputOTPSeparator()
          InputOTPGroup {
            InputOTPSlot(index: 3)
            InputOTPSlot(index: 4)
            InputOTPSlot(index: 5)
          }
        }
        OtpStatus(state: state)
        if suggestion != nil {
          OtpAutofillSuggestion(code: suggestion)
        }
      }
    }
  }
}

private struct OtpGallery: View {
  let models: [OtpAutofillModel]

  var body: some View {
    VStack(spacing: 24) {
      VStack(spacing: 4) {
        Text(verbatim: "Enter the code")
          .font(TextStyle.xl2.font(weight: .bold))
          .foregroundStyle(Color.label)
        Text(verbatim: "We sent a 6-digit code to +1 555 0100.")
          .font(TextStyle.sm.font())
          .foregroundStyle(Color.labelSecondary)
      }
      OtpExample(title: "Focused · suggestion above the keyboard", model: models[0], suggestion: "482913")
      OtpExample(title: "Verifying", model: models[1])
      OtpExample(title: "Verified", model: models[2])
      OtpExample(title: "Invalid", model: models[3])
      OtpExample(title: "Disabled", model: models[4])
        .disabled(true)
    }
  }
}

@MainActor
private final class CodeLog {
  var codes: [String] = []
}

@MainActor
final class InputGalleryTests: XCTestCase {
  private func render<V: View>(_ view: V, name: String, padding: CGFloat = 16) throws {
    let output = ProcessInfo.processInfo.environment["GALLERY_OUTPUT"] ?? NSTemporaryDirectory()
    for scheme in [ColorScheme.light, .dark] {
      let renderer = ImageRenderer(content: view
        .padding(padding)
        .frame(width: 402, alignment: .leading)
        .background(Color.surface)
        .environment(\.colorScheme, scheme)
        .environment(\.locale, Locale(identifier: "en_US")))
      renderer.scale = 3
      let data = try XCTUnwrap(renderer.uiImage?.pngData())
      let file = "\(name)-\(scheme == .dark ? "dark" : "light").png"
      try data.write(to: URL(fileURLWithPath: output).appendingPathComponent(file))
    }
  }

  private func snapshot<V: View>(_ view: V, name: String, padding: CGFloat = 16) throws {
    let output = ProcessInfo.processInfo.environment["GALLERY_OUTPUT"] ?? NSTemporaryDirectory()
    for scheme in [ColorScheme.light, .dark] {
      let host = UIHostingController(rootView: view
        .padding(padding)
        .frame(width: 402, alignment: .leading)
        .background(Color.surface)
        .environment(\.locale, Locale(identifier: "en_US")))
      host.safeAreaRegions = []
      let initial = host.sizeThatFits(in: CGSize(width: 402, height: CGFloat.greatestFiniteMagnitude))
      let scene = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }.first
      let window = scene.map { UIWindow(windowScene: $0) } ?? UIWindow()
      window.frame = CGRect(origin: .zero, size: initial)
      window.overrideUserInterfaceStyle = scheme == .dark ? .dark : .light
      window.rootViewController = host
      window.makeKeyAndVisible()
      host.view.frame = window.bounds
      host.view.layoutIfNeeded()
      RunLoop.main.run(until: Date().addingTimeInterval(0.8))
      let size = host.sizeThatFits(in: CGSize(width: 402, height: CGFloat.greatestFiniteMagnitude))
      window.frame = CGRect(origin: .zero, size: size)
      host.view.frame = window.bounds
      host.view.layoutIfNeeded()
      RunLoop.main.run(until: Date().addingTimeInterval(0.3))
      let format = UIGraphicsImageRendererFormat()
      format.scale = 3
      let image = UIGraphicsImageRenderer(size: size, format: format).image {
        host.view.layer.render(in: $0.cgContext)
      }
      window.isHidden = true
      let data = try XCTUnwrap(image.pngData())
      let file = "\(name)-\(scheme == .dark ? "dark" : "light").png"
      try data.write(to: URL(fileURLWithPath: output).appendingPathComponent(file))
    }
  }

  func testRendersPinPadGallery() throws {
    try render(PinPadGallery(), name: "input-pin-pad")
  }

  func testRendersPinPadStatesGallery() throws {
    try render(PinPadStatesGallery(), name: "input-pin-pad-states")
  }

  func testRendersKeypadGallery() throws {
    try render(KeypadGallery(), name: "input-keypad")
  }

  func testAmountRejectionsGiveFeedbackOnlyForRealLimits() {
    XCTAssertNil(AmountMath.press(.digit(5), value: "1.23", fractionDigits: 2, max: nil))
    XCTAssertTrue(AmountMath.rejects(.digit(5), value: "1.23"))
    XCTAssertNil(AmountMath.press(.decimal, value: "1.2", fractionDigits: 2, max: nil))
    XCTAssertTrue(AmountMath.rejects(.decimal, value: "1.2"))
    XCTAssertNil(AmountMath.press(.digit(1), value: "100", fractionDigits: 2, max: 100))
    XCTAssertTrue(AmountMath.rejects(.digit(1), value: "100"))
    let capped = String(repeating: "9", count: AmountMath.maxIntegerDigits)
    XCTAssertNil(AmountMath.press(.digit(9), value: capped, fractionDigits: 2, max: nil))
    XCTAssertTrue(AmountMath.rejects(.digit(9), value: capped))
    XCTAssertNil(AmountMath.press(.digit(0), value: "0", fractionDigits: 2, max: nil))
    XCTAssertFalse(AmountMath.rejects(.digit(0), value: "0"))
    XCTAssertFalse(AmountMath.rejects(.delete, value: ""))
  }

  func testRendersAmountInputGallery() throws {
    try render(AmountGallery(), name: "input-amount-input")
  }

  func testRendersAmountCurrenciesGallery() throws {
    try render(AmountCurrenciesGallery(), name: "input-amount-currencies")
  }

  func testRendersAmountStatesGallery() throws {
    try render(AmountStatesGallery(), name: "input-amount-states")
  }

  func testRendersOtpAutofillGallery() throws {
    let models = [
      otpModel("", .idle, focused: true),
      otpModel("482913", .verifying),
      otpModel("482913", .verified),
      otpModel("113355", .invalid),
      otpModel("48", .idle),
    ]
    try snapshot(OtpGallery(models: models), name: "input-otp-autofill")
  }

  func testPinPadAcceptsDigitsUpToLengthAndDeletes() {
    var value = ""
    for digit in [1, 2, 3, 4, 5, 6] {
      value = PinPadMath.press(.digit(digit), value: value, length: 6) ?? value
    }
    XCTAssertEqual(value, "123456")
    XCTAssertNil(PinPadMath.press(.digit(7), value: value, length: 6))
    XCTAssertEqual(PinPadMath.press(.delete, value: value, length: 6), "12345")
    XCTAssertNil(PinPadMath.press(.delete, value: "", length: 6))
    XCTAssertNil(PinPadMath.press(.decimal, value: "12", length: 6))
    XCTAssertNil(PinPadMath.press(.biometric, value: "12", length: 6))
    XCTAssertEqual(PinPadMath.clamp(2), 4)
    XCTAssertEqual(PinPadMath.clamp(6), 6)
    XCTAssertEqual(PinPadMath.clamp(12), 8)
  }

  func testAmountKeypadHandlesZerosAndDecimal() {
    func type(_ keys: [KeypadKey], digits: Int = 2, max: Double? = nil) -> String {
      keys.reduce("") { AmountMath.press($1, value: $0, fractionDigits: digits, max: max) ?? $0 }
    }
    XCTAssertEqual(type([.digit(0), .digit(0), .digit(5)]), "5")
    XCTAssertEqual(type([.decimal, .digit(5)]), "0.5")
    XCTAssertEqual(type([.digit(1), .decimal, .decimal, .digit(2)]), "1.2")
    XCTAssertEqual(type([.digit(1), .decimal, .digit(2), .digit(3), .digit(4)]), "1.23")
    XCTAssertEqual(type([.digit(1), .decimal, .digit(2), .delete, .delete]), "1")
    XCTAssertEqual(type([.digit(7), .decimal, .digit(5)], digits: 0), "75")
    XCTAssertEqual(type([.digit(9), .digit(9), .digit(9)], max: 100), "99")
    XCTAssertEqual(type([.digit(1), .digit(0), .digit(0), .decimal, .digit(1)], max: 100), "100.")
    XCTAssertEqual(type(Array(repeating: .digit(9), count: 20)).count, AmountMath.maxIntegerDigits)
    XCTAssertEqual(AmountMath.amount("12.5"), 12.5)
    XCTAssertEqual(AmountMath.amount("12."), 12)
    XCTAssertEqual(AmountMath.amount(""), 0)
  }

  func testAmountFormatsCurrenciesPerLocale() {
    let usd = AmountFormat(locale: Locale(identifier: "en_US"), currency: "USD")
    XCTAssertEqual(usd.fractionDigits, 2)
    XCTAssertEqual(usd.prefix, "$")
    XCTAssertEqual(usd.number("1234.5"), "1,234.5")
    XCTAssertEqual(usd.number("12."), "12.")
    XCTAssertEqual(usd.decimalSeparator, ".")

    let eur = AmountFormat(locale: Locale(identifier: "de_DE"), currency: "EUR")
    XCTAssertEqual(eur.fractionDigits, 2)
    XCTAssertEqual(eur.number("1234.56"), "1.234,56")
    XCTAssertEqual(eur.number("12."), "12,")
    XCTAssertEqual(eur.decimalSeparator, ",")
    XCTAssertTrue(eur.suffix.contains("€"))
    XCTAssertEqual(eur.prefix, "")

    let lira = AmountFormat(locale: Locale(identifier: "tr_TR"), currency: "TRY")
    XCTAssertEqual(lira.fractionDigits, 2)
    XCTAssertTrue(lira.prefix.contains("₺"))
    XCTAssertEqual(lira.number("2500"), "2.500")
    XCTAssertEqual(lira.number("2500.75"), "2.500,75")

    let yen = AmountFormat(locale: Locale(identifier: "ja_JP"), currency: "JPY")
    XCTAssertEqual(yen.fractionDigits, 0)
    XCTAssertEqual(yen.number("150000"), "150,000")
    XCTAssertNil(AmountMath.press(.decimal, value: "150", fractionDigits: yen.fractionDigits, max: nil))

    let override = AmountFormat(locale: Locale(identifier: "en_US"), currency: "USD", maxFractionDigits: 4)
    XCTAssertEqual(override.fractionDigits, 4)
    XCTAssertEqual(AmountFormat(locale: Locale(identifier: "en_US"), currency: nil).fractionDigits, 2)
    XCTAssertEqual(usd.spoken(""), "$0")
  }

  func testOtpAutofillFillsAndVerifies() async throws {
    let checked = CodeLog()
    let model = OtpAutofillModel(length: 6, interval: .milliseconds(5), hold: .milliseconds(20)) { code in
      checked.codes.append(code)
      return code == "482913"
    }
    model.fill("482 913")
    XCTAssertEqual(model.state, .filling)
    XCTAssertTrue(model.locked)
    try await Task.sleep(for: .milliseconds(300))
    XCTAssertEqual(model.value, "482913")
    XCTAssertEqual(model.state, .verified)
    XCTAssertEqual(checked.codes, ["482913"])
    XCTAssertEqual(model.pops, [1, 1, 1, 1, 1, 1])
    model.type("1")
    XCTAssertEqual(model.value, "482913")
  }

  func testOtpAutofillRejectsClearsAndRefocuses() async throws {
    let model = OtpAutofillModel(length: 6, interval: .milliseconds(5), hold: .milliseconds(50)) { _ in false }
    model.fill("113355")
    try await Task.sleep(for: .milliseconds(80))
    XCTAssertEqual(model.state, .invalid)
    XCTAssertEqual(model.shakes, 1)
    XCTAssertEqual(model.value, "113355")
    try await Task.sleep(for: .milliseconds(200))
    XCTAssertEqual(model.state, .idle)
    XCTAssertEqual(model.value, "")
    XCTAssertTrue(model.focused)
  }

  func testOtpAutofillTypingAndPartialFill() async throws {
    let model = OtpAutofillModel(length: 6, interval: .milliseconds(5), hold: .milliseconds(20)) { $0 == "123456" }
    for next in ["1", "12", "123", "1234", "12345"] {
      model.type(next)
      XCTAssertEqual(model.state, .idle)
    }
    model.type("123456")
    try await Task.sleep(for: .milliseconds(50))
    XCTAssertEqual(model.state, .verified)

    let partial = OtpAutofillModel(length: 6, interval: .milliseconds(5)) { _ in true }
    partial.fill("98 7")
    try await Task.sleep(for: .milliseconds(100))
    XCTAssertEqual(partial.value, "987")
    XCTAssertEqual(partial.state, .idle)

    let pasted = OtpAutofillModel(length: 4, interval: .milliseconds(5)) { _ in true }
    pasted.type("12345678")
    try await Task.sleep(for: .milliseconds(100))
    XCTAssertEqual(pasted.value, "1234")
    XCTAssertEqual(pasted.state, .verified)

    let empty = OtpAutofillModel(length: 6) { _ in true }
    empty.fill("   ")
    XCTAssertEqual(empty.state, .idle)
  }
}
