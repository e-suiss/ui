package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.ArrowRight
import com.adamglin.phosphoricons.regular.DownloadSimple
import com.adamglin.phosphoricons.regular.Plus
import com.adamglin.phosphoricons.regular.Trash
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Text

val buttonStories = StoryGroup(
    section = Section.Components,
    title = "Button",
    stories = listOf(
        Story("Default") { ButtonDefault() },
        Story("Variants") { ButtonVariants() },
        Story("Sizes") { ButtonSizes() },
        Story("WithIcon") { ButtonWithIcon() },
        Story("Disabled") { ButtonDisabled() },
        Story("Block") { ButtonBlock() },
    ),
)

@Composable
private fun ButtonDefault() {
    Column {
        Button("Button", onClick = {})
    }
}

@Composable
private fun ButtonVariants() {
    val fill = Modifier.fillMaxWidth()
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Button("Default", onClick = {}, modifier = fill)
        Button("Secondary", onClick = {}, modifier = fill, variant = ButtonVariant.Secondary)
        Button("Tinted", onClick = {}, modifier = fill, variant = ButtonVariant.Tinted)
        Button("Outline", onClick = {}, modifier = fill, variant = ButtonVariant.Outline)
        Button("Ghost", onClick = {}, modifier = fill, variant = ButtonVariant.Ghost)
        Button("Plain", onClick = {}, modifier = fill, variant = ButtonVariant.Plain)
        Button("Destructive", onClick = {}, modifier = fill, variant = ButtonVariant.Destructive)
        Button("Link", onClick = {}, modifier = fill, variant = ButtonVariant.Link)
        Button(onClick = {}, variant = ButtonVariant.Outline, size = ButtonSize.Icon) {
            Icon(PhosphorIcons.Regular.Plus, contentDescription = "Add")
        }
    }
}

@Composable
private fun ButtonSizes() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            itemVerticalAlignment = Alignment.CenterVertically,
        ) {
            Button("Extra small", onClick = {}, size = ButtonSize.Xs)
            Button("Small", onClick = {}, size = ButtonSize.Sm)
            Button("Default", onClick = {})
            Button("Large", onClick = {}, size = ButtonSize.Lg)
            Button("Extra large", onClick = {}, size = ButtonSize.Xl)
        }
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            itemVerticalAlignment = Alignment.CenterVertically,
        ) {
            listOf(ButtonSize.IconXs, ButtonSize.IconSm, ButtonSize.Icon, ButtonSize.IconLg, ButtonSize.IconXl).forEach { size ->
                Button(onClick = {}, variant = ButtonVariant.Secondary, size = size) {
                    Icon(PhosphorIcons.Regular.Plus, contentDescription = "Add")
                }
            }
        }
    }
}

@Composable
private fun ButtonWithIcon() {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Button(onClick = {}) {
            Icon(PhosphorIcons.Regular.DownloadSimple, contentDescription = null)
            Text("Download")
        }
        Button(onClick = {}, variant = ButtonVariant.Outline) {
            Text("Continue")
            Icon(PhosphorIcons.Regular.ArrowRight, contentDescription = null)
        }
        Button(onClick = {}, variant = ButtonVariant.Destructive) {
            Icon(PhosphorIcons.Regular.Trash, contentDescription = null)
            Text("Delete")
        }
    }
}

@Composable
private fun ButtonDisabled() {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Button("Default", onClick = {}, enabled = false)
        Button("Secondary", onClick = {}, variant = ButtonVariant.Secondary, enabled = false)
        Button("Tinted", onClick = {}, variant = ButtonVariant.Tinted, enabled = false)
        Button("Outline", onClick = {}, variant = ButtonVariant.Outline, enabled = false)
        Button("Destructive", onClick = {}, variant = ButtonVariant.Destructive, enabled = false)
    }
}

@Composable
private fun ButtonBlock() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Button("Continue", onClick = {}, size = ButtonSize.Lg, block = true)
        Button("Not now", onClick = {}, size = ButtonSize.Lg, variant = ButtonVariant.Secondary, block = true)
        Button("Learn more", onClick = {}, variant = ButtonVariant.Tinted, block = true)
    }
}
