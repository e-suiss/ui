import PhosphorSwift
import SwiftUI

public struct ChatConversations: View {
  struct Line: Identifiable, Equatable {
    let id: String
    let fromMe: Bool
    let text: String
  }

  struct Thread {
    let name: String
    let tint: Color
    let time: String
    let lines: [String]
  }

  enum Entry: Identifiable {
    case day
    case line(Line)
    case typing

    var id: String {
      switch self {
      case .day: "day"
      case .line(let line): line.id
      case .typing: "typing"
      }
    }
  }

  static var threads: [Thread] {
    [
      Thread(name: "Riley Chen", tint: .green, time: "9:41 AM", lines: [
        "them:Is the weekend trip to the coast still on?",
        "me:Yes! We leave Friday evening",
        "me:I booked the boat tour, it leaves at 5 AM",
        "them:Great, I'll bring the camera",
      ]),
      Thread(name: "Morgan Lee", tint: .orange, time: "8:12 AM", lines: [
        "them:I sent the deck, can you take a look?",
        "me:On it, back to you in 10 minutes",
      ]),
      Thread(name: "Family", tint: .purple, time: "Yesterday", lines: [
        "them:Is everyone coming for Sunday brunch?",
        "me:We'll be there",
        "them:I'll bring pastries",
      ]),
      Thread(name: "Taylor Kim", tint: .teal, time: "Monday", lines: [
        "them:What time does the game start?",
      ]),
    ]
  }

  static let replies = [
    "Sounds good",
    "Great, see you then!",
    "Ha, absolutely",
    "Let me check and get back to you",
  ]

  static func lines(_ thread: Thread, index: Int) -> [Line] {
    thread.lines.enumerated().map { offset, raw in
      let parts = raw.split(separator: ":", maxSplits: 1).map(String.init)
      return Line(id: "\(index)-\(offset)", fromMe: parts.first == "me", text: parts.last ?? "")
    }
  }

