package com.esuiss.ui.blocks

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.keyframes
import androidx.compose.animation.core.tween
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
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
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.error
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.bold.ArrowRight
import com.esuiss.ui.components.Avatar
import com.esuiss.ui.components.AvatarSize
import com.esuiss.ui.components.Checkbox
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.KeyboardScrollView
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.Spinner
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

private val EmailPattern = Regex(".+@.+\\..+")

private val RevealEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private enum class LoginStep { Email, Password }

@Composable
fun LoginAccount(
    modifier: Modifier = Modifier,
    onSubmit: (email: String, password: String) -> Unit = { _, _ -> },
    onForgotPassword: () -> Unit = {},
    onCreateAccount: () -> Unit = {},
) {
    var step by rememberSaveable { mutableStateOf(LoginStep.Email) }
    var email by rememberSaveable { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var error by remember { mutableStateOf("") }
    var busy by remember { mutableStateOf(false) }
    var signedIn by rememberSaveable { mutableStateOf(false) }
    var rememberMe by rememberSaveable { mutableStateOf(true) }
    val shake = remember { Animatable(0f) }
    val scope = rememberCoroutineScope()
    val passwordFocus = remember { FocusRequester() }

    fun fail(message: String) {
        error = message
        scope.launch {
            shake.animateTo(
                0f,
                keyframes {
                    durationMillis = 420
                    0f at 0
                    -10f at 84
                    9f at 168
                    -6f at 252
                    4f at 336
                },
            )
        }
    }

    fun submit() {
        if (busy) return
        if (step == LoginStep.Email) {
            if (!EmailPattern.matches(email)) return fail("Enter a valid suiss Account.")
            error = ""
            step = LoginStep.Password
            return
        }
        if (password.length < 4) return fail("Your suiss Account or password was incorrect.")
        error = ""
        onSubmit(email, password)
        busy = true
    }

    LaunchedEffect(busy) {
        if (!busy) return@LaunchedEffect
        delay(1200)
        busy = false
        signedIn = true
    }

    LaunchedEffect(step) {
        if (step != LoginStep.Password) return@LaunchedEffect
        delay(380)
        runCatching { passwordFocus.requestFocus() }
    }

    Screen(modifier) {
        if (signedIn) {
            Greeting(email) {
                signedIn = false
                step = LoginStep.Email
                password = ""
            }
            return@Screen
        }
        CenteredScroll {
            BasicText(
                "Sign in with your suiss Account",
                modifier = Modifier.semantics { heading() },
                style = Typography.xl3.copy(
                    color = EsuissTheme.colors.foreground,
                    fontWeight = FontWeight.SemiBold,
                    textAlign = TextAlign.Center,
                ),
            )
            Spacer(Modifier.height(32.dp))
            FieldStack(
                invalid = error.isNotEmpty(),
                modifier = Modifier.graphicsLayer { translationX = shake.value.dp.toPx() },
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    StackInput(
                        value = email,
                        onValueChange = {
                            email = it
                            error = ""
                            if (step == LoginStep.Password) step = LoginStep.Email
                        },
                        placeholder = "Email or phone number",
                        invalid = step == LoginStep.Email && error.isNotEmpty(),
                        keyboardType = KeyboardType.Email,
                        imeAction = ImeAction.Next,
                        onAction = ::submit,
                        modifier = Modifier.weight(1f),
                    )
                    if (step == LoginStep.Email) {
                        SubmitArrow(ready = email.isNotEmpty(), busy = busy, onClick = ::submit)
                    }
                }
                AnimatedVisibility(
                    visible = step == LoginStep.Password,
                    enter = expandVertically(tween(450, easing = RevealEasing)),
                    exit = shrinkVertically(tween(450, easing = RevealEasing)),
                ) {
                    Column {
                        Box(
                            Modifier
                                .fillMaxWidth()
                                .height(1.dp)
                                .background(EsuissTheme.colors.input),
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            StackInput(
                                value = password,
                                onValueChange = {
                                    password = it
                                    error = ""
                                },
                                placeholder = "Password",
                                invalid = step == LoginStep.Password && error.isNotEmpty(),
                                keyboardType = KeyboardType.Password,
                                imeAction = ImeAction.Go,
                                onAction = ::submit,
                                password = true,
                                modifier = Modifier
                                    .weight(1f)
                                    .focusRequester(passwordFocus),
                            )
                            SubmitArrow(ready = password.isNotEmpty(), busy = busy, onClick = ::submit)
                        }
                    }
                }
            }
            BasicText(
                error,
                modifier = Modifier
                    .padding(top = 10.dp)
                    .heightIn(min = 22.dp)
                    .semantics { liveRegion = LiveRegionMode.Polite },
                style = Typography.sm.copy(color = EsuissTheme.colors.destructive, textAlign = TextAlign.Center),
            )
            RememberMe(rememberMe) { rememberMe = it }
            Spacer(Modifier.height(40.dp))
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(10.dp),
            ) {
                LinkText("Forgot password? ›", onForgotPassword)
                BasicText(
                    "Don't have a suiss Account?",
                    style = Typography.sm.copy(color = EsuissTheme.colors.mutedForeground, textAlign = TextAlign.Center),
                )
                LinkText("Create yours now ›", onCreateAccount)
            }
        }
    }
}

