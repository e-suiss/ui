package com.esuiss.ui.components

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.CaretDown
import com.adamglin.phosphoricons.regular.CaretLeft
import com.adamglin.phosphoricons.regular.CaretRight
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography
import java.util.Calendar as JavaCalendar
import java.util.Date
import java.util.Locale

enum class CalendarSize(internal val cell: Dp, internal val padding: Dp) {
    Sm(24.dp, 8.dp),
    Default(32.dp, 12.dp),
    Lg(40.dp, 16.dp),
}

enum class CalendarCaptionLayout { Label, Dropdown, DropdownMonths, DropdownYears }

@Immutable
data class DateRange(val from: Date?, val to: Date? = null)

@Immutable
data class CalendarDayState(
    val selected: Boolean = false,
    val today: Boolean = false,
    val rangeStart: Boolean = false,
    val rangeMiddle: Boolean = false,
    val rangeEnd: Boolean = false,
    val outside: Boolean = false,
    val disabled: Boolean = false,
)

typealias CalendarDayButtonSlot = @Composable (date: Date, state: CalendarDayState, onClick: () -> Unit) -> Unit

@Composable
fun Calendar(
    selected: Date?,
    onSelect: (Date?) -> Unit,
    modifier: Modifier = Modifier,
    defaultMonth: Date? = null,
    numberOfMonths: Int = 1,
    startMonth: Date? = null,
    endMonth: Date? = null,
    showOutsideDays: Boolean = false,
    showWeekNumber: Boolean = false,
    weekStartsOn: Int? = null,
    disabled: (Date) -> Boolean = { false },
    today: Date = remember { Date() },
    locale: Locale = Locale.getDefault(),
    buttonVariant: ButtonVariant = ButtonVariant.Plain,
    size: CalendarSize = CalendarSize.Default,
    captionLayout: CalendarCaptionLayout = CalendarCaptionLayout.Label,
    dayButton: CalendarDayButtonSlot? = null,
) {
    val selectedKey = selected?.let(::dayKey)
    CalendarGrid(
        modifier = modifier,
        initialMonth = defaultMonth ?: selected ?: today,
        numberOfMonths = numberOfMonths,
        startMonth = startMonth,
        endMonth = endMonth,
        showOutsideDays = showOutsideDays,
        showWeekNumber = showWeekNumber,
        weekStartsOn = weekStartsOn,
        disabled = disabled,
        today = today,
        locale = locale,
        buttonVariant = buttonVariant,
        size = size,
        captionLayout = captionLayout,
        dayButton = dayButton,
        selection = { key -> if (key == selectedKey) DaySelection.Single else DaySelection.None },
        onDayClick = { date -> onSelect(if (dayKey(date) == selectedKey) null else date) },
    )
}

@Composable
fun Calendar(
    selected: DateRange?,
    onSelect: (DateRange?) -> Unit,
    modifier: Modifier = Modifier,
    defaultMonth: Date? = null,
    numberOfMonths: Int = 1,
    startMonth: Date? = null,
    endMonth: Date? = null,
    showOutsideDays: Boolean = false,
    showWeekNumber: Boolean = false,
    weekStartsOn: Int? = null,
    disabled: (Date) -> Boolean = { false },
    today: Date = remember { Date() },
    locale: Locale = Locale.getDefault(),
    buttonVariant: ButtonVariant = ButtonVariant.Plain,
    size: CalendarSize = CalendarSize.Default,
    captionLayout: CalendarCaptionLayout = CalendarCaptionLayout.Label,
    dayButton: CalendarDayButtonSlot? = null,
) {
    val from = selected?.from?.let(::dayKey)
    val to = selected?.to?.let(::dayKey)
    CalendarGrid(
        modifier = modifier,
        initialMonth = defaultMonth ?: selected?.from ?: today,
        numberOfMonths = numberOfMonths,
        startMonth = startMonth,
        endMonth = endMonth,
        showOutsideDays = showOutsideDays,
        showWeekNumber = showWeekNumber,
        weekStartsOn = weekStartsOn,
        disabled = disabled,
        today = today,
        locale = locale,
        buttonVariant = buttonVariant,
        size = size,
        captionLayout = captionLayout,
        dayButton = dayButton,
        selection = { key ->
            when {
                from == null -> DaySelection.None
                to == null -> if (key == from) DaySelection.RangeBoth else DaySelection.None
                key == from && key == to -> DaySelection.RangeBoth
                key == from -> DaySelection.RangeStart
                key == to -> DaySelection.RangeEnd
                key in from..to -> DaySelection.RangeMiddle
                else -> DaySelection.None
            }
        },
        onDayClick = { date -> onSelect(addToRange(date, selected)) },
    )
}

