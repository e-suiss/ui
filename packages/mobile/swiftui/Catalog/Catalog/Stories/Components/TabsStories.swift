import EsuissUI
import PhosphorSwift
import SwiftUI

enum TabsStories {
  static let group = StoryGroup(.components, "Tabs", stories: [
    Story("Default") {
      TabsDemo()
    },
    Story("WithIcons") {
      TabsWithIconsDemo()
    },
    Story("DisabledTab") {
      TabsDisabledDemo()
    },
    Story("Line") {
      TabsSectionsDemo(variant: .line)
    },
    Story("Vertical") {
      TabsSectionsDemo(orientation: .vertical)
    },
    Story("VerticalLine") {
      TabsSectionsDemo(variant: .line, orientation: .vertical)
    },
    Story("WithIconsLine") {
      TabsWithIconsDemo(variant: .line)
    },
    Story("DisabledTabLine") {
      TabsDisabledDemo(variant: .line)
    },
  ])
}

private struct TabsDemo: View {
  @State private var value = "account"
  @State private var name = "Pedro Duarte"
  @State private var username = "@peduarte"
  @State private var current = ""
  @State private var next = ""

  var body: some View {
    Tabs(selection: $value) {
      TabsList {
        TabsTrigger("Account", value: "account")
        TabsTrigger("Password", value: "password")
      }
      TabsContent(value: "account") {
        Card {
          CardHeader("Account", description: "Make changes to your account here.")
          CardContent {
            VStack(alignment: .leading, spacing: 16) {
              TabsLabeledField(label: "Name") {
                TextField("Name", text: $name).textFieldStyle(.input)
              }
              TabsLabeledField(label: "Username") {
                TextField("Username", text: $username)
                  .textFieldStyle(.input)
                  .textInputAutocapitalization(.never)
              }
            }
          }
          CardFooter {
            Button("Save changes") {}.buttonStyle(.variant())
          }
        }
      }
      TabsContent(value: "password") {
        Card {
          CardHeader("Password", description: "Change your password here. You will be logged out after saving.")
          CardContent {
            VStack(alignment: .leading, spacing: 16) {
              TabsLabeledField(label: "Current password") {
                SecureField("Current password", text: $current).textFieldStyle(.input)
              }
              TabsLabeledField(label: "New password") {
                SecureField("New password", text: $next).textFieldStyle(.input)
              }
            }
          }
          CardFooter {
            Button("Save password") {}.buttonStyle(.variant())
          }
        }
      }
    }
    .frame(maxWidth: .infinity)
  }
}

private struct TabsLabeledField<Content: View>: View {
  let label: LocalizedStringKey
  @ViewBuilder let content: () -> Content

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      FieldLabel(label)
        .accessibilityHidden(true)
      content()
        .frame(maxWidth: .infinity)
    }
  }
}

private struct TabsPanelText: View {
  let text: LocalizedStringKey

  var body: some View {
    Text(text)
      .textStyle(.sm)
      .foregroundStyle(EsuissColor.mutedForeground)
  }
}

private struct TabsWithIconsDemo: View {
  var variant: TabsListVariant = .default

  @State private var value = "profile"

  var body: some View {
    Tabs(selection: $value) {
      TabsList(variant: variant) {
        TabsTrigger(value: "profile") {
          Label {
            Text("Profile")
          } icon: {
            Ph.user.regular
          }
        }
        TabsTrigger(value: "settings") {
          Label {
            Text("Settings")
          } icon: {
            Ph.gear.regular
          }
        }
      }
      TabsContent(value: "profile") {
        TabsPanelText(text: "Your public profile information.")
      }
      TabsContent(value: "settings") {
        TabsPanelText(text: "Manage your preferences.")
      }
    }
    .frame(maxWidth: .infinity)
  }
}

private struct TabsDisabledDemo: View {
  var variant: TabsListVariant = .default

  @State private var value = "overview"

  var body: some View {
    Tabs(selection: $value) {
      TabsList(variant: variant) {
        TabsTrigger("Overview", value: "overview")
        TabsTrigger("Analytics", value: "analytics")
        TabsTrigger("Reports", value: "reports")
          .disabled(true)
      }
      TabsContent(value: "overview") {
        TabsPanelText(text: "A summary of your activity.")
      }
      TabsContent(value: "analytics") {
        TabsPanelText(text: "Detailed metrics and trends.")
      }
    }
    .frame(maxWidth: .infinity)
  }
}

private struct TabsSectionsDemo: View {
  var variant: TabsListVariant = .default
  var orientation: Axis = .horizontal

  @State private var value = "overview"

  var body: some View {
    Tabs(selection: $value, orientation: orientation) {
      TabsList(variant: variant) {
        TabsTrigger("Overview", value: "overview")
        TabsTrigger("Analytics", value: "analytics")
        TabsTrigger("Reports", value: "reports")
      }
      TabsContent(value: "overview") {
        TabsPanelText(text: "A summary of your activity.")
      }
      TabsContent(value: "analytics") {
        TabsPanelText(text: "Detailed metrics and trends.")
      }
      TabsContent(value: "reports") {
        TabsPanelText(text: "Exported reports and schedules.")
      }
    }
    .frame(maxWidth: .infinity)
  }
}
