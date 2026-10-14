import EsuissUI
import SwiftUI

enum AccordionStories {
  static let group = StoryGroup(.components, "Accordion", stories: [
    Story("Default") {
      Accordion {
        AccordionItems()
      }
    },
    Story("Filled") {
      Accordion(.filled) {
        AccordionItems()
      }
    },
    Story("OpenByDefault") {
      AccordionDemo(initial: ["item-2"], multiple: false)
    },
    Story("Multiple") {
      AccordionDemo(initial: ["item-1", "item-3"], multiple: true)
    },
  ])
}

private struct AccordionEntry: Identifiable {
  let value: String
  let title: LocalizedStringKey
  let content: LocalizedStringKey

  var id: String { value }
}

private let accordionEntries = [
  AccordionEntry(value: "item-1", title: "Is it accessible?", content: "Yes. It works with VoiceOver and TalkBack."),
  AccordionEntry(
    value: "item-2",
    title: "Is it styled?",
    content: "Yes. It comes with default styles that match the other components."
  ),
  AccordionEntry(value: "item-3", title: "Is it animated?", content: "Yes. It animates open and closed by default."),
]

private struct AccordionItems: View {
  var body: some View {
    ForEach(accordionEntries) { entry in
      AccordionItem(entry.title, value: entry.value) {
        Text(entry.content)
      }
    }
  }
}

private struct AccordionDemo: View {
  let multiple: Bool

  @State private var expanded: Set<String>

  init(initial: Set<String>, multiple: Bool) {
    self.multiple = multiple
    _expanded = State(initialValue: initial)
  }

  var body: some View {
    Accordion(expanded: $expanded, multiple: multiple) {
      AccordionItems()
    }
  }
}
