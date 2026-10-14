package com.esuiss.catalog.stories.components

import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Archive
import com.adamglin.phosphoricons.regular.ArrowLeft
import com.adamglin.phosphoricons.regular.ArrowRight
import com.adamglin.phosphoricons.regular.CalendarPlus
import com.adamglin.phosphoricons.regular.CaretDown
import com.adamglin.phosphoricons.regular.CaretLeft
import com.adamglin.phosphoricons.regular.CaretRight
import com.adamglin.phosphoricons.regular.Clock
import com.adamglin.phosphoricons.regular.Copy
import com.adamglin.phosphoricons.regular.DotsThree
import com.adamglin.phosphoricons.regular.Link
import com.adamglin.phosphoricons.regular.ListPlus
import com.adamglin.phosphoricons.regular.MagnifyingGlass
import com.adamglin.phosphoricons.regular.Microphone
import com.adamglin.phosphoricons.regular.Minus
import com.adamglin.phosphoricons.regular.Plus
import com.adamglin.phosphoricons.regular.Share
import com.adamglin.phosphoricons.regular.Sparkle
import com.adamglin.phosphoricons.regular.Tag
import com.adamglin.phosphoricons.regular.Trash
import com.adamglin.phosphoricons.regular.UserCircleMinus
import com.adamglin.phosphoricons.regular.WarningCircle
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonGroup
import com.esuiss.ui.components.ButtonGroupOrientation
import com.esuiss.ui.components.ButtonGroupSeparator
import com.esuiss.ui.components.ButtonGroupText
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.DropdownMenu
import com.esuiss.ui.components.DropdownMenuGroup
import com.esuiss.ui.components.DropdownMenuItem
import com.esuiss.ui.components.DropdownMenuSeparator
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Input
import com.esuiss.ui.components.InputGroup
import com.esuiss.ui.components.InputGroupAddon
import com.esuiss.ui.components.InputGroupAddonAlign
import com.esuiss.ui.components.InputGroupButton
import com.esuiss.ui.components.InputGroupButtonSize
import com.esuiss.ui.components.InputGroupInput
import com.esuiss.ui.components.MenuItemVariant
import com.esuiss.ui.components.Popover
import com.esuiss.ui.components.PopoverDescription
import com.esuiss.ui.components.PopoverHeader
import com.esuiss.ui.components.PopoverTitle
import com.esuiss.ui.components.PopupAlign
import com.esuiss.ui.components.Select
import com.esuiss.ui.components.SelectOption
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.Textarea
import com.esuiss.ui.theme.EsuissTheme

val buttonGroupStories = StoryGroup(
    section = Section.Components,
    title = "Button Group",
    stories = listOf(
        Story("Default") { ButtonGroupMail(ButtonVariant.Secondary, separators = true) },
        Story("Outline") { ButtonGroupMail(ButtonVariant.Outline, separators = false) },
        Story("Orientation") { ButtonGroupOrientationStory() },
        Story("Sizes") { ButtonGroupSizes() },
        Story("Nested") { ButtonGroupNested() },
        Story("WithSeparator") { ButtonGroupWithSeparator() },
        Story("Plain") { ButtonGroupPlain() },
        Story("SplitButton") { ButtonGroupSplitButton() },
        Story("WithInput") { ButtonGroupWithInput() },
        Story("WithInputGroup") { ButtonGroupWithInputGroup() },
        Story("WithText") { ButtonGroupWithText() },
        Story("WithDropdownMenu") { ButtonGroupWithDropdownMenu() },
        Story("WithSelect") { ButtonGroupWithSelect() },
        Story("WithPopover") { ButtonGroupWithPopover() },
        Story("Pagination") { ButtonGroupPagination() },
    ),
)

@Composable
private fun ButtonGroupIconButton(
    label: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    variant: ButtonVariant = ButtonVariant.Default,
    size: ButtonSize = ButtonSize.Icon,
    onClick: () -> Unit = {},
) {
    Button(onClick = onClick, variant = variant, size = size) {
        Icon(icon, contentDescription = label)
    }
}

