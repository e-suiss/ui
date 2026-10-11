package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.RangeSlider
import com.esuiss.ui.components.Slider
import com.esuiss.ui.components.Text
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography
import kotlin.math.roundToInt

val sliderStories = StoryGroup(
    section = Section.Components,
    title = "Slider",
    stories = listOf(
        Story("Default") { SliderUncontrolled(50f) },
        Story("Controlled") { SliderControlled() },
        Story("Range") { SliderRange() },
        Story("Step") { SliderUncontrolled(0.5f, valueRange = 0f..1f, step = 0.1f) },
        Story("Disabled") { SliderUncontrolled(40f, enabled = false) },
    ),
)

@Composable
private fun SliderUncontrolled(
    initial: Float,
    valueRange: ClosedFloatingPointRange<Float> = 0f..100f,
    step: Float = 1f,
    enabled: Boolean = true,
) {
    var value by rememberSaveable { mutableFloatStateOf(initial) }
    Slider(
        value,
        { value = it },
        Modifier.fillMaxWidth(),
        enabled = enabled,
        valueRange = valueRange,
        step = step,
        contentDescription = "Volume",
    )
}

@Composable
private fun SliderHeader(title: String, detail: String) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
        Text(title, style = Typography.sm.copy(fontWeight = FontWeight.Medium))
        Text(detail, style = Typography.sm, color = EsuissTheme.colors.labelSecondary)
    }
}

@Composable
private fun SliderControlled() {
    var value by rememberSaveable { mutableFloatStateOf(30f) }
    var committed by rememberSaveable { mutableFloatStateOf(30f) }
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        SliderHeader("Brightness", "${value.roundToInt()} / committed ${committed.roundToInt()}")
        Slider(
            value,
            { value = it },
            Modifier.fillMaxWidth(),
            onValueChangeFinished = { committed = value },
            contentDescription = "Brightness",
        )
    }
}

@Composable
private fun SliderRange() {
    var start by rememberSaveable { mutableFloatStateOf(25f) }
    var end by rememberSaveable { mutableFloatStateOf(75f) }
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        SliderHeader("Price", "$${start.roundToInt()} – $${end.roundToInt()}")
        RangeSlider(
            start..end,
            {
                start = it.start
                end = it.endInclusive
            },
            Modifier.fillMaxWidth(),
            step = 5f,
            contentDescription = "Price",
        )
    }
}
