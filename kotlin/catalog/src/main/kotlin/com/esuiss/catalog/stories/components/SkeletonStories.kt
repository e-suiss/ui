package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Skeleton
import com.esuiss.ui.theme.Radius

val skeletonStories = StoryGroup(
    section = Section.Components,
    title = "Skeleton",
    stories = listOf(
        Story("Default") { Skeleton(Modifier.width(192.dp).height(16.dp)) },
        Story("Profile") { SkeletonProfile() },
        Story("Card") { SkeletonCard() },
        Story("List") { SkeletonList() },
    ),
)

@Composable
private fun SkeletonProfile() {
    Row(horizontalArrangement = Arrangement.spacedBy(16.dp), verticalAlignment = Alignment.CenterVertically) {
        Skeleton(Modifier.size(48.dp), shape = CircleShape)
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Skeleton(Modifier.width(192.dp).height(16.dp))
            Skeleton(Modifier.width(144.dp).height(16.dp))
        }
    }
}

@Composable
private fun SkeletonCard() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Skeleton(Modifier.fillMaxWidth().height(128.dp), shape = RoundedCornerShape(Radius.xl))
        Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Skeleton(Modifier.fillMaxWidth(0.75f).height(16.dp))
            Skeleton(Modifier.fillMaxWidth(0.5f).height(16.dp))
        }
    }
}

@Composable
private fun SkeletonList() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        repeat(4) {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
                Skeleton(Modifier.size(40.dp), shape = RoundedCornerShape(Radius.md))
                Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Skeleton(Modifier.fillMaxWidth(2f / 3f).height(16.dp))
                    Skeleton(Modifier.fillMaxWidth(1f / 3f).height(12.dp))
                }
            }
        }
    }
}
