package com.esuiss.ui.blocks

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.onClick
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.bold.ArrowUp
import com.adamglin.phosphoricons.bold.CaretRight
import com.adamglin.phosphoricons.bold.Plus
import com.adamglin.phosphoricons.bold.X
import com.adamglin.phosphoricons.fill.Heart
import com.adamglin.phosphoricons.regular.Image
import com.esuiss.ui.components.Attachment
import com.esuiss.ui.components.AttachmentAction
import com.esuiss.ui.components.AttachmentActions
import com.esuiss.ui.components.AttachmentContent
import com.esuiss.ui.components.AttachmentDescription
import com.esuiss.ui.components.AttachmentMedia
import com.esuiss.ui.components.AttachmentMediaVariant
import com.esuiss.ui.components.AttachmentSize
import com.esuiss.ui.components.AttachmentTitle
import com.esuiss.ui.components.Avatar
import com.esuiss.ui.components.AvatarSize
import com.esuiss.ui.components.BottomBar
import com.esuiss.ui.components.Bubble
import com.esuiss.ui.components.BubbleAlign
import com.esuiss.ui.components.BubbleContent
import com.esuiss.ui.components.BubbleReactions
import com.esuiss.ui.components.BubbleReactionsSide
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
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

private val ThreadPopEasing = CubicBezierEasing(0.3f, 1.25f, 0.5f, 1f)

private val ThreadEnterEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private class ThreadLine(
    val id: String,
    val mine: Boolean,
    val text: String,
    val liked: Boolean = false,
    val photo: Boolean = false,
)

private const val ThreadPhotoName = "IMG_0142.jpeg"

private const val ThreadPhotoSize = "1.8 MB"

private sealed interface ThreadRow {
    val key: String
}

private object ThreadStamp : ThreadRow {
    override val key = "stamp"
}

private object ThreadTyping : ThreadRow {
    override val key = "typing"
}

private class ThreadText(val line: ThreadLine) : ThreadRow {
    override val key get() = line.id
}

private val ThreadOpening = listOf(
    ThreadLine("0", false, "Is the weekend trip to the coast still on?"),
    ThreadLine("1", true, "Yes! We leave Friday evening"),
    ThreadLine("2", true, "I booked the boat tour, it leaves at 5 AM"),
    ThreadLine("3", false, "Great, I'll bring the camera"),
)

private val ThreadReplies = listOf(
    "Sounds good",
    "Great, see you then!",
    "Ha, absolutely",
    "Let me check and get back to you",
)

@Composable
fun ChatThread(
    modifier: Modifier = Modifier,
    onSend: (text: String, attachment: String?) -> Unit = { _, _ -> },
    onAttach: () -> Unit = {},
    onOpenContact: () -> Unit = {},
    onLikeChange: (id: String, liked: Boolean) -> Unit = { _, _ -> },
) {
    val colors = EsuissTheme.colors
    val lines = remember { mutableStateListOf<ThreadLine>().apply { addAll(ThreadOpening) } }
    var typing by remember { mutableStateOf(false) }
    var replyCount by remember { mutableIntStateOf(0) }
    val scope = rememberCoroutineScope()

    fun toggleLike(id: String) {
        val index = lines.indexOfFirst { it.id == id }
        if (index < 0) return
        val line = lines[index]
        onLikeChange(line.id, !line.liked)
        lines[index] = ThreadLine(line.id, line.mine, line.text, !line.liked, line.photo)
    }

    fun send(text: String, photo: Boolean) {
        onSend(text, if (photo) ThreadPhotoName else null)
        lines += ThreadLine(lines.size.toString(), true, text, photo = photo)
        scope.launch {
            delay(500)
            typing = true
            delay(1300)
            typing = false
            val reply = ThreadReplies[replyCount++ % ThreadReplies.size]
            lines += ThreadLine(lines.size.toString(), false, reply)
        }
    }

    val rows = buildList {
        add(ThreadStamp)
        lines.forEach { add(ThreadText(it)) }
        if (typing) add(ThreadTyping)
    }

    Screen(modifier) {
        Column(Modifier.fillMaxSize()) {
            ThreadContact(onOpenContact)
            MessageScroller(
                items = rows,
                key = { it.key },
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth(),
                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 12.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp, Alignment.Bottom),
            ) { row ->
                when (row) {
                    ThreadStamp -> BasicText(
                        "Today 9:30 AM",
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 4.dp, bottom = 10.dp),
                        style = Typography.xs.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
                    )
                    ThreadTyping -> ThreadTypingBubble()
                    is ThreadText -> ThreadBubble(row.line) { toggleLike(row.line.id) }
                }
            }
            ThreadComposer("Message", ::send, onAttach)
        }
    }
}

