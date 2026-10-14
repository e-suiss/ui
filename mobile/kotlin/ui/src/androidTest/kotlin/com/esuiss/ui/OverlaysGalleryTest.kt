package com.esuiss.ui

import android.graphics.Bitmap
import android.os.SystemClock
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.test.hasSetTextAction
import androidx.compose.ui.test.hasTestTag
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.unit.dp
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Copy
import com.adamglin.phosphoricons.regular.Trash
import com.esuiss.ui.components.Accordion
import com.esuiss.ui.components.AccordionItem
import com.esuiss.ui.components.AccordionVariant
import com.esuiss.ui.components.AlertDialog
import com.esuiss.ui.components.AlertDialogAction
import com.esuiss.ui.components.AlertDialogCancel
import com.esuiss.ui.components.AlertDialogDescription
import com.esuiss.ui.components.AlertDialogFooter
import com.esuiss.ui.components.AlertDialogHeader
import com.esuiss.ui.components.AlertDialogMedia
import com.esuiss.ui.components.AlertDialogTitle
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Collapsible
import com.esuiss.ui.components.CollapsibleContent
import com.esuiss.ui.components.CollapsibleTrigger
import com.esuiss.ui.components.Combobox
import com.esuiss.ui.components.ContextMenu
import com.esuiss.ui.components.Dialog
import com.esuiss.ui.components.DialogDescription
import com.esuiss.ui.components.DialogFooter
import com.esuiss.ui.components.DialogHeader
import com.esuiss.ui.components.DialogTitle
import com.esuiss.ui.components.Drawer
import com.esuiss.ui.components.DrawerDescription
import com.esuiss.ui.components.DrawerFooter
import com.esuiss.ui.components.DrawerHeader
import com.esuiss.ui.components.DrawerTitle
import com.esuiss.ui.components.DropdownMenu
import com.esuiss.ui.components.DropdownMenuCheckboxItem
import com.esuiss.ui.components.DropdownMenuGroup
import com.esuiss.ui.components.DropdownMenuItem
import com.esuiss.ui.components.DropdownMenuLabel
import com.esuiss.ui.components.DropdownMenuRadioGroup
import com.esuiss.ui.components.DropdownMenuRadioItem
import com.esuiss.ui.components.DropdownMenuSeparator
import com.esuiss.ui.components.DropdownMenuSub
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.components.MenuItemVariant
import com.esuiss.ui.components.MultiCombobox
import com.esuiss.ui.components.Popover
import com.esuiss.ui.components.PopoverDescription
import com.esuiss.ui.components.PopoverHeader
import com.esuiss.ui.components.PopoverTitle
import com.esuiss.ui.components.Select
import com.esuiss.ui.components.SelectGroup
import com.esuiss.ui.components.SelectItem
import com.esuiss.ui.components.SelectLabel
import com.esuiss.ui.components.SelectOption
import com.esuiss.ui.components.SelectSeparator
import com.esuiss.ui.components.Sheet
import com.esuiss.ui.components.SheetDescription
import com.esuiss.ui.components.SheetFooter
import com.esuiss.ui.components.SheetHeader
import com.esuiss.ui.components.SheetSide
import com.esuiss.ui.components.SheetTitle
import com.esuiss.ui.components.Tabs
import com.esuiss.ui.components.TabsContent
import com.esuiss.ui.components.TabsList
import com.esuiss.ui.components.TabsListVariant
import com.esuiss.ui.components.TabsTrigger
import com.esuiss.ui.components.ToastAction
import com.esuiss.ui.components.Toaster
import com.esuiss.ui.components.rememberToastState
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography
import java.io.File
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

private enum class Scene {
    Inline,
    Dialog,
    AlertDialog,
    Sheet,
    Drawer,
    Popover,
    Toast,
    DropdownMenu,
    ContextMenu,
    Select,
    Combobox,
    MultiCombobox,
}

private const val Overlay = "overlay"

private val Fruits = listOf("Banana", "Blueberry", "Grapes", "Mango", "Kiwi")

