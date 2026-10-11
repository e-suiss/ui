import EsuissUI
import SwiftUI

enum TextStories {
  static let group = StoryGroup(.components, "Text", stories: [
    Story("Default") {
      Text("The quick brown fox jumps over the lazy dog.")
        .textVariant(.default)
    },
    Story("Typography") {
      VStack(alignment: .leading, spacing: 16) {
        Text("Taxing Laughter").textVariant(.h1)
        Text("The People of the Kingdom").textVariant(.h2)
        Text("The Joke Tax").textVariant(.h3)
        Text("People stopped telling jokes").textVariant(.h4)
        Text("The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.")
          .textVariant(.p)
        Text("\"After all,\" he said, \"everyone enjoys a good joke, so it's only fair that they should pay for the privilege.\"")
          .textVariant(.blockquote)
        Text(verbatim: "npx @esuiss/uim add text").textVariant(.code)
        Text("A modal dialog that interrupts the user with important content.").textVariant(.lead)
        Text("Are you absolutely sure?").textVariant(.large)
        Text("Email address").textVariant(.small)
        Text("Enter your email address.").textVariant(.muted)
      }
      .frame(maxWidth: .infinity, alignment: .leading)
    },
    Story("Headings") {
      VStack(alignment: .leading, spacing: 16) {
        Text("Heading 1").textVariant(.h1)
        Text("Heading 2").textVariant(.h2)
        Text("Heading 3").textVariant(.h3)
        Text("Heading 4").textVariant(.h4)
      }
      .frame(maxWidth: .infinity, alignment: .leading)
    },
  ])
}
