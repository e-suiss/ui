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
import com.esuiss.ui.patterns.SegmentPicker
import com.esuiss.ui.patterns.SegmentPickerScope
import com.esuiss.ui.patterns.SegmentPickerSize
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

val segmentPickerStories = StoryGroup(
    section = Section.Patterns,
    title = "Segment Picker",
    stories = listOf(
        Story("Default") { SegmentPickerDemo("week") { segmentPickerPeriods() } },
        Story("WithoutValue") { SegmentPickerDemo(null) { segmentPickerPeriods() } },
        Story("Sizes") { SegmentPickerSizes() },
        Story("WithIcons") { SegmentPickerDemo("grid", label = "View") { segmentPickerViews() } },
        Story("WithIconsAndText") { SegmentPickerDemo("grid", label = "View") { segmentPickerViews() } },
        Story("DisabledItem") {
            SegmentPickerDemo("week") {
                SegmentPickerItem("day", "Day")
                SegmentPickerItem("week", "Week")
                SegmentPickerItem("month", "Month")
                SegmentPickerItem("year", "Year", enabled = false)
            }
        },
        Story("Disabled") { SegmentPickerDemo("week", enabled = false) { segmentPickerPeriods() } },
        Story("Controlled") { SegmentPickerControlled() },
    ),
)

private fun SegmentPickerScope.segmentPickerPeriods() {
    SegmentPickerItem("day", "Day")
    SegmentPickerItem("week", "Week")
    SegmentPickerItem("month", "Month")
    SegmentPickerItem("year", "Year")
}

private fun SegmentPickerScope.segmentPickerViews() {
    SegmentPickerItem("list", "List")
    SegmentPickerItem("grid", "Grid")
    SegmentPickerItem("table", "Table")
}

@Composable
private fun SegmentPickerDemo(
    initial: String?,
    label: String = "Period",
    size: SegmentPickerSize = SegmentPickerSize.Default,
    enabled: Boolean = true,
    content: SegmentPickerScope.() -> Unit,
) {
    var value by rememberSaveable { mutableStateOf(initial) }
    SegmentPicker(
        value = value,
        onValueChange = { value = it },
        modifier = Modifier.width(160.dp).semantics { contentDescription = label },
        size = size,
        enabled = enabled,
        content = content,
    )
}

@Composable
private fun SegmentPickerSizes() {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        SegmentPickerDemo("week", size = SegmentPickerSize.Sm) { segmentPickerPeriods() }
        SegmentPickerDemo("week") { segmentPickerPeriods() }
    }
}

@Composable
private fun SegmentPickerControlled() {
    var value by rememberSaveable { mutableStateOf("month") }
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        SegmentPicker(
            value = value,
            onValueChange = { value = it },
            modifier = Modifier.width(160.dp).semantics { contentDescription = "Period" },
        ) {
            segmentPickerPeriods()
        }
        Text("Selected: $value", style = Typography.sm.copy(color = EsuissTheme.colors.labelSecondary))
    }
}
