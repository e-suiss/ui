package com.esuiss.catalog.stories.charts

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.charts.RadarChartDefault
import com.esuiss.ui.charts.RadarChartDots
import com.esuiss.ui.charts.RadarChartGridCircle
import com.esuiss.ui.charts.RadarChartGridFilled
import com.esuiss.ui.charts.RadarChartGridNone
import com.esuiss.ui.charts.RadarChartInteractive
import com.esuiss.ui.charts.RadarChartLegend
import com.esuiss.ui.charts.RadarChartLinesOnly
import com.esuiss.ui.charts.RadarChartMultiple
import com.esuiss.ui.charts.RadarChartRadiusAxis

val radarChartsStories = StoryGroup(
    section = Section.Charts,
    title = "Radar",
    stories = listOf(
        Story("Default") { RadarChartDefault() },
        Story("Dots") { RadarChartDots() },
        Story("GridCircle") { RadarChartGridCircle() },
        Story("GridFilled") { RadarChartGridFilled() },
        Story("GridNone") { RadarChartGridNone() },
        Story("Interactive") { RadarChartInteractive() },
        Story("Legend") { RadarChartLegend() },
        Story("LinesOnly") { RadarChartLinesOnly() },
        Story("Multiple") { RadarChartMultiple() },
        Story("RadiusAxis") { RadarChartRadiusAxis() },
    ),
)
