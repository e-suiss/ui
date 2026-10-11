import EsuissUI
import SwiftUI

enum BubbleStories {
  static let group = StoryGroup(.components, "Bubble", stories: [
    Story("Default") {
      Bubble {
        BubbleContent("Are we still on for lunch tomorrow?")
      }
    },
    Story("Variants") {
      BubbleGroup {
        ForEach(BubbleVariantSample.all, id: \.name) { sample in
          Bubble(variant: sample.variant) {
            BubbleContent(verbatim: "This is a \(sample.name) bubble.")
          }
        }
      }
    },
    Story("Conversation") {
      BubbleGroup {
        Bubble(variant: .muted) {
          BubbleContent("Hey, did you get a chance to review the draft?")
        }
        Bubble(align: .end) {
          BubbleContent("Yes, I left a few comments on the intro.")
        }
        Bubble(align: .end) {
          BubbleContent("Everything else looks great.")
        }
        Bubble(variant: .muted) {
          BubbleContent("Thanks! I will update it this afternoon.")
        }
      }
    },
    Story("WithReactions") {
      BubbleGroup {
        Bubble(variant: .muted) {
          BubbleContent("We just hit 10,000 users!")
          BubbleReactions(verbatim: "🎉 3")
        }
        Bubble(align: .end) {
          BubbleContent("That is amazing news.")
          BubbleReactions(verbatim: "❤️", align: .start)
        }
        Bubble(variant: .secondary) {
          BubbleContent("Reactions can sit on top as well.")
          BubbleReactions(verbatim: "👍 2", side: .top)
        }
      }
    },
    Story("Interactive") {
      Bubble(variant: .outline) {
        BubbleContent(action: {}) {
          Text("Show me the latest release notes")
        }
      }
    },
    Story("LongPressActions") {
      Bubble(variant: .muted) {
        BubbleContent("Hold this message to see its actions.")
          .accessibilityLabel(Text("Message from Maya"))
          .contextActions {
            ContextActionsItem("Reply") {}
            ContextActionsItem("Copy") {}
            ContextActionsItem("Delete", variant: .destructive) {}
          }
      }
    },
  ])
}

private struct BubbleVariantSample {
  let variant: BubbleVariant
  let name: String

  static let all: [BubbleVariantSample] = [
    BubbleVariantSample(variant: .default, name: "default"),
    BubbleVariantSample(variant: .secondary, name: "secondary"),
    BubbleVariantSample(variant: .muted, name: "muted"),
    BubbleVariantSample(variant: .tinted, name: "tinted"),
    BubbleVariantSample(variant: .outline, name: "outline"),
    BubbleVariantSample(variant: .ghost, name: "ghost"),
    BubbleVariantSample(variant: .destructive, name: "destructive"),
  ]
}
