import PhosphorSwift
import SwiftUI

public struct ChatSupport: View {
  struct Line: Identifiable, Equatable {
    let id: String
    let fromMe: Bool
    let text: String
  }

  enum Entry: Identifiable {
    case line(Line)
    case typing

    var id: String {
      switch self {
      case .line(let line): line.id
      case .typing: "typing"
      }
    }
  }

  static let image = URL(string: "https://images.unsplash.com/photo-1634403665443-81dc4d75843a?w=900&q=80&auto=format&fit=crop")

  static let quick = [
    "Where's my order?",
    "Book a repair",
    "I want to return something",
  ]

  static let answers = [
    "Where's my order?": "Order W1048 has shipped. It arrives tomorrow between 10 AM and 2 PM.",
    "Book a repair": "The closest Help Desk is at suiss Union Square. Does tomorrow at 11:30 AM work?",
    "I want to return something": "You can return items free of charge within 14 days of delivery. Should I email you a return label?",
  ]

  static let fallback = "Got it. I'm connecting you with a Specialist, this may take a few minutes."

  static var greeting: Line {
    Line(id: "0", fromMe: false, text: "Hi Jamie, I'm the suiss Support assistant. How can I help?")
  }

  private var onSend: ((String) -> Void)?
  private var onAttach: (() -> Void)?
  private var onOpenChange: ((Bool) -> Void)?
  @State private var open: Bool
  @State private var lines: [Line]
  @State private var typing: Bool
  @State private var draft: String
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(
    onSend: ((_ text: String) -> Void)? = nil,
    onAttach: (() -> Void)? = nil,
    onOpenChange: ((_ open: Bool) -> Void)? = nil
  ) {
    self.init(open: true)
    self.onSend = onSend
    self.onAttach = onAttach
    self.onOpenChange = onOpenChange
  }

  init(open: Bool, asked: [String] = [], typing: Bool = false, draft: String = "") {
    var lines = [Self.greeting]
    for (index, question) in asked.enumerated() {
      lines.append(Line(id: "\(lines.count)", fromMe: true, text: question))
      if !typing || index < asked.count - 1 {
        lines.append(Line(id: "\(lines.count)", fromMe: false, text: Self.answers[question] ?? Self.fallback))
      }
    }
    _open = State(initialValue: open)
    _lines = State(initialValue: lines)
    _typing = State(initialValue: typing)
    _draft = State(initialValue: draft)
  }

  public var body: some View {
    Screen(background: .surfaceSecondary) {
      ZStack(alignment: .bottomTrailing) {
        KeyboardScrollView {
          hero
        }
        .accessibilityHidden(open)
        if open {
          panel
            .padding(12)
            .transition(
              reduceMotion
                ? .opacity
                : .scale(scale: 0.2, anchor: .bottomTrailing).combined(with: .opacity)
            )
            .zIndex(1)
        } else {
          Fab(accessibilityLabel: "Open chat", size: .lg) {
            open = true
          } icon: {
            Ph.chatCircle.fill
          }
          .padding(8)
          .transition(reduceMotion ? .opacity : .scale)
        }
      }
      .animation(reduceMotion ? nil : .spring(response: 0.45, dampingFraction: 0.72), value: open)
      .onChange(of: open) { _, value in onOpenChange?(value) }
    }
  }

  private var hero: some View {
    VStack(alignment: .leading, spacing: 0) {
      Text(verbatim: "suiss Support")
        .scaledFont(.lg, weight: .semibold)
        .foregroundStyle(Color.labelSecondary)
      Text("How can we help you?")
        .scaledTextStyle(.xl3, weight: .semibold)
        .padding(.top, 6)
        .accessibilityAddTraits(.isHeader)
      Color.control
        .overlay {
          AsyncImage(url: Self.image) { phase in
            if let image = phase.image {
              image.resizable().scaledToFill()
            }
          }
        }
        .frame(height: 220)
        .clipShape(RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous))
        .padding(.top, 24)
        .accessibilityLabel(Text("A phone resting on a soft beige surface"))
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .padding(.horizontal, 24)
    .padding(.vertical, 40)
  }

