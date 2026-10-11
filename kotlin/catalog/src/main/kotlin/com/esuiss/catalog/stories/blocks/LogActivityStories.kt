package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.LogActivity

val logActivityStories = StoryGroup(
    section = Section.Blocks,
    title = "Log Activity",
    stories = listOf(
        Story("Default", fullScreen = true) { LogActivity() },
    ),
)
