package com.esuiss.ui

import android.graphics.Bitmap
import android.os.SystemClock
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.windowInsetsPadding
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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onAllNodesWithContentDescription
import androidx.compose.ui.test.onFirst
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTextInput
import androidx.compose.ui.test.performTouchInput
import androidx.compose.ui.test.swipeLeft
import androidx.compose.ui.test.swipeUp
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.fill.Bell
import com.adamglin.phosphoricons.fill.ChatCircle
import com.adamglin.phosphoricons.fill.Footprints
import com.adamglin.phosphoricons.fill.Timer
import com.adamglin.phosphoricons.regular.ArrowCounterClockwise
import com.adamglin.phosphoricons.regular.Heart
import com.adamglin.phosphoricons.regular.Pause
import com.adamglin.phosphoricons.regular.X
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardHeader
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.LocalContentColor
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.components.MemoryThemeStorage
import com.esuiss.ui.components.QrScanner
import com.esuiss.ui.components.QrScannerState
import com.esuiss.ui.components.Questionnaire
import com.esuiss.ui.components.QuestionnaireActions
import com.esuiss.ui.components.QuestionnaireChoice
import com.esuiss.ui.components.QuestionnaireChoiceDescription
import com.esuiss.ui.components.QuestionnaireChoices
import com.esuiss.ui.components.QuestionnaireDescription
import com.esuiss.ui.components.QuestionnaireError
import com.esuiss.ui.components.QuestionnaireInput
import com.esuiss.ui.components.QuestionnaireItem
import com.esuiss.ui.components.QuestionnaireNext
import com.esuiss.ui.components.QuestionnairePrevious
import com.esuiss.ui.components.QuestionnaireProgress
import com.esuiss.ui.components.QuestionnaireSkip
import com.esuiss.ui.components.QuestionnaireSubmit
import com.esuiss.ui.components.QuestionnaireTitle
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.SignaturePad
import com.esuiss.ui.components.SignatureStroke
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.Theme
import com.esuiss.ui.components.ThemeProvider
import com.esuiss.ui.components.ThemeToggle
import com.esuiss.ui.components.Widget
import com.esuiss.ui.components.WidgetAction
import com.esuiss.ui.components.WidgetAlign
import com.esuiss.ui.components.WidgetContent
import com.esuiss.ui.components.WidgetDescription
import com.esuiss.ui.components.WidgetFooter
import com.esuiss.ui.components.WidgetHeader
import com.esuiss.ui.components.WidgetIcon
import com.esuiss.ui.components.WidgetIconSize
import com.esuiss.ui.components.WidgetSize
import com.esuiss.ui.components.WidgetTitle
import com.esuiss.ui.components.WidgetValue
import com.esuiss.ui.components.rememberQuestionnaireState
import com.esuiss.ui.components.toSvg
import com.esuiss.ui.components.useTheme
import com.esuiss.ui.interactions.CardStack
import com.esuiss.ui.interactions.CardStackDirection
import com.esuiss.ui.interactions.Island
import com.esuiss.ui.interactions.IslandCompact
import com.esuiss.ui.interactions.IslandExpanded
import com.esuiss.ui.interactions.IslandProvider
import com.esuiss.ui.interactions.IslandRing
import com.esuiss.ui.interactions.rememberCardStackState
import com.esuiss.ui.interactions.useIsland
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import java.io.File
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

private enum class ExtrasScene {
    Questionnaire,
    QuestionnaireError,
    QuestionnaireLast,
    Theme,
    ThemeSystem,
    Widgets,
    WidgetEditing,
    IslandCompact,
    IslandExpanded,
    IslandNotice,
    QrIdle,
    QrSuccess,
    QrError,
    Signature,
    CardStack,
    CardStackSwiping,
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
private fun Page(scroll: Boolean = false, content: @Composable () -> Unit) {
    Screen {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .then(if (scroll) Modifier.verticalScroll(rememberScrollState()) else Modifier)
                .windowInsetsPadding(WindowInsets.safeDrawing)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            content()
        }
    }
}

