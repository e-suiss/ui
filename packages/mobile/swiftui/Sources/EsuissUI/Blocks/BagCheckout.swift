import PhosphorSwift
import SwiftUI

public struct BagCheckout: View {
  struct Product: Identifiable {
    let name: String
    let variant: String
    let price: Double
    let image: URL?

    var id: String { name }
  }

  static func photo(_ id: String) -> URL? {
    URL(string: "https://images.unsplash.com/photo-\(id)?w=200&q=80&auto=format&fit=crop")
  }

  static var items: [Product] {
    [
      Product(name: "Phone Pro", variant: "256 GB · Cosmic Orange", price: 1099, image: photo("1714972384975-fbd4f19b1bb3")),
      Product(name: "Pods Studio", variant: "Midnight", price: 549, image: photo("1599669454699-248893623440")),
      Product(name: "Phone Pro Clear Case", variant: "With MagCharge", price: 49, image: photo("1703676311066-34caf2cbee33")),
    ]
  }

  private var onPlaceOrder: ((String, String, Double) -> Void)?
  private var onStartOver: (() -> Void)?
  @State private var step: Int
  @State private var shipping: String
  @State private var payment: String
  @State private var placed: Bool
  @Environment(\.locale) private var locale
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onPlaceOrder: ((_ shipping: String, _ payment: String, _ total: Double) -> Void)? = nil,
    onStartOver: (() -> Void)? = nil
  ) {
    self.init(step: 0)
    self.onPlaceOrder = onPlaceOrder
    self.onStartOver = onStartOver
  }

  init(step: Int, shipping: String = "standard", payment: String = "card", placed: Bool = false) {
    _step = State(initialValue: step)
    _shipping = State(initialValue: shipping)
    _payment = State(initialValue: payment)
    _placed = State(initialValue: placed)
  }

  private var total: Double {
    Self.items.reduce(0) { $0 + $1.price } + (shipping == "express" ? 19 : 0)
  }

  private func money(_ value: Double) -> String {
    value.formatted(.currency(code: "USD").locale(locale))
  }

  private var motion: Animation? {
    reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.45)
  }

  public var body: some View {
    Screen {
      if placed {
        thanks
          .transition(.opacity.combined(with: .offset(y: 18)))
      } else {
        HeaderScrollView {
          HeaderLargeTitle("Checkout")
          VStack(alignment: .leading, spacing: 0) {
            BagCheckoutStep(index: 0, current: step, title: "Delivery", summary: shipping == "express" ? "Express · Tomorrow" : "Standard · 3–5 business days") {
              go(0)
            } content: {
              RadioGroup(selection: $shipping) {
                BagCheckoutChoice(value: "standard", selection: $shipping) {
                  Text("Standard · 3–5 business days").frame(maxWidth: .infinity, alignment: .leading)
                  Text("Free")
                }
                BagCheckoutChoice(value: "express", selection: $shipping) {
                  Text("Express · Tomorrow").frame(maxWidth: .infinity, alignment: .leading)
                  Text(verbatim: money(19))
                }
              }
              .accessibilityLabel(Text("Delivery"))
            }
            BagCheckoutStep(index: 1, current: step, title: "Payment", summary: payment == "card" ? "Card •••• 4242" : "suiss Pay") {
              go(1)
            } content: {
              RadioGroup(selection: $payment) {
                BagCheckoutChoice(value: "card", selection: $payment) {
                  Ph.creditCard.regular.frame(width: 18, height: 18)
                  Text("Credit card · •••• 4242").frame(maxWidth: .infinity, alignment: .leading)
                }
                BagCheckoutChoice(value: "pay", selection: $payment) {
                  Ph.wallet.regular.frame(width: 18, height: 18)
                  Text(verbatim: "suiss Pay").frame(maxWidth: .infinity, alignment: .leading)
                }
              }
              .accessibilityLabel(Text("Payment"))
            }
            BagCheckoutStep(index: 2, current: step, title: "Review", summary: nil) {
              go(2)
            } content: {
              Text("By placing your order, you agree to the Sales Policy.")
                .scaledFont(.sm)
                .foregroundStyle(EsuissColor.mutedForeground)
                .fixedSize(horizontal: false, vertical: true)
            }
            summary
              .padding(.top, 28)
          }
          .padding(.horizontal, 16)
          .padding(.bottom, 24)
        } header: {
          Header {
            HeaderTitle("Checkout")
          }
        }
        BottomBar {
          BottomBarContent {
            HStack(spacing: 12) {
              VStack(alignment: .leading, spacing: 0) {
                Text("Total")
                  .scaledFont(.xs)
                  .foregroundStyle(EsuissColor.mutedForeground)
                Text(verbatim: money(total))
                  .scaledFont(.lg, weight: .semibold)
                  .monospacedDigit()
                  .contentTransition(.numericText())
              }
              .frame(maxWidth: .infinity, alignment: .leading)
              .accessibilityElement(children: .combine)
              Button(step == 0 ? "Continue to Payment" : step == 1 ? "Continue to Review" : "Place Order") {
                advance()
              }
              .buttonStyle(.variant(.default, size: .lg))
              .fixedSize()
            }
          }
        }
      }
    }
    .animation(motion, value: step)
    .animation(motion, value: shipping)
    .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 1), value: placed)
  }

  private func go(_ index: Int) {
    step = index
  }

  private func advance() {
    if step < 2 {
      step += 1
    } else {
      onPlaceOrder?(shipping, payment, total)
      placed = true
    }
  }

  private var summary: some View {
    VStack(alignment: .leading, spacing: 14) {
      Text("Order summary")
        .scaledFont(.lg, weight: .semibold)
        .accessibilityAddTraits(.isHeader)
      ForEach(Self.items) { item in
        HStack(spacing: 10) {
          EsuissColor.secondary
            .overlay {
              AsyncImage(url: item.image) { phase in
                if let image = phase.image {
                  image.resizable().scaledToFill()
                }
              }
            }
            .frame(width: 48, height: 48)
            .clipShape(RoundedRectangle(cornerRadius: Radius.lg, style: .continuous))
            .accessibilityHidden(true)
          VStack(alignment: .leading, spacing: 0) {
            Text(verbatim: item.name)
              .scaledFont(.sm, weight: .semibold)
            Text(verbatim: item.variant)
              .scaledFont(.xs)
              .foregroundStyle(EsuissColor.mutedForeground)
          }
          .frame(maxWidth: .infinity, alignment: .leading)
          Text(verbatim: money(item.price))
            .scaledFont(.sm)
            .monospacedDigit()
        }
        .accessibilityElement(children: .combine)
      }
      HStack {
        Text("Total")
          .scaledFont(.base, weight: .semibold)
          .frame(maxWidth: .infinity, alignment: .leading)
        Text(verbatim: money(total))
          .scaledFont(.lg, weight: .semibold)
          .monospacedDigit()
      }
      .padding(.top, 12)
      .overlay(alignment: .top) {
        EsuissColor.border.frame(height: 1)
      }
      .accessibilityElement(children: .combine)
    }
    .padding(20)
    .background(EsuissColor.muted, in: RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
  }

  private var thanks: some View {
    VStack(spacing: 14) {
      Ph.check.bold
        .frame(width: 38, height: 38)
        .foregroundStyle(EsuissColor.primaryForeground)
        .frame(width: 76, height: 76)
        .background(Palette.green500, in: Circle())
        .accessibilityHidden(true)
      Text("Thank you. Your order is in.")
        .scaledTextStyle(.xl3, weight: .semibold)
        .accessibilityAddTraits(.isHeader)
      Text("Your order number is W1049. We sent a confirmation email.")
        .scaledTextStyle(.lg)
        .foregroundStyle(EsuissColor.mutedForeground)
      Button("Start over ›") {
        onStartOver?()
        placed = false
        step = 0
      }
      .buttonStyle(.variant(.link, size: .lg))
    }
    .multilineTextAlignment(.center)
    .fixedSize(horizontal: false, vertical: true)
    .padding(24)
    .frame(maxWidth: .infinity, maxHeight: .infinity)
  }
}

