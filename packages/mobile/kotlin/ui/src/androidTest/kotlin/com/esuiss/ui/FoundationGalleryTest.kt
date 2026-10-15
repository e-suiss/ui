package com.esuiss.ui

import android.graphics.Bitmap
import android.os.SystemClock
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTouchInput
import androidx.compose.ui.test.swipeUp
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Bell
import com.adamglin.phosphoricons.regular.Camera
import com.adamglin.phosphoricons.regular.DotsThree
import com.adamglin.phosphoricons.regular.FolderSimple
import com.adamglin.phosphoricons.regular.Funnel
import com.adamglin.phosphoricons.regular.MagnifyingGlass
import com.adamglin.phosphoricons.regular.NotePencil
import com.adamglin.phosphoricons.regular.Plus
import com.adamglin.phosphoricons.regular.Star
import com.adamglin.phosphoricons.regular.Tag
import com.adamglin.phosphoricons.regular.WifiHigh
import com.esuiss.ui.components.BottomBar
import com.esuiss.ui.components.BottomBarContent
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Chip
import com.esuiss.ui.components.ChipGroup
import com.esuiss.ui.components.ChipSize
import com.esuiss.ui.components.Fab
import com.esuiss.ui.components.FabAction
import com.esuiss.ui.components.FabSize
import com.esuiss.ui.components.Field
import com.esuiss.ui.components.FieldLabel
import com.esuiss.ui.components.Header
import com.esuiss.ui.components.HeaderActions
import com.esuiss.ui.components.HeaderActionsSide
import com.esuiss.ui.components.HeaderBack
import com.esuiss.ui.components.HeaderLargeTitle
import com.esuiss.ui.components.HeaderTitle
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Input
import com.esuiss.ui.components.InputAccessoryBar
import com.esuiss.ui.components.Item
import com.esuiss.ui.components.ItemContent
import com.esuiss.ui.components.ItemDescription
import com.esuiss.ui.components.ItemGroup
import com.esuiss.ui.components.ItemGroupVariant
import com.esuiss.ui.components.ItemSeparator
import com.esuiss.ui.components.ItemTitle
import com.esuiss.ui.components.KeyboardScrollView
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.ScreenVariant
import com.esuiss.ui.components.ScreenContent
import com.esuiss.ui.components.inputAccessory
import com.esuiss.ui.components.rememberHeaderState
import com.esuiss.ui.components.rememberInputAccessoryState
import com.esuiss.ui.interactions.ReorderList
import com.esuiss.ui.interactions.ReorderListHandle
import com.esuiss.ui.interactions.ReorderListItem
import com.esuiss.ui.interactions.TopBannerAction
import com.esuiss.ui.interactions.TopBannerProvider
import com.esuiss.ui.interactions.rememberTopBannerState
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import java.io.File
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

private enum class FoundationScene {
    Screen,
    HeaderCollapsed,
    HeaderCompact,
    BottomBar,
    Chips,
    ChipsTapped,
    ReorderList,
    ReorderListDragged,
    Fab,
    FabExtended,
    FabOpen,
    TopBanner,
    KeyboardForm,
}

private val Mailboxes = listOf(
    "Inbox" to "12 unread",
    "Drafts" to "3 drafts",
    "Sent" to "Last sent yesterday",
    "Archive" to "1,204 messages",
    "Junk" to "Empty",
    "Trash" to "8 messages",
    "Receipts" to "Shared folder",
    "Travel" to "Bookings and tickets",
    "Newsletters" to "42 unread",
    "Family" to "Photos and plans",
    "Work" to "Projects and reviews",
    "Taxes" to "Documents for 2026",
)

@Composable
private fun Caption(text: String, modifier: Modifier = Modifier) {
    BasicText(text, modifier = modifier, style = Typography.sm.copy(color = EsuissTheme.colors.mutedForeground))
}

@Composable
private fun SectionTitle(text: String) {
    BasicText(text, style = Typography.sm.copy(color = EsuissTheme.colors.mutedForeground, fontWeight = FontWeight.Medium))
}

@Composable
private fun MailboxList(modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
    ) {
        ItemGroup(variant = ItemGroupVariant.Inset) {
            Mailboxes.forEachIndexed { index, (title, description) ->
                if (index > 0) ItemSeparator()
                Item(onClick = {}) {
                    ItemContent {
                        ItemTitle(title)
                        ItemDescription(description)
                    }
                }
            }
        }
    }
}

