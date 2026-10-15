package com.esuiss.ui.blocks

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Light
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.bold.Check
import com.adamglin.phosphoricons.bold.Plus
import com.adamglin.phosphoricons.light.DeviceMobile
import com.adamglin.phosphoricons.light.DeviceMobileCamera
import com.adamglin.phosphoricons.light.Headphones
import com.adamglin.phosphoricons.light.Keyboard
import com.adamglin.phosphoricons.light.PencilSimple
import com.adamglin.phosphoricons.light.Watch
import com.adamglin.phosphoricons.regular.Handbag
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.ToggleGroup
import com.esuiss.ui.components.ToggleGroupItem
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Typography

private val AccessoryPopEasing = CubicBezierEasing(0.3f, 1.25f, 0.5f, 1f)

private val AccessoryEnterEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private class Accessory(val name: String, val category: String, val price: String, val icon: ImageVector)

private val AccessoryFilters = listOf("All", "Audio", "Cases", "Bands", "Pad")

private val Accessories = listOf(
    Accessory("Pods Studio Headphones", "Audio", "$549", PhosphorIcons.Light.Headphones),
    Accessory("Phone Pro Clear Case", "Cases", "$49", PhosphorIcons.Light.DeviceMobileCamera),
    Accessory("Sport Band", "Bands", "$49", PhosphorIcons.Light.Watch),
    Accessory("Keyboard Folio for Pad", "Pad", "$299", PhosphorIcons.Light.Keyboard),
    Accessory("Pods Sage Headphones", "Audio", "$349", PhosphorIcons.Light.Headphones),
    Accessory("Phone Silicone Case", "Cases", "$49", PhosphorIcons.Light.DeviceMobile),
    Accessory("Solo Loop", "Bands", "$49", PhosphorIcons.Light.Watch),
    Accessory("Pencil Pro", "Pad", "$129", PhosphorIcons.Light.PencilSimple),
)

@Composable
fun GridAccessories(
    modifier: Modifier = Modifier,
    onAddToBag: (item: String) -> Unit = {},
    onRemoveFromBag: (item: String) -> Unit = {},
    onFilterChange: (category: String) -> Unit = {},
) {
    val colors = EsuissTheme.colors
    var filter by rememberSaveable { mutableStateOf("All") }
    val bag = remember { mutableStateListOf<String>() }
    val items = Accessories.filter { filter == "All" || it.category == filter }

    Screen(modifier) {
        Column(
            Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(vertical = 36.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp),
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp),
            ) {
                Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                    BasicText(
                        "Accessories",
                        modifier = Modifier.semantics { heading() },
                        style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
                    )
                    BasicText("Designed for every suiss device.", style = Typography.base.copy(color = colors.mutedForeground))
                }
                AccessoryBag(bag.size)
            }
            Row(
                Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 20.dp),
            ) {
                ToggleGroup(
                    value = filter,
                    onValueChange = { value ->
                        if (value != null && value != filter) {
                            filter = value
                            onFilterChange(value)
                        }
                    },
                    modifier = Modifier.semantics { contentDescription = "Category" },
                ) {
                    AccessoryFilters.forEach { ToggleGroupItem(it, it) }
                }
            }
            Column(
                Modifier.padding(horizontal = 20.dp),
                verticalArrangement = Arrangement.spacedBy(24.dp),
            ) {
                items.chunked(2).forEach { pair ->
                    Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                        pair.forEach { item ->
                            key(filter, item.name) {
                                AccessoryTile(
                                    item = item,
                                    inBag = item.name in bag,
                                    modifier = Modifier.weight(1f),
                                ) {
                                    if (item.name in bag) {
                                        onRemoveFromBag(item.name)
                                        bag.remove(item.name)
                                    } else {
                                        onAddToBag(item.name)
                                        bag.add(item.name)
                                    }
                                }
                            }
                        }
                        if (pair.size == 1) Spacer(Modifier.weight(1f))
                    }
                }
            }
        }
    }
}

