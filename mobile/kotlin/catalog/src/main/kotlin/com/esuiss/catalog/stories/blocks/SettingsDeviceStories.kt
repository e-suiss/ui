package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.SettingsDevice

val settingsDeviceStories = StoryGroup(
    section = Section.Blocks,
    title = "Settings Device",
    stories = listOf(
        Story("Default", fullScreen = true) { SettingsDevice() },
    ),
)
