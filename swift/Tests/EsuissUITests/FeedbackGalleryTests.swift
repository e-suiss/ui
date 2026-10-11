import PhosphorSwift
import SwiftUI
import XCTest

@testable import EsuissUI

private struct Note: Identifiable, Hashable {
  let id: String
  let title: String
  let preview: String
}

private let notes = [
  Note(id: "groceries", title: "Groceries", preview: "Milk, eggs, bread, coffee"),
  Note(id: "trip", title: "Trip ideas", preview: "Lisbon, Porto, the coast road"),
  Note(id: "books", title: "Book list", preview: "Three novels for the summer"),
  Note(id: "meeting", title: "Meeting notes", preview: "Ship the beta on Friday"),
  Note(id: "gifts", title: "Gift ideas", preview: "Headphones, a plant, a scarf"),
  Note(id: "recipes", title: "Recipes", preview: "Lemon pasta and a quick curry"),
  Note(id: "workout", title: "Workout plan", preview: "Run on Monday, swim on Thursday"),
  Note(id: "garden", title: "Garden", preview: "Plant tomatoes after the frost"),
]

private struct Topic: Identifiable {
  let id: Int
  let title: String
  let replies: Int
}

private let subjects = ["Release planning", "Design review", "Bug triage", "Onboarding", "Roadmap"]
private let topics = (0..<23).map { index in
  Topic(id: index, title: "\(subjects[index % subjects.count]) · thread \(index + 1)", replies: (index * 7) % 30)
}

private struct Caption: View {
  let text: String

  var body: some View {
    Text(verbatim: text)
      .font(TextStyle.xs.font(weight: .semibold))
      .foregroundStyle(Color.labelSecondary)
  }
}

private struct NoteRow: View {
  let note: Note

  var body: some View {
    VStack(alignment: .leading, spacing: 2) {
      Text(verbatim: note.title)
        .font(TextStyle.base.font(weight: .semibold))
        .foregroundStyle(Color.label)
        .lineLimit(1)
      Text(verbatim: note.preview)
        .font(TextStyle.sm.font())
        .foregroundStyle(Color.labelSecondary)
        .lineLimit(1)
    }
    .padding(.horizontal, 16)
    .padding(.vertical, 10)
    .frame(maxWidth: .infinity, alignment: .leading)
    .overlay(alignment: .bottom) {
      Color.separator.frame(height: 1).padding(.leading, 16)
    }
  }
}

private struct FeedbackBackdrop: View {
  var body: some View {
    Color.surface
      .overlay(alignment: .top) {
        VStack(alignment: .leading, spacing: 12) {
          ForEach(0..<14) { _ in
            RoundedRectangle(cornerRadius: Radius.md).fill(Color.surfaceSecondary).frame(height: 40)
          }
        }
        .padding(16)
      }
      .clipped()
  }
}

