import PhosphorSwift
import SwiftUI

public struct GridLineup: View {
  struct Finish: Identifiable {
    let label: String
    let color: Color

    var id: String { label }
  }

  struct Model: Identifiable {
    let name: String
    let tagline: String
    let price: String
    var kicker: String?
    let image: URL?
    let alt: String
    let finishes: [Finish]

    var id: String { name }
  }

  static func photo(_ id: String) -> URL? {
    URL(string: "https://images.unsplash.com/photo-\(id)?w=600&q=80&auto=format&fit=crop")
  }

  static var models: [Model] {
    [
      Model(name: "Phone Pro", tagline: "Pro at its very core.", price: "$1,099", kicker: "New", image: photo("1714972384975-fbd4f19b1bb3"), alt: "An orange phone on a warm gradient", finishes: [
        Finish(label: "Cosmic Orange", color: Palette.orange500),
        Finish(label: "Deep Blue", color: Palette.indigo500),
        Finish(label: "Silver", color: Palette.zinc500),
      ]),
      Model(name: "Phone Air", tagline: "The thinnest phone ever.", price: "$999", kicker: "New", image: photo("1664883410931-2edffc8be5e6"), alt: "A silver phone on a light grey background", finishes: [
        Finish(label: "Sky Blue", color: Palette.cyan500),
        Finish(label: "Light Gold", color: Palette.yellow500),
        Finish(label: "Space Black", color: Palette.black),
      ]),
      Model(name: "Phone", tagline: "Better in every way.", price: "$799", image: photo("1714578187196-29775454aa39"), alt: "A phone floating among blue spheres", finishes: [
        Finish(label: "Lavender", color: Palette.purple500),
        Finish(label: "Sage", color: Palette.teal400),
        Finish(label: "Mist Blue", color: Palette.teal500),
        Finish(label: "Black", color: Palette.black),
      ]),
      Model(name: "Phone e", tagline: "Speed. Battery. Value.", price: "$599", image: photo("1703676311066-34caf2cbee33"), alt: "A phone on a pink and purple backdrop", finishes: [
        Finish(label: "Black", color: Palette.black),
        Finish(label: "White", color: Palette.white),
      ]),
    ]
  }

  private var onBuy: ((String, String) -> Void)?
  private var onLearnMore: ((String) -> Void)?

  public init(onBuy: ((_ model: String, _ finish: String) -> Void)? = nil, onLearnMore: ((_ model: String) -> Void)? = nil) {
    self.onBuy = onBuy
    self.onLearnMore = onLearnMore
  }

  public var body: some View {
    Screen {
      KeyboardScrollView {
        VStack(spacing: 36) {
          Text("Which phone is right for you?")
            .scaledTextStyle(.xl3, weight: .semibold)
            .multilineTextAlignment(.center)
            .fixedSize(horizontal: false, vertical: true)
            .accessibilityAddTraits(.isHeader)
          LazyVGrid(columns: [GridItem(.flexible(), spacing: 16, alignment: .top), GridItem(.flexible(), spacing: 16, alignment: .top)], spacing: 40) {
            ForEach(Self.models) { model in
              GridLineupModel(model: model, onBuy: onBuy, onLearnMore: onLearnMore)
            }
          }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 40)
      }
    }
  }
}

private struct GridLineupModel: View {
  let model: GridLineup.Model
  let onBuy: ((String, String) -> Void)?
  let onLearnMore: ((String) -> Void)?

  @State private var finish: String

  init(model: GridLineup.Model, onBuy: ((String, String) -> Void)?, onLearnMore: ((String) -> Void)?) {
    self.model = model
    self.onBuy = onBuy
    self.onLearnMore = onLearnMore
    _finish = State(initialValue: model.finishes.first?.label ?? "")
  }

  var body: some View {
    VStack(spacing: 0) {
      EsuissColor.secondary
        .overlay {
          AsyncImage(url: model.image) { phase in
            if let image = phase.image {
              image.resizable().scaledToFill()
            }
          }
        }
        .aspectRatio(0.85, contentMode: .fit)
        .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
        .accessibilityLabel(Text(LocalizedStringKey(model.alt)))
      HStack(spacing: 0) {
        ForEach(model.finishes) { item in
          GridLineupSwatch(finish: item, selected: item.label == finish) {
            finish = item.label
          }
        }
      }
      .padding(.top, 10)
      .accessibilityElement(children: .contain)
      .accessibilityLabel(Text("\(model.name) finish"))
      Group {
        if let kicker = model.kicker {
          Text(LocalizedStringKey(kicker))
        } else {
          Text(verbatim: " ")
        }
      }
      .scaledFont(.xs, weight: .semibold)
      .foregroundStyle(Color.adaptive(light: Palette.amber600, dark: Palette.amber400))
      .padding(.top, 8)
      Text(verbatim: model.name)
        .scaledFont(.xl, weight: .semibold)
        .padding(.top, 2)
      Text(LocalizedStringKey(model.tagline))
        .scaledFont(.lg)
        .lineLimit(2, reservesSpace: true)
        .padding(.top, 6)
      Text("From \(model.price)")
        .scaledFont(.sm)
        .foregroundStyle(EsuissColor.mutedForeground)
        .padding(.top, 6)
      VStack(spacing: 4) {
        Button("Buy") {
          onBuy?(model.name, finish)
        }
        .buttonStyle(.variant(.default, size: .sm))
        .accessibilityLabel(Text("Buy \(model.name)"))
        Button("Learn more ›") {
          onLearnMore?(model.name)
        }
        .buttonStyle(.variant(.link, size: .sm))
        .accessibilityLabel(Text("Learn more about \(model.name)"))
      }
      .padding(.top, 14)
    }
    .multilineTextAlignment(.center)
    .frame(maxWidth: .infinity)
  }
}

private struct GridLineupSwatch: View {
  let finish: GridLineup.Finish
  let selected: Bool
  let action: () -> Void

  var body: some View {
    Button(action: action) {
      Circle()
        .fill(finish.color)
        .overlay {
          Circle().strokeBorder(EsuissColor.foreground.opacity(0.15), lineWidth: 1)
        }
        .frame(width: 12, height: 12)
        .padding(3)
        .overlay {
          if selected {
            Circle().strokeBorder(EsuissColor.mutedForeground, lineWidth: 1.5)
          }
        }
        .frame(width: 30, height: 44)
        .contentShape(Rectangle())
    }
    .buttonStyle(.plain)
    .accessibilityLabel(Text(LocalizedStringKey(finish.label)))
    .accessibilityAddTraits(selected ? .isSelected : [])
    .hapticFeedback(.selection, trigger: selected) { _, now in now }
  }
}
