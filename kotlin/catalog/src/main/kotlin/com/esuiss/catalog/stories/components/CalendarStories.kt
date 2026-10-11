package com.esuiss.catalog.stories.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Calendar
import com.esuiss.ui.components.CalendarCaptionLayout
import com.esuiss.ui.components.CalendarSize
import com.esuiss.ui.components.DateRange
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import java.util.Date
import java.util.GregorianCalendar
import java.util.Locale

val calendarStories = StoryGroup(
    section = Section.Components,
    title = "Calendar",
    stories = listOf(
        Story("Default") { CalendarSingle() },
        Story("Sizes") { CalendarSizes() },
        Story("Range") { CalendarRange() },
        Story("Multiple") { CalendarMultiple() },
        Story("DropdownCaption") { CalendarSingle(captionLayout = CalendarCaptionLayout.Dropdown) },
        Story("WeekNumbers") { CalendarSingle(showWeekNumber = true) },
        Story("DisabledDays") { CalendarSingle(weekendsDisabled = true) },
        Story("OutsideDays") { CalendarSingle(showOutsideDays = true) },
        Story("ButtonVariants") { CalendarButtonVariants() },
        Story("Locale") { CalendarSingle(locale = Locale.forLanguageTag("tr-TR")) },
    ),
)

private fun calendarDay(offsetDays: Int = 0, dayOfMonth: Int? = null): Date {
    val now = GregorianCalendar()
    val result = GregorianCalendar(now.get(GregorianCalendar.YEAR), now.get(GregorianCalendar.MONTH), now.get(GregorianCalendar.DAY_OF_MONTH))
    if (dayOfMonth != null) result.set(GregorianCalendar.DAY_OF_MONTH, dayOfMonth)
    result.add(GregorianCalendar.DAY_OF_MONTH, offsetDays)
    return result.time
}

private fun calendarIsWeekend(date: Date): Boolean {
    val day = GregorianCalendar().apply { time = date }.get(GregorianCalendar.DAY_OF_WEEK)
    return day == GregorianCalendar.SATURDAY || day == GregorianCalendar.SUNDAY
}

@Composable
private fun CalendarFrame(content: @Composable () -> Unit) {
    Box(
        Modifier
            .border(1.dp, EsuissTheme.colors.separator, RoundedCornerShape(Radius.xl2))
            .padding(1.dp),
    ) {
        content()
    }
}

@Composable
private fun CalendarSingle(
    size: CalendarSize = CalendarSize.Default,
    captionLayout: CalendarCaptionLayout = CalendarCaptionLayout.Label,
    showWeekNumber: Boolean = false,
    showOutsideDays: Boolean = false,
    weekendsDisabled: Boolean = false,
    buttonVariant: ButtonVariant = ButtonVariant.Plain,
    locale: Locale = Locale.getDefault(),
    key: String = "",
) {
    var date by rememberSaveable(key) { mutableStateOf<Date?>(calendarDay(offsetDays = 3)) }
    CalendarFrame {
        Calendar(
            selected = date,
            onSelect = { date = it },
            size = size,
            captionLayout = captionLayout,
            showWeekNumber = showWeekNumber,
            showOutsideDays = showOutsideDays,
            disabled = { weekendsDisabled && calendarIsWeekend(it) },
            buttonVariant = buttonVariant,
            locale = locale,
        )
    }
}

@Composable
private fun CalendarSizes() {
    Column(verticalArrangement = Arrangement.spacedBy(24.dp)) {
        CalendarSingle(size = CalendarSize.Sm, key = "sm")
        CalendarSingle(size = CalendarSize.Default, key = "default")
        CalendarSingle(size = CalendarSize.Lg, key = "lg")
    }
}

@Composable
private fun CalendarRange() {
    var from by rememberSaveable { mutableStateOf<Date?>(calendarDay()) }
    var to by rememberSaveable { mutableStateOf<Date?>(calendarDay(offsetDays = 6)) }
    CalendarFrame {
        Calendar(
            selected = if (from == null) null else DateRange(from, to),
            onSelect = { range: DateRange? ->
                from = range?.from
                to = range?.to
            },
            numberOfMonths = 2,
        )
    }
}

@Composable
private fun CalendarMultiple() {
    var dates by rememberSaveable {
        mutableStateOf(listOf(calendarDay(dayOfMonth = 8), calendarDay(dayOfMonth = 15), calendarDay(dayOfMonth = 22)))
    }
    CalendarFrame {
        Calendar(selected = dates, onSelect = { value: List<Date> -> dates = value })
    }
}

@Composable
private fun CalendarButtonVariants() {
    Column(verticalArrangement = Arrangement.spacedBy(24.dp)) {
        CalendarSingle(buttonVariant = ButtonVariant.Ghost, key = "ghost")
        CalendarSingle(buttonVariant = ButtonVariant.Secondary, key = "secondary")
        CalendarSingle(buttonVariant = ButtonVariant.Tinted, key = "tinted")
    }
}