@Composable
private fun MailScreen(compact: Boolean) {
    val header = rememberHeaderState()
    Screen(variant = ScreenVariant.Secondary) {
        Column(modifier = Modifier.fillMaxSize().nestedScroll(header.nestedScrollConnection)) {
            Header(state = header) {
                HeaderBack(onClick = {}, text = "Accounts")
                HeaderTitle("Mailboxes")
                HeaderLargeTitle("Mailboxes", subtitle = if (compact) null else "Updated just now")
                HeaderActions {
                    Button(onClick = {}, variant = ButtonVariant.Plain, size = ButtonSize.Icon) {
                        Icon(PhosphorIcons.Regular.NotePencil, contentDescription = "Compose", size = 22.dp)
                    }
                }
            }
            MailboxList(Modifier.weight(1f).testTag("content"))
        }
    }
}

@Composable
private fun CompactHeaders() {
    Screen {
        Column(modifier = Modifier.fillMaxSize()) {
            Header {
                HeaderBack(onClick = {}, text = null, contentDescription = "Back")
                HeaderTitle("Trip to Lisbon", subtitle = "4 people · 12 photos")
                HeaderActions {
                    Button(onClick = {}, variant = ButtonVariant.Plain, size = ButtonSize.Icon) {
                        Icon(PhosphorIcons.Regular.Star, contentDescription = "Favorite", size = 22.dp)
                    }
                    Button(onClick = {}, variant = ButtonVariant.Plain, size = ButtonSize.Icon) {
                        Icon(PhosphorIcons.Regular.DotsThree, contentDescription = "More", size = 22.dp)
                    }
                }
            }
            Spacer(Modifier.height(24.dp))
            Header {
                HeaderActions(side = HeaderActionsSide.Leading) {
                    Button("Cancel", {}, variant = ButtonVariant.Plain)
                }
                HeaderTitle("New event")
                HeaderActions {
                    Button("Add", {}, variant = ButtonVariant.Plain)
                }
            }
            Spacer(Modifier.height(24.dp))
            Header {
                HeaderBack(onClick = {}, text = "Settings")
                HeaderTitle("A very long title that needs to be truncated")
            }
            Spacer(Modifier.height(24.dp))
            Header {
                HeaderLargeTitle("Library", subtitle = "128 books")
                HeaderActions {
                    Button(onClick = {}, variant = ButtonVariant.Plain, size = ButtonSize.Icon) {
                        Icon(PhosphorIcons.Regular.MagnifyingGlass, contentDescription = "Search", size = 22.dp)
                    }
                }
            }
        }
    }
}

@Composable
private fun CheckoutScreen() {
    Screen {
        Column(modifier = Modifier.fillMaxSize()) {
            Header {
                HeaderBack(onClick = {}, text = "Cart")
                HeaderTitle("Checkout")
            }
            ScreenContent(modifier = Modifier.weight(1f), scrollable = true) {
                ItemGroup(variant = ItemGroupVariant.Inset) {
                    Item {
                        ItemContent {
                            ItemTitle("Shipping")
                            ItemDescription("Standard · arrives Thursday")
                        }
                    }
                    ItemSeparator()
                    Item {
                        ItemContent {
                            ItemTitle("Payment")
                            ItemDescription("Card ending in 4242")
                        }
                    }
                }
                Caption("Your order is protected by our return policy for 30 days.")
            }
            BottomBar(separator = true) {
                BottomBarContent {
                    Button("Place order", {}, size = ButtonSize.Lg, block = true)
                    Button("Save for later", {}, variant = ButtonVariant.Plain)
                }
            }
        }
    }
}

