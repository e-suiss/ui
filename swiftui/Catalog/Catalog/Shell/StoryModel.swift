import SwiftUI

enum StorySection: String, CaseIterable, Identifiable {
  case components = "Components"
  case patterns = "Patterns"
  case interactions = "Interactions"
  case blocks = "Blocks"
  case charts = "Charts"

  var id: String { rawValue }
}

struct Story: Identifiable {
  let exportName: String
  let name: String
  let fullScreen: Bool
  let scrolls: Bool
  let content: () -> AnyView

  var id: String { exportName }

  init<Content: View>(
    _ exportName: String,
    name: String? = nil,
    fullScreen: Bool = false,
    scrolls: Bool = true,
    @ViewBuilder content: @escaping () -> Content
  ) {
    self.exportName = exportName
    self.name = name ?? StoryID.startCase(exportName)
    self.fullScreen = fullScreen
    self.scrolls = scrolls
    self.content = { AnyView(content()) }
  }
}

struct StoryGroup: Identifiable {
  let section: StorySection
  let title: String
  let stories: [Story]

  init(_ section: StorySection, _ title: String, stories: [Story]) {
    self.section = section
    self.title = title
    self.stories = stories
  }

  var id: String { StoryID.sanitize("\(section.rawValue)/\(title)") }

  func storyID(_ story: Story) -> String {
    "\(id)--\(StoryID.sanitize(StoryID.startCase(story.exportName)))"
  }

  func isFullScreen(_ story: Story) -> Bool {
    story.fullScreen || section == .blocks
  }
}

enum StoryID {
  static func sanitize(_ value: String) -> String {
    var result = ""
    var pendingDash = false
    for scalar in value.lowercased().unicodeScalars {
      if ("a"..."z").contains(scalar) || ("0"..."9").contains(scalar) {
        if pendingDash && !result.isEmpty { result.append("-") }
        pendingDash = false
        result.unicodeScalars.append(scalar)
      } else {
        pendingDash = true
      }
    }
    return result
  }

  static func startCase(_ value: String) -> String {
    let characters = Array(value)
    var words: [String] = []
    var current = ""
    for index in characters.indices {
      let character = characters[index]
      guard character.isLetter || character.isNumber else {
        if !current.isEmpty { words.append(current) }
        current = ""
        continue
      }
      if let last = current.last {
        let next = index + 1 < characters.count ? characters[index + 1] : nil
        let boundary =
          (last.isLowercase && character.isUppercase)
          || (last.isLetter && character.isNumber)
          || (last.isNumber && character.isLetter)
          || (last.isUppercase && character.isUppercase && next?.isLowercase == true)
        if boundary {
          words.append(current)
          current = ""
        }
      }
      current.append(character)
    }
    if !current.isEmpty { words.append(current) }
    return words.map { word in
      word.prefix(1).uppercased() + word.dropFirst()
    }
    .joined(separator: " ")
  }
}
