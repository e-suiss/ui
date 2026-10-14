package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.ArrowUp
import com.adamglin.phosphoricons.regular.Copy
import com.adamglin.phosphoricons.regular.MagnifyingGlass
import com.adamglin.phosphoricons.regular.X
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.InputGroup
import com.esuiss.ui.components.InputGroupAddon
import com.esuiss.ui.components.InputGroupAddonAlign
import com.esuiss.ui.components.InputGroupButton
import com.esuiss.ui.components.InputGroupButtonSize
import com.esuiss.ui.components.InputGroupInput
import com.esuiss.ui.components.InputGroupText
import com.esuiss.ui.components.InputGroupTextarea
import com.esuiss.ui.components.Spinner
import com.esuiss.ui.components.Text
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

val inputGroupStories = StoryGroup(
    section = Section.Components,
    title = "Input Group",
    stories = listOf(
        Story("Default") { InputGroupDefault() },
        Story("WithTextarea") { InputGroupWithTextarea() },
        Story("BlockStart") { InputGroupBlockStart() },
    ),
)

@Composable
private fun InputGroupSearch() {
    var value by rememberSaveable { mutableStateOf("") }
    InputGroup {
        InputGroupInput(value, { value = it }, placeholder = "Search")
        InputGroupAddon {
            Icon(PhosphorIcons.Regular.MagnifyingGlass, contentDescription = null)
        }
        if (value.isNotEmpty()) {
            InputGroupAddon(align = InputGroupAddonAlign.InlineEnd) {
                InputGroupButton(onClick = { value = "" }, size = InputGroupButtonSize.IconXs) {
                    Icon(PhosphorIcons.Regular.X, contentDescription = "Clear")
                }
            }
        }
    }
}

@Composable
private fun InputGroupDefault() {
    var domain by rememberSaveable { mutableStateOf("") }
    var key by rememberSaveable { mutableStateOf("sk_live_51H8") }
    var searching by rememberSaveable { mutableStateOf("") }
    var email by rememberSaveable { mutableStateOf("not-an-email") }
    var disabled by rememberSaveable { mutableStateOf("") }
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        InputGroupSearch()
        InputGroup {
            InputGroupAddon { InputGroupText("https://") }
            InputGroupInput(
                domain,
                { domain = it },
                placeholder = "example.com",
                keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.None),
            )
            InputGroupAddon(align = InputGroupAddonAlign.InlineEnd) { InputGroupText(".com") }
        }
        InputGroup {
            InputGroupInput(key, { key = it })
            InputGroupAddon(align = InputGroupAddonAlign.InlineEnd) {
                InputGroupButton(onClick = {}, size = InputGroupButtonSize.IconXs) {
                    Icon(PhosphorIcons.Regular.Copy, contentDescription = "Copy")
                }
            }
        }
        InputGroup {
            InputGroupInput(searching, { searching = it }, placeholder = "Searching...")
            InputGroupAddon(align = InputGroupAddonAlign.InlineEnd) { Spinner() }
        }
        InputGroup(invalid = true) {
            InputGroupInput(email, { email = it })
            InputGroupAddon(align = InputGroupAddonAlign.InlineEnd) { InputGroupText("Invalid") }
        }
        InputGroup(enabled = false) {
            InputGroupInput(disabled, { disabled = it }, placeholder = "Disabled")
            InputGroupAddon {
                Icon(PhosphorIcons.Regular.MagnifyingGlass, contentDescription = null)
            }
        }
    }
}

@Composable
private fun InputGroupWithTextarea() {
    var value by rememberSaveable { mutableStateOf("") }
    InputGroup {
        InputGroupTextarea(value, { value = it }, placeholder = "Ask, search or chat...", minLines = 3)
        InputGroupAddon(Modifier.fillMaxWidth(), align = InputGroupAddonAlign.BlockEnd) {
            InputGroupText("52% used")
            Spacer(Modifier.weight(1f))
            InputGroupButton(onClick = {}, size = InputGroupButtonSize.IconXs, variant = ButtonVariant.Default) {
                Icon(PhosphorIcons.Regular.ArrowUp, contentDescription = "Send")
            }
        }
    }
}

@Composable
private fun InputGroupBlockStart() {
    var value by rememberSaveable { mutableStateOf("") }
    InputGroup {
        InputGroupInput(value, { value = it }, placeholder = "Enter your name")
        InputGroupAddon(align = InputGroupAddonAlign.BlockStart) {
            Text("Full name", style = Typography.sm.copy(fontWeight = FontWeight.Medium, color = EsuissTheme.colors.label))
        }
    }
}
