import EsuissUI
import PhosphorSwift
import SwiftUI

enum CollapsibleStories {
  static let group = StoryGroup(.components, "Collapsible", stories: [
    Story("Default") {
      CollapsibleDemo()
    },
    Story("OpenByDefault") {
      CollapsibleDemo(initialOpen: true)
    },
    Story("Disabled") {
      CollapsibleDemo(disabled: true)
    },
  ])
}

private let collapsibleRepositories = ["esuiss/ui", "esuiss/docs", "esuiss/cli"]

private struct CollapsibleDemo: View {
  var disabled = false

  @State private var open: Bool

  init(initialOpen: Bool = false, disabled: Bool = false) {
    self.disabled = disabled
    _open = State(initialValue: initialOpen)
  }

  var body: some View {
    Collapsible(isExpanded: $open, spacing: 8) {
      HStack(spacing: 16) {
        Text("@ademceper starred 3 repositories")
          .textStyle(.sm, weight: .medium)
          .foregroundStyle(EsuissColor.foreground)
          .frame(maxWidth: .infinity, alignment: .leading)
        CollapsibleTrigger {
          Ph.caretUpDown.regular
            .frame(width: 16, height: 16)
        }
        .buttonStyle(.variant(.ghost, size: .iconSm))
        .disabled(disabled)
      }
      .padding(.horizontal, 12)
      CollapsibleRepository(name: collapsibleRepositories[0])
      CollapsibleContent {
        VStack(spacing: 8) {
          ForEach(collapsibleRepositories.dropFirst(), id: \.self) { repository in
            CollapsibleRepository(name: repository)
          }
        }
      }
    }
    .frame(maxWidth: .infinity)
  }
}

private struct CollapsibleRepository: View {
  let name: String

  var body: some View {
    Text(verbatim: name)
      .textStyle(.sm)
      .foregroundStyle(EsuissColor.foreground)
      .padding(.horizontal, 16)
      .padding(.vertical, 8)
      .frame(maxWidth: .infinity, alignment: .leading)
      .background(EsuissColor.muted, in: RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
  }
}
