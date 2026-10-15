package com.esuiss.ui

import android.graphics.Bitmap
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.asAndroidBitmap
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.state.ToggleableState
import androidx.compose.ui.test.captureToImage
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.unit.dp
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Check
import com.adamglin.phosphoricons.regular.Info
import com.adamglin.phosphoricons.regular.TextB
import com.adamglin.phosphoricons.regular.TextItalic
import com.adamglin.phosphoricons.regular.TextUnderline
import com.adamglin.phosphoricons.regular.Warning
import com.esuiss.ui.components.Alert
import com.esuiss.ui.components.AlertDescription
import com.esuiss.ui.components.AlertTitle
import com.esuiss.ui.components.AlertVariant
import com.esuiss.ui.components.AspectRatio
import com.esuiss.ui.components.Avatar
import com.esuiss.ui.components.AvatarBadge
import com.esuiss.ui.components.AvatarFallback
import com.esuiss.ui.components.AvatarGroup
import com.esuiss.ui.components.AvatarGroupCount
import com.esuiss.ui.components.AvatarSize
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
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
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Input
import com.esuiss.ui.components.InputOTP
import com.esuiss.ui.components.InputOTPGroup
import com.esuiss.ui.components.InputOTPSeparator
import com.esuiss.ui.components.InputOTPSlot
import com.esuiss.ui.components.InputSize
import com.esuiss.ui.components.Label
import com.esuiss.ui.components.Progress
import com.esuiss.ui.components.RadioGroup
import com.esuiss.ui.components.RadioGroupItem
import com.esuiss.ui.components.RangeSlider
import com.esuiss.ui.components.Separator
import com.esuiss.ui.components.Skeleton
import com.esuiss.ui.components.Slider
import com.esuiss.ui.components.Switch
import com.esuiss.ui.components.SwitchSize
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TextVariant
import com.esuiss.ui.components.Textarea
import com.esuiss.ui.components.Toggle
import com.esuiss.ui.components.ToggleGroup
import com.esuiss.ui.components.ToggleGroupItem
import com.esuiss.ui.components.ToggleSize
import com.esuiss.ui.components.ToggleVariant
import com.esuiss.ui.components.TriStateCheckbox
import com.esuiss.ui.theme.EsuissTheme
import java.io.File
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@Composable
private fun TypographySection() {
    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
        TextVariant.entries.forEach { variant ->
            Text(variant.name, variant = variant)
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
            Label("Email")
            Label("Disabled", enabled = false)
        }
        Separator()
        Row(Modifier.height(20.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Text("Blog")
            Separator(orientation = Orientation.Vertical)
            Text("Docs")
        }
    }
}

@Composable
private fun MediaSection() {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
            Skeleton(Modifier.size(40.dp), shape = CircleShape)
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Skeleton(Modifier.width(200.dp).height(16.dp))
                Skeleton(Modifier.width(140.dp).height(16.dp))
            }
        }
        AspectRatio(16f / 9f, Modifier.width(200.dp)) {
            Box(Modifier.fillMaxSize().background(EsuissTheme.colors.secondary))
        }
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
            AvatarSize.entries.forEach { size ->
                Avatar(
                    size = size,
                    badge = { AvatarBadge { Icon(PhosphorIcons.Regular.Check, contentDescription = null) } },
                    fallback = { AvatarFallback("ec") },
                )
            }
        }
        AvatarGroup {
            Avatar(fallback = { AvatarFallback("AB") })
            Avatar(fallback = { AvatarFallback("CD") })
            Avatar(fallback = { AvatarFallback("EF") })
            AvatarGroupCount("+3")
        }
        AvatarGroup {
            Avatar(size = AvatarSize.Xl, fallback = { AvatarFallback("AB") })
            Avatar(size = AvatarSize.Xl, fallback = { AvatarFallback("CD") })
            AvatarGroupCount("+9", size = AvatarSize.Xl)
        }
    }
}

