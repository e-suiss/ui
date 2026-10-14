import PhosphorSwift
import SwiftUI

public struct OnboardingPage: Identifiable {
  public let id = UUID()
  let title: Text
  let description: Text
  let illustration: AnyView?

  public init<Illustration: View>(
    _ title: LocalizedStringKey,
    description: LocalizedStringKey,
    @ViewBuilder illustration: () -> Illustration
  ) {
    self.title = Text(title)
    self.description = Text(description)
    self.illustration = AnyView(illustration())
  }

  public init<Illustration: View>(
    verbatim title: String,
    description: String,
    @ViewBuilder illustration: () -> Illustration
  ) {
    self.title = Text(verbatim: title)
    self.description = Text(verbatim: description)
    self.illustration = AnyView(illustration())
  }

  public init(_ title: LocalizedStringKey, description: LocalizedStringKey) {
    self.title = Text(title)
    self.description = Text(description)
    illustration = nil
  }

  public init(verbatim title: String, description: String) {
    self.title = Text(verbatim: title)
    self.description = Text(verbatim: description)
    illustration = nil
  }

  public static var samples: [OnboardingPage] {
    [
      OnboardingPage("Everything in one place", description: "Your accounts, cards and savings together, always up to date.") {
        OnboardingSymbol(icon: Ph.squaresFour.duotone)
      },
      OnboardingPage("Pay in a tap", description: "Send money to friends and pay in stores with a single tap.") {
        OnboardingSymbol(icon: Ph.contactlessPayment.duotone)
      },
      OnboardingPage("Stay in control", description: "Get a notification for every payment and freeze your card any time.") {
        OnboardingSymbol(icon: Ph.bellRinging.duotone)
      },
      OnboardingPage("Safe by design", description: "Face ID, passkeys and end-to-end encryption keep your money yours.") {
        OnboardingSymbol(icon: Ph.shieldCheck.duotone)
      },
    ]
  }
}

private struct OnboardingSymbol: View {
  let icon: Image

  var body: some View {
    icon
      .frame(width: 96, height: 96)
      .foregroundStyle(Color.accent)
      .frame(width: 200, height: 200)
      .background(Color.accentSurface, in: Circle())
  }
}

public struct Onboarding: View {
  let pages: [OnboardingPage]
  let skipLabel: LocalizedStringKey
  let continueLabel: LocalizedStringKey
  let doneLabel: LocalizedStringKey
  let onDone: () -> Void

  @State private var controller = CarouselController()
  private var initialIndex = 0

  public init(
    pages: [OnboardingPage] = OnboardingPage.samples,
    skipLabel: LocalizedStringKey = "Skip",
    continueLabel: LocalizedStringKey = "Continue",
    doneLabel: LocalizedStringKey = "Get started",
    onDone: @escaping () -> Void
  ) {
    self.pages = pages
    self.skipLabel = skipLabel
    self.continueLabel = continueLabel
    self.doneLabel = doneLabel
    self.onDone = onDone
  }

  init(pages: [OnboardingPage], index: Int, onDone: @escaping () -> Void) {
    self.init(pages: pages, onDone: onDone)
    initialIndex = index
  }

  public var body: some View {
    let last = controller.selectedIndex >= pages.count - 1
    Screen {
      Carousel(controller: controller) {
        CarouselContent(spacing: 0) {
          ForEach(pages) { page in
            CarouselItem {
              OnboardingSlide(page: page)
            }
          }
        }
      }
      .frame(maxHeight: .infinity)
      .padding(.top, 24)
      PageIndicator(count: pages.count, index: controller.selectedIndex) { index in
        controller.scrollTo(index)
      }
      .padding(.bottom, 8)
      BottomBar(separator: false) {
        BottomBarContent {
          Button(last ? doneLabel : continueLabel) {
            if last {
              onDone()
            } else {
              controller.scrollNext()
            }
          }
          .buttonStyle(.variant(.default, size: .lg, block: true))
          .contentTransition(.opacity)
          Button(skipLabel, action: onDone)
            .buttonStyle(.variant(.plain, size: .lg, block: true))
            .opacity(last ? 0 : 1)
            .disabled(last)
            .accessibilityHidden(last)
        }
      }
    }
    .task {
      guard initialIndex > 0 else { return }
      try? await Task.sleep(for: .milliseconds(100))
      controller.scrollTo(initialIndex, animated: false)
    }
  }
}

private struct OnboardingSlide: View {
  let page: OnboardingPage

  var body: some View {
    VStack(spacing: 0) {
      Group {
        if let illustration = page.illustration {
          illustration
        } else {
          Color.clear
        }
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity)
      .accessibilityHidden(true)
      VStack(spacing: 12) {
        page.title
          .scaledTextStyle(.xl2, weight: .bold)
          .foregroundStyle(Color.label)
          .accessibilityAddTraits(.isHeader)
        page.description
          .scaledTextStyle(.lg)
          .foregroundStyle(Color.labelSecondary)
      }
      .multilineTextAlignment(.center)
      .fixedSize(horizontal: false, vertical: true)
      .padding(.horizontal, 32)
      .padding(.bottom, 24)
    }
    .accessibilityElement(children: .combine)
  }
}
