package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.RolesRequests

val rolesRequestsStories = StoryGroup(
    section = Section.Blocks,
    title = "Roles Requests",
    stories = listOf(
        Story("Default", fullScreen = true) { RolesRequests() },
    ),
)
