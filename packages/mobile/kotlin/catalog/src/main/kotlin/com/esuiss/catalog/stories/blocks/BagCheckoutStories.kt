package com.esuiss.catalog.stories.blocks

import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.BagCheckout

val bagCheckoutStories = StoryGroup(
    section = Section.Blocks,
    title = "Bag Checkout",
    stories = listOf(
        Story("Default", fullScreen = true) { BagCheckout() },
    ),
)
