package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.SettingsNotifications

val settingsNotificationsStories = StoryGroup(
    section = Section.Blocks,
    title = "Settings Notifications",
    stories = listOf(
        Story("Default", fullScreen = true) { SettingsNotifications() },
    ),
)