private struct ButtonGroupGallery: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      Caption(text: "Default")
      ButtonGroup {
        Button {} label: { Ph.arrowLeft.regular.frame(width: 16, height: 16) }
          .buttonStyle(.variant(.secondary, size: .icon))
        Button("Archive") {}.buttonStyle(.variant(.secondary))
        Button("Report") {}.buttonStyle(.variant(.secondary))
        Button("Snooze") {}.buttonStyle(.variant(.secondary))
        Button {} label: { Ph.dotsThree.bold.frame(width: 16, height: 16) }
          .buttonStyle(.variant(.secondary, size: .icon))
      }
      Caption(text: "Outline")
      ButtonGroup {
        Button {} label: { Ph.arrowLeft.regular.frame(width: 16, height: 16) }
          .buttonStyle(.variant(.outline, size: .icon))
        Button("Archive") {}.buttonStyle(.variant(.outline))
        Button("Report") {}.buttonStyle(.variant(.outline))
        Button("Snooze") {}.buttonStyle(.variant(.outline))
        Button {} label: { Ph.dotsThree.bold.frame(width: 16, height: 16) }
          .buttonStyle(.variant(.outline, size: .icon))
      }
      Caption(text: "Separator and text")
      ButtonGroup {
        Button("Copy") {}.buttonStyle(.variant(.secondary))
        ButtonGroupSeparator()
        Button("Paste") {}.buttonStyle(.variant(.secondary))
        ButtonGroupSeparator()
        Button("Cut") {}.buttonStyle(.variant(.secondary))
      }
      ButtonGroup {
        ButtonGroupText(verbatim: "https://")
        Button("Open") {}.buttonStyle(.variant(.outline))
        Button {} label: { Ph.copy.regular.frame(width: 16, height: 16) }
          .buttonStyle(.variant(.outline, size: .icon))
      }
      Caption(text: "Sizes")
      ForEach([VariantButtonStyle.Size.sm, .default, .lg], id: \.self) { size in
        ButtonGroup {
          Button("Small") {}.buttonStyle(.variant(.outline, size: size))
          Button("Button") {}.buttonStyle(.variant(.outline, size: size))
          Button("Group") {}.buttonStyle(.variant(.outline, size: size))
          Button {} label: { Ph.plus.regular.frame(width: 16, height: 16) }
            .buttonStyle(.variant(.outline, size: size == .sm ? .iconSm : size == .lg ? .iconLg : .icon))
        }
      }
      Caption(text: "Nested and ghost")
      ButtonGroup {
        ButtonGroup {
          Button("1") {}.buttonStyle(.variant(.outline, size: .sm))
          Button("2") {}.buttonStyle(.variant(.outline, size: .sm))
          Button("3") {}.buttonStyle(.variant(.outline, size: .sm))
        }
        ButtonGroup {
          Button {} label: { Ph.arrowLeft.regular.frame(width: 16, height: 16) }
            .buttonStyle(.variant(.outline, size: .iconSm))
          Button {} label: { Ph.arrowRight.regular.frame(width: 16, height: 16) }
            .buttonStyle(.variant(.outline, size: .iconSm))
        }
        ButtonGroup {
          Button {} label: { Ph.dotsThree.bold.frame(width: 16, height: 16) }
            .buttonStyle(.variant(.ghost, size: .iconSm))
        }
      }
      Caption(text: "Vertical")
      HStack(alignment: .top, spacing: 24) {
        ButtonGroup(orientation: .vertical) {
          Button {} label: { Ph.plus.regular.frame(width: 16, height: 16) }
            .buttonStyle(.variant(.secondary, size: .icon))
          ButtonGroupSeparator(.horizontal)
          Button {} label: { Ph.minus.regular.frame(width: 16, height: 16) }
            .buttonStyle(.variant(.secondary, size: .icon))
        }
        ButtonGroup(orientation: .vertical) {
          Button("Top") {}.buttonStyle(.variant(.outline))
          Button("Middle") {}.buttonStyle(.variant(.outline))
          Button("Bottom") {}.buttonStyle(.variant(.outline))
        }
        ButtonGroup(orientation: .vertical) {
          Button("Archive") {}.buttonStyle(.variant(.secondary))
          Button("Report") {}.buttonStyle(.variant(.secondary))
        }
        .disabled(true)
      }
    }
  }
}

private struct SelectionStage: View {
  let editing: Bool
  let selection: Set<String>

  @State private var isEditing: Bool
  @State private var selected: Set<String>

  init(editing: Bool, selection: Set<String>) {
    self.editing = editing
    self.selection = selection
    _isEditing = State(initialValue: editing)
    _selected = State(initialValue: selection)
  }

  var body: some View {
    SelectionList(isEditing: $isEditing, selection: $selected) {
      VStack(spacing: 0) {
        HStack {
          Text(verbatim: "Notes")
            .font(TextStyle.xl2.font(weight: .bold))
            .foregroundStyle(Color.label)
          Spacer()
          SelectionListTrigger()
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
        ForEach(notes.prefix(6)) { note in
          SelectionListItem(value: note.id) {
            NoteRow(note: note)
          }
        }
        Spacer(minLength: 0)
      }
      .frame(width: 402, height: 520, alignment: .top)
      .background(Color.surface)
      .overlay(alignment: .bottom) {
        SelectionListBar { list in
          Button(list.count == list.total ? "Deselect all" : "Select all") {
            if list.count == list.total { list.clear() } else { list.selectAll() }
          }
          .buttonStyle(.variant(.plain))
          SelectionListCount()
          Button {} label: { Ph.trash.regular.frame(width: 20, height: 20) }
            .buttonStyle(.variant(.ghost, size: .icon))
            .disabled(list.count == 0)
        }
      }
    }
  }
}

private struct SelectionGallery: View {
  var body: some View {
    VStack(spacing: 1) {
      SelectionStage(editing: false, selection: [])
      SelectionStage(editing: true, selection: [])
      SelectionStage(editing: true, selection: ["trip", "meeting"])
    }
    .background(Color.separator)
  }
}

private struct ActionBarMenus: View {
  var body: some View {
    ActionBarMenu("File") {
      ActionBarItem("New tab") {}
      ActionBarItem("New window") {}
      ActionBarItem("New incognito window") {}.disabled(true)
      ActionBarSeparator()
      ActionBarItem("Print") {}
    }
    ActionBarMenu("Edit") {
      ActionBarItem("Cut", icon: Ph.scissors.regular) {}
      ActionBarItem("Copy", icon: Ph.copy.regular) {}
      ActionBarItem("Paste", icon: Ph.clipboardText.regular) {}
      ActionBarSeparator()
      ActionBarItem("Delete", icon: Ph.trash.regular, variant: .destructive) {}
    }
    ActionBarMenu("View") {
      ActionBarLabel("Appearance")
      ActionBarItem("Zoom in") {}
      ActionBarItem("Zoom out") {}
      ActionBarItem("Actual size") {}
    }
    ActionBarMenu("Disabled") {
      ActionBarItem("Nothing") {}
    }
    .disabled(true)
  }
}

private struct ActionBarGallery: View {
  private var rowContext: ActionBarContext {
    ActionBarContext(part: .row, dismissible: true, cancelLabel: "Cancel", open: { _ in }, present: { _ in })
  }

