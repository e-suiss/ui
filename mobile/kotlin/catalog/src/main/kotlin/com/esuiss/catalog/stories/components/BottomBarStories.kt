package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.BottomBar
import com.esuiss.ui.components.BottomBarContent
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Input
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.ScreenEdge
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TextVariant

val bottomBarStories = StoryGroup(
    section = Section.Components,
    title = "Bottom Bar",
    stories = listOf(
        Story("Default", fullScreen = true) { BottomBarDefault() },
        Story("WithSeparator", fullScreen = true) { BottomBarWithSeparator() },
        Story("TwoActions", fullScreen = true) { BottomBarTwoActions() },
        Story("SideBySide", fullScreen = true) { BottomBarSideBySide() },
        Story("AboveKeyboard", fullScreen = true) { BottomBarAboveKeyboard() },
    ),
)

@Composable
private fun BottomBarPage(page: @Composable ColumnScope.() -> Unit, bar: @Composable () -> Unit) {
    Screen(edges = setOf(ScreenEdge.Top, ScreenEdge.Left, ScreenEdge.Right)) {
        Column(Modifier.fillMaxSize()) {
            Column(
                Modifier.weight(1f).fillMaxWidth().padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
                content = page,
            )
            bar()
        }
    }
}

@Composable
private fun BottomBarOrder(bar: @Composable () -> Unit) {
    BottomBarPage(
        page = {
            Text("Review order", variant = TextVariant.H3)
            Text("2 items, delivery on Thursday.", variant = TextVariant.Muted)
        },
        bar = bar,
    )
}

@Composable
private fun BottomBarDefault() {
    BottomBarOrder {
        BottomBar {
            BottomBarContent {
                Button("Continue", onClick = {}, size = ButtonSize.Lg, block = true)
            }
        }
    }
}

@Composable
private fun BottomBarWithSeparator() {
    BottomBarOrder {
        BottomBar(separator = true) {
            BottomBarContent {
                Button("Place order", onClick = {}, size = ButtonSize.Lg, block = true)
            }
        }
    }
}

@Composable
private fun BottomBarTwoActions() {
    BottomBarOrder {
        BottomBar(separator = true) {
            BottomBarContent {
                Button("Place order", onClick = {}, size = ButtonSize.Lg, block = true)
                Button("Save for later", onClick = {}, size = ButtonSize.Lg, variant = ButtonVariant.Plain, block = true)
            }
        }
    }
}

@Composable
private fun BottomBarSideBySide() {
    BottomBarOrder {
        BottomBar(separator = true) {
            BottomBarContent {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button("Back", onClick = {}, modifier = Modifier.weight(1f), size = ButtonSize.Lg, variant = ButtonVariant.Secondary, block = true)
                    Button("Next", onClick = {}, modifier = Modifier.weight(1f), size = ButtonSize.Lg, block = true)
                }
            }
        }
    }
}

@Composable
private fun BottomBarAboveKeyboard() {
    var code by rememberSaveable { mutableStateOf("") }
    val focus = remember { FocusRequester() }
    LaunchedEffect(Unit) { focus.requestFocus() }
    BottomBarPage(
        page = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text("Promo code", variant = TextVariant.H3)
                Input(
                    code,
                    { code = it },
                    Modifier.focusRequester(focus),
                    placeholder = "Enter code",
                    keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Characters),
                )
            }
        },
        bar = {
            BottomBar(separator = true) {
                BottomBarContent {
                    Button("Apply", onClick = {}, size = ButtonSize.Lg, block = true)
                }
            }
        },
    )
}
