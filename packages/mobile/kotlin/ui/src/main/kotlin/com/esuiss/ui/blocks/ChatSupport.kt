package com.esuiss.ui.blocks

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.TransformOrigin
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.paneTitle
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.min
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Light
import com.adamglin.phosphoricons.bold.ArrowUp
import com.adamglin.phosphoricons.bold.Plus
import com.adamglin.phosphoricons.bold.X
import com.adamglin.phosphoricons.fill.ChatCircle
import com.adamglin.phosphoricons.light.DeviceMobile
import com.esuiss.ui.components.Bubble
import com.esuiss.ui.components.BubbleAlign
import com.esuiss.ui.components.BubbleContent
import com.esuiss.ui.components.BubbleVariant
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.InputGroup
import com.esuiss.ui.components.InputGroupAddon
import com.esuiss.ui.components.InputGroupAddonAlign
import com.esuiss.ui.components.InputGroupButton
import com.esuiss.ui.components.InputGroupButtonSize
import com.esuiss.ui.components.InputGroupInput
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.components.Message
import com.esuiss.ui.components.MessageAlign
import com.esuiss.ui.components.MessageContent
import com.esuiss.ui.components.MessageScroller
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.ScreenVariant
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Shadows
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

private val SupportPopEasing = CubicBezierEasing(0.3f, 1.25f, 0.5f, 1f)

private val SupportOpenEasing = CubicBezierEasing(0.3f, 1.15f, 0.5f, 1f)

private val SupportEnterEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private class SupportLine(val id: String, val mine: Boolean, val text: String)

private val SupportAnswers = linkedMapOf(
    "Where's my order?" to "Order W1048 has shipped. It arrives tomorrow between 10 AM and 2 PM.",
    "Book a repair" to "The closest Help Desk is at suiss Union Square. Does tomorrow at 11:30 AM work?",
    "I want to return something" to "You can return items free of charge within 14 days of delivery. Should I email you a return label?",
)

private const val SupportFallback = "Got it. I'm connecting you with a Specialist, this may take a few minutes."

private const val SupportTypingKey = "typing"

@Composable
fun ChatSupport(
    modifier: Modifier = Modifier,
    onSend: (text: String) -> Unit = {},
    onAttach: () -> Unit = {},
    onOpenChange: (open: Boolean) -> Unit = {},
) {
    val colors = EsuissTheme.colors
    var open by rememberSaveable { mutableStateOf(true) }
    val lines = remember {
        mutableStateListOf(SupportLine("0", false, "Hi Jamie, I'm the suiss Support assistant. How can I help?"))
    }
    var typing by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val progress by animateFloatAsState(
        if (open) 1f else 0f,
        if (open) tween(500, easing = SupportOpenEasing) else tween(250),
        label = "panel",
    )
    val launcher by animateFloatAsState(if (open) 0f else 1f, tween(400, easing = SupportPopEasing), label = "launcher")

    fun ask(question: String) {
        onSend(question)
        lines += SupportLine(lines.size.toString(), true, question)
        typing = true
        scope.launch {
            delay(1200)
            typing = false
            lines += SupportLine(lines.size.toString(), false, SupportAnswers[question] ?: SupportFallback)
        }
    }

    Screen(modifier, variant = ScreenVariant.Secondary) {
        Column(
            Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 32.dp),
        ) {
            BasicText("suiss Support", style = Typography.lg.copy(color = colors.mutedForeground, fontWeight = FontWeight.SemiBold))
            BasicText(
                "How can we help you?",
                modifier = Modifier
                    .padding(top = 6.dp)
                    .semantics { heading() },
                style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
            )
            Box(
                Modifier
                    .padding(top = 24.dp)
                    .fillMaxWidth()
                    .height(220.dp)
                    .background(colors.secondary, RoundedCornerShape(18.dp))
                    .clearAndSetSemantics { contentDescription = "A phone resting on a soft beige surface" },
                contentAlignment = Alignment.Center,
            ) {
                Icon(PhosphorIcons.Light.DeviceMobile, contentDescription = null, size = 96.dp, tint = colors.mutedForeground)
            }
        }
        BoxWithConstraints(
            Modifier
                .fillMaxSize()
                .imePadding()
                .padding(12.dp),
            contentAlignment = Alignment.BottomCenter,
        ) {
            if (progress > 0f) {
                val shape = RoundedCornerShape(22.dp)
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(min(520.dp, maxHeight))
                        .graphicsLayer {
                            transformOrigin = TransformOrigin(1f, 1f)
                            val scale = 0.2f + 0.8f * progress
                            scaleX = scale
                            scaleY = scale
                            alpha = progress.coerceIn(0f, 1f)
                        }
                        .shadow(Shadows.lg, shape)
                        .clip(shape)
                        .background(colors.background, shape)
                        .semantics { paneTitle = "suiss Support chat" },
                ) {
                    SupportPanel(lines, typing, ::ask, onAttach) {
                        open = false
                        onOpenChange(false)
                    }
                }
            }
            if (launcher > 0f) {
                Box(
                    Modifier
                        .align(Alignment.BottomEnd)
                        .padding(12.dp)
                        .graphicsLayer {
                            scaleX = launcher
                            scaleY = launcher
                        },
                ) {
                    Button(
                        onClick = {
                            open = true
                            onOpenChange(true)
                        },
                        size = ButtonSize.IconXl, enabled = !open) {
                        Icon(PhosphorIcons.Fill.ChatCircle, contentDescription = "Open chat", size = 24.dp)
                    }
                }
            }
        }
    }
}

