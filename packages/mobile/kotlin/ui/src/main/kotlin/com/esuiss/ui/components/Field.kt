package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.LayoutScopeMarker
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.remember
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.layout
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

enum class FieldOrientation { Vertical, Horizontal, Responsive }

enum class FieldGroupVariant { Default, Inset }

enum class FieldLegendVariant { Legend, Label }

@Immutable
internal class FieldState(val enabled: Boolean, val invalid: Boolean)

internal val LocalFieldState = staticCompositionLocalOf { FieldState(enabled = true, invalid = false) }

private val LocalFieldSetInset = staticCompositionLocalOf { false }

private val LocalFieldGroupVariant = staticCompositionLocalOf<FieldGroupVariant?> { null }

private val LocalFieldInset = staticCompositionLocalOf { false }

@LayoutScopeMarker
@Immutable
interface FieldScope {
    fun Modifier.weight(weight: Float): Modifier
}

private class RowFieldScope(private val scope: RowScope) : FieldScope {
    override fun Modifier.weight(weight: Float): Modifier = with(scope) { this@weight.weight(weight, true) }
}

private object ColumnFieldScope : FieldScope {
    override fun Modifier.weight(weight: Float): Modifier = this
}

@Composable
fun FieldSet(
    modifier: Modifier = Modifier,
    variant: FieldGroupVariant = FieldGroupVariant.Default,
    enabled: Boolean = true,
    content: @Composable ColumnScope.() -> Unit,
) {
    val inset = variant == FieldGroupVariant.Inset
    CompositionLocalProvider(
        LocalFieldSetInset provides inset,
        LocalFieldState provides FieldState(enabled, LocalFieldState.current.invalid),
    ) {
        Column(
            modifier = modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(if (inset) 8.dp else 24.dp),
            content = content,
        )
    }
}

@Composable
fun FieldLegend(
    text: String,
    modifier: Modifier = Modifier,
    variant: FieldLegendVariant = FieldLegendVariant.Legend,
) {
    val colors = EsuissTheme.colors
    val inset = LocalFieldSetInset.current
    val enabled = LocalFieldState.current.enabled
    val style = if (inset) {
        Typography.xs.copy(color = colors.mutedForeground)
    } else {
        Typography.base.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold)
    }
    BasicText(
        text = if (inset) text.uppercase() else text,
        modifier = modifier
            .alpha(if (enabled) 1f else 0.5f)
            .then(if (variant == FieldLegendVariant.Legend) Modifier.semantics { heading() } else Modifier)
            .padding(start = if (inset) 16.dp else 0.dp, bottom = if (inset) 0.dp else 12.dp),
        style = style,
    )
}

@Composable
fun FieldGroup(
    modifier: Modifier = Modifier,
    variant: FieldGroupVariant = FieldGroupVariant.Default,
    content: @Composable () -> Unit,
) {
    val colors = EsuissTheme.colors
    CompositionLocalProvider(
        LocalFieldSetInset provides false,
        LocalFieldGroupVariant provides variant,
    ) {
        if (variant == FieldGroupVariant.Inset) {
            FormDividedStack(
                orientation = Orientation.Vertical,
                dividerColor = colors.border,
                modifier = modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(Radius.xl2))
                    .background(colors.muted),
                dividerInsetStart = 16.dp,
                content = content,
            )
        } else {
            Column(
                modifier = modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(28.dp),
            ) {
                content()
            }
        }
    }
}

@Composable
fun Field(
    modifier: Modifier = Modifier,
    orientation: FieldOrientation = FieldOrientation.Vertical,
    enabled: Boolean = LocalFieldState.current.enabled,
    invalid: Boolean = false,
    content: @Composable FieldScope.() -> Unit,
) {
    val inset = LocalFieldGroupVariant.current == FieldGroupVariant.Inset
    val horizontal = when (orientation) {
        FieldOrientation.Vertical -> false
        FieldOrientation.Horizontal -> true
        FieldOrientation.Responsive -> LocalConfiguration.current.screenWidthDp >= 768
    }
    val sizing = modifier
        .fillMaxWidth()
        .then(if (inset) Modifier.heightIn(min = 44.dp).padding(horizontal = 16.dp, vertical = 6.dp) else Modifier)
    CompositionLocalProvider(
        LocalFieldGroupVariant provides null,
        LocalFieldInset provides inset,
        LocalFieldState provides FieldState(enabled, invalid),
    ) {
        if (horizontal) {
            Row(
                modifier = sizing,
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                val scope = remember(this) { RowFieldScope(this) }
                scope.content()
            }
        } else {
            Column(
                modifier = sizing,
                verticalArrangement = Arrangement.spacedBy(12.dp, Alignment.CenterVertically),
            ) {
                ColumnFieldScope.content()
            }
        }
    }
}

@Composable
fun FieldScope.FieldContent(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(
        modifier = modifier.weight(1f),
        verticalArrangement = Arrangement.spacedBy(4.dp),
        content = content,
    )
}

@Composable
fun FieldLabel(text: String, modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    val enabled = LocalFieldState.current.enabled
    BasicText(
        text = text,
        modifier = modifier.alpha(if (enabled) 1f else 0.5f),
        style = Typography.base.copy(
            color = colors.foreground,
            fontWeight = if (LocalFieldInset.current) FontWeight.Normal else FontWeight.SemiBold,
        ),
    )
}

@Composable
fun FieldTitle(text: String, modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    val enabled = LocalFieldState.current.enabled
    BasicText(
        text = text,
        modifier = modifier.alpha(if (enabled) 1f else 0.5f),
        style = Typography.base.copy(
            color = colors.foreground,
            fontWeight = FontWeight.SemiBold,
        ),
    )
}

@Composable
fun FieldDescription(text: String, modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    val inset = LocalFieldSetInset.current
    BasicText(
        text = text,
        modifier = modifier.padding(start = if (inset) 16.dp else 0.dp),
        style = (if (inset) Typography.xs else Typography.sm).copy(color = colors.mutedForeground),
    )
}

@Composable
fun FieldSeparator(
    modifier: Modifier = Modifier,
    text: String? = null,
) {
    val colors = EsuissTheme.colors
    Box(
        modifier = modifier
            .fillMaxWidth()
            .layout { measurable, constraints ->
                val placeable = measurable.measure(constraints)
                val overlap = 8.dp.roundToPx()
                val height = (placeable.height - overlap * 2).coerceAtLeast(0)
                layout(placeable.width, height) { placeable.place(0, -overlap) }
            }
            .heightIn(min = 20.dp),
        contentAlignment = Alignment.Center,
    ) {
        Separator()
        if (text != null) {
            BasicText(
                text = text,
                modifier = Modifier.background(colors.background).padding(horizontal = 8.dp),
                style = Typography.sm.copy(color = colors.mutedForeground),
            )
        }
    }
}

@Composable
fun FieldError(text: String?, modifier: Modifier = Modifier) {
    if (text.isNullOrEmpty()) return
    BasicText(
        text = text,
        modifier = modifier.semantics { liveRegion = LiveRegionMode.Polite },
        style = Typography.sm.copy(color = EsuissTheme.colors.destructive),
    )
}

@Composable
fun FieldError(errors: List<String?>, modifier: Modifier = Modifier) {
    val messages = errors.filterNotNull().filter { it.isNotEmpty() }.distinct()
    val text = when (messages.size) {
        0 -> null
        1 -> messages[0]
        else -> messages.joinToString("\n") { "• $it" }
    }
    FieldError(text, modifier)
}
