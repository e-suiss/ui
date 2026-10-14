package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.PageIndicator
import com.esuiss.ui.components.PageIndicatorSize
import com.esuiss.ui.components.PageIndicatorVariant
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TextVariant

val pageIndicatorStories = StoryGroup(
    section = Section.Components,
    title = "Page Indicator",
    stories = listOf(
        Story("Default") { PageIndicator(count = 5, index = 1) },
        Story("Sizes") { PageIndicatorSizes() },
        Story("Accent") { PageIndicator(count = 5, index = 1, variant = PageIndicatorVariant.Accent) },
        Story("ManyPages") { PageIndicatorManyPages() },
        Story("Interactive") { PageIndicatorInteractive(12) },
    ),
)

@Composable
private fun PageIndicatorCentered(spacing: Int, content: @Composable () -> Unit) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(spacing.dp),
    ) {
        content()
    }
}

@Composable
private fun PageIndicatorSizes() {
    PageIndicatorCentered(24) {
        PageIndicator(count = 5, index = 1, size = PageIndicatorSize.Sm)
        PageIndicator(count = 5, index = 1)
    }
}

@Composable
private fun PageIndicatorManyPages() {
    PageIndicatorCentered(24) {
        PageIndicator(count = 12, index = 0)
        PageIndicator(count = 12, index = 5)
        PageIndicator(count = 12, index = 11)
    }
}

@Composable
private fun PageIndicatorInteractive(count: Int) {
    var index by rememberSaveable { mutableIntStateOf(0) }
    PageIndicatorCentered(12) {
        PageIndicator(count = count, index = index, onIndexChange = { index = it })
        Text("Page ${index + 1} of $count", variant = TextVariant.Muted)
    }
}
