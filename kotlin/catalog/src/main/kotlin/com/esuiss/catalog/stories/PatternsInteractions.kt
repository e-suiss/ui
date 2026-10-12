package com.esuiss.catalog.stories

import com.esuiss.catalog.StoryGroup
import com.esuiss.catalog.stories.interactions.cardStackStories
import com.esuiss.catalog.stories.interactions.imageViewerStories
import com.esuiss.catalog.stories.interactions.islandStories
import com.esuiss.catalog.stories.interactions.otpAutofillStories
import com.esuiss.catalog.stories.interactions.previewMenuStories
import com.esuiss.catalog.stories.interactions.pullToRefreshStories
import com.esuiss.catalog.stories.interactions.reorderListStories
import com.esuiss.catalog.stories.interactions.searchRevealStories
import com.esuiss.catalog.stories.interactions.sectionIndexStories
import com.esuiss.catalog.stories.interactions.selectionListStories
import com.esuiss.catalog.stories.interactions.stepperStories
import com.esuiss.catalog.stories.interactions.swipeActionsStories
import com.esuiss.catalog.stories.interactions.tipStories
import com.esuiss.catalog.stories.interactions.topBannerStories
import com.esuiss.catalog.stories.interactions.undoBarStories
import com.esuiss.catalog.stories.patterns.actionBarStories
import com.esuiss.catalog.stories.patterns.confirmStories
import com.esuiss.catalog.stories.patterns.contextActionsStories
import com.esuiss.catalog.stories.patterns.datePickerStories
import com.esuiss.catalog.stories.patterns.pagedListStories
import com.esuiss.catalog.stories.patterns.pickerStories
import com.esuiss.catalog.stories.patterns.previewStories
import com.esuiss.catalog.stories.patterns.searchPickerStories
import com.esuiss.catalog.stories.patterns.segmentPickerStories
import com.esuiss.catalog.stories.patterns.splitViewStories
import com.esuiss.catalog.stories.patterns.tableListStories

val patternsInteractions: List<StoryGroup> = listOf(
    actionBarStories,
    confirmStories,
    contextActionsStories,
    datePickerStories,
    pagedListStories,
    pickerStories,
    previewStories,
    searchPickerStories,
    segmentPickerStories,
    splitViewStories,
    tableListStories,
    cardStackStories,
    imageViewerStories,
    islandStories,
    otpAutofillStories,
    previewMenuStories,
    pullToRefreshStories,
    reorderListStories,
    searchRevealStories,
    sectionIndexStories,
    selectionListStories,
    stepperStories,
    swipeActionsStories,
    tipStories,
    topBannerStories,
    undoBarStories,
)
