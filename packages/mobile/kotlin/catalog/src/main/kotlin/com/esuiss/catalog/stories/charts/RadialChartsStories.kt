package com.esuiss.catalog.stories.charts

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.charts.RadialChartBatteries
import com.esuiss.ui.charts.RadialChartDefault
import com.esuiss.ui.charts.RadialChartGauge
import com.esuiss.ui.charts.RadialChartInteractive
import com.esuiss.ui.charts.RadialChartLabel
import com.esuiss.ui.charts.RadialChartProgress
import com.esuiss.ui.charts.RadialChartRings
import com.esuiss.ui.charts.RadialChartStacked
import com.esuiss.ui.charts.RadialChartText
import com.esuiss.ui.charts.RadialChartTinted

val radialChartsStories = StoryGroup(
    section = Section.Charts,
    title = "Radial",
    stories = listOf(
        Story("Batteries") { RadialChartBatteries() },
        Story("Default") { RadialChartDefault() },
        Story("Gauge") { RadialChartGauge() },
        Story("Interactive") { RadialChartInteractive() },
        Story("Label") { RadialChartLabel() },
        Story("Progress") { RadialChartProgress() },
        Story("Rings") { RadialChartRings() },
        Story("Stacked") { RadialChartStacked() },
        Story("Text") { RadialChartText() },
        Story("Tinted") { RadialChartTinted() },
    ),
)
