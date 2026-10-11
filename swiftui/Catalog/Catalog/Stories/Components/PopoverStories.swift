import EsuissUI
import SwiftUI

enum PopoverStories {
  static let group = StoryGroup(.components, "Popover", stories: [
    Story("Default") {
      PopoverDimensions(open: false)
    },
    Story("Sides") {
      VStack(spacing: 16) {
        PopoverSide(title: "Top", edge: .top)
        PopoverSide(title: "Right", edge: .trailing)
        PopoverSide(title: "Bottom", edge: .bottom)
        PopoverSide(title: "Left", edge: .leading)
      }
      .padding(.vertical, 96)
      .frame(maxWidth: .infinity)
    },
    Story("Simple") {
      PopoverSimple()
    },
    Story("OpenByDefault") {
      PopoverDimensions(open: true)
    },
    Story("DetachedTriggers") {
      PopoverDetached()
    },
  ])
}

private struct PopoverDimensions: View {
  @State private var open: Bool

  init(open: Bool) {
    _open = State(initialValue: open)
  }

  var body: some View {
    Button("Open popover") { open = true }
      .buttonStyle(.variant(.outline))
      .popover(isPresented: $open) {
        PopoverContent(width: 320) {
          PopoverHeader {
            PopoverTitle("Dimensions")
            PopoverDescription("Set the dimensions for the layer.")
          }
          VStack(spacing: 8) {
            PopoverDimensionRow(label: "Width", value: "100%")
            PopoverDimensionRow(label: "Max. width", value: "300px")
            PopoverDimensionRow(label: "Height", value: "25px")
          }
        }
      }
  }
}

private struct PopoverDimensionRow: View {
  let label: String

  @State private var value: String

  init(label: String, value: String) {
    self.label = label
    _value = State(initialValue: value)
  }

  var body: some View {
    HStack(spacing: 16) {
      FieldLabel(label)
        .frame(width: 96, alignment: .leading)
        .accessibilityHidden(true)
      TextField(label, text: $value)
        .textFieldStyle(.input(size: .sm))
        .accessibilityLabel(Text(label))
    }
  }
}

private struct PopoverSide: View {
  let title: String
  let edge: Edge

  @State private var open = false

  var body: some View {
    Button(title) { open = true }
      .buttonStyle(.variant(.outline))
      .popover(isPresented: $open, arrowEdge: edge) {
        PopoverContent(width: 224) {
          Text(verbatim: "Popover on the \(title.lowercased()).")
            .textStyle(.sm)
        }
      }
  }
}

private struct PopoverSimple: View {
  @State private var open = false

  var body: some View {
    Button("Info") { open = true }
      .buttonStyle(.variant())
      .popover(isPresented: $open) {
        PopoverContent(width: 256) {
          Text("Popovers display rich content next to a trigger.")
            .textStyle(.sm)
        }
      }
  }
}

private struct PopoverMember: Identifiable {
  let id: String
  let name: String
  let role: String
}

private struct PopoverDetached: View {
  private static let members = [
    PopoverMember(id: "ada", name: "Ada", role: "Design lead"),
    PopoverMember(id: "linus", name: "Linus", role: "Platform engineer"),
    PopoverMember(id: "grace", name: "Grace", role: "Product manager"),
  ]

  @State private var openID: String?

  var body: some View {
    HStack(alignment: .top, spacing: 8) {
      ForEach(Self.members) { member in
        Button(member.name) { openID = member.id }
          .buttonStyle(.variant(.outline))
          .popover(isPresented: binding(member.id)) {
            PopoverContent(width: nil) {
              PopoverHeader {
                PopoverTitle(LocalizedStringKey(member.name))
                PopoverDescription(LocalizedStringKey(member.role))
              }
            }
          }
      }
    }
  }

  private func binding(_ id: String) -> Binding<Bool> {
    Binding {
      openID == id
    } set: { open in
      if !open, openID == id { openID = nil }
    }
  }
}
