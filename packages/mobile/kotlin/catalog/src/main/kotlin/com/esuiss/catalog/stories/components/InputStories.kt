package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Field
import com.esuiss.ui.components.FieldDescription
import com.esuiss.ui.components.FieldError
import com.esuiss.ui.components.FieldLabel
import com.esuiss.ui.components.Input
import com.esuiss.ui.components.InputSize
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TextVariant

val inputStories = StoryGroup(
    section = Section.Components,
    title = "Input",
    stories = listOf(
        Story("Default") { InputSingle(initial = "", placeholder = "Email") },
        Story("Types") { InputTypes() },
        Story("Sizes") { InputSizes() },
        Story("WithValue") { InputSingle(initial = "hello@example.com", placeholder = "Email") },
        Story("WithLabel") { InputWithLabel() },
        Story("Invalid") { InputInvalid() },
        Story("Controlled") { InputControlled() },
        Story("Disabled") { InputSingle(initial = "", placeholder = "Disabled", enabled = false) },
    ),
)

private val InputEmailKeyboard = KeyboardOptions(
    capitalization = KeyboardCapitalization.None,
    keyboardType = KeyboardType.Email,
)

@Composable
private fun InputSingle(initial: String, placeholder: String, enabled: Boolean = true) {
    var value by rememberSaveable { mutableStateOf(initial) }
    Input(value, { value = it }, Modifier.fillMaxWidth(), enabled = enabled, placeholder = placeholder)
}

@Composable
private fun InputTypes() {
    var text by rememberSaveable { mutableStateOf("") }
    var email by rememberSaveable { mutableStateOf("") }
    var password by rememberSaveable { mutableStateOf("") }
    var number by rememberSaveable { mutableStateOf("") }
    var search by rememberSaveable { mutableStateOf("") }
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Input(text, { text = it }, placeholder = "Text")
        Input(email, { email = it }, placeholder = "Email", keyboardOptions = InputEmailKeyboard)
        Input(
            password,
            { password = it },
            placeholder = "Password",
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
            visualTransformation = PasswordVisualTransformation(),
        )
        Input(number, { number = it }, placeholder = "Number", keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number))
        Input(search, { search = it }, placeholder = "Search", keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search))
    }
}

@Composable
private fun InputSizes() {
    var small by rememberSaveable { mutableStateOf("") }
    var medium by rememberSaveable { mutableStateOf("") }
    var default by rememberSaveable { mutableStateOf("") }
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Input(small, { small = it }, size = InputSize.Sm, placeholder = "Small")
        Input(medium, { medium = it }, size = InputSize.Md, placeholder = "Medium")
        Input(default, { default = it }, placeholder = "Default")
    }
}

@Composable
private fun InputWithLabel() {
    var value by rememberSaveable { mutableStateOf("") }
    Field {
        FieldLabel("Email")
        Input(value, { value = it }, placeholder = "m@example.com", keyboardOptions = InputEmailKeyboard)
        FieldDescription("We will never share your email.")
    }
}

@Composable
private fun InputInvalid() {
    var value by rememberSaveable { mutableStateOf("x") }
    Field(invalid = true) {
        FieldLabel("Username")
        Input(value, { value = it })
        FieldError("Username must be at least 3 characters.")
    }
}

@Composable
private fun InputControlled() {
    var value by rememberSaveable { mutableStateOf("") }
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Input(
            value,
            { value = it.lowercase() },
            placeholder = "Lowercase only",
            keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.None),
        )
        Text("Value: $value", variant = TextVariant.Muted)
    }
}
