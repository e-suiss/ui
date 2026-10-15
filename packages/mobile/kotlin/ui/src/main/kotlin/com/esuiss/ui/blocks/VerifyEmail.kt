package com.esuiss.ui.blocks

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.layout.offset
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
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.bold.Check
import com.adamglin.phosphoricons.regular.EnvelopeSimple
import com.esuiss.ui.components.BottomBar
import com.esuiss.ui.components.BottomBarContent
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Screen
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Shadow
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow
import kotlinx.coroutines.delay

private const val DemoEmail = "jamie@suiss.com"

private val RevealEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

@Composable
fun VerifyEmail(
    modifier: Modifier = Modifier,
    onOpenMail: () -> Unit = {},
    onChangeAddress: () -> Unit = {},
) {
    val colors = EsuissTheme.colors
    var verified by rememberSaveable { mutableStateOf(false) }
    var left by rememberSaveable { mutableIntStateOf(0) }

    LaunchedEffect(left) {
        if (left <= 0) return@LaunchedEffect
        delay(1000)
        left -= 1
    }

    Screen(modifier) {
        if (verified) {
            Success(DemoEmail) { verified = false }
            return@Screen
        }
        Column(Modifier.fillMaxSize()) {
            BoxWithConstraints(Modifier.weight(1f)) {
                val height = maxHeight
                Column(
                    Modifier
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
                        MailGlyph()
                        Spacer(Modifier.height(26.dp))
                        BasicText(
                            "Check your inbox.",
                            modifier = Modifier.semantics { heading() },
                            style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
                        )
                        Spacer(Modifier.height(12.dp))
                        BasicText(
                            buildAnnotatedString {
                                append("We sent a verification link to ")
                                withStyle(SpanStyle(color = colors.foreground, fontWeight = FontWeight.SemiBold)) { append(DemoEmail) }
                                append(". Tap the link to activate your account.")
                            },
                            style = Typography.lg.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
                        )
                        Spacer(Modifier.height(26.dp))
                        BasicText(
                            "Didn't get it? Check your junk folder or",
                            style = Typography.sm.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
                        )
                        LinkText("change the address ›", onChangeAddress)
                    }
                }
            }
            BottomBar {
                BottomBarContent {
                    Button(
                        "Open Mail",
                        {
                            onOpenMail()
                            verified = true
                        },
                        size = ButtonSize.Lg,
                        block = true,
                    )
                    Button(
                        if (left > 0) "Sent again · $left" else "Resend",
                        {
                            left = 45
                        },
                        variant = ButtonVariant.Outline,
                        size = ButtonSize.Lg,
                        block = true,
                        enabled = left <= 0,
                    )
                }
            }
        }
    }
}

@Composable
private fun MailGlyph() {
    val colors = EsuissTheme.colors
    val shape = RoundedCornerShape(14.dp)
    Box(
        Modifier
            .size(width = 96.dp, height = 72.dp)
            .semantics(mergeDescendants = true) { contentDescription = "1 new message" },
    ) {
        Box(
            Modifier
                .fillMaxSize()
                .shadow(Shadow(0.dp, 10.dp, 30.dp, colors.primary.copy(alpha = 0.45f)), shape)
                .background(colors.primary, shape),
            contentAlignment = Alignment.Center,
        ) {
            Icon(PhosphorIcons.Regular.EnvelopeSimple, contentDescription = null, size = 40.dp, tint = colors.primaryForeground)
        }
        Box(
            Modifier
                .align(Alignment.TopEnd)
                .offset(x = 8.dp, y = (-8).dp)
                .size(26.dp)
                .border(3.dp, colors.background, CircleShape)
                .padding(1.dp)
                .background(Palette.red500, CircleShape)
                .clearAndSetSemantics {},
            contentAlignment = Alignment.Center,
        ) {
            BasicText("1", style = Typography.sm.copy(color = colors.primaryForeground, fontWeight = FontWeight.SemiBold))
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
        style = Typography.sm.copy(color = EsuissTheme.colors.primary, textAlign = TextAlign.Center),
    )
}

@Composable
private fun Success(email: String, onStartOver: () -> Unit) {
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
            "Your email is verified.",
            modifier = Modifier.semantics { heading() },
            style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
        )
        BasicText(
            "$email is now your suiss Account.",
            style = Typography.lg.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
        )
        LinkText("Start over ›", onStartOver)
    }
}
