package com.esuiss.ui.blocks

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.animateFloatAsState
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.error
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
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
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.InputAccessoryBar
import com.esuiss.ui.components.InputAccessoryState
import com.esuiss.ui.components.KeyboardScrollView
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.inputAccessory
import com.esuiss.ui.components.rememberInputAccessoryState
import com.esuiss.ui.patterns.Picker
import com.esuiss.ui.patterns.PickerItemData
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

private val EmailPattern = Regex(".+@.+\\..+")

private val RevealEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private val PopEasing = CubicBezierEasing(0.3f, 1.25f, 0.5f, 1f)

private class PasswordRule(val label: String, val test: (String) -> Boolean)

private val PasswordRules = listOf(
    PasswordRule("At least 8 characters") { it.length >= 8 },
    PasswordRule("Upper and lowercase letters") { value -> value.any { it.isUpperCase() } && value.any { it.isLowerCase() } },
    PasswordRule("At least one number") { value -> value.any { it.isDigit() } },
)

private fun strength(value: String): Int =
    PasswordRules.count { it.test(value) } + if (value.any { !it.isLetterOrDigit() }) 1 else 0

private val Countries = listOf("United States", "Germany", "Netherlands", "United Kingdom").map { PickerItemData(it, it) }

@Immutable
data class SignupFormValues(
    val firstName: String,
    val lastName: String,
    val country: String,
    val birthday: String,
    val email: String,
    val password: String,
)

@Composable
fun SignupForm(
    modifier: Modifier = Modifier,
    onSubmit: (SignupFormValues) -> Unit = {},
    onLearnMore: () -> Unit = {},
) {
    val colors = EsuissTheme.colors
    var first by rememberSaveable { mutableStateOf("") }
    var last by rememberSaveable { mutableStateOf("") }
    var country by rememberSaveable { mutableStateOf("United States") }
    var birthday by rememberSaveable { mutableStateOf("") }
    var email by rememberSaveable { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirm by remember { mutableStateOf("") }
    var tried by rememberSaveable { mutableStateOf(false) }
    var done by rememberSaveable { mutableStateOf(false) }
    val accessory = rememberInputAccessoryState()

    val mismatch = tried && confirm.isNotEmpty() && password != confirm
    val valid = first.isNotEmpty() && last.isNotEmpty() && birthday.isNotEmpty() &&
        EmailPattern.matches(email) && strength(password) >= 3 && password == confirm

    fun submit() {
        tried = true
        if (!valid) return
        onSubmit(SignupFormValues(first, last, country, birthday, email, password))
        done = true
    }

    Screen(modifier) {
        if (done) {
            Success(
                title = "Your suiss Account is ready.",
                description = "We sent a verification code to $email.",
            ) {
                done = false
                tried = false
            }
            return@Screen
        }
        Column(Modifier.fillMaxSize()) {
            KeyboardScrollView(
                modifier = Modifier.weight(1f),
                contentPadding = PaddingValues(start = 24.dp, end = 24.dp, top = 36.dp, bottom = 24.dp),
            ) {
                BasicText(
                    "Create your suiss Account",
                    modifier = Modifier
                        .fillMaxWidth()
                        .semantics { heading() },
                    style = Typography.xl3.copy(color = colors.label, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
                )
                Spacer(Modifier.height(10.dp))
                BasicText(
                    "One suiss Account is all you need to access every suiss service.",
                    modifier = Modifier.fillMaxWidth(),
                    style = Typography.lg.copy(color = colors.labelSecondary, textAlign = TextAlign.Center),
                )
                LinkText("Learn more ›", onLearnMore, Modifier.align(Alignment.CenterHorizontally))
                Legend("Your name")
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    FieldStack(modifier = Modifier.weight(1f)) {
                        StackInput(first, { first = it }, "First name", accessory, 0)
                    }
                    FieldStack(modifier = Modifier.weight(1f)) {
                        StackInput(last, { last = it }, "Last name", accessory, 1)
                    }
                }
                Legend("Country or region and birthday")
                Picker(
                    value = country,
                    onValueChange = { country = it },
                    items = Countries,
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = "Country or region",
                )
                Spacer(Modifier.height(8.dp))
                FieldStack {
                    StackInput(birthday, { birthday = it }, "Birthday (MM/DD/YYYY)", accessory, 2, keyboardType = KeyboardType.Number)
                }
                Legend("suiss Account")
                FieldStack {
                    StackInput(email, { email = it }, "name@example.com", accessory, 3, keyboardType = KeyboardType.Email)
                }
                BasicText(
                    "This will be your new suiss Account.",
                    modifier = Modifier.padding(top = 6.dp),
                    style = Typography.xs.copy(color = colors.labelSecondary),
                )
                Legend("Password")
                FieldStack(invalid = mismatch) {
                    StackInput(password, { password = it }, "Password", accessory, 4, keyboardType = KeyboardType.Password, secret = true)
                    StackDivider()
                    StackInput(
                        confirm,
                        { confirm = it },
                        "Confirm password",
                        accessory,
                        5,
                        keyboardType = KeyboardType.Password,
                        secret = true,
                        invalid = mismatch,
                        imeAction = ImeAction.Done,
                        onDone = ::submit,
                    )
                }
                AnimatedVisibility(
                    visible = password.isNotEmpty(),
                    enter = expandVertically(tween(400, easing = RevealEasing)),
                    exit = shrinkVertically(tween(400, easing = RevealEasing)),
                ) {
                    RuleList(password, Modifier.padding(start = 4.dp, end = 4.dp, top = 14.dp))
                }
                BasicText(
                    if (tried && !valid) "Please fill in every field correctly." else "",
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 14.dp)
                        .heightIn(min = 20.dp)
                        .semantics { liveRegion = LiveRegionMode.Polite },
                    style = Typography.sm.copy(color = colors.danger, textAlign = TextAlign.Center),
                )
            }
            BottomBar {
                BottomBarContent {
                    Button("Continue", ::submit, size = ButtonSize.Lg, block = true)
                }
            }
        }
        InputAccessoryBar(accessory, onDone = ::submit)
    }
}

