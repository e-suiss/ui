package com.esuiss.ui.components

import android.content.ClipData
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.ClipEntry
import androidx.compose.ui.platform.LocalClipboard
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Check
import com.adamglin.phosphoricons.regular.Copy
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

enum class CodeBlockVariant { Default, Destructive }

enum class CodeBlockSize(val padding: Dp, val radius: Dp) {
    Default(16.dp, 18.dp),
    Sm(12.dp, 12.dp),
}

enum class CodeBlockLineVariant { Default, Added, Removed, Highlighted }

data class CodeBlockLine(val text: String, val variant: CodeBlockLineVariant = CodeBlockLineVariant.Default)

private data class CodeBlockStyle(val variant: CodeBlockVariant, val size: CodeBlockSize)

private val LocalCodeBlock = staticCompositionLocalOf { CodeBlockStyle(CodeBlockVariant.Default, CodeBlockSize.Default) }

@Composable
fun CodeBlock(
    modifier: Modifier = Modifier,
    variant: CodeBlockVariant = CodeBlockVariant.Default,
    size: CodeBlockSize = CodeBlockSize.Default,
    content: @Composable ColumnScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val destructive = variant == CodeBlockVariant.Destructive
    val shape = RoundedCornerShape(size.radius)
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(shape)
            .background(if (destructive) colors.destructive.copy(alpha = 0.06f) else colors.muted)
            .border(1.dp, if (destructive) colors.destructive.copy(alpha = 0.18f) else colors.foreground.copy(alpha = 0.06f), shape),
    ) {
        CompositionLocalProvider(LocalCodeBlock provides CodeBlockStyle(variant, size)) {
            content()
        }
    }
}

@Composable
fun CodeBlockHeader(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    val style = LocalCodeBlock.current
    val colors = EsuissTheme.colors
    val tone = if (style.variant == CodeBlockVariant.Destructive) colors.destructive else colors.mutedForeground
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(start = style.size.padding, end = style.size.padding, top = style.size.padding),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        CompositionLocalProvider(LocalContentColor provides tone, LocalIconSize provides 16.dp) {
            content()
        }
    }
}

@Composable
fun RowScope.CodeBlockTitle(text: String, modifier: Modifier = Modifier) {
    val style = LocalCodeBlock.current
    val colors = EsuissTheme.colors
    val base = if (style.size == CodeBlockSize.Sm) Typography.xs else Typography.sm
    BasicText(
        text,
        modifier = modifier.weight(1f, fill = false),
        style = base.copy(
            fontWeight = FontWeight.Medium,
            color = if (style.variant == CodeBlockVariant.Destructive) colors.destructive else colors.foreground,
        ),
        maxLines = 1,
        overflow = TextOverflow.Ellipsis,
    )
}

@Composable
fun RowScope.CodeBlockActions(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    Row(
        modifier = modifier.weight(1f),
        horizontalArrangement = Arrangement.spacedBy(4.dp, Alignment.End),
        verticalAlignment = Alignment.CenterVertically,
        content = content,
    )
}

@Composable
fun CodeBlockCopyButton(value: String, modifier: Modifier = Modifier) {
    val clipboard = LocalClipboard.current
    val scope = rememberCoroutineScope()
    var copied by remember { mutableStateOf(false) }
    LaunchedEffect(copied) {
        if (copied) {
            delay(2000)
            copied = false
        }
    }
    Box(
        modifier = modifier
            .size(24.dp)
            .clip(RoundedCornerShape(6.dp))
            .semantics { contentDescription = if (copied) "Copied" else "Copy" }
            .clickable(role = Role.Button) {
                scope.launch {
                    clipboard.setClipEntry(ClipEntry(ClipData.newPlainText("code", value)))
                    copied = true
                }
            },
        contentAlignment = Alignment.Center,
    ) {
        Icon(
            if (copied) PhosphorIcons.Regular.Check else PhosphorIcons.Regular.Copy,
            contentDescription = null,
            size = 14.dp,
            tint = EsuissTheme.colors.mutedForeground,
        )
    }
}

@Composable
fun CodeBlockContent(
    code: String,
    modifier: Modifier = Modifier,
    language: String? = null,
    wrap: Boolean = false,
    lineNumbers: Boolean = false,
    startLine: Int = 1,
) {
    CodeBlockContent(
        lines = code.removeSuffix("\n").split("\n").map { CodeBlockLine(it) },
        modifier = modifier,
        language = language,
        wrap = wrap,
        lineNumbers = lineNumbers,
        startLine = startLine,
    )
}

