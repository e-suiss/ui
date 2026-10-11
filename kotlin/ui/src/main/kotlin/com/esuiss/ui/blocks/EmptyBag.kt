package com.esuiss.ui.blocks

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
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
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
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
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Light
import com.adamglin.phosphoricons.bold.Check
import com.adamglin.phosphoricons.bold.Plus
import com.adamglin.phosphoricons.light.DeviceMobile
import com.adamglin.phosphoricons.light.Handbag
import com.adamglin.phosphoricons.light.Headphones
import com.adamglin.phosphoricons.light.Watch
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Empty
import com.esuiss.ui.components.EmptyContent
import com.esuiss.ui.components.EmptyHeader
import com.esuiss.ui.components.EmptyMedia
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Screen
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

private val PopEasing = CubicBezierEasing(0.3f, 1.25f, 0.5f, 1f)

private class Product(val name: String, val price: String, val icon: ImageVector)

private val Recommended = listOf(
    Product("Pods Studio", "$549", PhosphorIcons.Light.Headphones),
    Product("Sport Band", "$49", PhosphorIcons.Light.Watch),
    Product("Phone Pro Clear Case", "$49", PhosphorIcons.Light.DeviceMobile),
)

@Composable
fun EmptyBag(
    modifier: Modifier = Modifier,
) {
    val colors = EsuissTheme.colors
    val added = remember { mutableStateListOf<String>() }
    val count = added.size

    Screen(modifier) {
        Column(
            Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(vertical = 16.dp),
        ) {
            Empty {
                EmptyHeader {
                    EmptyMedia {
                        Icon(PhosphorIcons.Light.Handbag, contentDescription = null, size = 46.dp, tint = colors.label)
                        CountBadge(
                            count,
                            Modifier
                                .align(Alignment.BottomEnd)
                                .offset(x = 6.dp, y = 2.dp),
                        )
                    }
                    BasicText(
                        when (count) {
                            0 -> "Your bag is empty."
                            1 -> "There is 1 item in your bag."
                            else -> "There are $count items in your bag."
                        },
                        modifier = Modifier.semantics {
                            heading()
                            liveRegion = LiveRegionMode.Polite
                        },
                        style = Typography.xl3.copy(color = colors.label, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
                    )
                    BasicText(
                        if (count > 0) "Check out now or keep browsing." else "Sign in to see items you saved.",
                        style = Typography.lg.copy(color = colors.labelSecondary, textAlign = TextAlign.Center),
                    )
                }
                EmptyContent {
                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(14.dp, Alignment.CenterHorizontally),
                        verticalArrangement = Arrangement.spacedBy(14.dp),
                    ) {
                        if (count > 0) {
                            Button("Check Out", {}, size = ButtonSize.Lg)
                        } else {
                            Button("Sign In", {}, size = ButtonSize.Lg)
                        }
                        Button("Continue Shopping", {}, variant = ButtonVariant.Outline, size = ButtonSize.Lg)
                    }
                }
            }
            BasicText(
                "You may also like",
                modifier = Modifier
                    .padding(horizontal = 20.dp)
                    .semantics { heading() },
                style = Typography.lg.copy(color = colors.label, fontWeight = FontWeight.SemiBold),
            )
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(PaddingValues(horizontal = 20.dp, vertical = 16.dp)),
                horizontalArrangement = Arrangement.spacedBy(16.dp),
            ) {
                Recommended.forEach { product ->
                    val inBag = product.name in added
                    ProductCard(product, inBag) {
                        if (inBag) added.remove(product.name) else added.add(product.name)
                    }
                }
            }
        }
    }
}

@Composable
private fun CountBadge(count: Int, modifier: Modifier) {
    val colors = EsuissTheme.colors
    AnimatedVisibility(
        visible = count > 0,
        modifier = modifier,
        enter = scaleIn(tween(300, easing = PopEasing)),
        exit = scaleOut(tween(150)),
    ) {
        Box(
            Modifier
                .size(20.dp)
                .background(colors.label, CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            BasicText(
                count.toString(),
                style = Typography.xs3.copy(color = colors.surface, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
            )
        }
    }
}

@Composable
private fun ProductCard(product: Product, inBag: Boolean, onToggle: () -> Unit) {
    val colors = EsuissTheme.colors
    Column(Modifier.width(220.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        Box(
            Modifier
                .fillMaxWidth()
                .aspectRatio(1.2f)
                .background(colors.surfaceSecondary, RoundedCornerShape(16.dp))
                .clearAndSetSemantics {},
            contentAlignment = Alignment.Center,
        ) {
            Icon(product.icon, contentDescription = null, size = 64.dp, tint = colors.labelTertiary)
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                BasicText(product.name, style = Typography.base.copy(color = colors.label, fontWeight = FontWeight.SemiBold))
                BasicText(product.price, style = Typography.sm.copy(color = colors.labelSecondary))
            }
            AddButton(product.name, inBag, onToggle)
        }
    }
}

@Composable
private fun AddButton(name: String, inBag: Boolean, onToggle: () -> Unit) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val fill by animateColorAsState(
        when {
            inBag -> colors.success
            pressed -> colors.accentPressed
            else -> colors.accent
        },
        tween(250),
        label = "fill",
    )
    Box(
        Modifier
            .size(44.dp)
            .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onToggle)
            .semantics {
                contentDescription = if (inBag) "Remove $name from bag" else "Add $name to bag"
                stateDescription = if (inBag) "In bag" else "Not in bag"
            },
        contentAlignment = Alignment.Center,
    ) {
        Box(
            Modifier
                .size(30.dp)
                .graphicsLayer {
                    val scale = if (pressed) 0.92f else 1f
                    scaleX = scale
                    scaleY = scale
                }
                .background(fill, CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                if (inBag) PhosphorIcons.Bold.Check else PhosphorIcons.Bold.Plus,
                contentDescription = null,
                size = 15.dp,
                tint = colors.onAccent,
            )
        }
    }
}