  private var onSend: ((String, String) -> Void)?
  private var onNewMessage: (() -> Void)?
  private var onDelete: ((String) -> Void)?
  private var onAttach: (() -> Void)?
  private var onVideoCall: ((String) -> Void)?
  private var onDetails: ((String) -> Void)?
  private var swiped: Int?
  @State private var conversations: [[Line]]
  @State private var visible: [Int]
  @State private var selected: Int?
  @State private var typing: Bool
  @State private var draft: String
  @State private var replyCount = 0
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onSend: ((_ text: String, _ conversation: String) -> Void)? = nil,
    onNewMessage: (() -> Void)? = nil,
    onDelete: ((_ conversation: String) -> Void)? = nil,
    onAttach: (() -> Void)? = nil,
    onVideoCall: ((_ conversation: String) -> Void)? = nil,
    onDetails: ((_ conversation: String) -> Void)? = nil
  ) {
    self.init(selected: nil)
    self.onSend = onSend
    self.onNewMessage = onNewMessage
    self.onDelete = onDelete
    self.onAttach = onAttach
    self.onVideoCall = onVideoCall
    self.onDetails = onDetails
  }

  init(selected: Int?, typing: Bool = false, draft: String = "", swiped: Int? = nil) {
    _conversations = State(initialValue: Self.threads.enumerated().map { Self.lines($1, index: $0) })
    _visible = State(initialValue: Array(Self.threads.indices))
    _selected = State(initialValue: selected)
    _typing = State(initialValue: typing)
    _draft = State(initialValue: draft)
    self.swiped = swiped
  }

  public var body: some View {
    ZStack {
      if let selected {
        detail(selected)
          .transition(.move(edge: .trailing))
          .zIndex(1)
      } else {
        list
          .transition(.move(edge: .leading))
      }
    }
    .animation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.35), value: selected)
  }

  private var list: some View {
    Screen {
      HeaderScrollView {
        HeaderLargeTitle("Messages")
        LazyVStack(spacing: 0) {
          ForEach(visible, id: \.self) { index in
            let thread = Self.threads[index]
            SwipeActions(revealed: swiped == index ? -88 : 0) {
              ChatConversationsRow(
                thread: thread,
                last: conversations[index].last?.text ?? "",
                separator: index != visible.last
              ) {
                typing = false
                draft = ""
                selected = index
              }
            } leading: {
              EmptyView()
            } trailing: {
              SwipeAction("Delete", icon: Ph.trash.fill, variant: .destructive, fullSwipe: true) {
                onDelete?(thread.name)
                withAnimation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.3)) {
                  visible.removeAll { $0 == index }
                }
              }
            }
          }
        }
        .padding(.bottom, 24)
      } header: {
        Header {
          HeaderTitle("Messages")
        } trailing: {
          HeaderActions {
            Button {
              onNewMessage?()
            } label: {
              Ph.notePencil.regular
                .frame(width: 22, height: 22)
                .foregroundStyle(Color.link)
            }
            .accessibilityLabel(Text("New message"))
          }
        }
      }
    }
  }

  private func detail(_ index: Int) -> some View {
    let thread = Self.threads[index]
    var entries: [Entry] = [.day] + conversations[index].map(Entry.line)
    if typing { entries.append(.typing) }
    let ready = !draft.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    return Screen {
      Header {
        HStack(spacing: 8) {
          ChatConversationsAvatar(name: thread.name, tint: thread.tint, size: 30)
          VStack(alignment: .leading, spacing: 0) {
            Text(verbatim: thread.name)
              .scaledFont(.sm, weight: .semibold)
              .foregroundStyle(Color.label)
            Text(typing ? "typing…" : "Message")
              .scaledFont(.xs2)
              .foregroundStyle(Color.labelSecondary)
              .contentTransition(.opacity)
          }
          .lineLimit(1)
        }
        .accessibilityElement(children: .combine)
      } leading: {
        HeaderBack("Messages") {
          selected = nil
        }
      } trailing: {
        HeaderActions {
          Button {
            onVideoCall?(thread.name)
          } label: {
            Ph.videoCamera.regular.frame(width: 22, height: 22)
          }
          .accessibilityLabel(Text("Video call"))
          Button {
            onDetails?(thread.name)
          } label: {
            Ph.info.regular.frame(width: 22, height: 22)
          }
          .accessibilityLabel(Text("Details"))
        }
        .foregroundStyle(Color.link)
      }
      .overlay(alignment: .bottom) {
        Color.separator.frame(height: 1)
      }
      MessageScroller(entries, spacing: 4) { entry in
        switch entry {
        case .day:
          Text("Today 9:30 AM")
            .scaledFont(.xs2)
            .foregroundStyle(Color.labelSecondary)
            .frame(maxWidth: .infinity)
            .padding(.top, 4)
            .padding(.bottom, 10)
        case .line(let line):
          Message(align: line.fromMe ? .end : .start) {
            MessageContent {
              Bubble(variant: line.fromMe ? .default : .muted, align: line.fromMe ? .end : .start) {
                BubbleContent(verbatim: line.text)
              }
            }
          }
          .transition(.opacity.combined(with: .offset(y: 8)))
        case .typing:
          ChatConversationsTyping()
        }
      }
      .accessibilityLabel(Text("Conversation with \(thread.name)"))
      .frame(maxHeight: .infinity)
      BottomBar {
        BottomBarContent {
          HStack(spacing: 8) {
            Button {
              onAttach?()
            } label: {
              Ph.plus.bold.frame(width: 18, height: 18)
            }
            .buttonStyle(.variant(.secondary, size: .iconSm))
            .accessibilityLabel(Text("Add attachment"))
            InputGroup {
              InputGroupInput("Message", text: $draft)
                .submitLabel(.send)
                .onSubmit { send(index) }
              InputGroupAddon(align: .inlineEnd) {
                InputGroupButton(variant: .default, size: .iconXs) {
                  send(index)
                } label: {
                  Ph.arrowUp.bold.frame(width: 14, height: 14)
                }
                .scaleEffect(ready ? 1 : 0)
                .disabled(!ready)
                .accessibilityLabel(Text("Send"))
                .animation(reduceMotion ? nil : .spring(response: 0.3, dampingFraction: 0.6), value: ready)
              }
            }
          }
        }
      }
    }
  }

  private func send(_ index: Int) {
    let text = draft.trimmingCharacters(in: .whitespacesAndNewlines)
    guard !text.isEmpty else { return }
    draft = ""
    onSend?(text, Self.threads[index].name)
    withAnimation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.7)) {
      conversations[index].append(Line(id: "\(index)-\(conversations[index].count)", fromMe: true, text: text))
    }
    let reply = Self.replies[replyCount % Self.replies.count]
    replyCount += 1
    Task {
      try? await Task.sleep(for: .milliseconds(500))
      typing = true
      try? await Task.sleep(for: .milliseconds(1300))
      typing = false
      withAnimation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.7)) {
        conversations[index].append(Line(id: "\(index)-\(conversations[index].count)", fromMe: false, text: reply))
      }
    }
  }
}