  var body: some View {
    VStack(alignment: .leading, spacing: 0) {
      VStack(alignment: .leading, spacing: 12) {
        Caption(text: "Compact")
        HStack {
          Text(verbatim: "Document")
            .font(TextStyle.lg.font(weight: .semibold))
            .foregroundStyle(Color.label)
          ActionBar { ActionBarMenus() }
        }
        Caption(text: "Regular")
        ActionBar { ActionBarMenus() }
          .environment(\.patternCompact, false)
      }
      .padding(16)
      ZStack(alignment: .bottom) {
        FeedbackBackdrop()
        Color.scrim
        DrawerContent {
          ActionBarRows {
            ActionBarMenus().environment(\.actionBar, rowContext)
          }
        }
        .environment(\.drawerFitsContent, true)
        .clipShape(UnevenRoundedRectangle(topLeadingRadius: Radius.xl3, topTrailingRadius: Radius.xl3, style: .continuous))
      }
      .frame(width: 402, height: 320)
      .clipped()
      ZStack(alignment: .bottom) {
        FeedbackBackdrop()
        Color.scrim
        ActionSheetBody(cancelLabel: "Cancel") {
          ActionBarItem("Cut", icon: Ph.scissors.regular) {}
          ActionBarItem("Copy", icon: Ph.copy.regular) {}
          ActionBarItem("Paste", icon: Ph.clipboardText.regular) {}
          ActionBarSeparator()
          ActionBarItem("Delete", icon: Ph.trash.regular, variant: .destructive) {}
        }
      }
      .frame(width: 402, height: 380)
      .clipped()
      ZStack(alignment: .bottom) {
        FeedbackBackdrop()
        Color.scrim
        ActionSheetBody(cancelLabel: "Close") {
          ActionBarLabel("Appearance")
          ActionBarItem("Zoom in") {}
          ActionBarItem("Zoom out") {}
          ActionBarItem("Actual size") {}
        }
      }
      .frame(width: 402, height: 380)
      .clipped()
    }
    .frame(width: 402, alignment: .leading)
  }
}

private struct UndoGallery: View {
  let first: UndoBarManager
  let second: UndoBarManager

