package com.esuiss.ui.blocks

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Light
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.bold.Check
import com.adamglin.phosphoricons.bold.Key
import com.adamglin.phosphoricons.light.ScanSmiley
import com.adamglin.phosphoricons.regular.ScanSmiley
import com.esuiss.ui.components.Avatar
import com.esuiss.ui.components.AvatarSize
import com.esuiss.ui.components.BottomBar
import com.esuiss.ui.components.BottomBarContent
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Dialog
import com.esuiss.ui.components.DialogDescription
import com.esuiss.ui.components.DialogTitle
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.components.Screen
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.delay

private val RevealEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private val PopEasing = CubicBezierEasing(0.3f, 1.25f, 0.5f, 1f)

private enum class PasskeyStatus { Idle, Scan, Ok, Done }

@Composable
fun LoginPasskey(
    modifier: Modifier = Modifier,
    onContinue: () -> Unit = {},
    onChangeAccount: () -> Unit = {},
    onUsePassword: () -> Unit = {},
) {
    val colors = EsuissTheme.colors
    var status by rememberSaveable { mutableStateOf(PasskeyStatus.Idle) }

    LaunchedEffect(status) {
        when (status) {
            PasskeyStatus.Scan -> {
                delay(1500)
                status = PasskeyStatus.Ok
            }
            PasskeyStatus.Ok -> {
                delay(900)
                status = PasskeyStatus.Done
            }
            else -> Unit
        }
    }

    Screen(modifier) {
        if (status == PasskeyStatus.Done) {
            Welcome { status = PasskeyStatus.Idle }
            return@Screen
        }
        Column(Modifier.fillMaxSize()) {
            BoxWithConstraints(Modifier.weight(1f)) {
                val height = maxHeight
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState()),
                ) {
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
                                .size(72.dp)
                                .background(colors.muted, CircleShape),
                            contentAlignment = Alignment.Center,
                        ) {
                            Icon(PhosphorIcons.Bold.Key, contentDescription = null, size = 34.dp, tint = colors.primary)
                        }
                        Spacer(Modifier.height(22.dp))
                        BasicText(
                            "Sign in without a password.",
                            modifier = Modifier.semantics { heading() },
                            style = Typography.xl3.copy(
                                color = colors.foreground,
                                fontWeight = FontWeight.SemiBold,
                                textAlign = TextAlign.Center,
                            ),
                        )
                        Spacer(Modifier.height(12.dp))
                        BasicText(
                            "With a passkey, your face or fingerprint is all it takes. Nothing to remember, nothing to type.",
                            modifier = Modifier.widthIn(max = 480.dp),
                            style = Typography.lg.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
                        )
                        Spacer(Modifier.height(28.dp))
                        AccountPill(onChangeAccount)
                        Spacer(Modifier.height(40.dp))
                        BasicText(
                            "Passkeys are end-to-end encrypted and sync across all your devices with suiss Keychain.",
                            modifier = Modifier.widthIn(max = 420.dp),
                            style = Typography.xs.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
                        )
                    }
                }
            }
            BottomBar {
                BottomBarContent {
                    Button(
                        onClick = {
                            onContinue()
                            status = PasskeyStatus.Scan
                        },
                        size = ButtonSize.Lg,
                        block = true,
                    ) {
                        Icon(PhosphorIcons.Regular.ScanSmiley, contentDescription = null, size = 18.dp)
                        BasicText("Continue with passkey", style = LocalContentStyle.current)
                    }
                    Button("Sign in with password ›", onUsePassword, variant = ButtonVariant.Plain)
                }
            }
        }
        val scanning = status == PasskeyStatus.Scan || status == PasskeyStatus.Ok
        Dialog(
            open = scanning,
            onOpenChange = { if (!it) status = PasskeyStatus.Idle },
            modifier = Modifier.width(260.dp),
            showCloseButton = false,
        ) {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(14.dp),
            ) {
                ScanGlyph(verified = status == PasskeyStatus.Ok)
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(3.dp),
                ) {
                    DialogTitle(if (status == PasskeyStatus.Ok) "Verified" else "Face scan")
                    DialogDescription("Passkey for suiss.com")
                }
                Button(
                    "Cancel",
                    { status = PasskeyStatus.Idle },
                    modifier = Modifier.graphicsLayer { alpha = if (status == PasskeyStatus.Ok) 0f else 1f },
                    variant = ButtonVariant.Plain,
                    enabled = status != PasskeyStatus.Ok,
                )
            }
        }
    }
}

