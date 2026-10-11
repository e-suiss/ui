package com.esuiss.catalog.stories.charts

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.charts.BarChartActive
import com.esuiss.ui.charts.BarChartDefault
import com.esuiss.ui.charts.BarChartHorizontal
import com.esuiss.ui.charts.BarChartHourly
import com.esuiss.ui.charts.BarChartInteractive
import com.esuiss.ui.charts.BarChartLabeled
import com.esuiss.ui.charts.BarChartMultiple
import com.esuiss.ui.charts.BarChartNegative
import com.esuiss.ui.charts.BarChartRange
import com.esuiss.ui.charts.BarChartStacked

val barChartsStories = StoryGroup(
    section = Section.Charts,
    title = "Bar",
    stories = listOf(
        Story("Active") { BarChartActive() },
        Story("Default") { BarChartDefault() },
        Story("Horizontal") { BarChartHorizontal() },
        Story("Hourly") { BarChartHourly() },
        Story("Interactive") { BarChartInteractive() },
        Story("Labeled") { BarChartLabeled() },
        Story("Multiple") { BarChartMultiple() },
        Story("Negative") { BarChartNegative() },
        Story("Range") { BarChartRange() },
        Story("Stacked") { BarChartStacked() },
    ),
)
