package com.esuiss.catalog.stories.patterns

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Text
import com.esuiss.ui.patterns.DatePicker
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

val datePickerStories = StoryGroup(
    section = Section.Patterns,
    title = "Date Picker",
    stories = listOf(
        Story("Default") { DatePickerDemo() },
        Story("WithValue") { DatePickerDemo(initial = datePickerDate(2026, 9, 4)) },
        Story("Locale") {
            DatePickerDemo(
                initial = datePickerDate(2026, 9, 4),
                locale = Locale.forLanguageTag("tr-TR"),
                placeholder = "Tarih seç",
            )
        },
        Story("YearRange") {
            DatePickerDemo(
                initial = datePickerDate(1990, 5, 15),
                placeholder = "Date of birth",
                fromYear = 1940,
                toYear = 2010,
            )
        },
        Story("WithTitle") { DatePickerDemo(title = "Delivery date") },
        Story("WithCloseButton") { DatePickerDemo(showCloseButton = true) },
        Story("WithCloseLabel") { DatePickerDemo(showCloseButton = true, closeLabel = "Done") },
        Story("Disabled") { DatePickerDemo(enabled = false) },
        Story("Invalid") { DatePickerDemo(invalid = true) },
        Story("Controlled") { DatePickerControlled() },
        Story("Floating") { DatePickerDemo(floating = true) },
    ),
)

private fun datePickerDate(year: Int, month: Int, day: Int): Long =
    Calendar.getInstance().apply {
        clear()
        set(year, month, day)
    }.timeInMillis

@Composable
private fun DatePickerDemo(
    initial: Long? = null,
    locale: Locale = Locale.getDefault(),
    placeholder: String = "Pick a date",
    fromYear: Int = Calendar.getInstance().get(Calendar.YEAR) - 100,
    toYear: Int = Calendar.getInstance().get(Calendar.YEAR) + 10,
    title: String? = null,
    enabled: Boolean = true,
    invalid: Boolean? = null,
    floating: Boolean = false,
    showCloseButton: Boolean = false,
    closeLabel: String? = null,
) {
    var value by rememberSaveable { mutableStateOf(initial) }
    DatePicker(
        value = value?.let(::Date),
        onValueChange = { value = it.time },
        modifier = Modifier.width(240.dp).semantics { contentDescription = "Date" },
        placeholder = placeholder,
        locale = locale,
        fromYear = fromYear,
        toYear = toYear,
        title = title,
        enabled = enabled,
        invalid = invalid,
        floating = floating,
        showCloseButton = showCloseButton,
        closeLabel = closeLabel,
    )
}

@Composable
private fun DatePickerControlled() {
    var value by rememberSaveable { mutableStateOf<Long?>(datePickerDate(2026, 9, 4)) }
    val format = SimpleDateFormat("EEE MMM dd yyyy", Locale.US)
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        DatePicker(
            value = value?.let(::Date),
            onValueChange = { value = it.time },
            modifier = Modifier.width(240.dp).semantics { contentDescription = "Date" },
        )
        Text(
            "Selected: ${value?.let { format.format(Date(it)) } ?: "none"}",
            style = Typography.sm.copy(color = EsuissTheme.colors.labelSecondary),
        )
    }
}
