package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.state.ToggleableState
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.Checkbox
import com.esuiss.ui.components.Field
import com.esuiss.ui.components.FieldContent
import com.esuiss.ui.components.FieldDescription
import com.esuiss.ui.components.FieldError
import com.esuiss.ui.components.FieldGroup
import com.esuiss.ui.components.FieldGroupVariant
import com.esuiss.ui.components.FieldLabel
import com.esuiss.ui.components.FieldLegend
import com.esuiss.ui.components.FieldOrientation
import com.esuiss.ui.components.FieldSeparator
import com.esuiss.ui.components.FieldSet
import com.esuiss.ui.components.FieldTitle
import com.esuiss.ui.components.Input
import com.esuiss.ui.components.Switch
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TextVariant
import com.esuiss.ui.components.Textarea
import com.esuiss.ui.components.TriStateCheckbox
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

val fieldStories = StoryGroup(
    section = Section.Components,
    title = "Field",
    stories = listOf(
        Story("Default") { FieldDefault() },
        Story("Invalid") { FieldInvalid() },
        Story("Validation") { FieldValidation() },
        Story("Disabled") { FieldDisabled() },
        Story("Horizontal") { FieldHorizontal() },
        Story("CheckboxGroup") { FieldCheckboxGroup() },
        Story("Inset") { FieldInset() },
        Story("Form") { FieldForm() },
    ),
)

private val FieldPlainText = KeyboardOptions(capitalization = KeyboardCapitalization.None, autoCorrectEnabled = false)

private val FieldEmailText = KeyboardOptions(
    capitalization = KeyboardCapitalization.None,
    autoCorrectEnabled = false,
    keyboardType = KeyboardType.Email,
)

private const val FieldRequiredMessage = "This field is required."

private class FieldFocus {
    var focused = false
}

@Composable
private fun fieldOnBlur(onBlur: () -> Unit): Modifier {
    val focus = remember { FieldFocus() }
    val current by rememberUpdatedState(onBlur)
    return Modifier.onFocusChanged { state ->
        if (focus.focused && !state.isFocused) current()
        focus.focused = state.isFocused
    }
}

@Composable
private fun FieldDefault() {
    var value by rememberSaveable { mutableStateOf("") }
    Field {
        FieldLabel("Username")
        Input(
            value,
            { value = it },
            Modifier.semantics { contentDescription = "Username" },
            placeholder = "evilrabbit",
            keyboardOptions = FieldPlainText,
        )
        FieldDescription("Choose a unique username for your account.")
    }
}

@Composable
private fun FieldInvalid() {
    var value by rememberSaveable { mutableStateOf("hello@") }
    Field(invalid = true) {
        FieldLabel("Email")
        Input(value, { value = it }, Modifier.semantics { contentDescription = "Email" }, keyboardOptions = FieldEmailText)
        FieldDescription("We will send a confirmation link here.")
        FieldError("Enter a valid email address.")
    }
}

@Composable
private fun FieldValidation() {
    var name by rememberSaveable { mutableStateOf("") }
    var nameError by rememberSaveable { mutableStateOf<String?>(null) }
    var email by rememberSaveable { mutableStateOf("") }
    var emailError by rememberSaveable { mutableStateOf<String?>(null) }
    var bio by rememberSaveable { mutableStateOf("") }
    var bioShort by rememberSaveable { mutableStateOf(false) }
    FieldGroup {
        Field(invalid = nameError != null) {
            FieldLabel("Name")
            Input(
                name,
                {
                    name = it
                    if (nameError != null && it.isNotEmpty()) nameError = null
                },
                Modifier
                    .semantics { contentDescription = "Name" }
                    .then(fieldOnBlur { nameError = if (name.isEmpty()) FieldRequiredMessage else null }),
                placeholder = "Required",
            )
            FieldError(nameError)
        }
        Field(invalid = emailError != null) {
            FieldLabel("Email")
            Input(
                email,
                {
                    email = it
                    emailError = if (it.contains("@")) null else "Email must contain @."
                },
                Modifier.semantics { contentDescription = "Email" },
                placeholder = "m@example.com",
                keyboardOptions = FieldEmailText,
            )
            FieldDescription("Validated on every change.")
            FieldError(emailError)
        }
        Field(invalid = bioShort) {
            FieldLabel("Bio")
            Textarea(
                bio,
                {
                    bio = it
                    if (bioShort && (it.isEmpty() || it.length >= 20)) bioShort = false
                },
                Modifier
                    .semantics { contentDescription = "Bio" }
                    .then(fieldOnBlur { bioShort = bio.isNotEmpty() && bio.length < 20 }),
                placeholder = "At least 20 characters",
            )
            FieldError(if (bioShort) "Tell us a little more." else null)
        }
    }
}

@Composable
private fun FieldDisabled() {
    var value by rememberSaveable { mutableStateOf("acme") }
    Field(enabled = false) {
        FieldLabel("Workspace")
        Input(value, { value = it }, Modifier.semantics { contentDescription = "Workspace" })
        FieldDescription("Contact an admin to change this.")
    }
}

