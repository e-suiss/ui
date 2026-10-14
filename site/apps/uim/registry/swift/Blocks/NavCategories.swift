import PhosphorSwift
import SwiftUI

public struct NavCategories: View {
  struct Category: Identifiable {
    let label: String
    let image: URL?

    var id: String { label }
  }

  static func photo(_ id: String) -> URL? {
    URL(string: "https://images.unsplash.com/photo-\(id)?w=400&q=80&auto=format&fit=crop")
  }

  static var categories: [Category] {
    [
      Category(label: "Laptop", image: photo("1785245560368-f6d715956e5d")),
      Category(label: "Phone", image: photo("1714578187196-29775454aa39")),
      Category(label: "Pad", image: photo("1607452263110-39a87c399c50")),
      Category(label: "Watch", image: photo("1660844817855-3ecc7ef21f12")),
      Category(label: "Pods", image: photo("1599669454699-248893623440")),
      Category(label: "Cases", image: photo("1703676311066-34caf2cbee33")),
      Category(label: "Camera", image: photo("1604677209244-6569d050557a")),
      Category(label: "Colors", image: photo("1633596683562-4a47eb4983c5")),
      Category(label: "Pro", image: photo("1760978631841-f3754859ca59")),
      Category(label: "Accessories", image: photo("1645323927877-3de25b4f819c")),
    ]
  }

  private var onSelectCategory: ((String) -> Void)?
  private var onAskSpecialist: (() -> Void)?
  private var onFindStore: (() -> Void)?
  @State private var selected: String?
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onSelectCategory: ((_ category: String) -> Void)? = nil,
    onAskSpecialist: (() -> Void)? = nil,
    onFindStore: (() -> Void)? = nil
  ) {
    self.init(selected: "Phone")
    self.onSelectCategory = onSelectCategory
    self.onAskSpecialist = onAskSpecialist
    self.onFindStore = onFindStore
  }

  init(selected: String) {
    _selected = State(initialValue: selected)
  }

  public var body: some View {
    let current = Self.categories.first { $0.label == selected } ?? Self.categories[1]
    Screen {
      HeaderScrollView {
        HeaderLargeTitle("Store.")
        VStack(alignment: .leading, spacing: 28) {
          VStack(alignment: .leading, spacing: 20) {
            Text("The best way to buy the suiss products you love.")
              .scaledTextStyle(.xl)
              .foregroundStyle(Color.labelSecondary)
              .fixedSize(horizontal: false, vertical: true)
            VStack(alignment: .leading, spacing: 0) {
              Text("Need shopping help?")
                .scaledFont(.xs, weight: .semibold)
                .foregroundStyle(Color.labelSecondary)
              Button("Ask a Specialist ›") { onAskSpecialist?() }
                .buttonStyle(NavCategoriesLinkStyle())
              Button("Visit a suiss Store near you ›") { onFindStore?() }
                .buttonStyle(NavCategoriesLinkStyle())
            }
          }
          .padding(.horizontal, 16)
          ChipGroup(selection: selection, scrollable: true) {
            ForEach(Self.categories) { category in
              Chip(LocalizedStringKey(category.label), value: category.label)
            }
          }
          .contentMargins(.horizontal, 16, for: .scrollContent)
          .accessibilityLabel(Text("Categories"))
          VStack(alignment: .leading, spacing: 18) {
            Text("\(Text("The latest.")) \(Text("Take a look at what's new in \(Text(LocalizedStringKey(current.label))).").foregroundStyle(Color.labelSecondary))")
              .scaledTextStyle(.xl, weight: .semibold)
              .fixedSize(horizontal: false, vertical: true)
              .contentTransition(.opacity)
            Color.control
              .overlay {
                ForEach(Self.categories) { category in
                  Color.clear.overlay {
                    AsyncImage(url: category.image) { phase in
                      if let image = phase.image {
                        image.resizable().scaledToFill()
                      }
                    }
                  }
                  .opacity(category.label == current.label ? 1 : 0)
                }
              }
              .aspectRatio(4 / 3, contentMode: .fit)
              .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
              .accessibilityHidden(true)
          }
          .padding(.top, 22)
          .overlay(alignment: .top) {
            Color.separator.frame(height: 1)
          }
          .padding(.horizontal, 16)
        }
        .padding(.top, 4)
        .padding(.bottom, 32)
      } header: {
        Header {
          HeaderTitle("Store")
        }
      }
    }
    .animation(reduceMotion ? nil : .easeOut(duration: 0.3), value: selected)
  }

  private var selection: Binding<String?> {
    Binding(
      get: { selected },
      set: { value in
        guard let value else { return }
        selected = value
        onSelectCategory?(value)
      }
    )
  }
}

private struct NavCategoriesLinkStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .scaledFont(.sm)
      .foregroundStyle(Color.link)
      .opacity(configuration.isPressed ? 0.5 : 1)
      .frame(minHeight: 32)
      .contentShape(Rectangle())
  }
}