@Composable
private fun QuestionnairePage() {
    var result by remember { mutableStateOf("Not submitted") }
    var item by remember { mutableStateOf("role") }
    val state = rememberQuestionnaireState()
    Page {
        Questionnaire(
            state = state,
            onItemChange = { item = it },
            onSubmit = { values -> result = "Submitted: " + values.entries.joinToString { "${it.key}=${it.value.joinToString("+")}" } },
        ) {
            QuestionnaireProgress()
            QuestionnaireItem(name = "role", required = true) {
                QuestionnaireTitle("What best describes your role?")
                QuestionnaireDescription("This helps us tailor the setup to your team.")
                QuestionnaireChoices {
                    QuestionnaireChoice("Engineering", value = "engineering")
                    QuestionnaireChoice("Design", value = "design")
                    QuestionnaireChoice("Product", value = "product")
                    QuestionnaireChoice(value = "other") {
                        Text("Something else")
                        QuestionnaireChoiceDescription("Tell us more later in settings.")
                    }
                }
                QuestionnaireError()
            }
            QuestionnaireItem(name = "team-size") {
                QuestionnaireTitle("How large is your team?")
                QuestionnaireChoices {
                    QuestionnaireChoice("Just me", value = "solo")
                    QuestionnaireChoice("2 to 10 people", value = "small")
                    QuestionnaireChoice("11 to 50 people", value = "medium")
                    QuestionnaireChoice("More than 50 people", value = "large", enabled = false)
                }
                QuestionnaireError()
            }
            QuestionnaireItem(name = "company", required = true) {
                QuestionnaireTitle("What is your company called?")
                QuestionnaireInput(placeholder = "Acme Inc.", modifier = Modifier.testTag("company"))
                QuestionnaireError("Enter a company name to continue.")
            }
            QuestionnaireActions {
                QuestionnairePrevious()
                QuestionnaireSkip()
                QuestionnaireNext()
                QuestionnaireSubmit()
            }
        }
        Caption("Item: $item · Status: ${state.activeItemStatus?.name?.lowercase()}")
        Caption(result)
    }
}

@Composable
private fun ThemeContent() {
    val theme = useTheme()
    Page {
        BasicText("Appearance", style = Typography.xl3.copy(color = EsuissTheme.colors.label, fontWeight = FontWeight.Bold))
        ThemeToggle()
        Caption("Theme: ${theme.theme.name.lowercase()} · Resolved: ${theme.resolvedTheme.name.lowercase()}")
        Card {
            CardHeader("Preview", description = "Surfaces and labels follow the selected theme.")
            CardContent {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button("Primary", onClick = {})
                    Button("Secondary", onClick = {}, variant = ButtonVariant.Secondary)
                }
            }
        }
    }
}

@Composable
private fun WeatherWidget(size: WidgetSize? = null, resizable: Boolean = false, onSizeChange: (WidgetSize) -> Unit = {}) {
    val colors = EsuissTheme.colors
    Widget(
        size = size,
        defaultSize = if (resizable) WidgetSize.Small else null,
        resizable = resizable,
        onSizeChange = onSizeChange,
        modifier = Modifier.testTag("widget"),
    ) {
        WidgetHeader {
            WidgetIcon(size = WidgetIconSize.Sm) { Icon(PhosphorIcons.Fill.Footprints, null, tint = colors.orange) }
            WidgetTitle("Activity")
            if (this@Widget.size != WidgetSize.Small) {
                WidgetAction { Caption("Today") }
            }
        }
        WidgetContent {
            WidgetValue("8,421")
            WidgetDescription("steps of 10,000")
            if (this@Widget.size == WidgetSize.Large || this@Widget.size == WidgetSize.ExtraLarge) {
                Row(
                    modifier = Modifier.fillMaxWidth().height(72.dp).padding(top = 12.dp),
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalAlignment = Alignment.Bottom,
                ) {
                    listOf(0.4f, 0.7f, 0.5f, 0.9f, 0.6f, 0.8f, 0.3f).forEach {
                        Box(
                            Modifier
                                .weight(1f)
                                .fillMaxHeight(it)
                                .clip(RoundedCornerShape(Radius.xs))
                                .background(colors.orange),
                        )
                    }
                }
            }
        }
        WidgetFooter {
            Icon(PhosphorIcons.Fill.Timer, null)
            BasicText("Updated 5 min ago", style = LocalContentStyle.current, maxLines = 1)
        }
    }
}

