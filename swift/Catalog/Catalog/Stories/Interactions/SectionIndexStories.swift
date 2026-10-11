import EsuissUI
import SwiftUI

enum SectionIndexStories {
  static let group = StoryGroup(.interactions, "Section Index", stories: [
    Story("Default") {
      SectionIndexContacts(height: 520)
    },
    Story("Compact") {
      SectionIndexContacts(height: 256)
    },
  ])
}

private let sectionIndexNames = [
  "Aaron Price", "Abby Chen", "Alex Morgan", "Amira Haddad", "Ben Carter", "Bianca Rossi",
  "Carla Diaz", "Chris Evans", "Cody Brooks", "Dana Scott", "Derek Hale", "Elena Petrova",
  "Ethan Wright", "Fatima Khan", "Felix Wagner", "Grace Kim", "Hana Sato", "Henry Ford",
  "Ivy Turner", "Jack Miller", "Jade Wilson", "Jonas Berg", "Kai Nakamura", "Laura Bell",
  "Leo Martin", "Lina Costa", "Maya Patel", "Mia Novak", "Noah Fischer", "Nora Lind",
  "Omar Aziz", "Paula Silva", "Quinn Avery", "Rosa Lopez", "Ryan Cole", "Sara Ahmed",
  "Sofia Greco", "Tom Baker", "Uma Rao", "Victor Hugo", "Will Jensen", "Yara Nasser",
  "Zoe Adams", "8 Ball Club",
]

private let sectionIndexGroups: [(String, [String])] = {
  var groups: [String: [String]] = [:]
  for name in sectionIndexNames {
    let first = name.prefix(1).uppercased()
    let letter = first.range(of: "^[A-Z]$", options: .regularExpression) != nil ? first : "#"
    groups[letter, default: []].append(name)
  }
  return groups.sorted { lhs, rhs in
    if lhs.key == "#" { return false }
    if rhs.key == "#" { return true }
    return lhs.key < rhs.key
  }
  .map { ($0.key, $0.value) }
}()

private struct SectionIndexContacts: View {
  let height: CGFloat

  @State private var log: LocalizedStringKey = "Tap or drag the letters."

  var body: some View {
    let shape = RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
    VStack(alignment: .leading, spacing: 12) {
      SectionIndex {
        ScrollView {
          LazyVStack(alignment: .leading, spacing: 0, pinnedViews: .sectionHeaders) {
            ForEach(sectionIndexGroups, id: \.0) { entry in
              SectionIndexSection(entry.0) {
                ForEach(Array(entry.1.enumerated()), id: \.element) { index, name in
                  Button {
                    log = "Opened \(name)"
                  } label: {
                    Text(verbatim: name)
                      .textStyle(.base)
                      .foregroundStyle(Color.label)
                      .padding(.vertical, 12)
                      .frame(maxWidth: .infinity, alignment: .leading)
                      .contentShape(Rectangle())
                  }
                  .buttonStyle(SectionIndexRowStyle())
                  .overlay(alignment: .top) {
                    if index > 0 {
                      Color.separator.frame(height: 1)
                    }
                  }
                  .padding(.leading, 16)
                  .padding(.trailing, 40)
                }
              }
            }
          }
        }
        .clipShape(shape)
        .overlay { shape.strokeBorder(Color.separator) }
        SectionIndexBar { letter in
          log = "Jumped to \(letter)"
        }
      }
      .frame(height: height)
      Text(log)
        .textVariant(.muted)
    }
  }
}

private struct SectionIndexRowStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .opacity(configuration.isPressed ? 0.6 : 1)
  }
}