@Composable
private fun ChipsPage() {
    var category by remember { mutableStateOf<String?>("all") }
    var filters by remember { mutableStateOf(setOf("wifi")) }
    var tags by remember { mutableStateOf(listOf("Design", "Mobile", "Research", "Ideas")) }
    var favorite by remember { mutableStateOf(true) }
    Screen {
        ScreenContent(scrollable = true) {
            SectionTitle("Single selection, scrollable")
            ChipGroup(value = category, onValueChange = { category = it }, scrollable = true) {
                Chip("All", "all")
                Chip("Restaurants", "restaurants")
                Chip("Coffee", "coffee")
                Chip("Parks", "parks")
                Chip("Museums", "museums")
                Chip("Shopping", "shopping")
            }
            SectionTitle("Multiple selection")
            ChipGroup(values = filters, onValuesChange = { filters = it }) {
                Chip("Free Wi-Fi", "wifi", icon = PhosphorIcons.Regular.WifiHigh)
                Chip("Open now", "open")
                Chip("Outdoor seating", "outdoor")
                Chip("Pet friendly", "pets")
                Chip("Quiet", "quiet")
            }
            Caption("${filters.size} selected", Modifier.testTag("filters"))
            SectionTitle("Small, removable")
            ChipGroup(values = emptySet(), onValuesChange = {}, size = ChipSize.Sm) {
                tags.forEach { tag ->
                    Chip(tag, tag, icon = PhosphorIcons.Regular.Tag, onRemove = { tags = tags - tag })
                }
            }
            SectionTitle("Standalone and disabled")
            ChipGroup(values = emptySet(), onValuesChange = {}) {
                Chip("Favorite", favorite, { favorite = it }, icon = PhosphorIcons.Regular.Star)
                Chip("Filter", false, {}, icon = PhosphorIcons.Regular.Funnel)
                Chip("Disabled", false, {}, enabled = false)
                Chip("Selected off", true, {}, enabled = false)
            }
        }
    }
}

private val Groceries = listOf("Milk", "Bread", "Eggs", "Coffee", "Apples", "Rice")