@Composable
private fun CenteredScroll(content: @Composable ColumnScope.() -> Unit) {
    BoxWithConstraints(Modifier.fillMaxSize()) {
        val height = maxHeight
        KeyboardScrollView(modifier = Modifier.fillMaxSize()) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(min = height)
                    .padding(PaddingValues(24.dp)),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Column(
                    modifier = Modifier.widthIn(max = 460.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    content = content,
                )
            }
        }
    }
}

@Composable
private fun FieldStack(
    invalid: Boolean,
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val shape = RoundedCornerShape(Radius.xl)
    val fill = if (invalid) colors.destructive.copy(alpha = if (colors.isDark) 0.1f else 0.05f) else colors.background
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(shape)
            .background(fill, shape)
            .border(1.dp, if (invalid) colors.destructive else colors.input, shape),
        content = content,
    )
}

@Composable
private fun StackInput(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    invalid: Boolean,
    keyboardType: KeyboardType,
    imeAction: ImeAction,
    onAction: () -> Unit,
    modifier: Modifier = Modifier,
    password: Boolean = false,
) {
    val colors = EsuissTheme.colors
    val style = Typography.lg.copy(color = colors.foreground)
    BasicTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier
            .height(56.dp)
            .semantics {
                contentDescription = placeholder
                if (invalid) error("Invalid")
            },
        textStyle = style,
        singleLine = true,
        cursorBrush = SolidColor(colors.primary),
        visualTransformation = if (password) PasswordVisualTransformation() else VisualTransformation.None,
        keyboardOptions = KeyboardOptions(keyboardType = keyboardType, imeAction = imeAction),
        keyboardActions = KeyboardActions(onNext = { onAction() }, onGo = { onAction() }),
        decorationBox = { inner ->
            Box(Modifier.padding(horizontal = 16.dp), contentAlignment = Alignment.CenterStart) {
                if (value.isEmpty()) {
                    BasicText(placeholder, style = style.copy(color = colors.mutedForeground), maxLines = 1)
                }
                inner()
            }
        },
    )
}

@Composable
private fun SubmitArrow(ready: Boolean, busy: Boolean, onClick: () -> Unit) {
    val colors = EsuissTheme.colors
    val enabled = ready && !busy
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    Box(
        modifier = Modifier
            .padding(end = 10.dp)
            .size(30.dp)
            .graphicsLayer {
                alpha = when {
                    !(ready || busy) -> 0.5f
                    pressed -> 0.8f
                    else -> 1f
                }
            }
            .border(1.5.dp, colors.mutedForeground, CircleShape)
            .clickable(
                interactionSource = interaction,
                indication = null,
                enabled = enabled,
                role = Role.Button,
                onClick = onClick,
            )
            .semantics { contentDescription = "Continue" },
        contentAlignment = Alignment.Center,
    ) {
        if (busy) {
            Spinner(size = 14.dp, color = colors.mutedForeground)
        } else {
            Icon(
                PhosphorIcons.Bold.ArrowRight,
                contentDescription = null,
                size = 14.dp,
                tint = colors.mutedForeground,
            )
        }
    }
}

@Composable
private fun RememberMe(checked: Boolean, onCheckedChange: (Boolean) -> Unit) {
    Row(
        modifier = Modifier
            .padding(top = 6.dp)
            .heightIn(min = 44.dp)
            .toggleable(
                value = checked,
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                role = Role.Checkbox,
                onValueChange = onCheckedChange,
            ),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Checkbox(checked = checked, onCheckedChange = null)
        BasicText("Remember me", style = Typography.sm.copy(color = EsuissTheme.colors.foreground))
    }
}

@Composable
private fun LinkText(text: String, onClick: () -> Unit, modifier: Modifier = Modifier) {
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    BasicText(
        text,
        modifier = modifier
            .graphicsLayer { alpha = if (pressed) 0.8f else 1f }
            .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onClick)
            .padding(vertical = 4.dp),
        style = Typography.sm.copy(color = EsuissTheme.colors.primary, textAlign = TextAlign.Center),
    )
}

@Composable
private fun Greeting(email: String, onSignOut: () -> Unit) {
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
        Avatar(
            modifier = Modifier.size(80.dp),
            size = AvatarSize.Xl,
            fallback = {
                Box(
                    Modifier
                        .fillMaxSize()
                        .background(colors.muted, CircleShape),
                    contentAlignment = Alignment.Center,
                ) {
                    BasicText(
                        email.take(1),
                        style = Typography.xl3.copy(color = colors.foreground),
                    )
                }
            },
        )
        BasicText(
            "Hello.",
            modifier = Modifier.semantics { heading() },
            style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
        )
        BasicText(email, style = Typography.lg.copy(color = colors.mutedForeground, textAlign = TextAlign.Center))
        LinkText("Sign out ›", onSignOut)
    }
}
