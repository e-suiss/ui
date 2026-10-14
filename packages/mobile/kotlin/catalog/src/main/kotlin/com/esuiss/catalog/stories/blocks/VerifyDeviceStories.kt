package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.VerifyDevice

val verifyDeviceStories = StoryGroup(
    section = Section.Blocks,
    title = "Verify Device",
    stories = listOf(
        Story("Default", fullScreen = true) { VerifyDevice() },
    ),
)
