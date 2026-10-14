package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.UsersInvite

val usersInviteStories = StoryGroup(
    section = Section.Blocks,
    title = "Users Invite",
    stories = listOf(
        Story("Default", fullScreen = true) { UsersInvite() },
    ),
)
