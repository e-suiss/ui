import EsuissUI
import PhosphorSwift
import SwiftUI

enum CardStories {
  static let group = StoryGroup(.components, "Card", stories: [
    Story("Default") {
      CardLoginDemo()
    },
    Story("Small") {
      Card(size: .sm) {
        CardHeader("Team plan", description: "Up to 10 members")
        CardContent {
          Text("Shared workspaces, unlimited projects and priority support.")
            .textStyle(.sm)
        }
      }
    },
    Story("WithAction") {
      Card {
        CardHeader("Notifications", description: "You have 3 unread messages.") {
          Button {} label: {
            Ph.bell.regular
              .frame(width: VariantButtonStyle.Size.icon.iconSize, height: VariantButtonStyle.Size.icon.iconSize)
          }
          .buttonStyle(.variant(.ghost, size: .icon))
          .accessibilityLabel(Text("Notifications"))
        }
        CardContent {
          Text("Your call has been confirmed for tomorrow at 10:00.")
            .textStyle(.sm)
        }
        CardFooter {
          Button("Mark all as read") {}
            .buttonStyle(.variant(block: true))
        }
      }
    },
    Story("WithImage") {
      Card {
        Color.surfaceSecondary
          .aspectRatio(16.0 / 9.0, contentMode: .fit)
          .overlay {
            AsyncImage(url: CardImage.url) { phase in
              if let image = phase.image {
                image.resizable().scaledToFill()
              }
            }
          }
          .clipped()
          .padding(.top, -24)
          .accessibilityHidden(true)
        CardHeader("Mountain retreat", description: "A quiet cabin with a view.")
        CardFooter {
          Button("Book now") {}
            .buttonStyle(.variant(.tinted, block: true))
        }
      }
    },
    Story("Filled") {
      Card(.filled) {
        CardHeader("Storage", description: "42 GB of 128 GB used")
        CardContent {
          Text("Photos and backups take up most of your space.")
            .textStyle(.sm)
            .foregroundStyle(Color.labelSecondary)
        }
      }
    },
  ])
}

private enum CardImage {
  static let url = URL(string: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80")
}

private struct CardLoginDemo: View {
  @State private var email = ""
  @State private var password = ""

  var body: some View {
    Card {
      CardHeader("Login to your account", description: "Enter your email below to login to your account")
      CardContent {
        VStack(alignment: .leading, spacing: 16) {
          VStack(alignment: .leading, spacing: 8) {
            FieldLabel("Email")
              .accessibilityHidden(true)
            TextField("Email", text: $email, prompt: Text(verbatim: "m@example.com"))
              .textFieldStyle(.input)
              .keyboardType(.emailAddress)
              .textInputAutocapitalization(.never)
          }
          VStack(alignment: .leading, spacing: 8) {
            FieldLabel("Password")
              .accessibilityHidden(true)
            SecureField("Password", text: $password, prompt: Text(verbatim: ""))
              .textFieldStyle(.input)
          }
        }
      }
      CardFooter {
        VStack(spacing: 8) {
          Button("Login") {}
            .buttonStyle(.variant(block: true))
          Button("Login with Google") {}
            .buttonStyle(.variant(.secondary, block: true))
        }
      }
    }
  }
}
