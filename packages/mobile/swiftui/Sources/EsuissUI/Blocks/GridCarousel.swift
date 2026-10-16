import PhosphorSwift
import SwiftUI

public struct GridCarousel: View {
  struct Product: Identifiable {
    var kicker: String?
    let name: String
    let tagline: String
    let price: String
    let image: URL?
    let alt: String

    var id: String { name }
  }

  static func photo(_ id: String) -> URL? {
    URL(string: "https://images.unsplash.com/photo-\(id)?w=800&q=80&auto=format&fit=crop")
  }

  static var products: [Product] {
    [
      Product(kicker: "New", name: "Phone Pro", tagline: "Pro through and through.", price: "$999", image: photo("1714972384975-fbd4f19b1bb3"), alt: "An orange phone on a warm gradient"),
      Product(kicker: "New", name: "Book Air", tagline: "Supercharged by S5.", price: "$1,099", image: photo("1644792863360-40fa85ea52e7"), alt: "A laptop on a wooden sideboard"),
      Product(name: "Watch Series 11", tagline: "Your best health companion.", price: "$399", image: photo("1696688713460-de12ac76ebc6"), alt: "A black smartwatch on a dark fabric"),
      Product(kicker: "New", name: "Phone Air", tagline: "The thinnest phone ever.", price: "$899", image: photo("1664883410931-2edffc8be5e6"), alt: "A silver phone on a light grey background"),
      Product(name: "Phone", tagline: "More colors. More power.", price: "$799", image: photo("1714578187196-29775454aa39"), alt: "A phone floating among blue spheres"),
      Product(name: "Pods Studio", tagline: "Active Noise Cancellation.", price: "$549", image: photo("1599669454699-248893623440"), alt: "Black over-ear headphones on a dark background"),
    ]
  }

  private var onSelectProduct: ((String) -> Void)?
  @State private var controller = CarouselController()
  private var initialIndex = 0

  public init(onSelectProduct: ((_ product: String) -> Void)? = nil) {
    self.onSelectProduct = onSelectProduct
  }

  init(index: Int) {
    initialIndex = index
  }

  public var body: some View {
    Screen(background: .muted) {
      KeyboardScrollView {
        VStack(alignment: .leading, spacing: 22) {
          Text("\(Text("The latest.")) \(Text("Fresh favorites of the season.").foregroundStyle(EsuissColor.mutedForeground))")
            .scaledTextStyle(.xl2, weight: .semibold)
            .fixedSize(horizontal: false, vertical: true)
            .padding(.horizontal, 24)
            .accessibilityAddTraits(.isHeader)
          Carousel(controller: controller) {
            CarouselContent(spacing: 16) {
              ForEach(Self.products) { product in
                CarouselItem(basis: 0.86) {
                  GridCarouselCard(product: product) {
                    onSelectProduct?(product.name)
                  }
                }
              }
            }
            .contentMargins(.horizontal, 24, for: .scrollContent)
            .contentMargins(.vertical, 8, for: .scrollContent)
            .padding(.bottom, 8)
            PageIndicator(count: Self.products.count, index: controller.selectedIndex) { index in
              controller.scrollTo(index)
            }
          }
          .accessibilityLabel(Text("Latest products"))
        }
        .padding(.top, 40)
        .padding(.bottom, 20)
      }
    }
    .task {
      guard initialIndex > 0 else { return }
      try? await Task.sleep(for: .milliseconds(100))
      controller.scrollTo(initialIndex, animated: false)
    }
  }
}

private struct GridCarouselCard: View {
  let product: GridCarousel.Product
  let action: () -> Void

  var body: some View {
    Button(action: action) {
      VStack(alignment: .leading, spacing: 0) {
        VStack(alignment: .leading, spacing: 4) {
          if let kicker = product.kicker {
            Text(LocalizedStringKey(kicker))
              .textCase(.uppercase)
              .scaledFont(.xs, weight: .semibold)
              .tracking(0.6)
              .foregroundStyle(Color.adaptive(light: Palette.amber600, dark: Palette.amber400))
          }
          Text(verbatim: product.name)
            .scaledTextStyle(.xl2, weight: .semibold)
          Text(LocalizedStringKey(product.tagline))
            .scaledFont(.lg)
          Text("From \(product.price)")
            .scaledFont(.sm)
            .foregroundStyle(EsuissColor.mutedForeground)
            .padding(.top, 6)
        }
        .foregroundStyle(EsuissColor.foreground)
        .multilineTextAlignment(.leading)
        .fixedSize(horizontal: false, vertical: true)
        .padding(.horizontal, 28)
        .padding(.top, 28)
        EsuissColor.secondary
          .overlay {
            AsyncImage(url: product.image) { phase in
              if let image = phase.image {
                image.resizable().scaledToFill()
              }
            }
          }
          .clipShape(RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
          .padding(20)
          .accessibilityLabel(Text(LocalizedStringKey(product.alt)))
      }
      .frame(maxWidth: .infinity, alignment: .leading)
      .frame(height: 440)
      .background(EsuissColor.background, in: RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
      .shadow(Shadow.md)
      .contentShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
    }
    .buttonStyle(GridCarouselCardStyle())
    .accessibilityElement(children: .combine)
    .accessibilityAddTraits(.isButton)
  }
}

private struct GridCarouselCardStyle: ButtonStyle {
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .scaleEffect(configuration.isPressed && !reduceMotion ? 0.98 : 1)
      .animation(reduceMotion ? nil : .easeOut(duration: 0.2), value: configuration.isPressed)
  }
}
