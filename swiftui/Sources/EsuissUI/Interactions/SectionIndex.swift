import SwiftUI

struct SectionIndexItem: Equatable, Sendable {
  let key: String
  let label: String
}

enum SectionIndexMath {
  static let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".map(String.init) + ["#"]
  static let rowHeight: CGFloat = 16

  static func capacity(height: CGFloat) -> Int {
    max(0, Int(((height - rowHeight) / rowHeight).rounded(.down)))
  }

  static func displayItems(_ letters: [String], capacity: Int) -> [SectionIndexItem] {
    guard capacity < letters.count, letters.count > 1 else {
      return letters.map { SectionIndexItem(key: $0, label: $0) }
    }
    let slots = max(3, capacity % 2 == 0 ? capacity - 1 : capacity)
    func letter(at slot: Int) -> String {
      letters[Int((Double(slot) / Double(slots - 1) * Double(letters.count - 1)).rounded())]
    }
    return (0..<slots).map { slot in
      slot % 2 == 0
        ? SectionIndexItem(key: letter(at: slot), label: letter(at: slot))
        : SectionIndexItem(key: "after-\(letter(at: slot - 1))", label: "•")
    }
  }

  static func index(at y: CGFloat, height: CGFloat, count: Int) -> Int {
    guard count > 0, height > 0 else { return 0 }
    let fraction = min(max(y / height, 0), 0.9999)
    return Int((fraction * CGFloat(count)).rounded(.down))
  }

  static func target(sections: [String], letters: [String], index: Int) -> String? {
    sections.first { value in
      guard let position = letters.firstIndex(of: value) else { return false }
      return position >= index
    } ?? sections.last
  }
}

struct SectionIndexContext: @unchecked Sendable {
  var sections: [String] = []
  var jump: @MainActor @Sendable (String) -> Void = { _ in }
}

extension EnvironmentValues {
  @Entry var sectionIndex = SectionIndexContext()
}

struct SectionIndexSectionsKey: PreferenceKey {
  static var defaultValue: [String] { [] }

  static func reduce(value: inout [String], nextValue: () -> [String]) {
    value.append(contentsOf: nextValue())
  }
}

public struct SectionIndex<Content: View>: View {
  let known: [String]?
  let content: Content

  @State private var sections: [String] = []

  public init(sections: [String]? = nil, @ViewBuilder content: () -> Content) {
    self.known = sections
    self.content = content()
  }

  public var body: some View {
    ScrollViewReader { proxy in
      let context = SectionIndexContext(sections: known ?? sections) { value in
        proxy.scrollTo(value, anchor: .top)
      }
      ZStack(alignment: .trailing) {
        content
      }
      .environment(\.sectionIndex, context)
    }
    .onPreferenceChange(SectionIndexSectionsKey.self) { value in sections = value }
  }
}

public struct SectionIndexSection<Content: View, Header: View>: View {
  let value: String
  let content: Content
  let header: Header

  public init(value: String, @ViewBuilder content: () -> Content, @ViewBuilder header: () -> Header) {
    self.value = value
    self.content = content()
    self.header = header()
  }

  public var body: some View {
    Section {
      content
    } header: {
      header
        .id(value)
        .preference(key: SectionIndexSectionsKey.self, value: [value])
    }
  }
}

extension SectionIndexSection where Header == SectionIndexHeader {
  public init(_ value: String, @ViewBuilder content: () -> Content) {
    self.init(value: value, content: content) { SectionIndexHeader(verbatim: value) }
  }
}

public struct SectionIndexHeader: View {
  let title: Text

  @Environment(\.screenBackground) private var background

  public init(_ title: LocalizedStringKey) {
    self.title = Text(title)
  }

  public init(verbatim title: String) {
    self.title = Text(verbatim: title)
  }

  public var body: some View {
    title
      .scaledFont(.sm, weight: .semibold)
      .foregroundStyle(Color.labelSecondary)
      .padding(.horizontal, 16)
      .padding(.vertical, 6)
      .frame(maxWidth: .infinity, alignment: .leading)
      .background(background.opacity(0.95))
      .accessibilityAddTraits(.isHeader)
  }
}

