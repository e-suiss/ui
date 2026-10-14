package com.esuiss.ui.blocks

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.bold.X
import com.adamglin.phosphoricons.regular.MagnifyingGlass
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Empty
import com.esuiss.ui.components.EmptyContent
import com.esuiss.ui.components.EmptyHeader
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Screen
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

private val RevealEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private val Suggestions = listOf("Book Air", "Book Pro", "Book mini", "Compare Book models")

@Composable
fun EmptySearch(
    modifier: Modifier = Modifier,
) {
    val colors = EsuissTheme.colors
    var query by rememberSaveable { mutableStateOf("book neo") }
    val focus = remember { FocusRequester() }
    val trimmed = query.trim().lowercase()
    val matches = if (trimmed.isNotEmpty() && trimmed.startsWith("book")) {
        Suggestions.filter { it.lowercase().startsWith(trimmed) }
    } else {
        emptyList()
    }

    Screen(modifier) {
        Column(
            Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp, vertical = 24.dp),
            verticalArrangement = Arrangement.spacedBy(26.dp),
        ) {
            SearchField(
                value = query,
                onValueChange = { query = it },
                onSearch = {},
                onClear = {
                    query = ""
                    runCatching { focus.requestFocus() }
                },
                modifier = Modifier.focusRequester(focus),
            )
            if (matches.isNotEmpty()) {
                Column(
                    modifier = Modifier.semantics { contentDescription = "Suggested" },
                    verticalArrangement = Arrangement.spacedBy(4.dp),
                ) {
                    BasicText(
                        "Suggested",
                        modifier = Modifier.padding(bottom = 6.dp),
                        style = Typography.xs.copy(color = colors.labelSecondary),
                    )
                    matches.forEach { item ->
                        SuggestionRow(item) { query = item }
                    }
                }
            } else {
                AnimatedContent(
                    targetState = query.isEmpty(),
                    transitionSpec = {
                        (fadeIn(tween(800)) + slideInVertically(tween(800, easing = RevealEasing)) { it / 20 }) togetherWith fadeOut(tween(150))
                    },
                    label = "empty",
                ) { idle ->
                    Empty(Modifier.semantics { liveRegion = LiveRegionMode.Polite }) {
                        EmptyHeader {
                            BasicText(
                                if (idle) "What are you looking for?" else "No results for “$query”.",
                                modifier = Modifier.semantics { heading() },
                                style = Typography.xl3.copy(color = colors.label, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
                            )
                            BasicText(
                                if (idle) "Search for products, support articles or stores." else "Check the spelling or try one of these:",
                                style = Typography.lg.copy(color = colors.labelSecondary, textAlign = TextAlign.Center),
                            )
                        }
                        EmptyContent {
                            FlowRow(
                                horizontalArrangement = Arrangement.spacedBy(8.dp, Alignment.CenterHorizontally),
                                verticalArrangement = Arrangement.spacedBy(8.dp),
                            ) {
                                Suggestions.forEach { item ->
                                    Button(item, { query = item }, variant = ButtonVariant.Secondary)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun SearchField(
    value: String,
    onValueChange: (String) -> Unit,
    onSearch: () -> Unit,
    onClear: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val focused by interaction.collectIsFocusedAsState()
    val line by animateColorAsState(if (focused) colors.accent else colors.separatorStrong, tween(200), label = "line")
    val style = Typography.xl2.copy(color = colors.label, fontWeight = FontWeight.SemiBold)
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(52.dp)
            .drawBehind {
                val stroke = 1.dp.toPx()
                drawRect(line, Offset(0f, size.height - stroke), Size(size.width, stroke))
            },
        horizontalArrangement = Arrangement.spacedBy(10.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(PhosphorIcons.Regular.MagnifyingGlass, contentDescription = null, size = 20.dp, tint = colors.labelSecondary)
        BasicTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = modifier
                .weight(1f)
                .semantics { contentDescription = "Search suiss" },
            textStyle = style,
            singleLine = true,
            cursorBrush = SolidColor(colors.accent),
            interactionSource = interaction,
            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
            keyboardActions = KeyboardActions(onSearch = { onSearch() }),
            decorationBox = { inner ->
                Box(contentAlignment = Alignment.CenterStart) {
                    if (value.isEmpty()) BasicText("Search suiss", style = style.copy(color = colors.labelTertiary), maxLines = 1)
                    inner()
                }
            },
        )
        if (value.isNotEmpty()) {
            val press = remember { MutableInteractionSource() }
            val pressed by press.collectIsPressedAsState()
            Box(
                Modifier
                    .size(44.dp)
                    .clickable(interactionSource = press, indication = null, role = Role.Button, onClick = onClear)
                    .semantics { contentDescription = "Clear search" },
                contentAlignment = Alignment.Center,
            ) {
                Box(
                    Modifier
                        .size(22.dp)
                        .background(if (pressed) colors.labelSecondary else colors.labelTertiary, CircleShape),
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(PhosphorIcons.Bold.X, contentDescription = null, size = 11.dp, tint = colors.surface)
                }
            }
        }
    }
}

@Composable
private fun SuggestionRow(text: String, onClick: () -> Unit) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 44.dp)
            .graphicsLayer { alpha = if (pressed) 0.5f else 1f }
            .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onClick),
        horizontalArrangement = Arrangement.spacedBy(10.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(PhosphorIcons.Regular.MagnifyingGlass, contentDescription = null, size = 14.dp, tint = colors.labelTertiary)
        BasicText(text, style = Typography.lg.copy(color = colors.label))
    }
}
