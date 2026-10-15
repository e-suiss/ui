package com.esuiss.catalog.stories.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Bell
import com.adamglin.phosphoricons.regular.CaretRight
import com.adamglin.phosphoricons.regular.ShieldCheck
import com.adamglin.phosphoricons.regular.WifiHigh
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Badge
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Item
import com.esuiss.ui.components.ItemActions
import com.esuiss.ui.components.ItemContent
import com.esuiss.ui.components.ItemDescription
import com.esuiss.ui.components.ItemFooter
import com.esuiss.ui.components.ItemGroup
import com.esuiss.ui.components.ItemGroupVariant
import com.esuiss.ui.components.ItemHeader
import com.esuiss.ui.components.ItemMedia
import com.esuiss.ui.components.ItemMediaVariant
import com.esuiss.ui.components.ItemSeparator
import com.esuiss.ui.components.ItemSize
import com.esuiss.ui.components.ItemTitle
import com.esuiss.ui.components.ItemVariant
import com.esuiss.ui.components.Text
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Typography

val itemStories = StoryGroup(
    section = Section.Components,
    title = "Item",
    stories = listOf(
        Story("Default") { ItemDefault() },
        Story("InsetGroup") { ItemInsetGroup() },
    ),
)

@Composable
private fun ItemCaret() {
    Icon(PhosphorIcons.Regular.CaretRight, contentDescription = null, size = 16.dp, tint = EsuissTheme.colors.mutedForeground)
}

@Composable
private fun ItemDefault() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Item(variant = ItemVariant.Outline, role = null) {
            ItemContent {
                ItemTitle("Basic item")
                ItemDescription("A simple item with a title and a description.")
            }
            ItemActions {
                Button("Action", onClick = {}, variant = ButtonVariant.Outline, size = ButtonSize.Sm)
            }
        }
        Item(variant = ItemVariant.Muted, size = ItemSize.Sm, onClick = {}) {
            ItemMedia(variant = ItemMediaVariant.Icon) {
                Icon(PhosphorIcons.Regular.ShieldCheck, contentDescription = null)
            }
            ItemContent {
                ItemTitle("Your profile has been verified.")
            }
            ItemActions { ItemCaret() }
        }
        Item(variant = ItemVariant.Outline, size = ItemSize.Xs, role = null) {
            ItemHeader {
                ItemTitle("Header")
                Badge("New")
            }
            ItemContent {
                ItemDescription("Items can carry a header and a footer.")
            }
            ItemFooter {
                Text("Footer", style = Typography.sm.copy(color = EsuissTheme.colors.mutedForeground))
            }
        }
    }
}

@Composable
private fun ItemSettingsMedia(icon: ImageVector, background: Color) {
    ItemMedia(variant = ItemMediaVariant.Image) {
        Box(Modifier.matchParentSize().background(background))
        Icon(icon, contentDescription = null, size = 20.dp, tint = EsuissTheme.colors.primaryForeground)
    }
}

@Composable
private fun ItemInsetGroup() {
    val colors = EsuissTheme.colors
    ItemGroup(variant = ItemGroupVariant.Inset) {
        Item(onClick = {}) {
            ItemSettingsMedia(PhosphorIcons.Regular.WifiHigh, Palette.blue500)
            ItemContent {
                ItemTitle("Wi-Fi")
            }
            ItemActions {
                Text("Home")
                ItemCaret()
            }
        }
        ItemSeparator()
        Item(onClick = {}) {
            ItemSettingsMedia(PhosphorIcons.Regular.Bell, Palette.red500)
            ItemContent {
                ItemTitle("Notifications")
                ItemDescription("Banners, sounds, badges")
            }
            ItemActions { ItemCaret() }
        }
    }
}
