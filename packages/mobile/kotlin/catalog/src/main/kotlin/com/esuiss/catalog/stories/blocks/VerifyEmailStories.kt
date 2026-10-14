package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.VerifyEmail

val verifyEmailStories = StoryGroup(
    section = Section.Blocks,
    title = "Verify Email",
    stories = listOf(
        Story("Default", fullScreen = true) { VerifyEmail() },
    ),
)
