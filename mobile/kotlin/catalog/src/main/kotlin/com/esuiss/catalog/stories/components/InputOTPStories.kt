package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.InputOTP
import com.esuiss.ui.components.InputOTPGroup
import com.esuiss.ui.components.InputOTPSeparator
import com.esuiss.ui.components.InputOTPSlot
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TextVariant

val inputOTPStories = StoryGroup(
    section = Section.Components,
    title = "InputOTP",
    stories = listOf(
        Story("Default") { InputOTPDefault() },
        Story("Controlled") { InputOTPControlled() },
        Story("Alphanumeric") { InputOTPAlphanumeric() },
        Story("Disabled") { InputOTPDisabled() },
    ),
)

@Composable
private fun InputOTPDefault() {
    var value by rememberSaveable { mutableStateOf("") }
    Column {
        InputOTP(value, { value = it }, maxLength = 6) {
            InputOTPGroup {
                InputOTPSlot(0)
                InputOTPSlot(1)
                InputOTPSlot(2)
            }
            InputOTPSeparator()
            InputOTPGroup {
                InputOTPSlot(3)
                InputOTPSlot(4)
                InputOTPSlot(5)
            }
        }
    }
}

@Composable
private fun InputOTPControlled() {
    var value by rememberSaveable { mutableStateOf("") }
    var completed by rememberSaveable { mutableStateOf<String?>(null) }
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        InputOTP(value, { value = it }, maxLength = 4, onComplete = { completed = it })
        Text(completed?.let { "Submitted $it" } ?: "Enter the 4 digit code", variant = TextVariant.Muted)
    }
}

@Composable
private fun InputOTPAlphanumeric() {
    var value by rememberSaveable { mutableStateOf("") }
    Column {
        InputOTP(value, { value = it.uppercase() }, maxLength = 6, keyboardType = KeyboardType.Ascii)
    }
}

@Composable
private fun InputOTPDisabled() {
    var value by rememberSaveable { mutableStateOf("123") }
    Column {
        InputOTP(value, { value = it }, maxLength = 6, enabled = false)
    }
}
