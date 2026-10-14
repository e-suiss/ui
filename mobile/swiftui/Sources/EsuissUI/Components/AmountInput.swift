import SwiftUI

struct AmountFormat {
  let locale: Locale
  let currency: String?
  let fractionDigits: Int
  let decimalSeparator: String
  let prefix: String
  let suffix: String

  init(locale: Locale, currency: String?, maxFractionDigits: Int? = nil) {
    let formatter = NumberFormatter()
    formatter.locale = locale
    formatter.numberStyle = currency == nil ? .decimal : .currency
    if let currency { formatter.currencyCode = currency }
    self.locale = locale
    self.currency = currency
    fractionDigits = max(0, maxFractionDigits ?? (currency == nil ? 2 : formatter.maximumFractionDigits))
    decimalSeparator = formatter.decimalSeparator ?? "."
    prefix = currency == nil ? "" : formatter.positivePrefix ?? ""
    suffix = currency == nil ? "" : formatter.positiveSuffix ?? ""
  }

  func number(_ value: String) -> String {
    let parts = value.split(separator: ".", maxSplits: 1, omittingEmptySubsequences: false)
    let integer = parts.first.map(String.init) ?? ""
    let fraction = parts.count > 1 ? String(parts[1]) : ""
    let formatter = NumberFormatter()
    formatter.locale = locale
    formatter.numberStyle = .decimal
    formatter.usesGroupingSeparator = true
    formatter.minimumFractionDigits = fraction.count
    formatter.maximumFractionDigits = fraction.count
    let source = (integer.isEmpty ? "0" : integer) + (fraction.isEmpty ? "" : "." + fraction)
    let decimal = NSDecimalNumber(string: source, locale: Locale(identifier: "en_US_POSIX"))
    var text = formatter.string(from: decimal == .notANumber ? 0 : decimal) ?? source
    if parts.count > 1 && fraction.isEmpty {
      text += formatter.decimalSeparator ?? "."
    }
    return text
  }

  func spoken(_ value: String) -> String {
    prefix + number(value.isEmpty ? "0" : value) + suffix
  }
}

enum AmountMath {
  static let maxIntegerDigits = 15

  static func amount(_ value: String) -> Double {
    Double(value) ?? 0
  }

  static func rejects(_ key: KeypadKey, value: String) -> Bool {
    switch key {
    case .digit(0): value != "0"
    case .digit, .decimal: true
    case .delete, .biometric: false
    }
  }

  static func press(_ key: KeypadKey, value: String, fractionDigits: Int, max: Double?) -> String? {
    let next: String
    switch key {
    case .digit(let digit):
      if let dot = value.firstIndex(of: ".") {
        guard value[value.index(after: dot)...].count < fractionDigits else { return nil }
        next = value + String(digit)
      } else if value == "0" {
        guard digit != 0 else { return nil }
        next = String(digit)
      } else {
        guard value.count < maxIntegerDigits else { return nil }
        next = value + String(digit)
      }
    case .decimal:
      guard fractionDigits > 0, !value.contains(".") else { return nil }
      next = (value.isEmpty ? "0" : value) + "."
    case .delete:
      guard !value.isEmpty else { return nil }
      next = String(value.dropLast())
    case .biometric:
      return nil
    }
    if let max, amount(next) > max { return nil }
    return next
  }
}

struct AmountDisplay: View {
  let value: String
  let format: AmountFormat
  let placeholder: String
  let label: LocalizedStringKey

  @Environment(\.isEnabled) private var isEnabled
  @ScaledMetric(relativeTo: .largeTitle) private var scale: CGFloat = 1

  var body: some View {
    let empty = value.isEmpty
    Text(text(empty: empty))
      .monospacedDigit()
      .lineLimit(1)
      .minimumScaleFactor(0.3)
      .frame(maxWidth: .infinity)
      .accessibilityElement(children: .ignore)
      .accessibilityLabel(Text(label))
      .accessibilityValue(Text(verbatim: format.spoken(value)))
  }

  private func text(empty: Bool) -> AttributedString {
    let symbolFont = Font.system(size: TextStyle.xl3.size * scale, weight: .semibold)
    let numberFont = Font.system(size: 60 * scale, weight: .semibold)
    let symbolColor: Color = isEnabled ? .labelSecondary : .labelQuaternary
    let numberColor: Color = !isEnabled ? .labelQuaternary : empty ? .labelTertiary : .label
    var prefix = AttributedString(format.prefix)
    prefix.font = symbolFont
    prefix.foregroundColor = symbolColor
    var number = AttributedString(empty ? placeholder : format.number(value))
    number.font = numberFont
    number.foregroundColor = numberColor
    var suffix = AttributedString(format.suffix)
    suffix.font = symbolFont
    suffix.foregroundColor = symbolColor
    return prefix + number + suffix
  }
}

public struct AmountInput: View {
  @Binding var value: String
  let currency: String?
  let maxFractionDigits: Int?
  let max: Double?
  let placeholder: String
  let label: LocalizedStringKey
  let deleteLabel: LocalizedStringKey
  let decimalLabel: LocalizedStringKey
  let onValueChange: ((String, Double) -> Void)?

  @Environment(\.locale) private var locale
  @Environment(\.isEnabled) private var isEnabled
  @State private var rejections = 0

  public init(
    value: Binding<String>,
    currency: String? = nil,
    maxFractionDigits: Int? = nil,
    max: Double? = nil,
    placeholder: String = "0",
    label: LocalizedStringKey = "Amount",
    deleteLabel: LocalizedStringKey = "Delete",
    decimalLabel: LocalizedStringKey = "Decimal separator",
    onValueChange: ((String, Double) -> Void)? = nil
  ) {
    _value = value
    self.currency = currency
    self.maxFractionDigits = maxFractionDigits
    self.max = max
    self.placeholder = placeholder
    self.label = label
    self.deleteLabel = deleteLabel
    self.decimalLabel = decimalLabel
    self.onValueChange = onValueChange
  }

  public var body: some View {
    let format = AmountFormat(locale: locale, currency: currency, maxFractionDigits: maxFractionDigits)
    VStack(spacing: 32) {
      AmountDisplay(value: value, format: format, placeholder: placeholder, label: label)
        .shake(trigger: rejections)
      Keypad(
        accessory: format.fractionDigits > 0 ? .decimal(format.decimalSeparator, label: decimalLabel) : .none,
        deleteLabel: deleteLabel,
        canDelete: !value.isEmpty
      ) { key in
        guard isEnabled else { return false }
        guard let next = AmountMath.press(key, value: value, fractionDigits: format.fractionDigits, max: max) else {
          if AmountMath.rejects(key, value: value) { rejections += 1 }
          return false
        }
        value = next
        onValueChange?(next, AmountMath.amount(next))
        return true
      }
    }
    .hapticFeedback(.error, trigger: rejections)
  }
}