  private var panel: some View {
    var entries = lines.map(Entry.line)
    if typing { entries.append(.typing) }
    let ready = !draft.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    let remaining = Self.quick.filter { question in !lines.contains { $0.text == question } }
    let shape = RoundedRectangle(cornerRadius: 22, style: .continuous)
    return VStack(spacing: 0) {
      HStack(spacing: 10) {
        Text(verbatim: "s")
          .font(.system(size: TextStyle.base.size, weight: .bold))
          .foregroundStyle(Color.surface)
          .frame(width: 34, height: 34)
          .background(Color.label, in: Circle())
          .accessibilityHidden(true)
        VStack(alignment: .leading, spacing: 0) {
          Text(verbatim: "suiss Support")
            .scaledFont(.sm, weight: .semibold)
          HStack(spacing: 4) {
            Circle().frame(width: 6, height: 6)
            Text("Online")
          }
          .scaledFont(.xs2)
          .foregroundStyle(Color.success)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .accessibilityElement(children: .combine)
        Button {
          open = false
        } label: {
          Ph.x.bold.frame(width: 13, height: 13)
        }
        .buttonStyle(.variant(.secondary, size: .iconSm))
        .accessibilityLabel(Text("Close chat"))
      }
      .padding(.horizontal, 14)
      .padding(.vertical, 12)
      .overlay(alignment: .bottom) {
        Color.separator.frame(height: 1)
      }
      MessageScroller(entries, spacing: 4) { entry in
        switch entry {
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
          ChatSupportTyping()
        }
      }
      .accessibilityLabel(Text("Support conversation"))
      .frame(maxHeight: .infinity)
      if !remaining.isEmpty {
        ScrollView(.horizontal) {
          HStack(spacing: 6) {
            ForEach(remaining, id: \.self) { question in
              Button(LocalizedStringKey(question)) {
                ask(question)
              }
              .buttonStyle(.variant(.tinted, size: .sm))
            }
          }
          .padding(.horizontal, 14)
        }
        .scrollIndicators(.hidden)
        .padding(.bottom, 4)
      }
      HStack(spacing: 8) {
        Button {
          onAttach?()
        } label: {
          Ph.plus.bold.frame(width: 18, height: 18)
        }
        .buttonStyle(.variant(.secondary, size: .iconSm))
        .accessibilityLabel(Text("Add attachment"))
        InputGroup {
          InputGroupInput("Type your question", text: $draft)
            .submitLabel(.send)
            .onSubmit(submit)
          InputGroupAddon(align: .inlineEnd) {
            InputGroupButton(variant: .default, size: .iconXs, action: submit) {
              Ph.arrowUp.bold.frame(width: 14, height: 14)
            }
            .scaleEffect(ready ? 1 : 0)
            .disabled(!ready)
            .accessibilityLabel(Text("Send"))
            .animation(reduceMotion ? nil : .spring(response: 0.3, dampingFraction: 0.6), value: ready)
          }
        }
      }
      .padding(.horizontal, 12)
      .padding(.top, 8)
      .padding(.bottom, 12)
    }
    .environment(\.screenBackground, Color.surface)
    .frame(maxWidth: .infinity, maxHeight: 520)
    .background(Color.surface, in: shape)
    .clipShape(shape)
    .overlay {
      shape.strokeBorder(Color.separator, lineWidth: 0.5)
    }
    .shadow(Shadow.lg)
    .accessibilityElement(children: .contain)
    .accessibilityLabel(Text("suiss Support chat"))
    .accessibilityAddTraits(.isModal)
  }

  private func submit() {
    let text = draft.trimmingCharacters(in: .whitespacesAndNewlines)
    guard !text.isEmpty else { return }
    draft = ""
    ask(text)
  }

  private func ask(_ question: String) {
    onSend?(question)
    withAnimation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.7)) {
      lines.append(Line(id: String(lines.count), fromMe: true, text: question))
    }
    typing = true
    Task {
      try? await Task.sleep(for: .milliseconds(1200))
      typing = false
      withAnimation(reduceMotion ? nil : .timingCurve(0.32, 0.72, 0, 1, duration: 0.7)) {
        lines.append(Line(id: String(lines.count), fromMe: false, text: Self.answers[question] ?? Self.fallback))
      }
    }
  }
}

private struct ChatSupportTyping: View {
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