@Composable
private fun ButtonGroupMailMenu(variant: ButtonVariant) {
    var open by rememberSaveable { mutableStateOf(false) }
    DropdownMenu(
        expanded = open,
        onExpandedChange = { open = it },
        trigger = { ButtonGroupIconButton("More options", PhosphorIcons.Regular.DotsThree, variant) { open = true } },
        align = PopupAlign.End,
    ) {
        DropdownMenuGroup {
            DropdownMenuItem("Mark as read", onClick = {}, icon = PhosphorIcons.Regular.ListPlus)
            DropdownMenuItem("Archive", onClick = {}, icon = PhosphorIcons.Regular.Archive)
        }
        DropdownMenuSeparator()
        DropdownMenuGroup {
            DropdownMenuItem("Snooze", onClick = {}, icon = PhosphorIcons.Regular.Clock)
            DropdownMenuItem("Add to calendar", onClick = {}, icon = PhosphorIcons.Regular.CalendarPlus)
            DropdownMenuItem("Label as", onClick = {}, icon = PhosphorIcons.Regular.Tag)
        }
        DropdownMenuSeparator()
        DropdownMenuGroup {
            DropdownMenuItem("Trash", onClick = {}, icon = PhosphorIcons.Regular.Trash, variant = MenuItemVariant.Destructive)
        }
    }
}

@Composable
private fun ButtonGroupMail(variant: ButtonVariant, separators: Boolean) {
    ButtonGroup {
        ButtonGroup {
            ButtonGroupIconButton("Go back", PhosphorIcons.Regular.ArrowLeft, variant)
        }
        ButtonGroup {
            Button("Archive", onClick = {}, variant = variant)
            if (separators) ButtonGroupSeparator()
            Button("Report", onClick = {}, variant = variant)
        }
        ButtonGroup {
            Button("Snooze", onClick = {}, variant = variant)
            if (separators) ButtonGroupSeparator()
            ButtonGroupMailMenu(variant)
        }
    }
}

@Composable
private fun ButtonGroupOrientationStory() {
    ButtonGroup(
        modifier = Modifier.semantics { contentDescription = "Media controls" },
        orientation = ButtonGroupOrientation.Vertical,
    ) {
        ButtonGroupIconButton("Zoom in", PhosphorIcons.Regular.Plus, ButtonVariant.Secondary)
        ButtonGroupSeparator(orientation = Orientation.Horizontal)
        ButtonGroupIconButton("Zoom out", PhosphorIcons.Regular.Minus, ButtonVariant.Secondary)
    }
}

@Composable
private fun ButtonGroupSizes() {
    Column(verticalArrangement = Arrangement.spacedBy(24.dp)) {
        listOf(
            Triple("Small", ButtonSize.Sm, ButtonSize.IconSm),
            Triple("Default", ButtonSize.Default, ButtonSize.Icon),
            Triple("Large", ButtonSize.Lg, ButtonSize.IconLg),
        ).forEach { (label, size, icon) ->
            ButtonGroup {
                Button(label, onClick = {}, variant = ButtonVariant.Outline, size = size)
                Button("Button", onClick = {}, variant = ButtonVariant.Outline, size = size)
                Button("Group", onClick = {}, variant = ButtonVariant.Outline, size = size)
                ButtonGroupIconButton("Add", PhosphorIcons.Regular.Plus, ButtonVariant.Outline, icon)
            }
        }
    }
}

@Composable
private fun ButtonGroupNested() {
    ButtonGroup {
        ButtonGroup {
            listOf("1", "2", "3", "4", "5").forEach { page ->
                Button(page, onClick = {}, variant = ButtonVariant.Outline, size = ButtonSize.Sm)
            }
        }
        ButtonGroup {
            ButtonGroupIconButton("Previous", PhosphorIcons.Regular.ArrowLeft, ButtonVariant.Outline, ButtonSize.IconSm)
            ButtonGroupIconButton("Next", PhosphorIcons.Regular.ArrowRight, ButtonVariant.Outline, ButtonSize.IconSm)
        }
    }
}

