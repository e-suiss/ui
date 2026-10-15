import PhosphorSwift
import SwiftUI

public struct EmptyBag: View {
  struct Product: Identifiable {
    let name: String
    let price: String
    let image: URL?

    var id: String { name }
  }

  static func photo(_ id: String) -> URL? {
    URL(string: "https://images.unsplash.com/photo-\(id)?w=500&q=80&auto=format&fit=crop")
  }

  static var recommended: [Product] {
    [
      Product(name: "Pods Studio", price: "$549", image: photo("1599669454699-248893623440")),
      Product(name: "Sport Band", price: "$49", image: photo("1624096104992-9b4fa3a279dd")),
      Product(name: "Phone Pro Clear Case", price: "$49", image: photo("1703676311066-34caf2cbee33")),
    ]
  }

  @State private var added: [String]
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init() {
    self.init(added: [])
  }

  init(added: [String]) {
    _added = State(initialValue: added)
  }

  public var body: some View {
    let count = added.count
    Screen {
      KeyboardScrollView {
        VStack(spacing: 36) {
          Empty {
            EmptyHeader {
              EmptyMedia {
                Ph.handbag.light
                  .frame(width: 46, height: 46)
                  .foregroundStyle(EsuissColor.foreground)
                  .overlay(alignment: .bottomTrailing) {
                    if count > 0 {
                      Text(verbatim: "\(count)")
                        .font(.system(size: TextStyle.xs.size, weight: .semibold))
                        .monospacedDigit()
                        .foregroundStyle(EsuissColor.background)
                        .frame(width: 20, height: 20)
                        .background(EsuissColor.foreground, in: Circle())
                        .offset(x: 6, y: 2)
                        .transition(.scale)
                    }
                  }
              }
              EmptyTitle(count == 0 ? "Your bag is empty." : count == 1 ? "There is 1 item in your bag." : "There are \(count) items in your bag.")
              EmptyDescription(count > 0 ? "Check out now or keep browsing." : "Sign in to see items you saved.")
            }
            EmptyContent {
              HStack(spacing: 14) {
                Button(count > 0 ? "Check Out" : "Sign In") {}
                  .buttonStyle(.variant(.default, size: .lg))
                Button("Continue Shopping") {}
                  .buttonStyle(.variant(.outline, size: .lg))
              }
            }
          }
          .padding(-28)
          VStack(alignment: .leading, spacing: 16) {
            Text("You may also like")
              .scaledFont(.lg, weight: .semibold)
              .padding(.horizontal, 20)
              .accessibilityAddTraits(.isHeader)
            ScrollView(.horizontal) {
              HStack(alignment: .top, spacing: 16) {
                ForEach(Self.recommended) { item in
                  EmptyBagProduct(item: item, inBag: added.contains(item.name)) {
                    if let index = added.firstIndex(of: item.name) {
                      added.remove(at: index)
                    } else {
                      added.append(item.name)
                    }
                  }
                }
              }
              .padding(.horizontal, 20)
            }
            .scrollIndicators(.hidden)
          }
        }
        .padding(.top, 72)
        .padding(.bottom, 24)
      }
    }
    .animation(reduceMotion ? nil : .spring(response: 0.3, dampingFraction: 0.6), value: count)
  }
}

private struct EmptyBagProduct: View {
  let item: EmptyBag.Product
  let inBag: Bool
  let action: () -> Void

  var body: some View {
    VStack(alignment: .leading, spacing: 10) {
      EsuissColor.secondary
        .overlay {
          AsyncImage(url: item.image) { phase in
            if let image = phase.image {
              image.resizable().scaledToFill()
            }
          }
        }
        .frame(width: 220, height: 184)
        .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
        .accessibilityHidden(true)
      HStack(spacing: 8) {
        VStack(alignment: .leading, spacing: 0) {
          Text(verbatim: item.name)
            .scaledFont(.base, weight: .semibold)
            .lineLimit(1)
          Text(verbatim: item.price)
            .scaledFont(.sm)
            .foregroundStyle(EsuissColor.mutedForeground)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        Button(action: action) {
          (inBag ? Ph.check.bold : Ph.plus.bold)
            .frame(width: 15, height: 15)
            .foregroundStyle(EsuissColor.primaryForeground)
            .frame(width: 30, height: 30)
            .background(inBag ? Palette.green500 : EsuissColor.primary, in: Circle())
            .frame(width: 44, height: 44)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .padding(.trailing, -7)
        .accessibilityLabel(inBag ? Text("Remove \(item.name) from bag") : Text("Add \(item.name) to bag"))
        .accessibilityAddTraits(inBag ? .isSelected : [])
      }
    }
    .frame(width: 220)
  }
}
