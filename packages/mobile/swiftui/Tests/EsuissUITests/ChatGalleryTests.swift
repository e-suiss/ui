import PhosphorSwift
import SwiftUI
import UIKit
import XCTest

@testable import EsuissUI

private struct Caption: View {
  let text: String

  var body: some View {
    Text(verbatim: text)
      .font(TextStyle.xs.font(weight: .semibold))
      .foregroundStyle(EsuissColor.mutedForeground)
      .frame(maxWidth: .infinity, alignment: .leading)
  }
}

private struct GallerySection<Content: View>: View {
  let title: String
  let content: Content

  init(_ title: String, @ViewBuilder content: () -> Content) {
    self.title = title
    self.content = content()
  }

  var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      Caption(text: title)
      content
    }
  }
}

@MainActor
private func landscape() -> Image {
  let size = CGSize(width: 240, height: 240)
  let image = UIGraphicsImageRenderer(size: size).image { context in
    let colors = [UIColor(EsuissColor.primary).cgColor, UIColor(Palette.green500).cgColor] as CFArray
    let space = CGColorSpaceCreateDeviceRGB()
    if let gradient = CGGradient(colorsSpace: space, colors: colors, locations: [0, 1]) {
      context.cgContext.drawLinearGradient(gradient, start: .zero, end: CGPoint(x: size.width, y: size.height), options: [])
    }
    UIColor(EsuissColor.primaryForeground).withAlphaComponent(0.85).setFill()
    let mountain = UIBezierPath()
    mountain.move(to: CGPoint(x: 0, y: 240))
    mountain.addLine(to: CGPoint(x: 90, y: 110))
    mountain.addLine(to: CGPoint(x: 140, y: 170))
    mountain.addLine(to: CGPoint(x: 180, y: 130))
    mountain.addLine(to: CGPoint(x: 240, y: 200))
    mountain.addLine(to: CGPoint(x: 240, y: 240))
    mountain.close()
    mountain.fill()
  }
  return Image(uiImage: image)
}

private struct BubbleGallery: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 28) {
      GallerySection("Variants") {
        BubbleGroup {
          ForEach(Array(BubbleVariant.allCases.enumerated()), id: \.offset) { _, variant in
            Bubble(variant: variant) {
              BubbleContent(verbatim: "This is a \(String(describing: variant)) bubble.")
            }
          }
        }
      }
      GallerySection("Conversation") {
        BubbleGroup {
          Bubble(variant: .muted) {
            BubbleContent("Hey, did you get a chance to review the draft?")
          }
          Bubble(align: .end) {
            BubbleContent("Yes, I left a few comments on the intro.")
          }
          Bubble(align: .end) {
            BubbleContent("Everything else looks great.")
          }
          Bubble(variant: .muted) {
            BubbleContent("Thanks! I will update it this afternoon.")
          }
        }
      }
      GallerySection("With reactions") {
        BubbleGroup {
          Bubble(variant: .muted) {
            BubbleContent("We just hit 10,000 users!")
            BubbleReactions(verbatim: "🎉 3")
          }
          Bubble(align: .end) {
            BubbleContent("That is amazing news.")
            BubbleReactions(verbatim: "❤️", align: .start)
          }
          Bubble(variant: .secondary) {
            BubbleContent("Reactions can sit on top as well.")
            BubbleReactions(verbatim: "👍 2", side: .top)
          }
        }
      }
      GallerySection("Interactive · long press") {
        BubbleGroup {
          Bubble(variant: .outline) {
            BubbleContent(action: {}) {
              Text("Show me the latest release notes")
            }
          }
          Bubble(variant: .tinted, align: .end, onLongPress: {}) {
            BubbleContent("Long press me for actions")
          }
        }
      }
    }
  }
}

