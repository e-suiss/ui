package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.DashHealth

val dashHealthStories = StoryGroup(
    section = Section.Blocks,
    title = "Dash Health",
    stories = listOf(
        Story("Default", fullScreen = true) { DashHealth() },
    ),
)
