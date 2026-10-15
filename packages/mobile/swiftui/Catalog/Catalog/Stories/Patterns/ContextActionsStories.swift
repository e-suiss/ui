import EsuissUI
import PhosphorSwift
import SwiftUI

enum ContextActionsStories {
  static let group = StoryGroup(.patterns, "Context Actions", stories: [
    Story("Default") {
      ContextActions {
        ContextActionsLabel("Photo")
        ContextActionsItem("Copy") {}
        ContextActionsItem("Share") {}
        ContextActionsItem("Delete", variant: .destructive) {}
      } label: {
        VStack(spacing: 8) {
          Ph.image.regular
            .frame(width: 32, height: 32)
          Text("Long press")
            .textStyle(.sm)
        }
        .foregroundStyle(EsuissColor.mutedForeground)
        .frame(maxWidth: .infinity)
        .frame(height: 160)
        .background(EsuissColor.muted, in: RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text("Photo"))
      }
    },
    Story("Inline") {
      ContextActions(cancelLabel: "Close") {
        ContextActionsItem("Reply") {}
        ContextActionsItem("Forward") {}
      } label: {
        Text("Hold this message")
          .textStyle(.base)
          .foregroundStyle(EsuissColor.foreground)
          .padding(.horizontal, 12)
          .padding(.vertical, 8)
          .background(EsuissColor.secondary, in: RoundedRectangle(cornerRadius: Radius.lg, style: .continuous))
      }
    },
  ])
}
