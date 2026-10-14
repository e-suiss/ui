package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.GridLineup

val gridLineupStories = StoryGroup(
    section = Section.Blocks,
    title = "Grid Lineup",
    stories = listOf(
        Story("Default", fullScreen = true) { GridLineup() },
    ),
)
