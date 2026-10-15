import PhosphorSwift
import SwiftUI

public struct GridAccessories: View {
  struct Accessory: Identifiable {
    let name: String
    let category: String
    let price: String
    let image: URL?

    var id: String { name }
  }

  static func photo(_ id: String) -> URL? {
    URL(string: "https://images.unsplash.com/photo-\(id)?w=500&q=80&auto=format&fit=crop")
  }

  static let filters = ["All", "Audio", "Cases", "Bands", "Pad"]

  static var accessories: [Accessory] {
    [
      Accessory(name: "Pods Studio Headphones", category: "Audio", price: "$549", image: photo("1599669454699-248893623440")),
      Accessory(name: "Phone Pro Clear Case", category: "Cases", price: "$49", image: photo("1703676311066-34caf2cbee33")),
      Accessory(name: "Sport Band", category: "Bands", price: "$49", image: photo("1624096104992-9b4fa3a279dd")),
      Accessory(name: "Keyboard Folio for Pad", category: "Pad", price: "$299", image: photo("1740637977676-c8040b41dc7a")),
      Accessory(name: "Pods Sage Headphones", category: "Audio", price: "$349", image: photo("1693621947585-7b7d94149af4")),
      Accessory(name: "Phone Silicone Case", category: "Cases", price: "$49", image: photo("1714578187196-29775454aa39")),
      Accessory(name: "Solo Loop", category: "Bands", price: "$49", image: photo("1660844817855-3ecc7ef21f12")),
      Accessory(name: "Pencil Pro", category: "Pad", price: "$129", image: photo("1625864667534-aa5208d45a87")),
    ]
  }

  private var onAddToBag: ((String) -> Void)?
  private var onRemoveFromBag: ((String) -> Void)?
  private var onOpenBag: (() -> Void)?
  private var onFilterChange: ((String) -> Void)?
  @State private var filter: String?
  @State private var bag: [String]
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onAddToBag: ((_ accessory: String) -> Void)? = nil,
    onRemoveFromBag: ((_ accessory: String) -> Void)? = nil,
    onOpenBag: (() -> Void)? = nil,
    onFilterChange: ((_ category: String) -> Void)? = nil
  ) {
    self.init(filter: "All")
    self.onAddToBag = onAddToBag
    self.onRemoveFromBag = onRemoveFromBag
    self.onOpenBag = onOpenBag
    self.onFilterChange = onFilterChange
  }

  init(filter: String, bag: [String] = []) {
    _filter = State(initialValue: filter)
    _bag = State(initialValue: bag)
  }

  private var items: [Accessory] {
    let current = filter ?? "All"
    return Self.accessories.filter { current == "All" || $0.category == current }
  }

  public var body: some View {
    Screen {
      HeaderScrollView {
        HeaderLargeTitle("Accessories", subtitle: "Designed for every suiss device.")
        VStack(alignment: .leading, spacing: 20) {
          ChipGroup(selection: filterSelection, scrollable: true) {
            ForEach(Self.filters, id: \.self) { item in
              Chip(LocalizedStringKey(item), value: item)
            }
          }
          .contentMargins(.horizontal, 16, for: .scrollContent)
          .accessibilityLabel(Text("Category"))
          LazyVGrid(columns: [GridItem(.flexible(), spacing: 16), GridItem(.flexible(), spacing: 16)], alignment: .leading, spacing: 24) {
            ForEach(items) { item in
              GridAccessoriesCell(item: item, inBag: bag.contains(item.name)) {
                toggle(item.name)
              }
              .transition(.opacity.combined(with: .offset(y: 10)))
            }
          }
          .padding(.horizontal, 16)
        }
        .padding(.top, 4)
        .padding(.bottom, 24)
      } header: {
        Header {
          HeaderTitle("Accessories")
        } trailing: {
          Button {
            onOpenBag?()
          } label: {
            Ph.handbag.regular
              .frame(width: 22, height: 22)
              .foregroundStyle(EsuissColor.foreground)
              .overlay(alignment: .bottomTrailing) {
                if !bag.isEmpty {
                  Text(verbatim: "\(bag.count)")
                    .font(.system(size: TextStyle.xs.size, weight: .semibold))
                    .monospacedDigit()
                    .foregroundStyle(EsuissColor.background)
                    .padding(.horizontal, 4)
                    .frame(minWidth: 16, minHeight: 16)
                    .background(EsuissColor.foreground, in: Capsule())
                    .offset(x: 8, y: 4)
                    .transition(.scale)
                }
              }
              .frame(width: 44, height: 44)
              .contentShape(Rectangle())
          }
          .buttonStyle(.plain)
          .accessibilityLabel(Text("Bag"))
          .accessibilityValue(Text("\(bag.count) items in bag"))
        }
      }
    }
    .animation(reduceMotion ? nil : .spring(response: 0.3, dampingFraction: 0.6), value: bag)
    .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.6), value: filter)
  }

  private var filterSelection: Binding<String?> {
    Binding(
      get: { filter },
      set: { value in
        guard let value, value != filter else { return }
        filter = value
        onFilterChange?(value)
      }
    )
  }

  private func toggle(_ name: String) {
    if let index = bag.firstIndex(of: name) {
      bag.remove(at: index)
      onRemoveFromBag?(name)
    } else {
      bag.append(name)
      onAddToBag?(name)
    }
  }
}

private struct GridAccessoriesCell: View {
  let item: GridAccessories.Accessory
  let inBag: Bool
  let action: () -> Void

  var body: some View {
    VStack(alignment: .leading, spacing: 0) {
      EsuissColor.muted
        .overlay {
          AsyncImage(url: item.image) { phase in
            if let image = phase.image {
              image.resizable().scaledToFill()
            }
          }
        }
        .aspectRatio(1, contentMode: .fit)
        .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
        .accessibilityHidden(true)
      Text(verbatim: item.name)
        .scaledFont(.base, weight: .semibold)
        .lineLimit(2, reservesSpace: true)
        .fixedSize(horizontal: false, vertical: true)
        .padding(.top, 12)
      HStack(spacing: 8) {
        Text(verbatim: item.price)
          .scaledFont(.base)
          .frame(maxWidth: .infinity, alignment: .leading)
        Button(action: action) {
          HStack(spacing: 4) {
            (inBag ? Ph.check.bold : Ph.plus.bold)
              .frame(width: 15, height: 15)
            if inBag {
              Text("In bag")
                .scaledFont(.xs, weight: .medium)
                .fixedSize()
                .accessibilityHidden(true)
            }
          }
          .foregroundStyle(EsuissColor.primaryForeground)
          .padding(.horizontal, inBag ? 12 : 0)
          .frame(minWidth: 30, minHeight: 30)
          .background(inBag ? Palette.green500 : EsuissColor.primary, in: Capsule())
          .frame(minHeight: 44)
          .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityLabel(inBag ? Text("Remove \(item.name) from bag") : Text("Add \(item.name) to bag"))
        .accessibilityAddTraits(inBag ? .isSelected : [])
        .hapticFeedback(.impact(weight: .light), trigger: inBag)
      }
      .padding(.top, 2)
    }
  }
}
