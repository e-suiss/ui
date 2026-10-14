package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.LoginAccount

val loginAccountStories = StoryGroup(
    section = Section.Blocks,
    title = "Login Account",
    stories = listOf(
        Story("Default", fullScreen = true) { LoginAccount() },
    ),
)