  var body: some View {
    VStack(alignment: .leading, spacing: 0) {
      HStack(spacing: 16) {
        ForEach([0.0, 0.35, 0.7, 1.0], id: \.self) { value in
          UndoBarRing(progress: value)
        }
      }
      .padding(16)
      ZStack(alignment: .bottom) {
        VStack(spacing: 0) {
          ForEach(notes.prefix(5)) { note in
            NoteRow(note: note)
          }
          Spacer(minLength: 0)
        }
        .background(Color.surface)
        if let entry = first.entry {
          UndoBarView(manager: first, entry: entry)
        }
      }
      .frame(width: 402, height: 340)
      .clipped()
      ZStack(alignment: .bottom) {
        FeedbackBackdrop()
        if let entry = second.entry {
          UndoBarView(manager: second, entry: entry)
        }
      }
      .frame(width: 402, height: 200)
      .clipped()
    }
    .frame(width: 402, alignment: .leading)
  }
}

private struct TipGallery: View {
  let storage: InMemoryTipStorage

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      Caption(text: "Card")
      Tip(id: "notes-pin", storage: storage) {
        TipCard {
          TipIcon { Ph.pushPin.duotone }
          TipContent {
            TipTitle("Pin your favorites")
            TipDescription("Swipe right on a note to keep it at the top of the list.")
          }
          TipClose()
        }
      }
      Caption(text: "Card without close")
      Tip(id: "notes-share", storage: storage) {
        TipCard {
          TipIcon { Ph.shareNetwork.duotone }
          TipContent {
            TipTitle("Share a list")
            TipDescription("Send any note to friends from the share menu.")
          }
        }
      }
      Caption(text: "Group: only the first unread tip shows")
      TipGroup(storage: storage) {
        VStack(alignment: .leading, spacing: 12) {
          Tip(id: "group-first") {
            TipCard {
              TipIcon { Ph.notePencil.duotone }
              TipContent {
                TipTitle("Start a note fast")
                TipDescription("Tap the pencil any time to begin a new note.")
              }
              TipClose()
            }
          }
          Tip(id: "group-second") {
            TipCard {
              TipIcon { Ph.pushPin.duotone }
              TipContent {
                TipTitle("Second tip")
                TipDescription("Shows after the first one is dismissed.")
              }
              TipClose()
            }
          }
          Text(verbatim: "List content")
            .font(TextStyle.sm.font())
            .foregroundStyle(Color.labelSecondary)
        }
      }
      Caption(text: "Popover")
      ZStack(alignment: .topTrailing) {
        FeedbackBackdrop()
        VStack(alignment: .trailing, spacing: 10) {
          Button {} label: { Ph.notePencil.regular.frame(width: 22, height: 22) }
            .buttonStyle(.variant(.plain, size: .icon))
          Tip(id: "notes-compose", storage: storage) {
            TipPopoverSurface {
              TipIcon { Ph.notePencil.duotone }
              TipContent {
                TipTitle("Start a note fast")
                TipDescription("Tap here any time to begin a new note.")
              }
              TipClose()
            }
            .background {
              RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
                .fill(Color.surfaceRaised)
                .shadow(Shadow(color: .black.opacity(0.14), radius: 12, y: 12))
            }
          }
        }
        .padding(16)
      }
      .frame(width: 370, height: 230)
      .clipShape(RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
    }
  }
}

private struct SearchStage: View {
  @State var query: String
  let height: CGFloat
  var count = notes.count

  var body: some View {
    SearchReveal {
      SearchRevealField(text: $query, placeholder: "Search notes")
      SearchRevealContent {
        ForEach(notes.prefix(count).filter { query.isEmpty || $0.title.localizedCaseInsensitiveContains(query) }) { note in
          NoteRow(note: note)
        }
      }
    }
    .frame(width: 402, height: height)
    .background(Color.surface)
  }
}

private struct SearchGallery: View {
  var body: some View {
    VStack(spacing: 1) {
      SearchStage(query: "", height: 300)
      SearchStage(query: "", height: 300, count: 2)
      SearchStage(query: "ide", height: 300)
    }
    .background(Color.separator)
  }
}

private struct PagedGallery: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      Caption(text: "Load more button")
      PagedList(topics, pageSize: 4, loadsOnEndReached: false) { topic, _ in
        topicRow(topic)
      }
      Caption(text: "Single page")
      PagedList(Array(topics.prefix(3)), pageSize: 4) { topic, _ in
        topicRow(topic)
      }
      Caption(text: "Loads on end reached")
      ScrollView {
        PagedList(topics, pageSize: 3, loadMoreLabel: nil) { topic, _ in
          topicRow(topic)
        }
      }
      .frame(height: 220)
    }
  }

  private func topicRow(_ topic: Topic) -> some View {
    HStack(spacing: 12) {
      Ph.chatCircle.regular
        .frame(width: 20, height: 20)
        .foregroundStyle(Color.labelSecondary)
      Text(verbatim: topic.title)
        .font(TextStyle.base.font())
        .foregroundStyle(Color.label)
        .lineLimit(1)
        .frame(maxWidth: .infinity, alignment: .leading)
      Text(verbatim: "\(topic.replies)")
        .font(TextStyle.sm.font())
        .monospacedDigit()
        .foregroundStyle(Color.labelSecondary)
    }
    .padding(.vertical, 10)
    .overlay(alignment: .bottom) { Color.separator.frame(height: 1) }
  }
}

@MainActor
private final class Recorder {
  var items: [String] = []

  func add(_ item: String) {
    items.append(item)
  }
}