@Composable
private fun FieldHorizontal() {
    var marketing by rememberSaveable { mutableStateOf(false) }
    var security by rememberSaveable { mutableStateOf(false) }
    FieldGroup {
        Field(orientation = FieldOrientation.Horizontal) {
            FieldContent {
                FieldTitle("Marketing emails")
                FieldDescription("Receive emails about new products.")
            }
            Switch(marketing, { marketing = it }, Modifier.semantics { contentDescription = "Marketing emails" })
        }
        FieldSeparator()
        Field(orientation = FieldOrientation.Horizontal) {
            FieldContent {
                FieldTitle("Security emails")
                FieldDescription("Receive emails about your account.")
            }
            Switch(security, { security = it }, Modifier.semantics { contentDescription = "Security emails" })
        }
    }
}

private val FieldToppings = listOf("cheese", "olives", "peppers")

@Composable
private fun FieldCheckboxGroup() {
    var value by rememberSaveable { mutableStateOf(listOf("cheese")) }
    val parent = when (value.size) {
        0 -> ToggleableState.Off
        FieldToppings.size -> ToggleableState.On
        else -> ToggleableState.Indeterminate
    }
    FieldSet {
        FieldLegend("Toppings")
        FieldDescription("Choose what goes on your pizza.")
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
                TriStateCheckbox(
                    parent,
                    { value = if (parent == ToggleableState.On) emptyList() else FieldToppings },
                    Modifier.semantics { contentDescription = "All toppings" },
                )
                Text("All toppings")
            }
            FieldToppings.forEach { topping ->
                val label = topping.replaceFirstChar { it.uppercaseChar() }
                Row(
                    modifier = Modifier.padding(start = 24.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Checkbox(
                        topping in value,
                        { checked -> value = if (checked) FieldToppings.filter { it in value || it == topping } else value - topping },
                        Modifier.semantics { contentDescription = label },
                    )
                    Text(label)
                }
            }
        }
    }
}

@Composable
private fun FieldInsetInput(value: String, onValueChange: (String) -> Unit, label: String, modifier: Modifier) {
    val colors = EsuissTheme.colors
    BasicTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier
            .height(32.dp)
            .semantics { contentDescription = label },
        textStyle = Typography.base.copy(color = colors.label, textAlign = TextAlign.End),
        singleLine = true,
        cursorBrush = SolidColor(colors.accent),
        decorationBox = { inner ->
            Row(verticalAlignment = Alignment.CenterVertically) { inner() }
        },
    )
}

@Composable
private fun FieldInset() {
    var name by rememberSaveable { mutableStateOf("Ada Lovelace") }
    var city by rememberSaveable { mutableStateOf("London") }
    FieldSet {
        FieldLegend("Profile")
        FieldGroup(variant = FieldGroupVariant.Inset) {
            Field(orientation = FieldOrientation.Horizontal) {
                FieldLabel("Name", Modifier.weight(1f))
                FieldInsetInput(name, { name = it }, "Name", Modifier.weight(1f))
            }
            Field(orientation = FieldOrientation.Horizontal) {
                FieldLabel("City", Modifier.weight(1f))
                FieldInsetInput(city, { city = it }, "City", Modifier.weight(1f))
            }
        }
    }
}

private fun fieldUsernameErrors(username: String, taken: Boolean): List<String> = buildList {
    if (username.isEmpty()) add(FieldRequiredMessage)
    if (taken) add("This username is taken.")
}

private fun fieldPasswordErrors(password: String): List<String> = buildList {
    if (password.isEmpty()) add(FieldRequiredMessage)
    if (password.isNotEmpty() && password.length < 8) add("Use at least 8 characters.")
    if (!password.any { it.isDigit() }) add("Include at least one number.")
}

@Composable
private fun FieldForm() {
    var username by rememberSaveable { mutableStateOf("") }
    var password by rememberSaveable { mutableStateOf("") }
    var taken by rememberSaveable { mutableStateOf(false) }
    var attempted by rememberSaveable { mutableStateOf(false) }
    var submitted by rememberSaveable { mutableStateOf<String?>(null) }
    val usernameErrors = if (attempted) fieldUsernameErrors(username, taken) else emptyList()
    val passwordErrors = if (attempted) fieldPasswordErrors(password) else emptyList()
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(24.dp)) {
        FieldGroup {
            Field(invalid = usernameErrors.isNotEmpty()) {
                FieldLabel("Username")
                Input(
                    username,
                    {
                        username = it
                        taken = false
                    },
                    Modifier.semantics { contentDescription = "Username" },
                    placeholder = "Try admin",
                    keyboardOptions = FieldPlainText,
                )
                FieldDescription("Letters and numbers only.")
                FieldError(usernameErrors)
            }
            Field(invalid = passwordErrors.isNotEmpty()) {
                FieldLabel("Password")
                Input(
                    password,
                    { password = it },
                    Modifier.semantics { contentDescription = "Password" },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    visualTransformation = PasswordVisualTransformation(),
                )
                FieldError(passwordErrors)
            }
        }
        Button(
            "Create account",
            onClick = {
                attempted = true
                val invalid = fieldUsernameErrors(username, false).isNotEmpty() || fieldPasswordErrors(password).isNotEmpty()
                if (invalid) return@Button
                if (username == "admin") {
                    taken = true
                    return@Button
                }
                submitted = "{\"username\":\"$username\",\"password\":\"$password\"}"
            },
            modifier = Modifier.fillMaxWidth(),
        )
        submitted?.let { Text("Submitted: $it", variant = TextVariant.Muted) }
    }
}
