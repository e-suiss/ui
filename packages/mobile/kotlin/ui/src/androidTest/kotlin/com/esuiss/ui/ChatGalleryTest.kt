package com.esuiss.ui

import android.graphics.Bitmap
import android.os.SystemClock
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.painter.BrushPainter
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.getUnclippedBoundsInRoot
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performTouchInput
import androidx.compose.ui.test.swipeDown
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.ArrowUp
import com.adamglin.phosphoricons.regular.ChatCircle
import com.adamglin.phosphoricons.regular.FileText
import com.adamglin.phosphoricons.regular.Plus
import com.adamglin.phosphoricons.regular.UploadSimple
import com.adamglin.phosphoricons.regular.X
import com.esuiss.ui.components.Attachment
import com.esuiss.ui.components.AttachmentAction
import com.esuiss.ui.components.AttachmentActions
import com.esuiss.ui.components.AttachmentContent
import com.esuiss.ui.components.AttachmentDescription
import com.esuiss.ui.components.AttachmentGroup
import com.esuiss.ui.components.AttachmentLabel
import com.esuiss.ui.components.AttachmentMedia
import com.esuiss.ui.components.AttachmentMediaVariant
import com.esuiss.ui.components.AttachmentOrientation
import com.esuiss.ui.components.AttachmentProgress
import com.esuiss.ui.components.AttachmentSize
import com.esuiss.ui.components.AttachmentState
import com.esuiss.ui.components.AttachmentTitle
import com.esuiss.ui.components.Avatar
import com.esuiss.ui.components.AvatarFallback
import com.esuiss.ui.components.BottomBar
import com.esuiss.ui.components.BottomBarContent
import com.esuiss.ui.components.Bubble
import com.esuiss.ui.components.BubbleAlign
import com.esuiss.ui.components.BubbleContent
import com.esuiss.ui.components.BubbleGroup
import com.esuiss.ui.components.BubbleReactions
import com.esuiss.ui.components.BubbleReactionsSide
import com.esuiss.ui.components.BubbleVariant
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Empty
import com.esuiss.ui.components.EmptyDescription
import com.esuiss.ui.components.EmptyHeader
import com.esuiss.ui.components.EmptyMedia
import com.esuiss.ui.components.EmptyMediaVariant
import com.esuiss.ui.components.EmptyTitle
import com.esuiss.ui.components.Header
import com.esuiss.ui.components.HeaderTitle
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
import com.esuiss.ui.components.MessageGroup
import com.esuiss.ui.components.MessageHeader
import com.esuiss.ui.components.MessageScroller
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.Spinner
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Typography
import java.io.File
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

private enum class ChatScene {
    Bubbles,
    Messages,
    Attachments,
    AttachmentLayouts,
    Thread,
    ThreadScrolledUp,
    ThreadOlder,
    Empty,
}

private enum class Upload { None, Document, Uploading, Image }

private class Turn(
    val id: Int,
    val mine: Boolean,
    val texts: List<String>,
    val name: String? = null,
    val footer: String? = null,
    val reaction: String? = null,
    val upload: Upload = Upload.None,
)

private class ChatThread(initial: List<Turn>) {
    val turns = mutableStateListOf<Turn>().apply { addAll(initial) }
    var loading by mutableStateOf(false)
    var requests by mutableIntStateOf(0)
}

private val ShortLines = listOf(
    "Did you see the new build?",
    "Yes, testing it now.",
    "The sync feels much faster.",
    "Agreed, the list scrolls smoothly too.",
    "Any crashes so far?",
    "None on my side.",
    "Great, let's keep an eye on it.",
)

private fun shortTurn(id: Int) = Turn(id, id % 2 == 1, listOf("${ShortLines[id % ShortLines.size]} #$id"))

private val FullThread = listOf(
    Turn(1, false, listOf("Morning! Did the build pass?", "I want to ship before the weekend."), name = "Maya Kim", footer = "9:41 AM"),
    Turn(2, true, listOf("All green. Merging it now."), footer = "Read 9:43 AM", reaction = "👍"),
    Turn(3, false, listOf("Here are the notes for the release."), footer = "9:45 AM", reaction = "❤️ 2", upload = Upload.Document),
    Turn(4, true, listOf("Uploading the screenshots now."), footer = "Sending…", upload = Upload.Uploading),
    Turn(5, false, listOf("Love the new onboarding 🎉"), footer = "9:48 AM", upload = Upload.Image),
)

