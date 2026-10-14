import EsuissUI
import PhosphorSwift
import SwiftUI

enum AlertStories {
  static let group = StoryGroup(.components, "Alert", stories: [
    Story("Default") {
      InlineAlert(icon: Ph.checkCircle.regular) {
        AlertTitle("Payment successful")
        AlertDescription("Your payment of $29.99 has been processed. A receipt has been sent to your email.")
      }
    },
    Story("Destructive") {
      InlineAlert(.destructive, icon: Ph.warning.regular) {
        AlertTitle("Unable to process payment")
        AlertDescription("Please verify your billing information and try again.")
      }
    },
    Story("TitleOnly") {
      InlineAlert(icon: Ph.info.regular) {
        AlertTitle("Your session will expire in 5 minutes.")
      }
    },
    Story("WithAction") {
      InlineAlert(icon: Ph.info.regular) {
        AlertTitle("New version available")
        AlertDescription("Update now to get the latest features and fixes.")
      } action: {
        Button("Update") {}
          .buttonStyle(.variant(.tinted, size: .sm))
      }
    },
    Story("WithoutIcon") {
      InlineAlert {
        AlertTitle("Heads up")
        AlertDescription("You can add components to your app using the registry.")
      }
    },
  ])
}
