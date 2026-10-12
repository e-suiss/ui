package com.esuiss.ui

import android.graphics.Bitmap
import android.os.SystemClock
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableDoubleStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.test.hasSetTextAction
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTextInput
import androidx.compose.ui.unit.dp
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.esuiss.ui.components.Calendar
import com.esuiss.ui.components.CalendarCaptionLayout
import com.esuiss.ui.components.CalendarSize
import com.esuiss.ui.components.DateRange
import com.esuiss.ui.components.Separator
import com.esuiss.ui.components.WheelPicker
import com.esuiss.ui.components.WheelPickerColumn
import com.esuiss.ui.interactions.Stepper
import com.esuiss.ui.interactions.StepperDecrement
import com.esuiss.ui.interactions.StepperGroup
import com.esuiss.ui.interactions.StepperIncrement
import com.esuiss.ui.interactions.StepperInput
import com.esuiss.ui.interactions.StepperSeparator
import com.esuiss.ui.patterns.DatePicker
import com.esuiss.ui.patterns.SearchPicker
import com.esuiss.ui.patterns.SearchPickerItem
import com.esuiss.ui.patterns.SegmentPicker
import com.esuiss.ui.patterns.SegmentPickerSize
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import java.io.File
import java.text.DecimalFormat
import java.util.Date
import java.util.GregorianCalendar
import java.util.Locale
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

private enum class PickerScene {
    WheelPicker,
    WheelPickerDateTime,
    Calendar,
    CalendarRange,
    CalendarSizes,
    CalendarOptions,
    CalendarDropdown,
    DatePickerTriggers,
    DatePicker,
    DatePickerLocale,
    SegmentPicker,
    SegmentPickerOpen,
    Stepper,
    SearchPicker,
    SearchPickerOpen,
    SearchPickerEmpty,
}

private val Today: Date = GregorianCalendar(2026, 9, 4).time

private fun day(year: Int, month: Int, day: Int): Date = GregorianCalendar(year, month, day).time

private val Fruits = listOf("Apple", "Banana", "Cherry", "Grape", "Lemon", "Mango", "Orange", "Peach", "Pear", "Plum")

private val Slots = List(11) { index ->
    val minutes = 18 * 60 + index * 30
    "${minutes / 60}:${(minutes % 60).toString().padStart(2, '0')}"
}

private val Booked = setOf("19:30", "20:00", "20:30")

private val Frameworks = listOf(
    SearchPickerItem("next", "Next.js"),
    SearchPickerItem("remix", "Remix"),
    SearchPickerItem("astro", "Astro"),
    SearchPickerItem("sveltekit", "SvelteKit"),
    SearchPickerItem("nuxt", "Nuxt"),
    SearchPickerItem("gatsby", "Gatsby", enabled = false),
)

private val Cities = listOf(
    SearchPickerItem("nyc", "New York", "Americas"),
    SearchPickerItem("chi", "Chicago", "Americas"),
    SearchPickerItem("sao", "São Paulo", "Americas"),
    SearchPickerItem("lon", "London", "Europe"),
    SearchPickerItem("ber", "Berlin", "Europe"),
    SearchPickerItem("ist", "Istanbul", "Europe"),
    SearchPickerItem("tyo", "Tokyo", "Asia"),
    SearchPickerItem("sin", "Singapore", "Asia"),
)

@Composable
private fun Caption(text: String) {
    BasicText(text, style = Typography.sm.copy(color = EsuissTheme.colors.labelSecondary))
}

@Composable
private fun Framed(content: @Composable () -> Unit) {
    val colors = EsuissTheme.colors
    Box(
        modifier = Modifier
            .border(1.dp, colors.separator, RoundedCornerShape(Radius.xl2))
            .background(colors.surfaceRaised, RoundedCornerShape(Radius.xl2))
            .padding(16.dp),
    ) {
        content()
    }
}

@Composable
private fun CalendarFrame(content: @Composable () -> Unit) {
    Box(
        modifier = Modifier
            .border(1.dp, EsuissTheme.colors.separator, RoundedCornerShape(Radius.xl2))
            .padding(1.dp),
    ) {
        content()
    }
}

