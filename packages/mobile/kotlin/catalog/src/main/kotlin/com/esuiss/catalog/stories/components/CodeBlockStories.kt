package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.FileTs
import com.adamglin.phosphoricons.regular.Terminal
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.CodeBlock
import com.esuiss.ui.components.CodeBlockActions
import com.esuiss.ui.components.CodeBlockContent
import com.esuiss.ui.components.CodeBlockCopyButton
import com.esuiss.ui.components.CodeBlockFooter
import com.esuiss.ui.components.CodeBlockHeader
import com.esuiss.ui.components.CodeBlockLine
import com.esuiss.ui.components.CodeBlockLineVariant
import com.esuiss.ui.components.CodeBlockSize
import com.esuiss.ui.components.CodeBlockTitle
import com.esuiss.ui.components.CodeBlockVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Text

private const val GREETING = """export function Greeting({ name }: { name: string }) {
  // Say hello to the person signing in
  return <Text>Hello, {name}!</Text>
}"""

private const val CONFIG = """export default {
  experimental: {
    reactCompiler: true,
    viewTransition: true,
  },
  images: {
    remotePatterns: [{ hostname: "avatars.githubusercontent.com" }],
  },
}"""

val codeBlockStories = StoryGroup(
    section = Section.Components,
    title = "Code Block",
    stories = listOf(
        Story("Default") { CodeBlockDefault() },
        Story("Basic") { CodeBlock { CodeBlockContent("npx @esuiss/ui@latest add code-block") } },
        Story("LineNumbers") { CodeBlock { CodeBlockContent(CONFIG, language = "ts", lineNumbers = true) } },
        Story("StartLine") { CodeBlockStartLine() },
        Story("Wrap") {
            CodeBlock {
                CodeBlockContent(
                    "ERR_PNPM_OUTDATED_LOCKFILE Cannot install with \"frozen-lockfile\" because pnpm-lock.yaml is not up to date with package.json",
                    wrap = true,
                )
            }
        },
        Story("HighlightedLines") { CodeBlockHighlighted() },
        Story("Diff") { CodeBlockDiff() },
        Story("Size") { CodeBlockSizes() },
        Story("Destructive") { CodeBlockDestructive() },
        Story("Languages") { CodeBlockLanguages() },
        Story("Footer") { CodeBlockWithFooter() },
    ),
)

@Composable
private fun CodeBlockDefault() {
    CodeBlock {
        CodeBlockHeader {
            Icon(PhosphorIcons.Regular.FileTs, contentDescription = null)
            CodeBlockTitle("components/greeting.tsx")
            CodeBlockActions { CodeBlockCopyButton(GREETING) }
        }
        CodeBlockContent(GREETING, language = "tsx")
    }
}

@Composable
private fun CodeBlockStartLine() {
    CodeBlock {
        CodeBlockHeader { CodeBlockTitle("next.config.ts") }
        CodeBlockContent(
            lines = listOf(CodeBlockLine("  images: {"), CodeBlockLine("    unoptimized: true,"), CodeBlockLine("  },")),
            lineNumbers = true,
            startLine = 12,
        )
    }
}

@Composable
private fun CodeBlockHighlighted() {
    CodeBlock {
        CodeBlockContent(
            lines = listOf(
                CodeBlockLine("export default {"),
                CodeBlockLine("  experimental: {"),
                CodeBlockLine("    reactCompiler: true,", CodeBlockLineVariant.Highlighted),
                CodeBlockLine("    viewTransition: true,", CodeBlockLineVariant.Highlighted),
                CodeBlockLine("  },"),
                CodeBlockLine("}"),
            ),
            lineNumbers = true,
        )
    }
}

@Composable
private fun CodeBlockDiff() {
    CodeBlock {
        CodeBlockHeader { CodeBlockTitle("components/greeting.tsx") }
        CodeBlockContent(
            lines = listOf(
                CodeBlockLine("export function Greeting({ name }: { name: string }) {"),
                CodeBlockLine("  return <Text>Hello, {name}</Text>", CodeBlockLineVariant.Removed),
                CodeBlockLine("  return <Text variant=\"muted\">", CodeBlockLineVariant.Added),
                CodeBlockLine("    Hello, {name}!", CodeBlockLineVariant.Added),
                CodeBlockLine("  </Text>", CodeBlockLineVariant.Added),
                CodeBlockLine("}"),
            ),
        )
    }
}

@Composable
private fun CodeBlockSizes() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        CodeBlock { CodeBlockContent("pnpm install") }
        CodeBlock(size = CodeBlockSize.Sm) { CodeBlockContent("pnpm install") }
    }
}

@Composable
private fun CodeBlockDestructive() {
    CodeBlock(variant = CodeBlockVariant.Destructive, size = CodeBlockSize.Sm) {
        CodeBlockHeader {
            Icon(PhosphorIcons.Regular.Terminal, contentDescription = null)
            CodeBlockTitle("Failed to run pnpm lint")
        }
        CodeBlockContent("app/page.tsx:12:7 Unexpected any. Specify a different type.", wrap = true)
    }
}

@Composable
private fun CodeBlockLanguages() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        CodeBlock(size = CodeBlockSize.Sm) { CodeBlockContent("# Add the component\npnpm dlx @esuiss/ui add code-block", language = "bash") }
        CodeBlock(size = CodeBlockSize.Sm) { CodeBlockContent("{ \"name\": \"acme\", \"private\": true, \"version\": \"1.0.0\" }", language = "json") }
        CodeBlock(size = CodeBlockSize.Sm) {
            CodeBlockContent("struct Greeting: View {\n  let name: String\n  var body: some View { Text(\"Hello, \\(name)\") }\n}", language = "swift")
        }
        CodeBlock(size = CodeBlockSize.Sm) {
            CodeBlockContent("@Composable\nfun Greeting(name: String) {\n  Text(\"Hello, \$name\")\n}", language = "kotlin")
        }
    }
}

@Composable
private fun CodeBlockWithFooter() {
    CodeBlock {
        CodeBlockHeader {
            CodeBlockTitle("Logs")
            CodeBlockActions { CodeBlockCopyButton("Compiled in 4.2s") }
        }
        CodeBlockContent("$ pnpm build\nCompiled in 4.2s\nGenerated 12 static pages", language = "bash")
        CodeBlockFooter { Text("Exited with code 0") }
    }
}
