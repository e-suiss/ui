package com.esuiss.ui.blocks

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Camera
import com.adamglin.phosphoricons.regular.DeviceMobile
import com.adamglin.phosphoricons.regular.DeviceMobileCamera
import com.adamglin.phosphoricons.regular.DeviceTablet
import com.adamglin.phosphoricons.regular.Headphones
import com.adamglin.phosphoricons.regular.Laptop
import com.adamglin.phosphoricons.regular.Palette
import com.adamglin.phosphoricons.regular.Plug
import com.adamglin.phosphoricons.regular.Sparkle
import com.adamglin.phosphoricons.regular.Watch
import com.esuiss.ui.components.Chip
import com.esuiss.ui.components.ChipGroup
import com.esuiss.ui.components.Screen
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

private class NavCategory(val label: String, val icon: ImageVector)

private val NavCategoryList = listOf(
    NavCategory("Laptop", PhosphorIcons.Regular.Laptop),
    NavCategory("Phone", PhosphorIcons.Regular.DeviceMobile),
    NavCategory("Pad", PhosphorIcons.Regular.DeviceTablet),
    NavCategory("Watch", PhosphorIcons.Regular.Watch),
    NavCategory("Pods", PhosphorIcons.Regular.Headphones),
    NavCategory("Cases", PhosphorIcons.Regular.DeviceMobileCamera),
    NavCategory("Camera", PhosphorIcons.Regular.Camera),
    NavCategory("Colors", PhosphorIcons.Regular.Palette),
    NavCategory("Pro", PhosphorIcons.Regular.Sparkle),
    NavCategory("Accessories", PhosphorIcons.Regular.Plug),
)

@Composable
fun NavCategories(
    modifier: Modifier = Modifier,
    onSelectCategory: (category: String) -> Unit = {},
    onAskSpecialist: () -> Unit = {},
    onFindStore: () -> Unit = {},
) {
    val colors = EsuissTheme.colors
    var selected by rememberSaveable { mutableStateOf("Phone") }

    Screen(modifier) {
        Column(
            Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(top = 44.dp, bottom = 40.dp),
            verticalArrangement = Arrangement.spacedBy(28.dp),
        ) {
            Column(
                Modifier.padding(horizontal = 24.dp),
                verticalArrangement = Arrangement.spacedBy(20.dp),
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    BasicText(
                        "Store.",
                        modifier = Modifier.semantics { heading() },
                        style = Typography.xl3.copy(color = colors.label, fontWeight = FontWeight.Bold),
                    )
                    BasicText(
                        "The best way to buy the suiss products you love.",
                        style = Typography.xl.copy(color = colors.labelSecondary),
                    )
                }
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    BasicText("Need shopping help?", style = Typography.xs.copy(color = colors.labelSecondary, fontWeight = FontWeight.SemiBold))
                    NavLink("Ask a Specialist ›", onAskSpecialist)
                    NavLink("Visit a suiss Store near you ›", onFindStore)
                }
            }
            ChipGroup(
                value = selected,
                onValueChange = { value ->
                    if (value != null && value != selected) {
                        selected = value
                        onSelectCategory(value)
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .semantics { contentDescription = "Categories" },
                scrollable = true,
                contentPadding = PaddingValues(horizontal = 24.dp, vertical = 4.dp),
            ) {
                NavCategoryList.forEach { category ->
                    Chip(category.label, category.label, icon = category.icon)
                }
            }
            Column(Modifier.padding(horizontal = 24.dp)) {
                Box(
                    Modifier
                        .fillMaxWidth()
                        .height(1.dp)
                        .background(colors.separator),
                )
                BasicText(
                    buildAnnotatedString {
                        append("The latest. ")
                        withStyle(SpanStyle(color = colors.labelSecondary)) { append("Take a look at what's new in $selected.") }
                    },
                    modifier = Modifier
                        .padding(top = 22.dp)
                        .semantics { liveRegion = LiveRegionMode.Polite },
                    style = Typography.xl2.copy(color = colors.label, fontWeight = FontWeight.SemiBold),
                )
            }
        }
    }
}

@Composable
private fun NavLink(text: String, onClick: () -> Unit) {
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    BasicText(
        text,
        modifier = Modifier
            .graphicsLayer { alpha = if (pressed) 0.5f else 1f }
            .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onClick)
            .padding(vertical = 4.dp),
        style = Typography.sm.copy(color = EsuissTheme.colors.link),
    )
}
