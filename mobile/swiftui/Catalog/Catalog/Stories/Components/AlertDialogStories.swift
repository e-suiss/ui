import EsuissUI
import PhosphorSwift
import SwiftUI

enum AlertDialogStories {
  static let group = StoryGroup(.components, "Alert Dialog", stories: [
    Story("Default") {
      AlertDialogDemo(title: "Show dialog", variant: .outline) {
        AlertDialogBody()
      }
    },
    Story("OpenByDefault") {
      AlertDialogDemo(title: "Show dialog", variant: .outline, open: true) {
        AlertDialogBody()
      }
    },
    Story("Small") {
      AlertDialogDemo(title: "Discard draft", variant: .outline) {
        AlertDialogContent(size: .sm) {
          AlertDialogHeader {
            AlertDialogTitle("Discard draft?")
            AlertDialogDescription("Your unsaved message will be lost.")
          }
          AlertDialogFooter {
            AlertDialogCancel("Keep")
            AlertDialogAction("Discard", variant: .destructive)
          }
        }
      }
    },
    Story("WithMedia") {
      AlertDialogDemo(title: "Delete project", variant: .destructive) {
        AlertDialogContent {
          AlertDialogHeader {
            AlertDialogMedia {
              Ph.trash.regular
                .foregroundStyle(Color.danger)
            }
            AlertDialogTitle("Delete this project?")
            AlertDialogDescription(
              "This permanently removes the project and all of its files. This action cannot be undone."
            )
          }
          AlertDialogFooter {
            AlertDialogCancel()
            AlertDialogAction("Delete", variant: .destructive)
          }
        }
      }
    },
    Story("Destructive") {
      AlertDialogDemo(title: "Delete project", variant: .destructive) {
        AlertDialogContent {
          AlertDialogHeader {
            AlertDialogTitle("Delete project?")
            AlertDialogDescription("All deployments and settings for this project will be removed.")
          }
          AlertDialogFooter {
            AlertDialogCancel()
            AlertDialogAction("Delete", variant: .destructive)
          }
        }
      }
    },
  ])
}

private struct AlertDialogDemo<Body: View>: View {
  let title: LocalizedStringKey
  let variant: VariantButtonStyle.Variant
  let content: () -> Body

  @State private var open: Bool

  init(
    title: LocalizedStringKey,
    variant: VariantButtonStyle.Variant,
    open: Bool = false,
    @ViewBuilder content: @escaping () -> Body
  ) {
    self.title = title
    self.variant = variant
    self.content = content
    _open = State(initialValue: open)
  }

  var body: some View {
    Button(title) { open = true }
      .buttonStyle(.variant(variant))
      .alertDialog(isPresented: $open, content: content)
  }
}

private struct AlertDialogBody: View {
  var body: some View {
    AlertDialogContent {
      AlertDialogHeader {
        AlertDialogTitle("Are you absolutely sure?")
        AlertDialogDescription(
          "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
        )
      }
      AlertDialogFooter {
        AlertDialogCancel()
        AlertDialogAction("Continue")
      }
    }
  }
}