@Composable
private fun SingleCalendar(size: CalendarSize = CalendarSize.Default, showWeekNumber: Boolean = false, weekendsDisabled: Boolean = false) {
    var date by remember { mutableStateOf<Date?>(day(2026, 9, 7)) }
    CalendarFrame {
        Calendar(
            selected = date,
            onSelect = { date = it },
            today = Today,
            locale = Locale.US,
            size = size,
            showWeekNumber = showWeekNumber,
            disabled = { value ->
                weekendsDisabled && GregorianCalendar().apply { time = value }.get(java.util.Calendar.DAY_OF_WEEK).let {
                    it == java.util.Calendar.SATURDAY || it == java.util.Calendar.SUNDAY
                }
            },
        )
    }
}

@Composable
private fun StepperRow(label: String, value: Double, onValueChange: (Double) -> Unit, min: Double, max: Double, step: Double = 1.0, enabled: Boolean = true, format: DecimalFormat = DecimalFormat("0")) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 44.dp)
            .padding(horizontal = 16.dp, vertical = 6.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        BasicText(label, style = Typography.base.copy(color = EsuissTheme.colors.label))
        Stepper(value = value, onValueChange = onValueChange, min = min, max = max, step = step, enabled = enabled, format = format) {
            StepperInput(contentDescription = label)
            StepperGroup {
                StepperDecrement()
                StepperSeparator()
                StepperIncrement()
            }
        }
    }
}