@Composable
private fun WidgetsPage() {
    Page(scroll = true) {
        SectionTitle("Small and medium")
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            WeatherWidget(size = WidgetSize.Small)
            Widget(size = WidgetSize.Small, align = WidgetAlign.Center) {
                WidgetHeader {
                    WidgetIcon(size = WidgetIconSize.Lg) { Icon(PhosphorIcons.Regular.Heart, null) }
                    WidgetTitle("Heart rate")
                }
                WidgetValue("68")
            }
        }
        WeatherWidget(size = WidgetSize.Medium)
        SectionTitle("Large")
        WeatherWidget(size = WidgetSize.Large)
    }
}

@Composable
private fun WidgetEditingPage() {
    var size by remember { mutableStateOf(WidgetSize.Small) }
    Page {
        SectionTitle("Editing: drag the corner handle")
        WeatherWidget(resizable = true, onSizeChange = { size = it })
        Caption("Size: ${size.name.lowercase()}")
    }
}

@Composable
private fun IslandControls() {
    val island = useIsland()
    val colors = EsuissTheme.colors
    Page {
        BasicText("Island", style = Typography.xl3.copy(color = colors.label, fontWeight = FontWeight.Bold))
        Caption("View: ${island.view.name.lowercase()}")
        Button(
            "New message",
            onClick = {
                island.notify(
                    title = "Jordan Lee",
                    description = "Are we still on for Saturday?",
                    icon = { Icon(PhosphorIcons.Fill.ChatCircle, null, tint = colors.green) },
                )
            },
            variant = ButtonVariant.Secondary,
        )
        Button(
            "Reminder",
            onClick = {
                island.notify(
                    title = "Design review",
                    description = "Starts in 10 minutes",
                    icon = { Icon(PhosphorIcons.Fill.Bell, null, tint = colors.orange) },
                )
            },
            variant = ButtonVariant.Secondary,
        )
    }
}

@Composable
private fun IslandPage() {
    val progress = 0.62f
    IslandProvider {
        IslandControls()
        Island(modifier = Modifier.testTag("island")) {
            IslandCompact(modifier = Modifier.testTag("island-compact")) {
                Icon(PhosphorIcons.Fill.Timer, null, tint = EsuissTheme.colors.orange)
                BasicText("12:48", style = Typography.sm.copy(color = EsuissTheme.colors.orange, fontWeight = FontWeight.SemiBold))
                IslandRing(progress, color = EsuissTheme.colors.orange)
            }
            IslandExpanded {
                val foreground = LocalContentColor.current
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(PhosphorIcons.Fill.Timer, null, size = 28.dp, tint = EsuissTheme.colors.orange)
                    Column(Modifier.weight(1f)) {
                        BasicText("Focus timer", style = Typography.sm.copy(color = foreground.copy(alpha = 0.7f)))
                        BasicText("12:48", style = Typography.xl2.copy(color = foreground, fontWeight = FontWeight.SemiBold))
                    }
                    IslandRing(progress, modifier = Modifier.size(40.dp), color = EsuissTheme.colors.orange)
                }
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(onClick = {}, variant = ButtonVariant.Secondary, size = ButtonSize.Sm) {
                        Icon(PhosphorIcons.Regular.Pause, null)
                        BasicText("Pause", style = LocalContentStyle.current)
                    }
                    Button(onClick = {}, variant = ButtonVariant.Destructive, size = ButtonSize.Sm) {
                        Icon(PhosphorIcons.Regular.X, null)
                        BasicText("End", style = LocalContentStyle.current)
                    }
                }
            }
        }
    }
}

@Composable
private fun CameraPlaceholder() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.linearGradient(listOf(Color(0xFF2B3A42), Color(0xFF5B4B3A), Color(0xFF1F2A30)))),
    ) {
        Box(
            Modifier
                .align(Alignment.Center)
                .size(150.dp)
                .background(Color(0xFFE9E4DA), RoundedCornerShape(8.dp)),
        )
    }
}

