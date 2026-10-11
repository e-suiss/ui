import PhosphorSwift
import SwiftUI

public struct BagReview: View {
  public enum CheckoutMethod: CaseIterable, Sendable {
    case suissPay, `default`
  }

  struct Product: Identifiable, Equatable {
    let name: String
    let variant: String
    let price: Double
    let image: URL?
    var quantity: Int

    var id: String { name }
  }

  static func photo(_ id: String) -> URL? {
    URL(string: "https://images.unsplash.com/photo-\(id)?w=400&q=80&auto=format&fit=crop")
  }

  static var initialItems: [Product] {
    [
      Product(name: "Phone Pro", variant: "256 GB · Cosmic Orange", price: 1099, image: photo("1714972384975-fbd4f19b1bb3"), quantity: 1),
      Product(name: "Pods Studio", variant: "Midnight", price: 549, image: photo("1599669454699-248893623440"), quantity: 1),
      Product(name: "Phone Pro Clear Case", variant: "With MagCharge", price: 49, image: photo("1703676311066-34caf2cbee33"), quantity: 2),
    ]
  }

  private var onCheckout: ((CheckoutMethod) -> Void)?
  private var onShowDetails: ((String) -> Void)?
  private var onContinueShopping: (() -> Void)?
  private var onQuantityChange: ((String, Int) -> Void)?
  private var onRemove: ((String) -> Void)?
  @State private var items: [Product]
  @Environment(\.locale) private var locale
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onCheckout: ((_ method: CheckoutMethod) -> Void)? = nil,
    onShowDetails: ((_ name: String) -> Void)? = nil,
    onContinueShopping: (() -> Void)? = nil,
    onQuantityChange: ((_ name: String, _ quantity: Int) -> Void)? = nil,
    onRemove: ((_ name: String) -> Void)? = nil
  ) {
    self.init(items: Self.initialItems)
    self.onCheckout = onCheckout
    self.onShowDetails = onShowDetails
    self.onContinueShopping = onContinueShopping
    self.onQuantityChange = onQuantityChange
    self.onRemove = onRemove
  }

  init(items: [Product]) {
    _items = State(initialValue: items)
  }

  private var bag: [Product] {
    items.filter { $0.quantity > 0 }
  }

  private var subtotal: Double {
    bag.reduce(0) { $0 + $1.price * Double($1.quantity) }
  }

  private func money(_ value: Double) -> String {
    value.formatted(.currency(code: "USD").locale(locale))
  }

  public var body: some View {
    let bag = bag
    Screen {
      KeyboardScrollView {
        VStack(spacing: 0) {
          VStack(spacing: 8) {
            Group {
              if bag.isEmpty {
                Text("Your bag is empty.")
              } else {
                Text("Your bag total is \(money(subtotal)).")
              }
            }
            .scaledTextStyle(.xl2, weight: .semibold)
            .contentTransition(.numericText())
            .accessibilityAddTraits(.isHeader)
            Text("Free delivery and free returns on every order.")
              .scaledFont(.base)
              .foregroundStyle(Color.labelSecondary)
            if bag.isEmpty {
              Button("Continue Shopping") {
                onContinueShopping?()
                items = Self.initialItems
              }
              .buttonStyle(.variant(.default, size: .lg))
              .padding(.top, 12)
            }
          }
          .multilineTextAlignment(.center)
          .fixedSize(horizontal: false, vertical: true)
          .padding(.top, 32)
          .padding(.bottom, 20)
          ForEach(bag) { item in
            BagReviewRow(
              item: item,
              money: money,
              quantity: binding(item.name),
              onShowDetails: { onShowDetails?(item.name) },
              onRemove: {
                onRemove?(item.name)
                setQuantity(item.name, 0)
              }
            )
            .transition(.opacity.combined(with: .offset(y: 6)))
          }
          if !bag.isEmpty {
            VStack(spacing: 10) {
              BagReviewTotal(label: "Subtotal", value: Text(verbatim: money(subtotal)))
              BagReviewTotal(label: "Shipping", value: Text("FREE"))
              BagReviewTotal(label: "Total", value: Text(verbatim: money(subtotal)), large: true)
                .padding(.top, 12)
                .overlay(alignment: .top) {
                  Color.separator.frame(height: 1)
                }
            }
            .padding(.top, 20)
            .overlay(alignment: .top) {
              Color.separator.frame(height: 1)
            }
          }
        }
        .padding(.horizontal, 20)
        .padding(.bottom, 24)
      }
      if !bag.isEmpty {
        BottomBar {
          BottomBarContent {
            Button {
              onCheckout?(.suissPay)
            } label: {
              Text("Check Out with \(Text(verbatim: "suiss").bold()) Pay")
            }
            .buttonStyle(BagReviewPayStyle())
            Button("Check Out") {
              onCheckout?(.default)
            }
            .buttonStyle(.variant(.default, size: .lg, block: true))
          }
        }
        .transition(.move(edge: .bottom))
      }
    }
    .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.5), value: items)
  }

  private func binding(_ name: String) -> Binding<Int> {
    Binding(
      get: { items.first { $0.name == name }?.quantity ?? 0 },
      set: { value in
        onQuantityChange?(name, value)
        setQuantity(name, value)
      }
    )
  }

  private func setQuantity(_ name: String, _ quantity: Int) {
    guard let index = items.firstIndex(where: { $0.name == name }) else { return }
    items[index].quantity = quantity
  }
}

