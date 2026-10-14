package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Input
import com.esuiss.ui.components.InputSize
import com.esuiss.ui.components.Label
import com.esuiss.ui.components.Popover
import com.esuiss.ui.components.PopoverDescription
import com.esuiss.ui.components.PopoverHeader
import com.esuiss.ui.components.PopoverTitle
import com.esuiss.ui.components.PopupAlign
import com.esuiss.ui.components.PopupSide
import com.esuiss.ui.components.Text
import com.esuiss.ui.theme.Typography

val popoverStories = StoryGroup(
    section = Section.Components,
    title = "Popover",
    stories = listOf(
        Story("Default") { PopoverDimensions(defaultOpen = false) },
        Story("Sides") { PopoverSides() },
        Story("Simple") { PopoverSimple() },
        Story("OpenByDefault") { PopoverDimensions(defaultOpen = true) },
    ),
)

private class PopoverDimension(val id: String, val label: String, val value: String)

private val popoverDimensions = listOf(
    PopoverDimension("width", "Width", "100%"),
    PopoverDimension("max-width", "Max. width", "300px"),
    PopoverDimension("height", "Height", "25px"),
)

@Composable
private fun ColumnScope.PopoverDimensionsContent() {
    PopoverHeader {
        PopoverTitle("Dimensions")
        PopoverDescription("Set the dimensions for the layer.")
    }
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        popoverDimensions.forEach { dimension ->
            key(dimension.id) {
                var value by rememberSaveable { mutableStateOf(dimension.value) }
                Row(horizontalArrangement = Arrangement.spacedBy(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Label(dimension.label, Modifier.width(96.dp))
                    Input(
                        value,
                        { value = it },
                        Modifier.weight(1f).semantics { contentDescription = dimension.label },
                        size = InputSize.Sm,
                    )
                }
            }
        }
    }
}

@Composable
private fun PopoverDimensions(defaultOpen: Boolean) {
    var open by rememberSaveable { mutableStateOf(defaultOpen) }
    Column {
        Popover(
            open = open,
            onOpenChange = { open = it },
            trigger = { Button("Open popover", onClick = { open = true }, variant = ButtonVariant.Outline) },
            modifier = Modifier.width(320.dp),
            align = PopupAlign.Start,
        ) {
            PopoverDimensionsContent()
        }
    }
}

@Composable
private fun PopoverSides() {
    Column(
        modifier = Modifier.fillMaxWidth().padding(vertical = 96.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        listOf(
            PopupSide.Top to "top",
            PopupSide.Right to "right",
            PopupSide.Bottom to "bottom",
            PopupSide.Left to "left",
        ).forEach { (side, name) ->
            key(name) {
                var open by rememberSaveable { mutableStateOf(false) }
                Popover(
                    open = open,
                    onOpenChange = { open = it },
                    trigger = {
                        Button(name.replaceFirstChar { it.uppercaseChar() }, onClick = { open = true }, variant = ButtonVariant.Outline)
                    },
                    modifier = Modifier.width(224.dp),
                    side = side,
                ) {
                    Text("Popover on the $name.", style = Typography.sm)
                }
            }
        }
    }
}

@Composable
private fun PopoverSimple() {
    var open by rememberSaveable { mutableStateOf(false) }
    Column {
        Popover(
            open = open,
            onOpenChange = { open = it },
            trigger = { Button("Info", onClick = { open = true }) },
            modifier = Modifier.width(256.dp),
            align = PopupAlign.Start,
        ) {
            Text("Popovers display rich content next to a trigger.", style = Typography.sm)
        }
    }
}