@Composable
private fun FeedbackSection() {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Progress(value = 60f, label = "Upload", showValue = true)
        Progress(value = 25f)
        Alert(icon = PhosphorIcons.Regular.Info) {
            AlertTitle("Heads up")
            AlertDescription("You can add components to your app.")
        }
        Alert(
            variant = AlertVariant.Destructive,
            icon = PhosphorIcons.Regular.Warning,
            action = { Button("Undo", onClick = {}, variant = ButtonVariant.Secondary, size = ButtonSize.Xs) },
        ) {
            AlertTitle("Payment failed")
            AlertDescription("Your card was declined.")
        }
    }
}

@Composable
private fun InputSection() {
    var text by remember { mutableStateOf("") }
    var otp by remember { mutableStateOf("123") }
    var notes by remember { mutableStateOf("") }
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        InputSize.entries.forEach { size ->
            Input(text, { text = it }, size = size, placeholder = "Input ${size.name}")
        }
        Input("Invalid value", {}, invalid = true)
        Input("", {}, enabled = false, placeholder = "Disabled")
        Textarea(notes, { notes = it }, placeholder = "Type your message")
        InputOTP(otp, { otp = it }, maxLength = 6) {
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
        InputOTP("12", {}, maxLength = 4, enabled = false)
    }
}

@Composable
private fun FieldSection() {
    var email by remember { mutableStateOf("") }
    var marketing by remember { mutableStateOf(true) }
    FieldSet {
        FieldLegend("Profile")
        FieldGroup {
            Field {
                FieldLabel("Email")
                Input(email, { email = it }, placeholder = "you@example.com")
                FieldDescription("We never share your email.")
            }
            Field(invalid = true) {
                FieldLabel("Username")
                Input("ab", {})
                FieldError(listOf("Too short", "Already taken"))
            }
            FieldSeparator(text = "Or")
            Field(
                orientation = FieldOrientation.Horizontal,
                modifier = Modifier.toggleable(value = marketing, role = Role.Checkbox) { marketing = it },
            ) {
                Checkbox(marketing, onCheckedChange = null)
                FieldContent {
                    FieldLabel("Marketing emails")
                    FieldDescription("Receive product news.")
                }
            }
        }
    }
}

@Composable
private fun InsetFieldSection() {
    var wifi by remember { mutableStateOf(true) }
    FieldSet(variant = FieldGroupVariant.Inset) {
        FieldLegend("Connectivity")
        FieldGroup(variant = FieldGroupVariant.Inset) {
            Field(orientation = FieldOrientation.Horizontal) {
                FieldContent { FieldLabel("Wi-Fi") }
                Switch(wifi, { wifi = it })
            }
            Field(orientation = FieldOrientation.Horizontal) {
                FieldContent { FieldLabel("Bluetooth") }
                Switch(false, {})
            }
            Field(orientation = FieldOrientation.Horizontal, enabled = false) {
                FieldContent { FieldLabel("Airplane mode") }
                Switch(false, {})
            }
        }
        FieldDescription("Changes apply immediately.")
    }
}

@Composable
private fun ControlSection() {
    var checked by remember { mutableStateOf(true) }
    var plan by remember { mutableStateOf("pro") }
    var on by remember { mutableStateOf(true) }
    var volume by remember { mutableFloatStateOf(40f) }
    var range by remember { mutableStateOf(20f..70f) }
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(4.dp), verticalAlignment = Alignment.CenterVertically) {
            Checkbox(checked, { checked = it })
            Checkbox(false, {})
            TriStateCheckbox(ToggleableState.Indeterminate, {})
            Checkbox(false, {}, invalid = true)
            Checkbox(true, {}, enabled = false)
            Checkbox(false, {}, enabled = false)
        }
        RadioGroup(plan, { plan = it }) {
            RadioGroupItem("free", label = { Text("Free") })
            RadioGroupItem("pro", label = { Text("Pro") })
            RadioGroupItem("team", enabled = false, label = { Text("Team") })
        }
        Row(horizontalArrangement = Arrangement.spacedBy(4.dp), verticalAlignment = Alignment.CenterVertically) {
            Switch(on, { on = it })
            Switch(false, {})
            Switch(true, {}, size = SwitchSize.Sm)
            Switch(false, {}, invalid = true)
            Switch(true, {}, enabled = false)
        }
        Slider(volume, { volume = it }, contentDescription = "Volume")
        RangeSlider(range, { range = it }, contentDescription = "Price")
        Slider(50f, {}, enabled = false)
    }
}