@Composable
private fun AccountPill(onChange: () -> Unit) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    Row(
        modifier = Modifier
            .background(colors.muted, CircleShape)
            .padding(start = 8.dp, end = 16.dp, top = 8.dp, bottom = 8.dp),
        horizontalArrangement = Arrangement.spacedBy(10.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        GradientAvatar("JR", Modifier.size(28.dp), AvatarSize.Sm)
        BasicText("jamie@suiss.com", style = Typography.base.copy(color = colors.foreground))
        BasicText(
            "Change ›",
            modifier = Modifier
                .graphicsLayer { alpha = if (pressed) 0.8f else 1f }
                .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onChange),
            style = Typography.sm.copy(color = colors.primary),
        )
    }
}

@Composable
private fun GradientAvatar(initials: String, modifier: Modifier, size: AvatarSize) {
    val colors = EsuissTheme.colors
    Avatar(
        modifier = modifier,
        size = size,
        fallback = {
            Box(
                Modifier
                    .fillMaxSize()
                    .background(Palette.indigo500, CircleShape),
                contentAlignment = Alignment.Center,
            ) {
                BasicText(
                    initials,
                    style = (if (size == AvatarSize.Sm) Typography.xs else Typography.xl3).copy(
                        color = colors.primaryForeground,
                        fontWeight = FontWeight.SemiBold,
                    ),
                )
            }
        },
    )
}

@Composable
private fun ScanGlyph(verified: Boolean) {
    val colors = EsuissTheme.colors
    val pulse = rememberInfiniteTransition(label = "pulse")
    val breathe by pulse.animateFloat(
        initialValue = 1f,
        targetValue = 0.5f,
        animationSpec = infiniteRepeatable(tween(600), RepeatMode.Reverse),
        label = "breathe",
    )
    val glyph by animateFloatAsState(if (verified) 0f else 1f, tween(500), label = "glyph")
    val check by animateFloatAsState(if (verified) 1f else 0f, tween(550, easing = PopEasing), label = "check")
    Box(Modifier.size(72.dp), contentAlignment = Alignment.Center) {
        Icon(
            PhosphorIcons.Light.ScanSmiley,
            contentDescription = null,
            modifier = Modifier.graphicsLayer {
                alpha = glyph * (if (verified) 1f else breathe)
                val scale = 0.6f + 0.4f * glyph
                scaleX = scale
                scaleY = scale
            },
            size = 72.dp,
            tint = colors.foreground,
        )
        Box(
            Modifier
                .size(60.dp)
                .graphicsLayer {
                    alpha = check.coerceIn(0f, 1f)
                    val scale = 0.4f + 0.6f * check
                    scaleX = scale
                    scaleY = scale
                }
                .background(Palette.green500, CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            Icon(PhosphorIcons.Bold.Check, contentDescription = null, size = 32.dp, tint = colors.primaryForeground)
        }
    }
}

@Composable
private fun Welcome(onSignOut: () -> Unit) {
    val colors = EsuissTheme.colors
    val appear = remember { Animatable(0f) }
    LaunchedEffect(Unit) { appear.animateTo(1f, tween(1000, easing = RevealEasing)) }
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
        GradientAvatar("JR", Modifier.size(84.dp), AvatarSize.Xl)
        BasicText(
            "Welcome, Jamie.",
            modifier = Modifier.semantics { heading() },
            style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
        )
        BasicText(
            "You signed in with a passkey. No password needed.",
            style = Typography.lg.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
        )
        BasicText(
            "Sign out ›",
            modifier = Modifier
                .graphicsLayer { alpha = if (pressed) 0.8f else 1f }
                .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onSignOut),
            style = Typography.lg.copy(color = colors.primary),
        )
    }
}
