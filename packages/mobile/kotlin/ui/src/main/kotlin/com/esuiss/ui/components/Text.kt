package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

enum class TextVariant { Default, H1, H2, H3, H4, P, Blockquote, Code, Lead, Large, Small, Muted }

@Composable
fun Text(
    text: String,
    modifier: Modifier = Modifier,
    variant: TextVariant = TextVariant.Default,
    color: Color = Color.Unspecified,
    textAlign: TextAlign = TextAlign.Unspecified,
    overflow: TextOverflow = TextOverflow.Clip,
    softWrap: Boolean = true,
    maxLines: Int = Int.MAX_VALUE,
    minLines: Int = 1,
    style: TextStyle = TextStyle.Default,
) {
    Text(AnnotatedString(text), modifier, variant, color, textAlign, overflow, softWrap, maxLines, minLines, style)
}

@Composable
fun Text(
    text: AnnotatedString,
    modifier: Modifier = Modifier,
    variant: TextVariant = TextVariant.Default,
    color: Color = Color.Unspecified,
    textAlign: TextAlign = TextAlign.Unspecified,
    overflow: TextOverflow = TextOverflow.Clip,
    softWrap: Boolean = true,
    maxLines: Int = Int.MAX_VALUE,
    minLines: Int = 1,
    style: TextStyle = TextStyle.Default,
) {
    val colors = EsuissTheme.colors
    val inherited = if (variant == TextVariant.Default) LocalContentStyle.current else TextStyle.Default
    val resolved = Typography.base.copy(color = colors.foreground)
        .merge(textVariantStyle(variant, colors))
        .merge(inherited)
        .merge(style)
        .merge(TextStyle(color = color, textAlign = textAlign))
    BasicText(
        text = text,
        modifier = modifier.then(textVariantModifier(variant, colors)),
        style = resolved,
        overflow = overflow,
        softWrap = softWrap,
        maxLines = maxLines,
        minLines = minLines,
    )
}

private fun textVariantStyle(variant: TextVariant, colors: Colors): TextStyle = when (variant) {
    TextVariant.Default, TextVariant.P -> TextStyle.Default
    TextVariant.H1 -> Typography.xl3.copy(fontWeight = FontWeight.Bold)
    TextVariant.H2 -> Typography.xl2.copy(fontWeight = FontWeight.Bold)
    TextVariant.H3 -> Typography.xl.copy(fontWeight = FontWeight.SemiBold)
    TextVariant.H4 -> Typography.lg.copy(fontWeight = FontWeight.SemiBold)
    TextVariant.Blockquote -> TextStyle(fontStyle = FontStyle.Italic)
    TextVariant.Code -> Typography.sm.copy(fontFamily = FontFamily.Monospace, fontWeight = FontWeight.SemiBold)
    TextVariant.Lead -> Typography.lg.copy(color = colors.mutedForeground)
    TextVariant.Large -> Typography.lg.copy(fontWeight = FontWeight.SemiBold)
    TextVariant.Small -> Typography.sm.copy(fontWeight = FontWeight.Medium)
    TextVariant.Muted -> Typography.sm.copy(color = colors.mutedForeground)
}

private fun textVariantModifier(variant: TextVariant, colors: Colors): Modifier = when (variant) {
    TextVariant.H1, TextVariant.H2, TextVariant.H3, TextVariant.H4 -> Modifier.semantics { heading() }
    TextVariant.P -> Modifier.padding(top = 12.dp)
    TextVariant.Blockquote -> Modifier
        .padding(top = 16.dp)
        .drawBehind {
            val stroke = 2.dp.toPx()
            val x = if (layoutDirection == LayoutDirection.Rtl) size.width - stroke else 0f
            drawRect(colors.border, Offset(x, 0f), Size(stroke, size.height))
        }
        .padding(start = 14.dp)
    TextVariant.Code -> Modifier
        .clip(RoundedCornerShape(Radius.sm))
        .background(colors.muted)
        .padding(horizontal = 4.dp, vertical = 2.dp)
    else -> Modifier
}
