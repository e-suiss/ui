package com.esuiss.ui.blocks

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusDirection
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.semantics.ProgressBarRangeInfo
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.progressBarRangeInfo
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.bold.Check
import com.adamglin.phosphoricons.fill.MusicNotes
import com.esuiss.ui.components.BottomBar
import com.esuiss.ui.components.BottomBarContent
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.Checkbox
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.InputAccessoryBar
import com.esuiss.ui.components.InputAccessoryState
import com.esuiss.ui.components.KeyboardScrollView
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.ScreenEdge
import com.esuiss.ui.components.inputAccessory
import com.esuiss.ui.components.rememberInputAccessoryState
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

private val EmailPattern = Regex(".+@.+\\..+")

private val RevealEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private val StrengthLabels = listOf("Weak", "Weak", "Fair", "Good", "Strong")

private fun strength(value: String): Int = listOf(
    value.length >= 8,
    value.any { it.isUpperCase() } && value.any { it.isLowerCase() },
    value.any { it.isDigit() },
    value.any { !it.isLetterOrDigit() },
).count { it }

@Composable
fun SignupTrial(
    modifier: Modifier = Modifier,
    onSubmit: (email: String, password: String) -> Unit = { _, _ -> },
    onSignIn: () -> Unit = {},
) {
    val colors = EsuissTheme.colors
    var email by rememberSaveable { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var terms by rememberSaveable { mutableStateOf(false) }
    var done by rememberSaveable { mutableStateOf(false) }
    val accessory = rememberInputAccessoryState()
    val score = strength(password)
    val valid = EmailPattern.matches(email) && score >= 3 && terms

    fun submit() {
        if (!valid) return
        onSubmit(email, password)
        done = true
    }

    Screen(modifier, edges = setOf(ScreenEdge.Bottom, ScreenEdge.Left, ScreenEdge.Right)) {
        if (done) {
            Success { done = false }
            return@Screen
        }
        Column(Modifier.fillMaxSize()) {
            KeyboardScrollView(modifier = Modifier.weight(1f)) {
                Hero()
                Column(
                    modifier = Modifier.padding(PaddingValues(horizontal = 24.dp, vertical = 32.dp)),
                    verticalArrangement = Arrangement.spacedBy(16.dp),
                ) {
                    BasicText(
                        "Start your free trial.",
                        modifier = Modifier.semantics { heading() },
                        style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
                    )
                    val shape = RoundedCornerShape(Radius.xl)
                    Column(
                        Modifier
                            .fillMaxWidth()
                            .clip(shape)
                            .background(colors.background, shape)
                            .border(1.dp, colors.input, shape),
                    ) {
                        StackInput(email, { email = it }, "suiss Account email", accessory, 0, KeyboardType.Email)
                        Box(
                            Modifier
                                .fillMaxWidth()
                                .height(1.dp)
                                .background(colors.input),
                        )
                        StackInput(password, { password = it }, "Create a password", accessory, 1, KeyboardType.Password, secret = true)
                    }
                    AnimatedVisibility(
                        visible = password.isNotEmpty(),
                        enter = fadeIn(tween(800)) + slideInVertically(tween(800)) { it / 4 },
                    ) {
                        StrengthMeter(score)
                    }
                    Row(
                        modifier = Modifier.toggleable(
                            value = terms,
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null,
                            role = Role.Checkbox,
                        ) { terms = it },
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                    ) {
                        Checkbox(checked = terms, onCheckedChange = null, modifier = Modifier.padding(top = 2.dp))
                        BasicText(
                            "I have read and agree to the suiss Media Services Terms and Conditions.",
                            modifier = Modifier.weight(1f),
                            style = Typography.sm.copy(color = colors.mutedForeground),
                        )
                    }
                    FlowRow(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(4.dp, Alignment.CenterHorizontally),
                    ) {
                        BasicText("Already have an account?", style = Typography.sm.copy(color = colors.mutedForeground))
                        LinkText("Sign in ›", onSignIn)
                    }
                }
            }
            BottomBar {
                BottomBarContent {
                    Button("Start free trial", ::submit, size = ButtonSize.Lg, block = true, enabled = valid)
                }
            }
        }
        InputAccessoryBar(accessory)
    }
}

@Composable
private fun Hero() {
    val colors = EsuissTheme.colors
    Box(
        Modifier
            .fillMaxWidth()
            .background(Palette.indigo500),
    ) {
        Column(
            Modifier
                .windowInsetsPadding(WindowInsets.statusBars)
                .padding(start = 24.dp, end = 24.dp, top = 112.dp, bottom = 24.dp),
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                Icon(PhosphorIcons.Fill.MusicNotes, contentDescription = null, size = 26.dp, tint = Palette.white)
                BasicText("suiss Music", style = Typography.xl2.copy(color = Palette.white, fontWeight = FontWeight.SemiBold))
            }
            Spacer(Modifier.height(10.dp))
            BasicText(
                "Over 100 million songs. Ad-free.",
                style = Typography.xl3.copy(color = Palette.white, fontWeight = FontWeight.SemiBold),
            )
            Spacer(Modifier.height(8.dp))
            BasicText(
                "1 month free, then \$10.99/month.",
                style = Typography.base.copy(color = Palette.white.copy(alpha = 0.8f)),
            )
        }
    }
}

