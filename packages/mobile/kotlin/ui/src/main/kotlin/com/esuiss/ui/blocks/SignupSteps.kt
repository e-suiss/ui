package com.esuiss.ui.blocks

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
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
import com.adamglin.phosphoricons.bold.Check
import com.esuiss.ui.components.BottomBar
import com.esuiss.ui.components.BottomBarContent
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.KeyboardScrollView
import com.esuiss.ui.components.PageIndicator
import com.esuiss.ui.components.PageIndicatorVariant
import com.esuiss.ui.components.Screen
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.delay

private val EmailPattern = Regex(".+@.+\\..+")

private val RevealEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private val PopEasing = CubicBezierEasing(0.3f, 1.25f, 0.5f, 1f)

private class StepRule(val label: String, val test: (String) -> Boolean)

private val StepRules = listOf(
    StepRule("At least 8 characters") { it.length >= 8 },
    StepRule("Upper and lowercase letters") { value -> value.any { it.isUpperCase() } && value.any { it.isLowerCase() } },
    StepRule("At least one number") { value -> value.any { it.isDigit() } },
)

private class SignupStep(
    val title: String,
    val description: String,
    val placeholder: String,
    val keyboardType: KeyboardType,
    val secret: Boolean,
    val valid: (String) -> Boolean,
)

private val Steps = listOf(
    SignupStep(
        "What should we call you?",
        "Your name appears across suiss products and services.",
        "Full name",
        KeyboardType.Text,
        false,
    ) { it.trim().length > 1 },
    SignupStep(
        "What's your email address?",
        "This will be your suiss Account.",
        "name@example.com",
        KeyboardType.Email,
        false,
    ) { EmailPattern.matches(it) },
    SignupStep(
        "Create a password.",
        "A strong password keeps your account safe.",
        "Password",
        KeyboardType.Password,
        true,
    ) { value -> StepRules.count { it.test(value) } >= 3 },
)

