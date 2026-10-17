import PhosphorSwift
import SwiftUI

public enum TraceStatus: Sendable {
  case running, error, pending
}

extension EnvironmentValues {
  @Entry var traceStatus: TraceStatus?
}

public struct Trace<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      content
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}

public struct TraceLine<Content: View>: View {
  let status: TraceStatus?
  let content: Content

  public init(status: TraceStatus? = nil, @ViewBuilder content: () -> Content) {
    self.status = status
    self.content = content()
  }

  public var body: some View {
    HStack(spacing: 8) {
      content
    }
    .scaledTextStyle(.sm)
    .foregroundStyle(status == .error ? EsuissColor.destructive : EsuissColor.mutedForeground)
    .opacity(status == .pending ? 0.6 : 1)
    .lineLimit(1)
    .environment(\.traceStatus, status)
    .accessibilityElement(children: .combine)
  }
}

public struct TraceIcon<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    content
      .frame(width: 16, height: 16)
      .accessibilityHidden(true)
  }
}

public struct TraceTitle: View {
  let text: Text

  @Environment(\.traceStatus) private var status
  @Environment(\.accessibilityReduceMotion) private var reduceMotion
  @State private var dimmed = false

  public init(_ title: LocalizedStringKey) {
    self.text = Text(title)
  }

  public init(verbatim title: String) {
    self.text = Text(verbatim: title)
  }

  public var body: some View {
    let running = status == .running && !reduceMotion
    text
      .truncationMode(.tail)
      .opacity(running && dimmed ? 0.45 : 1)
      .animation(running ? .easeInOut(duration: 0.9).repeatForever(autoreverses: true) : .default, value: dimmed)
      .onAppear { dimmed = running }
      .onChange(of: running) { _, value in dimmed = value }
  }
}

public struct TraceDescription: View {
  let text: Text

  public init(_ description: LocalizedStringKey) {
    self.text = Text(description)
  }

  public init(verbatim description: String) {
    self.text = Text(verbatim: description)
  }

  public var body: some View {
    text
      .monospacedDigit()
      .opacity(0.7)
      .fixedSize()
  }
}

public struct TraceCollapsible<Content: View>: View {
  let external: Binding<Bool>?
  let content: Content

  @State private var local: Bool
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(isExpanded: Binding<Bool>, @ViewBuilder content: () -> Content) {
    self.external = isExpanded
    self._local = State(initialValue: false)
    self.content = content()
  }

  public init(initiallyExpanded: Bool = false, @ViewBuilder content: () -> Content) {
    self.external = nil
    self._local = State(initialValue: initiallyExpanded)
    self.content = content()
  }

  public var body: some View {
    let binding = external ?? $local
    let animation: Animation = reduceMotion ? .linear(duration: 0.15) : .easeInOut(duration: 0.2)
    VStack(alignment: .leading, spacing: 0) {
      content
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .environment(
      \.collapsible,
      CollapsibleContext(
        isExpanded: binding.wrappedValue,
        toggle: { withAnimation(animation) { binding.wrappedValue.toggle() } }
      )
    )
  }
}

public struct TraceCollapsibleTrigger<Label: View>: View {
  let label: Label

  @Environment(\.collapsible) private var collapsible

  public init(@ViewBuilder label: () -> Label) {
    self.label = label()
  }

  public var body: some View {
    Button {
      collapsible.toggle()
    } label: {
      HStack(spacing: 4) {
        label
        Ph.caretRight.regular
          .frame(width: 16, height: 16)
          .foregroundStyle(EsuissColor.mutedForeground)
          .rotationEffect(.degrees(collapsible.isExpanded ? 90 : 0))
          .environment(\.layoutDirection, .leftToRight)
          .accessibilityHidden(true)
      }
      .contentShape(Rectangle())
    }
    .buttonStyle(.plain)
    .accessibilityValue(Text(collapsible.isExpanded ? "Expanded" : "Collapsed"))
  }
}

public struct TraceCollapsibleContent<Content: View>: View {
  let content: Content

  @Environment(\.collapsible) private var collapsible
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    if collapsible.isExpanded {
      VStack(alignment: .leading, spacing: 8) {
        content
      }
      .scaledTextStyle(.sm)
      .foregroundStyle(EsuissColor.mutedForeground)
      .lineSpacing(4)
      .frame(maxWidth: .infinity, alignment: .leading)
      .padding(.leading, 16)
      .padding(.trailing, 4)
      .overlay(alignment: .leading) {
        Rectangle().fill(EsuissColor.border).frame(width: 1)
      }
      .padding(.leading, 7)
      .padding(.top, 8)
      .padding(.bottom, 4)
      .transition(reduceMotion ? .opacity : .opacity.combined(with: .offset(y: -8)))
    }
  }
}
