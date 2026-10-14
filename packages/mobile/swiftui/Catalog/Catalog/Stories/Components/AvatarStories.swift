import EsuissUI
import PhosphorSwift
import SwiftUI

enum AvatarStories {
  static let group = StoryGroup(.components, "Avatar", stories: [
    Story("Default") {
      Avatar(url: URL(string: "https://i.pravatar.cc/150?img=5"), initials: "AL")
        .accessibilityLabel(Text("Ada Lovelace"))
    },
    Story("Fallback") {
      Avatar {
        AvatarFallback("AT")
      }
      .accessibilityLabel(Text("Alan Turing"))
    },
    Story("Sizes") {
      HStack(spacing: 16) {
        ForEach(AvatarSize.allCases, id: \.self) { size in
          Avatar(url: URL(string: "https://i.pravatar.cc/150?img=5"), initials: "AL", size: size)
            .accessibilityLabel(Text("Ada Lovelace"))
        }
      }
    },
    Story("Group") {
      AvatarGroup {
        ForEach(avatarPeople, id: \.name) { person in
          Avatar(url: URL(string: person.uri), initials: person.initials)
            .accessibilityLabel(Text(verbatim: person.name))
        }
        AvatarGroupCount("+4")
          .accessibilityLabel(Text("4 more"))
      }
    },
    Story("WithBadge") {
      HStack(spacing: 16) {
        ForEach(AvatarSize.allCases, id: \.self) { size in
          Avatar(size: size) {
            AvatarFallback("AT")
            AvatarImage(url: URL(string: "https://i.pravatar.cc/150?img=12"))
            AvatarBadge(icon: Ph.check.bold)
          }
          .accessibilityLabel(Text("Alan Turing"))
        }
      }
    },
  ])
}

private struct AvatarPerson {
  let name: String
  let initials: String
  let uri: String
}

private let avatarPeople = [
  AvatarPerson(name: "Ada Lovelace", initials: "AL", uri: "https://i.pravatar.cc/150?img=5"),
  AvatarPerson(name: "Alan Turing", initials: "AT", uri: "https://i.pravatar.cc/150?img=12"),
  AvatarPerson(name: "Grace Hopper", initials: "GH", uri: "https://i.pravatar.cc/150?img=47"),
]
