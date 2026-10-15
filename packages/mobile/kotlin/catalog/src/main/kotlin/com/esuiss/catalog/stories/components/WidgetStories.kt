package com.esuiss.catalog.stories.components

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.fill.CalendarBlank
import com.adamglin.phosphoricons.fill.CashRegister
import com.adamglin.phosphoricons.fill.Sun
import com.adamglin.phosphoricons.regular.CashRegister as CashRegisterRegular
import com.adamglin.phosphoricons.regular.CookingPot
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.components.Separator
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.Widget
import com.esuiss.ui.components.WidgetAlign
import com.esuiss.ui.components.WidgetContent
import com.esuiss.ui.components.WidgetDescription
import com.esuiss.ui.components.WidgetFooter
import com.esuiss.ui.components.WidgetHandlePlacement
import com.esuiss.ui.components.WidgetHeader
import com.esuiss.ui.components.WidgetIcon
import com.esuiss.ui.components.WidgetIconSize
import com.esuiss.ui.components.WidgetSize
import com.esuiss.ui.components.WidgetTitle
import com.esuiss.ui.components.WidgetValue
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

val widgetStories = StoryGroup(
    section = Section.Components,
    title = "Widget",
    stories = listOf(
        Story("Default") { Widget(size = WidgetSize.Small) { WidgetWeather() } },
        Story("Sizes") { WidgetSizes() },
        Story("Editing") { WidgetEditing() },
        Story("InsideHandle") { WidgetInsideHandle() },
        Story("LimitedSizes") { WidgetLimitedSizes() },
        Story("Controlled") { WidgetControlled() },
        Story("Centered") { WidgetCentered() },
        Story("Auto") { Widget(Modifier.height(192.dp)) { WidgetWeather() } },
        Story("Dashboard") { WidgetDashboard() },
    ),
)

private val widgetHourly = listOf(12, 18, 14, 30, 44, 34, 22, 40, 100, 46, 30, 14)

private val widgetTopItems = listOf(
    "Grilled meatballs" to 38,
    "Lahmacun" to 31,
    "Adana kebab" to 24,
)

private val widgetReservations = listOf(
    "18:00" to "Table 4",
    "19:00" to "Garden 3",
    "20:00" to "Table 12",
    "21:00" to "Table 7",
)

private fun widgetSizeName(size: WidgetSize): String = when (size) {
    WidgetSize.Auto -> "auto"
    WidgetSize.Small -> "small"
    WidgetSize.Medium -> "medium"
    WidgetSize.Large -> "large"
    WidgetSize.ExtraLarge -> "extra-large"
}

private fun widgetGridSpan(size: WidgetSize): String = when (size) {
    WidgetSize.Small -> "1 × 1"
    WidgetSize.Medium -> "2 × 1"
    WidgetSize.Large -> "2 × 2"
    else -> "4 × 2"
}

@Composable
private fun WidgetTintedTitle(text: String, color: Color) {
    CompositionLocalProvider(LocalContentStyle provides LocalContentStyle.current.copy(color = color)) {
        WidgetTitle(text)
    }
}

@Composable
private fun WidgetFooterText(text: String) {
    WidgetFooter {
        Text(text, maxLines = 1, overflow = TextOverflow.Ellipsis)
    }
}

@Composable
private fun WidgetHint(text: String) {
    Text(
        text,
        Modifier.padding(top = 24.dp),
        style = Typography.xs,
        color = EsuissTheme.colors.mutedForeground,
    )
}

@Composable
private fun WidgetWeather() {
    WidgetHeader {
        WidgetIcon { Icon(PhosphorIcons.Fill.Sun, contentDescription = null) }
        WidgetTitle("Istanbul")
    }
    WidgetContent {
        WidgetValue("24°")
        WidgetDescription("Partly cloudy")
    }
    WidgetFooterText("H 27° · L 18°")
}

@Composable
private fun WidgetSalesHeader() {
    val warning = if (EsuissTheme.colors.isDark) Palette.amber400 else Palette.amber600
    WidgetHeader {
        WidgetIcon(size = WidgetIconSize.Sm) { Icon(PhosphorIcons.Fill.CashRegister, contentDescription = null, tint = warning) }
        WidgetTintedTitle("Hestia", warning)
    }
}

@Composable
private fun WidgetRevenue() {
    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
        WidgetValue("₺18,240")
        WidgetDescription("Today's revenue")
    }
}

@Composable
private fun WidgetBars(modifier: Modifier) {
    val warning = if (EsuissTheme.colors.isDark) Palette.amber400 else Palette.amber600
    Row(modifier, horizontalArrangement = Arrangement.spacedBy(4.dp), verticalAlignment = Alignment.Bottom) {
        widgetHourly.forEach { value ->
            Box(
                Modifier
                    .weight(1f)
                    .fillMaxHeight(value / 100f)
                    .background(if (value == 100) warning else warning.copy(alpha = 0.4f), RoundedCornerShape(Radius.sm)),
            )
        }
    }
}

