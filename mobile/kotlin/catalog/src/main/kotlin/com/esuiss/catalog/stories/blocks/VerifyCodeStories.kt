package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.VerifyCode

val verifyCodeStories = StoryGroup(
    section = Section.Blocks,
    title = "Verify Code",
    stories = listOf(
        Story("Default", fullScreen = true) { VerifyCode() },
    ),
)