@Composable
private fun ToggleSection() {
    var bold by remember { mutableStateOf(true) }
    var single by remember { mutableStateOf<String?>("left") }
    var multiple by remember { mutableStateOf(setOf("b")) }
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
            Toggle(bold, { bold = it }) { Icon(PhosphorIcons.Regular.TextB, contentDescription = "Bold") }
            Toggle(false, {}, variant = ToggleVariant.Outline) {
                Icon(PhosphorIcons.Regular.TextItalic, contentDescription = "Italic")
            }
            Toggle("Small", true, {}, size = ToggleSize.Sm)
            Toggle("Large", false, {}, variant = ToggleVariant.Outline, size = ToggleSize.Lg)
            Toggle("Off", true, {}, enabled = false)
        }
        ToggleGroup(values = multiple, onValuesChange = { multiple = it }) {
            ToggleGroupItem("b") { Icon(PhosphorIcons.Regular.TextB, contentDescription = "Bold") }
            ToggleGroupItem("i") { Icon(PhosphorIcons.Regular.TextItalic, contentDescription = "Italic") }
            ToggleGroupItem("u") { Icon(PhosphorIcons.Regular.TextUnderline, contentDescription = "Underline") }
        }
        ToggleGroup(value = single, onValueChange = { single = it }, spacing = 0) {
            ToggleGroupItem("Left", "left")
            ToggleGroupItem("Center", "center")
            ToggleGroupItem("Right", "right")
        }
        ToggleGroup(value = single, onValueChange = { single = it }, variant = ToggleVariant.Outline, spacing = 0) {
            ToggleGroupItem("Left", "left")
            ToggleGroupItem("Center", "center")
            ToggleGroupItem("Right", "right")
        }
        ToggleGroup(
            values = multiple,
            onValuesChange = { multiple = it },
            variant = ToggleVariant.Outline,
            spacing = 0,
            orientation = Orientation.Vertical,
        ) {
            ToggleGroupItem("Bold", "b")
            ToggleGroupItem("Italic", "i")
            ToggleGroupItem("Underline", "u")
        }
    }
}

private enum class FormsScene(val content: @Composable () -> Unit) {
    Typography({ TypographySection() }),
    Media({ MediaSection() }),
    Feedback({ FeedbackSection() }),
    Inputs({ InputSection() }),
    Fields({ FieldSection() }),
    InsetFields({ InsetFieldSection() }),
    Controls({ ControlSection() }),
    Toggles({ ToggleSection() }),
}

@RunWith(AndroidJUnit4::class)
class FormsGalleryTest {
    @get:Rule
    val compose = createComposeRule()

    @Test
    fun rendersFormsGalleryInBothSchemes() {
        var dark by mutableStateOf(false)
        var scene by mutableStateOf(FormsScene.Typography)
        compose.setContent {
            EsuissTheme(darkTheme = dark) {
                Column(
                    modifier = Modifier
                        .testTag("forms")
                        .width(402.dp)
                        .background(EsuissTheme.colors.background)
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(24.dp),
                ) {
                    key(scene) { scene.content() }
                }
            }
        }
        val context = InstrumentationRegistry.getInstrumentation().targetContext
        for (current in FormsScene.entries) {
            for (scheme in listOf(false, true)) {
                scene = current
                dark = scheme
                compose.waitForIdle()
                val bitmap = compose.onNodeWithTag("forms").captureToImage().asAndroidBitmap()
                val name = "forms-${current.name.lowercase()}-${if (scheme) "dark" else "light"}.png"
                File(context.getExternalFilesDir(null), name).outputStream().use {
                    bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)
                }
            }
        }
    }
}