public struct SectionIndexBar: View {
  let letters: [String]
  let onValueChange: ((String) -> Void)?

  @State private var current = 0
  @State private var drag: SectionIndexDrag?
  @State private var height: CGFloat = 0
  @State private var available: CGFloat = 0
  @Environment(\.sectionIndex) private var sectionIndex

  public init(letters: [String]? = nil, onValueChange: ((String) -> Void)? = nil) {
    self.letters = letters ?? SectionIndexMath.letters
    self.onValueChange = onValueChange
  }

  init(letters: [String]? = nil, dragging index: Int, at y: CGFloat) {
    self.letters = letters ?? SectionIndexMath.letters
    self.onValueChange = nil
    _current = State(initialValue: index)
    _drag = State(initialValue: SectionIndexDrag(index: index, y: y))
  }

  public var body: some View {
    let capacity = available > 0 ? SectionIndexMath.capacity(height: available) : letters.count
    let items = SectionIndexMath.displayItems(letters, capacity: capacity)
    VStack(spacing: 0) {
      ForEach(items, id: \.key) { item in
        Text(verbatim: item.label)
          .font(TextStyle.xs3.font(weight: .semibold))
          .foregroundStyle(Color.link)
          .frame(minWidth: 12, minHeight: SectionIndexMath.rowHeight, maxHeight: SectionIndexMath.rowHeight)
      }
    }
    .padding(.horizontal, 6)
    .onGeometryChange(for: CGFloat.self) { $0.size.height } action: { height = $0 }
    .padding(.leading, 12)
    .contentShape(Rectangle())
    .gesture(
      DragGesture(minimumDistance: 0, coordinateSpace: .local)
        .onChanged { value in track(value.location.y) }
        .onEnded { _ in drag = nil }
    )
    .overlay(alignment: .topLeading) {
      if let drag, letters.indices.contains(drag.index) {
        SectionIndexBubble(letter: letters[drag.index])
          .offset(x: -72, y: drag.y - 28)
          .transition(.scale(scale: 0.5).combined(with: .opacity))
      }
    }
    .animation(.timingCurve(0.32, 0.72, 0, 1, duration: 0.2), value: drag == nil)
    .hapticFeedback(.selection, trigger: drag?.index) { old, new in HapticMoments.lifted(old, new) }
    .frame(maxHeight: .infinity)
    .padding(.vertical, 8)
    .padding(.trailing, 6)
    .onGeometryChange(for: CGFloat.self) { $0.size.height - 16 } action: { available = $0 }
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(Text("Section index"))
    .accessibilityValue(Text(verbatim: letters.indices.contains(current) ? letters[current] : ""))
    .accessibilityAdjustableAction { direction in
      switch direction {
      case .increment: jump(min(current + 1, letters.count - 1))
      case .decrement: jump(max(current - 1, 0))
      @unknown default: break
      }
    }
  }

  private func track(_ y: CGFloat) {
    let index = SectionIndexMath.index(at: y, height: height, count: letters.count)
    let clamped = min(max(y, 0), height)
    let first = drag == nil
    drag = SectionIndexDrag(index: index, y: clamped)
    if index != current || first { jump(index) }
  }

  private func jump(_ index: Int) {
    current = index
    guard let target = SectionIndexMath.target(sections: sectionIndex.sections, letters: letters, index: index) else { return }
    sectionIndex.jump(target)
    if letters.indices.contains(index) { onValueChange?(letters[index]) }
  }
}

struct SectionIndexDrag: Equatable {
  let index: Int
  let y: CGFloat
}

private struct SectionIndexBubble: View {
  let letter: String

  var body: some View {
    Text(verbatim: letter)
      .font(TextStyle.xl2.font(weight: .semibold))
      .foregroundStyle(Color.label)
      .frame(width: 56, height: 56)
      .background(Circle().fill(Color.surfaceRaised).shadow(.lg))
      .overlay(Circle().strokeBorder(Color.separator))
      .allowsHitTesting(false)
      .accessibilityHidden(true)
  }
}
