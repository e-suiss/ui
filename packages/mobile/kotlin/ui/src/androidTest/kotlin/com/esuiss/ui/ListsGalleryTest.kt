package com.esuiss.ui

import android.graphics.Bitmap
import android.os.SystemClock
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.test.hasTestTag
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.assertCountEquals
import androidx.compose.ui.test.longClick
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTouchInput
import androidx.compose.ui.unit.dp
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Archive
import com.adamglin.phosphoricons.regular.ArrowUp
import com.adamglin.phosphoricons.regular.Copy
import com.adamglin.phosphoricons.regular.Envelope
import com.adamglin.phosphoricons.regular.Flag
import com.adamglin.phosphoricons.regular.Folder
import com.adamglin.phosphoricons.regular.Globe
import com.adamglin.phosphoricons.regular.Info
import com.adamglin.phosphoricons.regular.Link
import com.adamglin.phosphoricons.regular.MagnifyingGlass
import com.adamglin.phosphoricons.regular.Plus
import com.adamglin.phosphoricons.regular.PushPin
import com.adamglin.phosphoricons.regular.ShareNetwork
import com.adamglin.phosphoricons.regular.Star
import com.adamglin.phosphoricons.regular.Trash
import com.adamglin.phosphoricons.regular.Tray
import com.adamglin.phosphoricons.regular.User
import com.esuiss.ui.components.AlertSheet
import com.esuiss.ui.components.AlertSheetAction
import com.esuiss.ui.components.AlertSheetActionVariant
import com.esuiss.ui.components.AlertSheetCancel
import com.esuiss.ui.components.AlertSheetDescription
import com.esuiss.ui.components.AlertSheetGroup
import com.esuiss.ui.components.AlertSheetHeader
import com.esuiss.ui.components.AlertSheetTitle
import com.esuiss.ui.components.Avatar
import com.esuiss.ui.components.AvatarFallback
import com.esuiss.ui.components.Badge
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Empty
import com.esuiss.ui.components.EmptyContent
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
import com.esuiss.ui.components.InputGroupText
import com.esuiss.ui.components.InputGroupTextarea
import com.esuiss.ui.components.Item
import com.esuiss.ui.components.ItemActions
import com.esuiss.ui.components.ItemContent
import com.esuiss.ui.components.ItemDescription
import com.esuiss.ui.components.ItemFooter
import com.esuiss.ui.components.ItemGroup
import com.esuiss.ui.components.ItemGroupVariant
import com.esuiss.ui.components.ItemHeader
import com.esuiss.ui.components.ItemMedia
import com.esuiss.ui.components.ItemMediaVariant
import com.esuiss.ui.components.ItemSeparator
import com.esuiss.ui.components.ItemSize
import com.esuiss.ui.components.ItemTitle
import com.esuiss.ui.components.ItemVariant
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.components.Marker
import com.esuiss.ui.components.MarkerContent
import com.esuiss.ui.components.MarkerIcon
import com.esuiss.ui.components.MarkerVariant
import com.esuiss.ui.components.MenuItemVariant
import com.esuiss.ui.components.Spinner
import com.esuiss.ui.interactions.PullToRefresh
import com.esuiss.ui.interactions.SwipeAction
import com.esuiss.ui.interactions.SwipeActionVariant
import com.esuiss.ui.interactions.SwipeActions
import com.esuiss.ui.interactions.SwipeActionsSide
import com.esuiss.ui.interactions.rememberSwipeActionsState
import com.esuiss.ui.patterns.Confirm
import com.esuiss.ui.patterns.ConfirmAction
import com.esuiss.ui.patterns.ConfirmCancel
import com.esuiss.ui.patterns.ConfirmDescription
import com.esuiss.ui.patterns.ConfirmFooter
import com.esuiss.ui.patterns.ConfirmHeader
import com.esuiss.ui.patterns.ConfirmTitle
import com.esuiss.ui.patterns.ContextActions
import com.esuiss.ui.patterns.ContextActionsContent
import com.esuiss.ui.patterns.ContextActionsItem
import com.esuiss.ui.patterns.ContextActionsLabel
import com.esuiss.ui.patterns.ContextActionsTrigger
import com.esuiss.ui.patterns.Picker
import com.esuiss.ui.patterns.PickerItemData
import com.esuiss.ui.patterns.TableList
import com.esuiss.ui.patterns.TableListColumn
import com.esuiss.ui.patterns.TableListSlot
import com.esuiss.ui.patterns.tableList
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography
import java.io.File
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