@Composable
fun Calendar(
    selected: List<Date>,
    onSelect: (List<Date>) -> Unit,
    modifier: Modifier = Modifier,
    defaultMonth: Date? = null,
    numberOfMonths: Int = 1,
    startMonth: Date? = null,
    endMonth: Date? = null,
    showOutsideDays: Boolean = false,
    showWeekNumber: Boolean = false,
    weekStartsOn: Int? = null,
    disabled: (Date) -> Boolean = { false },
    today: Date = remember { Date() },
    locale: Locale = Locale.getDefault(),
    buttonVariant: ButtonVariant = ButtonVariant.Plain,
    size: CalendarSize = CalendarSize.Default,
    captionLayout: CalendarCaptionLayout = CalendarCaptionLayout.Label,
    dayButton: CalendarDayButtonSlot? = null,
) {
    val keys = selected.map(::dayKey).toSet()
    CalendarGrid(
        modifier = modifier,
        initialMonth = defaultMonth ?: selected.firstOrNull() ?: today,
        numberOfMonths = numberOfMonths,
        startMonth = startMonth,
        endMonth = endMonth,
        showOutsideDays = showOutsideDays,
        showWeekNumber = showWeekNumber,
        weekStartsOn = weekStartsOn,
        disabled = disabled,
        today = today,
        locale = locale,
        buttonVariant = buttonVariant,
        size = size,
        captionLayout = captionLayout,
        dayButton = dayButton,
        selection = { key -> if (key in keys) DaySelection.Single else DaySelection.None },
        onDayClick = { date ->
            val key = dayKey(date)
            onSelect(if (key in keys) selected.filter { dayKey(it) != key } else selected + date)
        },
    )
}

@Composable
fun CalendarDayButton(
    date: Date,
    state: CalendarDayState,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    size: CalendarSize = CalendarSize.Default,
    locale: Locale = Locale.getDefault(),
) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val range = state.rangeStart || state.rangeEnd
    val single = state.selected && !range && !state.rangeMiddle
    val background = when {
        range -> colors.primary
        single && state.today -> colors.primary
        single -> colors.primary.copy(alpha = if (colors.isDark) 0.2f else 0.1f)
        else -> Color.Transparent
    }
    val foreground = when {
        range -> colors.primaryForeground
        single && state.today -> colors.primaryForeground
        state.rangeMiddle -> colors.foreground
        single -> colors.primary
        state.outside -> colors.mutedForeground
        state.today -> colors.primary
        else -> colors.foreground
    }
    val bold = state.today || single
    val style = dayTextStyle(size).copy(
        color = foreground,
        fontWeight = if (bold) FontWeight.SemiBold else FontWeight.Normal,
        fontFeatureSettings = "tnum",
    )
    val description = remember(date, locale, state.today) {
        val full = android.icu.text.DateFormat.getDateInstance(android.icu.text.DateFormat.FULL, locale).format(date)
        if (state.today) "${todayLabel(locale)}, $full" else full
    }
    val number = remember(date) { JavaCalendar.getInstance().apply { time = date }.get(JavaCalendar.DAY_OF_MONTH) }
    Box(
        modifier = modifier
            .fillMaxSize()
            .alpha(
                when {
                    state.disabled -> 0.5f
                    pressed -> 0.8f
                    else -> 1f
                },
            )
            .clip(CircleShape)
            .background(background, CircleShape)
            .clickable(
                interactionSource = interaction,
                indication = null,
                enabled = !state.disabled,
                role = Role.Button,
                onClick = onClick,
            )
            .semantics {
                contentDescription = description
                selected = state.selected || state.rangeStart || state.rangeEnd || state.rangeMiddle
            },
        contentAlignment = Alignment.Center,
    ) {
        BasicText(number.toString(), style = style, maxLines = 1)
    }
}

private enum class DaySelection { None, Single, RangeStart, RangeMiddle, RangeEnd, RangeBoth }

private fun dayTextStyle(size: CalendarSize): TextStyle = when (size) {
    CalendarSize.Sm -> Typography.xs
    CalendarSize.Default -> Typography.sm
    CalendarSize.Lg -> Typography.lg
}

