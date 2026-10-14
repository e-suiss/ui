package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.SignupForm

val signupFormStories = StoryGroup(
    section = Section.Blocks,
    title = "Signup Form",
    stories = listOf(
        Story("Default", fullScreen = true) { SignupForm() },
    ),
)
