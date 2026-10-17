import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { setStringAsync } from "expo-clipboard"
import { CheckIcon, CopyIcon } from "phosphor-react-native"
import * as React from "react"
import { Pressable, ScrollView, View, type ViewProps } from "react-native"
import { Icon, IconClassContext } from "@/components/ui/icon"
import { Text, TextClassContext } from "@/components/ui/text"

type CodeBlockSize = "default" | "sm"
type CodeBlockVariant = "default" | "destructive"
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

const TOKEN_CLASSES: Record<TokenKind, string | undefined> = {
  plain: undefined,
  keyword: "text-chart-3",
  string: "text-chart-2",
  number: "text-chart-4",
  comment: "text-muted-foreground",
}

const CodeBlockContext = React.createContext<{
  size: CodeBlockSize
  variant: CodeBlockVariant
}>({ size: "default", variant: "default" })

const CodeBlockLineContext = React.createContext<{
  number?: number
  numbered: boolean
}>({ numbered: false })

const codeBlockVariants = cva("w-full min-w-0 overflow-hidden", {
  variants: {
    variant: {
      default: "border border-foreground/5 bg-muted",
      destructive: "border border-destructive/15 bg-destructive/5",
    },
    size: {
      default: "rounded-2xl",
      sm: "rounded-xl",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

function CodeBlock({
  className,
  variant = "default",
  size = "default",
  ...props
}: ViewProps & VariantProps<typeof codeBlockVariants>) {
  const resolvedVariant = variant ?? "default"
  const resolvedSize = size ?? "default"
  return (
    <CodeBlockContext.Provider
      value={{ size: resolvedSize, variant: resolvedVariant }}
    >
      <TextClassContext.Provider
        value={cn(
          "font-mono",
          resolvedSize === "sm" ? "text-xs" : "text-sm",
          resolvedVariant === "destructive"
            ? "text-destructive"
            : "text-foreground"
        )}
      >
        <View
          className={cn(
            codeBlockVariants({ variant: resolvedVariant, size: resolvedSize }),
            className
          )}
          {...props}
        />
      </TextClassContext.Provider>
    </CodeBlockContext.Provider>
  )
}

function CodeBlockHeader({ className, ...props }: ViewProps) {
  const { size, variant } = React.useContext(CodeBlockContext)
  const tone =
    variant === "destructive" ? "text-destructive" : "text-muted-foreground"
  return (
    <IconClassContext.Provider value={cn("size-4", tone)}>
      <View
        className={cn(
          "flex-row items-center gap-2",
          size === "sm" ? "px-3 pt-3" : "px-4 pt-4",
          className
        )}
        {...props}
      />
    </IconClassContext.Provider>
  )
}

function CodeBlockTitle({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  const { size, variant } = React.useContext(CodeBlockContext)
  return (
    <Text
      numberOfLines={1}
      className={cn(
        "min-w-0 shrink font-sans font-medium",
        size === "sm" ? "text-xs" : "text-sm",
        variant === "destructive" ? "text-destructive" : "text-foreground",
        className
      )}
      {...props}
    />
  )
}

function CodeBlockActions({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("ms-auto flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

function CodeBlockCopyButton({
  value,
  className,
  onPress,
  ...props
}: Omit<React.ComponentProps<typeof Pressable>, "children"> & {
  value: string
}) {
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
      className={cn(
        "size-6 items-center justify-center rounded-md active:bg-foreground/10",
        className
      )}
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
        className="size-3.5 text-muted-foreground"
      />
    </Pressable>
  )
}

function CodeBlockContent({
  className,
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
                  className={TOKEN_CLASSES[token.kind]}
                >
                  {token.text}
                </Text>
              ))}
            </CodeBlockLine>
          ))
      : React.Children.toArray(children)
  const body = (
    <View className={cn("min-w-full", size === "sm" ? "py-3" : "py-4")}>
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
    <View className={cn("min-h-0 min-w-0", className)} {...props}>
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

const LINE_MARKS: Record<string, string | undefined> = {
  added: "+",
  removed: "−",
}

const codeBlockLineVariants = cva("relative min-w-full flex-row", {
  variants: {
    variant: {
      default: "",
      added: "bg-foreground/5",
      removed: "bg-destructive/10",
      highlighted: "bg-foreground/5",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function CodeBlockLine({
  className,
  variant = "default",
  children,
  ...props
}: ViewProps & VariantProps<typeof codeBlockLineVariants>) {
  const { size } = React.useContext(CodeBlockContext)
  const { number, numbered } = React.useContext(CodeBlockLineContext)
  const mark = variant ? LINE_MARKS[variant] : undefined
  return (
    <View
      className={cn(
        codeBlockLineVariants({ variant }),
        size === "sm" ? "px-3" : "px-4",
        className
      )}
      {...props}
    >
      {mark ? (
        <Text
          accessible={false}
          className={cn(
            "absolute start-1",
            variant === "removed" ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {mark}
        </Text>
      ) : null}
      {numbered ? (
        <Text
          accessible={false}
          className="me-3 min-w-6 text-end text-muted-foreground"
        >
          {number}
        </Text>
      ) : null}
      <Text className="min-w-0 shrink">{children ?? " "}</Text>
    </View>
  )
}

function CodeBlockFooter({ className, ...props }: ViewProps) {
  const { size } = React.useContext(CodeBlockContext)
  return (
    <TextClassContext.Provider value="font-sans text-xs text-muted-foreground">
      <View
        className={cn(
          "flex-row items-center gap-2",
          size === "sm" ? "px-3 pb-3" : "px-4 pb-4",
          className
        )}
        {...props}
      />
    </TextClassContext.Provider>
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