@MainActor
final class FeedbackGalleryTests: XCTestCase {
  private func render<V: View>(_ view: V, name: String, padding: CGFloat = 16) throws {
    let output = ProcessInfo.processInfo.environment["GALLERY_OUTPUT"] ?? NSTemporaryDirectory()
    for scheme in [ColorScheme.light, .dark] {
      let renderer = ImageRenderer(content: view
        .padding(padding)
        .frame(width: 402, alignment: .leading)
        .background(Color.surface)
        .environment(\.colorScheme, scheme)
        .environment(\.locale, Locale(identifier: "en_US")))
      renderer.scale = 3
      let data = try XCTUnwrap(renderer.uiImage?.pngData())
      let file = "\(name)-\(scheme == .dark ? "dark" : "light").png"
      try data.write(to: URL(fileURLWithPath: output).appendingPathComponent(file))
    }
  }

  private func snapshot<V: View>(_ view: V, name: String, padding: CGFloat = 16) throws {
    let output = ProcessInfo.processInfo.environment["GALLERY_OUTPUT"] ?? NSTemporaryDirectory()
    for scheme in [ColorScheme.light, .dark] {
      let host = UIHostingController(rootView: view
        .padding(padding)
        .frame(width: 402, alignment: .leading)
        .background(Color.surface)
        .environment(\.locale, Locale(identifier: "en_US")))
      host.safeAreaRegions = []
      let initial = host.sizeThatFits(in: CGSize(width: 402, height: CGFloat.greatestFiniteMagnitude))
      let scene = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }.first
      let window = scene.map { UIWindow(windowScene: $0) } ?? UIWindow()
      window.frame = CGRect(origin: .zero, size: initial)
      window.overrideUserInterfaceStyle = scheme == .dark ? .dark : .light
      window.rootViewController = host
      window.makeKeyAndVisible()
      host.view.frame = window.bounds
      host.view.layoutIfNeeded()
      RunLoop.main.run(until: Date().addingTimeInterval(0.8))
      let size = host.sizeThatFits(in: CGSize(width: 402, height: CGFloat.greatestFiniteMagnitude))
      window.frame = CGRect(origin: .zero, size: size)
      host.view.frame = window.bounds
      host.view.layoutIfNeeded()
      RunLoop.main.run(until: Date().addingTimeInterval(0.3))
      let format = UIGraphicsImageRendererFormat()
      format.scale = 3
      let image = UIGraphicsImageRenderer(size: size, format: format).image {
        host.view.layer.render(in: $0.cgContext)
      }
      window.isHidden = true
      let data = try XCTUnwrap(image.pngData())
      let file = "\(name)-\(scheme == .dark ? "dark" : "light").png"
      try data.write(to: URL(fileURLWithPath: output).appendingPathComponent(file))
    }
  }

  func testRendersButtonGroupGallery() throws {
    try render(ButtonGroupGallery(), name: "feedback-button-group")
  }

  func testRendersSelectionListGallery() throws {
    try render(SelectionGallery(), name: "feedback-selection-list", padding: 0)
  }

  func testRendersActionBarGallery() throws {
    try render(ActionBarGallery(), name: "feedback-action-bar", padding: 0)
  }

  func testRendersUndoBarGallery() throws {
    let first = UndoBarManager()
    first.show("“Groceries” deleted", onUndo: {})
    first.pause()
    let second = UndoBarManager()
    second.show("“A very long note title that does not fit in the bar” deleted", actionLabel: "Restore", onUndo: {})
    second.pause()
    try render(UndoGallery(first: first, second: second), name: "feedback-undo-bar", padding: 0)
  }

  func testRendersTipGallery() throws {
    try snapshot(TipGallery(storage: InMemoryTipStorage()), name: "feedback-tip")
  }

  func testRendersSearchRevealGallery() throws {
    try snapshot(SearchGallery(), name: "feedback-search-reveal", padding: 0)
  }

  func testRendersPagedListGallery() throws {
    try snapshot(PagedGallery(), name: "feedback-paged-list")
  }

  func testSelectionModelTogglesSelectsAllAndClearsOnDone() {
    var model = SelectionModel<String>(order: ["a", "b", "c"])
    model.setEditing(true)
    model.toggle("b")
    model.toggle("c")
    XCTAssertEqual(model.selected, ["b", "c"])
    model.toggle("b")
    XCTAssertEqual(model.selected, ["c"])
    model.selectAll()
    XCTAssertEqual(model.selected, ["a", "b", "c"])
    model.clear()
    XCTAssertTrue(model.selected.isEmpty)
    model.toggle("a")
    model.setEditing(false)
    XCTAssertFalse(model.editing)
    XCTAssertTrue(model.selected.isEmpty)
  }

  func testUndoBarCommitsAfterTimeout() async throws {
    let manager = UndoBarManager()
    manager.timeout = .milliseconds(300)
    let log = Recorder()
    manager.show("Deleted", onUndo: { log.add("undo") }, onCommit: { log.add("commit") })
    XCTAssertNotNil(manager.entry)
    try await Task.sleep(for: .milliseconds(150))
    XCTAssertNotNil(manager.entry)
    XCTAssertGreaterThan(manager.progress(at: Date()), 0.3)
    try await Task.sleep(for: .milliseconds(350))
    XCTAssertNil(manager.entry)
    XCTAssertEqual(log.items, ["commit"])
  }

  func testUndoBarUndoReplaceAndPause() async throws {
    let manager = UndoBarManager()
    manager.timeout = .milliseconds(250)
    let log = Recorder()
    manager.show("First", onUndo: { log.add("undo 1") }, onCommit: { log.add("commit 1") })
    manager.show("Second", onUndo: { log.add("undo 2") }, onCommit: { log.add("commit 2") })
    XCTAssertEqual(log.items, ["commit 1"])
    manager.undo()
    XCTAssertEqual(log.items, ["commit 1", "undo 2"])
    XCTAssertNil(manager.entry)
    manager.show("Third", onUndo: { log.add("undo 3") }, onCommit: { log.add("commit 3") })
    manager.pause()
    try await Task.sleep(for: .milliseconds(400))
    XCTAssertNotNil(manager.entry)
    manager.resume()
    try await Task.sleep(for: .milliseconds(400))
    XCTAssertNil(manager.entry)
    XCTAssertEqual(log.items, ["commit 1", "undo 2", "commit 3"])
  }

  func testTipGroupShowsTipsInOrder() async {
    let order = ["a", "b", "c"]
    XCTAssertNil(TipQueue.current(order: order, loaded: [], skipped: []))
    XCTAssertNil(TipQueue.current(order: order, loaded: ["b", "c"], skipped: []))
    XCTAssertEqual(TipQueue.current(order: order, loaded: ["a"], skipped: []), "a")
    XCTAssertEqual(TipQueue.current(order: order, loaded: ["a", "b", "c"], skipped: ["a"]), "b")
    XCTAssertNil(TipQueue.current(order: order, loaded: ["a", "c"], skipped: ["a"]))
    XCTAssertEqual(TipQueue.current(order: order, loaded: ["a", "b", "c"], skipped: ["a", "b"]), "c")
    XCTAssertNil(TipQueue.current(order: order, loaded: ["a", "b", "c"], skipped: ["a", "b", "c"]))
    let storage = InMemoryTipStorage()
    await storage.setItem(TipKeys.key("a"), TipKeys.dismissed)
    let stored = await storage.getItem("tip:a")
    XCTAssertEqual(stored, "dismissed")
    await resetTips(["a"], storage: storage)
    let cleared = await storage.getItem("tip:a")
    XCTAssertNil(cleared)
  }

  func testPagedListLoadsAtTheEnd() {
    XCTAssertEqual(PagedListMath.pageCount(total: 23, pageSize: 10), 3)
    XCTAssertEqual(PagedListMath.pageCount(total: 0, pageSize: 10), 1)
    XCTAssertEqual(PagedListMath.visibleCount(loaded: 1, pageSize: 10, total: 23), 10)
    XCTAssertEqual(PagedListMath.visibleCount(loaded: 3, pageSize: 10, total: 23), 23)
    XCTAssertTrue(PagedListMath.shouldLoad(appearing: 9, visible: 10, total: 23))
    XCTAssertFalse(PagedListMath.shouldLoad(appearing: 8, visible: 10, total: 23))
    XCTAssertFalse(PagedListMath.shouldLoad(appearing: 22, visible: 23, total: 23))
  }

  func testSearchRevealSnapsToEdges() {
    XCTAssertEqual(SearchRevealSnap.target(for: 10, height: 44, hasQuery: false), 0)
    XCTAssertEqual(SearchRevealSnap.target(for: 30, height: 44, hasQuery: false), 44)
    XCTAssertEqual(SearchRevealSnap.target(for: 30, height: 44, hasQuery: true), 0)
    XCTAssertNil(SearchRevealSnap.target(for: 0, height: 44, hasQuery: false))
    XCTAssertNil(SearchRevealSnap.target(for: 120, height: 44, hasQuery: false))
  }
}
