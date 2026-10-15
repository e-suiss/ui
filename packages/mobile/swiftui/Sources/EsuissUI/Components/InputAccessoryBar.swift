import PhosphorSwift
import SwiftUI

struct FocusChain<Value: Hashable> {
  let order: [Value]

  func next(after value: Value?) -> Value? {
    guard let value, let index = order.firstIndex(of: value) else { return order.first }
    let target = order.index(after: index)
    return target < order.endIndex ? order[target] : nil
  }

  func previous(before value: Value?) -> Value? {
    guard let value, let index = order.firstIndex(of: value) else { return nil }
    return index > order.startIndex ? order[order.index(before: index)] : nil
  }
}

public struct InputAccessoryBar: View {
  let previousLabel: LocalizedStringKey
  let nextLabel: LocalizedStringKey
  let doneLabel: LocalizedStringKey
  let onPrevious: (() -> Void)?
  let onNext: (() -> Void)?
  let onDone: () -> Void

  public init(
    previousLabel: LocalizedStringKey = "Previous",
    nextLabel: LocalizedStringKey = "Next",
    doneLabel: LocalizedStringKey = "Done",
    onPrevious: (() -> Void)? = nil,
    onNext: (() -> Void)? = nil,
    onDone: @escaping () -> Void
  ) {
    self.previousLabel = previousLabel
    self.nextLabel = nextLabel
    self.doneLabel = doneLabel
    self.onPrevious = onPrevious
    self.onNext = onNext
    self.onDone = onDone
  }

  public var body: some View {
    HStack(spacing: 0) {
      arrow(Ph.caretUp.bold, label: previousLabel, action: onPrevious)
      arrow(Ph.caretDown.bold, label: nextLabel, action: onNext)
      Spacer(minLength: 0)
      Button(action: onDone) {
        Text(doneLabel)
          .scaledFont(.base, weight: .semibold)
          .foregroundStyle(EsuissColor.primary)
          .padding(.horizontal, 16)
          .frame(minHeight: 44)
          .contentShape(Rectangle())
      }
      .buttonStyle(.plain)
    }
    .padding(.horizontal, 4)
    .frame(height: 44)
    .frame(maxWidth: .infinity)
    .background(EsuissColor.muted)
    .overlay(alignment: .top) {
      EsuissColor.border.frame(height: 1)
    }
    .accessibilityElement(children: .contain)
  }

  private func arrow(_ icon: Image, label: LocalizedStringKey, action: (() -> Void)?) -> some View {
    Button {
      action?()
    } label: {
      EmptyView()
    }
    .buttonStyle(PressReader { pressed in
      icon
        .frame(width: 18, height: 18)
        .foregroundStyle(EsuissColor.primary)
        .opacity(action == nil ? 0.5 : (pressed ? 0.8 : 1))
        .frame(width: 44, height: 44)
        .contentShape(Rectangle())
    })
    .disabled(action == nil)
    .accessibilityLabel(Text(label))
  }
}

private struct InputAccessoryBarModifier<Value: Hashable>: ViewModifier {
  let focus: FocusState<Value?>.Binding
  let chain: FocusChain<Value>
  let previousLabel: LocalizedStringKey
  let nextLabel: LocalizedStringKey
  let doneLabel: LocalizedStringKey

  func body(content: Content) -> some View {
    let current = focus.wrappedValue
    let previous = chain.previous(before: current)
    let next = chain.next(after: current)
    content
      .onSubmit {
        focus.wrappedValue = chain.next(after: focus.wrappedValue)
      }
      .safeAreaInset(edge: .bottom, spacing: 0) {
        if let current, chain.order.contains(current) {
          InputAccessoryBar(
            previousLabel: previousLabel,
            nextLabel: nextLabel,
            doneLabel: doneLabel,
            onPrevious: previous.map { target in { focus.wrappedValue = target } },
            onNext: next.map { target in { focus.wrappedValue = target } },
            onDone: { focus.wrappedValue = nil }
          )
          .transition(.opacity)
        }
      }
  }
}

extension View {
  public func inputAccessoryBar<Value: Hashable>(
    focus: FocusState<Value?>.Binding,
    order: [Value],
    previousLabel: LocalizedStringKey = "Previous",
    nextLabel: LocalizedStringKey = "Next",
    doneLabel: LocalizedStringKey = "Done"
  ) -> some View {
    modifier(
      InputAccessoryBarModifier(
        focus: focus,
        chain: FocusChain(order: order),
        previousLabel: previousLabel,
        nextLabel: nextLabel,
        doneLabel: doneLabel
      )
    )
  }
}