@Composable
private fun ButtonGroupWithSeparator() {
    ButtonGroup {
        Button(onClick = {}, variant = ButtonVariant.Secondary) {
            Icon(PhosphorIcons.Regular.Copy, contentDescription = null)
            Text("Copy")
        }
        ButtonGroupSeparator()
        Button(onClick = {}, variant = ButtonVariant.Secondary) {
            Icon(PhosphorIcons.Regular.Share, contentDescription = null)
            Text("Share")
        }
    }
}

@Composable
private fun ButtonGroupPlain() {
    ButtonGroup {
        Button(onClick = {}, variant = ButtonVariant.Plain) {
            Icon(PhosphorIcons.Regular.ArrowLeft, contentDescription = null)
            Text("Back")
        }
        Button(onClick = {}, variant = ButtonVariant.Plain) {
            Text("Forward")
            Icon(PhosphorIcons.Regular.ArrowRight, contentDescription = null)
        }
        Button(onClick = {}, variant = ButtonVariant.Plain) {
            Icon(PhosphorIcons.Regular.Share, contentDescription = null)
            Text("Share")
        }
    }
}

@Composable
private fun ButtonGroupSplitButton() {
    ButtonGroup {
        Button("Publish", onClick = {})
        ButtonGroupSeparator(color = EsuissTheme.colors.onAccent.copy(alpha = 0.3f))
        ButtonGroupIconButton("More options", PhosphorIcons.Regular.CaretDown)
    }
}

@Composable
private fun ButtonGroupWithInput() {
    var search by rememberSaveable { mutableStateOf("") }
    ButtonGroup(Modifier.fillMaxWidth()) {
        Input(
            search,
            { search = it },
            Modifier.semantics { contentDescription = "Search" },
            placeholder = "Search...",
        )
        ButtonGroupIconButton("Search", PhosphorIcons.Regular.MagnifyingGlass, ButtonVariant.Secondary, ButtonSize.IconLg)
    }
}

