import PhosphorSwift
import SwiftUI
import XCTest

@testable import EsuissUI

private struct Caption: View {
  let text: String

  var body: some View {
    Text(verbatim: text)
      .font(TextStyle.xs.font(weight: .semibold))
      .foregroundStyle(Color.labelSecondary)
  }
}

private struct Frame<Content: View>: View {
  let height: CGFloat
  @ViewBuilder let content: () -> Content

  var body: some View {
    content()
      .frame(height: height)
      .frame(maxWidth: .infinity)
      .clipShape(RoundedRectangle(cornerRadius: Radius.xl, style: .continuous))
      .overlay {
        RoundedRectangle(cornerRadius: Radius.xl, style: .continuous).strokeBorder(Color.separator)
      }
  }
}

private struct Placeholder: View {
  var count = 6

  var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      ForEach(0..<count, id: \.self) { _ in
        RoundedRectangle(cornerRadius: Radius.md).fill(Color.surfaceTertiary).frame(height: 36)
      }
    }
  }
}

private struct SettingRow: View {
  let title: String
  let detail: String

  var body: some View {
    HStack {
      Text(verbatim: title)
        .font(TextStyle.base.font())
        .foregroundStyle(Color.label)
      Spacer()
      Text(verbatim: detail)
        .font(TextStyle.base.font())
        .foregroundStyle(Color.labelSecondary)
    }
    .padding(.horizontal, 16)
    .frame(height: 44)
    .overlay(alignment: .bottom) { Color.separator.frame(height: 1).padding(.leading, 16) }
  }
}

private struct ScreenGallery: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      Caption(text: "Screen, header, content and bottom bar")
      Frame(height: 420) {
        Screen {
          Header {
            HeaderTitle(verbatim: "Profile")
          } leading: {
            HeaderBack(verbatim: "Settings") {}
          } trailing: {
            HeaderActions {
              Button {} label: { Ph.dotsThree.bold.frame(width: 18, height: 18) }
            }
          }
          ScreenContent {
            Text(verbatim: "Your name")
              .font(TextStyle.base.font(weight: .semibold))
            Placeholder(count: 4)
          }
          BottomBar {
            BottomBarContent {
              Button("Continue") {}.buttonStyle(.variant(.default, size: .lg, block: true))
            }
          }
        }
      }
      Caption(text: "Secondary background, no scroll, no separator")
      Frame(height: 300) {
        Screen(background: .surfaceSecondary) {
          Header {
            HeaderTitle(verbatim: "Payment", subtitle: "Step 2 of 3")
          } leading: {
            HeaderBack {}
          }
          ScreenContent(scroll: false) {
            Placeholder(count: 2)
          }
          BottomBar(separator: false) {
            BottomBarContent {
              Button("Pay") {}.buttonStyle(.variant(.default, size: .lg, block: true))
              Button("Cancel") {}.buttonStyle(.variant(.plain, size: .lg, block: true))
            }
          }
        }
      }
    }
  }
}

private struct HeaderGallery: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      Caption(text: "Expanded (large title in view)")
      Frame(height: 132) {
        VStack(spacing: 0) {
          Header {
            HeaderTitle(verbatim: "Inbox")
          } trailing: {
            HeaderActions {
              Button {} label: { Ph.pencilSimple.regular.frame(width: 18, height: 18) }
            }
          }
          .environment(\.headerProgress, 0)
          HeaderLargeTitle(verbatim: "Inbox", subtitle: "3 unread messages")
          Spacer(minLength: 0)
        }
      }
      Caption(text: "Collapsed (scrolled)")
      Frame(height: 44) {
        Header {
          HeaderTitle(verbatim: "Inbox", subtitle: "3 unread")
        } leading: {
          HeaderBack(verbatim: "Mail") {}
        } trailing: {
          HeaderActions {
            Button {} label: { Ph.funnel.regular.frame(width: 18, height: 18) }
            Button {} label: { Ph.pencilSimple.regular.frame(width: 18, height: 18) }
          }
        }
        .environment(\.headerProgress, 1)
      }
      Caption(text: "Plain header, long title, disabled action")
      Frame(height: 44) {
        Header {
          HeaderTitle(verbatim: "A very long screen title that must truncate")
        } leading: {
          HeaderBack {}
        } trailing: {
          HeaderActions {
            Button {} label: { Ph.gear.regular.frame(width: 18, height: 18) }.disabled(true)
          }
        }
      }
      Caption(text: "Header scroll view")
      Frame(height: 300) {
        HeaderScrollView {
          HeaderLargeTitle(verbatim: "Settings")
          SettingRow(title: "Wi-Fi", detail: "Home")
          SettingRow(title: "Bluetooth", detail: "On")
          SettingRow(title: "Notifications", detail: "")
          SettingRow(title: "Sounds", detail: "")
        } header: {
          Header {
            HeaderTitle(verbatim: "Settings")
          } leading: {
            HeaderBack(verbatim: "Back") {}
          }
        }
      }
    }
  }
}

