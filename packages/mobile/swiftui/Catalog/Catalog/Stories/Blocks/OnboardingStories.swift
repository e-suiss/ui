import EsuissUI
import PhosphorSwift
import SwiftUI

enum OnboardingStories {
  static let group = StoryGroup(.blocks, "Onboarding", stories: [
    Story("Default") {
      Onboarding(onDone: {})
    },
    Story("CustomPages") {
      Onboarding(
        pages: [
          OnboardingPage("Find your trail", description: "Thousands of routes, sorted by distance and difficulty.") {
            Illustration(icon: Ph.mapTrifold.duotone)
          },
          OnboardingPage("Record every step", description: "Track your hike offline and see your pace as you go.") {
            Illustration(icon: Ph.path.duotone)
          },
          OnboardingPage("Share with friends", description: "Send a route in one tap and plan the next trip together.") {
            Illustration(icon: Ph.shareNetwork.duotone)
          },
        ],
        onDone: {}
      )
    },
    Story("TextOnly") {
      Onboarding(
        pages: [
          OnboardingPage("Welcome", description: "A short tour of what's new in this version."),
          OnboardingPage("Widgets", description: "Add your favorite lists to the Home Screen."),
          OnboardingPage("Shortcuts", description: "Long press the app icon to jump straight to search."),
        ],
        onDone: {}
      )
    },
  ])
}

private struct Illustration: View {
  let icon: Image

  var body: some View {
    icon
      .frame(width: 80, height: 80)
      .foregroundStyle(Palette.green500)
      .frame(width: 160, height: 160)
      .background(EsuissColor.muted, in: RoundedRectangle(cornerRadius: Radius.xl3, style: .continuous))
  }
}