@Composable
private fun Scene(scene: PickerScene) {
    when (scene) {
        PickerScene.WheelPicker -> Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            var fruit by remember { mutableStateOf<String?>("Lemon") }
            var slot by remember { mutableStateOf<String?>("19:00") }
            Framed {
                WheelPicker(modifier = Modifier.width(288.dp)) {
                    WheelPickerColumn(value = fruit, onValueChange = { fruit = it }, label = "Fruit") {
                        Fruits.forEach { WheelPickerItem(it, it) }
                    }
                }
            }
            Framed {
                WheelPicker(modifier = Modifier.width(288.dp)) {
                    WheelPickerColumn(value = slot, onValueChange = { slot = it }, label = "Reservation time") {
                        Slots.forEach { WheelPickerItem(it, it, enabled = it !in Booked) }
                    }
                }
            }
        }
        PickerScene.WheelPickerDateTime -> {
            val days = List(15) { index ->
                val date = day(2026, 9, 4 + index - 7)
                val value = android.icu.text.SimpleDateFormat("yyyy-MM-dd", Locale.US).format(date)
                val label = if (index == 7) "Today" else android.icu.text.SimpleDateFormat("EEE, MMM d", Locale.US).format(date)
                value to label
            }
            var dayValue by remember { mutableStateOf<String?>("2026-10-04") }
            var hour by remember { mutableStateOf<String?>("19") }
            var minute by remember { mutableStateOf<String?>("30") }
            Framed {
                Column(modifier = Modifier.width(288.dp), verticalArrangement = Arrangement.spacedBy(12.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    WheelPicker(modifier = Modifier.fillMaxWidth()) {
                        WheelPickerColumn(
                            value = dayValue,
                            onValueChange = { dayValue = it },
                            modifier = Modifier.weight(1f),
                            label = "Day",
                            horizontalAlignment = Alignment.End,
                        ) {
                            days.forEach { (value, label) -> WheelPickerItem(value, label) }
                        }
                        WheelPickerColumn(value = hour, onValueChange = { hour = it }, label = "Hour") {
                            repeat(24) { WheelPickerItem(it.toString().padStart(2, '0'), it.toString().padStart(2, '0')) }
                        }
                        WheelPickerColumn(
                            value = minute,
                            onValueChange = { minute = it },
                            modifier = Modifier.weight(1f),
                            label = "Minute",
                            horizontalAlignment = Alignment.Start,
                        ) {
                            repeat(12) { WheelPickerItem((it * 5).toString().padStart(2, '0'), (it * 5).toString().padStart(2, '0')) }
                        }
                    }
                    Caption("$dayValue $hour:$minute")
                }
            }
        }
        PickerScene.Calendar -> SingleCalendar()
        PickerScene.CalendarRange -> {
            var range by remember { mutableStateOf<DateRange?>(DateRange(Today, day(2026, 9, 10))) }
            Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
                CalendarFrame {
                    Calendar(selected = range, onSelect = { range = it }, numberOfMonths = 2, today = Today, locale = Locale.US)
                }
            }
        }
        PickerScene.CalendarSizes -> Column(
            modifier = Modifier.verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            SingleCalendar(size = CalendarSize.Sm)
            SingleCalendar(size = CalendarSize.Lg)
        }
        PickerScene.CalendarOptions -> Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            SingleCalendar(showWeekNumber = true)
            SingleCalendar(weekendsDisabled = true)
        }
        PickerScene.CalendarDropdown -> {
            var date by remember { mutableStateOf<Date?>(day(2026, 9, 7)) }
            CalendarFrame {
                Calendar(
                    selected = date,
                    onSelect = { date = it },
                    today = Today,
                    locale = Locale.US,
                    captionLayout = CalendarCaptionLayout.Dropdown,
                    startMonth = day(2020, 0, 1),
                    endMonth = day(2030, 11, 1),
                )
            }
        }
        PickerScene.DatePickerTriggers -> Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            var empty by remember { mutableStateOf<Date?>(null) }
            var value by remember { mutableStateOf<Date?>(Today) }
            DatePicker(value = empty, onValueChange = { empty = it })
            DatePicker(value = value, onValueChange = { value = it }, locale = Locale.US)
            DatePicker(value = Today, onValueChange = {}, locale = Locale.forLanguageTag("tr-TR"), placeholder = "Tarih seç")
            DatePicker(value = null, onValueChange = {}, invalid = true)
            DatePicker(value = null, onValueChange = {}, enabled = false)
        }
        PickerScene.DatePicker -> {
            var value by remember { mutableStateOf<Date?>(Today) }
            DatePicker(value = value, onValueChange = { value = it }, locale = Locale.US, title = "Delivery date")
        }
        PickerScene.DatePickerLocale -> {
            var value by remember { mutableStateOf<Date?>(Today) }
            DatePicker(
                value = value,
                onValueChange = { value = it },
                locale = Locale.forLanguageTag("tr-TR"),
                placeholder = "Tarih seç",
                showCloseButton = true,
                closeLabel = "Bitti",
                floating = true,
            )
        }
        PickerScene.SegmentPicker -> Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            SegmentPickerSize.entries.forEach { size ->
                var period by remember { mutableStateOf<String?>("week") }
                SegmentPicker(value = period, onValueChange = { period = it }, size = size) {
                    SegmentPickerItem("day", "Day")
                    SegmentPickerItem("week", "Week")
                    SegmentPickerItem("month", "Month")
                    SegmentPickerItem("year", "Year")
                }
            }
            SegmentPicker(value = null, onValueChange = {}) {
                SegmentPickerItem("day", "Day")
            }
            SegmentPicker(value = "week", onValueChange = {}, enabled = false) {
                SegmentPickerItem("week", "Week")
            }
        }
        PickerScene.SegmentPickerOpen -> {
            var period by remember { mutableStateOf<String?>("week") }
            SegmentPicker(value = period, onValueChange = { period = it }) {
                SegmentPickerItem("day", "Day")
                SegmentPickerItem("week", "Week")
                SegmentPickerItem("month", "Month")
                SegmentPickerItem("year", "Year", enabled = false)
            }
        }
        PickerScene.Stepper -> Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            var quantity by remember { mutableDoubleStateOf(1.0) }
            Stepper(value = quantity, onValueChange = { quantity = it }, min = 0.0, max = 10.0) {
                StepperInput(contentDescription = "Quantity")
                StepperGroup {
                    StepperDecrement()
                    StepperSeparator()
                    StepperIncrement()
                }
            }
            var copies by remember { mutableDoubleStateOf(1.0) }
            var scale by remember { mutableDoubleStateOf(100.0) }
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, EsuissTheme.colors.separator, RoundedCornerShape(Radius.xl2)),
            ) {
                StepperRow("Copies", copies, { copies = it }, 1.0, 999.0)
                Separator()
                StepperRow("Scale", scale, { scale = it }, 25.0, 400.0, step = 5.0, format = DecimalFormat("0'%'"))
                Separator()
                StepperRow("Pages per sheet", 1.0, {}, 1.0, 16.0, enabled = false)
            }
            Caption("${copies.toInt()} ${if (copies == 1.0) "copy" else "copies"} at ${scale.toInt()}%")
        }
        PickerScene.SearchPicker -> Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            var empty by remember { mutableStateOf<String?>(null) }
            var value by remember { mutableStateOf<String?>("astro") }
            SearchPicker(Frameworks, empty, { empty = it }, Modifier.width(224.dp), placeholder = "Select a framework")
            SearchPicker(Frameworks, value, { value = it }, Modifier.width(224.dp), placeholder = "Select a framework")
            SearchPicker(Frameworks, null, {}, Modifier.width(224.dp), placeholder = "Select a framework", invalid = true)
            SearchPicker(Frameworks, null, {}, Modifier.width(224.dp), placeholder = "Select a framework", enabled = false)
        }
        PickerScene.SearchPickerOpen -> {
            var value by remember { mutableStateOf<String?>("ist") }
            SearchPicker(
                Cities,
                value,
                { value = it },
                Modifier.width(224.dp),
                placeholder = "Select a city",
                searchPlaceholder = "Search cities...",
                emptyText = "No city found.",
                title = "City",
                showCloseButton = true,
            )
        }
        PickerScene.SearchPickerEmpty -> {
            var value by remember { mutableStateOf<String?>(null) }
            SearchPicker(
                Frameworks,
                value,
                { value = it },
                Modifier.width(224.dp),
                placeholder = "Select a framework",
                searchPlaceholder = "Search frameworks...",
                emptyText = "No framework found.",
                showCloseButton = true,
                closeLabel = "Cancel",
            )
        }
    }
}