private struct MessageGallery: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 28) {
      GallerySection("Default") {
        Message {
          MessageAvatar { Avatar(url: nil, initials: "MK") }
          MessageContent {
            Bubble(variant: .muted) { BubbleContent("Are we still on for lunch tomorrow?") }
          }
        }
      }
      GallerySection("Align end") {
        Message(align: .end) {
          MessageContent {
            Bubble { BubbleContent("Yes, see you at noon.") }
          }
        }
      }
      GallerySection("Header and footer") {
        Message {
          MessageAvatar { Avatar(url: nil, initials: "JL") }
          MessageContent {
            MessageHeader("Jordan Lee")
            Bubble(variant: .muted) { BubbleContent("I pushed the updated designs to the shared folder.") }
            MessageFooter("9:41 AM")
          }
        }
      }
      GallerySection("Conversation") {
        MessageGroup(spacing: 16) {
          Message {
            MessageAvatar { Avatar(url: nil, initials: "MK") }
            MessageContent {
              Bubble(variant: .muted) { BubbleContent("Did the build pass?") }
              Bubble(variant: .muted) { BubbleContent("I want to ship before the weekend.") }
            }
          }
          Message(align: .end) {
            MessageContent {
              Bubble { BubbleContent("All green. Merging it now.") }
              MessageFooter("Read 10:02 AM")
            }
          }
        }
      }
      GallerySection("Ghost") {
        Message {
          MessageAvatar { Avatar(url: nil, initials: "TS") }
          MessageContent {
            MessageHeader("Taylor Swan")
            Bubble(variant: .ghost) {
              BubbleContent("Ghost bubbles drop the padding, so headers line up with the text.")
            }
          }
        }
      }
    }
  }
}

private struct FileRow: View {
  let name: String
  let meta: String
  let label: String
  let tint: Color

  var body: some View {
    Attachment {
      AttachmentMedia(.document) { AttachmentLabel(verbatim: label, tint: tint) }
      AttachmentContent {
        AttachmentTitle(verbatim: name)
        AttachmentDescription(verbatim: meta)
      }
    }
  }
}

private struct AttachmentStatesGallery: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 28) {
      GallerySection("States") {
        VStack(spacing: 12) {
          Attachment(state: .idle, block: true) {
            AttachmentMedia(icon: Ph.uploadSimple.regular)
            AttachmentContent {
              AttachmentTitle("Drop a file here")
              AttachmentDescription("PDF, PNG or JPG up to 10 MB")
            }
            AttachmentActions {
              AttachmentAction("Choose File") {}
            }
          }
          Attachment(state: .uploading, block: true) {
            AttachmentMedia(.document) { AttachmentLabel("pdf", tint: EsuissColor.destructive) }
            AttachmentContent {
              AttachmentTitle("Invoice March.pdf")
              AttachmentProgress(value: 64)
            }
            AttachmentActions {
              AttachmentAction("Cancel upload", icon: Ph.x.bold) {}
            }
          }
          Attachment(state: .processing, block: true) {
            AttachmentMedia(.document) { AttachmentLabel("pdf", tint: EsuissColor.destructive) }
            AttachmentContent {
              AttachmentTitle("Invoice March.pdf")
              AttachmentDescription("Processing…")
            }
            AttachmentActions {
              SpinnerSpokes(dimension: 20, progress: nil)
                .foregroundStyle(EsuissColor.mutedForeground)
            }
          }
          Attachment(state: .error, block: true) {
            AttachmentMedia(.document) { AttachmentLabel("key", tint: Palette.amber500) }
            AttachmentContent {
              AttachmentTitle("Presentation.key")
              AttachmentDescription("File type not supported")
            }
            AttachmentActions {
              AttachmentAction("Remove", icon: Ph.x.bold) {}
            }
          }
          Attachment(state: .done, block: true) {
            AttachmentMedia(.document) { AttachmentLabel("pdf", tint: EsuissColor.destructive) }
            AttachmentContent {
              AttachmentTitle("Invoice March.pdf")
              AttachmentDescription("1.1 MB")
            }
          }
        }
      }
      GallerySection("Sizes") {
        VStack(alignment: .leading, spacing: 12) {
          ForEach(Array(AttachmentSize.allCases.enumerated()), id: \.offset) { _, size in
            Attachment(size: size) {
              AttachmentMedia(icon: Ph.fileText.regular)
              AttachmentContent {
                AttachmentTitle("Meeting notes.docx")
                AttachmentDescription("184 KB")
              }
              AttachmentActions {
                AttachmentAction("Remove", icon: Ph.x.bold) {}
              }
            }
          }
        }
      }
    }
  }
}

private struct AttachmentLayoutGallery: View {
  let image: Image