private enum FormField: Hashable {
  case name, email, phone
}

private struct KeyboardGallery: View {
  @State private var name = "Ada Lovelace"
  @State private var email = ""
  @State private var phone = ""
  @FocusState private var focus: FormField?

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      Caption(text: "Input accessory bar")
      VStack(spacing: 12) {
        InputAccessoryBar(onNext: {}, onDone: {})
        InputAccessoryBar(onPrevious: {}, onNext: {}, onDone: {})
        InputAccessoryBar(previousLabel: "Back", nextLabel: "Forward", doneLabel: "Close", onPrevious: {}, onDone: {})
      }
      Caption(text: "Keyboard scroll view with a focus chain")
      Frame(height: 260) {
        KeyboardScrollView {
          VStack(alignment: .leading, spacing: 12) {
            TextField("Name", text: $name)
              .textFieldStyle(.input)
              .focused($focus, equals: .name)
              .submitLabel(.next)
            TextField("Email", text: $email)
              .textFieldStyle(.input)
              .focused($focus, equals: .email)
              .submitLabel(.next)
            TextField("Phone", text: $phone)
              .textFieldStyle(.input)
              .focused($focus, equals: .phone)
              .submitLabel(.done)
            Placeholder(count: 3)
          }
          .padding(16)
        }
        .inputAccessoryBar(focus: $focus, order: [.name, .email, .phone])
      }
    }
  }
}

private struct ChipGallery: View {
  @State private var single: String? = "all"
  @State private var multiple: Set<String> = ["music", "film"]
  @State private var small: Set<String> = ["new"]
  @State private var tags = ["Design", "Swift", "Compose"]

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      Caption(text: "Single selection")
      ChipGroup(selection: $single) {
        Chip("All", value: "all")
        Chip("Unread", value: "unread")
        Chip("Flagged", value: "flagged")
        Chip("Archived", value: "archived")
      }
      Caption(text: "Multiple selection with icons")
      ChipGroup(selection: $multiple) {
        Chip("Music", value: "music", icon: Ph.musicNote.regular)
        Chip("Film", value: "film", icon: Ph.filmSlate.regular)
        Chip("Photos", value: "photos", icon: Ph.image.regular)
        Chip("Books", value: "books", icon: Ph.book.regular)
        Chip("Podcasts", value: "podcasts", icon: Ph.microphone.regular)
      }
      Caption(text: "Small")
      ChipGroup(selection: $small, size: .sm) {
        Chip("New", value: "new")
        Chip("Popular", value: "popular")
        Chip("Nearby", value: "nearby", icon: Ph.mapPin.regular)
        Chip("Open now", value: "open")
      }
      Caption(text: "Removable")
      ChipGroup(selection: .constant(Set<String>())) {
        ForEach(tags, id: \.self) { tag in
          Chip(LocalizedStringKey(tag), value: tag) {
            tags.removeAll { $0 == tag }
          }
        }
        Chip("Selected", isSelected: .constant(true), onRemove: {})
      }
      Caption(text: "Disabled")
      HStack(spacing: 8) {
        Chip("Off", isSelected: .constant(false))
        Chip("On", isSelected: .constant(true))
        Chip("Static", icon: Ph.lock.regular)
      }
      .disabled(true)
      Caption(text: "Horizontal scroll")
      ChipGroup(selection: $single, scrollable: true) {
        ForEach(["All", "Today", "This week", "This month", "This year", "Older"], id: \.self) { title in
          Chip(LocalizedStringKey(title), value: title.lowercased())
        }
      }
    }
  }
}

