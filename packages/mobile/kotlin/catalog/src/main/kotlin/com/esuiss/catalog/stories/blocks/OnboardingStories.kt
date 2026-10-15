package com.esuiss.catalog.stories.blocks

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Duotone
import com.adamglin.phosphoricons.duotone.MapTrifold
import com.adamglin.phosphoricons.duotone.Path
import com.adamglin.phosphoricons.duotone.ShareNetwork
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.Onboarding
import com.esuiss.ui.blocks.OnboardingPage
import com.esuiss.ui.components.Icon
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Radius

val onboardingStories = StoryGroup(
    section = Section.Blocks,
    title = "Onboarding",
    stories = listOf(
        Story("Default", fullScreen = true) { Onboarding(onDone = {}) },
        Story("CustomPages", fullScreen = true) { Onboarding(pages = OnboardingCustomPages, onDone = {}) },
        Story("TextOnly", fullScreen = true) { Onboarding(pages = OnboardingTextPages, onDone = {}) },
    ),
)

@Composable
private fun OnboardingIllustration(icon: ImageVector) {
    val colors = EsuissTheme.colors
    Box(
        Modifier
            .size(160.dp)
            .background(colors.muted, RoundedCornerShape(Radius.xl3)),
        contentAlignment = Alignment.Center,
    ) {
        Icon(icon, contentDescription = null, size = 80.dp, tint = Palette.green500)
    }
}

private val OnboardingCustomPages = listOf(
    OnboardingPage("Find your trail", "Thousands of routes, sorted by distance and difficulty.") {
        OnboardingIllustration(PhosphorIcons.Duotone.MapTrifold)
    },
    OnboardingPage("Record every step", "Track your hike offline and see your pace as you go.") {
        OnboardingIllustration(PhosphorIcons.Duotone.Path)
    },
    OnboardingPage("Share with friends", "Send a route in one tap and plan the next trip together.") {
        OnboardingIllustration(PhosphorIcons.Duotone.ShareNetwork)
    },
)

private val OnboardingTextPages = listOf(
    OnboardingPage("Welcome", "A short tour of what's new in this version."),
    OnboardingPage("Widgets", "Add your favorite lists to the Home Screen."),
    OnboardingPage("Shortcuts", "Long press the app icon to jump straight to search."),
)
