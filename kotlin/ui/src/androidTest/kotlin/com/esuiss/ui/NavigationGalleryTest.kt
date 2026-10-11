package com.esuiss.ui

import android.graphics.Bitmap
import android.os.SystemClock
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.SemanticsProperties
import androidx.compose.ui.test.SemanticsMatcher
import androidx.compose.ui.test.assert
import androidx.compose.ui.test.assertIsSelected
import androidx.compose.ui.test.doubleClick
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.longClick
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTouchInput
import androidx.compose.ui.test.pinch
import androidx.compose.ui.test.swipeDown
import androidx.compose.ui.test.swipeLeft
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Density
import androidx.compose.ui.unit.dp
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.fill.ChatCircle
import com.adamglin.phosphoricons.fill.Gear
import com.adamglin.phosphoricons.fill.House
import com.adamglin.phosphoricons.fill.MagnifyingGlass
import com.adamglin.phosphoricons.fill.User
import com.adamglin.phosphoricons.regular.CalendarBlank
import com.adamglin.phosphoricons.regular.ChatCircle
import com.adamglin.phosphoricons.regular.Copy
import com.adamglin.phosphoricons.regular.Gear
import com.adamglin.phosphoricons.regular.Heart
import com.adamglin.phosphoricons.regular.House
import com.adamglin.phosphoricons.regular.MagnifyingGlass
import com.adamglin.phosphoricons.regular.ShareNetwork
import com.adamglin.phosphoricons.regular.Trash
import com.adamglin.phosphoricons.regular.User
import com.esuiss.ui.components.Avatar
import com.esuiss.ui.components.AvatarFallback
import com.esuiss.ui.components.AvatarSize
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.Carousel
import com.esuiss.ui.components.CarouselContent
import com.esuiss.ui.components.CarouselControls
import com.esuiss.ui.components.CarouselDots
import com.esuiss.ui.components.CarouselDotsVariant
import com.esuiss.ui.components.CarouselItem
import com.esuiss.ui.components.CarouselNext
import com.esuiss.ui.components.CarouselPlayButton
import com.esuiss.ui.components.CarouselPrevious
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.MenuItemVariant
import com.esuiss.ui.components.PageIndicator
import com.esuiss.ui.components.PageIndicatorSize
import com.esuiss.ui.components.PageIndicatorVariant
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.TabBar
import com.esuiss.ui.components.TabBarItem
import com.esuiss.ui.components.rememberCarouselState
import com.esuiss.ui.interactions.ImageViewer
import com.esuiss.ui.interactions.ImageViewerImage
import com.esuiss.ui.interactions.PreviewMenu
import com.esuiss.ui.interactions.PreviewMenuItem
import com.esuiss.ui.interactions.PreviewMenuSeparator
import com.esuiss.ui.interactions.SectionIndex
import com.esuiss.ui.patterns.Preview
import com.esuiss.ui.patterns.PreviewContent
import com.esuiss.ui.patterns.PreviewTrigger
import com.esuiss.ui.patterns.SplitView
import com.esuiss.ui.patterns.SplitViewColumn
import com.esuiss.ui.patterns.SplitViewItem
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import java.io.File
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

private enum class NavigationScene {
    Carousel,
    CarouselSwiped,
    PageIndicator,
    TabBar,
    SectionIndex,
    SectionIndexDragging,
    PreviewMenu,
    Preview,
    SplitViewList,
    SplitViewCompact,
    SplitViewWide,
    ImageViewer,
    ImageViewerZoomed,
}

private class GradientPainter(private val from: Color, private val to: Color, private val size: Size) : Painter() {
    override val intrinsicSize: Size get() = size

    override fun DrawScope.onDraw() {
        drawRect(Brush.linearGradient(listOf(from, to), Offset.Zero, Offset(size.width, size.height)))
        drawCircle(Color.White.copy(alpha = 0.35f), radius = size.minDimension * 0.18f, center = Offset(size.width * 0.72f, size.height * 0.3f))
        drawRect(Color.Black.copy(alpha = 0.12f), topLeft = Offset(0f, size.height * 0.72f), size = Size(size.width, size.height * 0.28f))
    }
}

