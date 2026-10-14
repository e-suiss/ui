package com.esuiss.catalog.stories.charts

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.charts.LineChartDefault
import com.esuiss.ui.charts.LineChartDots
import com.esuiss.ui.charts.LineChartForecast
import com.esuiss.ui.charts.LineChartGoal
import com.esuiss.ui.charts.LineChartGoalDots
import com.esuiss.ui.charts.LineChartInteractive
import com.esuiss.ui.charts.LineChartLabeled
import com.esuiss.ui.charts.LineChartLinear
import com.esuiss.ui.charts.LineChartMultiple
import com.esuiss.ui.charts.LineChartStep

val lineChartsStories = StoryGroup(
    section = Section.Charts,
    title = "Line",
    stories = listOf(
        Story("Default") { LineChartDefault() },
        Story("Dots") { LineChartDots() },
        Story("Forecast") { LineChartForecast() },
        Story("GoalDots") { LineChartGoalDots() },
        Story("Goal") { LineChartGoal() },
        Story("Interactive") { LineChartInteractive() },
        Story("Labeled") { LineChartLabeled() },
        Story("Linear") { LineChartLinear() },
        Story("Multiple") { LineChartMultiple() },
        Story("Step") { LineChartStep() },
    ),
)