private fun captionStyle(size: CalendarSize): TextStyle = when (size) {
    CalendarSize.Sm -> Typography.xs
    CalendarSize.Default -> Typography.sm
    CalendarSize.Lg -> Typography.base
}

private fun todayLabel(locale: Locale): String =
    android.icu.text.RelativeDateTimeFormatter.getInstance(locale).format(
        android.icu.text.RelativeDateTimeFormatter.Direction.THIS,
        android.icu.text.RelativeDateTimeFormatter.AbsoluteUnit.DAY,
    ).replaceFirstChar { it.titlecase(locale) }

private fun dayKey(date: Date): Int {
    val calendar = JavaCalendar.getInstance().apply { time = date }
    return calendar.get(JavaCalendar.YEAR) * 10000 + calendar.get(JavaCalendar.MONTH) * 100 + calendar.get(JavaCalendar.DAY_OF_MONTH)
}

private fun monthIndex(date: Date): Int {
    val calendar = JavaCalendar.getInstance().apply { time = date }
    return calendar.get(JavaCalendar.YEAR) * 12 + calendar.get(JavaCalendar.MONTH)
}

private fun dateOf(year: Int, month: Int, day: Int): Date =
    JavaCalendar.getInstance().apply {
        clear()
        set(year, month, day)
    }.time

private fun addToRange(date: Date, range: DateRange?): DateRange? {
    val key = dayKey(date)
    val from = range?.from
    val to = range?.to
    return when {
        from == null -> DateRange(date, null)
        to == null -> when {
            key == dayKey(from) -> DateRange(from, from)
            key < dayKey(from) -> DateRange(date, from)
            else -> DateRange(from, date)
        }
        key == dayKey(from) && key == dayKey(to) -> null
        key == dayKey(from) || key == dayKey(to) -> DateRange(date, null)
        key < dayKey(from) -> DateRange(date, to)
        else -> DateRange(from, date)
    }
}

@Composable
private fun CalendarGrid(
    modifier: Modifier,
    initialMonth: Date,
    numberOfMonths: Int,
    startMonth: Date?,
    endMonth: Date?,
    showOutsideDays: Boolean,
    showWeekNumber: Boolean,
    weekStartsOn: Int?,
    disabled: (Date) -> Boolean,
    today: Date,
    locale: Locale,
    buttonVariant: ButtonVariant,
    size: CalendarSize,
    captionLayout: CalendarCaptionLayout,
    dayButton: CalendarDayButtonSlot?,
    selection: (Int) -> DaySelection,
    onDayClick: (Date) -> Unit,
) {
    val colors = EsuissTheme.colors
    val first = startMonth?.let(::monthIndex)
    val last = endMonth?.let(::monthIndex)?.minus(numberOfMonths - 1)
    var month by remember { mutableIntStateOf(monthIndex(initialMonth)) }
    val canPrevious = first == null || month > first
    val canNext = last == null || month < last
    val currentMonth by rememberUpdatedState(month)
    val currentCanPrevious by rememberUpdatedState(canPrevious)
    val currentCanNext by rememberUpdatedState(canNext)
    val rtl = LocalLayoutDirection.current == LayoutDirection.Rtl
    val weekStart = weekStartsOn ?: (JavaCalendar.getInstance(locale).firstDayOfWeek - 1)
    val todayKey = dayKey(today)
    var direction by remember { mutableIntStateOf(1) }
    val go: (Int) -> Unit = { step ->
        direction = step
        month = currentMonth + step
    }

    Column(
        modifier = modifier
            .width(IntrinsicSize.Max)
            .background(colors.background)
            .padding(size.padding)
            .pointerInput(rtl) {
                var total = 0f
                detectHorizontalDragGestures(
                    onDragStart = { total = 0f },
                    onDragEnd = {
                        val threshold = 48.dp.toPx()
                        val forward = if (rtl) total > threshold else total < -threshold
                        val back = if (rtl) total < -threshold else total > threshold
                        if (forward && currentCanNext) go(1)
                        if (back && currentCanPrevious) go(-1)
                    },
                ) { change, amount ->
                    change.consume()
                    total += amount
                }
            },
    ) {
        AnimatedContent(
            targetState = month,
            transitionSpec = {
                val sign = if (direction >= 0) 1 else -1
                (slideInHorizontally(tween(250)) { it / 3 * sign } + fadeIn(tween(250))) togetherWith
                    (slideOutHorizontally(tween(250)) { -it / 3 * sign } + fadeOut(tween(150)))
            },
            label = "calendar-month",
        ) { shown ->
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                repeat(numberOfMonths) { offset ->
                    CalendarMonth(
                        monthIndex = shown + offset,
                        showNav = offset == 0,
                        canPrevious = canPrevious,
                        canNext = canNext,
                        onPrevious = { go(-1) },
                        onNext = { go(1) },
                        onMonthSelect = { target -> go(target - offset - currentMonth) },
                        captionLayout = captionLayout,
                        firstMonth = first,
                        lastMonth = endMonth?.let(::monthIndex),
                        showOutsideDays = showOutsideDays,
                        showWeekNumber = showWeekNumber,
                        weekStart = weekStart,
                        disabled = disabled,
                        todayKey = todayKey,
                        locale = locale,
                        buttonVariant = buttonVariant,
                        size = size,
                        dayButton = dayButton,
                        selection = selection,
                        onDayClick = onDayClick,
                    )
                }
            }
        }
    }
}

