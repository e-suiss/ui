import PhosphorSwift
import SwiftUI

public struct BagConfigure: View {
  struct Model: Identifiable {
    let name: String
    let price: Double

    var id: String { name }
  }

  struct Finish: Identifiable {
    let name: String
    let color: Color
    let image: URL?
    let alt: String

    var id: String { name }
  }

  struct Storage: Identifiable {
    let size: String
    let extra: Double

    var id: String { size }
  }

  static func photo(_ id: String) -> URL? {
    URL(string: "https://images.unsplash.com/photo-\(id)?w=1000&q=80&auto=format&fit=crop")
  }

  static var models: [Model] {
    [
      Model(name: "Phone Pro", price: 1099),
      Model(name: "Phone Pro Max", price: 1199),
    ]
  }

  static var finishes: [Finish] {
    [
      Finish(name: "Cosmic Orange", color: .orange, image: photo("1714972384975-fbd4f19b1bb3"), alt: "An orange phone on a warm gradient"),
      Finish(name: "Deep Blue", color: .indigo, image: photo("1714578187196-29775454aa39"), alt: "A phone floating among blue spheres"),
      Finish(name: "Silver", color: .gray, image: photo("1664883410931-2edffc8be5e6"), alt: "A silver phone on a light grey background"),
    ]
  }

  static var storage: [Storage] {
    [
      Storage(size: "256 GB", extra: 0),
      Storage(size: "512 GB", extra: 200),
      Storage(size: "1 TB", extra: 400),
    ]
  }

  private var onAddToBag: ((String, String, String, Double) -> Void)?
  @State private var model: String
  @State private var finish: String
  @State private var size: String
  @State private var added: Bool
  @Environment(\.locale) private var locale
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(onAddToBag: ((_ model: String, _ finish: String, _ storage: String, _ price: Double) -> Void)? = nil) {
    self.init(model: "Phone Pro")
    self.onAddToBag = onAddToBag
  }

  init(model: String, finish: String = "Cosmic Orange", size: String = "256 GB", added: Bool = false) {
    _model = State(initialValue: model)
    _finish = State(initialValue: finish)
    _size = State(initialValue: size)
    _added = State(initialValue: added)
  }

  private var price: Double {
    (Self.models.first { $0.name == model }?.price ?? 0) + (Self.storage.first { $0.size == size }?.extra ?? 0)
  }

  private func money(_ value: Double, digits: Int = 2) -> String {
    value.formatted(.currency(code: "USD").precision(.fractionLength(digits)).locale(locale))
  }