private enum class ListScene {
    Items,
    ItemsInset,
    Feedback,
    InputGroup,
    TableList,
    TableListLazy,
    SwipeActions,
    PullRefreshing,
    Pulling,
    AlertSheet,
    Confirm,
    ContextActions,
    Picker,
}

private const val Overlay = "overlay"

private const val Target = "target"

private class Invoice(val number: String, val customer: String, val status: String, val amount: String)

private val Invoices = listOf(
    Invoice("INV001", "Olivia Martin", "Paid", "$250.00"),
    Invoice("INV002", "Jackson Lee", "Pending", "$150.00"),
    Invoice("INV003", "Isabella Nguyen", "Unpaid", "$350.00"),
    Invoice("INV004", "William Kim", "Paid", "$450.00"),
)

private val InvoiceColumns = listOf(
    TableListColumn<Invoice>("customer", "Customer", TableListSlot.Title) { Cell(it.customer) },
    TableListColumn<Invoice>("number", "Invoice", TableListSlot.Description) { Cell(it.number) },
    TableListColumn<Invoice>("status", "Status", TableListSlot.Description) { Cell(it.status) },
    TableListColumn<Invoice>("amount", "Amount", TableListSlot.Trailing) { Cell(it.amount) },
)

@Composable
private fun Cell(text: String) {
    BasicText(text, style = LocalContentStyle.current, maxLines = 1)
}

@Composable
private fun Items() {
    Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
        ItemGroup {
            Item(variant = ItemVariant.Outline) {
                ItemContent {
                    ItemTitle("Basic Item")
                    ItemDescription("A simple item with title and description.")
                }
                ItemActions { Button("Action", onClick = {}, variant = ButtonVariant.Outline, size = ButtonSize.Sm) }
            }
            Item(variant = ItemVariant.Muted, size = ItemSize.Sm, onClick = {}) {
                ItemMedia(variant = ItemMediaVariant.Icon) { Icon(PhosphorIcons.Regular.Star, contentDescription = null) }
                ItemContent { ItemTitle("Your profile has been verified.") }
                ItemActions { Icon(PhosphorIcons.Regular.Info, contentDescription = null, size = 16.dp) }
            }
            Item(variant = ItemVariant.Outline) {
                ItemMedia(variant = ItemMediaVariant.Image) { Avatar(fallback = { AvatarFallback("ER") }) }
                ItemContent {
                    ItemTitle {
                        BasicText("Evil Rabbit", style = LocalContentStyle.current)
                        Badge("New")
                    }
                    ItemDescription("Last seen 5 months ago and still building components for every platform.")
                }
                ItemActions { Button(onClick = {}, variant = ButtonVariant.Secondary, size = ButtonSize.IconSm) { Icon(PhosphorIcons.Regular.Plus, contentDescription = "Invite") } }
            }
            Item(variant = ItemVariant.Outline, size = ItemSize.Xs) {
                ItemHeader {
                    BasicText("Header", style = Typography.xs.copy(color = EsuissTheme.colors.mutedForeground))
                    BasicText("Today", style = Typography.xs.copy(color = EsuissTheme.colors.mutedForeground))
                }
                ItemMedia(variant = ItemMediaVariant.Icon) { Icon(PhosphorIcons.Regular.Folder, contentDescription = null) }
                ItemContent { ItemTitle("Extra small item") }
                ItemFooter {
                    BasicText("Footer", style = Typography.xs.copy(color = EsuissTheme.colors.mutedForeground))
                }
            }
        }
    }
}