private fun threadFor(scene: ChatScene): ChatThread = when (scene) {
    ChatScene.Thread -> ChatThread(FullThread)
    ChatScene.ThreadScrolledUp -> ChatThread(List(30) { shortTurn(100 + it) })
    ChatScene.ThreadOlder -> ChatThread(List(24) { shortTurn(100 + it) })
    else -> ChatThread(emptyList())
}

@Composable
private fun Section(title: String, content: @Composable ColumnScope.() -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        BasicText(title, style = Typography.xs.copy(color = EsuissTheme.colors.mutedForeground, fontWeight = FontWeight.SemiBold))
        content()
    }
}

@Composable
private fun Page(content: @Composable ColumnScope.() -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .safeDrawingPadding()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(24.dp),
        content = content,
    )
}

@Composable
private fun rememberPhoto(): BrushPainter {
    val colors = EsuissTheme.colors
    return remember(colors) { BrushPainter(Brush.linearGradient(listOf(Palette.teal500, Palette.blue500, Palette.indigo500))) }
}

@Composable
private fun Bubbles() {
    Page {
        Section("Variants") {
            BubbleGroup {
                BubbleVariant.entries.forEach { variant ->
                    Bubble(variant = variant, align = if (variant.ordinal % 2 == 0) BubbleAlign.End else BubbleAlign.Start) {
                        BubbleContent(if (variant == BubbleVariant.Ghost) "Ghost keeps the text plain." else variant.name)
                    }
                }
            }
        }
        Section("Conversation") {
            BubbleGroup {
                Bubble(variant = BubbleVariant.Muted) { BubbleContent("Are we still on for lunch?") }
                Bubble(align = BubbleAlign.End) { BubbleContent("Yes! Noon works.") }
                Bubble(align = BubbleAlign.End) { BubbleContent("Same place as last time?") }
                Bubble(variant = BubbleVariant.Muted) { BubbleContent("Perfect, see you there.") }
            }
        }
        Section("Reactions") {
            BubbleGroup {
                Bubble(variant = BubbleVariant.Muted) {
                    BubbleContent("The new icons look sharp.")
                    BubbleReactions("👍 2")
                }
                Bubble(align = BubbleAlign.End) {
                    BubbleContent("Thanks, took a while to get right.", onLongPress = {})
                    BubbleReactions("❤️", align = BubbleAlign.Start)
                }
                Bubble(variant = BubbleVariant.Secondary) {
                    BubbleContent("Shipping them on Friday.")
                    BubbleReactions("😂 3", side = BubbleReactionsSide.Top)
                }
            }
        }
    }
}

@Composable
private fun Messages() {
    Page {
        Section("Header and footer") {
            Message {
                MessageAvatar { Avatar(fallback = { AvatarFallback("JL") }) }
                MessageContent {
                    MessageHeader("Jordan Lee")
                    Bubble(variant = BubbleVariant.Muted) { BubbleContent("I pushed the updated designs to the shared folder.") }
                    MessageFooter("9:41 AM")
                }
            }
        }
        Section("Conversation") {
            MessageGroup(Modifier.fillMaxWidth()) {
                Message {
                    MessageAvatar { Avatar(fallback = { AvatarFallback("MK") }) }
                    MessageContent {
                        Bubble(variant = BubbleVariant.Muted) { BubbleContent("Did the build pass?") }
                        Bubble(variant = BubbleVariant.Muted) { BubbleContent("I want to ship before the weekend.") }
                    }
                }
                Message(align = MessageAlign.End) {
                    MessageContent {
                        Bubble { BubbleContent("All green. Merging it now.") }
                        MessageFooter("Read 10:02 AM")
                    }
                }
            }
        }
        Section("Ghost") {
            Message {
                MessageAvatar { Avatar(fallback = { AvatarFallback("RB") }) }
                MessageContent {
                    MessageHeader("Release bot")
                    Bubble(variant = BubbleVariant.Ghost) {
                        BubbleContent("Build 482 passed all checks and is ready for review.")
                    }
                    MessageFooter("10:05 AM")
                }
            }
        }
    }
}

@Composable
private fun PdfAttachment(state: AttachmentState, title: String, modifier: Modifier = Modifier, content: @Composable () -> Unit) {
    Attachment(modifier, state = state) {
        AttachmentMedia(variant = AttachmentMediaVariant.Document) {
            AttachmentLabel("pdf", background = Palette.red500)
        }
        AttachmentContent {
            AttachmentTitle(title)
            content()
        }
    }
}

