import PhosphorSwift
import SwiftUI

public struct ChatThread: View {
  struct Line: Identifiable, Equatable {
    let id: String
    let fromMe: Bool
    let text: String
    var liked = false
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

  static var opening: [Line] {
    [
      Line(id: "0", fromMe: false, text: "Is the weekend trip to the coast still on?"),
      Line(id: "1", fromMe: true, text: "Yes! We leave Friday evening"),
      Line(id: "2", fromMe: true, text: "I booked the boat tour, it leaves at 5 AM"),
      Line(id: "3", fromMe: false, text: "Great, I'll bring the camera"),
    ]
  }

  static let replies = [
    "Sounds good",
    "Great, see you then!",
    "Ha, absolutely",
    "Let me check and get back to you",
  ]

  private var onSend: ((String) -> Void)?
  private var onOpenContact: (() -> Void)?
  private var onAttach: (() -> Void)?
  private var onLikeChange: ((String, Bool) -> Void)?
  @State private var lines: [Line]
  @State private var typing: Bool
  @State private var draft: String
  @State private var replyCount = 0
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onSend: ((_ text: String) -> Void)? = nil,
    onAttach: (() -> Void)? = nil,
    onOpenContact: (() -> Void)? = nil,
    onLikeChange: ((_ id: String, _ liked: Bool) -> Void)? = nil
  ) {
    self.init(lines: Self.opening)
    self.onSend = onSend
    self.onOpenContact = onOpenContact
    self.onAttach = onAttach
    self.onLikeChange = onLikeChange
  }

  init(lines: [Line], typing: Bool = false, draft: String = "") {
    _lines = State(initialValue: lines)
    _typing = State(initialValue: typing)
    _draft = State(initialValue: draft)
  }

  public var body: some View {
    var entries: [Entry] = [.day] + lines.map(Entry.line)
    if typing { entries.append(.typing) }
    let ready = !draft.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    return Screen {
      Button {
        onOpenContact?()
      } label: {
        VStack(spacing: 4) {
          Text(verbatim: "RC")
            .font(.system(size: TextStyle.lg.size, weight: .semibold))
            .foregroundStyle(Color.onAccent)
            .frame(width: 48, height: 48)
            .background(Color.green, in: Circle())
          HStack(spacing: 2) {
            Text(verbatim: "Riley")
              .scaledFont(.xs, weight: .semibold)
            Ph.caretRight.bold
              .frame(width: 10, height: 10)
              .flipsForRightToLeftLayoutDirection(true)
          }
          .foregroundStyle(Color.label)
        }
        .frame(maxWidth: .infinity)
        .padding(.top, 8)
        .padding(.bottom, 10)
        .contentShape(Rectangle())
      }
      .buttonStyle(ChatThreadContactStyle())
      .accessibilityLabel(Text(verbatim: "Riley"))
      .accessibilityHint(Text("Show contact"))
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
          ChatThreadLine(line: line) {
            toggleLike(line.id)
          }
          .transition(.opacity.combined(with: .offset(y: 8)))
        case .typing:
          ChatThreadTyping()
        }
      }
      .accessibilityLabel(Text("Conversation with Riley"))
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
                .onSubmit(send)
              InputGroupAddon(align: .inlineEnd) {
                InputGroupButton(variant: .default, size: .iconXs, action: send) {
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

  private func toggleLike(_ id: String) {
    guard let index = lines.firstIndex(where: { $0.id == id }) else { return }
    withAnimation(reduceMotion ? nil : .spring(response: 0.3, dampingFraction: 0.6)) {
      lines[index].liked.toggle()
    }
    onLikeChange?(id, lines[index].liked)
  }

  private func send() {
    let text = draft.trimmingCharacters(in: .whitespacesAndNewlines)
    guard !text.isEmpty else { return }
    draft = ""
    onSend?(text)
    withAnimation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.7)) {
      lines.append(Line(id: String(lines.count), fromMe: true, text: text))
    }
    let reply = Self.replies[replyCount % Self.replies.count]
    replyCount += 1
    Task {
      try? await Task.sleep(for: .milliseconds(500))
      typing = true
      try? await Task.sleep(for: .milliseconds(1300))
      typing = false
      withAnimation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.7)) {
        lines.append(Line(id: String(lines.count), fromMe: false, text: reply))
      }
    }
  }
}

private struct ChatThreadLine: View {
  let line: ChatThread.Line
  let toggle: () -> Void

  var body: some View {
    Message(align: line.fromMe ? .end : .start) {
      MessageContent {
        Bubble(variant: line.fromMe ? .default : .muted, align: line.fromMe ? .end : .start) {
          BubbleContent(verbatim: line.text)
            .onTapGesture(count: 2, perform: toggle)
          if line.liked {
            BubbleReactions(side: .top, align: line.fromMe ? .start : .end) {
              Ph.heart.fill
                .frame(width: 13, height: 13)
                .foregroundStyle(Color.onAccent)
                .frame(width: 22, height: 22)
                .background(Color.accent, in: Circle())
                .padding(.horizontal, -6)
                .padding(.vertical, -2)
            }
            .transition(.scale)
          }
        }
      }
    }
    .accessibilityElement(children: .combine)
    .accessibilityValue(line.liked ? Text("Liked") : Text(verbatim: ""))
    .accessibilityAction(named: line.liked ? Text("Remove heart") : Text("Add heart"), toggle)
  }
}

private struct ChatThreadContactStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label.opacity(configuration.isPressed ? 0.6 : 1)
  }
}

private struct ChatThreadTyping: View {
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
