import EsuissUI
import PhosphorSwift
import SwiftUI

enum MessageStories {
  static let group = StoryGroup(.components, "Message", stories: [
    Story("Default") {
      Message {
        MessageAvatar {
          Avatar { AvatarFallback("MK") }
        }
        MessageContent {
          Bubble(variant: .muted) {
            BubbleContent("Are we still on for lunch tomorrow?")
          }
        }
      }
    },
    Story("AlignEnd") {
      Message(align: .end) {
        MessageContent {
          Bubble {
            BubbleContent("Yes, see you at noon.")
          }
        }
      }
    },
    Story("WithHeaderAndFooter") {
      Message {
        MessageAvatar {
          Avatar { AvatarFallback("JL") }
        }
        MessageContent {
          MessageHeader(verbatim: "Jordan Lee")
          Bubble(variant: .muted) {
            BubbleContent("I pushed the updated designs to the shared folder.")
          }
          MessageFooter(verbatim: "9:41 AM")
        }
      }
    },
    Story("Conversation") {
      MessageGroup(spacing: 16) {
        Message {
          MessageAvatar {
            Avatar { AvatarFallback("MK") }
          }
          MessageContent {
            Bubble(variant: .muted) {
              BubbleContent("Did the build pass?")
            }
            Bubble(variant: .muted) {
              BubbleContent("I want to ship before the weekend.")
            }
          }
        }
        Message(align: .end) {
          MessageContent {
            Bubble {
              BubbleContent("All green. Merging it now.")
            }
            MessageFooter {
              Ph.checks.regular
                .frame(width: 16, height: 16)
                .foregroundStyle(Color.accent)
              Text("Read 10:02 AM")
            }
          }
        }
      }
    },
  ])
}
