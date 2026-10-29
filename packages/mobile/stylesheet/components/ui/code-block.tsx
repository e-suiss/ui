import { setStringAsync } from "expo-clipboard"
import { CheckIcon, CopyIcon } from "phosphor-react-native"
import * as React from "react"
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  type TextStyle,
  View,
  type ViewProps,
} from "react-native"
import { Icon, IconSizeContext } from "@/components/ui/icon"
import { Text, TextStyleContext } from "@/components/ui/text"
import {
  fontSize,
  radius,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

type CodeBlockSize = "default" | "sm"
type CodeBlockVariant = "default" | "destructive"
type CodeBlockLineVariant = "default" | "added" | "removed" | "highlighted"
type TokenKind = "plain" | "keyword" | "string" | "number" | "comment"

const KEYWORDS: Record<string, string[]> = {
  script: [
    "as",
    "async",
    "await",
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "default",
    "delete",
    "do",
    "else",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "from",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "interface",
    "let",
    "new",
    "null",
    "of",
    "return",
    "satisfies",
    "static",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "type",
    "typeof",
    "undefined",
    "var",
    "void",
    "while",
    "yield",
  ],
  json: ["true", "false", "null"],
  shell: [
    "cd",
    "do",
    "done",
    "echo",
    "elif",
    "else",
    "esac",
    "export",
    "fi",
    "for",
    "if",
    "in",
    "npm",
    "npx",
    "pnpm",
    "then",
    "while",
  ],
  python: [
    "and",
    "as",
    "class",
    "def",
    "elif",
    "else",
    "False",
    "for",
    "from",
    "if",
    "import",
    "in",
    "is",
    "None",
    "not",
    "or",
    "pass",
    "return",
    "True",
    "while",
    "with",
    "yield",
  ],
  swift: [
    "case",
    "class",
    "else",
    "enum",
    "extension",
    "false",
    "for",
    "func",
    "guard",
    "if",
    "import",
    "in",
    "let",
    "nil",
    "private",
    "protocol",
    "public",
    "return",
    "self",
    "static",
    "struct",
    "switch",
    "true",
    "var",
    "where",
    "while",
  ],
  kotlin: [
    "class",
    "data",
    "else",
    "enum",
    "false",
    "for",
    "fun",
    "if",
    "import",
    "in",
    "is",
    "null",
    "object",
    "package",
    "private",
    "return",
    "true",
    "val",
    "var",
    "when",
    "while",
  ],
}

const LANGUAGES: Record<string, keyof typeof KEYWORDS> = {
  bash: "shell",
  js: "script",
  javascript: "script",
  json: "json",
  jsx: "script",
  kotlin: "kotlin",
  kt: "kotlin",
  py: "python",
  python: "python",
  sh: "shell",
  shell: "shell",
  swift: "swift",
  ts: "script",
  tsx: "script",
  typescript: "script",
  yaml: "shell",
  yml: "shell",
}

const HASH_COMMENTS = new Set(["shell", "python"])
const TOKEN =
  /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/g
const TRAILING_NEWLINE = /\n$/

function tokenize(line: string, language?: string) {
  const group = language ? LANGUAGES[language.toLowerCase()] : undefined
  if (!group) return [{ kind: "plain" as TokenKind, text: line }]
  const keywords = new Set(KEYWORDS[group])
  const marker = HASH_COMMENTS.has(group) ? "#" : "//"
  const comment = line.indexOf(marker)
  const code = comment >= 0 ? line.slice(0, comment) : line
  const tokens: { kind: TokenKind; text: string }[] = []
  let last = 0
  for (const match of code.matchAll(TOKEN)) {
    const [text, string, number, word] = match
    const index = match.index ?? 0
    if (index > last)
      tokens.push({ kind: "plain", text: code.slice(last, index) })
    let kind: TokenKind = "plain"
    if (string) kind = "string"
    else if (number) kind = "number"
    else if (word && keywords.has(word)) kind = "keyword"
    tokens.push({ kind, text })
    last = index + text.length
  }
  if (last < code.length) tokens.push({ kind: "plain", text: code.slice(last) })
  if (comment >= 0) tokens.push({ kind: "comment", text: line.slice(comment) })
  return tokens
}

const MONO = Platform.select({ ios: "Menlo", default: "monospace" })

function tokenColor(kind: TokenKind, colors: ThemeColors) {
  if (kind === "keyword") return colors.chart3
  if (kind === "string") return colors.chart2
  if (kind === "number") return colors.chart4
  if (kind === "comment") return colors.mutedForeground
  return undefined
}

function lineBackground(variant: CodeBlockLineVariant, colors: ThemeColors) {
  if (variant === "removed") return `${colors.destructive}1a`
  if (variant === "default") return undefined
  return `${colors.foreground}0d`
}

const CodeBlockContext = React.createContext<{
  size: CodeBlockSize
  variant: CodeBlockVariant
}>({ size: "default", variant: "default" })

const CodeBlockLineContext = React.createContext<{
  number?: number
  numbered: boolean
}>({ numbered: false })

const LINE_MARKS: Partial<Record<CodeBlockLineVariant, string>> = {
  added: "+",
  removed: "−",
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    minWidth: 0,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius["2xl"],
  },
  rootSm: { borderRadius: radius.xl },
  header: { flexDirection: "row", alignItems: "center", gap: 8 },
  actions: {
    marginStart: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  copy: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
  },
  content: { minHeight: 0, minWidth: 0 },
  body: { minWidth: "100%" },
  line: { position: "relative", minWidth: "100%", flexDirection: "row" },
  mark: { position: "absolute", start: 4 },
  number: { marginEnd: 12, minWidth: 24, textAlign: "right" },
  code: { minWidth: 0, flexShrink: 1 },
  footer: { flexDirection: "row", alignItems: "center", gap: 8 },
})