@Composable
private fun Legend(text: String) {
    BasicText(
        text,
        modifier = Modifier.padding(top = 22.dp, bottom = 8.dp),
        style = Typography.sm.copy(color = EsuissTheme.colors.label, fontWeight = FontWeight.SemiBold),
    )
}

@Composable
private fun FieldStack(
    modifier: Modifier = Modifier,
    invalid: Boolean = false,
    content: @Composable ColumnScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val shape = RoundedCornerShape(Radius.xl)
    val fill by animateColorAsState(
        if (invalid) colors.danger.copy(alpha = if (colors.isDark) 0.1f else 0.05f) else colors.surface,
        tween(200),
        label = "fill",
    )
    val edge by animateColorAsState(if (invalid) colors.danger else colors.separatorStrong, tween(200), label = "edge")
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(shape)
            .background(fill, shape)
            .border(1.dp, edge, shape),
        content = content,
    )
}

@Composable
private fun StackDivider() {
    Box(
        Modifier
            .fillMaxWidth()
            .height(1.dp)
            .background(EsuissTheme.colors.separatorStrong),
    )
}

@Composable
private fun StackInput(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    accessory: InputAccessoryState,
    index: Int,
    keyboardType: KeyboardType = KeyboardType.Text,
    secret: Boolean = false,
    invalid: Boolean = false,
    imeAction: ImeAction = ImeAction.Next,
    onDone: () -> Unit = {},
) {
    val colors = EsuissTheme.colors
    val focus = LocalFocusManager.current
    val style = Typography.lg.copy(color = colors.label)
    BasicTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = Modifier
            .fillMaxWidth()
            .height(52.dp)
            .inputAccessory(accessory, index)
            .semantics {
                contentDescription = placeholder
                if (invalid) error("Passwords don't match")
            },
        textStyle = style,
        singleLine = true,
        cursorBrush = SolidColor(colors.accent),
        visualTransformation = if (secret) PasswordVisualTransformation() else VisualTransformation.None,
        keyboardOptions = KeyboardOptions(keyboardType = keyboardType, imeAction = imeAction),
        keyboardActions = KeyboardActions(
            onNext = { focus.moveFocus(FocusDirection.Next) },
            onDone = {
                focus.clearFocus()
                onDone()
            },
        ),
        decorationBox = { inner ->
            Box(Modifier.padding(horizontal = 16.dp), contentAlignment = Alignment.CenterStart) {
                if (value.isEmpty()) {
                    BasicText(placeholder, style = style.copy(color = colors.labelSecondary), maxLines = 1)
                }
                inner()
            }
        },
    )
}

@Composable
private fun RuleList(password: String, modifier: Modifier = Modifier) {
    Column(modifier, verticalArrangement = Arrangement.spacedBy(6.dp)) {
        PasswordRules.forEach { rule ->
            RuleRow(rule.label, rule.test(password))
        }
    }
}

@Composable
private fun RuleRow(label: String, met: Boolean) {
    val colors = EsuissTheme.colors
    val fill by animateColorAsState(if (met) colors.success else Color.Transparent, tween(250), label = "fill")
    val edge by animateColorAsState(if (met) Color.Transparent else colors.labelQuaternary, tween(250), label = "edge")
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
                tint = colors.onAccent,
            )
        }
        BasicText(label, style = Typography.sm.copy(color = if (met) colors.label else colors.labelSecondary))
    }
}

@Composable
private fun LinkText(text: String, onClick: () -> Unit, modifier: Modifier = Modifier) {
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    BasicText(
        text,
        modifier = modifier
            .graphicsLayer { alpha = if (pressed) 0.5f else 1f }
            .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onClick)
            .padding(vertical = 6.dp),
        style = Typography.lg.copy(color = EsuissTheme.colors.link, textAlign = TextAlign.Center),
    )
}

@Composable
private fun Success(title: String, description: String, onStartOver: () -> Unit) {
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
            title,
            modifier = Modifier.semantics { heading() },
            style = Typography.xl3.copy(color = colors.label, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
        )
        BasicText(description, style = Typography.lg.copy(color = colors.labelSecondary, textAlign = TextAlign.Center))
        LinkText("Start over ›", onStartOver)
    }
}
