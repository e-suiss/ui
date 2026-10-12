package com.esuiss.ui.blocks

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
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
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Light
import com.adamglin.phosphoricons.light.DeviceMobile
import com.adamglin.phosphoricons.light.DeviceMobileCamera
import com.adamglin.phosphoricons.light.Headphones
import com.esuiss.ui.components.BottomBar
import com.esuiss.ui.components.BottomBarContent
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Screen
import com.esuiss.ui.interactions.Stepper
import com.esuiss.ui.interactions.StepperDecrement
import com.esuiss.ui.interactions.StepperGroup
import com.esuiss.ui.interactions.StepperIncrement
import com.esuiss.ui.interactions.StepperInput
import com.esuiss.ui.interactions.StepperSeparator
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import java.text.NumberFormat
import java.util.Currency
import java.util.Locale

private class ReviewItem(val name: String, val variant: String, val price: Double, val icon: ImageVector, val quantity: Int)

private val ReviewItems = listOf(
    ReviewItem("Phone Pro", "256 GB · Cosmic Orange", 1099.0, PhosphorIcons.Light.DeviceMobile, 1),
    ReviewItem("Pods Studio", "Midnight", 549.0, PhosphorIcons.Light.Headphones, 1),
    ReviewItem("Phone Pro Clear Case", "With MagCharge", 49.0, PhosphorIcons.Light.DeviceMobileCamera, 2),
)

private fun reviewMoney(value: Double): String =
    NumberFormat.getCurrencyInstance(Locale.US).apply { currency = Currency.getInstance("USD") }.format(value)

@Composable
fun BagReview(
    modifier: Modifier = Modifier,
    onCheckout: (method: String) -> Unit = {},
    onShowDetails: (item: String) -> Unit = {},
    onContinueShopping: () -> Unit = {},
    onQuantityChange: (item: String, quantity: Int) -> Unit = { _, _ -> },
    onRemove: (item: String) -> Unit = {},
) {
    val colors = EsuissTheme.colors
    val items = remember { mutableStateListOf<ReviewItem>().apply { addAll(ReviewItems) } }
    val bag = items.filter { it.quantity > 0 }
    val subtotal = bag.sumOf { it.price * it.quantity }

    fun setQuantity(name: String, quantity: Int) {
        val index = items.indexOfFirst { it.name == name }
        if (index < 0) return
        val item = items[index]
        if (item.quantity == quantity) return
        if (quantity == 0) onRemove(name) else onQuantityChange(name, quantity)
        items[index] = ReviewItem(item.name, item.variant, item.price, item.icon, quantity)
    }

    Screen(modifier) {
        Column(Modifier.fillMaxSize()) {
            Column(
                Modifier
                    .weight(1f)
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 20.dp, vertical = 32.dp),
            ) {
                BasicText(
                    if (bag.isNotEmpty()) "Your bag total is ${reviewMoney(subtotal)}." else "Your bag is empty.",
                    modifier = Modifier
                        .fillMaxWidth()
                        .semantics {
                            heading()
                            liveRegion = LiveRegionMode.Polite
                        },
                    style = Typography.xl3.copy(color = colors.label, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
                )
                BasicText(
                    "Free delivery and free returns on every order.",
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp, bottom = 20.dp),
                    style = Typography.base.copy(color = colors.labelSecondary, textAlign = TextAlign.Center),
                )
                if (bag.isEmpty()) {
                    Button(
                        "Continue Shopping",
                        {
                            onContinueShopping()
                            items.clear()
                            items.addAll(ReviewItems)
                        },
                        modifier = Modifier.align(Alignment.CenterHorizontally),
                        size = ButtonSize.Lg,
                    )
                }
                bag.forEach { item ->
                    key(item.name) {
                        ReviewRow(
                            item = item,
                            onQuantity = { setQuantity(item.name, it) },
                            onShowDetails = { onShowDetails(item.name) },
                        )
                    }
                }
                if (bag.isNotEmpty()) {
                    Box(
                        Modifier
                            .fillMaxWidth()
                            .height(1.dp)
                            .background(colors.separator),
                    )
                    Column(
                        Modifier.padding(top = 20.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp),
                    ) {
                        ReviewTotalRow("Subtotal", reviewMoney(subtotal))
                        ReviewTotalRow("Shipping", "FREE")
                        Box(
                            Modifier
                                .fillMaxWidth()
                                .height(1.dp)
                                .background(colors.separator),
                        )
                        Row(Modifier.padding(top = 2.dp)) {
                            BasicText(
                                "Total",
                                modifier = Modifier.weight(1f),
                                style = Typography.xl2.copy(color = colors.label, fontWeight = FontWeight.SemiBold),
                            )
                            BasicText(
                                reviewMoney(subtotal),
                                style = Typography.xl2.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                            )
                        }
                    }
                }
            }
            if (bag.isNotEmpty()) {
                BottomBar(separator = true) {
                    BottomBarContent {
                        ReviewPayButton { onCheckout("SuissPay") }
                        Button("Check Out", { onCheckout("Default") }, size = ButtonSize.Lg, block = true)
                    }
                }
            }
        }
    }
}