@Composable
private fun ButtonGroupWithInputGroup() {
    var message by rememberSaveable { mutableStateOf("") }
    BoxWithConstraints(Modifier.fillMaxWidth()) {
        val rest = maxWidth - 8.dp - ButtonSize.IconLg.height
        ButtonGroup(Modifier.fillMaxWidth()) {
            ButtonGroup {
                ButtonGroupIconButton("Add", PhosphorIcons.Regular.Plus, ButtonVariant.Outline, ButtonSize.IconLg)
            }
            ButtonGroup(Modifier.width(rest)) {
                InputGroup(Modifier.width(rest)) {
                    InputGroupInput(
                        message,
                        { message = it },
                        Modifier.semantics { contentDescription = "Message" },
                        placeholder = "Send a message...",
                    )
                    InputGroupAddon(align = InputGroupAddonAlign.InlineEnd) {
                        InputGroupButton(onClick = {}, size = InputGroupButtonSize.IconXs) {
                            Icon(PhosphorIcons.Regular.Microphone, contentDescription = "Voice mode")
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ButtonGroupWithText() {
    var website by rememberSaveable { mutableStateOf("") }
    ButtonGroup(Modifier.fillMaxWidth()) {
        ButtonGroupText {
            Icon(PhosphorIcons.Regular.Link, contentDescription = null)
            Text("https://")
        }
        Input(
            website,
            { website = it },
            Modifier.semantics { contentDescription = "Website" },
            placeholder = "example.com",
        )
        Button("Save", onClick = {}, variant = ButtonVariant.Secondary, size = ButtonSize.Lg)
    }
}

@Composable
private fun ButtonGroupWithDropdownMenu() {
    var open by rememberSaveable { mutableStateOf(false) }
    ButtonGroup {
        Button("Follow", onClick = {}, variant = ButtonVariant.Outline)
        DropdownMenu(
            expanded = open,
            onExpandedChange = { open = it },
            trigger = { ButtonGroupIconButton("More options", PhosphorIcons.Regular.CaretDown, ButtonVariant.Outline) { open = true } },
            align = PopupAlign.End,
        ) {
            DropdownMenuGroup {
                DropdownMenuItem("Mute conversation", onClick = {}, icon = PhosphorIcons.Regular.WarningCircle)
                DropdownMenuItem("Copy link", onClick = {}, icon = PhosphorIcons.Regular.Copy)
                DropdownMenuItem("Share conversation", onClick = {}, icon = PhosphorIcons.Regular.Share)
            }
            DropdownMenuSeparator()
            DropdownMenuGroup {
                DropdownMenuItem(
                    "Unfollow",
                    onClick = {},
                    icon = PhosphorIcons.Regular.UserCircleMinus,
                    variant = MenuItemVariant.Destructive,
                )
            }
        }
    }
}

private val buttonGroupCurrencies = listOf(
    SelectOption("usd", "$"),
    SelectOption("eur", "€"),
    SelectOption("gbp", "£"),
    SelectOption("try", "₺"),
)

@Composable
private fun ButtonGroupWithSelect() {
    var currency by rememberSaveable { mutableStateOf<String?>("usd") }
    var amount by rememberSaveable { mutableStateOf("") }
    BoxWithConstraints(Modifier.fillMaxWidth()) {
        val rest = maxWidth - 8.dp - ButtonSize.IconLg.height
        ButtonGroup(Modifier.fillMaxWidth()) {
            ButtonGroup(Modifier.width(rest)) {
                Select(
                    value = currency,
                    onValueChange = { currency = it },
                    options = buttonGroupCurrencies,
                    modifier = Modifier.semantics { contentDescription = "Currency" },
                )
                Input(
                    amount,
                    { amount = it },
                    Modifier.semantics { contentDescription = "Amount" },
                    placeholder = "10.00",
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                )
            }
            ButtonGroup {
                ButtonGroupIconButton("Send", PhosphorIcons.Regular.ArrowRight, ButtonVariant.Outline, ButtonSize.IconLg)
            }
        }
    }
}

@Composable
private fun ButtonGroupWithPopover() {
    var open by rememberSaveable { mutableStateOf(false) }
    var task by rememberSaveable { mutableStateOf("") }
    ButtonGroup {
        Button(onClick = {}, variant = ButtonVariant.Outline) {
            Icon(PhosphorIcons.Regular.Sparkle, contentDescription = null)
            Text("Assistant")
        }
        Popover(
            open = open,
            onOpenChange = { open = it },
            trigger = { ButtonGroupIconButton("Open popover", PhosphorIcons.Regular.CaretDown, ButtonVariant.Outline) { open = true } },
            modifier = Modifier.width(320.dp),
            align = PopupAlign.End,
        ) {
            PopoverHeader {
                PopoverTitle("Start a new task")
                PopoverDescription("Describe your task in natural language.")
            }
            Textarea(
                task,
                { task = it },
                Modifier.semantics { contentDescription = "Task description" },
                placeholder = "I need to...",
            )
        }
    }
}

@Composable
private fun ButtonGroupPagination() {
    ButtonGroup(Modifier.semantics { contentDescription = "Pagination" }) {
        ButtonGroupIconButton("Previous page", PhosphorIcons.Regular.CaretLeft, ButtonVariant.Outline)
        Button("1", onClick = {}, variant = ButtonVariant.Outline)
        Button("2", onClick = {}, modifier = Modifier.semantics { selected = true }, variant = ButtonVariant.Outline)
        Button("3", onClick = {}, variant = ButtonVariant.Outline)
        ButtonGroupIconButton("Next page", PhosphorIcons.Regular.CaretRight, ButtonVariant.Outline)
    }
}
