package com.esuiss.catalog.stories.patterns

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.CalendarBlank
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Avatar
import com.esuiss.ui.components.AvatarFallback
import com.esuiss.ui.components.AvatarSize
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Text
import com.esuiss.ui.patterns.Preview
import com.esuiss.ui.patterns.PreviewContent
import com.esuiss.ui.patterns.PreviewTrigger
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

val previewStories = StoryGroup(
    section = Section.Patterns,
    title = "Preview",
    stories = listOf(
        Story("Default") { PreviewDemo() },
        Story("OpenByDefault") { PreviewDemo(defaultOpen = true) },
        Story("WithCloseButton") { PreviewDemo(defaultOpen = true, showCloseButton = true) },
        Story("WithCloseLabel") { PreviewDemo(defaultOpen = true, showCloseButton = true, closeLabel = "Done") },
        Story("Attached") { PreviewDemo(defaultOpen = true, floating = false) },
    ),
)

@Composable
private fun PreviewProfileCard() {
    val colors = EsuissTheme.colors
    Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
        Avatar(size = AvatarSize.Lg, contentDescription = "Ada Lovelace") {
            AvatarFallback("AL")
        }
        Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text("@ada", style = Typography.sm.copy(fontWeight = FontWeight.SemiBold))
            Text(
                "Mathematician and writer, known for her work on the Analytical Engine.",
                style = Typography.sm,
            )
            Row(
                modifier = Modifier.padding(top = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Icon(PhosphorIcons.Regular.CalendarBlank, contentDescription = null, size = 16.dp, tint = colors.labelSecondary)
                Text("Joined December 2021", style = Typography.xs.copy(color = colors.labelSecondary))
            }
        }
    }
}

@Composable
private fun PreviewDemo(
    defaultOpen: Boolean = false,
    floating: Boolean = true,
    showCloseButton: Boolean = false,
    closeLabel: String? = null,
) {
    var open by rememberSaveable { mutableStateOf(defaultOpen) }
    Box(Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
        Preview(open = open, onOpenChange = { open = it }, floating = floating) {
            PreviewTrigger("@ada")
            PreviewContent(
                modifier = Modifier.semantics { contentDescription = "@ada" },
                showCloseButton = showCloseButton,
                closeLabel = closeLabel,
            ) {
                PreviewProfileCard()
            }
        }
    }
}
