package com.esuiss.ui.blocks

import androidx.compose.animation.AnimatedContent
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
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshots.SnapshotStateList
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.bold.ArrowUp
import com.adamglin.phosphoricons.bold.Plus
import com.adamglin.phosphoricons.bold.Trash
import com.adamglin.phosphoricons.regular.Info
import com.adamglin.phosphoricons.regular.NotePencil
import com.adamglin.phosphoricons.regular.VideoCamera
import com.esuiss.ui.components.BottomBar
import com.esuiss.ui.components.Bubble
import com.esuiss.ui.components.BubbleAlign
import com.esuiss.ui.components.BubbleContent
import com.esuiss.ui.components.BubbleVariant
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Header
import com.esuiss.ui.components.HeaderActions
import com.esuiss.ui.components.HeaderBack
import com.esuiss.ui.components.HeaderLargeTitle
import com.esuiss.ui.components.HeaderTitle
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
import com.esuiss.ui.components.rememberHeaderState
import com.esuiss.ui.interactions.SwipeAction
import com.esuiss.ui.interactions.SwipeActionVariant
import com.esuiss.ui.interactions.SwipeActions
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

private val ConversationPopEasing = CubicBezierEasing(0.3f, 1.25f, 0.5f, 1f)

private val ConversationEnterEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private class ConversationLine(val id: String, val mine: Boolean, val text: String)

private class Conversation(
    val name: String,
    val tint: (Colors) -> Color,
    val time: String,
    val lines: SnapshotStateList<ConversationLine>,
)

private fun conversation(name: String, tint: (Colors) -> Color, time: String, vararg lines: String) = Conversation(
    name,
    tint,
    time,
    mutableStateListOf<ConversationLine>().apply {
        lines.forEachIndexed { index, line ->
            val from = line.substringBefore(":")
            add(ConversationLine("$name-$index", from == "me", line.substringAfter(":")))
        }
    },
)

private fun conversations() = listOf(
    conversation(
        "Riley Chen",
        { Palette.green500 },
        "9:41 AM",
        "them:Is the weekend trip to the coast still on?",
        "me:Yes! We leave Friday evening",
        "me:I booked the boat tour, it leaves at 5 AM",
        "them:Great, I'll bring the camera",
    ),
    conversation(
        "Morgan Lee",
        { Palette.orange500 },
        "8:12 AM",
        "them:I sent the deck, can you take a look?",
        "me:On it, back to you in 10 minutes",
    ),
    conversation(
        "Family",
        { Palette.purple500 },
        "Yesterday",
        "them:Is everyone coming for Sunday brunch?",
        "me:We'll be there",
        "them:I'll bring pastries",
    ),
    conversation("Taylor Kim", { Palette.teal500 }, "Monday", "them:What time does the game start?"),
)

private val ConversationReplies = listOf(
    "Sounds good",
    "Great, see you then!",
    "Ha, absolutely",
    "Let me check and get back to you",
)

private const val ConversationStamp = "stamp"

private const val ConversationTyping = "typing"

@Composable
fun ChatConversations(
    modifier: Modifier = Modifier,
    onSend: (text: String, conversation: String) -> Unit = { _, _ -> },
    onNewMessage: () -> Unit = {},
    onAttach: () -> Unit = {},
    onVideoCall: (conversation: String) -> Unit = {},
    onDetails: (conversation: String) -> Unit = {},
    onDelete: (conversation: String) -> Unit = {},
) {
    val threads = remember { mutableStateListOf<Conversation>().apply { addAll(conversations()) } }
    var selected by rememberSaveable { mutableStateOf<String?>(null) }
    var typing by remember { mutableStateOf<String?>(null) }
    var replyCount by remember { mutableIntStateOf(0) }
    val scope = rememberCoroutineScope()

    fun send(thread: Conversation, text: String) {
        onSend(text, thread.name)
        thread.lines += ConversationLine("${thread.name}-${thread.lines.size}", true, text)
        scope.launch {
            delay(500)
            typing = thread.name
            delay(1300)
            typing = null
            val reply = ConversationReplies[replyCount++ % ConversationReplies.size]
            thread.lines += ConversationLine("${thread.name}-${thread.lines.size}", false, reply)
        }
    }

    Screen(modifier) {
        AnimatedContent(
            targetState = threads.firstOrNull { it.name == selected },
            transitionSpec = {
                val forward = targetState != null
                (slideInHorizontally(tween(300)) { if (forward) it / 3 else -it / 3 } + fadeIn(tween(300))) togetherWith
                    (slideOutHorizontally(tween(300)) { if (forward) -it / 3 else it / 3 } + fadeOut(tween(200)))
            },
            label = "conversations",
        ) { thread ->
            if (thread == null) {
                ConversationList(
                    threads = threads,
                    onOpen = { selected = it },
                    onNewMessage = onNewMessage,
                    onDelete = { item ->
                        onDelete(item.name)
                        threads.remove(item)
                    },
                )
            } else {
                ConversationDetail(
                    thread = thread,
                    typing = typing == thread.name,
                    onBack = { selected = null },
                    onSend = { send(thread, it) },
                    onAttach = onAttach,
                    onVideoCall = { onVideoCall(thread.name) },
                    onDetails = { onDetails(thread.name) },
                )
            }
        }
    }
}