@Composable
fun SignupSteps(
    modifier: Modifier = Modifier,
    onSubmit: (name: String, email: String, password: String) -> Unit = { _, _, _ -> },
) {
    var index by rememberSaveable { mutableIntStateOf(0) }
    var direction by remember { mutableIntStateOf(1) }
    val values = remember { mutableStateListOf("", "", "") }
    var done by rememberSaveable { mutableStateOf(false) }
    val step = Steps[index]
    val ready = step.valid(values[index])

    fun go(delta: Int) {
        direction = delta
        if (index + delta > Steps.lastIndex) {
            onSubmit(values[0], values[1], values[2])
            done = true
            return
        }
        index = (index + delta).coerceAtLeast(0)
    }

    Screen(modifier) {
        if (done) {
            Success(
                title = "Welcome, ${values[0].trim().substringBefore(' ')}.",
                description = "Your account is ready. Verify ${values[1]} to finish.",
            ) {
                done = false
                index = 0
            }
            return@Screen
        }
        Column(Modifier.fillMaxSize()) {
            PageIndicator(
                count = Steps.size,
                index = index,
                modifier = Modifier
                    .align(Alignment.CenterHorizontally)
                    .padding(top = 16.dp),
                variant = PageIndicatorVariant.Accent,
                accessibilityLabel = "Progress",
            )
            BoxWithConstraints(Modifier.weight(1f)) {
                val height = maxHeight
                KeyboardScrollView(Modifier.fillMaxSize()) {
                    AnimatedContent(
                        targetState = index,
                        transitionSpec = {
                            (
                                fadeIn(tween(450)) +
                                    slideInHorizontally(tween(550, easing = RevealEasing)) { direction * it / 10 }
                                ) togetherWith fadeOut(tween(150))
                        },
                        label = "step",
                    ) { position ->
                        StepPage(
                            position = position,
                            value = values[position],
                            onValueChange = { values[position] = it },
                            onSubmit = { if (Steps[position].valid(values[position])) go(1) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .heightIn(min = height)
                                .padding(horizontal = 24.dp, vertical = 32.dp),
                        )
                    }
                }
            }
            BottomBar {
                BottomBarContent {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(16.dp),
                    ) {
                        if (index > 0) {
                            Button("Back", { go(-1) }, modifier = Modifier.weight(1f), variant = ButtonVariant.Outline, size = ButtonSize.Lg, block = true)
                        }
                        Button(
                            if (index == Steps.lastIndex) "Create account" else "Continue",
                            { go(1) },
                            modifier = Modifier.weight(1f),
                            size = ButtonSize.Lg,
                            block = true,
                            enabled = ready,
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun StepPage(
    position: Int,
    value: String,
    onValueChange: (String) -> Unit,
    onSubmit: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val colors = EsuissTheme.colors
    val step = Steps[position]
    val focus = remember { FocusRequester() }
    LaunchedEffect(position) {
        if (position == 0) return@LaunchedEffect
        delay(300)
        runCatching { focus.requestFocus() }
    }
    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(14.dp, Alignment.CenterVertically),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        BasicText(
            "Step ${position + 1} of ${Steps.size}",
            style = Typography.sm.copy(color = colors.mutedForeground, fontWeight = FontWeight.SemiBold),
        )
        BasicText(
            step.title,
            modifier = Modifier.semantics { heading() },
            style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
        )
        BasicText(step.description, style = Typography.lg.copy(color = colors.mutedForeground, textAlign = TextAlign.Center))
        val shape = RoundedCornerShape(Radius.xl)
        val style = Typography.lg.copy(color = colors.foreground)
        BasicTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier
                .padding(top = 16.dp)
                .fillMaxWidth()
                .height(52.dp)
                .clip(shape)
                .background(colors.background, shape)
                .border(1.dp, colors.input, shape)
                .focusRequester(focus)
                .semantics { contentDescription = step.placeholder },
            textStyle = style,
            singleLine = true,
            cursorBrush = SolidColor(colors.primary),
            visualTransformation = if (step.secret) PasswordVisualTransformation() else VisualTransformation.None,
            keyboardOptions = KeyboardOptions(
                keyboardType = step.keyboardType,
                imeAction = if (position == Steps.lastIndex) ImeAction.Done else ImeAction.Next,
            ),
            keyboardActions = KeyboardActions(onNext = { onSubmit() }, onDone = { onSubmit() }),
            decorationBox = { inner ->
                Box(Modifier.padding(horizontal = 16.dp), contentAlignment = Alignment.CenterStart) {
                    if (value.isEmpty()) BasicText(step.placeholder, style = style.copy(color = colors.mutedForeground), maxLines = 1)
                    inner()
                }
            },
        )
        if (step.secret && value.isNotEmpty()) {
            Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                StepRules.forEach { RuleRow(it.label, it.test(value)) }
            }
        }
    }
}

@Composable
private fun RuleRow(label: String, met: Boolean) {
    val colors = EsuissTheme.colors
    val fill by animateColorAsState(if (met) Palette.green500 else Color.Transparent, tween(250), label = "fill")
    val edge by animateColorAsState(if (met) Color.Transparent else colors.border, tween(250), label = "edge")
    val scale by animateFloatAsState(if (met) 1f else 0f, tween(250, easing = PopEasing), label = "scale")
    Row(
        modifier = Modifier.semantics(mergeDescendants = true) { stateDescription = if (met) "Met" else "Not met" },
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            Modifier
                .size(16.dp)
                .background(fill, CircleShape)
                .border(1.5.dp, edge, CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                PhosphorIcons.Bold.Check,
                contentDescription = null,
                modifier = Modifier.graphicsLayer {
                    scaleX = scale
                    scaleY = scale
                },
                size = 10.dp,
                tint = colors.primaryForeground,
            )
        }
        BasicText(label, style = Typography.sm.copy(color = if (met) colors.foreground else colors.mutedForeground))
    }
}

@Composable
private fun Success(title: String, description: String, onStartOver: () -> Unit) {
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
        Box(
            Modifier
                .size(76.dp)
                .background(Palette.green500, CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            Icon(PhosphorIcons.Bold.Check, contentDescription = null, size = 38.dp, tint = colors.primaryForeground)
        }
        BasicText(
            title,
            modifier = Modifier.semantics { heading() },
            style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
        )
        BasicText(description, style = Typography.lg.copy(color = colors.mutedForeground, textAlign = TextAlign.Center))
        BasicText(
            "Start over ›",
            modifier = Modifier
                .graphicsLayer { alpha = if (pressed) 0.8f else 1f }
                .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onStartOver),
            style = Typography.lg.copy(color = colors.primary),
        )
    }
}