@Composable
private fun WidgetSalesBody(size: WidgetSize) {
    WidgetSalesHeader()
    if (size == WidgetSize.Medium) {
        WidgetContent {
            Row(
                Modifier.fillMaxWidth().fillMaxHeight(),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.Bottom,
            ) {
                WidgetRevenue()
                WidgetBars(Modifier.weight(1f).fillMaxHeight())
            }
        }
    } else {
        WidgetContent {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                WidgetRevenue()
                if (size != WidgetSize.Small) WidgetBars(Modifier.fillMaxWidth().height(56.dp))
            }
        }
    }
    if (size == WidgetSize.Large || size == WidgetSize.ExtraLarge) {
        Column {
            widgetTopItems.forEach { (name, count) ->
                Row(
                    Modifier.fillMaxWidth().padding(vertical = 6.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text(name, style = Typography.sm)
                    Text(count.toString(), style = Typography.sm, color = EsuissTheme.colors.mutedForeground)
                }
                Separator()
            }
        }
    }
    WidgetFooterText("42 orders · 18:42")
}

@Composable
private fun WidgetReservationsBody(size: WidgetSize) {
    val colors = EsuissTheme.colors
    WidgetHeader {
        WidgetIcon(size = WidgetIconSize.Sm) { Icon(PhosphorIcons.Fill.CalendarBlank, contentDescription = null, tint = colors.primary) }
        WidgetTintedTitle("Reservations", colors.primary)
    }
    WidgetContent {
        Row(
            Modifier.fillMaxWidth().fillMaxHeight(),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalAlignment = Alignment.Bottom,
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                WidgetValue("12")
                WidgetDescription("Tonight")
            }
            if (size == WidgetSize.Medium) {
                Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    widgetReservations.take(3).forEach { (time, place) ->
                        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            Text(time, Modifier.width(44.dp), style = Typography.sm, color = colors.mutedForeground)
                            Text(place, Modifier.weight(1f), style = Typography.sm, maxLines = 1, overflow = TextOverflow.Ellipsis)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun WidgetSizes() {
    Row(
        Modifier.horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        verticalAlignment = Alignment.Top,
    ) {
        listOf(WidgetSize.Small, WidgetSize.Medium, WidgetSize.Large, WidgetSize.ExtraLarge).forEach { size ->
            Widget(size = size) {
                WidgetHeader {
                    WidgetTitle(
                        widgetSizeName(size).split("-").joinToString(" ") { word -> word.replaceFirstChar { it.uppercaseChar() } },
                    )
                }
                WidgetFooterText(widgetGridSpan(size))
            }
        }
    }
}

@Composable
private fun WidgetEditing() {
    Column(Modifier.fillMaxWidth()) {
        Widget(resizable = true, defaultSize = WidgetSize.Large) { WidgetSalesBody(size) }
        WidgetHint("Drag the corner handle to snap between sizes. Double tap it to reset.")
    }
}

@Composable
private fun WidgetInsideHandle() {
    Column(Modifier.fillMaxWidth()) {
        Widget(resizable = true, handle = WidgetHandlePlacement.Inside, defaultSize = WidgetSize.Medium) { WidgetSalesBody(size) }
        WidgetHint("The handle sits inside the corner.")
    }
}

@Composable
private fun WidgetLimitedSizes() {
    Column(Modifier.fillMaxWidth()) {
        Widget(
            resizable = true,
            defaultSize = WidgetSize.Medium,
            sizes = listOf(WidgetSize.Small, WidgetSize.Medium),
        ) { WidgetReservationsBody(size) }
        WidgetHint("Only small and medium are offered.")
    }
}

@Composable
private fun WidgetControlled() {
    var size by rememberSaveable { mutableStateOf(WidgetSize.Small) }
    Column(Modifier.fillMaxWidth()) {
        Widget(size = size, onSizeChange = { size = it }, resizable = true) { WidgetWeather() }
        WidgetHint("Size: ${widgetSizeName(size)}")
    }
}

@Composable
private fun WidgetCentered() {
    Widget(size = WidgetSize.Small, align = WidgetAlign.Center) {
        WidgetHeader {
            WidgetIcon(size = WidgetIconSize.Lg) { Icon(PhosphorIcons.Regular.CashRegisterRegular, contentDescription = null) }
            WidgetTitle("Point of sale")
        }
        WidgetDescription("3 open orders")
    }
}

@Composable
private fun WidgetDashboard() {
    val warning = if (EsuissTheme.colors.isDark) Palette.amber400 else Palette.amber600
    val tall = Modifier.height(168.dp)
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            Box(Modifier.weight(1f)) {
                Widget(tall) {
                    WidgetHeader {
                        WidgetIcon { Icon(PhosphorIcons.Fill.Sun, contentDescription = null) }
                        WidgetTitle("Istanbul")
                    }
                    WidgetValue("24°")
                    WidgetFooterText("Partly cloudy")
                }
            }
            Box(Modifier.weight(1f)) {
                Widget(tall, align = WidgetAlign.Center) {
                    WidgetHeader {
                        WidgetIcon(size = WidgetIconSize.Lg) { Icon(PhosphorIcons.Regular.CookingPot, contentDescription = null) }
                        WidgetTitle("Kitchen display")
                    }
                    WidgetDescription("5 tickets")
                }
            }
        }
        Widget(tall) {
            WidgetHeader {
                WidgetIcon(size = WidgetIconSize.Sm) { Icon(PhosphorIcons.Fill.CashRegister, contentDescription = null, tint = warning) }
                WidgetTintedTitle("Hestia", warning)
            }
            WidgetValue("₺18,240")
            WidgetFooterText("Today's revenue · 42 orders")
        }
    }
}