@Composable
private fun ReviewRow(item: ReviewItem, onQuantity: (Int) -> Unit, onShowDetails: () -> Unit) {
    val colors = EsuissTheme.colors
    val appear = remember { Animatable(0f) }
    LaunchedEffect(Unit) { appear.animateTo(1f, tween(700)) }
    Column(
        Modifier.graphicsLayer {
            alpha = appear.value
            translationY = (1f - appear.value) * 6.dp.toPx()
        },
    ) {
        Box(
            Modifier
                .fillMaxWidth()
                .height(1.dp)
                .background(colors.separator),
        )
        Row(
            modifier = Modifier.padding(vertical = 22.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            Box(
                Modifier
                    .size(80.dp)
                    .background(colors.surfaceSecondary, RoundedCornerShape(Radius.xl))
                    .clearAndSetSemantics {},
                contentAlignment = Alignment.Center,
            ) {
                Icon(item.icon, contentDescription = null, size = 44.dp, tint = colors.labelSecondary)
            }
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    BasicText(
                        item.name,
                        modifier = Modifier.semantics { heading() },
                        style = Typography.xl.copy(color = colors.label, fontWeight = FontWeight.SemiBold),
                    )
                    BasicText(item.variant, style = Typography.sm.copy(color = colors.labelSecondary))
                    ReviewLink("Show product details ›", Modifier.padding(top = 2.dp), onShowDetails)
                }
                Stepper(
                    value = item.quantity.toDouble(),
                    onValueChange = { onQuantity(it.toInt()) },
                    min = 1.0,
                    max = 10.0,
                ) {
                    StepperInput(contentDescription = "${item.name} quantity")
                    StepperGroup {
                        StepperDecrement()
                        StepperSeparator()
                        StepperIncrement()
                    }
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    BasicText(
                        reviewMoney(item.price * item.quantity),
                        modifier = Modifier.weight(1f),
                        style = Typography.xl.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                    )
                    ReviewLink("Remove", Modifier.semantics { contentDescription = "Remove ${item.name}" }) { onQuantity(0) }
                }
            }
        }
    }
}

@Composable
private fun ReviewTotalRow(label: String, value: String) {
    val colors = EsuissTheme.colors
    Row {
        BasicText(label, modifier = Modifier.weight(1f), style = Typography.base.copy(color = colors.label))
        BasicText(value, style = Typography.base.copy(color = colors.label, fontFeatureSettings = "tnum"))
    }
}

@Composable
private fun ReviewLink(text: String, modifier: Modifier = Modifier, onClick: () -> Unit) {
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    BasicText(
        text,
        modifier = modifier
            .graphicsLayer { alpha = if (pressed) 0.5f else 1f }
            .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onClick)
            .padding(vertical = 4.dp),
        style = Typography.sm.copy(color = EsuissTheme.colors.link),
    )
}

@Composable
private fun ReviewPayButton(onClick: () -> Unit) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val shape = RoundedCornerShape(Radius.lg)
    Box(
        Modifier
            .fillMaxWidth()
            .heightIn(min = ButtonSize.Lg.height)
            .graphicsLayer {
                val scale = if (pressed) 0.98f else 1f
                scaleX = scale
                scaleY = scale
            }
            .background(colors.label.copy(alpha = if (pressed) 0.8f else 1f), shape)
            .clickable(interactionSource = interaction, indication = null, onClick = onClick)
            .semantics(mergeDescendants = true) { role = Role.Button },
        contentAlignment = Alignment.Center,
    ) {
        BasicText(
            buildAnnotatedString {
                append("Check Out with ")
                withStyle(SpanStyle(fontWeight = FontWeight.Bold)) { append("suiss") }
                append(" Pay")
            },
            style = Typography.base.copy(color = colors.surface, fontWeight = FontWeight.Medium),
        )
    }
}