@Composable
private fun QrPage(state: QrScannerState) {
    var torch by remember { mutableStateOf(false) }
    Box(Modifier.fillMaxSize()) {
        QrScanner(
            state = state,
            title = when (state) {
                QrScannerState.Idle -> "Scan QR code"
                QrScannerState.Success -> "Code found"
                QrScannerState.Error -> "Unsupported code"
            },
            hint = when (state) {
                QrScannerState.Error -> "This code can't be used here. Try another one."
                else -> "Align the code inside the frame to scan it."
            },
            torch = torch,
            onTorchToggle = { torch = it },
        ) {
            CameraPlaceholder()
        }
        BasicText(
            "Torch: ${if (torch) "on" else "off"}",
            modifier = Modifier
                .align(Alignment.TopStart)
                .windowInsetsPadding(WindowInsets.safeDrawing)
                .padding(16.dp),
            style = Typography.xs.copy(color = EsuissTheme.colors.onMedia.copy(alpha = 0.7f)),
        )
    }
}

@Composable
private fun SignaturePage(onSvg: (String) -> Unit) {
    var strokes by remember { mutableStateOf<List<SignatureStroke>>(emptyList()) }
    Page {
        BasicText("Sign to confirm", style = Typography.lg.copy(color = EsuissTheme.colors.label, fontWeight = FontWeight.SemiBold))
        SignaturePad(
            value = strokes,
            onValueChange = {
                strokes = it
                onSvg(it.toSvg(360f, 200f))
            },
        )
        Caption("Strokes: ${strokes.size}")
        SectionTitle("Empty and disabled")
        SignaturePad(modifier = Modifier.height(120.dp), enabled = false)
    }
}

private data class Place(val name: String, val country: String, val tone: Int)

private val Places = listOf(
    Place("Paris", "France", 0),
    Place("Tokyo", "Japan", 1),
    Place("Lisbon", "Portugal", 2),
    Place("Oslo", "Norway", 3),
    Place("Cusco", "Peru", 4),
)

@Composable
private fun CardStackPage() {
    val colors = EsuissTheme.colors
    val tones = listOf(colors.blue to colors.purple, colors.orange to colors.pink, colors.green to colors.teal, colors.indigo to colors.blue, colors.yellow to colors.orange)
    val state = rememberCardStackState()
    var last by remember { mutableStateOf("None") }
    Page {
        BasicText("Discover", style = Typography.xl3.copy(color = colors.label, fontWeight = FontWeight.Bold))
        CardStack(
            items = Places,
            key = { it.name },
            state = state,
            onSwipe = { direction, place -> last = "${direction.name.lowercase()} · ${place.name}" },
            onUndo = { _, place -> last = "undo · ${place.name}" },
            empty = { Caption("No more places") },
        ) { place ->
            Card(modifier = Modifier.testTag("card-${place.name}")) {
                Box(
                    Modifier
                        .padding(horizontal = 24.dp)
                        .fillMaxWidth()
                        .height(220.dp)
                        .clip(RoundedCornerShape(Radius.xl))
                        .background(Brush.linearGradient(listOf(tones[place.tone].first, tones[place.tone].second))),
                )
                CardHeader(place.name, description = place.country)
            }
        }
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp, Alignment.CenterHorizontally)) {
            Button(onClick = { state.swipe(CardStackDirection.Left) }, variant = ButtonVariant.Secondary, size = ButtonSize.IconLg) {
                Icon(PhosphorIcons.Regular.X, "Skip")
            }
            Button(onClick = { state.undo() }, variant = ButtonVariant.Secondary, size = ButtonSize.IconLg, enabled = state.canUndo) {
                Icon(PhosphorIcons.Regular.ArrowCounterClockwise, "Undo")
            }
            Button(onClick = { state.swipe(CardStackDirection.Right) }, size = ButtonSize.IconLg) {
                Icon(PhosphorIcons.Regular.Heart, "Like")
            }
        }
        Caption("Last: $last · Index: ${state.index}")
    }
}

@Composable
private fun Scene(scene: ExtrasScene, dark: Boolean, onSvg: (String) -> Unit) {
    when (scene) {
        ExtrasScene.Questionnaire, ExtrasScene.QuestionnaireError, ExtrasScene.QuestionnaireLast -> QuestionnairePage()
        ExtrasScene.Theme, ExtrasScene.ThemeSystem -> {
            val storage = remember { MemoryThemeStorage() }
            val initial = when {
                scene == ExtrasScene.Theme -> Theme.System
                dark -> Theme.Dark
                else -> Theme.Light
            }
            ThemeProvider(defaultTheme = initial, storage = storage) { ThemeContent() }
        }
        ExtrasScene.Widgets -> WidgetsPage()
        ExtrasScene.WidgetEditing -> WidgetEditingPage()
        ExtrasScene.IslandCompact, ExtrasScene.IslandExpanded, ExtrasScene.IslandNotice -> IslandPage()
        ExtrasScene.QrIdle -> QrPage(QrScannerState.Idle)
        ExtrasScene.QrSuccess -> QrPage(QrScannerState.Success)
        ExtrasScene.QrError -> QrPage(QrScannerState.Error)
        ExtrasScene.Signature -> SignaturePage(onSvg)
        ExtrasScene.CardStack, ExtrasScene.CardStackSwiping -> CardStackPage()
    }
}

