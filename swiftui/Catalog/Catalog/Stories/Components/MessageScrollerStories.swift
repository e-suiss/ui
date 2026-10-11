import EsuissUI
import PhosphorSwift
import SwiftUI

enum MessageScrollerStories {
  static let group = StoryGroup(.components, "Message Scroller", stories: [
    Story("Default", fullScreen: true) {
      MessageScrollerChat(initial: MessageScrollerData.thread)
    },
    Story("UnreadWhileScrolledUp", fullScreen: true) {
      MessageScrollerChat(initial: MessageScrollerData.long(40), unreadDemo: true)
    },
    Story("EmptyThread", fullScreen: true) {
      MessageScrollerChat(initial: [])
    },
    Story("LoadOlder", fullScreen: true) {
      MessageScrollerLoadOlder()
    },
  ])
}

private struct MessageScrollerAttachment: Hashable {
  let name: String
  let size: String
  var progress: Double?
}

private struct MessageScrollerMessage: Identifiable, Hashable {
  let id: String
  let fromMe: Bool
  let texts: [String]
  var time: String?
  var status: String?
  var reaction: String?
  var attachment: MessageScrollerAttachment?
}

private enum MessageScrollerData {
  static let thread: [MessageScrollerMessage] = [
    MessageScrollerMessage(
      id: "1",
      fromMe: false,
      texts: ["Hey, do you have a minute?", "The client moved the launch."],
      time: "9:12 AM"
    ),
    MessageScrollerMessage(id: "2", fromMe: true, texts: ["Sure, what's up?"]),
    MessageScrollerMessage(
      id: "3",
      fromMe: false,
      texts: ["It's Thursday now. Two days earlier than planned."],
      reaction: "😬 1"
    ),
    MessageScrollerMessage(
      id: "4",
      fromMe: true,
      texts: ["We could ship onboarding behind a flag.", "Turn it on next week once QA is done."],
      status: "Read 9:15 AM"
    ),
    MessageScrollerMessage(
      id: "5",
      fromMe: false,
      texts: ["Here are the release notes."],
      time: "9:18 AM",
      attachment: MessageScrollerAttachment(name: "Release notes.pdf", size: "1.2 MB")
    ),
    MessageScrollerMessage(
      id: "6",
      fromMe: true,
      texts: ["And the checklist with my comments."],
      attachment: MessageScrollerAttachment(name: "Checklist.pdf", size: "Uploading", progress: 64)
    ),
    MessageScrollerMessage(
      id: "7",
      fromMe: false,
      texts: ["Perfect. Let's sync tomorrow at ten."],
      reaction: "👍 2"
    ),
    MessageScrollerMessage(id: "8", fromMe: true, texts: ["Sounds good, see you then."], status: "Delivered"),
  ]

  static let subjects = [
    "Did you see the latest build?",
    "The onboarding copy needs one more pass.",
    "I can take the release notes.",
    "QA found two small issues on Android.",
    "Both are fixed in the next build.",
    "Can we move the review to the afternoon?",
  ]

  static func long(_ count: Int, offset: Int = 0) -> [MessageScrollerMessage] {
    (0..<count).map { index in
      let number = index + offset
      return MessageScrollerMessage(
        id: "m\(number)",
        fromMe: number % 3 == 0,
        texts: [subjects[number % subjects.count]]
      )
    }
  }
}

private struct MessageScrollerRow: View {
  let message: MessageScrollerMessage

  var body: some View {
    let mine = message.fromMe
    Message(align: mine ? .end : .start) {
      if !mine {
        MessageAvatar {
          Avatar { AvatarFallback("MK") }
        }
      }
      MessageContent {
        if let time = message.time, !mine {
          MessageHeader(verbatim: "Maya · \(time)")
        }
        if let attachment = message.attachment {
          MessageScrollerAttachmentView(attachment: attachment)
        }
        ForEach(Array(message.texts.enumerated()), id: \.offset) { index, text in
          Bubble(variant: mine ? .default : .muted) {
            BubbleContent(verbatim: text)
            if let reaction = message.reaction, index == message.texts.count - 1 {
              BubbleReactions(verbatim: reaction, align: mine ? .start : .end)
            }
          }
        }
        if let status = message.status {
          MessageFooter {
            Ph.checks.regular
              .frame(width: 16, height: 16)
              .foregroundStyle(Color.accent)
            Text(verbatim: status)
          }
        }
      }
    }
  }
}

