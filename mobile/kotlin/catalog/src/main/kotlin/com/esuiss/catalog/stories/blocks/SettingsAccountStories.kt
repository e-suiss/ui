package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.SettingsAccount

val settingsAccountStories = StoryGroup(
    section = Section.Blocks,
    title = "Settings Account",
    stories = listOf(
        Story("Default", fullScreen = true) { SettingsAccount() },
    ),
)
