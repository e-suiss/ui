package com.esuiss.catalog.stories.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.CaretUpDown
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Collapsible
import com.esuiss.ui.components.CollapsibleContent
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Text
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

val collapsibleStories = StoryGroup(
    section = Section.Components,
    title = "Collapsible",
    stories = listOf(
        Story("Default") { CollapsibleDemo() },
        Story("OpenByDefault") { CollapsibleDemo(initialOpen = true) },
        Story("Disabled") { CollapsibleDemo(disabled = true) },
    ),
)

private val CollapsibleRepositories = listOf("esuiss/ui", "esuiss/docs", "esuiss/cli")

@Composable
private fun CollapsibleRepository(name: String) {
    Text(
        name,
        modifier = Modifier
            .fillMaxWidth()
            .background(EsuissTheme.colors.muted, RoundedCornerShape(Radius.xl2))
            .padding(horizontal = 16.dp, vertical = 8.dp),
        style = Typography.sm,
    )
}

@Composable
private fun CollapsibleDemo(initialOpen: Boolean = false, disabled: Boolean = false) {
    var open by rememberSaveable { mutableStateOf(initialOpen) }
    Collapsible(
        expanded = open,
        onExpandedChange = { open = it },
        modifier = Modifier.fillMaxWidth(),
        enabled = !disabled,
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    "@ademceper starred 3 repositories",
                    modifier = Modifier.weight(1f),
                    style = Typography.sm.copy(fontWeight = FontWeight.Medium),
                )
                Button(
                    onClick = { open = !open },
                    variant = ButtonVariant.Ghost,
                    size = ButtonSize.IconSm,
                    enabled = !disabled,
                ) {
                    Icon(PhosphorIcons.Regular.CaretUpDown, contentDescription = "Toggle", size = 16.dp)
                }
            }
            CollapsibleRepository(CollapsibleRepositories[0])
            CollapsibleContent {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    CollapsibleRepositories.drop(1).forEach { CollapsibleRepository(it) }
                }
            }
        }
    }
}
