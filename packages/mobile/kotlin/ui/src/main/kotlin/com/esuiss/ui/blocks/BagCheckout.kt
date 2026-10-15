package com.esuiss.ui.blocks

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.nestedscroll.nestedScroll
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
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.bold.Check
import com.adamglin.phosphoricons.light.DeviceMobile
import com.adamglin.phosphoricons.light.DeviceMobileCamera
import com.adamglin.phosphoricons.light.Headphones
import com.adamglin.phosphoricons.regular.CreditCard
import com.adamglin.phosphoricons.regular.Wallet
import com.esuiss.ui.components.BottomBar
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.Header
import com.esuiss.ui.components.HeaderLargeTitle
import com.esuiss.ui.components.HeaderTitle
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.RadioGroup
import com.esuiss.ui.components.RadioGroupItem
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.rememberHeaderState
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Typography
import java.text.NumberFormat
import java.util.Currency
import java.util.Locale

private val CheckoutRevealEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private class CheckoutItem(val name: String, val variant: String, val price: Double, val icon: ImageVector)

private val CheckoutItems = listOf(
    CheckoutItem("Phone Pro", "256 GB · Cosmic Orange", 1099.0, PhosphorIcons.Light.DeviceMobile),
    CheckoutItem("Pods Studio", "Midnight", 549.0, PhosphorIcons.Light.Headphones),
    CheckoutItem("Phone Pro Clear Case", "With MagCharge", 49.0, PhosphorIcons.Light.DeviceMobileCamera),
)

private fun checkoutMoney(value: Double): String =
    NumberFormat.getCurrencyInstance(Locale.US).apply { currency = Currency.getInstance("USD") }.format(value)

