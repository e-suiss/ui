package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.runtime.withFrameNanos
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.ArrowUp
import com.adamglin.phosphoricons.regular.ChatsCircle
import com.adamglin.phosphoricons.regular.Checks
import com.adamglin.phosphoricons.regular.X
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Attachment
import com.esuiss.ui.components.AttachmentAction
import com.esuiss.ui.components.AttachmentActions
import com.esuiss.ui.components.AttachmentContent
import com.esuiss.ui.components.AttachmentDescription
import com.esuiss.ui.components.AttachmentLabel
import com.esuiss.ui.components.AttachmentMedia
import com.esuiss.ui.components.AttachmentMediaVariant
import com.esuiss.ui.components.AttachmentProgress
import com.esuiss.ui.components.AttachmentState
import com.esuiss.ui.components.AttachmentTitle
import com.esuiss.ui.components.Avatar
import com.esuiss.ui.components.AvatarFallback
import com.esuiss.ui.components.BottomBar
import com.esuiss.ui.components.BottomBarContent
import com.esuiss.ui.components.Bubble
import com.esuiss.ui.components.BubbleAlign
import com.esuiss.ui.components.BubbleContent
import com.esuiss.ui.components.BubbleReactions
import com.esuiss.ui.components.BubbleVariant
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Empty
import com.esuiss.ui.components.EmptyDescription
import com.esuiss.ui.components.EmptyHeader
import com.esuiss.ui.components.EmptyMedia
import com.esuiss.ui.components.EmptyMediaVariant
import com.esuiss.ui.components.EmptyTitle
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.InputGroup
import com.esuiss.ui.components.InputGroupAddon
import com.esuiss.ui.components.InputGroupAddonAlign
import com.esuiss.ui.components.InputGroupButton
import com.esuiss.ui.components.InputGroupButtonSize
import com.esuiss.ui.components.InputGroupInput
import com.esuiss.ui.components.Message
import com.esuiss.ui.components.MessageAlign
import com.esuiss.ui.components.MessageAvatar
import com.esuiss.ui.components.MessageContent
import com.esuiss.ui.components.MessageFooter
import com.esuiss.ui.components.MessageHeader
import com.esuiss.ui.components.MessageScroller
import com.esuiss.ui.components.MessageScrollerState
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.ScreenEdge
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.rememberMessageScrollerState
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

val messageScrollerStories = StoryGroup(
    section = Section.Components,
    title = "Message Scroller",
    stories = listOf(
        Story("Default", fullScreen = true) { MessageScrollerChat(messageScrollerThread) },
        Story("UnreadWhileScrolledUp", fullScreen = true) { MessageScrollerUnread() },
        Story("EmptyThread", fullScreen = true) { MessageScrollerChat(emptyList(), showEmpty = true) },
        Story("LoadOlder", fullScreen = true) { MessageScrollerLoadOlder() },
    ),
)

private class MessageScrollerFile(val name: String, val size: String, val progress: Float? = null)

private class MessageScrollerMessage(
    val id: String,
    val mine: Boolean,
    val texts: List<String>,
    val time: String? = null,
    val status: String? = null,
    val reaction: String? = null,
    val attachment: MessageScrollerFile? = null,
)

private val messageScrollerThread = listOf(
    MessageScrollerMessage("1", false, listOf("Hey, do you have a minute?", "The client moved the launch."), time = "9:12 AM"),
    MessageScrollerMessage("2", true, listOf("Sure, what's up?")),
    MessageScrollerMessage("3", false, listOf("It's Thursday now. Two days earlier than planned."), reaction = "😬 1"),
    MessageScrollerMessage(
        "4",
        true,
        listOf("We could ship onboarding behind a flag.", "Turn it on next week once QA is done."),
        status = "Read 9:15 AM",
    ),
    MessageScrollerMessage(
        "5",
        false,
        listOf("Here are the release notes."),
        time = "9:18 AM",
        attachment = MessageScrollerFile("Release notes.pdf", "1.2 MB"),
    ),
    MessageScrollerMessage(
        "6",
        true,
        listOf("And the checklist with my comments."),
        attachment = MessageScrollerFile("Checklist.pdf", "Uploading", 64f),
    ),
    MessageScrollerMessage("7", false, listOf("Perfect. Let's sync tomorrow at ten."), reaction = "👍 2"),
    MessageScrollerMessage("8", true, listOf("Sounds good, see you then."), status = "Delivered"),
)