@Composable
private fun Inline() {
    val colors = EsuissTheme.colors
    Column(verticalArrangement = Arrangement.spacedBy(24.dp)) {
        var first by remember { mutableStateOf(true) }
        var second by remember { mutableStateOf(false) }
        Accordion {
            AccordionItem(first, { first = it }, "Product information") {
                BasicText("Our flagship product combines cutting-edge technology with sleek design.", style = LocalContentStyle.current)
            }
            AccordionItem(second, { second = it }, "Shipping details") {
                BasicText("We offer worldwide shipping.", style = LocalContentStyle.current)
            }
            AccordionItem(false, {}, "Disabled", enabled = false) {}
        }
        Accordion(variant = AccordionVariant.Filled) {
            AccordionItem(true, {}, "Filled item") {
                BasicText("Filled accordion content.", style = LocalContentStyle.current)
            }
            AccordionItem(false, {}, "Another item") {}
        }
        Collapsible(expanded = true, onExpandedChange = {}) {
            CollapsibleTrigger {
                BasicText("Starred repositories", style = Typography.sm.copy(color = colors.label))
            }
            CollapsibleContent {
                BasicText("@esuiss/ui", style = Typography.sm.copy(color = colors.labelSecondary))
            }
        }
        var tab by remember { mutableStateOf("overview") }
        Tabs(tab, { tab = it }) {
            TabsList {
                TabsTrigger("overview", "Overview")
                TabsTrigger("analytics", "Analytics")
                TabsTrigger("reports", "Reports")
            }
            TabsContent("overview") {
                BasicText("Overview content", style = Typography.sm.copy(color = colors.labelSecondary))
            }
        }
        Tabs("analytics", {}) {
            TabsList(variant = TabsListVariant.Line) {
                TabsTrigger("overview", "Overview")
                TabsTrigger("analytics", "Analytics")
                TabsTrigger("reports", "Reports", enabled = false)
            }
        }
    }
}

@Composable
private fun Scene(scene: Scene) {
    val toasts = rememberToastState()
    when (scene) {
        Scene.Inline -> Inline()
        Scene.Dialog -> Dialog(open = true, onOpenChange = {}, modifier = Modifier.testTag(Overlay)) {
            DialogHeader {
                DialogTitle("Edit profile")
                DialogDescription("Make changes to your profile here. Click save when you're done.")
            }
            BasicText("Name: Pedro Duarte", style = LocalContentStyle.current)
            DialogFooter(showCloseButton = true) {
                Button("Save changes", onClick = {}, modifier = Modifier.fillMaxWidth())
            }
        }
        Scene.AlertDialog -> AlertDialog(open = true, onOpenChange = {}, modifier = Modifier.testTag(Overlay)) {
            AlertDialogHeader {
                AlertDialogMedia { Icon(PhosphorIcons.Regular.Trash, contentDescription = null) }
                AlertDialogTitle("Delete chat?")
                AlertDialogDescription("This will permanently delete this chat conversation.")
            }
            AlertDialogFooter {
                AlertDialogCancel("Cancel")
                AlertDialogAction("Delete", onClick = {}, variant = ButtonVariant.Destructive)
            }
        }
        Scene.Sheet -> Sheet(open = true, onOpenChange = {}, modifier = Modifier.testTag(Overlay), side = SheetSide.Right) {
            SheetHeader {
                SheetTitle("Edit profile")
                SheetDescription("Make changes to your profile here.")
            }
            SheetFooter {
                Button("Save changes", onClick = {}, modifier = Modifier.fillMaxWidth())
            }
        }
        Scene.Drawer -> Drawer(
            open = true,
            onOpenChange = {},
            modifier = Modifier.testTag(Overlay),
            showSwipeHandle = true,
            showCloseButton = true,
        ) {
            DrawerHeader {
                DrawerTitle("Move goal")
                DrawerDescription("Set your daily activity goal.")
            }
            BasicText(
                "350 calories/day",
                modifier = Modifier.fillMaxWidth().padding(24.dp),
                style = Typography.xl2.copy(color = EsuissTheme.colors.label),
            )
            DrawerFooter {
                Button("Submit", onClick = {}, modifier = Modifier.fillMaxWidth())
                Button("Cancel", onClick = {}, modifier = Modifier.fillMaxWidth(), variant = ButtonVariant.Secondary)
            }
        }
        Scene.Popover -> Popover(
            open = true,
            onOpenChange = {},
            trigger = { Button("Open popover", onClick = {}, variant = ButtonVariant.Outline) },
            modifier = Modifier.testTag(Overlay),
        ) {
            PopoverHeader {
                PopoverTitle("Dimensions")
                PopoverDescription("Set the dimensions for the layer.")
            }
        }
        Scene.Toast -> Toaster(toasts, modifier = Modifier.fillMaxSize()) {
            LaunchedEffect(Unit) {
                toasts.info("Update available")
                toasts.error("Upload failed", "The file is too large.")
                toasts.show("Event created", "Sunday, December 03 at 9:00 AM", action = ToastAction("Undo") {})
                toasts.success("Changes saved")
            }
        }
        Scene.DropdownMenu -> DropdownMenu(
            expanded = true,
            onExpandedChange = {},
            trigger = { Button("Open", onClick = {}, variant = ButtonVariant.Outline) },
            modifier = Modifier.testTag(Overlay),
        ) {
            DropdownMenuGroup {
                DropdownMenuLabel("My Account")
                DropdownMenuItem("Profile", onClick = {})
                DropdownMenuItem("Duplicate", onClick = {}, icon = PhosphorIcons.Regular.Copy)
                DropdownMenuSub("Invite users") {
                    DropdownMenuItem("Email", onClick = {})
                }
            }
            DropdownMenuSeparator()
            DropdownMenuCheckboxItem("Status bar", checked = true, onCheckedChange = {})
            DropdownMenuRadioGroup("top", {}) {
                DropdownMenuRadioItem("top", "Top")
                DropdownMenuRadioItem("bottom", "Bottom")
            }
            DropdownMenuSeparator()
            DropdownMenuItem("Delete", onClick = {}, icon = PhosphorIcons.Regular.Trash, variant = MenuItemVariant.Destructive)
        }
        Scene.ContextMenu -> ContextMenu(
            expanded = true,
            onExpandedChange = {},
            trigger = {
                Box(modifier = Modifier.width(300.dp).padding(48.dp), contentAlignment = Alignment.Center) {
                    BasicText("Long press here", style = Typography.sm.copy(color = EsuissTheme.colors.labelSecondary))
                }
            },
            modifier = Modifier.testTag(Overlay),
        ) {
            DropdownMenuItem("Back", onClick = {})
            DropdownMenuItem("Forward", onClick = {}, enabled = false)
            DropdownMenuItem("Reload", onClick = {})
        }
        Scene.Select -> {
            var value by remember { mutableStateOf<String?>("banana") }
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Select(
                    value = value,
                    onValueChange = { value = it },
                    displayValue = value?.replaceFirstChar { it.uppercase() },
                    placeholder = "Select a fruit",
                ) {
                    SelectGroup {
                        SelectLabel("Fruits")
                        Fruits.forEach { SelectItem(it.lowercase(), it) }
                    }
                    SelectSeparator()
                    SelectGroup { SelectItem("other", "Other", enabled = false) }
                }
                Select(null, {}, listOf(SelectOption("a", "Option A")), placeholder = "Invalid", invalid = true)
            }
        }
        Scene.Combobox -> {
            var value by remember { mutableStateOf<String?>(null) }
            Combobox(Fruits, value, { value = it }, placeholder = "Select a fruit", showClear = true)
        }
        Scene.MultiCombobox -> {
            var values by remember { mutableStateOf(listOf("Banana", "Grapes")) }
            MultiCombobox(Fruits, values, { values = it }, placeholder = "Add fruits")
        }
    }
}