private struct ReorderGallery: View {
  @State private var items = ["Inbox", "Today", "Upcoming", "Someday", "Logbook with a much longer name that wraps"]

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      Caption(text: "Reorder list")
      Frame(height: 252) {
        ReorderList($items) { item in
          HStack(spacing: 12) {
            Ph.tray.regular
              .frame(width: 20, height: 20)
              .foregroundStyle(Color.link)
            Text(verbatim: item)
              .font(TextStyle.base.font())
              .foregroundStyle(Color.label)
          }
          .padding(.vertical, 10)
        }
      }
    }
  }
}

private struct FabGallery: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      Caption(text: "Default, large and extended")
      Frame(height: 120) {
        ZStack {
          Placeholder(count: 2).padding(16)
          HStack(alignment: .bottom, spacing: 0) {
            Fab(accessibilityLabel: "Add", action: {}) { Ph.plus.bold }
              .frame(width: 88)
            Fab(accessibilityLabel: "Add", size: .lg, action: {}) { Ph.plus.bold }
              .frame(width: 96)
            Fab("Compose", action: {}) { Ph.pencilSimple.bold }
          }
        }
      }
      Caption(text: "Disabled")
      Frame(height: 88) {
        Fab("Compose", action: {}) { Ph.pencilSimple.bold }.disabled(true)
      }
      Caption(text: "Speed dial open")
      Frame(height: 340) {
        ZStack {
          Placeholder(count: 7).padding(16)
          Fab(isExpanded: .constant(true)) {
            FabAction(verbatim: "Photo", action: {}) { Ph.camera.regular }
            FabAction(verbatim: "Document", action: {}) { Ph.fileText.regular }
            FabAction(verbatim: "Location", action: {}) { Ph.mapPin.regular }
          }
        }
      }
    }
  }
}

private struct BannerGallery: View {
  let manager: TopBannerManager

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      Caption(text: "In region (under the status bar)")
      Frame(height: 132) {
        Placeholder(count: 2)
          .padding(16)
          .frame(maxHeight: .infinity, alignment: .top)
          .topBanner(manager)
      }
      Caption(text: "Title only, icon, action, long text")
      VStack(spacing: 12) {
        TopBannerCard(item: item("Saved"), onDismiss: {})
        TopBannerCard(item: item("Back online", description: "Your changes are syncing.", icon: Ph.wifiHigh.regular), onDismiss: {})
        TopBannerCard(
          item: item("New message", description: "Ada: Are we still on for lunch?", icon: Ph.chatCircle.regular, action: "Reply"),
          onDismiss: {}
        )
        TopBannerCard(
          item: item(
            "Storage almost full",
            description: "Free up space to keep backing up your photos, documents and messages to the cloud.",
            icon: Ph.warning.regular,
            action: "Manage"
          ),
          onDismiss: {}
        )
      }
    }
  }

  private func item(
    _ title: String,
    description: String? = nil,
    icon: Image? = nil,
    action: String? = nil
  ) -> TopBannerItem {
    TopBannerItem(
      id: UUID(),
      title: LocalizedStringResource(stringLiteral: title),
      description: description.map { LocalizedStringResource(stringLiteral: $0) },
      icon: icon,
      action: action.map { TopBannerAction(LocalizedStringResource(stringLiteral: $0)) {} },
      duration: nil
    )
  }
}

@MainActor
final class FoundationGalleryTests: XCTestCase {
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

  func testRendersScreenGallery() throws {
    try snapshot(ScreenGallery(), name: "foundation-screen")
  }

  func testRendersHeaderGallery() throws {
    try snapshot(HeaderGallery(), name: "foundation-header")
  }

  func testRendersKeyboardGallery() throws {
    try snapshot(KeyboardGallery(), name: "foundation-keyboard")
  }

  func testRendersChipGallery() throws {
    try snapshot(ChipGallery(), name: "foundation-chip")
  }

  func testRendersReorderGallery() throws {
    try snapshot(ReorderGallery(), name: "foundation-reorder-list")
  }

  func testRendersFabGallery() throws {
    try snapshot(FabGallery(), name: "foundation-fab")
  }