@Composable
private fun AccessoryBag(count: Int) {
    val colors = EsuissTheme.colors
    Box(
        Modifier
            .padding(top = 8.dp, end = 8.dp)
            .semantics {
                contentDescription = "$count items in bag"
                liveRegion = LiveRegionMode.Polite
            },
    ) {
        Icon(PhosphorIcons.Regular.Handbag, contentDescription = null, size = 22.dp, tint = colors.foreground)
        AnimatedVisibility(
            visible = count > 0,
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .offset(x = 8.dp, y = 4.dp),
            enter = scaleIn(tween(300, easing = AccessoryPopEasing)),
            exit = scaleOut(tween(150)),
        ) {
            Box(
                Modifier
                    .heightIn(min = 16.dp)
                    .background(colors.foreground, CircleShape)
                    .padding(horizontal = 5.dp),
                contentAlignment = Alignment.Center,
            ) {
                BasicText(
                    count.toString(),
                    style = Typography.xs3.copy(color = colors.background, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                )
            }
        }
    }
}

@Composable
private fun AccessoryTile(item: Accessory, inBag: Boolean, modifier: Modifier, onToggle: () -> Unit) {
    val colors = EsuissTheme.colors
    val appear = remember { Animatable(0f) }
    LaunchedEffect(Unit) { appear.animateTo(1f, tween(1000, easing = AccessoryEnterEasing)) }
    Column(
        modifier.graphicsLayer {
            alpha = appear.value
            translationY = (1f - appear.value) * 10.dp.toPx()
        },
    ) {
        Box(
            Modifier
                .fillMaxWidth()
                .aspectRatio(1f)
                .background(colors.muted, RoundedCornerShape(16.dp))
                .clearAndSetSemantics {},
            contentAlignment = Alignment.Center,
        ) {
            Icon(item.icon, contentDescription = null, size = 64.dp, tint = colors.mutedForeground)
        }
        BasicText(
            item.name,
            modifier = Modifier.padding(top = 12.dp),
            style = Typography.base.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
            minLines = 2,
            maxLines = 2,
        )
        Row(
            modifier = Modifier.padding(top = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            BasicText(item.price, modifier = Modifier.weight(1f), style = Typography.base.copy(color = colors.foreground))
            AccessoryAddButton(item.name, inBag, onToggle)
        }
    }
}

@Composable
private fun AccessoryAddButton(name: String, inBag: Boolean, onToggle: () -> Unit) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val width by animateDpAsState(if (inBag) 84.dp else 30.dp, tween(300, easing = AccessoryPopEasing), label = "width")
    val fill by animateColorAsState(
        if (inBag) Palette.green500 else colors.primary,
        tween(300),
        label = "fill",
    )
    Box(
        Modifier
            .height(44.dp)
            .alpha(if (pressed) 0.8f else 1f)
            .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onToggle)
            .semantics {
                contentDescription = if (inBag) "Remove $name from bag" else "Add $name to bag"
                stateDescription = if (inBag) "In bag" else "Not in bag"
            },
        contentAlignment = Alignment.CenterEnd,
    ) {
        Row(
            Modifier
                .width(width)
                .height(30.dp)
                .clip(CircleShape)
                .background(fill, CircleShape),
            horizontalArrangement = Arrangement.spacedBy(4.dp, Alignment.CenterHorizontally),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(
                if (inBag) PhosphorIcons.Bold.Check else PhosphorIcons.Bold.Plus,
                contentDescription = null,
                size = 15.dp,
                tint = colors.primaryForeground,
            )
            AnimatedVisibility(visible = inBag, enter = fadeIn(tween(300))) {
                BasicText("In bag", style = Typography.xs.copy(color = colors.primaryForeground, fontWeight = FontWeight.Medium), maxLines = 1, softWrap = false)
            }
        }
    }
}
