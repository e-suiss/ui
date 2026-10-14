package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.UsersTable

val usersTableStories = StoryGroup(
    section = Section.Blocks,
    title = "Users Table",
    stories = listOf(
        Story("Default", fullScreen = true) { UsersTable() },
    ),
)
