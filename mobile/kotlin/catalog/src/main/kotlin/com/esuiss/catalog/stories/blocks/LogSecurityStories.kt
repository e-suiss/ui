package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.LogSecurity

val logSecurityStories = StoryGroup(
    section = Section.Blocks,
    title = "Log Security",
    stories = listOf(
        Story("Default", fullScreen = true) { LogSecurity() },
    ),
)