private struct ChatConversationsAvatar: View {
  let name: String
  let tint: Color
  let size: CGFloat

  var body: some View {
    Text(verbatim: name.split(separator: " ").compactMap(\.first).prefix(2).map(String.init).joined())
      .font(.system(size: size * 0.38, weight: .semibold))
      .foregroundStyle(Color.onAccent)
      .frame(width: size, height: size)
      .background(tint, in: Circle())
      .accessibilityHidden(true)
  }
}

private struct ChatConversationsRow: View {
  let thread: ChatConversations.Thread
  let last: String
  let separator: Bool
  let action: () -> Void

  var body: some View {
    Button(action: action) {
      HStack(alignment: .top, spacing: 12) {
        ChatConversationsAvatar(name: thread.name, tint: thread.tint, size: 44)
        VStack(alignment: .leading, spacing: 2) {
          HStack(spacing: 6) {
            Text(verbatim: thread.name)
              .scaledFont(.base, weight: .semibold)
              .foregroundStyle(Color.label)
              .lineLimit(1)
              .frame(maxWidth: .infinity, alignment: .leading)
            Text(LocalizedStringKey(thread.time))
              .scaledFont(.sm)
              .foregroundStyle(Color.labelSecondary)
            Ph.caretRight.bold
              .frame(width: 12, height: 12)
              .foregroundStyle(Color.labelTertiary)
              .flipsForRightToLeftLayoutDirection(true)
          }
          Text(verbatim: last)
            .scaledFont(.sm)
            .foregroundStyle(Color.labelSecondary)
            .lineLimit(2, reservesSpace: true)
            .multilineTextAlignment(.leading)
        }
        .padding(.bottom, 12)
        .overlay(alignment: .bottom) {
          if separator {
            Color.separator.frame(height: 1)
          }
        }
      }
      .padding(.top, 12)
      .padding(.horizontal, 16)
      .contentShape(Rectangle())
    }
    .buttonStyle(ChatConversationsRowStyle())
    .accessibilityElement(children: .combine)
  }
}

private struct ChatConversationsRowStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .background(configuration.isPressed ? Color.itemPressed : .clear)
  }
}

private struct ChatConversationsTyping: View {
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  var body: some View {
    Message {
      MessageContent {
        Bubble(variant: .muted) {
          BubbleContent {
            TimelineView(.animation(paused: reduceMotion)) { context in
              let time = context.date.timeIntervalSinceReferenceDate
              HStack(spacing: 4) {
                ForEach(0..<3, id: \.self) { dot in
                  Circle()
                    .fill(Color.labelTertiary)
                    .frame(width: 8, height: 8)
                    .opacity(reduceMotion ? 1 : 0.55 + 0.45 * abs(sin((time - Double(dot) * 0.18) * .pi / 1.1)))
                }
              }
              .padding(.vertical, 6)
            }
          }
        }
      }
    }
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(Text("Typing"))
  }
}