function CodeBlock({
  style,
  variant = "default",
  size = "default",
  ...props
}: ViewProps & { variant?: CodeBlockVariant; size?: CodeBlockSize }) {
  const { colors, isDark } = useTheme()
  const destructive = variant === "destructive"
  const text: TextStyle = {
    ...(size === "sm" ? fontSize.xs : fontSize.sm),
    fontFamily: MONO,
    color: destructive ? colors.destructive : colors.foreground,
  }
  return (
    <CodeBlockContext.Provider value={{ size, variant }}>
      <TextStyleContext.Provider value={text}>
        <View
          style={[
            styles.root,
            size === "sm" && styles.rootSm,
            destructive
              ? {
                  backgroundColor: `${colors.destructive}${isDark ? "1a" : "0d"}`,
                  borderColor: `${colors.destructive}33`,
                }
              : {
                  backgroundColor: colors.muted,
                  borderColor: `${colors.foreground}${isDark ? "1a" : "0d"}`,
                },
            style,
          ]}
          {...props}
        />
      </TextStyleContext.Provider>
    </CodeBlockContext.Provider>
  )
}

function CodeBlockHeader({ style, ...props }: ViewProps) {
  const { size } = React.useContext(CodeBlockContext)
  return (
    <IconSizeContext.Provider value={16}>
      <View
        style={[
          styles.header,
          size === "sm"
            ? { paddingHorizontal: 12, paddingTop: 12 }
            : { paddingHorizontal: 16, paddingTop: 16 },
          style,
        ]}
        {...props}
      />
    </IconSizeContext.Provider>
  )
}

function CodeBlockTitle({
  style,
  ...props
}: React.ComponentProps<typeof Text>) {
  const { colors } = useTheme()
  const { size, variant } = React.useContext(CodeBlockContext)
  return (
    <Text
      numberOfLines={1}
      style={[
        size === "sm" ? fontSize.xs : fontSize.sm,
        {
          minWidth: 0,
          flexShrink: 1,
          fontFamily: undefined,
          fontWeight: "500",
          color:
            variant === "destructive" ? colors.destructive : colors.foreground,
        },
        style,
      ]}
      {...props}
    />
  )
}

function CodeBlockActions({ style, ...props }: ViewProps) {
  return <View style={[styles.actions, style]} {...props} />
}