@Composable
private fun tones(): List<Pair<Color, Color>> {
    val colors = EsuissTheme.colors
    return listOf(
        colors.blue to colors.purple,
        colors.orange to colors.pink,
        colors.green to colors.teal,
        colors.indigo to colors.blue,
        colors.yellow to colors.orange,
        colors.pink to colors.red,
        colors.teal to colors.cyan,
        colors.purple to colors.indigo,
        colors.mint to colors.green,
    )
}

@Composable
private fun Caption(text: String, modifier: Modifier = Modifier) {
    BasicText(text, modifier = modifier, style = Typography.sm.copy(color = EsuissTheme.colors.labelSecondary))
}

@Composable
private fun SectionTitle(text: String) {
    BasicText(text, style = Typography.sm.copy(color = EsuissTheme.colors.labelSecondary, fontWeight = FontWeight.Medium))
}

@Composable
private fun Swatch(tone: Pair<Color, Color>, label: String, modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(Radius.xl2))
            .background(Brush.linearGradient(listOf(tone.first, tone.second))),
        contentAlignment = Alignment.BottomStart,
    ) {
        BasicText(label, modifier = Modifier.padding(16.dp), style = Typography.lg.copy(color = EsuissTheme.colors.onAccent, fontWeight = FontWeight.SemiBold))
    }
}

@Composable
private fun Page(content: @Composable () -> Unit) {
    Screen {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .windowInsetsPadding(WindowInsets.safeDrawing)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            content()
        }
    }
}