@Composable
private fun GroceryReorder() {
    var order by remember { mutableStateOf(Groceries) }
    Screen {
        ScreenContent {
            SectionTitle("Shopping list")
            val shape = RoundedCornerShape(Radius.xl2)
            ReorderList(
                value = order,
                onValueChange = { order = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(shape)
                    .border(1.dp, EsuissTheme.colors.border, shape),
            ) { item ->
                ReorderListItem {
                    BasicText(item, modifier = Modifier.weight(1f), style = Typography.base.copy(color = EsuissTheme.colors.foreground))
                    ReorderListHandle(contentDescription = "Reorder $item")
                }
            }
            Caption("Order: ${order.joinToString(", ")}", Modifier.testTag("order"))
        }
    }
}

@Composable
private fun FabPage(extended: Boolean, dial: Boolean) {
    var open by remember { mutableStateOf(false) }
    Screen(variant = ScreenVariant.Secondary) {
        Column(modifier = Modifier.fillMaxSize()) {
            Header {
                HeaderLargeTitle("Notes")
            }
            MailboxList(Modifier.weight(1f))
        }
        when {
            dial -> Fab(
                icon = PhosphorIcons.Regular.Plus,
                contentDescription = "Create",
                open = open,
                onOpenChange = { open = it },
            ) {
                FabAction(PhosphorIcons.Regular.NotePencil, "New note", {})
                FabAction(PhosphorIcons.Regular.FolderSimple, "New folder", {})
                FabAction(PhosphorIcons.Regular.Camera, "Scan document", {})
            }
            extended -> Fab(
                icon = PhosphorIcons.Regular.NotePencil,
                contentDescription = "New note",
                onClick = {},
                label = "New note",
                size = FabSize.Lg,
            )
            else -> Fab(icon = PhosphorIcons.Regular.Plus, contentDescription = "Create", onClick = {})
        }
    }
}

@Composable
private fun BannerPage() {
    val banners = rememberTopBannerState(defaultTimeoutMillis = 60_000)
    var log by remember { mutableStateOf("No banner yet.") }
    TopBannerProvider(banners) {
        Screen {
            Column(modifier = Modifier.fillMaxSize()) {
                Header { HeaderLargeTitle("Inbox") }
                ScreenContent {
                    Button(
                        "Show banner",
                        {
                            banners.show(
                                title = "Back online",
                                description = "Your messages are syncing again.",
                                icon = PhosphorIcons.Regular.Bell,
                                action = TopBannerAction("View") { log = "Opened from banner" },
                            )
                        },
                    )
                    Caption(log)
                }
            }
        }
    }
}

@Composable
private fun KeyboardForm() {
    val accessory = rememberInputAccessoryState()
    var values by remember { mutableStateOf(List(6) { "" }) }
    val labels = listOf("First name", "Last name", "Email", "Phone", "Street", "City")
    Screen {
        Column(modifier = Modifier.fillMaxSize()) {
            Header {
                HeaderBack(onClick = {}, text = "Back")
                HeaderTitle("Shipping address")
            }
            KeyboardScrollView(
                modifier = Modifier.weight(1f),
                contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
            ) {
                labels.forEachIndexed { index, label ->
                    Field {
                        FieldLabel(label)
                        Input(
                            value = values[index],
                            onValueChange = { next -> values = values.toMutableList().also { it[index] = next } },
                            modifier = Modifier.inputAccessory(accessory, index).testTag("field$index"),
                            placeholder = label,
                        )
                    }
                }
            }
            BottomBar(separator = true) {
                BottomBarContent {
                    Button("Continue", {}, size = ButtonSize.Lg, block = true)
                }
            }
        }
        InputAccessoryBar(accessory)
    }
}

@Composable
private fun Scene(scene: FoundationScene) {
    when (scene) {
        FoundationScene.Screen -> MailScreen(compact = false)
        FoundationScene.HeaderCollapsed -> MailScreen(compact = true)
        FoundationScene.HeaderCompact -> CompactHeaders()
        FoundationScene.BottomBar -> CheckoutScreen()
        FoundationScene.Chips, FoundationScene.ChipsTapped -> ChipsPage()
        FoundationScene.ReorderList, FoundationScene.ReorderListDragged -> GroceryReorder()
        FoundationScene.Fab -> FabPage(extended = false, dial = false)
        FoundationScene.FabExtended -> FabPage(extended = true, dial = false)
        FoundationScene.FabOpen -> FabPage(extended = false, dial = true)
        FoundationScene.TopBanner -> BannerPage()
        FoundationScene.KeyboardForm -> KeyboardForm()
    }
}

@RunWith(AndroidJUnit4::class)
class FoundationGalleryTest {
    @get:Rule
    val compose = createComposeRule()

    @Test
    fun rendersFoundationInBothSchemes() {
        var dark by mutableStateOf(false)
        var scene by mutableStateOf(FoundationScene.Screen)
        compose.mainClock.autoAdvance = false
        compose.setContent {
            EsuissTheme(darkTheme = dark) {
                key(scene, dark) { Scene(scene) }
            }
        }
        val instrumentation = InstrumentationRegistry.getInstrumentation()
        val context = instrumentation.targetContext
        for (current in FoundationScene.entries) {
            for (scheme in listOf(false, true)) {
                scene = current
                dark = scheme
                settle()
                when (current) {
                    FoundationScene.HeaderCollapsed -> compose.onNodeWithTag("content").performTouchInput {
                        swipeUp(startY = bottom - 80f, endY = bottom - 480f, durationMillis = 500)
                    }
                    FoundationScene.ChipsTapped -> {
                        compose.onNodeWithText("Coffee").performClick()
                        compose.onNodeWithText("Open now").performClick()
                        compose.onNodeWithText("Quiet").performClick()
                        compose.onNodeWithText("Free Wi-Fi").performClick()
                        compose.onNodeWithContentDescription("Remove Research").performClick()
                    }
                    FoundationScene.ReorderListDragged -> compose.onNodeWithContentDescription("Reorder Milk").performTouchInput {
                        down(center)
                        repeat(10) {
                            advanceEventTime(16)
                            moveBy(androidx.compose.ui.geometry.Offset(0f, 30f))
                        }
                    }
                    FoundationScene.FabOpen -> compose.onNodeWithContentDescription("Create").performClick()
                    FoundationScene.TopBanner -> compose.onNodeWithText("Show banner").performClick()
                    FoundationScene.KeyboardForm -> compose.onNodeWithTag("field4").performClick()
                    else -> Unit
                }
                settle()
                if (current == FoundationScene.KeyboardForm) {
                    SystemClock.sleep(1500)
                    settle()
                }
                when (current) {
                    FoundationScene.ChipsTapped -> compose.onNodeWithText("2 selected").assertExists()
                    FoundationScene.ReorderListDragged -> compose.onNodeWithText("Order: Bread, Eggs, Milk, Coffee, Apples, Rice").assertExists()
                    FoundationScene.FabOpen -> compose.onNodeWithContentDescription("Scan document").assertExists()
                    FoundationScene.TopBanner -> compose.onNodeWithText("Back online").assertExists()
                    else -> Unit
                }
                SystemClock.sleep(600)
                val bitmap = checkNotNull(instrumentation.uiAutomation.takeScreenshot())
                val name = "foundation-${current.name.lowercase()}-${if (scheme) "dark" else "light"}.png"
                File(context.getExternalFilesDir(null), name).outputStream().use {
                    bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)
                }
                if (current == FoundationScene.ReorderListDragged) {
                    compose.onNodeWithContentDescription("Reorder Milk").performTouchInput { up() }
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
