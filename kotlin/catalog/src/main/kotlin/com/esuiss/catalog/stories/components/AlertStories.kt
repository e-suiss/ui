package com.esuiss.catalog.stories.components

import androidx.compose.runtime.Composable
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.CheckCircle
import com.adamglin.phosphoricons.regular.Info
import com.adamglin.phosphoricons.regular.Warning
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Alert
import com.esuiss.ui.components.AlertDescription
import com.esuiss.ui.components.AlertTitle
import com.esuiss.ui.components.AlertVariant
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant

val alertStories = StoryGroup(
    section = Section.Components,
    title = "Alert",
    stories = listOf(
        Story("Default") { AlertDefault() },
        Story("Destructive") { AlertDestructive() },
        Story("TitleOnly") { AlertTitleOnly() },
        Story("WithAction") { AlertWithAction() },
        Story("WithoutIcon") { AlertWithoutIcon() },
    ),
)

@Composable
private fun AlertDefault() {
    Alert(icon = PhosphorIcons.Regular.CheckCircle) {
        AlertTitle("Payment successful")
        AlertDescription("Your payment of \$29.99 has been processed. A receipt has been sent to your email.")
    }
}

@Composable
private fun AlertDestructive() {
    Alert(icon = PhosphorIcons.Regular.Warning, variant = AlertVariant.Destructive) {
        AlertTitle("Unable to process payment")
        AlertDescription("Please verify your billing information and try again.")
    }
}

@Composable
private fun AlertTitleOnly() {
    Alert(icon = PhosphorIcons.Regular.Info) {
        AlertTitle("Your session will expire in 5 minutes.")
    }
}

@Composable
private fun AlertWithAction() {
    Alert(
        icon = PhosphorIcons.Regular.Info,
        action = { Button("Update", onClick = {}, size = ButtonSize.Sm, variant = ButtonVariant.Tinted) },
    ) {
        AlertTitle("New version available")
        AlertDescription("Update now to get the latest features and fixes.")
    }
}

@Composable
private fun AlertWithoutIcon() {
    Alert {
        AlertTitle("Heads up")
        AlertDescription("You can add components to your app using the registry.")
    }
}