@RunWith(AndroidJUnit4::class)
class PickersGalleryTest {
    @get:Rule
    val compose = createComposeRule()

    @Test
    fun rendersPickersInBothSchemes() {
        var dark by mutableStateOf(false)
        var scene by mutableStateOf(PickerScene.WheelPicker)
        compose.mainClock.autoAdvance = false
        compose.setContent {
            EsuissTheme(darkTheme = dark) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(EsuissTheme.colors.surface)
                        .safeDrawingPadding()
                        .padding(16.dp),
                ) {
                    key(scene, dark) { Scene(scene) }
                }
            }
        }
        val instrumentation = InstrumentationRegistry.getInstrumentation()
        val context = instrumentation.targetContext
        for (current in PickerScene.entries) {
            for (scheme in listOf(false, true)) {
                scene = current
                dark = scheme
                settle()
                when (current) {
                    PickerScene.DatePicker -> compose.onNodeWithText("2026", substring = true).performClick()
                    PickerScene.DatePickerLocale -> compose.onNodeWithText("2026", substring = true).performClick()
                    PickerScene.SegmentPickerOpen -> compose.onNodeWithText("Week").performClick()
                    PickerScene.CalendarDropdown -> compose.onNodeWithContentDescription("Choose the Year").performClick()
                    PickerScene.SearchPickerOpen -> compose.onNodeWithText("Istanbul").performClick()
                    PickerScene.SearchPickerEmpty -> compose.onNodeWithText("Select a framework").performClick()
                    else -> Unit
                }
                settle()
                when (current) {
                    PickerScene.DatePicker, PickerScene.DatePickerLocale ->
                        compose.onNodeWithContentDescription("Year").assertExists()
                    PickerScene.SegmentPickerOpen -> compose.onNodeWithText("Month").assertExists()
                    PickerScene.SearchPickerOpen -> compose.onNodeWithText("Search cities...").assertExists()
                    PickerScene.SearchPickerEmpty -> {
                        compose.onNode(hasSetTextAction()).performTextInput("zzz")
                        settle()
                        compose.onNodeWithText("No framework found.").assertExists()
                    }
                    PickerScene.WheelPicker -> compose.onNodeWithContentDescription("Fruit").assertExists()
                    PickerScene.Calendar -> compose.onNodeWithText("October 2026").assertExists()
                    PickerScene.CalendarDropdown -> compose.onNodeWithText("2030").assertExists()
                    else -> Unit
                }
                if (current == PickerScene.SearchPickerOpen || current == PickerScene.SearchPickerEmpty) {
                    SystemClock.sleep(1000)
                    settle()
                }
                SystemClock.sleep(600)
                val bitmap = checkNotNull(instrumentation.uiAutomation.takeScreenshot())
                val name = "pickers-${current.name.lowercase()}-${if (scheme) "dark" else "light"}.png"
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