@RunWith(AndroidJUnit4::class)
class OverlaysGalleryTest {
    @get:Rule
    val compose = createComposeRule()

    @Test
    fun rendersOverlaysInBothSchemes() {
        var dark by mutableStateOf(false)
        var scene by mutableStateOf(Scene.Inline)
        compose.mainClock.autoAdvance = false
        compose.setContent {
            EsuissTheme(darkTheme = dark) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(EsuissTheme.colors.surface)
                        .safeDrawingPadding()
                        .padding(16.dp),
                ) {
                    key(scene, dark) { Scene(scene) }
                }
            }
        }
        val instrumentation = InstrumentationRegistry.getInstrumentation()
        val context = instrumentation.targetContext
        for (current in Scene.entries) {
            for (scheme in listOf(false, true)) {
                scene = current
                dark = scheme
                settle()
                when (current) {
                    Scene.Select -> compose.onNodeWithText("Banana").performClick()
                    Scene.Combobox, Scene.MultiCombobox -> compose.onNode(hasSetTextAction()).performClick()
                    else -> Unit
                }
                settle()
                when (current) {
                    Scene.Inline -> Unit
                    Scene.Toast -> compose.onNodeWithText("Event created").assertExists()
                    Scene.Select -> compose.onNodeWithText("Blueberry").assertExists()
                    Scene.Combobox, Scene.MultiCombobox -> compose.onNodeWithText("Kiwi").assertExists()
                    else -> compose.onNode(hasTestTag(Overlay), useUnmergedTree = true).assertExists()
                }
                SystemClock.sleep(600)
                val bitmap = checkNotNull(instrumentation.uiAutomation.takeScreenshot())
                val name = "overlays-${current.name.lowercase()}-${if (scheme) "dark" else "light"}.png"
                File(context.getExternalFilesDir(null), name).outputStream().use {
                    bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)
                }
            }
        }
    }

    private fun settle() {
        repeat(4) {
            compose.mainClock.advanceTimeBy(300)
            compose.waitForIdle()
        }
    }
}
