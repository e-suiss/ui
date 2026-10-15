import PhosphorSwift
import SwiftUI

public struct PriceCare: View {
  struct Option: Identifiable {
    let label: String
    let price: Double
    var theft: Double?

    var id: String { label }
  }

  struct Device: Identifiable {
    let name: String
    let image: URL?
    let alt: String
    let options: [Option]

    var id: String { name }
  }

  static func photo(_ id: String) -> URL? {
    URL(string: "https://images.unsplash.com/photo-\(id)?w=900&q=80&auto=format&fit=crop")
  }

  static var devices: [Device] {
    [
      Device(name: "Phone Pro", image: photo("1714972384975-fbd4f19b1bb3"), alt: "An orange phone on a warm gradient", options: [
        Option(label: "Annual", price: 99.99, theft: 50),
        Option(label: "Monthly", price: 9.99, theft: 5),
      ]),
      Device(name: "Book Air", image: photo("1644792863360-40fa85ea52e7"), alt: "A laptop on a wooden sideboard", options: [
        Option(label: "3-year", price: 279),
        Option(label: "Annual", price: 99.99),
      ]),
      Device(name: "Watch", image: photo("1660844817855-3ecc7ef21f12"), alt: "A smartwatch with a white band", options: [
        Option(label: "2-year", price: 79),
        Option(label: "Monthly", price: 3.99),
      ]),
    ]
  }

  private var onAddToBag: ((String, String, Bool, Double) -> Void)?
  @State private var device: String
  @State private var option: String
  @State private var theft: Bool
  @State private var added = false
  @Environment(\.locale) private var locale
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(onAddToBag: ((_ device: String, _ option: String, _ theft: Bool, _ total: Double) -> Void)? = nil) {
    self.init(device: "Phone Pro")
    self.onAddToBag = onAddToBag
  }

  init(device: String, option: String? = nil, theft: Bool = false) {
    let current = Self.devices.first { $0.name == device } ?? Self.devices[0]
    _device = State(initialValue: current.name)
    _option = State(initialValue: option ?? current.options[0].label)
    _theft = State(initialValue: theft)
  }

  private var current: Device {
    Self.devices.first { $0.name == device } ?? Self.devices[0]
  }

  private var plan: Option {
    current.options.first { $0.label == option } ?? current.options[0]
  }

  private var total: Double {
    plan.price + (theft ? plan.theft ?? 0 : 0)
  }

  private func money(_ value: Double) -> String {
    value.formatted(.currency(code: "USD").locale(locale))
  }

  public var body: some View {
    Screen {
      KeyboardScrollView {
        VStack(alignment: .leading, spacing: 0) {
          hero
          VStack(alignment: .leading, spacing: 18) {
            Text("Choose your device.")
              .scaledTextStyle(.xl2, weight: .semibold)
              .accessibilityAddTraits(.isHeader)
            ToggleGroup(selection: deviceSelection, spacing: 0) {
              ForEach(Self.devices) { item in
                ToggleGroupItem(value: item.name) {
                  Text(LocalizedStringKey(item.name))
                }
              }
            }
            .accessibilityLabel(Text("Device"))
            RadioGroup(selection: $option) {
              ForEach(current.options) { item in
                PriceCareChoice(value: item.label, selection: $option) {
                  VStack(alignment: .leading, spacing: 1) {
                    Text("\(Text(LocalizedStringKey(item.label))) payment")
                      .scaledFont(.base, weight: .semibold)
                    Text("Unlimited accidental damage repairs")
                      .scaledFont(.sm)
                      .foregroundStyle(EsuissColor.mutedForeground)
                  }
                  .frame(maxWidth: .infinity, alignment: .leading)
                  Text(verbatim: money(item.price))
                    .scaledFont(.base, weight: .semibold)
                    .monospacedDigit()
                }
              }
            }
            .id(device)
            .accessibilityLabel(Text("Payment"))
            if current.options.contains(where: { $0.theft != nil }) {
              Toggle(isOn: $theft) {
                Text("Add theft and loss protection")
                  .scaledFont(.sm)
                  .foregroundStyle(EsuissColor.foreground)
              }
              .toggleStyle(SwitchStyle())
            }
          }
          .padding(.horizontal, 20)
          .padding(.vertical, 30)
        }
      }
      BottomBar {
        BottomBarContent {
          HStack(spacing: 12) {
            VStack(alignment: .leading, spacing: 0) {
              Text("Total")
                .scaledFont(.sm)
                .foregroundStyle(EsuissColor.mutedForeground)
              Text(verbatim: money(total))
                .scaledFont(.xl, weight: .semibold)
                .monospacedDigit()
                .contentTransition(.numericText())
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .accessibilityElement(children: .combine)
            Button(added ? "Added to Bag" : "Add to Bag") {
              onAddToBag?(device, option, theft, total)
              added = true
            }
            .buttonStyle(.variant(.default, size: .lg))
          }
        }
      }
    }
    .animation(reduceMotion ? nil : .easeOut(duration: 0.25), value: total)
    .animation(reduceMotion ? nil : .easeOut(duration: 0.25), value: device)
    .onChange(of: total) { added = false }
  }

  private var deviceSelection: Binding<String?> {
    Binding(
      get: { device },
      set: { value in
        guard let value, let next = Self.devices.first(where: { $0.name == value }) else { return }
        device = next.name
        option = next.options[0].label
        theft = false
        added = false
      }
    )
  }

  private var hero: some View {
    VStack(alignment: .leading, spacing: 6) {
      Text(verbatim: "suiss Care+")
        .scaledFont(.base, weight: .semibold)
      Text("Protection against accidents.")
        .scaledTextStyle(.xl2, weight: .semibold)
    }
    .foregroundStyle(Palette.white)
    .fixedSize(horizontal: false, vertical: true)
    .padding(28)
    .frame(maxWidth: .infinity, minHeight: 320, alignment: .bottomLeading)
    .background {
      Palette.black.overlay {
        ForEach(Self.devices) { item in
          Color.clear.overlay {
            AsyncImage(url: item.image) { phase in
              if let image = phase.image {
                image.resizable().scaledToFill()
              }
            }
          }
          .opacity(item.name == device ? 1 : 0)
          .animation(reduceMotion ? nil : .easeOut(duration: 0.6), value: device)
          .accessibilityHidden(item.name != device)
          .accessibilityLabel(Text(LocalizedStringKey(item.alt)))
        }
      }
      .overlay {
        LinearGradient(
          stops: [.init(color: .clear, location: 0.45), .init(color: Palette.black.opacity(0.7), location: 1)],
          startPoint: .top,
          endPoint: .bottom
        )
      }
      .clipped()
    }
    .accessibilityElement(children: .combine)
  }
}

private struct PriceCareChoice<Content: View>: View {
  let value: String
  @Binding var selection: String
  let content: Content

  init(value: String, selection: Binding<String>, @ViewBuilder content: () -> Content) {
    self.value = value
    _selection = selection
    self.content = content()
  }

  var body: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl, style: .continuous)
    let checked = value == selection
    RadioGroupItem(value: value) {
      HStack(spacing: 12) {
        content
      }
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