  var body: some View {
    VStack(alignment: .leading, spacing: 28) {
      GallerySection("Image") {
        Attachment {
          AttachmentMedia(image: image)
          AttachmentContent {
            AttachmentTitle("Lake.jpg")
            AttachmentDescription("3.2 MB")
          }
          AttachmentActions {
            AttachmentAction("Remove", icon: Ph.x.bold) {}
          }
        }
      }
      GallerySection("Vertical") {
        HStack(alignment: .top, spacing: 12) {
          Attachment(orientation: .vertical) {
            AttachmentMedia(image: image)
            AttachmentActions {
              AttachmentAction("Remove", icon: Ph.x.bold) {}
            }
          }
          Attachment(orientation: .vertical) {
            AttachmentMedia(icon: Ph.filePdf.regular)
            AttachmentContent {
              AttachmentTitle("Contract.pdf")
              AttachmentDescription("860 KB")
            }
          }
        }
      }
      GallerySection("Group") {
        AttachmentGroup {
          Attachment(state: .uploading) {
            AttachmentMedia(.document) { AttachmentLabel("pdf", tint: EsuissColor.destructive) }
            AttachmentContent {
              AttachmentTitle("Invoice March.pdf")
              AttachmentProgress(value: 32)
            }
            AttachmentActions {
              AttachmentAction("Cancel upload", icon: Ph.x.bold) {}
            }
          }
          Attachment {
            AttachmentTrigger("Open Lake.jpg") {}
            AttachmentMedia(image: image)
            AttachmentContent {
              AttachmentTitle("Lake.jpg")
              AttachmentDescription("3.2 MB")
            }
          }
          Attachment(state: .error) {
            AttachmentMedia(.document) { AttachmentLabel("key", tint: Palette.amber500) }
            AttachmentContent {
              AttachmentTitle("Presentation.key")
              AttachmentDescription("File type not supported")
            }
            AttachmentActions {
              AttachmentAction("Remove", icon: Ph.x.bold) {}
            }
          }
        }
      }
      GallerySection("File types") {
        VStack(alignment: .leading, spacing: 12) {
          FileRow(name: "Invoice.pdf", meta: "128 KB", label: "pdf", tint: EsuissColor.destructive)
          FileRow(name: "Menu.xlsx", meta: "2.4 MB", label: "xlsx", tint: Palette.green500)
          FileRow(name: "Contract.docx", meta: "84 KB", label: "docx", tint: EsuissColor.primary)
          FileRow(name: "Pitch.key", meta: "12 MB", label: "key", tint: Palette.amber500)
          FileRow(name: "Archive.zip", meta: "48 MB", label: "zip", tint: EsuissColor.mutedForeground)
        }
      }
    }
  }
}

struct ChatEntry: Identifiable, Sendable {
  enum Kind: Sendable {
    case day(String)
    case received([String], header: String?, footer: String?, reaction: String?)
    case sent([String], footer: String?, reaction: String?)
    case receivedFile
    case sentUpload
    case receivedImage
  }

  let id: Int
  let kind: Kind
}

private struct ChatRow: View {
  let entry: ChatEntry
  let image: Image

