import PhosphorSwift
import SwiftUI

public struct PermissionPrimerBenefit: Identifiable {
  public let id = UUID()
  let icon: Image
  let title: Text
  let description: Text

  public init(icon: Image, title: LocalizedStringKey, description: LocalizedStringKey) {
    self.icon = icon
    self.title = Text(title)
    self.description = Text(description)
  }

  public init(icon: Image, verbatim title: String, description: String) {
    self.icon = icon
    self.title = Text(verbatim: title)
    self.description = Text(verbatim: description)
  }
}

public struct PermissionPrimer: View {
  let icon: Image
  let title: Text
  let description: Text
  let benefits: [PermissionPrimerBenefit]
  let allowLabel: LocalizedStringKey
  let dismissLabel: LocalizedStringKey
  let onAllow: () -> Void
  let onDismiss: () -> Void

  public init(
    icon: Image = Ph.bellRinging.duotone,
    title: LocalizedStringKey = "Turn on notifications",
    description: LocalizedStringKey = "We'll only let you know about things that matter to you. You can change this any time in Settings.",
    benefits: [PermissionPrimerBenefit] = PermissionPrimer.notificationBenefits,
    allowLabel: LocalizedStringKey = "Allow",
    dismissLabel: LocalizedStringKey = "Not now",
    onAllow: @escaping () -> Void,
    onDismiss: @escaping () -> Void
  ) {
    self.icon = icon
    self.title = Text(title)
    self.description = Text(description)
    self.benefits = benefits
    self.allowLabel = allowLabel
    self.dismissLabel = dismissLabel
    self.onAllow = onAllow
    self.onDismiss = onDismiss
  }

  public static var notificationBenefits: [PermissionPrimerBenefit] {
    [
      PermissionPrimerBenefit(
        icon: Ph.creditCard.regular,
        title: "Payments",
        description: "Know the moment money leaves or lands in your account."
      ),
      PermissionPrimerBenefit(
        icon: Ph.shieldCheck.regular,
        title: "Security alerts",
        description: "Hear about new sign-ins and unusual activity right away."
      ),
      PermissionPrimerBenefit(
        icon: Ph.chatCircle.regular,
        title: "Messages",
        description: "Get replies from friends and support without opening the app."
      ),
    ]
  }

  public var body: some View {
    Screen {
      KeyboardScrollView {
        VStack(spacing: 0) {
          icon
            .frame(width: 44, height: 44)
            .foregroundStyle(Color.accent)
            .frame(width: 88, height: 88)
            .background(Color.accentSurface, in: RoundedRectangle(cornerRadius: Radius.xl3, style: .continuous))
            .accessibilityHidden(true)
          title
            .scaledTextStyle(.xl2, weight: .bold)
            .multilineTextAlignment(.center)
            .padding(.top, 24)
            .accessibilityAddTraits(.isHeader)
          description
            .scaledTextStyle(.lg)
            .foregroundStyle(Color.labelSecondary)
            .multilineTextAlignment(.center)
            .padding(.top, 12)
          VStack(alignment: .leading, spacing: 20) {
            ForEach(benefits) { benefit in
              HStack(alignment: .top, spacing: 14) {
                benefit.icon
                  .frame(width: 22, height: 22)
                  .foregroundStyle(Color.accent)
                  .frame(width: 40, height: 40)
                  .background(Color.surfaceSecondary, in: RoundedRectangle(cornerRadius: Radius.lg, style: .continuous))
                  .accessibilityHidden(true)
                VStack(alignment: .leading, spacing: 2) {
                  benefit.title
                    .scaledFont(.base, weight: .semibold)
                  benefit.description
                    .scaledTextStyle(.sm)
                    .foregroundStyle(Color.labelSecondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
              }
              .accessibilityElement(children: .combine)
            }
          }
          .padding(.top, 36)
        }
        .fixedSize(horizontal: false, vertical: true)
        .frame(maxWidth: .infinity)
        .padding(.horizontal, 24)
        .padding(.top, 64)
        .padding(.bottom, 24)
      }
      BottomBar(separator: false) {
        BottomBarContent {
          Button(allowLabel, action: onAllow)
            .buttonStyle(.variant(.default, size: .lg, block: true))
          Button(dismissLabel, action: onDismiss)
            .buttonStyle(.variant(.plain, size: .lg, block: true))
        }
      }
    }
  }
}
