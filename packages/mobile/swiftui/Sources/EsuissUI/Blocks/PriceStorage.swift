import PhosphorSwift
import SwiftUI

public struct PriceStorage: View {
  public enum Period: CaseIterable, Sendable {
    case monthly, yearly
  }

  struct Plan: Identifiable {
    let size: String
    let price: Double
    let features: [String]
    var popular = false

    var id: String { size }
  }

  static var plans: [Plan] {
    [
      Plan(size: "50 GB", price: 0.99, features: ["Space for photos and files", "Private Relay", "Hide My Email"]),
      Plan(size: "200 GB", price: 2.99, features: ["Share with your family", "Custom email domain", "Secure Video for 1 camera"], popular: true),
      Plan(size: "2 TB", price: 9.99, features: ["Everything in 200 GB", "Unlimited Secure Video cameras"]),
      Plan(size: "6 TB", price: 29.99, features: ["Everything in 2 TB", "Room for large archives"]),
    ]
  }

  private var onSelectPlan: ((String, Period) -> Void)?
  private var onPeriodChange: ((Period) -> Void)?
  @State private var period: Period
  @State private var selected: String
  @State private var updated: Bool
  @Environment(\.locale) private var locale
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onSelectPlan: ((_ size: String, _ period: Period) -> Void)? = nil,
    onPeriodChange: ((_ period: Period) -> Void)? = nil
  ) {
    self.init(period: .monthly)
    self.onSelectPlan = onSelectPlan
    self.onPeriodChange = onPeriodChange
  }

  init(period: Period, selected: String = "200 GB", updated: Bool = false) {
    _period = State(initialValue: period)
    _selected = State(initialValue: selected)
    _updated = State(initialValue: updated)
  }

  private func money(_ value: Double) -> String {
    value.formatted(.currency(code: "USD").locale(locale))
  }

  public var body: some View {
    let yearly = period == .yearly
    Screen {
      KeyboardScrollView {
        VStack(spacing: 24) {
          VStack(spacing: 8) {
            Ph.cloud.regular
              .frame(width: 40, height: 40)
              .foregroundStyle(Palette.blue500)
              .accessibilityHidden(true)
            Text("More space with suiss Cloud+.")
              .scaledTextStyle(.xl3, weight: .semibold)
              .multilineTextAlignment(.center)
              .fixedSize(horizontal: false, vertical: true)
              .accessibilityAddTraits(.isHeader)
            ToggleGroup(selection: periodSelection, size: .sm, spacing: 0) {
              ToggleGroupItem("Monthly", value: Period.monthly)
                .frame(minWidth: 120)
              ToggleGroupItem("Yearly · 2 months free", value: Period.yearly)
            }
            .accessibilityLabel(Text("Billing period"))
            .padding(.top, 8)
          }
          RadioGroup(selection: $selected) {
            ForEach(Self.plans) { plan in
              PriceStorageCard(
                plan: plan,
                price: money(yearly ? plan.price * 10 : plan.price),
                yearly: yearly,
                selected: plan.size == selected
              ) {
                selected = plan.size
              }
            }
          }
          .padding(.top, 8)
          .accessibilityElement(children: .contain)
          .accessibilityLabel(Text("Storage plan"))
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 36)
      }
      BottomBar {
        BottomBarContent {
          Button {
            onSelectPlan?(selected, period)
            updated = true
          } label: {
            if updated {
              Text("Your plan is updated")
            } else {
              Text("Switch to \(selected)")
            }
          }
          .buttonStyle(.variant(.default, size: .lg, block: true))
        }
      }
    }
    .animation(reduceMotion ? nil : .spring(response: 0.35, dampingFraction: 0.7), value: selected)
    .onChange(of: selected) { updated = false }
    .animation(reduceMotion ? nil : .easeOut(duration: 0.2), value: period)
  }

  private var periodSelection: Binding<Period?> {
    Binding(
      get: { period },
      set: { value in
        guard let value, value != period else { return }
        period = value
        onPeriodChange?(value)
      }
    )
  }
}

private struct PriceStorageCard: View {
  let plan: PriceStorage.Plan
  let price: String
  let yearly: Bool
  let selected: Bool
  let action: () -> Void

  var body: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
    Button(action: action) {
      VStack(alignment: .leading, spacing: 12) {
        HStack(spacing: 8) {
          Text(verbatim: plan.size)
            .scaledFont(.xl, weight: .semibold)
            .frame(maxWidth: .infinity, alignment: .leading)
          RadioGroupItem(value: plan.size)
            .accessibilityHidden(true)
        }
        HStack(alignment: .firstTextBaseline, spacing: 0) {
          Text(verbatim: price)
            .scaledFont(.xl, weight: .semibold)
            .monospacedDigit()
            .contentTransition(.numericText())
          Text(verbatim: " ")
          Group {
            if yearly {
              Text("/yr")
            } else {
              Text("/mo")
            }
          }
          .scaledFont(.sm)
          .foregroundStyle(EsuissColor.mutedForeground)
        }
        VStack(alignment: .leading, spacing: 6) {
          ForEach(plan.features, id: \.self) { feature in
            HStack(alignment: .firstTextBaseline, spacing: 6) {
              Ph.check.bold
                .frame(width: 13, height: 13)
                .foregroundStyle(Color.adaptive(light: Palette.green600, dark: Palette.green400))
                .alignmentGuide(.firstTextBaseline) { $0[.bottom] - 2 }
              Text(LocalizedStringKey(feature))
                .scaledFont(.sm)
                .fixedSize(horizontal: false, vertical: true)
            }
          }
        }
      }
      .padding(18)
      .foregroundStyle(EsuissColor.foreground)
      .frame(maxWidth: .infinity, alignment: .leading)
      .contentShape(shape)
    }
    .buttonStyle(PriceStorageCardStyle(selected: selected))
    .overlay(alignment: .topLeading) {
      if plan.popular {
        Text("Most popular")
          .scaledFont(.xs, weight: .semibold)
          .foregroundStyle(EsuissColor.primaryForeground)
          .padding(.horizontal, 9)
          .padding(.vertical, 2)
          .background(EsuissColor.primary, in: Capsule())
          .offset(x: 18, y: -9)
          .accessibilityHidden(true)
      }
    }
    .offset(y: selected ? -3 : 0)
    .accessibilityLabel(Text(verbatim: plan.size))
    .accessibilityValue(plan.popular ? Text("Most popular") : Text(verbatim: ""))
    .accessibilityAddTraits(selected ? .isSelected : [])
    .hapticFeedback(.selection, trigger: selected) { _, now in now }
  }
}

private struct PriceStorageCardStyle: ButtonStyle {
  let selected: Bool

  func makeBody(configuration: Configuration) -> some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
    configuration.label
      .background(EsuissColor.muted, in: shape)
      .opacity(configuration.isPressed ? 0.8 : 1)
      .overlay {
        if selected {
          shape.strokeBorder(EsuissColor.primary, lineWidth: 2)
        }
      }
  }
}
