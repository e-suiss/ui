package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.SignupSteps

val signupStepsStories = StoryGroup(
    section = Section.Blocks,
    title = "Signup Steps",
    stories = listOf(
        Story("Default", fullScreen = true) { SignupSteps() },
    ),
)