@Composable
private fun CarouselPage() {
    val palette = tones()
    val state = rememberCarouselState(pageCount = 5)
    val autoplay = rememberCarouselState(pageCount = 4)
    Page {
        SectionTitle("Carousel with page indicator")
        Carousel(state = state) {
            CarouselContent(modifier = Modifier.testTag("carousel")) { page ->
                CarouselItem {
                    Swatch(palette[page], "Slide ${page + 1}", Modifier.fillMaxWidth().aspectRatio(4f / 3f))
                }
            }
            Row(
                modifier = Modifier.fillMaxWidth().padding(top = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                CarouselPrevious()
                PageIndicator(
                    count = state.pageCount,
                    index = state.selectedIndex,
                    onIndexChange = { state.scrollTo(it) },
                )
                CarouselNext()
            }
        }
        Caption("Slide ${state.selectedIndex + 1} of ${state.pageCount}")
        SectionTitle("Autoplay with dots")
        Carousel(state = autoplay, autoplay = true) {
            CarouselContent { page ->
                CarouselItem {
                    Swatch(palette[page + 4], "Story ${page + 1}", Modifier.fillMaxWidth().height(96.dp))
                }
            }
            CarouselControls(modifier = Modifier.align(Alignment.CenterHorizontally)) {
                CarouselDots()
                CarouselPlayButton()
            }
        }
    }
}

@Composable
private fun PageIndicatorPage() {
    var selected by remember { mutableIntStateOf(1) }
    Page {
        SectionTitle("Default")
        PageIndicator(count = 5, index = 2)
        SectionTitle("Accent")
        PageIndicator(count = 5, index = 0, variant = PageIndicatorVariant.Accent)
        SectionTitle("Small")
        PageIndicator(count = 4, index = 3, size = PageIndicatorSize.Sm)
        SectionTitle("Many pages")
        PageIndicator(count = 20, index = 10)
        PageIndicator(count = 20, index = 0, size = PageIndicatorSize.Sm)
        PageIndicator(count = 20, index = 19, variant = PageIndicatorVariant.Accent)
        SectionTitle("Tappable")
        PageIndicator(count = 6, index = selected, onIndexChange = { selected = it })
        Caption("Page ${selected + 1} selected")
    }
}

@Composable
private fun TabBarPage() {
    var tab by remember { mutableStateOf("home") }
    Screen {
        Column(modifier = Modifier.fillMaxSize()) {
            Column(
                modifier = Modifier
                    .weight(1f)
                    .windowInsetsPadding(WindowInsets.safeDrawing)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                BasicText(
                    mapOf("home" to "Today", "search" to "Discover", "messages" to "Chats", "profile" to "Account").getValue(tab),
                    style = Typography.xl3.copy(color = EsuissTheme.colors.label, fontWeight = FontWeight.Bold),
                )
                Caption("${tab.replaceFirstChar { it.uppercase() }} tab")
            }
            TabBar(value = tab, onValueChange = { tab = it }) {
                TabBarItem("home", "Home", PhosphorIcons.Regular.House, selectedIcon = PhosphorIcons.Fill.House)
                TabBarItem("search", "Search", PhosphorIcons.Regular.MagnifyingGlass, selectedIcon = PhosphorIcons.Fill.MagnifyingGlass)
                TabBarItem("messages", "Messages", PhosphorIcons.Regular.ChatCircle, selectedIcon = PhosphorIcons.Fill.ChatCircle, badge = "3")
                TabBarItem("profile", "Profile", PhosphorIcons.Regular.User, selectedIcon = PhosphorIcons.Fill.User, badge = "")
                TabBarItem("settings", "Settings", PhosphorIcons.Regular.Gear, selectedIcon = PhosphorIcons.Fill.Gear, enabled = false)
            }
        }
    }
}

private val Contacts = listOf(
    "Aaron Diaz", "Abigail Moore", "Adam Clark", "Ben Carter", "Bianca Ross", "Caleb Hughes", "Chloe Price",
    "Daniel Ward", "Diana Hayes", "Ella Brooks", "Ethan Cole", "Grace Bell", "Hannah Reed", "Henry Fox",
    "Isaac Long", "Jack Rivera", "Julia Kim", "Kevin Shaw", "Laura Grant", "Leo Morgan", "Maya Patel",
    "Mason Lee", "Mia Torres", "Nathan Gray", "Nora Wells", "Olivia Stone", "Owen Hart", "Paul Young",
    "Quinn Adams", "Rachel Lane", "Ryan Fisher", "Sara Nolan", "Sophia Dunn", "Thomas Webb", "Uma Banks",
    "Victor Hale", "William Park", "Xavier Cruz", "Yara Bishop", "Zoe Walsh",
)

@Composable
private fun SectionIndexPage() {
    var log by remember { mutableStateOf("Drag the index") }
    val groups = Contacts.groupBy { it.first().toString() }
    Screen {
        Column(modifier = Modifier.fillMaxSize().windowInsetsPadding(WindowInsets.safeDrawing)) {
            Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                BasicText("Contacts", modifier = Modifier.weight(1f), style = Typography.xl3.copy(color = EsuissTheme.colors.label, fontWeight = FontWeight.Bold))
                Caption(log)
            }
            SectionIndex(
                modifier = Modifier.weight(1f),
                onValueChange = { log = "Jumped to $it" },
            ) {
                groups.forEach { (letter, names) ->
                    SectionIndexSection(letter) {
                        items(names.size, key = { names[it] }) { index ->
                            Row(
                                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
                                horizontalArrangement = Arrangement.spacedBy(12.dp),
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                Avatar(size = AvatarSize.Sm, fallback = { AvatarFallback(names[index].split(" ").joinToString("") { it.take(1) }) })
                                BasicText(names[index], style = Typography.base.copy(color = EsuissTheme.colors.label))
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun PreviewMenuPage() {
    val palette = tones()
    var log by remember { mutableStateOf("Touch and hold a photo.") }
    Page {
        SectionTitle("Photos")
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            for (row in 0 until 3) {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    for (column in 0 until 3) {
                        val index = row * 3 + column
                        val label = "Photo ${index + 1}"
                        var open by remember { mutableStateOf(false) }
                        PreviewMenu(
                            open = open,
                            onOpenChange = { open = it },
                            modifier = Modifier.weight(1f).aspectRatio(1f).testTag("photo$index"),
                            trigger = { Swatch(palette[index], "${index + 1}", Modifier.fillMaxSize()) },
                        ) {
                            PreviewMenuItem("Copy", { log = "Copied $label" }, icon = PhosphorIcons.Regular.Copy)
                            PreviewMenuItem("Share", { log = "Shared $label" }, icon = PhosphorIcons.Regular.ShareNetwork)
                            PreviewMenuItem("Favorite", { log = "Favorited $label" }, icon = PhosphorIcons.Regular.Heart)
                            PreviewMenuSeparator()
                            PreviewMenuItem("Delete", { log = "Deleted $label" }, icon = PhosphorIcons.Regular.Trash, variant = MenuItemVariant.Destructive)
                        }
                    }
                }
            }
        }
        Caption(log)
    }
}

@Composable
private fun PreviewPage() {
    var open by remember { mutableStateOf(false) }
    Page {
        SectionTitle("Preview")
        Row {
            BasicText("Made by ", style = Typography.base.copy(color = EsuissTheme.colors.label))
            Preview(open = open, onOpenChange = { open = it }) {
                PreviewTrigger("@esuiss")
                PreviewContent(modifier = Modifier.testTag("overlay")) {
                    Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                        Avatar(size = AvatarSize.Lg, fallback = { AvatarFallback("ES") })
                        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            BasicText("@esuiss", style = Typography.sm.copy(color = EsuissTheme.colors.label, fontWeight = FontWeight.SemiBold))
                            BasicText("Clean, minimal components for mobile apps.", style = Typography.sm.copy(color = EsuissTheme.colors.label))
                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                                Icon(PhosphorIcons.Regular.CalendarBlank, contentDescription = null, size = 14.dp, tint = EsuissTheme.colors.labelSecondary)
                                BasicText("Joined October 2026", style = Typography.xs.copy(color = EsuissTheme.colors.labelSecondary))
                            }
                        }
                    }
                }
            }
        }
    }
}

private val Mailboxes = listOf("Inbox", "Sent", "Drafts", "Archive")

private val Messages = listOf(
    Triple("Acme Store", "Your order has shipped", "Order #1042 will be delivered tomorrow. Tracking number: 4815 1623 42."),
    Triple("Jordan Lee", "Tomorrow's meeting", "Does 10:00 work for you? On the agenda: the Q4 budget and the campaign plan."),
    Triple("Cloud Drive", "Your storage is almost full", "Your cloud storage is 90% full. Upgrade your plan to get more space."),
)

@Composable
private fun MailSplitView(wide: Boolean) {
    var mailbox by remember { mutableStateOf("Inbox") }
    var message by remember { mutableIntStateOf(0) }
    var column by remember { mutableStateOf(SplitViewColumn.List) }
    val density = LocalDensity.current
    val scaled = if (wide) Density(density.density * 0.5f, density.fontScale) else density
    Screen {
        CompositionLocalProvider(LocalDensity provides scaled) {
            Column(modifier = Modifier.fillMaxSize().windowInsetsPadding(WindowInsets.safeDrawing)) {
                SplitView(
                    modifier = Modifier.weight(1f).testTag("split"),
                    column = column,
                    onColumnChange = { column = it },
                ) {
                    SplitViewSidebar(title = "Mailboxes") {
                        Mailboxes.forEach { name ->
                            SplitViewItem(isActive = mailbox == name, onClick = { mailbox = name }) {
                                BasicText(name, style = Typography.base.copy(color = EsuissTheme.colors.label))
                            }
                        }
                    }
                    SplitViewList(title = mailbox) {
                        Messages.forEachIndexed { index, (from, subject, _) ->
                            SplitViewItem(isActive = message == index, onClick = { message = index }) {
                                BasicText(from, style = Typography.base.copy(color = EsuissTheme.colors.label, fontWeight = FontWeight.SemiBold))
                                BasicText(subject, style = Typography.sm.copy(color = EsuissTheme.colors.labelSecondary))
                            }
                        }
                    }
                    SplitViewDetail(title = Messages[message].second) {
                        BasicText("From ${Messages[message].first}", style = Typography.sm.copy(color = EsuissTheme.colors.labelSecondary))
                        BasicText(Messages[message].third, modifier = Modifier.padding(top = 12.dp), style = Typography.base.copy(color = EsuissTheme.colors.label))
                    }
                }
                Caption("Column: ${column.name.lowercase()} · Mailbox: $mailbox", Modifier.padding(16.dp))
            }
        }
    }
}

@Composable
private fun ImageViewerPage() {
    val palette = tones()
    var open by remember { mutableStateOf(true) }
    var index by remember { mutableIntStateOf(1) }
    val images = remember(palette) {
        palette.take(5).mapIndexed { position, (from, to) ->
            ImageViewerImage(
                GradientPainter(from, to, if (position % 2 == 0) Size(1200f, 800f) else Size(900f, 1200f)),
                contentDescription = "Photo ${position + 1}",
            )
        }
    }
    Page {
        SectionTitle("Album")
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            palette.take(5).forEachIndexed { position, tone ->
                Swatch(tone, "${position + 1}", Modifier.size(56.dp))
            }
        }
        Button("Open viewer", { open = true })
        Caption(if (open) "Viewing photo ${index + 1}" else "Viewer closed")
    }
    ImageViewer(
        open = open,
        onOpenChange = { open = it },
        images = images,
        index = index,
        onIndexChange = { index = it },
    )
}

@Composable
private fun Scene(scene: NavigationScene) {
    when (scene) {
        NavigationScene.Carousel, NavigationScene.CarouselSwiped -> CarouselPage()
        NavigationScene.PageIndicator -> PageIndicatorPage()
        NavigationScene.TabBar -> TabBarPage()
        NavigationScene.SectionIndex, NavigationScene.SectionIndexDragging -> SectionIndexPage()
        NavigationScene.PreviewMenu -> PreviewMenuPage()
        NavigationScene.Preview -> PreviewPage()
        NavigationScene.SplitViewList, NavigationScene.SplitViewCompact -> MailSplitView(wide = false)
        NavigationScene.SplitViewWide -> MailSplitView(wide = true)
        NavigationScene.ImageViewer, NavigationScene.ImageViewerZoomed -> ImageViewerPage()
    }
}

private fun stateIs(value: String) = SemanticsMatcher.expectValue(SemanticsProperties.StateDescription, value)

@RunWith(AndroidJUnit4::class)
class NavigationGalleryTest {
    @get:Rule
    val compose = createComposeRule()

    @Test
    fun rendersNavigationInBothSchemes() {
        var dark by mutableStateOf(false)
        var scene by mutableStateOf(NavigationScene.Carousel)
        compose.mainClock.autoAdvance = false
        compose.setContent {
            EsuissTheme(darkTheme = dark) {
                key(scene, dark) { Scene(scene) }
            }
        }
        val instrumentation = InstrumentationRegistry.getInstrumentation()
        val context = instrumentation.targetContext
        for (current in NavigationScene.entries) {
            for (scheme in listOf(false, true)) {
                scene = current
                dark = scheme
                settle()
                when (current) {
                    NavigationScene.CarouselSwiped -> {
                        compose.onNodeWithTag("carousel").performTouchInput { swipeLeft() }
                        settle()
                        compose.onNodeWithText("Slide 2 of 5").assertExists()
                        compose.onNodeWithContentDescription("Next slide").performClick()
                        settle()
                        compose.onNodeWithText("Slide 3 of 5").assertExists()
                        compose.onNodeWithContentDescription("Page 5").performClick()
                        settle()
                        compose.onNodeWithText("Slide 5 of 5").assertExists()
                        compose.onNodeWithContentDescription("Previous slide").performClick()
                    }
                    NavigationScene.PageIndicator -> compose.onNodeWithContentDescription("Page 4").performClick()
                    NavigationScene.TabBar -> {
                        compose.onNodeWithText("Search").performClick()
                        settle()
                        compose.onNodeWithText("Search tab").assertExists()
                        compose.onNodeWithText("Settings").performClick()
                        compose.onNodeWithText("Messages").performClick()
                    }
                    NavigationScene.SectionIndexDragging -> compose.onNodeWithContentDescription("Section index").performTouchInput {
                        down(Offset(centerX, height * 0.04f))
                        repeat(12) {
                            advanceEventTime(16)
                            moveTo(Offset(centerX, height * (0.04f + (it + 1) * (0.42f / 12f))))
                        }
                    }
                    NavigationScene.PreviewMenu -> compose.onNodeWithTag("photo4").performTouchInput { longClick() }
                    NavigationScene.Preview -> compose.onNodeWithText("@esuiss").performClick()
                    NavigationScene.SplitViewCompact -> {
                        compose.onNodeWithText("Jordan Lee").performClick()
                        settle()
                        compose.onNodeWithText("Column: detail · Mailbox: Inbox").assertExists()
                        compose.onNodeWithText("Inbox").performClick()
                        settle()
                        compose.onNodeWithText("Column: list · Mailbox: Inbox").assertExists()
                        compose.onNodeWithText("Mailboxes").performClick()
                        settle()
                        compose.onNodeWithText("Sent").performClick()
                        settle()
                        compose.onNodeWithText("Column: list · Mailbox: Sent").assertExists()
                        compose.onNodeWithText("Cloud Drive").performClick()
                    }
                    NavigationScene.SplitViewWide -> {
                        compose.onNodeWithText("Drafts").performClick()
                        compose.onNodeWithText("Jordan Lee").performClick()
                    }
                    NavigationScene.ImageViewer -> {
                        compose.onNodeWithContentDescription("Photo 2").performTouchInput { swipeLeft() }
                        settle()
                        compose.onNodeWithText("3 of 5").assertExists()
                    }
                    NavigationScene.ImageViewerZoomed -> {
                        compose.onNodeWithContentDescription("Photo 2").performTouchInput {
                            pinch(center - Offset(40f, 0f), center - Offset(240f, 0f), center + Offset(40f, 0f), center + Offset(240f, 0f))
                        }
                        settle()
                        compose.onNodeWithContentDescription("Photo 2").assert(stateIs("400%"))
                        compose.onNodeWithContentDescription("Photo 2").performTouchInput { doubleClick(center) }
                        settle()
                        compose.onNodeWithContentDescription("Photo 2").assert(stateIs("100%"))
                        compose.onNodeWithContentDescription("Photo 2").performTouchInput { doubleClick(Offset(centerX + width * 0.2f, centerY - height * 0.1f)) }
                    }
                    else -> Unit
                }
                settle()
                when (current) {
                    NavigationScene.Carousel -> compose.onNodeWithText("Slide 1 of 5").assertExists()
                    NavigationScene.CarouselSwiped -> compose.onNodeWithText("Slide 4 of 5").assertExists()
                    NavigationScene.PageIndicator -> compose.onNodeWithText("Page 4 selected").assertExists()
                    NavigationScene.TabBar -> {
                        compose.onNodeWithText("Messages tab").assertExists()
                        compose.onNodeWithText("Messages").assertIsSelected()
                    }
                    NavigationScene.SectionIndexDragging -> {
                        compose.onNodeWithText("Jumped to M").assertExists()
                        compose.onNodeWithText("Maya Patel").assertExists()
                    }
                    NavigationScene.PreviewMenu -> compose.onNodeWithText("Share").assertExists()
                    NavigationScene.Preview -> compose.onNodeWithTag("overlay").assertExists()
                    NavigationScene.SplitViewList -> compose.onNodeWithText("Column: list · Mailbox: Inbox").assertExists()
                    NavigationScene.SplitViewCompact -> compose.onNodeWithText("Column: detail · Mailbox: Sent").assertExists()
                    NavigationScene.SplitViewWide -> compose.onNodeWithText("Column: detail · Mailbox: Drafts").assertExists()
                    NavigationScene.ImageViewer -> compose.onNodeWithText("Viewing photo 3").assertExists()
                    NavigationScene.ImageViewerZoomed -> compose.onNodeWithContentDescription("Photo 2").assert(stateIs("250%"))
                    else -> Unit
                }
                SystemClock.sleep(600)
                val bitmap = checkNotNull(instrumentation.uiAutomation.takeScreenshot())
                val name = "navigation-${current.name.lowercase()}-${if (scheme) "dark" else "light"}.png"
                File(context.getExternalFilesDir(null), name).outputStream().use {
                    bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)
                }
                when (current) {
                    NavigationScene.SectionIndexDragging -> {
                        compose.onNodeWithContentDescription("Section index").performTouchInput { up() }
                        settle()
                    }
                    NavigationScene.ImageViewer -> {
                        compose.onNodeWithContentDescription("Photo 3").performTouchInput { swipeDown(startY = centerY, endY = bottom, durationMillis = 300) }
                        settle()
                        compose.onNodeWithText("Viewer closed").assertExists()
                    }
                    else -> Unit
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
