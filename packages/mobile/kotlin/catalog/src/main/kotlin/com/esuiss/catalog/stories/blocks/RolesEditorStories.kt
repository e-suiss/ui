package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.RolesEditor

val rolesEditorStories = StoryGroup(
    section = Section.Blocks,
    title = "Roles Editor",
    stories = listOf(
        Story("Default", fullScreen = true) { RolesEditor() },
    ),
)
