package com.esuiss.catalog.stories.charts

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.charts.AreaChartAxes
import com.esuiss.ui.charts.AreaChartDefault
import com.esuiss.ui.charts.AreaChartGradient
import com.esuiss.ui.charts.AreaChartInteractive
import com.esuiss.ui.charts.AreaChartLinear
import com.esuiss.ui.charts.AreaChartRange
import com.esuiss.ui.charts.AreaChartSparkline
import com.esuiss.ui.charts.AreaChartStacked
import com.esuiss.ui.charts.AreaChartStackedExpand
import com.esuiss.ui.charts.AreaChartStep

val areaChartsStories = StoryGroup(
    section = Section.Charts,
    title = "Area",
    stories = listOf(
        Story("Default") { AreaChartDefault() },
        Story("Axes") { AreaChartAxes() },
        Story("Gradient") { AreaChartGradient() },
        Story("Interactive") { AreaChartInteractive() },
        Story("Linear") { AreaChartLinear() },
        Story("Range") { AreaChartRange() },
        Story("Sparkline") { AreaChartSparkline() },
        Story("StackedExpand") { AreaChartStackedExpand() },
        Story("Stacked") { AreaChartStacked() },
        Story("Step") { AreaChartStep() },
    ),
)
