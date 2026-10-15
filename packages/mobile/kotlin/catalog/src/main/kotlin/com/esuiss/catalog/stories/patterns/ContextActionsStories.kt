package com.esuiss.catalog.stories.patterns

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Image
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.MenuItemVariant
import com.esuiss.ui.components.Text
import com.esuiss.ui.patterns.ContextActions
import com.esuiss.ui.patterns.ContextActionsContent
import com.esuiss.ui.patterns.ContextActionsItem
import com.esuiss.ui.patterns.ContextActionsLabel
import com.esuiss.ui.patterns.ContextActionsTrigger
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

val contextActionsStories = StoryGroup(
    section = Section.Patterns,
    title = "Context Actions",
    stories = listOf(
        Story("Default") { ContextActionsDefault() },
        Story("Inline") { ContextActionsInline() },
    ),
)

@Composable
private fun ContextActionsDefault() {
    val colors = EsuissTheme.colors
    val shape = RoundedCornerShape(Radius.xl2)
    ContextActions {
        ContextActionsTrigger(
            modifier = Modifier
                .fillMaxWidth()
                .height(160.dp)
                .clip(shape)
                .background(colors.muted, shape),
            label = "Photo",
        ) {
            Column(
                modifier = Modifier.align(Alignment.Center),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                Icon(PhosphorIcons.Regular.Image, contentDescription = null, size = 32.dp, tint = colors.mutedForeground)
                Text("Long press", style = Typography.sm.copy(color = colors.mutedForeground))
            }
        }
        ContextActionsContent {
            ContextActionsLabel("Photo")
            ContextActionsItem("Copy", onClick = {})
            ContextActionsItem("Share", onClick = {})
            ContextActionsItem("Delete", onClick = {}, variant = MenuItemVariant.Destructive)
        }
    }
}

@Composable
private fun ContextActionsInline() {
    val shape = RoundedCornerShape(Radius.lg)
    Column {
        ContextActions {
            ContextActionsTrigger(
                modifier = Modifier
                    .clip(shape)
                    .background(EsuissTheme.colors.secondary, shape)
                    .padding(horizontal = 12.dp, vertical = 8.dp),
            ) {
                Text("Hold this message")
            }
            ContextActionsContent(cancelLabel = "Close") {
                ContextActionsItem("Reply", onClick = {})
                ContextActionsItem("Forward", onClick = {})
            }
        }
    }
}
