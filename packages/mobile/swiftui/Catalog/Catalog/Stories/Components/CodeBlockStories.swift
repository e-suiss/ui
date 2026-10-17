import EsuissUI
import PhosphorSwift
import SwiftUI

private let greeting = """
export function Greeting({ name }: { name: string }) {
  // Say hello to the person signing in
  return <Text>Hello, {name}!</Text>
}
"""

private let config = """
export default {
  experimental: {
    reactCompiler: true,
    viewTransition: true,
  },
  images: {
    remotePatterns: [{ hostname: "avatars.githubusercontent.com" }],
  },
}
"""

enum CodeBlockStories {
  static let group = StoryGroup(.components, "Code Block", stories: [
    Story("Default") {
      CodeBlock {
        CodeBlockHeader {
          Ph.fileTs.regular.frame(width: 16, height: 16)
          CodeBlockTitle(verbatim: "components/greeting.tsx")
          CodeBlockActions { CodeBlockCopyButton(value: greeting) }
        }
        CodeBlockContent(greeting, language: "tsx")
      }
    },
    Story("Basic") {
      CodeBlock {
        CodeBlockContent("npx @esuiss/ui@latest add code-block")
      }
    },
    Story("LineNumbers") {
      CodeBlock {
        CodeBlockContent(config, language: "ts", lineNumbers: true)
      }
    },
    Story("StartLine") {
      CodeBlock {
        CodeBlockHeader { CodeBlockTitle(verbatim: "next.config.ts") }
        CodeBlockContent(
          lines: [CodeBlockLine("  images: {"), CodeBlockLine("    unoptimized: true,"), CodeBlockLine("  },")],
          lineNumbers: true,
          startLine: 12
        )
      }
    },
    Story("Wrap") {
      CodeBlock {
        CodeBlockContent(
          "ERR_PNPM_OUTDATED_LOCKFILE Cannot install with \"frozen-lockfile\" because pnpm-lock.yaml is not up to date with package.json",
          wrap: true
        )
      }
    },
    Story("HighlightedLines") {
      CodeBlock {
        CodeBlockContent(
          lines: [
            CodeBlockLine("export default {"),
            CodeBlockLine("  experimental: {"),
            CodeBlockLine("    reactCompiler: true,", variant: .highlighted),
            CodeBlockLine("    viewTransition: true,", variant: .highlighted),
            CodeBlockLine("  },"),
            CodeBlockLine("}"),
          ],
          lineNumbers: true
        )
      }
    },
    Story("Diff") {
      CodeBlock {
        CodeBlockHeader { CodeBlockTitle(verbatim: "components/greeting.tsx") }
        CodeBlockContent(lines: [
          CodeBlockLine("export function Greeting({ name }: { name: string }) {"),
          CodeBlockLine("  return <Text>Hello, {name}</Text>", variant: .removed),
          CodeBlockLine("  return <Text variant=\"muted\">", variant: .added),
          CodeBlockLine("    Hello, {name}!", variant: .added),
          CodeBlockLine("  </Text>", variant: .added),
          CodeBlockLine("}"),
        ])
      }
    },
    Story("Size") {
      VStack(spacing: 16) {
        CodeBlock { CodeBlockContent("pnpm install") }
        CodeBlock(size: .sm) { CodeBlockContent("pnpm install") }
      }
    },
    Story("Destructive") {
      CodeBlock(.destructive, size: .sm) {
        CodeBlockHeader {
          Ph.terminal.regular.frame(width: 16, height: 16)
          CodeBlockTitle("Failed to run pnpm lint")
        }
        CodeBlockContent("app/page.tsx:12:7 Unexpected any. Specify a different type.", wrap: true)
      }
    },
    Story("Languages") {
      VStack(spacing: 16) {
        CodeBlock(size: .sm) { CodeBlockContent("# Add the component\npnpm dlx @esuiss/ui add code-block", language: "bash") }
        CodeBlock(size: .sm) { CodeBlockContent("{ \"name\": \"acme\", \"private\": true, \"version\": \"1.0.0\" }", language: "json") }
        CodeBlock(size: .sm) {
          CodeBlockContent("struct Greeting: View {\n  let name: String\n  var body: some View { Text(\"Hello, \\(name)\") }\n}", language: "swift")
        }
        CodeBlock(size: .sm) {
          CodeBlockContent("@Composable\nfun Greeting(name: String) {\n  Text(\"Hello, $name\")\n}", language: "kotlin")
        }
      }
    },
    Story("Footer") {
      CodeBlock {
        CodeBlockHeader {
          CodeBlockTitle("Logs")
          CodeBlockActions { CodeBlockCopyButton(value: "Compiled in 4.2s") }
        }
        CodeBlockContent("$ pnpm build\nCompiled in 4.2s\nGenerated 12 static pages", language: "bash")
        CodeBlockFooter { Text("Exited with code 0") }
      }
    },
  ])
}
