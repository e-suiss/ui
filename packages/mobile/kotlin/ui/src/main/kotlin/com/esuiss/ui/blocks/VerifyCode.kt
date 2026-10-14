package com.esuiss.ui.blocks

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.bold.Check
import com.adamglin.phosphoricons.bold.LockSimple
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.InputOTPGroup
import com.esuiss.ui.components.InputOTPSlot
import com.esuiss.ui.components.KeyboardScrollView
import com.esuiss.ui.components.Screen
import com.esuiss.ui.interactions.OtpAutofill
import com.esuiss.ui.interactions.OtpAutofillInput
import com.esuiss.ui.interactions.OtpAutofillState
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.delay

private const val DemoCode = "482913"

private val RevealEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

@Composable
fun VerifyCode(
    modifier: Modifier = Modifier,
    onVerify: suspend (code: String) -> Boolean = { it == DemoCode },
    onHelp: () -> Unit = {},
) {
    val colors = EsuissTheme.colors
    val verify by rememberUpdatedState(onVerify)
    var verified by rememberSaveable { mutableStateOf(false) }
    var attempt by remember { mutableIntStateOf(0) }
    var left by rememberSaveable { mutableIntStateOf(30) }

    LaunchedEffect(left) {
        if (left <= 0) return@LaunchedEffect
        delay(1000)
        left -= 1
    }

    Screen(modifier) {
        if (verified) {
            Success {
                verified = false
                attempt += 1
            }
            return@Screen
        }
        BoxWithConstraints(Modifier.fillMaxSize()) {
            val height = maxHeight
            KeyboardScrollView(Modifier.fillMaxSize()) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(min = height)
                        .padding(24.dp),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Box(
                        Modifier
                            .size(64.dp)
                            .background(colors.surfaceSecondary, CircleShape),
                        contentAlignment = Alignment.Center,
                    ) {
                        Icon(PhosphorIcons.Bold.LockSimple, contentDescription = null, size = 30.dp, tint = colors.accent)
                    }
                    Spacer(Modifier.height(20.dp))
                    BasicText(
                        "Two-factor authentication",
                        modifier = Modifier.semantics { heading() },
                        style = Typography.xl3.copy(color = colors.label, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
                    )
                    Spacer(Modifier.height(12.dp))
                    BasicText(
                        "Enter the 6-digit code sent to your trusted devices.",
                        style = Typography.lg.copy(color = colors.labelSecondary, textAlign = TextAlign.Center),
                    )
                    Spacer(Modifier.height(30.dp))
                    key(attempt) {
                        OtpAutofill(
                            maxLength = 6,
                            onVerify = { code ->
                                val ok = verify(code)
                                if (ok) {
                                    delay(500)
                                    verified = true
                                }
                                ok
                            },
                        ) {
                            OtpAutofillInput(contentDescription = "Verification code") {
                                InputOTPGroup(Modifier.padding(end = 8.dp)) {
                                    repeat(3) { InputOTPSlot(it) }
                                }
                                InputOTPGroup {
                                    repeat(3) { InputOTPSlot(it + 3) }
                                }
                            }
                            val invalid = state == OtpAutofillState.Invalid
                            BasicText(
                                if (invalid) "Incorrect code." else "Demo code: $DemoCode",
                                modifier = Modifier
                                    .heightIn(min = 20.dp)
                                    .semantics { liveRegion = LiveRegionMode.Polite },
                                style = Typography.sm.copy(
                                    color = if (invalid) colors.danger else colors.labelSecondary,
                                    textAlign = TextAlign.Center,
                                ),
                            )
                        }
                    }
                    Spacer(Modifier.height(24.dp))
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(10.dp),
                    ) {
                        if (left > 0) {
                            BasicText(
                                "Resend code · 0:${left.toString().padStart(2, '0')}",
                                style = Typography.sm.copy(color = colors.labelSecondary, fontFeatureSettings = "tnum"),
                            )
                        } else {
                            LinkText("Resend code ›") {
                                left = 30
                            }
                        }
                        LinkText("Didn't get a verification code? ›", onHelp)
                    }
                }
            }
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
            .graphicsLayer { alpha = if (pressed) 0.5f else 1f }
            .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onClick)
            .padding(vertical = 4.dp),
        style = Typography.sm.copy(color = EsuissTheme.colors.link, textAlign = TextAlign.Center),
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
                .background(colors.success, CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            Icon(PhosphorIcons.Bold.Check, contentDescription = null, size = 38.dp, tint = colors.onAccent)
        }
        BasicText(
            "Verified.",
            modifier = Modifier.semantics { heading() },
            style = Typography.xl3.copy(color = colors.label, fontWeight = FontWeight.SemiBold),
        )
        BasicText(
            "This device is now trusted. You won't be asked for a code next time.",
            style = Typography.lg.copy(color = colors.labelSecondary, textAlign = TextAlign.Center),
        )
        BasicText(
            "Start over ›",
            modifier = Modifier.clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                role = Role.Button,
                onClick = onStartOver,
            ),
            style = Typography.lg.copy(color = colors.link),
        )
    }
}
