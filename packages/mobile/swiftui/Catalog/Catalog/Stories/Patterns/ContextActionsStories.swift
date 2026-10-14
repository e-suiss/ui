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
        .foregroundStyle(Color.labelSecondary)
        .frame(maxWidth: .infinity)
        .frame(height: 160)
        .background(Color.surfaceSecondary, in: RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
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
          .foregroundStyle(Color.label)
          .padding(.horizontal, 12)
          .padding(.vertical, 8)
          .background(Color.control, in: RoundedRectangle(cornerRadius: Radius.lg, style: .continuous))
      }
    },
  ])
}
