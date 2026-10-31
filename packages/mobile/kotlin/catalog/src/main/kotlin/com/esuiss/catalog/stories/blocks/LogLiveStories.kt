package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.LogLive

val logLiveStories = StoryGroup(
    section = Section.Blocks,
    title = "Log Live",
    stories = listOf(
        Story("Default", fullScreen = true, live = true) { LogLive() },
    ),
)