  var body: some View {
    switch entry.kind {
    case .day(let label):
      Text(verbatim: label)
        .font(TextStyle.xs.font(weight: .semibold))
        .foregroundStyle(EsuissColor.mutedForeground)
        .frame(maxWidth: .infinity)
    case .received(let texts, let header, let footer, let reaction):
      Message {
        MessageAvatar { Avatar(url: nil, initials: "JL") }
        MessageContent {
          if let header { MessageHeader(verbatim: header) }
          ForEach(Array(texts.enumerated()), id: \.offset) { index, text in
            Bubble(variant: .muted) {
              BubbleContent(verbatim: text)
              if let reaction, index == texts.count - 1 {
                BubbleReactions(verbatim: reaction)
              }
            }
          }
          if let footer { MessageFooter(verbatim: footer) }
        }
      }
    case .sent(let texts, let footer, let reaction):
      Message(align: .end) {
        MessageContent {
          ForEach(Array(texts.enumerated()), id: \.offset) { index, text in
            Bubble {
              BubbleContent(verbatim: text)
              if let reaction, index == texts.count - 1 {
                BubbleReactions(verbatim: reaction, align: .start)
              }
            }
          }
          if let footer {
            MessageFooter {
              Ph.checks.bold.frame(width: 14, height: 14).foregroundStyle(EsuissColor.primary)
              Text(verbatim: footer)
            }
          }
        }
      }
    case .receivedFile:
      Message {
        MessageAvatar { Avatar(url: nil, initials: "JL") }
        MessageContent {
          Attachment {
            AttachmentTrigger("Open Launch plan.pdf") {}
            AttachmentMedia(.document) { AttachmentLabel("pdf", tint: EsuissColor.destructive) }
            AttachmentContent {
              AttachmentTitle("Launch plan.pdf")
              AttachmentDescription("1.1 MB")
            }
          }
          Bubble(variant: .muted) { BubbleContent("Here is the updated plan.") }
        }
      }
    case .sentUpload:
      Message(align: .end) {
        MessageContent {
          Attachment(state: .uploading) {
            AttachmentMedia(.document) { AttachmentLabel("zip", tint: EsuissColor.primary) }
            AttachmentContent {
              AttachmentTitle("Screens.zip")
              AttachmentProgress(value: 64)
            }
            AttachmentActions {
              AttachmentAction("Cancel upload", icon: Ph.x.bold) {}
            }
          }
          Bubble { BubbleContent("Uploading the screens now.") }
          MessageFooter("Sending…")
        }
      }
    case .receivedImage:
      Message {
        MessageAvatar { Avatar(url: nil, initials: "JL") }
        MessageContent {
          Attachment(orientation: .vertical) {
            AttachmentTrigger("Open Lake.jpg") {}
            AttachmentMedia(image: image)
          }
          Bubble(variant: .muted) {
            BubbleContent("Offsite location, by the way.")
            BubbleReactions(verbatim: "❤️ 2")
          }
          MessageFooter("9:44 AM")
        }
      }
    }
  }
}

private let threadEntries: [ChatEntry] = [
  ChatEntry(id: 0, kind: .day("Today")),
  ChatEntry(id: 1, kind: .received(
    ["Morning! The launch moved to Thursday.", "Can we trim the scope a little?"],
    header: "Jordan Lee",
    footer: nil,
    reaction: nil
  )),
  ChatEntry(id: 2, kind: .sent(
    ["Saw it. We can ship onboarding behind a flag."],
    footer: "Read 9:40 AM",
    reaction: "👍"
  )),
  ChatEntry(id: 3, kind: .receivedFile),
  ChatEntry(id: 4, kind: .sentUpload),
  ChatEntry(id: 5, kind: .receivedImage),
]

private let scriptLines = [
  "Hey, do you have a minute?",
  "Sure, what's up?",
  "The client moved the launch to Thursday.",
  "That's two days earlier than planned.",
  "I know. Can we cut the onboarding tour?",
  "We could ship it behind a flag and turn it on next week.",
  "That works. What about the docs?",
  "The API reference is done. Guides need a pass.",
  "I can review the guides tonight.",
  "Great, I'll send you the draft links.",
  "Any blockers on the release checklist?",
  "Just the final QA run. It should finish this afternoon.",
  "Perfect. Let's sync tomorrow at ten.",
  "Sounds good, see you then.",
]

private func scriptEntries(_ range: Range<Int>) -> [ChatEntry] {
  range.map { index in
    let text = scriptLines[index % scriptLines.count]
    let kind: ChatEntry.Kind = index % 2 == 0
      ? .received([text], header: nil, footer: nil, reaction: nil)
      : .sent([text], footer: nil, reaction: nil)
    return ChatEntry(id: 100 + index, kind: kind)
  }
}

private struct Composer: View {
  @State private var text = ""

  var body: some View {
    BottomBar {
      BottomBarContent {
        InputGroup {
          InputGroupAddon {
            InputGroupButton(size: .iconXs) {} label: {
              Ph.plus.bold.frame(width: 16, height: 16)
            }
          }
          InputGroupInput("Message", text: $text)
          InputGroupAddon(align: .inlineEnd) {
            InputGroupButton(variant: .default, size: .iconXs) {} label: {
              Ph.arrowUp.bold.frame(width: 14, height: 14)
            }
          }
        }
      }
    }
  }
}