  public var body: some View {
    Screen {
      KeyboardScrollView {
        VStack(alignment: .leading, spacing: 16) {
          gallery
          VStack(alignment: .leading, spacing: 16) {
            VStack(alignment: .leading, spacing: 6) {
              Text("New")
                .scaledFont(.xs, weight: .semibold)
                .foregroundStyle(Color.warning)
              Text("Buy Phone Pro")
                .scaledTextStyle(.xl3, weight: .semibold)
                .accessibilityAddTraits(.isHeader)
            }
            heading("Model.", detail: Text("Which one is right for you?"))
            VStack(spacing: 8) {
              ForEach(Self.models) { item in
                BagConfigureCard(selected: model == item.name) {
                  select { model = item.name }
                } label: {
                  HStack {
                    Text(verbatim: item.name)
                      .scaledFont(.base, weight: .semibold)
                      .frame(maxWidth: .infinity, alignment: .leading)
                    Text("From \(money(item.price, digits: 0))")
                      .scaledFont(.sm)
                      .foregroundStyle(Color.labelSecondary)
                  }
                  .padding(.horizontal, 16)
                  .padding(.vertical, 14)
                }
              }
            }
            .accessibilityElement(children: .contain)
            .accessibilityLabel(Text("Model"))
            heading("Finish.", detail: Text(LocalizedStringKey(finish)))
            HStack(spacing: 14) {
              ForEach(Self.finishes) { item in
                BagConfigureSwatch(finish: item, selected: finish == item.name) {
                  finish = item.name
                }
              }
            }
            .padding(.leading, 4)
            .accessibilityElement(children: .contain)
            .accessibilityLabel(Text("Finish"))
            heading("Storage.", detail: nil)
            HStack(spacing: 8) {
              ForEach(Self.storage) { item in
                BagConfigureCard(selected: size == item.size) {
                  select { size = item.size }
                } label: {
                  VStack(spacing: 2) {
                    Text(verbatim: item.size)
                      .scaledFont(.base, weight: .semibold)
                    Group {
                      if item.extra > 0 {
                        Text(verbatim: "+\(money(item.extra, digits: 0))")
                      } else {
                        Text("Included")
                      }
                    }
                    .scaledFont(.xs2)
                    .foregroundStyle(Color.labelSecondary)
                  }
                  .lineLimit(1)
                  .frame(maxWidth: .infinity)
                  .padding(.horizontal, 6)
                  .padding(.vertical, 12)
                }
              }
            }
            .accessibilityElement(children: .contain)
            .accessibilityLabel(Text("Storage"))
          }
          .padding(.horizontal, 20)
        }
        .padding(.bottom, 24)
      }
      BottomBar {
        BottomBarContent {
          HStack(spacing: 12) {
            VStack(alignment: .leading, spacing: 0) {
              Text(verbatim: money(price))
                .scaledFont(.xl, weight: .semibold)
                .monospacedDigit()
                .contentTransition(.numericText())
              Text("or \(money(price / 12))/mo. for 12 mo.")
                .scaledFont(.xs)
                .foregroundStyle(Color.labelSecondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .accessibilityElement(children: .combine)
            Button(added ? "Added to Bag" : "Add to Bag") {
              onAddToBag?(model, finish, size, price)
              added = true
            }
            .buttonStyle(.variant(.default, size: .lg))
          }
        }
      }
    }
    .animation(reduceMotion ? nil : .easeOut(duration: 0.2), value: price)
  }

  private func select(_ change: () -> Void) {
    change()
    added = false
  }

  private func heading(_ title: LocalizedStringKey, detail: Text?) -> some View {
    Group {
      if let detail {
        Text("\(Text(title)) \(detail.foregroundStyle(Color.labelSecondary))")
      } else {
        Text(title)
      }
    }
    .scaledFont(.lg, weight: .semibold)
    .padding(.top, 4)
  }

  private var gallery: some View {
    Color.surfaceSecondary
      .aspectRatio(4 / 3, contentMode: .fit)
      .overlay {
        ForEach(Self.finishes) { item in
          Color.clear.overlay {
            AsyncImage(url: item.image) { phase in
              if let image = phase.image {
                image.resizable().scaledToFill()
              }
            }
          }
          .scaleEffect(item.name == finish ? 1 : 1.04)
          .opacity(item.name == finish ? 1 : 0)
          .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.9), value: finish)
          .accessibilityHidden(item.name != finish)
          .accessibilityLabel(Text(LocalizedStringKey(item.alt)))
        }
      }
      .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
      .padding(.horizontal, 20)
      .padding(.top, 20)
  }
}

private struct BagConfigureCard<Label: View>: View {
  let selected: Bool
  let action: () -> Void
  let label: Label

  init(selected: Bool, action: @escaping () -> Void, @ViewBuilder label: () -> Label) {
    self.selected = selected
    self.action = action
    self.label = label()
  }

  var body: some View {
    let shape = RoundedRectangle(cornerRadius: 14, style: .continuous)
    Button(action: action) {
      label
        .foregroundStyle(Color.label)
        .frame(maxWidth: .infinity)
        .contentShape(shape)
    }
    .buttonStyle(BagConfigureCardStyle(selected: selected))
    .accessibilityAddTraits(selected ? .isSelected : [])
    .hapticFeedback(.selection, trigger: selected) { _, now in now }
  }
}

private struct BagConfigureCardStyle: ButtonStyle {
  let selected: Bool

  func makeBody(configuration: Configuration) -> some View {
    let shape = RoundedRectangle(cornerRadius: 14, style: .continuous)
    configuration.label
      .background(configuration.isPressed ? Color.itemPressed : .clear, in: shape)
      .overlay {
        shape.strokeBorder(selected ? Color.accent : .separatorStrong, lineWidth: selected ? 2 : 1)
      }
      .animation(.easeOut(duration: 0.2), value: selected)
  }
}

private struct BagConfigureSwatch: View {
  let finish: BagConfigure.Finish
  let selected: Bool
  let action: () -> Void

  var body: some View {
    Button(action: action) {
      Circle()
        .fill(finish.color)
        .overlay {
          Circle().strokeBorder(Color.label.opacity(0.15), lineWidth: 1)
        }
        .frame(width: 30, height: 30)
        .padding(3)
        .overlay {
          if selected {
            Circle().strokeBorder(Color.accent, lineWidth: 2)
          }
        }
        .frame(width: 44, height: 44)
        .contentShape(Circle())
    }
    .buttonStyle(.plain)
    .padding(.horizontal, -4)
    .accessibilityLabel(Text(LocalizedStringKey(finish.name)))
    .accessibilityAddTraits(selected ? .isSelected : [])
    .hapticFeedback(.selection, trigger: selected) { _, now in now }
  }
}