@Composable
private fun ColumnScope.SupportPanel(
    lines: List<SupportLine>,
    typing: Boolean,
    onAsk: (String) -> Unit,
    onAttach: () -> Unit,
    onClose: () -> Unit,
) {
    val colors = EsuissTheme.colors
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 14.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.spacedBy(10.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            Modifier
                .size(34.dp)
                .background(colors.foreground, CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            BasicText("s", style = Typography.base.copy(color = colors.background, fontWeight = FontWeight.Bold))
        }
        Column(Modifier.weight(1f)) {
            BasicText("suiss Support", style = Typography.sm.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold))
            Row(horizontalArrangement = Arrangement.spacedBy(4.dp), verticalAlignment = Alignment.CenterVertically) {
                Box(
                    Modifier
                        .size(6.dp)
                        .background(Palette.green500, CircleShape),
                )
                BasicText("Online", style = Typography.xs2.copy(color = if (colors.isDark) Palette.green400 else Palette.green600))
            }
        }
        Button(onClick = onClose, variant = ButtonVariant.Secondary, size = ButtonSize.IconSm) {
            Icon(PhosphorIcons.Bold.X, contentDescription = "Close chat", size = 13.dp, tint = colors.mutedForeground)
        }
    }
    Box(
        Modifier
            .fillMaxWidth()
            .height(1.dp)
            .background(colors.border),
    )
    val keys = buildList {
        lines.forEach { add(it.id) }
        if (typing) add(SupportTypingKey)
    }
    MessageScroller(
        items = keys,
        key = { it },
        modifier = Modifier
            .weight(1f)
            .fillMaxWidth(),
        contentPadding = PaddingValues(horizontal = 14.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(4.dp, Alignment.Bottom),
    ) { key ->
        val line = lines.firstOrNull { it.id == key }
        if (line == null) SupportTypingBubble() else SupportBubble(line)
    }
    val quick = SupportAnswers.keys.filter { question -> lines.none { it.text == question } }
    if (quick.isNotEmpty()) {
        FlowRow(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 14.dp, end = 14.dp, bottom = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            quick.forEach { question ->
                Button(question, { onAsk(question) }, variant = ButtonVariant.Outline, size = ButtonSize.Sm)
            }
        }
    }
    SupportComposer(onAsk, onAttach)
}

@Composable
private fun SupportBubble(line: SupportLine) {
    val appear = remember { Animatable(0f) }
    LaunchedEffect(Unit) { appear.animateTo(1f, tween(700, easing = SupportEnterEasing)) }
    Message(
        modifier = Modifier.graphicsLayer {
            alpha = appear.value
            translationY = (1f - appear.value) * 8.dp.toPx()
        },
        align = if (line.mine) MessageAlign.End else MessageAlign.Start,
    ) {
        MessageContent {
            Bubble(
                modifier = Modifier.widthIn(max = 250.dp),
                variant = if (line.mine) BubbleVariant.Default else BubbleVariant.Muted,
                align = if (line.mine) BubbleAlign.End else BubbleAlign.Start,
            ) {
                BubbleContent {
                    BasicText(line.text, style = LocalContentStyle.current.merge(Typography.sm))
                }
            }
        }
    }
}

@Composable
private fun SupportTypingBubble() {
    val colors = EsuissTheme.colors
    val transition = rememberInfiniteTransition(label = "typing")
    Message {
        MessageContent {
            Bubble(variant = BubbleVariant.Muted) {
                BubbleContent(Modifier.semantics { contentDescription = "Typing" }) {
                    Row(
                        modifier = Modifier.padding(vertical = 5.dp),
                        horizontalArrangement = Arrangement.spacedBy(4.dp),
                    ) {
                        repeat(3) { dot ->
                            val alpha by transition.animateFloat(
                                initialValue = 0.35f,
                                targetValue = 1f,
                                animationSpec = infiniteRepeatable(
                                    animation = tween(550, delayMillis = dot * 180),
                                    repeatMode = RepeatMode.Reverse,
                                ),
                                label = "dot",
                            )
                            Box(
                                Modifier
                                    .size(8.dp)
                                    .graphicsLayer { this.alpha = alpha }
                                    .background(colors.mutedForeground, CircleShape),
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun SupportComposer(onSend: (String) -> Unit, onAttach: () -> Unit) {
    val colors = EsuissTheme.colors
    var draft by rememberSaveable { mutableStateOf("") }
    val ready = draft.isNotBlank()
    val scale by animateFloatAsState(if (ready) 1f else 0f, tween(300, easing = SupportPopEasing), label = "send")

    fun submit() {
        if (!ready) return
        onSend(draft.trim())
        draft = ""
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(start = 12.dp, end = 12.dp, top = 8.dp, bottom = 12.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Button(onClick = onAttach, variant = ButtonVariant.Secondary, size = ButtonSize.IconSm) {
            Icon(PhosphorIcons.Bold.Plus, contentDescription = "Add attachment", size = 18.dp, tint = colors.mutedForeground)
        }
        InputGroup(Modifier.weight(1f)) {
            InputGroupInput(
                value = draft,
                onValueChange = { draft = it },
                placeholder = "Type your question",
                keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences, imeAction = ImeAction.Send),
                keyboardActions = KeyboardActions(onSend = { submit() }),
            )
            InputGroupAddon(align = InputGroupAddonAlign.InlineEnd) {
                InputGroupButton(
                    onClick = ::submit,
                    modifier = Modifier.graphicsLayer {
                        scaleX = scale
                        scaleY = scale
                    },
                    size = InputGroupButtonSize.IconXs,
                    variant = ButtonVariant.Default,
                    enabled = ready,
                ) {
                    Icon(PhosphorIcons.Bold.ArrowUp, contentDescription = "Send", size = 14.dp)
                }
            }
        }
    }
}