@Composable
private fun ItemsInset() {
    Column(verticalArrangement = Arrangement.spacedBy(24.dp)) {
        ItemGroup(variant = ItemGroupVariant.Inset) {
            listOf(
                Triple(PhosphorIcons.Regular.User, "Profile", "Name, photo, and email"),
                Triple(PhosphorIcons.Regular.Envelope, "Notifications", "Mentions and replies"),
                Triple(PhosphorIcons.Regular.Globe, "Language", "English"),
            ).forEachIndexed { index, (icon, title, description) ->
                if (index > 0) ItemSeparator()
                Item(onClick = {}) {
                    ItemMedia(variant = ItemMediaVariant.Icon) { Icon(icon, contentDescription = null) }
                    ItemContent {
                        ItemTitle(title)
                        ItemDescription(description)
                    }
                }
            }
        }
        ItemGroup(variant = ItemGroupVariant.Inset) {
            Item(size = ItemSize.Sm, selected = true, onClick = {}) {
                ItemContent { ItemTitle("Selected row") }
            }
            ItemSeparator()
            Item(size = ItemSize.Sm, enabled = false, onClick = {}) {
                ItemContent { ItemTitle("Disabled row") }
            }
        }
    }
}

@Composable
private fun Feedback() {
    val colors = EsuissTheme.colors
    Column(verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(20.dp), verticalAlignment = Alignment.CenterVertically) {
            Spinner()
            Spinner(size = 24.dp)
            Spinner(size = 32.dp, color = colors.primary)
            Button(onClick = {}, enabled = false) {
                Spinner(color = colors.primaryForeground)
                BasicText("Loading", style = LocalContentStyle.current)
            }
        }
        Marker("Today")
        Marker(variant = MarkerVariant.Separator) { MarkerContent("Yesterday") }
        Marker(variant = MarkerVariant.Border) {
            MarkerIcon { Icon(PhosphorIcons.Regular.Flag, contentDescription = null) }
            MarkerContent("Pinned messages")
        }
        Marker("Edited 2 minutes ago", icon = PhosphorIcons.Regular.Info)
        Empty(modifier = Modifier.background(colors.muted, androidx.compose.foundation.shape.RoundedCornerShape(18.dp))) {
            EmptyHeader {
                EmptyMedia(variant = EmptyMediaVariant.Icon) { Icon(PhosphorIcons.Regular.Tray, contentDescription = null) }
                EmptyTitle("No messages yet")
                EmptyDescription("You're all caught up. New messages will appear here.")
            }
            EmptyContent {
                Button("Compose", onClick = {})
            }
        }
    }
}

@Composable
private fun InputGroups() {
    var search by remember { mutableStateOf("") }
    var site by remember { mutableStateOf("example") }
    var message by remember { mutableStateOf("") }
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        InputGroup {
            InputGroupAddon { Icon(PhosphorIcons.Regular.MagnifyingGlass, contentDescription = null) }
            InputGroupInput(search, { search = it }, placeholder = "Search...")
            InputGroupAddon(align = InputGroupAddonAlign.InlineEnd) { InputGroupText("12 results") }
        }
        InputGroup {
            InputGroupAddon { InputGroupText("https://") }
            InputGroupInput(site, { site = it })
            InputGroupAddon(align = InputGroupAddonAlign.InlineEnd) { InputGroupText(".com") }
        }
        InputGroup {
            InputGroupInput("https://example.com/r/1a2b", {}, readOnly = true)
            InputGroupAddon(align = InputGroupAddonAlign.InlineEnd) {
                InputGroupButton(onClick = {}, size = InputGroupButtonSize.IconXs) {
                    Icon(PhosphorIcons.Regular.Copy, contentDescription = "Copy")
                }
            }
        }
        InputGroup {
            InputGroupTextarea(message, { message = it }, placeholder = "Ask, search or chat...")
            InputGroupAddon(align = InputGroupAddonAlign.BlockEnd) {
                InputGroupButton(onClick = {}, size = InputGroupButtonSize.IconXs, variant = ButtonVariant.Outline) {
                    Icon(PhosphorIcons.Regular.Plus, contentDescription = "Add")
                }
                InputGroupText("52% used")
                Box(modifier = Modifier.weight(1f))
                InputGroupButton(onClick = {}, size = InputGroupButtonSize.IconXs, variant = ButtonVariant.Default) {
                    Icon(PhosphorIcons.Regular.ArrowUp, contentDescription = "Send")
                }
            }
        }
        InputGroup(invalid = true) {
            InputGroupAddon { Icon(PhosphorIcons.Regular.Envelope, contentDescription = null) }
            InputGroupInput("not-an-email", {})
        }
        InputGroup(enabled = false) {
            InputGroupAddon { Icon(PhosphorIcons.Regular.Link, contentDescription = null) }
            InputGroupInput("", {}, placeholder = "Disabled")
            InputGroupAddon(align = InputGroupAddonAlign.InlineEnd) { InputGroupButton("Paste", onClick = {}) }
        }
    }
}

