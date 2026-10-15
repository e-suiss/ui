package com.esuiss.ui.blocks

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.bold.Check
import com.adamglin.phosphoricons.bold.DeviceMobile
import com.adamglin.phosphoricons.bold.LockSimple
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.InputOTPGroup
import com.esuiss.ui.components.InputOTPSlot
import com.esuiss.ui.components.KeyboardScrollView
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.Spinner
import com.esuiss.ui.interactions.OtpAutofill
import com.esuiss.ui.interactions.OtpAutofillInput
import com.esuiss.ui.interactions.OtpAutofillState
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Shadows
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow
import kotlinx.coroutines.delay

private const val DemoCode = "482913"

private val RevealEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private enum class DevicePhase { Ask, Code, Deny, Ok }

private val Copy = mapOf(
    DevicePhase.Ask to ("Approve from your other device." to "We sent a sign-in request to your trusted devices. Tap Allow on the alert below."),
    DevicePhase.Code to ("Enter the verification code." to "Type the 6-digit code shown on your trusted device."),
    DevicePhase.Deny to ("Sign-in denied." to "If this wasn't you, your account is safe. There's nothing else you need to do."),
)

@Composable
fun VerifyDevice(
    modifier: Modifier = Modifier,
    onVerify: suspend (code: String) -> Boolean = { it == DemoCode },
) {
    val colors = EsuissTheme.colors
    val verify by rememberUpdatedState(onVerify)
    var phase by rememberSaveable { mutableStateOf(DevicePhase.Ask) }

    Screen(modifier) {
        if (phase == DevicePhase.Ok) {
            Success { phase = DevicePhase.Ask }
            return@Screen
        }
        KeyboardScrollView(Modifier.fillMaxSize()) {
            Column(
                modifier = Modifier.padding(start = 24.dp, end = 24.dp, top = 48.dp, bottom = 24.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp),
            ) {
                Box(
                    Modifier
                        .size(56.dp)
                        .background(colors.muted, CircleShape),
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(
                        if (phase == DevicePhase.Code) PhosphorIcons.Bold.LockSimple else PhosphorIcons.Bold.DeviceMobile,
                        contentDescription = null,
                        size = 26.dp,
                        tint = colors.primary,
                    )
                }
                val (title, body) = Copy.getValue(phase)
                BasicText(
                    title,
                    modifier = Modifier.semantics { heading() },
                    style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
                )
                BasicText(body, style = Typography.lg.copy(color = colors.mutedForeground))
                Box(
                    Modifier
                        .padding(top = 10.dp)
                        .heightIn(min = 64.dp)
                        .semantics { liveRegion = LiveRegionMode.Polite },
                ) {
                    when (phase) {
                        DevicePhase.Ask -> Row(
                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Spinner(color = colors.mutedForeground)
                            BasicText("Waiting for approval…", style = Typography.sm.copy(color = colors.mutedForeground))
                        }
                        DevicePhase.Code -> OtpAutofill(
                            maxLength = 6,
                            onVerify = { code ->
                                val ok = verify(code)
                                if (ok) {
                                    delay(500)
                                    phase = DevicePhase.Ok
                                }
                                ok
                            },
                        ) {
                            OtpAutofillInput(contentDescription = "Verification code", autoFocus = true) {
                                InputOTPGroup {
                                    repeat(6) { InputOTPSlot(it) }
                                }
                            }
                            if (state == OtpAutofillState.Invalid) {
                                BasicText("Incorrect code.", style = Typography.sm.copy(color = colors.destructive))
                            }
                        }
                        else -> LinkText("Try again ›") { phase = DevicePhase.Ask }
                    }
                }
            }
            TrustedDevice(
                phase = phase,
                onAllow = { phase = DevicePhase.Code },
                onDeny = { phase = DevicePhase.Deny },
                onShowAgain = { phase = DevicePhase.Ask },
            )
        }
    }
}

