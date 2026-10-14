package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.SignupTrial

val signupTrialStories = StoryGroup(
    section = Section.Blocks,
    title = "Signup Trial",
    stories = listOf(
        Story("Default", fullScreen = true) { SignupTrial() },
    ),
)