private struct ChatHeader: View {
  let title: String

  var body: some View {
    HStack(spacing: 10) {
      Avatar(url: nil, initials: "JL")
      VStack(alignment: .leading, spacing: 0) {
        Text(verbatim: title).font(TextStyle.base.font(weight: .semibold)).foregroundStyle(EsuissColor.foreground)
        Text(verbatim: "Online").font(TextStyle.xs.font()).foregroundStyle(EsuissColor.mutedForeground)
      }
      Spacer(minLength: 0)
    }
    .padding(.horizontal, 16)
    .padding(.vertical, 10)
    .overlay(alignment: .bottom) { EsuissColor.border.frame(height: 1) }
  }
}

private struct ThreadGallery: View {
  let image: Image

  var body: some View {
    Screen {
      ChatHeader(title: "Jordan Lee")
      MessageScroller(threadEntries) { entry in
        ChatRow(entry: entry, image: image)
      }
      Composer()
    }
    .frame(height: 860)
  }
}

private struct ScrolledGallery: View {
  let image: Image
  let controller: MessageScrollerController

  @State private var entries = scriptEntries(0..<14)

  var body: some View {
    Screen {
      ChatHeader(title: "Jordan Lee")
      MessageScroller(entries, defaultScrollPosition: .start, controller: controller) { entry in
        ChatRow(entry: entry, image: image)
      }
      Composer()
    }
    .frame(height: 640)
    .task {
      try? await Task.sleep(for: .milliseconds(250))
      entries.append(contentsOf: scriptEntries(14..<17))
    }
  }
}

private struct EmptyGallery: View {
  var body: some View {
    Screen {
      ChatHeader(title: "Jordan Lee")
      Empty {
        EmptyHeader {
          EmptyMedia(.icon) { Ph.chatCircleDots.regular }
          EmptyTitle("No messages yet")
          EmptyDescription("Say hello to start the conversation.")
        }
      }
      Composer()
    }
    .frame(height: 520)
  }
}

@MainActor
final class ChatGalleryTests: XCTestCase {
  private var output: String {
    ProcessInfo.processInfo.environment["GALLERY_OUTPUT"] ?? NSTemporaryDirectory()
  }

  private func render<V: View>(_ view: V, name: String, padding: CGFloat = 16) throws {
    for scheme in [ColorScheme.light, .dark] {
      let renderer = ImageRenderer(content: view
        .padding(padding)
        .frame(width: 402, alignment: .leading)
        .background(EsuissColor.background)
        .environment(\.colorScheme, scheme)
        .environment(\.locale, Locale(identifier: "en_US")))
      renderer.scale = 3
      let data = try XCTUnwrap(renderer.uiImage?.pngData())
      let file = "\(name)-\(scheme == .dark ? "dark" : "light").png"
      try data.write(to: URL(fileURLWithPath: output).appendingPathComponent(file))
    }
  }