@Composable
fun BagCheckout(
    modifier: Modifier = Modifier,
    onPlaceOrder: (shipping: String, payment: String, total: Double) -> Unit = { _, _, _ -> },
    onStartOver: () -> Unit = {},
) {
    val colors = EsuissTheme.colors
    var step by rememberSaveable { mutableIntStateOf(0) }
    var shipping by rememberSaveable { mutableStateOf("Standard") }
    var payment by rememberSaveable { mutableStateOf("Card") }
    var placed by rememberSaveable { mutableStateOf(false) }
    val header = rememberHeaderState()
    val total = CheckoutItems.sumOf { it.price } + if (shipping == "Express") 19.0 else 0.0

    Screen(modifier) {
        if (placed) {
            CheckoutPlaced {
                onStartOver()
                placed = false
                step = 0
            }
            return@Screen
        }
        Column(
            Modifier
                .fillMaxSize()
                .nestedScroll(header.nestedScrollConnection),
        ) {
            Header(state = header) {
                HeaderTitle("Checkout")
                HeaderLargeTitle("Checkout")
            }
            Column(
                Modifier
                    .weight(1f)
                    .verticalScroll(rememberScrollState()),
            ) {
                Column(Modifier.padding(horizontal = 20.dp)) {
                    CheckoutStep(
                        index = 0,
                        current = step,
                        title = "Delivery",
                        summary = if (shipping == "Express") "Express · Tomorrow" else "Standard · 3–5 business days",
                        onEdit = { step = 0 },
                    ) {
                        RadioGroup(value = shipping, onValueChange = { shipping = it }, modifier = Modifier.semantics { contentDescription = "Delivery" }) {
                            CheckoutChoice("Standard", shipping == "Standard") {
                                BasicText("Standard · 3–5 business days", modifier = Modifier.weight(1f), style = Typography.base.copy(color = colors.foreground))
                                BasicText("Free", style = Typography.base.copy(color = colors.foreground))
                            }
                            CheckoutChoice("Express", shipping == "Express") {
                                BasicText("Express · Tomorrow", modifier = Modifier.weight(1f), style = Typography.base.copy(color = colors.foreground))
                                BasicText("$19", style = Typography.base.copy(color = colors.foreground))
                            }
                        }
                    }
                    CheckoutStep(
                        index = 1,
                        current = step,
                        title = "Payment",
                        summary = if (payment == "Card") "Card •••• 4242" else "suiss Pay",
                        onEdit = { step = 1 },
                    ) {
                        RadioGroup(value = payment, onValueChange = { payment = it }, modifier = Modifier.semantics { contentDescription = "Payment" }) {
                            CheckoutChoice("Card", payment == "Card") {
                                Icon(PhosphorIcons.Regular.CreditCard, contentDescription = null, size = 18.dp, tint = colors.foreground)
                                BasicText("Credit card · •••• 4242", modifier = Modifier.weight(1f), style = Typography.base.copy(color = colors.foreground))
                            }
                            CheckoutChoice("Pay", payment == "Pay") {
                                Icon(PhosphorIcons.Regular.Wallet, contentDescription = null, size = 18.dp, tint = colors.foreground)
                                BasicText("suiss Pay", modifier = Modifier.weight(1f), style = Typography.base.copy(color = colors.foreground))
                            }
                        }
                    }
                    CheckoutStep(index = 2, current = step, title = "Review", summary = null, onEdit = { step = 2 }) {
                        BasicText(
                            "By placing your order, you agree to the Sales Policy.",
                            style = Typography.sm.copy(color = colors.mutedForeground),
                        )
                    }
                }
                CheckoutSummary(total)
            }
            BottomBar(separator = true) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Column(
                        Modifier
                            .weight(1f)
                            .semantics(mergeDescendants = true) { liveRegion = LiveRegionMode.Polite },
                    ) {
                        BasicText("Total", style = Typography.xs.copy(color = colors.mutedForeground))
                        BasicText(
                            checkoutMoney(total),
                            style = Typography.lg.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                        )
                    }
                    when (step) {
                        0 -> Button("Continue to Payment", { step = 1 }, size = ButtonSize.Lg)
                        1 -> Button("Continue to Review", { step = 2 }, size = ButtonSize.Lg)
                        else -> Button(
                            "Place Order",
                            {
                                onPlaceOrder(shipping, payment, total)
                                placed = true
                            },
                            size = ButtonSize.Lg,
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun CheckoutStep(
    index: Int,
    current: Int,
    title: String,
    summary: String?,
    onEdit: () -> Unit,
    content: @Composable ColumnScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val open = current == index
    val done = current > index
    val badge by animateColorAsState(
        when {
            done -> Palette.green500
            open -> colors.foreground
            else -> colors.secondary
        },
        tween(250),
        label = "badge",
    )
    Column(Modifier.fillMaxWidth()) {
        Column(
            Modifier
                .fillMaxWidth()
                .padding(vertical = 18.dp),
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Box(
                    Modifier
                        .size(26.dp)
                        .background(badge, CircleShape)
                        .clearAndSetSemantics {},
                    contentAlignment = Alignment.Center,
                ) {
                    if (done) {
                        Icon(PhosphorIcons.Bold.Check, contentDescription = null, size = 13.dp, tint = colors.primaryForeground)
                    } else {
                        BasicText(
                            (index + 1).toString(),
                            style = Typography.sm.copy(
                                color = if (open) colors.background else colors.mutedForeground,
                                fontWeight = FontWeight.SemiBold,
                            ),
                        )
                    }
                }
                BasicText(
                    title,
                    modifier = Modifier
                        .weight(1f)
                        .semantics {
                            heading()
                            stateDescription = when {
                                open -> "Current step"
                                done -> "Done"
                                else -> "Not started"
                            }
                        },
                    style = Typography.xl.copy(
                        color = if (open || done) colors.foreground else colors.mutedForeground,
                        fontWeight = FontWeight.SemiBold,
                    ),
                )
                if (done) CheckoutLink("Edit ›", "Edit ${title.lowercase()}", onEdit)
            }
            if (done && summary != null) {
                BasicText(
                    summary,
                    modifier = Modifier.padding(start = 36.dp, top = 6.dp),
                    style = Typography.sm.copy(color = colors.mutedForeground),
                )
            }
            AnimatedVisibility(
                visible = open,
                enter = expandVertically(tween(450, easing = CheckoutRevealEasing)) + fadeIn(tween(300)),
                exit = shrinkVertically(tween(450, easing = CheckoutRevealEasing)) + fadeOut(tween(200)),
            ) {
                Column(
                    Modifier.padding(start = 36.dp, top = 16.dp, bottom = 4.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    content = content,
                )
            }
        }
        Box(
            Modifier
                .fillMaxWidth()
                .height(1.dp)
                .background(colors.border),
        )
    }
}

@Composable
private fun CheckoutChoice(value: String, selected: Boolean, content: @Composable RowScope.() -> Unit) {
    val colors = EsuissTheme.colors
    val shape = RoundedCornerShape(14.dp)
    val border by animateColorAsState(if (selected) colors.primary else colors.input, tween(200), label = "border")
    RadioGroupItem(
        value = value,
        modifier = Modifier
            .fillMaxWidth()
            .border(if (selected) 2.dp else 1.dp, border, shape)
            .padding(horizontal = 16.dp, vertical = 14.dp),
        label = {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(start = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically,
                content = content,
            )
        },
    )
}

@Composable
private fun CheckoutSummary(total: Double) {
    val colors = EsuissTheme.colors
    Column(
        Modifier
            .padding(top = 24.dp)
            .fillMaxWidth()
            .background(colors.muted)
            .padding(horizontal = 24.dp, vertical = 28.dp)
            .semantics { contentDescription = "Order summary" },
        verticalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        BasicText(
            "Order summary",
            modifier = Modifier.semantics { heading() },
            style = Typography.lg.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
        )
        CheckoutItems.forEach { item ->
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
                Box(
                    Modifier
                        .size(48.dp)
                        .background(colors.secondary, RoundedCornerShape(10.dp)),
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(item.icon, contentDescription = null, size = 26.dp, tint = colors.mutedForeground)
                }
                Column(Modifier.weight(1f)) {
                    BasicText(item.name, style = Typography.sm.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold))
                    BasicText(item.variant, style = Typography.xs.copy(color = colors.mutedForeground))
                }
                BasicText(checkoutMoney(item.price), style = Typography.sm.copy(color = colors.foreground, fontFeatureSettings = "tnum"))
            }
        }
        Box(
            Modifier
                .fillMaxWidth()
                .height(1.dp)
                .background(colors.border),
        )
        Row(verticalAlignment = Alignment.CenterVertically) {
            BasicText(
                "Total",
                modifier = Modifier.weight(1f),
                style = Typography.base.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
            )
            BasicText(
                checkoutMoney(total),
                style = Typography.lg.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
            )
        }
    }
}

@Composable
private fun CheckoutLink(text: String, description: String, onClick: () -> Unit) {
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    BasicText(
        text,
        modifier = Modifier
            .graphicsLayer { alpha = if (pressed) 0.8f else 1f }
            .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onClick)
            .semantics { contentDescription = description }
            .padding(vertical = 8.dp),
        style = Typography.sm.copy(color = EsuissTheme.colors.primary),
    )
}

@Composable
private fun CheckoutPlaced(onStartOver: () -> Unit) {
    val colors = EsuissTheme.colors
    val appear = remember { Animatable(0f) }
    LaunchedEffect(Unit) { appear.animateTo(1f, tween(1000, easing = CheckoutRevealEasing)) }
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
            .graphicsLayer {
                alpha = appear.value
                translationY = (1f - appear.value) * 18.dp.toPx()
            },
        verticalArrangement = Arrangement.spacedBy(14.dp, Alignment.CenterVertically),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Box(
            Modifier
                .size(76.dp)
                .background(Palette.green500, CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            Icon(PhosphorIcons.Bold.Check, contentDescription = null, size = 38.dp, tint = colors.primaryForeground)
        }
        BasicText(
            "Thank you. Your order is in.",
            modifier = Modifier.semantics { heading() },
            style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
        )
        BasicText(
            "Your order number is W1049. We sent a confirmation email.",
            style = Typography.lg.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
        )
        BasicText(
            "Start over ›",
            modifier = Modifier
                .graphicsLayer { alpha = if (pressed) 0.8f else 1f }
                .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onStartOver),
            style = Typography.lg.copy(color = colors.primary),
        )
    }
}