@Composable
private fun SwipeRows() {
    val colors = EsuissTheme.colors
    val first = rememberSwipeActionsState()
    val second = rememberSwipeActionsState()
    LaunchedEffect(Unit) {
        second.open(SwipeActionsSide.Leading)
        first.open(SwipeActionsSide.Trailing)
    }
    val trailing = listOf(
        SwipeAction("More", {}, icon = PhosphorIcons.Regular.ShareNetwork, variant = SwipeActionVariant.Neutral),
        SwipeAction("Archive", {}, icon = PhosphorIcons.Regular.Archive, variant = SwipeActionVariant.Archive),
        SwipeAction("Delete", {}, icon = PhosphorIcons.Regular.Trash, variant = SwipeActionVariant.Destructive, fullSwipe = true),
    )
    val leading = listOf(
        SwipeAction("Pin", {}, icon = PhosphorIcons.Regular.PushPin),
    )
    Column(verticalArrangement = Arrangement.spacedBy(0.dp)) {
        listOf(first to "Trailing open", second to "Opened then closed", rememberSwipeActionsState() to "Closed row").forEach { (state, title) ->
            SwipeActions(leading = leading, trailing = trailing, state = state) {
                Item(onClick = {}) {
                    ItemMedia(variant = ItemMediaVariant.Icon) { Icon(PhosphorIcons.Regular.Envelope, contentDescription = null) }
                    ItemContent {
                        ItemTitle(title)
                        ItemDescription("Swipe to reveal actions")
                    }
                }
            }
            Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(colors.border))
        }
    }
}

@Composable
private fun RefreshList(refreshing: Boolean?) {
    val rows = (1..12).map { "Message $it" }
    val content: @Composable () -> Unit = {
        LazyColumn(modifier = Modifier.fillMaxSize().testTag(Target)) {
            items(rows) { row ->
                Item(onClick = {}) {
                    ItemContent {
                        ItemTitle(row)
                        ItemDescription("Pull down to refresh")
                    }
                }
            }
        }
    }
    if (refreshing != null) {
        PullToRefresh(refreshing = refreshing, onRefresh = {}, content = content)
    } else {
        PullToRefresh(onRefresh = { kotlinx.coroutines.delay(1000) }, content = content)
    }
}