@Composable
private fun CalendarMonth(
    monthIndex: Int,
    showNav: Boolean,
    canPrevious: Boolean,
    canNext: Boolean,
    onPrevious: () -> Unit,
    onNext: () -> Unit,
    onMonthSelect: (Int) -> Unit,
    captionLayout: CalendarCaptionLayout,
    firstMonth: Int?,
    lastMonth: Int?,
    showOutsideDays: Boolean,
    showWeekNumber: Boolean,
    weekStart: Int,
    disabled: (Date) -> Boolean,
    todayKey: Int,
    locale: Locale,
    buttonVariant: ButtonVariant,
    size: CalendarSize,
    dayButton: CalendarDayButtonSlot?,
    selection: (Int) -> DaySelection,
    onDayClick: (Date) -> Unit,
) {
    val colors = EsuissTheme.colors
    val year = Math.floorDiv(monthIndex, 12)
    val month = Math.floorMod(monthIndex, 12)
    val firstDay = dateOf(year, month, 1)
    val caption = remember(monthIndex, locale) {
        android.icu.text.DateFormat.getInstanceForSkeleton("yMMMM", locale).format(firstDay)
    }
    val calendar = JavaCalendar.getInstance().apply { time = firstDay }
    val daysInMonth = calendar.getActualMaximum(JavaCalendar.DAY_OF_MONTH)
    val leading = Math.floorMod(calendar.get(JavaCalendar.DAY_OF_WEEK) - 1 - weekStart, 7)
    val rows = (leading + daysInMonth + 6) / 7
    val weekdayFormat = remember(locale) { android.icu.text.SimpleDateFormat("EEEEEE", locale) }
    val weekdayFull = remember(locale) { android.icu.text.SimpleDateFormat("EEEE", locale) }
    val weekdayStyle = when (size) {
        CalendarSize.Lg -> Typography.xs
        else -> Typography.xs
    }.copy(color = colors.mutedForeground, fontWeight = FontWeight.SemiBold)
    val cell = size.cell

    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Box(modifier = Modifier.fillMaxWidth().height(cell)) {
            CalendarCaption(
                caption = caption,
                monthIndex = monthIndex,
                captionLayout = captionLayout,
                firstMonth = firstMonth,
                lastMonth = lastMonth,
                locale = locale,
                size = size,
                onMonthSelect = onMonthSelect,
                modifier = Modifier
                    .align(Alignment.CenterStart)
                    .padding(start = if (captionLayout == CalendarCaptionLayout.Label) 6.dp else 0.dp, end = cell * 2),
            )
            if (showNav) {
                Row(
                    modifier = Modifier.align(Alignment.CenterEnd),
                    horizontalArrangement = Arrangement.spacedBy(2.dp),
                ) {
                    CalendarNavButton(PhosphorIcons.Regular.CaretLeft, "Go to the Previous Month", canPrevious, buttonVariant, cell, onPrevious)
                    CalendarNavButton(PhosphorIcons.Regular.CaretRight, "Go to the Next Month", canNext, buttonVariant, cell, onNext)
                }
            }
        }
        Column {
            Row(modifier = Modifier.fillMaxWidth()) {
                if (showWeekNumber) Box(Modifier.width(cell))
                repeat(7) { column ->
                    val weekday = dateOf(2000, 0, 2 + Math.floorMod(weekStart + column, 7))
                    val short = weekdayFormat.format(weekday)
                    BasicText(
                        if (size == CalendarSize.Sm) short else short.uppercase(locale),
                        modifier = Modifier
                            .weight(1f)
                            .widthIn(min = cell)
                            .clearAndSetSemantics { contentDescription = weekdayFull.format(weekday) },
                        style = weekdayStyle.copy(textAlign = TextAlign.Center),
                        maxLines = 1,
                    )
                }
            }
            repeat(rows) { row ->
                Row(modifier = Modifier.fillMaxWidth().padding(top = 8.dp)) {
                    if (showWeekNumber) {
                        val rowStart = dateOf(year, month, 1 - leading + row * 7)
                        val week = JavaCalendar.getInstance(locale).apply {
                            firstDayOfWeek = weekStart + 1
                            time = rowStart
                        }.get(JavaCalendar.WEEK_OF_YEAR)
                        Box(Modifier.size(cell), contentAlignment = Alignment.Center) {
                            BasicText(week.toString(), style = Typography.xs.copy(color = colors.mutedForeground))
                        }
                    }
                    repeat(7) { column ->
                        val dayNumber = row * 7 + column - leading + 1
                        val date = dateOf(year, month, dayNumber)
                        val outside = dayNumber < 1 || dayNumber > daysInMonth
                        DayCell(
                            date = date,
                            column = column,
                            visible = !outside || showOutsideDays,
                            outside = outside,
                            disabled = disabled(date),
                            todayKey = todayKey,
                            cell = cell,
                            size = size,
                            locale = locale,
                            dayButton = dayButton,
                            selection = if (outside) DaySelection.None else selection(dayKey(date)),
                            onClick = { onDayClick(date) },
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun CalendarCaption(
    caption: String,
    monthIndex: Int,
    captionLayout: CalendarCaptionLayout,
    firstMonth: Int?,
    lastMonth: Int?,
    locale: Locale,
    size: CalendarSize,
    onMonthSelect: (Int) -> Unit,
    modifier: Modifier,
) {
    val colors = EsuissTheme.colors
    val style = captionStyle(size).copy(color = colors.foreground, fontWeight = FontWeight.SemiBold)
    val semantics = Modifier.semantics {
        heading()
        liveRegion = LiveRegionMode.Polite
    }
    if (captionLayout == CalendarCaptionLayout.Label) {
        BasicText(caption, modifier = modifier.then(semantics), style = style, maxLines = 1, softWrap = false)
        return
    }
    val year = Math.floorDiv(monthIndex, 12)
    val month = Math.floorMod(monthIndex, 12)
    val firstYear = firstMonth?.let { Math.floorDiv(it, 12) } ?: year
    val lastYear = lastMonth?.let { Math.floorDiv(it, 12) } ?: year
    val shortMonth = remember(locale) { android.icu.text.SimpleDateFormat("LLL", locale) }
    val longMonth = remember(locale) { android.icu.text.SimpleDateFormat("LLLL", locale) }
    val outOfRange = { target: Int -> (firstMonth != null && target < firstMonth) || (lastMonth != null && target > lastMonth) }
    Row(
        modifier = modifier.then(semantics),
        horizontalArrangement = Arrangement.spacedBy(6.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (captionLayout == CalendarCaptionLayout.DropdownYears) {
            BasicText(longMonth.format(dateOf(year, month, 1)), style = style, maxLines = 1, softWrap = false)
        } else {
            CalendarDropdown(
                label = "Choose the Month",
                text = shortMonth.format(dateOf(year, month, 1)),
                value = month.toString(),
                options = List(12) { index ->
                    Triple(index.toString(), shortMonth.format(dateOf(year, index, 1)), !outOfRange(year * 12 + index))
                },
                style = style,
                onChange = { onMonthSelect(year * 12 + it.toInt()) },
            )
        }
        if (captionLayout == CalendarCaptionLayout.DropdownMonths) {
            BasicText(year.toString(), style = style, maxLines = 1, softWrap = false)
        } else {
            CalendarDropdown(
                label = "Choose the Year",
                text = year.toString(),
                value = year.toString(),
                options = (firstYear..maxOf(firstYear, lastYear)).map { Triple(it.toString(), it.toString(), true) },
                style = style,
                onChange = { onMonthSelect(it.toInt() * 12 + month) },
            )
        }
    }
}

@Composable
private fun CalendarDropdown(
    label: String,
    text: String,
    value: String,
    options: List<Triple<String, String, Boolean>>,
    style: TextStyle,
    onChange: (String) -> Unit,
) {
    val colors = EsuissTheme.colors
    var expanded by remember { mutableStateOf(false) }
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    DropdownMenu(
        expanded = expanded,
        onExpandedChange = { expanded = it },
        trigger = {
            Row(
                modifier = Modifier
                    .clip(CircleShape)
                    .alpha(if (pressed) 0.8f else 1f)
                    .clickable(
                        interactionSource = interaction,
                        indication = null,
                        role = Role.DropdownList,
                        onClick = { expanded = !expanded },
                    )
                    .semantics { contentDescription = label }
                    .padding(horizontal = 6.dp, vertical = 2.dp),
                horizontalArrangement = Arrangement.spacedBy(4.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                BasicText(text, style = style, maxLines = 1, softWrap = false)
                Icon(PhosphorIcons.Regular.CaretDown, contentDescription = null, size = 14.dp, tint = colors.mutedForeground)
            }
        },
    ) {
        DropdownMenuRadioGroup(
            value = value,
            onValueChange = {
                expanded = false
                if (it != value) onChange(it)
            },
        ) {
            options.forEach { (option, optionLabel, enabled) ->
                DropdownMenuRadioItem(option, optionLabel, enabled = enabled)
            }
        }
    }
}

@Composable
private fun RowScope.DayCell(
    date: Date,
    column: Int,
    visible: Boolean,
    outside: Boolean,
    disabled: Boolean,
    todayKey: Int,
    cell: Dp,
    size: CalendarSize,
    locale: Locale,
    dayButton: CalendarDayButtonSlot?,
    selection: DaySelection,
    onClick: () -> Unit,
) {
    val colors = EsuissTheme.colors
    Box(
        modifier = Modifier
            .weight(1f)
            .widthIn(min = cell)
            .aspectRatio(1f),
    ) {
        if (!visible) return@Box
        val inRange = selection == DaySelection.RangeStart || selection == DaySelection.RangeMiddle || selection == DaySelection.RangeEnd
        if (inRange) {
            val roundStart = selection == DaySelection.RangeStart || column == 0
            val roundEnd = selection == DaySelection.RangeEnd || column == 6
            val radius = cell
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        colors.muted,
                        RoundedCornerShape(
                            topStart = if (roundStart) radius else 0.dp,
                            bottomStart = if (roundStart) radius else 0.dp,
                            topEnd = if (roundEnd) radius else 0.dp,
                            bottomEnd = if (roundEnd) radius else 0.dp,
                        ),
                    ),
            )
        }
        val state = CalendarDayState(
            selected = selection != DaySelection.None,
            today = dayKey(date) == todayKey,
            rangeStart = selection == DaySelection.RangeStart || selection == DaySelection.RangeBoth,
            rangeMiddle = selection == DaySelection.RangeMiddle,
            rangeEnd = selection == DaySelection.RangeEnd || selection == DaySelection.RangeBoth,
            outside = outside,
            disabled = disabled,
        )
        if (dayButton != null) {
            dayButton(date, state, onClick)
        } else {
            CalendarDayButton(date, state, onClick, size = size, locale = locale)
        }
    }
}

@Composable
private fun CalendarNavButton(
    icon: ImageVector,
    label: String,
    enabled: Boolean,
    variant: ButtonVariant,
    cell: Dp,
    onClick: () -> Unit,
) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val background = when (variant) {
        ButtonVariant.Secondary -> colors.secondary
        ButtonVariant.Tinted -> colors.primary.copy(alpha = if (colors.isDark) 0.2f else 0.1f)
        ButtonVariant.Default -> colors.primary
        else -> Color.Transparent
    }
    val foreground = when {
        variant == ButtonVariant.Default -> colors.primaryForeground
        variant == ButtonVariant.Ghost || variant == ButtonVariant.Secondary || variant == ButtonVariant.Outline -> colors.foreground
        else -> colors.primary
    }
    val rtl = LocalLayoutDirection.current == LayoutDirection.Rtl
    Box(
        modifier = Modifier
            .size(cell)
            .alpha(
                when {
                    !enabled -> 0.5f
                    pressed -> 0.8f
                    else -> 1f
                },
            )
            .clip(CircleShape)
            .background(background, CircleShape)
            .clickable(
                interactionSource = interaction,
                indication = null,
                enabled = enabled,
                role = Role.Button,
                onClick = onClick,
            )
            .semantics { contentDescription = label },
        contentAlignment = Alignment.Center,
    ) {
        Icon(
            icon,
            contentDescription = null,
            size = 16.dp,
            tint = foreground,
            modifier = if (rtl) Modifier.graphicsLayer { scaleX = -1f } else Modifier,
        )
    }
}
