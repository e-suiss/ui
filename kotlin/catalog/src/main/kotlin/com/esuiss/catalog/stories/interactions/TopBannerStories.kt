package com.esuiss.catalog.stories.interactions

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Bell
import com.adamglin.phosphoricons.regular.CloudArrowUp
import com.adamglin.phosphoricons.regular.WifiSlash
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Text
import com.esuiss.ui.interactions.TopBannerAction
import com.esuiss.ui.interactions.TopBannerProvider
import com.esuiss.ui.interactions.TopBannerState
import com.esuiss.ui.interactions.rememberTopBannerState
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

val topBannerStories = StoryGroup(
    section = Section.Interactions,
    title = "Top Banner",
    stories = listOf(
        Story("Default") { TopBannerDemo(timeout = 4000L) },
        Story("Showing") {
            TopBannerDemo { show("Message sent", description = "Alex will see it the next time they open the app.") }
        },
        Story("WithIcon") {
            TopBannerDemo {
                show(
                    "Reminders are on",
                    description = "We will remind you 10 minutes before each event.",
                    icon = PhosphorIcons.Regular.Bell,
                )
            }
        },
        Story("WithAction") {
            TopBannerDemo {
                show(
                    "Upload paused",
                    description = "3 photos are waiting for Wi-Fi.",
                    icon = PhosphorIcons.Regular.CloudArrowUp,
                    action = TopBannerAction("Resume") {},
                )
            }
        },
        Story("TitleOnly") { TopBannerDemo { show("Copied to clipboard") } },
    ),
)

@Composable
private fun TopBannerDemo(timeout: Long = 600000L, onMount: (TopBannerState.() -> Unit)? = null) {
    val state = rememberTopBannerState(defaultTimeoutMillis = timeout)
    var shown by rememberSaveable { mutableStateOf(false) }
    LaunchedEffect(Unit) {
        if (shown || onMount == null) return@LaunchedEffect
        shown = true
        state.onMount()
    }
    TopBannerProvider(state) {
        TopBannerTriggers(state)
    }
}

@Composable
private fun TopBannerTriggers(state: TopBannerState) {
    var log by rememberSaveable { mutableStateOf("") }
    val fill = Modifier.fillMaxWidth()
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Button(
            "Show banner",
            onClick = { state.show("Message sent", description = "Alex will see it the next time they open the app.") },
            modifier = fill,
            variant = ButtonVariant.Outline,
        )
        Button(
            "Show with icon and action",
            onClick = {
                state.show(
                    "You are offline",
                    description = "Changes will sync when you reconnect.",
                    icon = PhosphorIcons.Regular.WifiSlash,
                    action = TopBannerAction("Retry") { log = "Retry pressed" },
                )
            },
            modifier = fill,
            variant = ButtonVariant.Outline,
        )
        Button(
            "Queue three",
            onClick = {
                state.show("First of three")
                state.show("Second of three")
                state.show("Third of three")
            },
            modifier = fill,
            variant = ButtonVariant.Outline,
        )
        Button("Dismiss current", onClick = { state.dismiss() }, modifier = fill, variant = ButtonVariant.Ghost)
        Text(
            log,
            modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
            style = Typography.sm.copy(color = EsuissTheme.colors.labelSecondary),
        )
    }
}
