import EsuissUI
import PhosphorSwift
import SwiftUI

enum FabStories {
  static let group = StoryGroup(.components, "Fab", stories: [
    Story("Default") {
      FabStage {
        Fab(accessibilityLabel: "New note", action: {}) { Ph.plus.bold }
      }
    },
    Story("Large") {
      FabStage {
        Fab(accessibilityLabel: "Compose", size: .lg, action: {}) { Ph.pencilSimple.bold }
      }
    },
    Story("Extended") {
      FabStage {
        Fab("Compose", action: {}) { Ph.pencilSimple.bold }
      }
    },
    Story("LargeExtended") {
      FabStage {
        Fab("New note", size: .lg, action: {}) { Ph.plus.bold }
      }
    },
    Story("SpeedDialOpen") {
      FabSpeedDial(open: true)
    },
    Story("SpeedDialClosed") {
      FabSpeedDial(open: false)
    },
    Story("Controlled") {
      FabControlled()
    },
  ])
}

private struct FabPage: View {
  var log: String?

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text("Notes")
        .textVariant(.h3)
      Text("The button floats at the bottom end of the screen.")
        .textVariant(.muted)
      if let log, !log.isEmpty {
        Text(verbatim: log)
          .textStyle(.sm)
          .foregroundStyle(EsuissColor.mutedForeground)
          .accessibilityAddTraits(.updatesFrequently)
      }
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}

private struct FabStage<Content: View>: View {
  var log: String?
  @ViewBuilder let content: () -> Content

  var body: some View {
    ZStack(alignment: .topLeading) {
      FabPage(log: log)
      content()
    }
    .containerRelativeFrame(.vertical) { height, _ in max(height - 32, 0) }
  }
}

private struct FabSpeedDial: View {
  @State private var open: Bool
  @State private var log = ""

  init(open: Bool) {
    _open = State(initialValue: open)
  }

  var body: some View {
    FabStage(log: log) {
      Fab(accessibilityLabel: "Create", isExpanded: $open) {
        FabAction("New note", action: { log = "New note" }) { Ph.notePencil.regular }
        FabAction("Take photo", action: { log = "Take photo" }) { Ph.camera.regular }
        FabAction("Add image", action: { log = "Add image" }) { Ph.image.regular }
        FabAction("Scan document", action: { log = "Scan document" }) { Ph.fileText.regular }
      }
    }
  }
}

private struct FabControlled: View {
  @State private var open = true

  var body: some View {
    FabStage(log: open ? "Open" : "Closed") {
      Fab("Create", isExpanded: $open) {
        Ph.pencilSimple.bold
      } actions: {
        FabAction("New note", action: {}) { Ph.notePencil.regular }
        FabAction("Take photo", action: {}) { Ph.camera.regular }
      }
    }
  }
}
