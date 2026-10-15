import PhosphorSwift
import SwiftUI

public struct PriceBundle: View {
  struct Service: Identifiable {
    let name: String
    let icon: Image
    let tint: Color
    let foreground: Color

    var id: String { name }
  }

  struct Plan: Identifiable {
    let name: String
    let price: Double
    let people: String
    let storage: String
    let included: Int
    let saving: Int

    var id: String { name }
  }

  static var services: [Service] {
    [
      Service(name: "suiss Music", icon: Ph.musicNote.fill, tint: Palette.red500, foreground: EsuissColor.primaryForeground),
      Service(name: "suiss TV", icon: Ph.television.fill, tint: EsuissColor.foreground, foreground: EsuissColor.background),
      Service(name: "suiss Arcade", icon: Ph.gameController.fill, tint: Palette.red500, foreground: EsuissColor.primaryForeground),
      Service(name: "suiss Cloud+", icon: Ph.cloud.fill, tint: Palette.blue500, foreground: EsuissColor.primaryForeground),
      Service(name: "Fitness+", icon: Ph.flame.fill, tint: Palette.green500, foreground: EsuissColor.primaryForeground),
      Service(name: "News+", icon: Ph.newspaper.fill, tint: Palette.pink500, foreground: EsuissColor.primaryForeground),
    ]
  }

  static var plans: [Plan] {
    [
      Plan(name: "Individual", price: 19.95, people: "1 person", storage: "50 GB", included: 4, saving: 6),
      Plan(name: "Family", price: 25.95, people: "Up to 6 people", storage: "200 GB", included: 4, saving: 8),
      Plan(name: "Premier", price: 37.95, people: "Up to 6 people", storage: "2 TB", included: 6, saving: 29),
    ]
  }

  private var onSelectPlan: ((String) -> Void)?
  private var onCompare: ((String) -> Void)?
  @State private var selected: String
  @Environment(\.locale) private var locale
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(onSelectPlan: ((_ plan: String) -> Void)? = nil, onCompare: ((_ plan: String) -> Void)? = nil) {
    self.init(selected: "Family")
    self.onSelectPlan = onSelectPlan
    self.onCompare = onCompare
  }

  init(selected: String) {
    _selected = State(initialValue: selected)
  }

  private var plan: Plan {
    Self.plans.first { $0.name == selected } ?? Self.plans[1]
  }

  private func money(_ value: Double, digits: Int = 2) -> String {
    value.formatted(.currency(code: "USD").precision(.fractionLength(digits)).locale(locale))
  }

  public var body: some View {
    Screen {
      KeyboardScrollView {
        VStack(spacing: 22) {
          VStack(spacing: 8) {
            Text("\(Text(verbatim: "suiss").fontWeight(.bold)) One")
              .scaledTextStyle(.xl3, weight: .semibold)
              .accessibilityAddTraits(.isHeader)
            Text("Bundle it all in one subscription.")
              .scaledTextStyle(.xl)
              .foregroundStyle(EsuissColor.mutedForeground)
          }
          .multilineTextAlignment(.center)
          .fixedSize(horizontal: false, vertical: true)
          VStack(spacing: 12) {
            ForEach(Self.plans) { item in
              PriceBundleCard(plan: item, selected: item.name == selected, price: money(item.price)) {
                selected = item.name
              }
            }
          }
          .accessibilityElement(children: .contain)
          .accessibilityLabel(Text("Plan"))
        }
        .padding(.horizontal, 20)
        .padding(.top, 34)
        .padding(.bottom, 24)
      }
      BottomBar {
        BottomBarContent {
          Button("Try it free") {
            onSelectPlan?(selected)
          }
          .buttonStyle(.variant(.default, size: .lg, block: true))
          Button {
            onCompare?(selected)
          } label: {
            Text("Save \(money(Double(plan.saving), digits: 0)) compared to buying separately ›")
              .contentTransition(.numericText())
          }
          .buttonStyle(.variant(.link, size: .sm))
        }
      }
    }
    .animation(reduceMotion ? nil : .easeOut(duration: 0.3), value: selected)
  }
}

private struct PriceBundleCard: View {
  let plan: PriceBundle.Plan
  let selected: Bool
  let price: String
  let action: () -> Void

  var body: some View {
    let shape = RoundedRectangle(cornerRadius: 20, style: .continuous)
    Button(action: action) {
      VStack(alignment: .leading, spacing: 14) {
        HStack(spacing: 8) {
          Text(LocalizedStringKey(plan.name))
            .scaledFont(.xl, weight: .semibold)
            .frame(maxWidth: .infinity, alignment: .leading)
          Text(LocalizedStringKey(plan.people))
            .scaledFont(.xs)
            .foregroundStyle(EsuissColor.mutedForeground)
        }
        HStack(alignment: .firstTextBaseline, spacing: 0) {
          Text(verbatim: price)
            .scaledFont(.xl, weight: .semibold)
            .monospacedDigit()
          Text(verbatim: " ")
          Text("/mo")
            .scaledFont(.sm)
            .foregroundStyle(EsuissColor.mutedForeground)
        }
        VStack(alignment: .leading, spacing: 8) {
          ForEach(Array(PriceBundle.services.enumerated()), id: \.element.id) { index, service in
            let included = index < plan.included
            HStack(spacing: 8) {
              service.icon
                .frame(width: 13, height: 13)
                .foregroundStyle(included ? service.foreground : EsuissColor.mutedForeground)
                .frame(width: 22, height: 22)
                .background(included ? service.tint : EsuissColor.secondary, in: RoundedRectangle(cornerRadius: Radius.md, style: .continuous))
              Text(verbatim: index == 3 ? "\(service.name) \(plan.storage)" : service.name)
                .strikethrough(!included)
                .foregroundStyle(included ? EsuissColor.foreground : EsuissColor.mutedForeground)
            }
            .scaledFont(.sm)
            .accessibilityElement(children: .combine)
            .accessibilityValue(included ? Text(verbatim: "") : Text("Not included"))
          }
        }
      }
      .padding(20)
      .foregroundStyle(EsuissColor.foreground)
      .frame(maxWidth: .infinity, alignment: .leading)
      .contentShape(shape)
    }
    .buttonStyle(PriceBundleCardStyle(selected: selected))
    .accessibilityAddTraits(selected ? .isSelected : [])
    .hapticFeedback(.selection, trigger: selected) { _, now in now }
  }
}

private struct PriceBundleCardStyle: ButtonStyle {
  let selected: Bool

  func makeBody(configuration: Configuration) -> some View {
    let shape = RoundedRectangle(cornerRadius: 20, style: .continuous)
    configuration.label
      .background((selected || configuration.isPressed) ? EsuissColor.muted : EsuissColor.muted.opacity(0.6), in: shape)
      .overlay {
        shape.strokeBorder(selected ? EsuissColor.primary : EsuissColor.input, lineWidth: selected ? 2 : 1)
      }
  }
}
