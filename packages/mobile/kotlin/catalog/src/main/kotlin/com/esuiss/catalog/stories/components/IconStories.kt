package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Duotone
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Light
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.Thin
import com.adamglin.phosphoricons.regular.Bell
import com.adamglin.phosphoricons.regular.Gear
import com.adamglin.phosphoricons.regular.Info
import com.adamglin.phosphoricons.regular.Star
import com.adamglin.phosphoricons.regular.Warning
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Icon
import com.esuiss.ui.theme.EsuissTheme
import com.adamglin.phosphoricons.bold.Star as BoldStar
import com.adamglin.phosphoricons.duotone.Star as DuotoneStar
import com.adamglin.phosphoricons.fill.Heart as FillHeart
import com.adamglin.phosphoricons.fill.Star as FillStar
import com.adamglin.phosphoricons.light.Star as LightStar
import com.adamglin.phosphoricons.thin.Star as ThinStar

val iconStories = StoryGroup(
    section = Section.Components,
    title = "Icon",
    stories = listOf(
        Story("Default") { IconDefault() },
        Story("Sizes") { IconSizes() },
        Story("Colors") { IconColors() },
        Story("Weights") { IconWeights() },
    ),
)

@Composable
private fun IconRow(content: @Composable () -> Unit) {
    Row(horizontalArrangement = Arrangement.spacedBy(16.dp), verticalAlignment = Alignment.CenterVertically) {
        content()
    }
}

@Composable
private fun IconDefault() {
    IconRow {
        Icon(PhosphorIcons.Regular.Star, contentDescription = null)
    }
}

@Composable
private fun IconSizes() {
    IconRow {
        Icon(PhosphorIcons.Regular.Bell, contentDescription = null, size = 16.dp)
        Icon(PhosphorIcons.Regular.Bell, contentDescription = null)
        Icon(PhosphorIcons.Regular.Bell, contentDescription = null, size = 24.dp)
        Icon(PhosphorIcons.Regular.Bell, contentDescription = null, size = 32.dp)
    }
}

@Composable
private fun IconColors() {
    val colors = EsuissTheme.colors
    IconRow {
        Icon(PhosphorIcons.Regular.Info, contentDescription = null)
        Icon(PhosphorIcons.Regular.Gear, contentDescription = null, tint = colors.labelSecondary)
        Icon(PhosphorIcons.Fill.FillHeart, contentDescription = null, tint = colors.accent)
        Icon(PhosphorIcons.Regular.Warning, contentDescription = null, tint = colors.danger)
    }
}

@Composable
private fun IconWeights() {
    IconRow {
        Icon(PhosphorIcons.Thin.ThinStar, contentDescription = null, size = 24.dp)
        Icon(PhosphorIcons.Light.LightStar, contentDescription = null, size = 24.dp)
        Icon(PhosphorIcons.Regular.Star, contentDescription = null, size = 24.dp)
        Icon(PhosphorIcons.Bold.BoldStar, contentDescription = null, size = 24.dp)
        Icon(PhosphorIcons.Fill.FillStar, contentDescription = null, size = 24.dp)
        Icon(PhosphorIcons.Duotone.DuotoneStar, contentDescription = null, size = 24.dp)
    }
}