@Composable
private fun TrustedDevice(
    phase: DevicePhase,
    onAllow: () -> Unit,
    onDeny: () -> Unit,
    onShowAgain: () -> Unit,
) {
    val colors = EsuissTheme.colors
    val shape = RoundedCornerShape(Radius.xl3)
    Box(
        modifier = Modifier
            .padding(horizontal = 16.dp)
            .padding(bottom = 24.dp)
            .fillMaxWidth()
            .height(440.dp)
            .clip(shape)
            .background(Palette.indigo500, shape)
            .background(Palette.black.copy(alpha = 0.18f)),
        contentAlignment = Alignment.Center,
    ) {
        AnimatedContent(
            targetState = phase,
            transitionSpec = {
                (fadeIn(tween(800)) + slideInVertically(tween(800)) { 6 }) togetherWith fadeOut(tween(200))
            },
            label = "alert",
        ) { current ->
            val alertShape = RoundedCornerShape(14.dp)
            Column(
                modifier = Modifier
                    .width(270.dp)
                    .shadow(Shadows.lg, alertShape)
                    .clip(alertShape)
                    .background(colors.popover.copy(alpha = 0.92f), alertShape)
                    .semantics { contentDescription = "Trusted device" },
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                when (current) {
                    DevicePhase.Code -> {
                        AlertBody {
                            BasicText("suiss Account Verification Code", style = alertTitle())
                            BasicText(
                                "482 913",
                                modifier = Modifier.padding(top = 10.dp, bottom = 4.dp),
                                style = Typography.xl3.copy(
                                    color = colors.foreground,
                                    fontWeight = FontWeight.SemiBold,
                                    letterSpacing = 0.1.em,
                                    fontFeatureSettings = "tnum",
                                    textAlign = TextAlign.Center,
                                ),
                            )
                            BasicText("Enter this code on the device you're signing in to.", style = alertMessage())
                        }
                        AlertAction("OK", primary = true) {}
                    }
                    DevicePhase.Deny -> {
                        AlertBody {
                            BasicText("Sign-in blocked", style = alertTitle())
                            BasicText(
                                "If this wasn't you, change your password.",
                                modifier = Modifier.padding(top = 4.dp),
                                style = alertMessage(),
                            )
                        }
                        AlertAction("Show request again", onClick = onShowAgain)
                    }
                    else -> {
                        AlertBody {
                            BasicText("suiss Account Sign-in Requested", style = alertTitle())
                            BasicText(
                                "Your suiss Account is being used to sign in to a device near San Francisco.",
                                modifier = Modifier.padding(top = 4.dp),
                                style = alertMessage(),
                            )
                            MapPreview()
                        }
                        AlertAction("Allow", primary = true, onClick = onAllow)
                        AlertAction("Don't Allow", onClick = onDeny)
                    }
                }
            }
        }
    }
}

@Composable
private fun alertTitle() = Typography.lg.copy(
    color = EsuissTheme.colors.foreground,
    fontWeight = FontWeight.SemiBold,
    textAlign = TextAlign.Center,
)

@Composable
private fun alertMessage() = Typography.sm.copy(color = EsuissTheme.colors.mutedForeground, textAlign = TextAlign.Center)

@Composable
private fun AlertBody(content: @Composable ColumnScope.() -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(start = 16.dp, end = 16.dp, top = 20.dp, bottom = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        content = content,
    )
}

@Composable
private fun MapPreview() {
    val colors = EsuissTheme.colors
    val shape = RoundedCornerShape(10.dp)
    Box(
        Modifier
            .padding(top = 14.dp)
            .fillMaxWidth()
            .height(96.dp)
            .clip(shape)
            .background(colors.primary.copy(alpha = if (colors.isDark) 0.2f else 0.1f), shape)
            .clearAndSetSemantics {}
            .drawBehind {
                val center = Offset(size.width / 2f, size.height * 0.52f)
                drawCircle(colors.primary.copy(alpha = 0.25f), radius = 24.dp.toPx(), center = center)
                drawCircle(colors.primary, radius = 5.dp.toPx(), center = center)
            },
    )
}

@Composable
private fun AlertAction(text: String, primary: Boolean = false, onClick: () -> Unit) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    Column(Modifier.fillMaxWidth()) {
        Box(
            Modifier
                .fillMaxWidth()
                .height(1.dp)
                .background(colors.input.copy(alpha = 0.5f)),
        )
        Box(
            Modifier
                .fillMaxWidth()
                .height(44.dp)
                .alpha(if (pressed) 0.8f else 1f)
                .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onClick),
            contentAlignment = Alignment.Center,
        ) {
            BasicText(
                text,
                style = Typography.lg.copy(
                    color = colors.primary,
                    fontWeight = if (primary) FontWeight.SemiBold else FontWeight.Normal,
                ),
            )
        }
    }
}

@Composable
private fun LinkText(text: String, onClick: () -> Unit) {
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    BasicText(
        text,
        modifier = Modifier
            .graphicsLayer { alpha = if (pressed) 0.8f else 1f }
            .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onClick)
            .padding(vertical = 4.dp),
        style = Typography.base.copy(color = EsuissTheme.colors.primary),
    )
}

@Composable
private fun Success(onStartOver: () -> Unit) {
    val colors = EsuissTheme.colors
    val appear = remember { Animatable(0f) }
    LaunchedEffect(Unit) { appear.animateTo(1f, tween(1000, easing = RevealEasing)) }
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
            "Sign-in approved.",
            modifier = Modifier.semantics { heading() },
            style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
        )
        BasicText(
            "This device was added to your suiss Account.",
            style = Typography.lg.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
        )
        LinkText("Start over ›", onStartOver)
    }
}