private struct BagCheckoutStep<Content: View>: View {
  let index: Int
  let current: Int
  let title: LocalizedStringKey
  let summary: LocalizedStringKey?
  let onEdit: () -> Void
  let content: Content

  init(
    index: Int,
    current: Int,
    title: LocalizedStringKey,
    summary: LocalizedStringKey?,
    onEdit: @escaping () -> Void,
    @ViewBuilder content: () -> Content
  ) {
    self.index = index
    self.current = current
    self.title = title
    self.summary = summary
    self.onEdit = onEdit
    self.content = content()
  }

  var body: some View {
    let open = current == index
    let done = current > index
    VStack(alignment: .leading, spacing: 0) {
      HStack(spacing: 10) {
        Group {
          if done {
            Ph.check.bold.frame(width: 13, height: 13)
          } else {
            Text(verbatim: "\(index + 1)").scaledFont(.sm, weight: .semibold)
          }
        }
        .foregroundStyle(done ? EsuissColor.primaryForeground : open ? EsuissColor.background : EsuissColor.mutedForeground)
        .frame(width: 26, height: 26)
        .background(done ? Palette.green500 : open ? EsuissColor.foreground : EsuissColor.secondary, in: Circle())
        .accessibilityHidden(true)
        Text(title)
          .scaledFont(.xl, weight: .semibold)
          .foregroundStyle(!open && !done ? EsuissColor.mutedForeground : EsuissColor.foreground)
          .frame(maxWidth: .infinity, alignment: .leading)
          .accessibilityAddTraits(.isHeader)
          .accessibilityValue(done ? Text("Completed") : open ? Text("Current step") : Text(verbatim: ""))
        if done {
          Button("Edit ›", action: onEdit)
            .buttonStyle(.variant(.link, size: .sm))
            .accessibilityLabel(Text("Edit \(Text(title))"))
        }
      }
      .frame(minHeight: 32)
      if done, let summary {
        Text(summary)
          .scaledFont(.sm)
          .foregroundStyle(EsuissColor.mutedForeground)
          .padding(.leading, 36)
          .padding(.top, 2)
      }
      if open {
        VStack(alignment: .leading, spacing: 10) {
          content
        }
        .padding(.leading, 36)
        .padding(.top, 16)
        .padding(.bottom, 4)
        .transition(.opacity.combined(with: .move(edge: .top)))
      }
    }
    .padding(.vertical, 18)
    .frame(maxWidth: .infinity, alignment: .leading)
    .clipped()
    .overlay(alignment: .bottom) {
      EsuissColor.border.frame(height: 1)
    }
  }
}

private struct BagCheckoutChoice<Content: View>: View {
  let value: String
  @Binding var selection: String
  let content: Content

  init(value: String, selection: Binding<String>, @ViewBuilder content: () -> Content) {
    self.value = value
    _selection = selection
    self.content = content()
  }

  var body: some View {
    let shape = RoundedRectangle(cornerRadius: 14, style: .continuous)
    let checked = value == selection
    RadioGroupItem(value: value) {
      HStack(spacing: 12) {
        content
      }
      .scaledFont(.base)
      .foregroundStyle(EsuissColor.foreground)
      .frame(maxWidth: .infinity, alignment: .leading)
    }
    .padding(.horizontal, 16)
    .padding(.vertical, 14)
    .overlay {
      shape.strokeBorder(checked ? EsuissColor.primary : EsuissColor.input, lineWidth: checked ? 2 : 1)
    }
    .contentShape(shape)
    .onTapGesture { selection = value }
  }
}