function CodeBlockCopyButton({
  value,
  style,
  onPress,
  ...props
}: Omit<React.ComponentProps<typeof Pressable>, "children" | "style"> & {
  value: string
  style?: ViewProps["style"]
}) {
  const { colors } = useTheme()
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={copied ? "Copied" : "Copy"}
      hitSlop={8}
      style={({ pressed }) => [
        styles.copy,
        pressed && { backgroundColor: `${colors.foreground}1a` },
        style,
      ]}
      onPress={(event) => {
        onPress?.(event)
        setStringAsync(value)
          .then(() => setCopied(true))
          .catch(() => undefined)
      }}
      {...props}
    >
      <Icon
        as={copied ? CheckIcon : CopyIcon}
        size={14}
        color={colors.mutedForeground}
      />
    </Pressable>
  )
}

function CodeBlockContent({
  style,
  children,
  wrap = false,
  lineNumbers = false,
  startLine = 1,
  language,
  ...props
}: ViewProps & {
  wrap?: boolean
  lineNumbers?: boolean
  startLine?: number
  language?: string
}) {
  const { colors } = useTheme()
  const { size } = React.useContext(CodeBlockContext)
  const lines =
    typeof children === "string"
      ? children
          .replace(TRAILING_NEWLINE, "")
          .split("\n")
          .map((line, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: lines are positional
            <CodeBlockLine key={index}>
              {tokenize(line, language).map((token, position) => (
                <Text
                  // biome-ignore lint/suspicious/noArrayIndexKey: tokens are positional
                  key={position}
                  style={{ color: tokenColor(token.kind, colors) }}
                >
                  {token.text}
                </Text>
              ))}
            </CodeBlockLine>
          ))
      : React.Children.toArray(children)
  const body = (
    <View style={[styles.body, { paddingVertical: size === "sm" ? 12 : 16 }]}>
      {lines.map((line, index) => (
        <CodeBlockLineContext.Provider
          // biome-ignore lint/suspicious/noArrayIndexKey: lines are positional
          key={index}
          value={{ numbered: lineNumbers, number: startLine + index }}
        >
          {line}
        </CodeBlockLineContext.Provider>
      ))}
    </View>
  )
  return (
    <View style={[styles.content, style]} {...props}>
      {wrap ? (
        body
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {body}
        </ScrollView>
      )}
    </View>
  )
}

function CodeBlockLine({
  style,
  variant = "default",
  children,
  ...props
}: ViewProps & { variant?: CodeBlockLineVariant }) {
  const { colors } = useTheme()
  const { size } = React.useContext(CodeBlockContext)
  const { number, numbered } = React.useContext(CodeBlockLineContext)
  const mark = LINE_MARKS[variant]
  const background = lineBackground(variant, colors)
  return (
    <View
      style={[
        styles.line,
        { paddingHorizontal: size === "sm" ? 12 : 16 },
        background ? { backgroundColor: background } : null,
        style,
      ]}
      {...props}
    >
      {mark ? (
        <Text
          accessible={false}
          style={[
            styles.mark,
            {
              color:
                variant === "removed"
                  ? colors.destructive
                  : colors.mutedForeground,
            },
          ]}
        >
          {mark}
        </Text>
      ) : null}
      {numbered ? (
        <Text
          accessible={false}
          style={[styles.number, { color: colors.mutedForeground }]}
        >
          {number}
        </Text>
      ) : null}
      <Text style={styles.code}>{children ?? " "}</Text>
    </View>
  )
}

function CodeBlockFooter({ style, ...props }: ViewProps) {
  const { colors } = useTheme()
  const { size } = React.useContext(CodeBlockContext)
  return (
    <TextStyleContext.Provider
      value={{ ...fontSize.xs, color: colors.mutedForeground }}
    >
      <View
        style={[
          styles.footer,
          size === "sm"
            ? { paddingHorizontal: 12, paddingBottom: 12 }
            : { paddingHorizontal: 16, paddingBottom: 16 },
          style,
        ]}
        {...props}
      />
    </TextStyleContext.Provider>
  )
}

export {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
}