@Composable
private fun StrengthMeter(score: Int) {
    val colors = EsuissTheme.colors
    val level = when (score) {
        0 -> Palette.red500
        1 -> Palette.orange500
        2 -> Palette.yellow500
        else -> Palette.green500
    }
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .semantics {
                contentDescription = "Password strength"
                stateDescription = StrengthLabels[score]
                progressBarRangeInfo = ProgressBarRangeInfo(score.toFloat(), 0f..4f, steps = 3)
            },
        horizontalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        repeat(4) { bar ->
            val fill by animateColorAsState(if (bar < maxOf(1, score)) level else colors.secondary, tween(300), label = "bar")
            Box(
                Modifier
                    .weight(1f)
                    .height(4.dp)
                    .background(fill, CircleShape),
            )
        }
    }
}

@Composable
private fun StackInput(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    accessory: InputAccessoryState,
    index: Int,
    keyboardType: KeyboardType,
    secret: Boolean = false,
) {
    val colors = EsuissTheme.colors
    val focus = LocalFocusManager.current
    val style = Typography.lg.copy(color = colors.foreground)
    BasicTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = Modifier
            .fillMaxWidth()
            .height(52.dp)
            .inputAccessory(accessory, index)
            .semantics { contentDescription = placeholder },
        textStyle = style,
        singleLine = true,
        cursorBrush = SolidColor(colors.primary),
        visualTransformation = if (secret) PasswordVisualTransformation() else VisualTransformation.None,
        keyboardOptions = KeyboardOptions(keyboardType = keyboardType, imeAction = if (secret) ImeAction.Done else ImeAction.Next),
        keyboardActions = KeyboardActions(
            onNext = { focus.moveFocus(FocusDirection.Next) },
            onDone = { focus.clearFocus() },
        ),
        decorationBox = { inner ->
            Box(Modifier.padding(horizontal = 16.dp), contentAlignment = Alignment.CenterStart) {
                if (value.isEmpty()) BasicText(placeholder, style = style.copy(color = colors.mutedForeground), maxLines = 1)
                inner()
            }
        },
    )
}

@Composable
private fun LinkText(text: String, onClick: () -> Unit) {
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    BasicText(
        text,
        modifier = Modifier
            .graphicsLayer { alpha = if (pressed) 0.8f else 1f }
            .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onClick),
        style = Typography.sm.copy(color = EsuissTheme.colors.primary),
    )
}

@Composable
private fun Success(onStartOver: () -> Unit) {
    val colors = EsuissTheme.colors
    val appear = remember { Animatable(0f) }
    LaunchedEffect(Unit) { appear.animateTo(1f, tween(1000, easing = RevealEasing)) }
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    Column(
        modifier = Modifier
            .fillMaxSize()
            .windowInsetsPadding(WindowInsets.statusBars)
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
            "Welcome to suiss Music.",
            modifier = Modifier.semantics { heading() },
            style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
        )
        BasicText(
            "Your one-month free trial has started.",
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
