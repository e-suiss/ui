package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.UsersDetail

val usersDetailStories = StoryGroup(
    section = Section.Blocks,
    title = "Users Detail",
    stories = listOf(
        Story("Default", fullScreen = true) { UsersDetail() },
    ),
)
