package com.esuiss.ui.blocks

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Light
import com.adamglin.phosphoricons.light.DeviceMobile
import com.adamglin.phosphoricons.light.DeviceMobileSpeaker
import com.adamglin.phosphoricons.light.Headphones
import com.adamglin.phosphoricons.light.Laptop
import com.adamglin.phosphoricons.light.Watch
import com.esuiss.ui.components.Carousel
import com.esuiss.ui.components.CarouselContent
import com.esuiss.ui.components.CarouselItem
import com.esuiss.ui.components.CarouselNext
import com.esuiss.ui.components.CarouselPrevious
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.PageIndicator
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.ScreenVariant
import com.esuiss.ui.components.rememberCarouselState
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Shadows
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow

private class CarouselProduct(
    val name: String,
    val tagline: String,
    val price: String,
    val icon: ImageVector,
    val alt: String,
    val kicker: String? = null,
)

private val CarouselProducts = listOf(
    CarouselProduct("Phone Pro", "Pro through and through.", "$999", PhosphorIcons.Light.DeviceMobile, "An orange phone on a warm gradient", "New"),
    CarouselProduct("Book Air", "Supercharged by S5.", "$1,099", PhosphorIcons.Light.Laptop, "A laptop on a wooden sideboard", "New"),
    CarouselProduct("Watch Series 11", "Your best health companion.", "$399", PhosphorIcons.Light.Watch, "A black smartwatch on a dark fabric"),
    CarouselProduct("Phone Air", "The thinnest phone ever.", "$899", PhosphorIcons.Light.DeviceMobileSpeaker, "A silver phone on a light grey background", "New"),
    CarouselProduct("Phone", "More colors. More power.", "$799", PhosphorIcons.Light.DeviceMobile, "A phone floating among blue spheres"),
    CarouselProduct("Pods Studio", "Active Noise Cancellation.", "$549", PhosphorIcons.Light.Headphones, "Black over-ear headphones on a dark background"),
)

@Composable
fun GridCarousel(
    modifier: Modifier = Modifier,
    onSelectProduct: (product: String) -> Unit = {},
) {
    val colors = EsuissTheme.colors
    val state = rememberCarouselState(CarouselProducts.size)

    Screen(modifier, variant = ScreenVariant.Secondary) {
        Column(
            Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(top = 40.dp, bottom = 20.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            BasicText(
                buildAnnotatedString {
                    append("The latest. ")
                    withStyle(SpanStyle(color = colors.mutedForeground)) { append("Fresh favorites of the season.") }
                },
                modifier = Modifier
                    .padding(horizontal = 24.dp)
                    .semantics { heading() },
                style = Typography.xl2.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
            )
            Carousel(state, modifier = Modifier.semantics { contentDescription = "Latest products" }) {
                CarouselContent(
                    contentPadding = PaddingValues(start = 24.dp, end = 48.dp, top = 8.dp, bottom = 24.dp),
                    pageSpacing = 16.dp,
                ) { page ->
                    CarouselItem {
                        CarouselCard(CarouselProducts[page]) { onSelectProduct(CarouselProducts[page].name) }
                    }
                }
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 24.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    PageIndicator(
                        count = CarouselProducts.size,
                        index = state.selectedIndex,
                        onIndexChange = { state.scrollTo(it) },
                        accessibilityLabel = "Latest products",
                    )
                    Spacer(Modifier.weight(1f))
                    CarouselPrevious()
                    CarouselNext()
                }
            }
        }
    }
}

@Composable
private fun CarouselCard(product: CarouselProduct, onClick: () -> Unit) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val scale by animateFloatAsState(if (pressed) 0.98f else 1f, tween(300), label = "press")
    val shape = RoundedCornerShape(18.dp)
    Column(
        Modifier
            .fillMaxWidth()
            .height(440.dp)
            .graphicsLayer {
                scaleX = scale
                scaleY = scale
            }
            .shadow(Shadows.md, shape)
            .clip(shape)
            .background(colors.background, shape)
            .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onClick),
    ) {
        Column(
            Modifier.padding(start = 28.dp, end = 28.dp, top = 28.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp),
        ) {
            if (product.kicker != null) {
                BasicText(
                    product.kicker.uppercase(),
                    style = Typography.xs.copy(color = if (colors.isDark) Palette.amber400 else Palette.amber600, fontWeight = FontWeight.SemiBold, letterSpacing = 0.025.em),
                )
            }
            BasicText(product.name, style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold))
            BasicText(product.tagline, style = Typography.lg.copy(color = colors.foreground))
            BasicText(
                "From ${product.price}",
                modifier = Modifier.padding(top = 6.dp),
                style = Typography.sm.copy(color = colors.mutedForeground),
            )
        }
        Box(
            Modifier
                .padding(20.dp)
                .weight(1f)
                .fillMaxWidth()
                .background(colors.muted, RoundedCornerShape(12.dp))
                .clearAndSetSemantics { contentDescription = product.alt },
            contentAlignment = Alignment.Center,
        ) {
            Icon(product.icon, contentDescription = null, size = 96.dp, tint = colors.mutedForeground)
        }
    }
}
