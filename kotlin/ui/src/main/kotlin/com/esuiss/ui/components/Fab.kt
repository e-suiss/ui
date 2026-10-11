package com.esuiss.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.MutableTransitionState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.WindowInsetsSides
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.only
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.layout.positionInWindow
import androidx.compose.ui.platform.LocalWindowInfo
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Shadows
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow

enum class FabSize(internal val size: Dp, internal val iconSize: Dp) {
    Default(56.dp, 24.dp),
    Lg(64.dp, 28.dp),
}

private val LocalFabClose = staticCompositionLocalOf<() -> Unit> { {} }

@Composable
fun Fab(
    icon: ImageVector,
    contentDescription: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    size: FabSize = FabSize.Default,
    label: String? = null,
    enabled: Boolean = true,
) {
    FabFrame(modifier) {
        FabButton(icon, contentDescription, onClick, size, label, enabled, rotation = 0f, expanded = null)
    }
}

@Composable
fun Fab(
    icon: ImageVector,
    contentDescription: String,
    open: Boolean,
    onOpenChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    size: FabSize = FabSize.Default,
    label: String? = null,
    enabled: Boolean = true,
    actions: @Composable ColumnScope.() -> Unit,
) {
    val transition = remember { MutableTransitionState(false) }
    transition.targetState = open
    val rotation by animateFloatAsState(if (open) 45f else 0f, tween(250, easing = FormEasing), label = "fab")
    Box(modifier = Modifier.fillMaxSize()) {
        FabScrim(open, onDismiss = { onOpenChange(false) })
        FabFrame(modifier) {
            Column(
                horizontalAlignment = Alignment.End,
                verticalArrangement = Arrangement.spacedBy(16.dp),
            ) {
                AnimatedVisibility(
                    visibleState = transition,
                    enter = fadeIn(tween(200)) + slideInVertically(tween(250, easing = FormEasing)) { it / 4 } +
                        scaleIn(tween(250, easing = FormEasing), initialScale = 0.9f),
                    exit = fadeOut(tween(150)) + slideOutVertically(tween(200, easing = FormEasing)) { it / 4 } +
                        scaleOut(tween(200, easing = FormEasing), targetScale = 0.9f),
                ) {
                    CompositionLocalProvider(LocalFabClose provides { onOpenChange(false) }) {
                        Column(
                            modifier = Modifier.padding(end = (size.size - FabActionSize) / 2),
                            horizontalAlignment = Alignment.End,
                            verticalArrangement = Arrangement.spacedBy(12.dp),
                            content = actions,
                        )
                    }
                }
                FabButton(icon, contentDescription, { onOpenChange(!open) }, size, label, enabled, rotation, expanded = open)
            }
        }
    }
}

private val FabActionSize = 44.dp

@Composable
private fun FabScrim(open: Boolean, onDismiss: () -> Unit) {
    val color = EsuissTheme.colors.scrim
    val alpha by animateFloatAsState(if (open) 1f else 0f, tween(200), label = "scrim")
    val container = LocalWindowInfo.current.containerSize
    var origin by remember { mutableStateOf(Offset.Zero) }
    if (alpha == 0f && !open) return
    Box(
        modifier = Modifier
            .fillMaxSize()
            .onGloballyPositioned { origin = it.positionInWindow() }
            .drawBehind {
                drawRect(
                    color = color.copy(alpha = color.alpha * alpha),
                    topLeft = -origin,
                    size = Size(container.width.toFloat(), container.height.toFloat()),
                )
            }
            .then(if (open) Modifier.pointerInput(Unit) { detectTapGestures { onDismiss() } } else Modifier),
    )
}

@Composable
fun FabAction(
    icon: ImageVector,
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val colors = EsuissTheme.colors
    val close = LocalFabClose.current
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    Row(
        modifier = modifier
            .clickable(interactionSource = interaction, indication = null, role = Role.Button) {
                onClick()
                close()
            }
            .clearAndSetSemantics { contentDescription = label },
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        BasicText(
            label,
            modifier = Modifier
                .shadow(Shadows.md, CircleShape)
                .background(if (pressed) colors.surfaceSecondary else colors.surfaceRaised, CircleShape)
                .padding(horizontal = 12.dp, vertical = 6.dp),
            style = Typography.sm.copy(color = colors.label, fontWeight = FontWeight.Medium),
            maxLines = 1,
        )
        Box(
            modifier = Modifier
                .size(FabActionSize)
                .shadow(Shadows.md, CircleShape)
                .background(if (pressed) colors.surfaceSecondary else colors.surfaceRaised, CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            Icon(icon, contentDescription = null, size = 20.dp, tint = colors.label)
        }
    }
}

@Composable
private fun FabFrame(modifier: Modifier, content: @Composable () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .windowInsetsPadding(WindowInsets.safeDrawing.only(WindowInsetsSides.Bottom + WindowInsetsSides.End))
            .padding(16.dp),
        contentAlignment = Alignment.BottomEnd,
    ) {
        Box(modifier = modifier) { content() }
    }
}

@Composable
private fun FabButton(
    icon: ImageVector,
    contentDescription: String,
    onClick: () -> Unit,
    size: FabSize,
    label: String?,
    enabled: Boolean,
    rotation: Float,
    expanded: Boolean?,
) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val scale by animateFloatAsState(if (pressed && enabled) 0.95f else 1f, tween(150), label = "press")
    val background = when {
        !enabled -> colors.accentDisabled
        pressed -> colors.accentPressed
        else -> colors.accent
    }
    Row(
        modifier = Modifier
            .graphicsLayer {
                scaleX = scale
                scaleY = scale
            }
            .height(size.size)
            .then(if (label == null) Modifier.size(size.size) else Modifier)
            .then(if (enabled) Modifier.shadow(Shadows.lg, CircleShape) else Modifier)
            .clip(CircleShape)
            .background(background, CircleShape)
            .clickable(
                interactionSource = interaction,
                indication = null,
                enabled = enabled,
                role = Role.Button,
                onClick = onClick,
            )
            .semantics {
                this.contentDescription = contentDescription
                if (expanded != null) stateDescription = if (expanded) "Expanded" else "Collapsed"
            }
            .padding(horizontal = if (label == null) 0.dp else 20.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp, Alignment.CenterHorizontally),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(
            icon,
            contentDescription = null,
            modifier = Modifier.graphicsLayer { rotationZ = rotation },
            size = size.iconSize,
            tint = colors.onAccent,
        )
        if (label != null) {
            BasicText(
                label,
                style = Typography.base.copy(color = colors.onAccent, fontWeight = FontWeight.SemiBold),
                maxLines = 1,
            )
        }
    }
}