private struct MessageScrollerAttachmentView: View {
  let attachment: MessageScrollerAttachment

  var body: some View {
    Attachment(state: attachment.progress == nil ? .done : .uploading) {
      AttachmentMedia(.document) {
        AttachmentLabel("pdf", tint: .red)
      }
      AttachmentContent {
        AttachmentTitle(verbatim: attachment.name)
        if let progress = attachment.progress {
          AttachmentProgress(value: progress, label: "Uploading")
        } else {
          AttachmentDescription(verbatim: attachment.size)
        }
      }
      if attachment.progress != nil {
        AttachmentActions {
          AttachmentAction("Cancel upload", icon: Ph.x.bold) {}
        }
      }
    }
    .frame(width: 256)
  }
}

private struct MessageScrollerChat: View {
  let unreadDemo: Bool

  @State private var messages: [MessageScrollerMessage]
  @State private var controller = MessageScrollerController()
  @State private var draft = ""

  init(initial: [MessageScrollerMessage], unreadDemo: Bool = false) {
    self.unreadDemo = unreadDemo
    _messages = State(initialValue: initial)
  }

  var body: some View {
    let ready = !draft.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    VStack(spacing: 0) {
      MessageScroller(messages, spacing: 16, controller: controller) { message in
        MessageScrollerRow(message: message)
      }
      .overlay {
        if messages.isEmpty {
          Empty {
            EmptyHeader {
              EmptyMedia(.icon) { Ph.chatsCircle.regular }
              EmptyTitle("No messages yet")
              EmptyDescription("Say hello to start the conversation.")
            }
          }
        }
      }
      .frame(maxHeight: .infinity)
      BottomBar(separator: true) {
        BottomBarContent {
          InputGroup {
            InputGroupInput("Message", text: $draft)
              .submitLabel(.send)
              .onSubmit(send)
            InputGroupAddon(align: .inlineEnd) {
              InputGroupButton(variant: .default, size: .iconXs, action: send) {
                Ph.arrowUp.bold.frame(width: 14, height: 14)
              }
              .disabled(!ready)
              .accessibilityLabel(Text("Send"))
            }
          }
        }
      }
    }
    .task {
      guard unreadDemo else { return }
      try? await Task.sleep(for: .milliseconds(300))
      controller.scrollToStart(animated: false)
      try? await Task.sleep(for: .milliseconds(600))
      messages.append(contentsOf: [
        MessageScrollerMessage(id: "n1", fromMe: false, texts: ["Are you there?"]),
        MessageScrollerMessage(id: "n2", fromMe: false, texts: ["The build is green."]),
        MessageScrollerMessage(id: "n3", fromMe: false, texts: ["Merging now."]),
      ])
    }
  }

  private func send() {
    let text = draft.trimmingCharacters(in: .whitespacesAndNewlines)
    guard !text.isEmpty else { return }
    messages.append(MessageScrollerMessage(id: "sent-\(UUID().uuidString)", fromMe: true, texts: [text]))
    draft = ""
    Task { @MainActor in
      controller.scrollToEnd()
    }
  }
}

private struct MessageScrollerLoadOlder: View {
  @State private var messages = MessageScrollerData.long(15, offset: 45)
  @State private var loading = false

  var body: some View {
    MessageScroller(messages, spacing: 16, onLoadOlder: loadOlder) { message in
      MessageScrollerRow(message: message)
    }
    .overlay(alignment: .top) {
      if loading {
        Spinner()
          .padding(.vertical, 8)
      }
    }
  }

  private var oldest: Int {
    Int(messages.first?.id.dropFirst() ?? "") ?? 0
  }

  private func loadOlder() {
    let oldest = oldest
    guard !loading, oldest > 0 else { return }
    loading = true
    Task {
      try? await Task.sleep(for: .milliseconds(800))
      messages.insert(
        contentsOf: MessageScrollerData.long(min(15, oldest), offset: max(0, oldest - 15)),
        at: 0
      )
      loading = false
    }
  }
}
