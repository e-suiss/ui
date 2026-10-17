import PhosphorSwift
import SwiftUI
import UIKit

public enum CodeBlockVariant: CaseIterable, Sendable {
  case `default`, destructive
}

public enum CodeBlockSize: CaseIterable, Sendable {
  case `default`, sm

  var padding: CGFloat { self == .sm ? 12 : 16 }
  var radius: CGFloat { self == .sm ? 12 : 18 }
  var text: TextStyle { self == .sm ? .xs : .sm }
}

public enum CodeBlockLineVariant: Sendable {
  case `default`, added, removed, highlighted
}

public struct CodeBlockLine: Identifiable, Sendable {
  public let id = UUID()
  public let text: String
  public let variant: CodeBlockLineVariant

  public init(_ text: String, variant: CodeBlockLineVariant = .default) {
    self.text = text
    self.variant = variant
  }
}

extension EnvironmentValues {
  @Entry var codeBlockVariant: CodeBlockVariant = .default
  @Entry var codeBlockSize: CodeBlockSize = .default
}

public struct CodeBlock<Content: View>: View {
  let variant: CodeBlockVariant
  let size: CodeBlockSize
  let content: Content

  public init(
    _ variant: CodeBlockVariant = .default,
    size: CodeBlockSize = .default,
    @ViewBuilder content: () -> Content
  ) {
    self.variant = variant
    self.size = size
    self.content = content()
  }

  public var body: some View {
    let destructive = variant == .destructive
    VStack(alignment: .leading, spacing: 0) {
      content
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .background(destructive ? EsuissColor.destructive.opacity(0.06) : EsuissColor.muted)
    .clipShape(.rect(cornerRadius: size.radius))
    .overlay {
      RoundedRectangle(cornerRadius: size.radius)
        .strokeBorder(destructive ? EsuissColor.destructive.opacity(0.18) : EsuissColor.foreground.opacity(0.06), lineWidth: 1)
    }
    .environment(\.codeBlockVariant, variant)
    .environment(\.codeBlockSize, size)
  }
}

public struct CodeBlockHeader<Content: View>: View {
  let content: Content

  @Environment(\.codeBlockSize) private var size
  @Environment(\.codeBlockVariant) private var variant

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    HStack(spacing: 8) {
      content
    }
    .foregroundStyle(variant == .destructive ? EsuissColor.destructive : EsuissColor.mutedForeground)
    .padding(.horizontal, size.padding)
    .padding(.top, size.padding)
  }
}

public struct CodeBlockTitle: View {
  let text: Text

  @Environment(\.codeBlockSize) private var size
  @Environment(\.codeBlockVariant) private var variant

  public init(_ title: LocalizedStringKey) {
    self.text = Text(title)
  }

  public init(verbatim title: String) {
    self.text = Text(verbatim: title)
  }

  public var body: some View {
    text
      .scaledTextStyle(size.text, weight: .medium)
      .foregroundStyle(variant == .destructive ? EsuissColor.destructive : EsuissColor.foreground)
      .lineLimit(1)
  }
}

public struct CodeBlockActions<Content: View>: View {
  let content: Content

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    HStack(spacing: 4) {
      content
    }
    .frame(maxWidth: .infinity, alignment: .trailing)
  }
}

public struct CodeBlockCopyButton: View {
  let value: String

  @State private var copied = false

  public init(value: String) {
    self.value = value
  }

  public var body: some View {
    Button {
      UIPasteboard.general.string = value
      copied = true
      Task {
        try? await Task.sleep(for: .seconds(2))
        copied = false
      }
    } label: {
      Group {
        if copied { Ph.check.regular } else { Ph.copy.regular }
      }
      .frame(width: 14, height: 14)
      .foregroundStyle(EsuissColor.mutedForeground)
      .frame(width: 24, height: 24)
      .contentShape(Rectangle())
    }
    .buttonStyle(.plain)
    .accessibilityLabel(copied ? "Copied" : "Copy")
  }
}

public struct CodeBlockContent: View {
  let lines: [CodeBlockLine]
  let language: String?
  let wrap: Bool
  let lineNumbers: Bool
  let startLine: Int

  @Environment(\.codeBlockSize) private var size
  @Environment(\.codeBlockVariant) private var variant

  public init(
    _ code: String,
    language: String? = nil,
    wrap: Bool = false,
    lineNumbers: Bool = false,
    startLine: Int = 1
  ) {
    let trimmed = code.hasSuffix("\n") ? String(code.dropLast()) : code
    self.lines = trimmed.components(separatedBy: "\n").map { CodeBlockLine($0) }
    self.language = language
    self.wrap = wrap
    self.lineNumbers = lineNumbers
    self.startLine = startLine
  }

  public init(
    lines: [CodeBlockLine],
    language: String? = nil,
    wrap: Bool = false,
    lineNumbers: Bool = false,
    startLine: Int = 1
  ) {
    self.lines = lines
    self.language = language
    self.wrap = wrap
    self.lineNumbers = lineNumbers
    self.startLine = startLine
  }

  public var body: some View {
    let body = VStack(alignment: .leading, spacing: 0) {
      ForEach(Array(lines.enumerated()), id: \.element.id) { index, line in
        row(line, number: startLine + index)
      }
    }
    .padding(.vertical, size.padding)
    Group {
      if wrap {
        body
      } else {
        ScrollView(.horizontal, showsIndicators: false) { body }
      }
    }
    .font(.system(size: size == .sm ? 12 : 14, design: .monospaced))
    .foregroundStyle(variant == .destructive ? EsuissColor.destructive : EsuissColor.foreground)
  }

