package com.esuiss.catalog.stories.charts

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.charts.PieChartActive
import com.esuiss.ui.charts.PieChartDefault
import com.esuiss.ui.charts.PieChartDonut
import com.esuiss.ui.charts.PieChartDonutText
import com.esuiss.ui.charts.PieChartHalf
import com.esuiss.ui.charts.PieChartInteractive
import com.esuiss.ui.charts.PieChartLabel
import com.esuiss.ui.charts.PieChartLegend
import com.esuiss.ui.charts.PieChartNested
import com.esuiss.ui.charts.PieChartSeparated

val pieChartsStories = StoryGroup(
    section = Section.Charts,
    title = "Pie",
    stories = listOf(
        Story("Active") { PieChartActive() },
        Story("Default") { PieChartDefault() },
        Story("DonutText") { PieChartDonutText() },
        Story("Donut") { PieChartDonut() },
        Story("Half") { PieChartHalf() },
        Story("Interactive") { PieChartInteractive() },
        Story("Label") { PieChartLabel() },
        Story("Legend") { PieChartLegend() },
        Story("Nested") { PieChartNested() },
        Story("Separated") { PieChartSeparated() },
    ),
)