  func testRendersTopBannerGallery() throws {
    let manager = TopBannerManager()
    manager.timeout = .seconds(600)
    manager.show("Back online", description: "Your changes are syncing.", icon: Ph.wifiHigh.regular)
    try snapshot(BannerGallery(manager: manager), name: "foundation-top-banner")
    manager.dismissAll()
  }

  func testChipSelectionSingleAndMultiple() {
    var single: String? = nil
    single = ChipSelection.toggle(single, "a")
    XCTAssertEqual(single, "a")
    single = ChipSelection.toggle(single, "b")
    XCTAssertEqual(single, "b")
    single = ChipSelection.toggle(single, "b")
    XCTAssertNil(single)
    var multiple: Set<String> = []
    multiple = ChipSelection.toggle(multiple, "a")
    multiple = ChipSelection.toggle(multiple, "b")
    XCTAssertEqual(multiple, ["a", "b"])
    multiple = ChipSelection.toggle(multiple, "a")
    XCTAssertEqual(multiple, ["b"])
  }

  func testReorderMoveAndTarget() {
    let items = ["a", "b", "c", "d"]
    XCTAssertEqual(ReorderMath.move(items, from: 0, to: 2), ["b", "c", "a", "d"])
    XCTAssertEqual(ReorderMath.move(items, from: 3, to: 0), ["d", "a", "b", "c"])
    XCTAssertEqual(ReorderMath.move(items, from: 1, to: 1), items)
    XCTAssertEqual(ReorderMath.move(items, from: 1, to: 9), items)
    let heights: [CGFloat] = [44, 44, 60, 44]
    XCTAssertEqual(ReorderMath.target(from: 0, translation: 10, heights: heights), 0)
    XCTAssertEqual(ReorderMath.target(from: 0, translation: 23, heights: heights), 1)
    XCTAssertEqual(ReorderMath.target(from: 0, translation: 80, heights: heights), 2)
    XCTAssertEqual(ReorderMath.target(from: 0, translation: 500, heights: heights), 3)
    XCTAssertEqual(ReorderMath.target(from: 3, translation: -31, heights: heights), 2)
    XCTAssertEqual(ReorderMath.target(from: 3, translation: -500, heights: heights), 0)
    XCTAssertEqual(ReorderMath.shift(for: 1, dragging: 0, target: 2, height: 44), -44)
    XCTAssertEqual(ReorderMath.shift(for: 3, dragging: 0, target: 2, height: 44), 0)
    XCTAssertEqual(ReorderMath.shift(for: 1, dragging: 3, target: 1, height: 44), 44)
  }

  func testTopBannerQueuesAndTimesOut() async throws {
    let manager = TopBannerManager()
    manager.timeout = .milliseconds(250)
    let first = manager.show("First")
    let second = manager.show("Second", duration: .milliseconds(150))
    XCTAssertEqual(manager.queue.count, 2)
    XCTAssertEqual(manager.current?.id, first)
    try await Task.sleep(for: .milliseconds(350))
    XCTAssertEqual(manager.current?.id, second)
    try await Task.sleep(for: .milliseconds(250))
    XCTAssertNil(manager.current)
    let third = manager.show("Third")
    manager.show("Fourth")
    manager.dismiss(third)
    XCTAssertEqual(manager.queue.count, 1)
    manager.dismissAll()
    XCTAssertNil(manager.current)
  }

  func testFocusChainMovesNextAndPrevious() {
    let chain = FocusChain(order: [FormField.name, .email, .phone])
    XCTAssertEqual(chain.next(after: .name), .email)
    XCTAssertEqual(chain.next(after: .email), .phone)
    XCTAssertNil(chain.next(after: .phone))
    XCTAssertEqual(chain.next(after: nil), .name)
    XCTAssertEqual(chain.previous(before: .phone), .email)
    XCTAssertNil(chain.previous(before: .name))
    XCTAssertNil(chain.previous(before: nil))
  }

  func testHeaderProgressFollowsLargeTitle() {
    XCTAssertEqual(HeaderMath.progress(minY: 12, height: 41), 0)
    XCTAssertEqual(HeaderMath.progress(minY: -20.5, height: 41), 0.5)
    XCTAssertEqual(HeaderMath.progress(minY: -120, height: 41), 1)
    XCTAssertEqual(HeaderMath.progress(minY: -10, height: 0), 0)
  }
}