  private func snapshot<V: View>(_ view: V, name: String, padding: CGFloat = 0, wait: TimeInterval = 0.8) throws {
    for scheme in [ColorScheme.light, .dark] {
      let host = UIHostingController(rootView: view
        .padding(padding)
        .frame(width: 402, alignment: .leading)
        .background(EsuissColor.background)
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
      RunLoop.main.run(until: Date().addingTimeInterval(wait))
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

  func testRendersBubbleGallery() throws {
    try render(BubbleGallery(), name: "chat-bubble")
  }

  func testRendersMessageGallery() throws {
    try render(MessageGallery(), name: "chat-message")
  }

  func testRendersAttachmentStatesGallery() throws {
    try render(AttachmentStatesGallery(), name: "chat-attachment-states")
  }

  func testRendersAttachmentLayoutGallery() throws {
    try render(AttachmentLayoutGallery(image: landscape()), name: "chat-attachment-layout")
  }

  func testRendersThreadGallery() throws {
    try snapshot(ThreadGallery(image: landscape()), name: "chat-thread")
  }

  func testRendersScrolledGalleryWithUnreadCount() throws {
    let controller = MessageScrollerController()
    try snapshot(ScrolledGallery(image: landscape(), controller: controller), name: "chat-scrolled", wait: 1.2)
    XCTAssertFalse(controller.isAtEnd)
    XCTAssertEqual(controller.unreadCount, 3)
  }

  func testRendersEmptyGallery() throws {
    try snapshot(EmptyGallery(), name: "chat-empty")
  }

  func testBubbleTailsMarkTheLastBubbleOfEachRun() {
    let ids = (0..<7).map { _ in UUID() }
    let entries = [
      BubbleRunEntry(id: ids[0], align: .start, tail: true),
      BubbleRunEntry(id: ids[1], align: .start, tail: true),
      BubbleRunEntry(id: ids[2], align: .end, tail: true),
      BubbleRunEntry(id: ids[3], align: .end, tail: true),
      BubbleRunEntry(id: ids[4], align: .start, tail: true),
      BubbleRunEntry(id: ids[5], align: .end, tail: false),
      BubbleRunEntry(id: ids[6], align: .start, tail: true),
    ]
    XCTAssertEqual(BubbleRun.tails(entries), [ids[1], ids[3], ids[4], ids[6]])
    XCTAssertEqual(BubbleRun.tails([]), [])
    XCTAssertEqual(BubbleRun.tails([entries[0]]), [ids[0]])
    XCTAssertFalse(BubbleVariant.ghost.hasTail)
    XCTAssertFalse(BubbleVariant.outline.hasTail)
    XCTAssertTrue(BubbleVariant.destructive.hasTail)
  }

  func testScrollerCountsUnreadOnlyWhileScrolledUp() {
    var tracker = MessageScrollerTracker()
    XCTAssertEqual(tracker.update([1, 2, 3]), MessageScrollerChange(reset: true))
    XCTAssertEqual(tracker.update([1, 2, 3, 4]), MessageScrollerChange(appended: 1))
    XCTAssertEqual(tracker.unread, 0)
    tracker.setEdges(atStart: false, atEnd: false)
    XCTAssertEqual(tracker.update([1, 2, 3, 4, 5, 6]), MessageScrollerChange(appended: 2))
    XCTAssertEqual(tracker.unread, 2)
    XCTAssertEqual(tracker.update([1, 2, 3, 4, 5, 6, 7]), MessageScrollerChange(appended: 1))
    XCTAssertEqual(tracker.unread, 3)
    tracker.setEdges(atStart: false, atEnd: true)
    XCTAssertEqual(tracker.unread, 0)
  }

  func testScrollerKeepsPositionOnPrependAndResetsOnReplace() {
    var tracker = MessageScrollerTracker()
    _ = tracker.update([10, 11, 12])
    tracker.setEdges(atStart: true, atEnd: false)
    XCTAssertEqual(tracker.update([7, 8, 9, 10, 11, 12]), MessageScrollerChange(prepended: 3))
    XCTAssertEqual(tracker.unread, 0)
    XCTAssertEqual(tracker.update([5, 6, 7, 8, 9, 10, 11, 12, 13]), MessageScrollerChange(appended: 1, prepended: 2))
    XCTAssertEqual(tracker.unread, 1)
    XCTAssertEqual(tracker.update([1, 2]), MessageScrollerChange(reset: true))
    XCTAssertEqual(tracker.unread, 0)
    XCTAssertEqual(tracker.update([]), MessageScrollerChange(reset: true))
    XCTAssertEqual(tracker.update([]), MessageScrollerChange())
  }

  func testScrollerControllerSendsScrollRequests() {
    let controller = MessageScrollerController()
    XCTAssertFalse(controller.canScroll(.end))
    XCTAssertFalse(controller.canScroll(.start))
    controller.setEdges(atStart: false, atEnd: false)
    XCTAssertTrue(controller.canScroll(.end))
    XCTAssertTrue(controller.canScroll(.start))
    controller.scrollToEnd()
    XCTAssertEqual(controller.request?.target, .end)
    let first = controller.request?.serial
    controller.scrollToEnd(animated: false)
    XCTAssertNotEqual(controller.request?.serial, first)
    XCTAssertEqual(controller.request?.animated, false)
    controller.scrollToMessage("m-4", anchor: .center)
    XCTAssertEqual(controller.request?.target, .message(AnyHashable("m-4"), .center))
    controller.scrollToStart()
    XCTAssertEqual(controller.request?.target, .start)
  }
}
