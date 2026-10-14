package com.esuiss.catalog.stories.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.WheelPicker
import com.esuiss.ui.components.WheelPickerColumn
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Shadows
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

val wheelPickerStories = StoryGroup(
    section = Section.Components,
    title = "Wheel Picker",
    stories = listOf(
        Story("Default") { WheelPickerFrame { WheelPickerFruits() } },
        Story("DisabledItems") { WheelPickerFrame { WheelPickerDisabledItems() } },
        Story("DateTime") { WheelPickerFrame { WheelPickerDateTime() } },
    ),
)

private val wheelPickerFruits = listOf(
    "Apple",
    "Banana",
    "Cherry",
    "Grape",
    "Lemon",
    "Mango",
    "Orange",
    "Peach",
    "Pear",
    "Plum",
)

private val wheelPickerSlots = List(11) { index ->
    val minutes = 18 * 60 + index * 30
    "${minutes / 60}:${(minutes % 60).toString().padStart(2, '0')}"
}

private val wheelPickerBooked = setOf("19:30", "20:00", "20:30")

private class WheelPickerDay(val value: String, val label: String)

private val wheelPickerDays: List<WheelPickerDay> = run {
    val format = SimpleDateFormat("EEE, MMM d", Locale.US)
    val key = SimpleDateFormat("yyyy-MM-dd", Locale.US)
    List(15) { index ->
        val calendar = Calendar.getInstance(Locale.US)
        calendar.clear()
        calendar.set(2026, Calendar.OCTOBER, 4 + index - 7)
        WheelPickerDay(key.format(calendar.time), if (index == 7) "Today" else format.format(calendar.time))
    }
}

private val wheelPickerHours = List(24) { it.toString().padStart(2, '0') }

private val wheelPickerMinutes = List(12) { (it * 5).toString().padStart(2, '0') }

@Composable
private fun WheelPickerFrame(content: @Composable () -> Unit) {
    val colors = EsuissTheme.colors
    val shape = RoundedCornerShape(Radius.xl2)
    Box(
        Modifier
            .width(320.dp)
            .shadow(Shadows.md, shape)
            .background(colors.surfaceRaised, shape)
            .border(1.dp, colors.label.copy(alpha = if (colors.isDark) 0.1f else 0.05f), shape)
            .padding(16.dp),
    ) {
        content()
    }
}

@Composable
private fun WheelPickerFruits() {
    var value by rememberSaveable { mutableStateOf("Lemon") }
    WheelPicker(Modifier.fillMaxWidth()) {
        WheelPickerColumn(value, { value = it }, label = "Fruit") {
            wheelPickerFruits.forEach { WheelPickerItem(it, it) }
        }
    }
}

@Composable
private fun WheelPickerDisabledItems() {
    var value by rememberSaveable { mutableStateOf("19:00") }
    WheelPicker(Modifier.fillMaxWidth()) {
        WheelPickerColumn(value, { value = it }, label = "Reservation time") {
            wheelPickerSlots.forEach { WheelPickerItem(it, it, enabled = it !in wheelPickerBooked) }
        }
    }
}

@Composable
private fun WheelPickerDateTime() {
    var day by rememberSaveable { mutableStateOf(wheelPickerDays[7].value) }
    var hour by rememberSaveable { mutableStateOf("19") }
    var minute by rememberSaveable { mutableStateOf("30") }
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        WheelPicker(Modifier.fillMaxWidth()) {
            WheelPickerColumn(
                day,
                { day = it },
                Modifier.weight(1.6f),
                label = "Day",
                horizontalAlignment = Alignment.End,
            ) {
                wheelPickerDays.forEach { WheelPickerItem(it.value, it.label) }
            }
            WheelPickerColumn(hour, { hour = it }, label = "Hour") {
                wheelPickerHours.forEach { WheelPickerItem(it, it) }
            }
            WheelPickerColumn(
                minute,
                { minute = it },
                Modifier.weight(1f),
                label = "Minute",
                horizontalAlignment = Alignment.Start,
            ) {
                wheelPickerMinutes.forEach { WheelPickerItem(it, it) }
            }
        }
        Text(
            "$day $hour:$minute",
            modifier = Modifier.fillMaxWidth(),
            style = Typography.sm.copy(fontFeatureSettings = "tnum"),
            color = EsuissTheme.colors.labelSecondary,
            textAlign = TextAlign.Center,
        )
    }
}