@Composable
private fun Scene(scene: ListScene) {
    val colors = EsuissTheme.colors
    when (scene) {
        ListScene.Items -> Items()
        ListScene.ItemsInset -> ItemsInset()
        ListScene.Feedback -> Feedback()
        ListScene.InputGroup -> InputGroups()
        ListScene.TableList -> TableList(
            rows = Invoices,
            columns = InvoiceColumns,
            title = "Invoices",
            getKey = { row, _ -> row.number },
            onRowClick = {},
        )
        ListScene.TableListLazy -> LazyColumn(modifier = Modifier.fillMaxSize()) {
            tableList {
                title("Settings")
                section(header = "Account", footer = "Your account is managed by your organization.") {
                    row("Name", trailing = "Evil Rabbit", key = "name", onClick = {})
                    row("Email", description = "Used for sign in", trailing = "rabbit@example.com", key = "email", onClick = {})
                }
                section(header = "Storage") {
                    items(Invoices, key = { it.number }, onClick = {}) { invoice ->
                        ItemMedia(variant = ItemMediaVariant.Icon) { Icon(PhosphorIcons.Regular.Folder, contentDescription = null) }
                        ItemContent {
                            BasicText(invoice.customer, style = LocalContentStyle.current)
                        }
                        BasicText(invoice.amount, style = Typography.base.copy(color = colors.mutedForeground))
                    }
                }
                section(header = "Empty", emptyText = "No results.") {}
            }
        }
        ListScene.SwipeActions -> SwipeRows()
        ListScene.PullRefreshing -> RefreshList(refreshing = true)
        ListScene.Pulling -> RefreshList(refreshing = null)
        ListScene.AlertSheet -> AlertSheet(open = true, onOpenChange = {}, modifier = Modifier.testTag(Overlay)) {
            AlertSheetGroup {
                AlertSheetHeader {
                    AlertSheetTitle("Delete this draft?")
                    AlertSheetDescription("You can't undo this action.")
                }
                AlertSheetAction("Save draft", onClick = {})
                AlertSheetAction("Share", onClick = {}, icon = PhosphorIcons.Regular.ShareNetwork)
                AlertSheetAction("Delete draft", onClick = {}, variant = AlertSheetActionVariant.Destructive)
                AlertSheetAction("Unavailable", onClick = {}, enabled = false)
            }
            AlertSheetCancel()
        }
        ListScene.Confirm -> Confirm(open = true, onOpenChange = {}, modifier = Modifier.testTag(Overlay)) {
            ConfirmHeader {
                ConfirmTitle("Are you absolutely sure?")
                ConfirmDescription("This will permanently delete your account and remove your data from our servers.")
            }
            ConfirmFooter {
                ConfirmCancel()
                ConfirmAction("Delete account", onClick = {}, variant = AlertSheetActionVariant.Destructive)
            }
        }
        ListScene.ContextActions -> ContextActions {
            ContextActionsTrigger(modifier = Modifier.testTag(Target)) {
                Item(variant = ItemVariant.Outline) {
                    ItemContent {
                        ItemTitle("Long press this message")
                        ItemDescription("Opens the context actions")
                    }
                }
            }
            ContextActionsContent(modifier = Modifier.testTag(Overlay)) {
                ContextActionsLabel("Message")
                ContextActionsItem("Reply", onClick = {})
                ContextActionsItem("Copy", onClick = {})
                ContextActionsItem("Delete", onClick = {}, variant = MenuItemVariant.Destructive)
            }
        }
        ListScene.Picker -> {
            var value by remember { mutableStateOf<String?>("system") }
            Picker(
                value = value,
                onValueChange = { value = it },
                items = listOf(
                    PickerItemData("light", "Light"),
                    PickerItemData("dark", "Dark"),
                    PickerItemData("system", "System"),
                    PickerItemData("custom", "Custom", enabled = false),
                ),
                placeholder = "Theme",
            )
        }
    }
}

@RunWith(AndroidJUnit4::class)
class ListsGalleryTest {
    @get:Rule
    val compose = createComposeRule()

    @Test
    fun rendersListsInBothSchemes() {
        var dark by mutableStateOf(false)
        var scene by mutableStateOf(ListScene.Items)
        compose.mainClock.autoAdvance = false
        compose.setContent {
            EsuissTheme(darkTheme = dark) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(EsuissTheme.colors.background)
                        .safeDrawingPadding()
                        .padding(16.dp),
                ) {
                    key(scene, dark) { Scene(scene) }
                }
            }
        }
        val instrumentation = InstrumentationRegistry.getInstrumentation()
        val context = instrumentation.targetContext
        for (current in ListScene.entries) {
            for (scheme in listOf(false, true)) {
                scene = current
                dark = scheme
                settle()
                when (current) {
                    ListScene.Picker -> compose.onNodeWithText("System").performClick()
                    ListScene.ContextActions -> compose.onNodeWithTag(Target).performTouchInput { longClick() }
                    ListScene.Pulling -> compose.onNodeWithTag(Target).performTouchInput {
                        down(Offset(centerX, 40f))
                        repeat(12) { moveBy(Offset(0f, 40f)) }
                    }
                    else -> Unit
                }
                settle()
                when (current) {
                    ListScene.Picker -> compose.onNodeWithText("Dark").assertExists()
                    ListScene.AlertSheet, ListScene.Confirm, ListScene.ContextActions,
                    -> compose.onNode(hasTestTag(Overlay), useUnmergedTree = true).assertExists()
                    ListScene.SwipeActions -> compose.onAllNodesWithText("Delete").assertCountEquals(1)
                    else -> Unit
                }
                SystemClock.sleep(600)
                val bitmap = checkNotNull(instrumentation.uiAutomation.takeScreenshot())
                val name = "lists-${current.name.lowercase()}-${if (scheme) "dark" else "light"}.png"
                File(context.getExternalFilesDir(null), name).outputStream().use {
                    bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)
                }
                if (current == ListScene.Pulling) {
                    compose.onNodeWithTag(Target).performTouchInput { up() }
                    settle()
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
