package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.BagReview

val bagReviewStories = StoryGroup(
    section = Section.Blocks,
    title = "Bag Review",
    stories = listOf(
        Story("Default", fullScreen = true) { BagReview() },
    ),
)