@RunWith(AndroidJUnit4::class)
class ExtrasGalleryTest {
    @get:Rule
    val compose = createComposeRule()

    @Test
    fun rendersExtrasInBothSchemes() {
        var dark by mutableStateOf(false)
        var scene by mutableStateOf(ExtrasScene.Questionnaire)
        var svg = ""
        compose.mainClock.autoAdvance = false
        compose.setContent {
            EsuissTheme(darkTheme = dark) {
                key(scene, dark) { Scene(scene, dark) { svg = it } }
            }
        }
        val instrumentation = InstrumentationRegistry.getInstrumentation()
        val context = instrumentation.targetContext
        for (current in ExtrasScene.entries) {
            for (scheme in listOf(false, true)) {
                scene = current
                dark = scheme
                settle()
                var release: (() -> Unit)? = null
                when (current) {
                    ExtrasScene.Questionnaire -> {
                        compose.onNodeWithText("Question 1 of 3").assertExists()
                        compose.onNodeWithText("Skip").assertDoesNotExist()
                        compose.onNodeWithText("Design").performClick()
                        compose.onNodeWithText("Next").performClick()
                        settle()
                        compose.onNodeWithText("Question 2 of 3").assertExists()
                        compose.onNodeWithText("How large is your team?").assertExists()
                        compose.onNodeWithText("Skip").assertExists()
                        compose.onNodeWithText("Previous").performClick()
                        settle()
                        compose.onNodeWithText("Question 1 of 3").assertExists()
                        compose.onNodeWithText("Item: role · Status: answered").assertExists()
                        compose.onNodeWithText("Next").performClick()
                        settle()
                        compose.onNodeWithText("2 to 10 people").performClick()
                    }
                    ExtrasScene.QuestionnaireError -> {
                        compose.onNodeWithText("Next").performClick()
                        settle()
                        compose.onNodeWithText("Choose an answer to continue.").assertExists()
                        compose.onNodeWithText("Question 1 of 3").assertExists()
                    }
                    ExtrasScene.QuestionnaireLast -> {
                        compose.onNodeWithText("Product").performClick()
                        compose.onNodeWithText("Next").performClick()
                        settle()
                        compose.onNodeWithText("Skip").performClick()
                        settle()
                        compose.onNodeWithText("Question 3 of 3").assertExists()
                        compose.onNodeWithText("Submit").performClick()
                        settle()
                        compose.onNodeWithText("Enter a company name to continue.").assertExists()
                        compose.onNodeWithText("Not submitted").assertExists()
                        compose.onNodeWithTag("company").performTextInput("Acme Inc.")
                        compose.onNodeWithText("Submit").performClick()
                        settle()
                        compose.onNodeWithText("Submitted: role=product, company=Acme Inc.").assertExists()
                    }
                    ExtrasScene.Theme -> {
                        val first = if (scheme) "Dark" else "Light"
                        val second = if (scheme) "Light" else "Dark"
                        compose.onNodeWithText(second).performClick()
                        settle()
                        compose.onNodeWithText("Theme: ${second.lowercase()} · Resolved: ${second.lowercase()}").assertExists()
                        compose.onNodeWithText(first).performClick()
                        settle()
                        compose.onNodeWithText("Theme: ${first.lowercase()} · Resolved: ${first.lowercase()}").assertExists()
                    }
                    ExtrasScene.ThemeSystem -> {
                        compose.onNodeWithText("System").performClick()
                        settle()
                        compose.onNodeWithText("Theme: system · Resolved: ", substring = true).assertExists()
                    }
                    ExtrasScene.WidgetEditing -> {
                        compose.onNodeWithContentDescription("Resize widget").performTouchInput {
                            down(center)
                            repeat(10) {
                                advanceEventTime(16)
                                moveBy(Offset(18.4.dp.toPx(), 0f))
                            }
                            advanceEventTime(16)
                            up()
                        }
                        settle()
                        compose.onNodeWithText("Size: medium").assertExists()
                        compose.onNodeWithContentDescription("Resize widget").performTouchInput {
                            down(center)
                            repeat(12) {
                                advanceEventTime(16)
                                moveBy(Offset(0f, 16.dp.toPx()))
                            }
                        }
                        settle()
                        release = {
                            compose.onNodeWithContentDescription("Resize widget").performTouchInput { up() }
                            settle()
                            compose.onNodeWithText("Size: large").assertExists()
                        }
                    }
                    ExtrasScene.IslandCompact -> compose.onNodeWithText("View: compact").assertExists()
                    ExtrasScene.IslandExpanded -> {
                        compose.onNodeWithTag("island-compact").performClick()
                        settle()
                        compose.onNodeWithText("View: expanded").assertExists()
                        compose.onNodeWithTag("island").performTouchInput { swipeUp(durationMillis = 300) }
                        settle()
                        compose.onNodeWithText("View: compact").assertExists()
                        compose.onNodeWithTag("island-compact").performClick()
                        settle()
                        compose.onNodeWithText("Focus timer").assertExists()
                    }
                    ExtrasScene.IslandNotice -> {
                        compose.onNodeWithText("New message").performClick()
                        settle()
                        compose.onNodeWithText("View: notice").assertExists()
                        compose.onNodeWithText("Jordan Lee").assertExists()
                    }
                    ExtrasScene.QrIdle -> {
                        compose.onNodeWithContentDescription("Torch").performClick()
                        settle()
                        compose.onNodeWithText("Torch: on").assertExists()
                    }
                    ExtrasScene.Signature -> {
                        compose.onAllNodesWithContentDescription("Signature pad").onFirst().performTouchInput {
                            val points = (0..40).map { step ->
                                val t = step / 40f
                                Offset(
                                    width * (0.12f + 0.74f * t),
                                    height * (0.55f - 0.22f * kotlin.math.sin(t * 9f) * (1f - t * 0.5f)),
                                )
                            }
                            down(points.first())
                            points.drop(1).forEach {
                                advanceEventTime(12)
                                moveTo(it)
                            }
                            up()
                        }
                        settle()
                        compose.onNodeWithText("Strokes: 1").assertExists()
                        compose.onNodeWithText("Clear").assertExists()
                        assertTrue(svg.startsWith("<svg") && svg.contains("<path d=\"M"))
                    }
                    ExtrasScene.CardStack -> {
                        compose.onNodeWithContentDescription("Like").performClick()
                        settle()
                        compose.onNodeWithText("Last: right · Paris · Index: 1").assertExists()
                        compose.onNodeWithTag("card-Tokyo").performTouchInput { swipeLeft(durationMillis = 200) }
                        settle()
                        compose.onNodeWithText("Last: left · Tokyo · Index: 2").assertExists()
                        compose.onNodeWithContentDescription("Undo").performClick()
                        settle()
                        compose.onNodeWithText("Last: undo · Tokyo · Index: 1").assertExists()
                        compose.onNodeWithTag("card-Tokyo").assertExists()
                    }
                    ExtrasScene.CardStackSwiping -> {
                        compose.onNodeWithTag("card-Paris").performTouchInput {
                            down(center)
                            repeat(8) {
                                advanceEventTime(16)
                                moveBy(Offset(width * 0.03f, -height * 0.004f))
                            }
                        }
                        settle()
                        release = {
                            compose.onNodeWithTag("card-Paris").performTouchInput { up() }
                            settle()
                            compose.onNodeWithText("Last: None · Index: 0").assertExists()
                        }
                    }
                    else -> Unit
                }
                settle()
                SystemClock.sleep(600)
                val bitmap = checkNotNull(instrumentation.uiAutomation.takeScreenshot())
                val name = "extras-${current.name.lowercase()}-${if (scheme) "dark" else "light"}.png"
                File(context.getExternalFilesDir(null), name).outputStream().use {
                    bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)
                }
                release?.invoke()
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