@Composable
private fun ThreadContact(onPress: () -> Unit) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(colors.background)
            .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onPress),
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .graphicsLayer { alpha = if (pressed) 0.8f else 1f }
                .padding(top = 8.dp, bottom = 10.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(4.dp),
        ) {
            Avatar(
                modifier = Modifier.size(48.dp),
                size = AvatarSize.Lg,
                fallback = {
                    Box(
                        Modifier
                            .fillMaxSize()
                            .background(Palette.green500, CircleShape),
                        contentAlignment = Alignment.Center,
                    ) {
                        BasicText("RC", style = Typography.lg.copy(color = Palette.white, fontWeight = FontWeight.Medium))
                    }
                },
            )
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(2.dp)) {
                BasicText("Riley", style = Typography.xs.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold))
                Icon(PhosphorIcons.Bold.CaretRight, contentDescription = null, size = 10.dp, tint = colors.mutedForeground)
            }
        }
        Box(
            Modifier
                .fillMaxWidth()
                .height(1.dp)
                .background(colors.border),
        )
    }
}

@Composable
private fun ThreadBubble(line: ThreadLine, onToggleLike: () -> Unit) {
    val colors = EsuissTheme.colors
    val appear = remember { Animatable(0f) }
    val currentOnToggleLike by rememberUpdatedState(onToggleLike)
    LaunchedEffect(Unit) { appear.animateTo(1f, tween(700, easing = ThreadEnterEasing)) }
    val align = if (line.mine) BubbleAlign.End else BubbleAlign.Start
    Message(
        modifier = Modifier.graphicsLayer {
            alpha = appear.value
            translationY = (1f - appear.value) * 8.dp.toPx()
        },
        align = if (line.mine) MessageAlign.End else MessageAlign.Start,
    ) {
        MessageContent {
            if (line.photo) ThreadPhoto()
            if (line.text.isNotEmpty()) Bubble(
                modifier = Modifier.widthIn(max = 260.dp),
                variant = if (line.mine) BubbleVariant.Default else BubbleVariant.Muted,
                align = align,
            ) {
                BubbleContent(
                    modifier = Modifier
                        .pointerInput(Unit) { detectTapGestures(onDoubleTap = { currentOnToggleLike() }) }
                        .semantics(mergeDescendants = true) {
                            if (line.liked) stateDescription = "Liked"
                            onClick(label = if (line.liked) "Remove the heart" else "Add a heart") {
                                onToggleLike()
                                true
                            }
                        },
                ) {
                    BasicText(line.text, style = LocalContentStyle.current)
                }
                if (line.liked) {
                    val pop = remember { Animatable(0f) }
                    LaunchedEffect(Unit) { pop.animateTo(1f, tween(300, easing = ThreadPopEasing)) }
                    BubbleReactions(
                        modifier = Modifier.graphicsLayer {
                            scaleX = pop.value
                            scaleY = pop.value
                        },
                        side = BubbleReactionsSide.Top,
                        align = if (line.mine) BubbleAlign.Start else BubbleAlign.End,
                    ) {
                        Box(
                            Modifier
                                .size(22.dp)
                                .background(colors.primary, CircleShape),
                            contentAlignment = Alignment.Center,
                        ) {
                            Icon(PhosphorIcons.Fill.Heart, contentDescription = null, size = 13.dp, tint = colors.primaryForeground)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ThreadTypingBubble() {
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
private fun ThreadComposer(placeholder: String, onSend: (String, Boolean) -> Unit, onAttach: () -> Unit) {
    val colors = EsuissTheme.colors
    var draft by rememberSaveable { mutableStateOf("") }
    var photo by rememberSaveable { mutableStateOf(false) }
    val ready = draft.isNotBlank() || photo
    val scale by animateFloatAsState(if (ready) 1f else 0f, tween(300, easing = ThreadPopEasing), label = "send")

    fun submit() {
        if (!ready) return
        onSend(draft.trim(), photo)
        draft = ""
        photo = false
    }

    BottomBar {
        AnimatedVisibility(
            visible = photo,
            enter = fadeIn(tween(300)) + slideInVertically(tween(300)) { it / 3 },
            exit = fadeOut(tween(150)),
        ) {
            Box(Modifier.padding(start = 50.dp, top = 6.dp)) {
                ThreadPhoto(onRemove = { photo = false })
            }
        }
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 10.dp, end = 10.dp, top = 6.dp, bottom = 10.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Button(
                onClick = {
                    onAttach()
                    photo = true
                },
                variant = ButtonVariant.Secondary, size = ButtonSize.IconSm) {
                Icon(PhosphorIcons.Bold.Plus, contentDescription = "Add attachment", size = 18.dp, tint = colors.mutedForeground)
            }
            InputGroup(Modifier.weight(1f)) {
                InputGroupInput(
                    value = draft,
                    onValueChange = { draft = it },
                    placeholder = placeholder,
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
}

@Composable
private fun ThreadPhoto(onRemove: (() -> Unit)? = null) {
    val colors = EsuissTheme.colors
    Attachment(modifier = Modifier.width(224.dp), size = AttachmentSize.Sm) {
        AttachmentMedia(variant = AttachmentMediaVariant.Icon) {
            Icon(PhosphorIcons.Regular.Image, contentDescription = null, tint = colors.mutedForeground)
        }
        AttachmentContent {
            AttachmentTitle(ThreadPhotoName)
            AttachmentDescription(ThreadPhotoSize)
        }
        if (onRemove != null) {
            AttachmentActions {
                AttachmentAction(onClick = onRemove, contentDescription = "Remove attachment") {
                    Icon(PhosphorIcons.Bold.X, contentDescription = null)
                }
            }
        }
    }
}
