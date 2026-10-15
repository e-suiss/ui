import EsuissUI
import SwiftUI

enum AmountInputStories {
  static let group = StoryGroup(.components, "Amount Input", stories: [
    Story("Default") {
      AmountInputDemo(currency: "USD", locale: "en-US")
    },
    Story("Filled") {
      AmountInputDemo(currency: "USD", locale: "en-US", initial: "1250.5")
    },
    Story("Controlled") {
      AmountInputControlledDemo()
    },
    Story("LongAmount") {
      AmountInputDemo(currency: "USD", locale: "en-US", initial: "98765432109.99")
    },
    Story("Euro") {
      AmountInputDemo(currency: "EUR", locale: "de-DE", initial: "1234.5")
    },
    Story("TurkishLira") {
      AmountInputDemo(currency: "TRY", locale: "tr-TR", initial: "2500.75")
    },
    Story("Yen") {
      AmountInputDemo(currency: "JPY", locale: "ja-JP", initial: "15000")
    },
    Story("WithMax") {
      AmountInputDemo(currency: "USD", locale: "en-US", max: 500)
    },
    Story("Disabled") {
      AmountInputDemo(currency: "USD", locale: "en-US", initial: "42")
        .disabled(true)
    },
  ])
}

private struct AmountInputDemo: View {
  let currency: String
  let locale: String
  var max: Double?

  @State private var value: String

  init(currency: String, locale: String, initial: String = "", max: Double? = nil) {
    self.currency = currency
    self.locale = locale
    self.max = max
    _value = State(initialValue: initial)
  }

  var body: some View {
    AmountInput(value: $value, currency: currency, max: max)
      .environment(\.locale, Locale(identifier: locale))
  }
}

private struct AmountInputControlledDemo: View {
  @State private var value = ""
  @State private var amount: Double = 0

  var body: some View {
    VStack(spacing: 16) {
      AmountInput(value: $value, currency: "USD") { _, next in
        amount = next
      }
      .environment(\.locale, Locale(identifier: "en-US"))
      Text(verbatim: "value \"\(value)\" · amount \(amountText)")
        .textStyle(.sm)
        .foregroundStyle(EsuissColor.mutedForeground)
    }
    .frame(maxWidth: .infinity)
  }

  private var amountText: String {
    amount.rounded() == amount && abs(amount) < 1e15 ? String(Int64(amount)) : String(amount)
  }
}
