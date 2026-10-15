import EsuissUI
import SwiftUI

enum DrawerStories {
  static let group = StoryGroup(.components, "Drawer", stories: [
    Story("Default") {
      DrawerGoal()
    },
    Story("OpenByDefault") {
      DrawerGoal(open: true)
    },
    Story("SnapPoints") {
      DrawerSnapPoints()
    },
  ])
}

private struct DrawerGoal: View {
  @State private var open: Bool

  init(open: Bool = false) {
    _open = State(initialValue: open)
  }

  var body: some View {
    Button("Open drawer") { open = true }
      .buttonStyle(.variant(.outline))
      .drawer(isPresented: $open) {
        DrawerGoalContent()
      }
  }
}

private struct DrawerGoalContent: View {
  var body: some View {
    DrawerContent {
      DrawerHeader {
        DrawerTitle("Move goal")
        DrawerDescription("Set your daily activity goal.")
      }
      VStack(spacing: 4) {
        Text(verbatim: "350")
          .font(.system(size: 48, weight: .semibold))
          .tracking(-1.2)
          .foregroundStyle(EsuissColor.foreground)
        Text("Calories/day")
          .textCase(.uppercase)
          .textStyle(.xs)
          .foregroundStyle(EsuissColor.mutedForeground)
      }
      .frame(maxWidth: .infinity)
      .padding(16)
      DrawerFooter {
        Button {} label: {
          Text("Submit").frame(maxWidth: .infinity)
        }
        .buttonStyle(.variant())
        DrawerClose {
          Text("Cancel").frame(maxWidth: .infinity)
        }
        .buttonStyle(.variant(.secondary))
      }
    }
  }
}

private struct DrawerSnapPoints: View {
  @State private var open = false

  var body: some View {
    Button("Open with snap points") { open = true }
      .buttonStyle(.variant(.outline))
      .drawer(isPresented: $open, detents: [.fraction(0.4), .large]) {
        DrawerContent(showCloseButton: true) {
          DrawerHeader {
            DrawerTitle("Snap points")
            DrawerDescription("Drag up to expand, drag down to collapse or dismiss.")
          }
          ScrollView {
            VStack(spacing: 12) {
              ForEach(1...20, id: \.self) { index in
                Text(verbatim: "Item \(index)")
                  .textStyle(.base)
                  .foregroundStyle(EsuissColor.foreground)
                  .padding(.horizontal, 16)
                  .frame(maxWidth: .infinity, minHeight: 48, alignment: .leading)
                  .background(EsuissColor.muted, in: RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
              }
            }
            .padding(16)
          }
        }
      }
  }
}