private val messageScrollerSubjects = listOf(
    "Did you see the latest build?",
    "The onboarding copy needs one more pass.",
    "I can take the release notes.",
    "QA found two small issues on Android.",
    "Both are fixed in the next build.",
    "Can we move the review to the afternoon?",
)

private fun messageScrollerLongThread(count: Int, offset: Int = 0): List<MessageScrollerMessage> =
    List(count) { index ->
        val number = index + offset
        MessageScrollerMessage("m$number", number % 3 == 0, listOf(messageScrollerSubjects[number % messageScrollerSubjects.size]))
    }

@Composable
private fun MessageScrollerRow(message: MessageScrollerMessage) {
    val colors = EsuissTheme.colors
    val mine = message.mine
    Message(Modifier.fillMaxWidth(), align = if (mine) MessageAlign.End else MessageAlign.Start) {
        if (!mine) {
            MessageAvatar {
                Avatar(fallback = { AvatarFallback("MK") })
            }
        }
        MessageContent {
            if (message.time != null && !mine) MessageHeader("Maya · ${message.time}")
            val file = message.attachment
            if (file != null) {
                Attachment(
                    Modifier.width(256.dp),
                    state = if (file.progress != null) AttachmentState.Uploading else AttachmentState.Done,
                ) {
                    AttachmentMedia(variant = AttachmentMediaVariant.Document) {
                        AttachmentLabel("pdf", background = Palette.red500)
                    }
                    AttachmentContent {
                        AttachmentTitle(file.name)
                        if (file.progress != null) {
                            AttachmentProgress(file.progress, contentDescription = "Uploading")
                        } else {
                            AttachmentDescription(file.size)
                        }
                    }
                    if (file.progress != null) {
                        AttachmentActions {
                            AttachmentAction(onClick = {}, contentDescription = "Cancel upload") {
                                Icon(PhosphorIcons.Regular.X, contentDescription = null)
                            }
                        }
                    }
                }
            }
            message.texts.forEachIndexed { index, text ->
                Bubble(variant = if (mine) BubbleVariant.Default else BubbleVariant.Muted) {
                    BubbleContent(text)
                    if (message.reaction != null && index == message.texts.lastIndex) {
                        BubbleReactions(message.reaction, align = if (mine) BubbleAlign.Start else BubbleAlign.End)
                    }
                }
            }
            if (message.status != null) {
                MessageFooter {
                    Icon(PhosphorIcons.Regular.Checks, contentDescription = null, tint = colors.primary)
                    Text(message.status)
                }
            }
        }
    }
}

@Composable
private fun MessageScrollerComposer(state: MessageScrollerState, onSend: (String) -> Unit) {
    var value by rememberSaveable { mutableStateOf("") }
    val scope = rememberCoroutineScope()
    val send = {
        val text = value.trim()
        if (text.isNotEmpty()) {
            onSend(text)
            value = ""
            scope.launch {
                withFrameNanos { }
                state.scrollToEnd()
            }
        }
    }
    BottomBar(separator = true) {
        BottomBarContent {
            InputGroup {
                InputGroupInput(
                    value,
                    { value = it },
                    placeholder = "Message",
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
                    keyboardActions = KeyboardActions(onSend = { send() }),
                )
                InputGroupAddon(align = InputGroupAddonAlign.InlineEnd) {
                    InputGroupButton(
                        onClick = { send() },
                        modifier = Modifier.semantics { contentDescription = "Send" },
                        size = InputGroupButtonSize.IconXs,
                        variant = ButtonVariant.Default,
                        enabled = value.isNotBlank(),
                    ) {
                        Icon(PhosphorIcons.Regular.ArrowUp, contentDescription = null)
                    }
                }
            }
        }
    }
}

