package com.esuiss.ui.patterns

import androidx.compose.foundation.border
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.error
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.CalendarBlank
import com.esuiss.ui.components.Drawer
import com.esuiss.ui.components.DrawerHeader
import com.esuiss.ui.components.DrawerTitle
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.LocalFieldState
import com.esuiss.ui.components.RegisterPaneTitle
import com.esuiss.ui.components.WheelPicker
import com.esuiss.ui.components.WheelPickerColumn
import com.esuiss.ui.components.controlBackground
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import java.util.Calendar
import java.util.Date
import java.util.Locale

private enum class DatePart { Day, Month, Year }

@Composable
fun DatePicker(
    value: Date?,
    onValueChange: (Date) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "Pick a date",
    locale: Locale = Locale.getDefault(),
    fromYear: Int = Calendar.getInstance().get(Calendar.YEAR) - 100,
    toYear: Int = Calendar.getInstance().get(Calendar.YEAR) + 10,
    title: String? = null,
    enabled: Boolean = true,
    invalid: Boolean? = null,
    floating: Boolean = false,
    showCloseButton: Boolean = false,
    closeLabel: String? = null,
) {
    var open by remember { mutableStateOf(false) }
    val label = value?.let {
        android.icu.text.DateFormat.getDateInstance(android.icu.text.DateFormat.MEDIUM, locale).format(it)
    }
    PickerTrigger(
        text = label,
        placeholder = placeholder,
        modifier = modifier,
        enabled = enabled,
        invalid = invalid,
        onClick = { open = true },
        fill = false,
        leading = { tint -> Icon(PhosphorIcons.Regular.CalendarBlank, contentDescription = null, size = 16.dp, tint = tint) },
    )
    Drawer(
        open = open,
        onOpenChange = { open = it },
        floating = floating,
        showCloseButton = showCloseButton,
        closeLabel = closeLabel,
    ) {
        if (title != null) {
            DrawerHeader { DrawerTitle(title) }
        } else {
            RegisterPaneTitle(placeholder)
        }
        DateWheels(
            value = value ?: Date(),
            onValueChange = onValueChange,
            locale = locale,
            fromYear = fromYear,
            toYear = toYear,
            modifier = Modifier
                .padding(16.dp)
                .then(if (showCloseButton && title == null) Modifier.padding(top = 48.dp) else Modifier),
        )
    }
}

@Composable
internal fun PickerTrigger(
    text: String?,
    placeholder: String,
    modifier: Modifier,
    enabled: Boolean,
    invalid: Boolean?,
    onClick: () -> Unit,
    fill: Boolean = true,
    leading: (@Composable (Color) -> Unit)? = null,
    trailing: (@Composable (Color) -> Unit)? = null,
) {
    val colors = EsuissTheme.colors
    val field = LocalFieldState.current
    val isInvalid = invalid ?: field.invalid
    val isEnabled = enabled && field.enabled
    val shape = RoundedCornerShape(Radius.lg)
    val foreground = when {
        !isEnabled -> colors.labelQuaternary
        text == null -> colors.labelSecondary
        else -> colors.label
    }
    val iconTint = if (isEnabled) colors.labelSecondary else colors.labelQuaternary
    Row(
        modifier = modifier
            .then(if (fill) Modifier.fillMaxWidth() else Modifier)
            .height(44.dp)
            .clip(shape)
            .background(controlBackground(colors, isInvalid, isEnabled), shape)
            .border(1.dp, if (isInvalid) colors.danger else Color.Transparent, shape)
            .then(if (isInvalid) Modifier.semantics { error("Invalid") } else Modifier)
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                enabled = isEnabled,
                role = Role.Button,
                onClick = onClick,
            )
            .padding(horizontal = 12.dp),
        horizontalArrangement = Arrangement.spacedBy(if (leading != null) 8.dp else 6.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        leading?.invoke(iconTint)
        Box(modifier = Modifier.weight(1f, fill = fill)) {
            BasicText(
                text ?: placeholder,
                style = Typography.base.copy(color = foreground),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
        trailing?.invoke(iconTint)
    }
}

private fun partOrder(locale: Locale): List<DatePart> {
    val format = android.icu.text.DateFormat.getDateInstance(android.icu.text.DateFormat.SHORT, locale)
    val pattern = (format as? android.icu.text.SimpleDateFormat)?.toPattern().orEmpty()
    val order = mutableListOf<DatePart>()
    var quoted = false
    pattern.forEach { char ->
        if (char == '\'') quoted = !quoted
        if (quoted) return@forEach
        val part = when (char) {
            'd' -> DatePart.Day
            'M', 'L' -> DatePart.Month
            'y' -> DatePart.Year
            else -> null
        }
        if (part != null && part !in order) order += part
    }
    return if (order.size == 3) order else listOf(DatePart.Month, DatePart.Day, DatePart.Year)
}

private fun daysInMonth(year: Int, month: Int): Int =
    Calendar.getInstance().apply {
        clear()
        set(year, month, 1)
    }.getActualMaximum(Calendar.DAY_OF_MONTH)

@Composable
private fun DateWheels(
    value: Date,
    onValueChange: (Date) -> Unit,
    locale: Locale,
    fromYear: Int,
    toYear: Int,
    modifier: Modifier,
) {
    val calendar = Calendar.getInstance().apply { time = value }
    val year = calendar.get(Calendar.YEAR)
    val month = calendar.get(Calendar.MONTH)
    val day = calendar.get(Calendar.DAY_OF_MONTH)
    val order = remember(locale) { partOrder(locale) }
    val monthNames = remember(locale) {
        val format = android.icu.text.SimpleDateFormat("LLLL", locale)
        List(12) { index ->
            format.format(Calendar.getInstance().apply {
                clear()
                set(2000, index, 1)
            }.time)
        }
    }
    val days = daysInMonth(year, month)
    val update = { nextYear: Int, nextMonth: Int, nextDay: Int ->
        val clamped = minOf(nextDay, daysInMonth(nextYear, nextMonth))
        onValueChange(
            Calendar.getInstance().apply {
                clear()
                set(nextYear, nextMonth, clamped)
            }.time,
        )
    }
    WheelPicker(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(24.dp, Alignment.CenterHorizontally),
    ) {
        order.forEach { part ->
            when (part) {
                DatePart.Day -> WheelPickerColumn(
                    value = day.toString(),
                    onValueChange = { update(year, month, it.toInt()) },
                    modifier = Modifier.width(48.dp),
                    label = "Day",
                    horizontalAlignment = Alignment.End,
                    itemPadding = 0.dp,
                ) {
                    for (item in 1..days) WheelPickerItem(item.toString(), item.toString())
                }
                DatePart.Month -> WheelPickerColumn(
                    value = month.toString(),
                    onValueChange = { update(year, it.toInt(), day) },
                    modifier = Modifier.widthIn(min = 96.dp),
                    label = "Month",
                    horizontalAlignment = Alignment.Start,
                    itemPadding = 0.dp,
                ) {
                    monthNames.forEachIndexed { index, name -> WheelPickerItem(index.toString(), name) }
                }
                DatePart.Year -> WheelPickerColumn(
                    value = year.toString(),
                    onValueChange = { update(it.toInt(), month, day) },
                    modifier = Modifier.width(64.dp),
                    label = "Year",
                    horizontalAlignment = Alignment.Start,
                    itemPadding = 0.dp,
                ) {
                    for (item in fromYear..toYear) WheelPickerItem(item.toString(), item.toString())
                }
            }
        }
    }
}