  @ViewBuilder
  private func row(_ line: CodeBlockLine, number: Int) -> some View {
    HStack(alignment: .firstTextBaseline, spacing: 12) {
      if lineNumbers {
        Text(verbatim: "\(number)")
          .foregroundStyle(EsuissColor.mutedForeground)
          .frame(minWidth: 24, alignment: .trailing)
          .accessibilityHidden(true)
      }
      Text(CodeHighlighter.highlight(line.text.isEmpty ? " " : line.text, language: language))
        .fixedSize(horizontal: !wrap, vertical: true)
        .frame(maxWidth: wrap ? .infinity : nil, alignment: .leading)
    }
    .padding(.horizontal, size.padding)
    .frame(maxWidth: .infinity, alignment: .leading)
    .background(background(line.variant))
    .overlay(alignment: .leading) {
      if let mark = mark(line.variant) {
        Text(verbatim: mark)
          .foregroundStyle(line.variant == .removed ? EsuissColor.destructive : EsuissColor.mutedForeground)
          .padding(.leading, 4)
          .accessibilityHidden(true)
      }
    }
  }

  private func mark(_ variant: CodeBlockLineVariant) -> String? {
    switch variant {
    case .added: "+"
    case .removed: "−"
    default: nil
    }
  }

  private func background(_ variant: CodeBlockLineVariant) -> Color {
    switch variant {
    case .default: .clear
    case .removed: EsuissColor.destructive.opacity(0.1)
    case .added, .highlighted: EsuissColor.foreground.opacity(0.05)
    }
  }
}

public struct CodeBlockFooter<Content: View>: View {
  let content: Content

  @Environment(\.codeBlockSize) private var size

  public init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  public var body: some View {
    HStack(spacing: 8) {
      content
    }
    .scaledTextStyle(.xs)
    .foregroundStyle(EsuissColor.mutedForeground)
    .padding(.horizontal, size.padding)
    .padding(.bottom, size.padding)
  }
}

enum CodeHighlighter {
  private static let keywords: [String: Set<String>] = [
    "script": ["as", "async", "await", "break", "case", "catch", "class", "const", "continue", "default", "delete", "do", "else", "export", "extends", "false", "finally", "for", "from", "function", "if", "import", "in", "instanceof", "interface", "let", "new", "null", "of", "return", "satisfies", "static", "super", "switch", "this", "throw", "true", "try", "type", "typeof", "undefined", "var", "void", "while", "yield"],
    "json": ["true", "false", "null"],
    "shell": ["cd", "do", "done", "echo", "elif", "else", "esac", "export", "fi", "for", "if", "in", "npm", "npx", "pnpm", "then", "while"],
    "python": ["and", "as", "class", "def", "elif", "else", "False", "for", "from", "if", "import", "in", "is", "None", "not", "or", "pass", "return", "True", "while", "with", "yield"],
    "swift": ["case", "class", "else", "enum", "extension", "false", "for", "func", "guard", "if", "import", "in", "let", "nil", "private", "protocol", "public", "return", "self", "static", "struct", "switch", "true", "var", "where", "while"],
    "kotlin": ["class", "data", "else", "enum", "false", "for", "fun", "if", "import", "in", "is", "null", "object", "package", "private", "return", "true", "val", "var", "when", "while"],
  ]

  private static let languages: [String: String] = [
    "bash": "shell", "js": "script", "javascript": "script", "json": "json", "jsx": "script",
    "kotlin": "kotlin", "kt": "kotlin", "py": "python", "python": "python", "sh": "shell",
    "shell": "shell", "swift": "swift", "ts": "script", "tsx": "script", "typescript": "script",
    "yaml": "shell", "yml": "shell",
  ]

  private static let token = try? NSRegularExpression(
    pattern: #"("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)"#
  )

  static func highlight(_ line: String, language: String?) -> AttributedString {
    guard let language, let group = languages[language.lowercased()], let token else {
      return AttributedString(line)
    }
    let words = keywords[group] ?? []
    let marker = group == "shell" || group == "python" ? "#" : "//"
    let comment = line.range(of: marker)
    let code = comment.map { String(line[..<$0.lowerBound]) } ?? line
    var result = AttributedString()
    var last = code.startIndex
    let nsRange = NSRange(code.startIndex..., in: code)
    for match in token.matches(in: code, range: nsRange) {
      guard let range = Range(match.range, in: code) else { continue }
      if range.lowerBound > last { result += AttributedString(String(code[last..<range.lowerBound])) }
      var piece = AttributedString(String(code[range]))
      if match.range(at: 1).location != NSNotFound {
        piece.foregroundColor = EsuissColor.chart2
      } else if match.range(at: 2).location != NSNotFound {
        piece.foregroundColor = EsuissColor.chart4
      } else if words.contains(String(code[range])) {
        piece.foregroundColor = EsuissColor.chart3
      }
      result += piece
      last = range.upperBound
    }
    if last < code.endIndex { result += AttributedString(String(code[last...])) }
    if let comment {
      var piece = AttributedString(String(line[comment.lowerBound...]))
      piece.foregroundColor = EsuissColor.mutedForeground
      result += piece
    }
    return result
  }
}