@Composable
private fun MessageScrollerEmpty(modifier: Modifier) {
    Empty(modifier) {
        EmptyHeader {
            EmptyMedia(variant = EmptyMediaVariant.Icon) {
                Icon(PhosphorIcons.Regular.ChatsCircle, contentDescription = null)
            }
            EmptyTitle("No messages yet")
            EmptyDescription("Say hello to start the conversation.")
        }
    }
}

@Composable
private fun MessageScrollerFrame(
    edges: Set<ScreenEdge> = setOf(ScreenEdge.Top, ScreenEdge.Left, ScreenEdge.Right),
    content: @Composable ColumnScope.() -> Unit,
) {
    Screen(edges = edges) {
        Column(Modifier.fillMaxSize()) {
            content()
        }
    }
}

@Composable
private fun MessageScrollerList(
    messages: List<MessageScrollerMessage>,
    state: MessageScrollerState,
    modifier: Modifier,
    onLoadOlder: (() -> Unit)? = null,
    loadingOlder: Boolean = false,
) {
    MessageScroller(
        items = messages,
        key = { it.id },
        modifier = modifier,
        state = state,
        onLoadOlder = onLoadOlder,
        loadingOlder = loadingOlder,
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp, Alignment.Bottom),
    ) { message ->
        MessageScrollerRow(message)
    }
}

@Composable
private fun MessageScrollerChat(
    initial: List<MessageScrollerMessage>,
    showEmpty: Boolean = false,
    onReady: (suspend (append: (List<MessageScrollerMessage>) -> Unit, state: MessageScrollerState) -> Unit)? = null,
) {
    var messages by remember { mutableStateOf(initial) }
    val state = rememberMessageScrollerState()
    val append: (List<MessageScrollerMessage>) -> Unit = { next -> messages = messages + next }
    if (onReady != null) {
        LaunchedEffect(Unit) { onReady(append, state) }
    }
    MessageScrollerFrame {
        Box(Modifier.weight(1f).fillMaxWidth()) {
            MessageScrollerList(messages, state, Modifier.fillMaxSize())
            if (showEmpty && messages.isEmpty()) {
                MessageScrollerEmpty(Modifier.align(Alignment.Center))
            }
        }
        MessageScrollerComposer(state) { text ->
            append(listOf(MessageScrollerMessage("sent-${System.currentTimeMillis()}", true, listOf(text))))
        }
    }
}

@Composable
private fun MessageScrollerUnread() {
    MessageScrollerChat(messageScrollerLongThread(40)) { append, state ->
        delay(300)
        state.scrollToStart(animated = false)
        delay(600)
        append(
            listOf(
                MessageScrollerMessage("n1", false, listOf("Are you there?")),
                MessageScrollerMessage("n2", false, listOf("The build is green.")),
                MessageScrollerMessage("n3", false, listOf("Merging now.")),
            ),
        )
    }
}

@Composable
private fun MessageScrollerLoadOlder() {
    var messages by remember { mutableStateOf(messageScrollerLongThread(15, 45)) }
    var loading by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val state = rememberMessageScrollerState()
    val oldest = messages.firstOrNull()?.id?.drop(1)?.toIntOrNull() ?: 0
    val loadOlder = {
        if (!loading && oldest > 0) {
            loading = true
            scope.launch {
                delay(800)
                messages = messageScrollerLongThread(minOf(15, oldest), maxOf(0, oldest - 15)) + messages
                loading = false
            }
        }
    }
    MessageScrollerFrame(ScreenEdge.entries.toSet()) {
        MessageScrollerList(
            messages,
            state,
            Modifier.weight(1f).fillMaxWidth(),
            onLoadOlder = { loadOlder() },
            loadingOlder = loading,
        )
    }
}