@Composable
private fun ConversationList(
    threads: List<Conversation>,
    onOpen: (String) -> Unit,
    onNewMessage: () -> Unit,
    onDelete: (Conversation) -> Unit,
) {
    val colors = EsuissTheme.colors
    val header = rememberHeaderState()
    Column(
        Modifier
            .fillMaxSize()
            .nestedScroll(header.nestedScrollConnection),
    ) {
        Header(state = header) {
            HeaderTitle("Messages")
            HeaderLargeTitle("Messages")
            HeaderActions {
                Button(onClick = onNewMessage, variant = ButtonVariant.Ghost, size = ButtonSize.Icon) {
                    Icon(PhosphorIcons.Regular.NotePencil, contentDescription = "New message", size = 20.dp, tint = colors.primary)
                }
            }
        }
        Column(
            Modifier
                .weight(1f)
                .fillMaxWidth()
                .verticalScroll(rememberScrollState()),
        ) {
            threads.forEachIndexed { index, thread ->
                key(thread.name) {
                    SwipeActions(
                        trailing = listOf(
                            SwipeAction(
                                label = "Delete",
                                onClick = { onDelete(thread) },
                                icon = PhosphorIcons.Bold.Trash,
                                variant = SwipeActionVariant.Destructive,
                                fullSwipe = true,
                            ),
                        ),
                    ) {
                        ConversationRow(thread, divided = index > 0) { onOpen(thread.name) }
                    }
                }
            }
        }
    }
}

@Composable
private fun ConversationRow(thread: Conversation, divided: Boolean, onClick: () -> Unit) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val last = thread.lines.lastOrNull()?.text.orEmpty()
    Box(
        Modifier
            .fillMaxWidth()
            .alpha(if (pressed) 0.8f else 1f)
            .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onClick),
    ) {
        if (divided) {
            Box(
                Modifier
                    .padding(start = 70.dp)
                    .fillMaxWidth()
                    .height(1.dp)
                    .background(colors.border),
            )
        }
        Row(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            ConversationInitials(thread, 42.dp)
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                    BasicText(
                        thread.name,
                        modifier = Modifier.weight(1f),
                        style = Typography.sm.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                    BasicText(thread.time, style = Typography.xs.copy(color = colors.mutedForeground))
                }
                BasicText(
                    last,
                    style = Typography.sm.copy(color = colors.mutedForeground),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
        }
    }
}

@Composable
private fun ConversationInitials(thread: Conversation, size: Dp) {
    val colors = EsuissTheme.colors
    Box(
        Modifier
            .size(size)
            .background(thread.tint(colors), CircleShape),
        contentAlignment = Alignment.Center,
    ) {
        BasicText(
            thread.name.split(" ").mapNotNull { it.firstOrNull() }.joinToString("").take(2),
            style = (if (size > 36.dp) Typography.base else Typography.xs2).copy(color = Palette.white, fontWeight = FontWeight.Medium),
        )
    }
}

@Composable
private fun ConversationDetail(
    thread: Conversation,
    typing: Boolean,
    onBack: () -> Unit,
    onSend: (String) -> Unit,
    onAttach: () -> Unit,
    onVideoCall: () -> Unit,
    onDetails: () -> Unit,
) {
    val colors = EsuissTheme.colors
    val keys = buildList {
        add(ConversationStamp)
        thread.lines.forEach { add(it.id) }
        if (typing) add(ConversationTyping)
    }
    Column(Modifier.fillMaxSize()) {
        Header {
            HeaderBack(onClick = onBack, text = "Messages")
            HeaderTitle(
                thread.name,
                modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
                subtitle = if (typing) "typing…" else "Message",
            )
            HeaderActions {
                Button(onClick = onVideoCall, variant = ButtonVariant.Ghost, size = ButtonSize.Icon) {
                    Icon(PhosphorIcons.Regular.VideoCamera, contentDescription = "Video call", size = 20.dp, tint = colors.primary)
                }
                Button(onClick = onDetails, variant = ButtonVariant.Ghost, size = ButtonSize.Icon) {
                    Icon(PhosphorIcons.Regular.Info, contentDescription = "Details", size = 20.dp, tint = colors.primary)
                }
            }
        }
        MessageScroller(
            items = keys,
            key = { it },
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .semantics { contentDescription = "Conversation with ${thread.name}" },
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 16.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp, Alignment.Bottom),
        ) { id ->
            when (id) {
                ConversationStamp -> BasicText(
                    "Today 9:30 AM",
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 4.dp, bottom = 10.dp),
                    style = Typography.xs2.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
                )
                ConversationTyping -> ConversationTypingBubble()
                else -> thread.lines.firstOrNull { it.id == id }?.let { ConversationBubble(it) }
            }
        }
        ConversationComposer(onSend, onAttach)
    }
}

@Composable
private fun ConversationBubble(line: ConversationLine) {
    val appear = remember { Animatable(0f) }
    LaunchedEffect(Unit) { appear.animateTo(1f, tween(700, easing = ConversationEnterEasing)) }
    Message(
        modifier = Modifier.graphicsLayer {
            alpha = appear.value
            translationY = (1f - appear.value) * 8.dp.toPx()
        },
        align = if (line.mine) MessageAlign.End else MessageAlign.Start,
    ) {
        MessageContent {
            Bubble(
                modifier = Modifier.widthIn(max = 280.dp),
                variant = if (line.mine) BubbleVariant.Default else BubbleVariant.Muted,
                align = if (line.mine) BubbleAlign.End else BubbleAlign.Start,
            ) {
                BubbleContent {
                    BasicText(line.text, style = LocalContentStyle.current)
                }
            }
        }
    }
}

@Composable
private fun ConversationTypingBubble() {
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
private fun ConversationComposer(onSend: (String) -> Unit, onAttach: () -> Unit) {
    val colors = EsuissTheme.colors
    var draft by rememberSaveable { mutableStateOf("") }
    val ready = draft.isNotBlank()
    val scale by animateFloatAsState(if (ready) 1f else 0f, tween(300, easing = ConversationPopEasing), label = "send")

    fun submit() {
        if (!ready) return
        onSend(draft.trim())
        draft = ""
    }

    BottomBar {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 12.dp),
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
                    placeholder = "Message",
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