private struct BagReviewRow: View {
  let item: BagReview.Product
  let money: (Double) -> String
  @Binding var quantity: Int
  let onShowDetails: () -> Void
  let onRemove: () -> Void

  var body: some View {
    HStack(alignment: .top, spacing: 16) {
      Color.control
        .overlay {
          AsyncImage(url: item.image) { phase in
            if let image = phase.image {
              image.resizable().scaledToFill()
            }
          }
        }
        .frame(width: 80, height: 80)
        .clipShape(RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
        .accessibilityHidden(true)
      VStack(alignment: .leading, spacing: 12) {
        VStack(alignment: .leading, spacing: 4) {
          Text(verbatim: item.name)
            .scaledFont(.xl, weight: .semibold)
            .accessibilityAddTraits(.isHeader)
          Text(verbatim: item.variant)
            .scaledFont(.sm)
            .foregroundStyle(Color.labelSecondary)
          Button("Show product details ›", action: onShowDetails)
            .buttonStyle(BagReviewLinkStyle())
            .padding(.top, 2)
        }
        ValueStepper(value: $quantity, in: 1...10) {
          StepperInput()
            .accessibilityLabel(Text("\(item.name) quantity"))
          StepperGroup {
            StepperDecrement()
            StepperSeparator()
            StepperIncrement()
          }
        }
        HStack {
          Text(verbatim: money(item.price * Double(item.quantity)))
            .scaledFont(.xl, weight: .semibold)
            .monospacedDigit()
            .contentTransition(.numericText())
            .frame(maxWidth: .infinity, alignment: .leading)
          Button("Remove", action: onRemove)
            .buttonStyle(BagReviewLinkStyle())
            .accessibilityLabel(Text("Remove \(item.name)"))
        }
      }
    }
    .padding(.vertical, 22)
    .overlay(alignment: .top) {
      Color.separator.frame(height: 1)
    }
  }
}

private struct BagReviewTotal: View {
  let label: LocalizedStringKey
  let value: Text
  var large = false

  var body: some View {
    HStack {
      Text(label)
        .frame(maxWidth: .infinity, alignment: .leading)
      value.monospacedDigit()
    }
    .scaledFont(large ? .xl2 : .base, weight: large ? .semibold : .regular)
    .accessibilityElement(children: .combine)
  }
}

private struct BagReviewLinkStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .scaledFont(.sm)
      .foregroundStyle(Color.link)
      .opacity(configuration.isPressed ? 0.5 : 1)
      .frame(minHeight: 32)
      .contentShape(Rectangle())
  }
}

private struct BagReviewPayStyle: ButtonStyle {
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .scaledFont(.base, weight: .medium)
      .foregroundStyle(Color.surface)
      .frame(maxWidth: .infinity, minHeight: 44)
      .background(Color.label.opacity(configuration.isPressed ? 0.8 : 1), in: RoundedRectangle(cornerRadius: Radius.lg, style: .continuous))
      .scaleEffect(configuration.isPressed && !reduceMotion ? 0.98 : 1)
      .contentShape(Rectangle())
  }
}
