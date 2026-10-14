package com.esuiss.catalog.stories.interactions

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableDoubleStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Text
import com.esuiss.ui.interactions.Stepper
import com.esuiss.ui.interactions.StepperDecrement
import com.esuiss.ui.interactions.StepperGroup
import com.esuiss.ui.interactions.StepperIncrement
import com.esuiss.ui.interactions.StepperInput
import com.esuiss.ui.interactions.StepperSeparator
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import java.text.DecimalFormat
import java.text.NumberFormat

val stepperStories = StoryGroup(
    section = Section.Interactions,
    title = "Stepper",
    stories = listOf(
        Story("Default") { StepperDefault() },
        Story("Print") { StepperPrint() },
    ),
)

@Composable
private fun StepperControls() {
    StepperGroup {
        StepperDecrement()
        StepperSeparator()
        StepperIncrement()
    }
}

@Composable
private fun StepperDefault() {
    var value by rememberSaveable { mutableDoubleStateOf(1.0) }
    Row {
        Stepper(value = value, onValueChange = { value = it }, min = 0.0, max = 10.0) {
            StepperInput(contentDescription = "Quantity")
            StepperControls()
        }
    }
}

@Composable
private fun StepperRow(
    label: String,
    value: Double,
    onValueChange: (Double) -> Unit,
    min: Double = Double.NEGATIVE_INFINITY,
    max: Double = Double.POSITIVE_INFINITY,
    step: Double = 1.0,
    enabled: Boolean = true,
    format: NumberFormat = remember { NumberFormat.getNumberInstance() },
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 44.dp)
            .padding(horizontal = 16.dp, vertical = 6.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(label, modifier = Modifier.weight(1f), style = Typography.base)
        Stepper(value = value, onValueChange = onValueChange, min = min, max = max, step = step, enabled = enabled, format = format) {
            StepperInput(contentDescription = label)
            StepperControls()
        }
    }
}

@Composable
private fun StepperPrint() {
    val colors = EsuissTheme.colors
    var copies by rememberSaveable { mutableDoubleStateOf(1.0) }
    var scale by rememberSaveable { mutableDoubleStateOf(100.0) }
    var pages by rememberSaveable { mutableDoubleStateOf(1.0) }
    val percent = remember { DecimalFormat("0'%'") }
    val shape = RoundedCornerShape(Radius.xl2)
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Column(
            Modifier
                .fillMaxWidth()
                .clip(shape)
                .border(1.dp, colors.separator, shape),
        ) {
            StepperRow("Copies", copies, { copies = it }, min = 1.0, max = 999.0)
            Box(Modifier.fillMaxWidth().height(1.dp).background(colors.separator))
            StepperRow("Scale", scale, { scale = it }, min = 25.0, max = 400.0, step = 5.0, format = percent)
            Box(Modifier.fillMaxWidth().height(1.dp).background(colors.separator))
            StepperRow("Pages per sheet", pages, { pages = it }, enabled = false)
        }
        Text(
            "${copies.toInt()} ${if (copies == 1.0) "copy" else "copies"} at ${scale.toInt()}%",
            modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
            style = Typography.sm.copy(color = colors.labelSecondary),
        )
    }
}