@Composable
fun CodeBlockContent(
    lines: List<CodeBlockLine>,
    modifier: Modifier = Modifier,
    language: String? = null,
    wrap: Boolean = false,
    lineNumbers: Boolean = false,
    startLine: Int = 1,
) {
    val style = LocalCodeBlock.current
    val colors = EsuissTheme.colors
    val text = (if (style.size == CodeBlockSize.Sm) Typography.xs else Typography.sm).copy(
        fontFamily = FontFamily.Monospace,
        color = if (style.variant == CodeBlockVariant.Destructive) colors.destructive else colors.foreground,
    )
    val scroll = rememberScrollState()
    Column(
        modifier = modifier
            .fillMaxWidth()
            .then(if (wrap) Modifier else Modifier.horizontalScroll(scroll))
            .padding(vertical = style.size.padding),
    ) {
        lines.forEachIndexed { index, line ->
            val background = when (line.variant) {
                CodeBlockLineVariant.Default -> Color.Transparent
                CodeBlockLineVariant.Removed -> colors.destructive.copy(alpha = 0.1f)
                else -> colors.foreground.copy(alpha = 0.05f)
            }
            Box(Modifier.background(background)) {
                Row(
                    modifier = Modifier.padding(horizontal = style.size.padding),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    if (lineNumbers) {
                        BasicText(
                            "${startLine + index}",
                            modifier = Modifier.widthIn(min = 24.dp).clearAndSetSemantics {},
                            style = text.copy(color = colors.mutedForeground, textAlign = TextAlign.End),
                        )
                    }
                    BasicText(
                        CodeHighlighter.highlight(line.text.ifEmpty { " " }, language, colors),
                        style = text,
                        softWrap = wrap,
                    )
                }
                val mark = when (line.variant) {
                    CodeBlockLineVariant.Added -> "+"
                    CodeBlockLineVariant.Removed -> "−"
                    else -> null
                }
                if (mark != null) {
                    BasicText(
                        mark,
                        modifier = Modifier.padding(start = 4.dp).clearAndSetSemantics {},
                        style = text.copy(
                            color = if (line.variant == CodeBlockLineVariant.Removed) colors.destructive else colors.mutedForeground,
                        ),
                    )
                }
            }
        }
    }
}

@Composable
fun CodeBlockFooter(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    val style = LocalCodeBlock.current
    val colors = EsuissTheme.colors
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(start = style.size.padding, end = style.size.padding, bottom = style.size.padding),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        CompositionLocalProvider(
            LocalContentStyle provides Typography.xs.copy(color = colors.mutedForeground),
            LocalContentColor provides colors.mutedForeground,
        ) {
            content()
        }
    }
}

private object CodeHighlighter {
    private val keywords = mapOf(
        "script" to setOf("as", "async", "await", "break", "case", "catch", "class", "const", "continue", "default", "delete", "do", "else", "export", "extends", "false", "finally", "for", "from", "function", "if", "import", "in", "instanceof", "interface", "let", "new", "null", "of", "return", "satisfies", "static", "super", "switch", "this", "throw", "true", "try", "type", "typeof", "undefined", "var", "void", "while", "yield"),
        "json" to setOf("true", "false", "null"),
        "shell" to setOf("cd", "do", "done", "echo", "elif", "else", "esac", "export", "fi", "for", "if", "in", "npm", "npx", "pnpm", "then", "while"),
        "python" to setOf("and", "as", "class", "def", "elif", "else", "False", "for", "from", "if", "import", "in", "is", "None", "not", "or", "pass", "return", "True", "while", "with", "yield"),
        "swift" to setOf("case", "class", "else", "enum", "extension", "false", "for", "func", "guard", "if", "import", "in", "let", "nil", "private", "protocol", "public", "return", "self", "static", "struct", "switch", "true", "var", "where", "while"),
        "kotlin" to setOf("class", "data", "else", "enum", "false", "for", "fun", "if", "import", "in", "is", "null", "object", "package", "private", "return", "true", "val", "var", "when", "while"),
    )

    private val languages = mapOf(
        "bash" to "shell", "js" to "script", "javascript" to "script", "json" to "json", "jsx" to "script",
        "kotlin" to "kotlin", "kt" to "kotlin", "py" to "python", "python" to "python", "sh" to "shell",
        "shell" to "shell", "swift" to "swift", "ts" to "script", "tsx" to "script", "typescript" to "script",
        "yaml" to "shell", "yml" to "shell",
    )

    private val token = Regex("""("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)""")

    fun highlight(line: String, language: String?, colors: Colors): AnnotatedString {
        val group = language?.lowercase()?.let { languages[it] } ?: return AnnotatedString(line)
        val words = keywords[group].orEmpty()
        val marker = if (group == "shell" || group == "python") "#" else "//"
        val comment = line.indexOf(marker)
        val code = if (comment >= 0) line.substring(0, comment) else line
        return buildAnnotatedString {
            var last = 0
            for (match in token.findAll(code)) {
                if (match.range.first > last) append(code.substring(last, match.range.first))
                val color = when {
                    match.groups[1] != null -> colors.chart2
                    match.groups[2] != null -> colors.chart4
                    match.value in words -> colors.chart3
                    else -> null
                }
                if (color != null) {
                    pushStyle(SpanStyle(color = color))
                    append(match.value)
                    pop()
                } else {
                    append(match.value)
                }
                last = match.range.last + 1
            }
            if (last < code.length) append(code.substring(last))
            if (comment >= 0) {
                pushStyle(SpanStyle(color = colors.mutedForeground))
                append(line.substring(comment))
                pop()
            }
        }
    }
}