@Composable
private fun Attachments() {
    Page {
        Section("States") {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Attachment(Modifier.fillMaxWidth(), state = AttachmentState.Idle) {
                    AttachmentMedia { Icon(PhosphorIcons.Regular.UploadSimple, contentDescription = null) }
                    AttachmentContent {
                        AttachmentTitle("Drop a file here")
                        AttachmentDescription("PDF, PNG or JPG up to 10 MB")
                    }
                    AttachmentActions { AttachmentAction("Choose File", onClick = {}) }
                }
                Attachment(Modifier.fillMaxWidth(), state = AttachmentState.Uploading) {
                    AttachmentMedia(variant = AttachmentMediaVariant.Document) {
                        AttachmentLabel("pdf", background = Palette.red500)
                    }
                    AttachmentContent {
                        AttachmentTitle("Invoice March.pdf")
                        AttachmentProgress(64f, contentDescription = "Uploading")
                    }
                    AttachmentActions {
                        AttachmentAction(onClick = {}, contentDescription = "Cancel upload") {
                            Icon(PhosphorIcons.Regular.X, contentDescription = null)
                        }
                    }
                }
                Attachment(Modifier.fillMaxWidth(), state = AttachmentState.Processing) {
                    AttachmentMedia(variant = AttachmentMediaVariant.Document) {
                        AttachmentLabel("pdf", background = Palette.red500)
                    }
                    AttachmentContent {
                        AttachmentTitle("Invoice March.pdf")
                        AttachmentDescription("Processing…")
                    }
                    AttachmentActions { Spinner(size = 20.dp, color = EsuissTheme.colors.mutedForeground) }
                }
                Attachment(Modifier.fillMaxWidth(), state = AttachmentState.Error) {
                    AttachmentMedia(variant = AttachmentMediaVariant.Document) {
                        AttachmentLabel("key", background = Palette.orange500)
                    }
                    AttachmentContent {
                        AttachmentTitle("Presentation.key")
                        AttachmentDescription("File type not supported")
                    }
                    AttachmentActions {
                        AttachmentAction(onClick = {}, contentDescription = "Remove") {
                            Icon(PhosphorIcons.Regular.X, contentDescription = null)
                        }
                    }
                }
                PdfAttachment(AttachmentState.Done, "Invoice March.pdf", Modifier.fillMaxWidth()) {
                    AttachmentDescription("1.1 MB")
                }
            }
        }
        Section("Sizes") {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                AttachmentSize.entries.forEach { size ->
                    Attachment(size = size) {
                        AttachmentMedia { Icon(PhosphorIcons.Regular.FileText, contentDescription = null) }
                        AttachmentContent {
                            AttachmentTitle("Meeting notes.docx")
                            AttachmentDescription("184 KB")
                        }
                        AttachmentActions {
                            AttachmentAction(onClick = {}, contentDescription = "Remove") {
                                Icon(PhosphorIcons.Regular.X, contentDescription = null)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun AttachmentLayouts() {
    val photo = rememberPhoto()
    Page {
        Section("Image") {
            Attachment {
                AttachmentMedia(photo, contentDescription = "Mountain lake")
                AttachmentContent {
                    AttachmentTitle("Lake.jpg")
                    AttachmentDescription("3.2 MB")
                }
                AttachmentActions {
                    AttachmentAction(onClick = {}, contentDescription = "Remove") {
                        Icon(PhosphorIcons.Regular.X, contentDescription = null)
                    }
                }
            }
        }
        Section("Vertical") {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.Top) {
                Attachment(orientation = AttachmentOrientation.Vertical) {
                    AttachmentMedia(photo, contentDescription = "Mountain lake")
                    AttachmentActions {
                        AttachmentAction(onClick = {}, contentDescription = "Remove") {
                            Icon(PhosphorIcons.Regular.X, contentDescription = null)
                        }
                    }
                }
                Attachment(orientation = AttachmentOrientation.Vertical) {
                    AttachmentMedia(photo, contentDescription = "Forest trail")
                    AttachmentContent {
                        AttachmentTitle("Trail.jpg")
                        AttachmentDescription("2.8 MB")
                    }
                }
                Attachment(orientation = AttachmentOrientation.Vertical, state = AttachmentState.Uploading) {
                    AttachmentMedia { Spinner(size = 24.dp) }
                    AttachmentContent {
                        AttachmentTitle("Clip.mov")
                        AttachmentDescription("Uploading")
                    }
                }
            }
        }
        Section("Group") {
            AttachmentGroup {
                PdfAttachment(AttachmentState.Uploading, "Contract draft.pdf") {
                    AttachmentProgress(38f, contentDescription = "Uploading")
                }
                PdfAttachment(AttachmentState.Processing, "Terms.pdf") {
                    AttachmentDescription("Processing…")
                }
                Attachment(state = AttachmentState.Done) {
                    AttachmentMedia(photo, contentDescription = "Office")
                    AttachmentContent {
                        AttachmentTitle("Office.jpg")
                        AttachmentDescription("1.9 MB")
                    }
                }
                Attachment(state = AttachmentState.Error) {
                    AttachmentMedia { Icon(PhosphorIcons.Regular.FileText, contentDescription = null) }
                    AttachmentContent {
                        AttachmentTitle("Budget.numbers")
                        AttachmentDescription("Upload failed")
                    }
                    AttachmentActions { AttachmentAction("Try Again", onClick = {}) }
                }
            }
        }
    }
}

@Composable
private fun TurnRow(turn: Turn) {
    val photo = rememberPhoto()
    Message(align = if (turn.mine) MessageAlign.End else MessageAlign.Start) {
        if (!turn.mine) {
            if (turn.name != null || turn.footer != null) {
                MessageAvatar { Avatar(fallback = { AvatarFallback("MK") }) }
            } else {
                Spacer(Modifier.width(32.dp))
            }
        }
        MessageContent {
            if (turn.name != null) MessageHeader(turn.name)
            when (turn.upload) {
                Upload.Document -> PdfAttachment(AttachmentState.Done, "Release notes.pdf") { AttachmentDescription("1.1 MB") }
                Upload.Uploading -> Attachment(Modifier.width(260.dp), state = AttachmentState.Uploading) {
                    AttachmentMedia { Icon(PhosphorIcons.Regular.FileText, contentDescription = null) }
                    AttachmentContent {
                        AttachmentTitle("Screenshots.zip")
                        AttachmentProgress(64f, contentDescription = "Uploading")
                    }
                    AttachmentActions {
                        AttachmentAction(onClick = {}, contentDescription = "Cancel upload") {
                            Icon(PhosphorIcons.Regular.X, contentDescription = null)
                        }
                    }
                }
                Upload.Image -> Attachment(orientation = AttachmentOrientation.Vertical) {
                    AttachmentMedia(photo, contentDescription = "Onboarding screen")
                }
                Upload.None -> Unit
            }
            turn.texts.forEachIndexed { index, text ->
                Bubble(variant = if (turn.mine) BubbleVariant.Default else BubbleVariant.Muted) {
                    BubbleContent(text, onLongPress = {})
                    if (turn.reaction != null && index == turn.texts.lastIndex) {
                        BubbleReactions(turn.reaction, align = if (turn.mine) BubbleAlign.Start else BubbleAlign.End)
                    }
                }
            }
            if (turn.footer != null) MessageFooter(turn.footer)
        }
    }
}

@Composable
private fun Composer() {
    var draft by remember { mutableStateOf("") }
    BottomBar(separator = true) {
        BottomBarContent {
            InputGroup {
                InputGroupAddon {
                    InputGroupButton(onClick = {}, size = InputGroupButtonSize.IconXs, variant = ButtonVariant.Outline) {
                        Icon(PhosphorIcons.Regular.Plus, contentDescription = "Attach")
                    }
                }
                InputGroupInput(draft, { draft = it }, placeholder = "Message")
                InputGroupAddon(align = InputGroupAddonAlign.InlineEnd) {
                    InputGroupButton(onClick = {}, size = InputGroupButtonSize.IconXs, variant = ButtonVariant.Default) {
                        Icon(PhosphorIcons.Regular.ArrowUp, contentDescription = "Send")
                    }
                }
            }
        }
    }
}

@Composable
private fun ThreadScreen(chat: ChatThread) {
    Screen {
        Column(Modifier.fillMaxSize()) {
            Header { HeaderTitle("Maya Kim", subtitle = "Online") }
            if (chat.turns.isEmpty()) {
                Box(Modifier.weight(1f).fillMaxWidth(), contentAlignment = Alignment.Center) {
                    Empty {
                        EmptyHeader {
                            EmptyMedia(variant = EmptyMediaVariant.Icon) {
                                Icon(PhosphorIcons.Regular.ChatCircle, contentDescription = null)
                            }
                            EmptyTitle("No messages yet")
                            EmptyDescription("Say hello to start the conversation.")
                        }
                    }
                }
            } else {
                MessageScroller(
                    items = chat.turns,
                    key = { it.id },
                    modifier = Modifier.weight(1f).fillMaxWidth().testTag("thread"),
                    onLoadOlder = {
                        chat.requests += 1
                        chat.loading = true
                    },
                    loadingOlder = chat.loading,
                ) { turn ->
                    TurnRow(turn)
                }
            }
            Composer()
        }
    }
}

@Composable
private fun Scene(scene: ChatScene, chat: ChatThread) {
    when (scene) {
        ChatScene.Bubbles -> Bubbles()
        ChatScene.Messages -> Messages()
        ChatScene.Attachments -> Attachments()
        ChatScene.AttachmentLayouts -> AttachmentLayouts()
        ChatScene.Thread, ChatScene.ThreadScrolledUp, ChatScene.ThreadOlder, ChatScene.Empty -> ThreadScreen(chat)
    }
}

@RunWith(AndroidJUnit4::class)
class ChatGalleryTest {
    @get:Rule
    val compose = createComposeRule()

    @Test
    fun rendersChatInBothSchemes() {
        var dark by mutableStateOf(false)
        var scene by mutableStateOf(ChatScene.Bubbles)
        var chat by mutableStateOf(ChatThread(emptyList()))
        compose.mainClock.autoAdvance = false
        compose.setContent {
            EsuissTheme(darkTheme = dark) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(EsuissTheme.colors.background),
                ) {
                    key(scene, dark) { Scene(scene, chat) }
                }
            }
        }
        val instrumentation = InstrumentationRegistry.getInstrumentation()
        val context = instrumentation.targetContext
        for (current in ChatScene.entries) {
            for (scheme in listOf(false, true)) {
                chat = threadFor(current)
                scene = current
                dark = scheme
                settle()
                when (current) {
                    ChatScene.Bubbles -> compose.onNodeWithText("Thanks, took a while to get right.").assertExists()
                    ChatScene.Messages -> compose.onNodeWithText("Read 10:02 AM").assertExists()
                    ChatScene.Attachments -> compose.onNodeWithContentDescription("Uploading").assertExists()
                    ChatScene.AttachmentLayouts -> compose.onNodeWithText("Try Again").assertExists()
                    ChatScene.Thread -> {
                        compose.onNodeWithContentDescription("Scroll to end", substring = true).assertDoesNotExist()
                        chat.turns.add(Turn(6, true, listOf("On my way to the review.")))
                        settle()
                        compose.onNodeWithText("On my way to the review.").assertIsDisplayed()
                        compose.onNodeWithContentDescription("Scroll to end", substring = true).assertDoesNotExist()
                    }
                    ChatScene.ThreadScrolledUp -> {
                        repeat(2) {
                            compose.onNodeWithTag("thread").performTouchInput {
                                swipeDown(startY = top + 200f, endY = bottom - 200f, durationMillis = 300)
                            }
                            settle()
                        }
                        compose.onNodeWithContentDescription("Scroll to end").assertExists()
                        repeat(3) { chat.turns.add(Turn(200 + it, false, listOf("New message ${it + 1}"))) }
                        settle()
                        compose.onNodeWithContentDescription("Scroll to end, 3 new").assertExists()
                    }
                    ChatScene.ThreadOlder -> {
                        var swipes = 0
                        while (chat.requests == 0 && swipes < 8) {
                            compose.onNodeWithTag("thread").performTouchInput {
                                swipeDown(startY = top + 200f, endY = bottom - 200f, durationMillis = 300)
                            }
                            settle()
                            swipes += 1
                        }
                        assertEquals(1, chat.requests)
                        assertTrue(chat.loading)
                        compose.onNodeWithTag("thread").performTouchInput {
                            swipeDown(startY = top + 200f, endY = bottom - 200f, durationMillis = 300)
                        }
                        settle()
                        val anchor = "${ShortLines[100 % ShortLines.size]} #100"
                        val before = compose.onNodeWithText(anchor).getUnclippedBoundsInRoot().top
                        chat.turns.addAll(0, List(20) { shortTurn(80 + it) })
                        chat.loading = false
                        settle()
                        val after = compose.onNodeWithText(anchor).getUnclippedBoundsInRoot().top
                        assertEquals(before.value, after.value, 1f)
                        assertEquals(1, chat.requests)
                        compose.onNodeWithContentDescription("Scroll to end").assertExists()
                    }
                    ChatScene.Empty -> compose.onNodeWithText("No messages yet").assertExists()
                }
                SystemClock.sleep(600)
                val bitmap = checkNotNull(instrumentation.uiAutomation.takeScreenshot())
                val name = "chat-${current.name.lowercase()}-${if (scheme) "dark" else "light"}.png"
                File(context.getExternalFilesDir(null), name).outputStream().use {
                    bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)
                }
            }
        }
    }

    private fun settle() {
        repeat(4) {
            compose.mainClock.advanceTimeBy(300)
            compose.waitForIdle()
        }
    }
}
