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
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.hapticfeedback.HapticFeedback
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onAllNodesWithContentDescription
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Fingerprint
import com.adamglin.phosphoricons.regular.ScanSmiley
import com.esuiss.ui.components.AmountInput
import com.esuiss.ui.components.InputOTPGroup
import com.esuiss.ui.components.Keypad
import com.esuiss.ui.components.KeypadAccessory
import com.esuiss.ui.components.KeypadKey
import com.esuiss.ui.components.InputOTPSeparator
import com.esuiss.ui.components.InputOTPSlot
import com.esuiss.ui.components.PinPad
import com.esuiss.ui.interactions.OtpAutofill
import com.esuiss.ui.interactions.OtpAutofillInput
import com.esuiss.ui.interactions.OtpAutofillState
import com.esuiss.ui.interactions.OtpAutofillSuggestion
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography
import java.io.File
import java.util.Locale
import kotlinx.coroutines.delay
import org.junit.Assert.assertEquals
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

private enum class InputScene {
    Keypad,
    PinPad,
    PinPadFilled,
    PinPadError,
    PinPadDisabled,
    PinPadBiometric,
    PinPadFace,
    Amount,
    AmountFilled,
    AmountLong,
    AmountEuro,
    AmountLira,
    AmountYen,
    AmountMax,
    AmountDisabled,
    OtpAutofill,
    OtpAutofillVerified,
    OtpAutofillInvalid,
}

private const val Code = "482913"

private class KeypadHaptics : HapticFeedback {
    val events = mutableListOf<HapticFeedbackType>()

    override fun performHapticFeedback(hapticFeedbackType: HapticFeedbackType) {
        events += hapticFeedbackType
    }
}

@Composable
private fun Heading(title: String, description: String? = null) {
    val colors = EsuissTheme.colors
    Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(4.dp)) {
        BasicText(title, style = Typography.xl2.copy(color = colors.label, fontWeight = FontWeight.Bold))
        if (description != null) {
            BasicText(description, style = Typography.sm.copy(color = colors.labelSecondary, textAlign = TextAlign.Center))
        }
    }
}

@Composable
private fun Caption(text: String) {
    BasicText(text, style = Typography.sm.copy(color = EsuissTheme.colors.labelSecondary))
}

@Composable
private fun PinScene(
    title: String,
    description: String,
    length: Int = 6,
    defaultValue: String = "",
    error: Boolean = false,
    enabled: Boolean = true,
    face: Boolean = false,
    biometric: Boolean = false,
    wrongOnComplete: Boolean = false,
) {
    var pin by remember { mutableStateOf(defaultValue) }
    var failed by remember { mutableStateOf(error) }
    var requests by remember { mutableIntStateOf(0) }
    var completed by remember { mutableStateOf<String?>(null) }
    Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(40.dp)) {
        Heading(title, description)
        PinPad(
            value = pin,
            onValueChange = {
                pin = it
                failed = false
            },
            length = length,
            onComplete = {
                completed = it
                if (wrongOnComplete) failed = true
            },
            error = failed,
            enabled = enabled,
            onBiometric = if (biometric || face) ({ requests++ }) else null,
            biometricIcon = if (face) PhosphorIcons.Regular.ScanSmiley else PhosphorIcons.Regular.Fingerprint,
            biometricLabel = if (face) "Use face recognition" else "Use biometrics",
        )
        Caption(
            when {
                requests > 0 -> "Biometric requested"
                failed -> "Wrong passcode${completed?.let { " ($it)" }.orEmpty()}"
                else -> "Value: ${pin.ifEmpty { "empty" }}"
            },
        )
    }
}

@Composable
private fun AmountScene(
    title: String,
    currency: String?,
    locale: Locale,
    defaultValue: String = "",
    max: Double? = null,
    enabled: Boolean = true,
) {
    var value by remember { mutableStateOf(defaultValue) }
    var amount by remember { mutableStateOf(defaultValue.toDoubleOrNull() ?: 0.0) }
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(24.dp),
    ) {
        Caption(title)
        AmountInput(
            modifier = Modifier.fillMaxWidth(),
            value = value,
            onValueChange = { next, number ->
                value = next
                amount = number
            },
            currency = currency,
            locale = locale,
            max = max,
            enabled = enabled,
        )
        Caption("value \"$value\" amount $amount")
    }
}

@Composable
private fun OtpScene(incoming: String) {
    val colors = EsuissTheme.colors
    Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Heading("Enter the code", "We sent a 6-digit code to +1 555 0100.")
        OtpAutofill(
            maxLength = 6,
            onVerify = { code ->
                delay(500)
                code == Code
            },
            modifier = Modifier.padding(top = 16.dp),
        ) {
            OtpAutofillInput(autoFocus = true, contentDescription = "Verification code") {
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
            val (text, color) = when (state) {
                OtpAutofillState.Verifying -> "Verifying…" to colors.labelSecondary
                OtpAutofillState.Verified -> "Verified" to colors.success
                OtpAutofillState.Invalid -> "That code didn't work. Try again." to colors.danger
                else -> "" to colors.labelSecondary
            }
            BasicText(text, style = Typography.sm.copy(color = color))
            OtpAutofillSuggestion(code = incoming)
        }
    }
}

@Composable
private fun KeypadScene() {
    var pressed by remember { mutableStateOf(listOf<String>()) }
    val record: (KeypadKey) -> Unit = { key ->
        pressed = pressed + when (key) {
            is KeypadKey.Digit -> key.value.toString()
            KeypadKey.Decimal -> "decimal"
            KeypadKey.Biometric -> "biometric"
            KeypadKey.Delete -> "delete"
        }
    }
    Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Caption("Keypad, decimal accessory")
        Keypad(onKeyPress = record, accessory = KeypadAccessory.Decimal(","))
        Caption("Keys: ${pressed.joinToString(" ").ifEmpty { "none" }}")
        Caption("Biometric accessory, disabled")
        Keypad(onKeyPress = record, accessory = KeypadAccessory.Biometric(), enabled = false)
    }
}

@Composable
private fun Scene(scene: InputScene) {
    val us = Locale.US
    when (scene) {
        InputScene.Keypad -> KeypadScene()
        InputScene.PinPad -> PinScene("Enter passcode", "Default, 6 digits")
        InputScene.PinPadFilled -> PinScene("Enter passcode", "Filled by tapping 1, 2, 3")
        InputScene.PinPadError -> PinScene("Enter passcode", "4 digits, wrong passcode", length = 4, wrongOnComplete = true)
        InputScene.PinPadDisabled -> PinScene("Enter passcode", "Disabled", defaultValue = "12", enabled = false)
        InputScene.PinPadBiometric -> PinScene("Unlock", "Biometric key", biometric = true)
        InputScene.PinPadFace -> PinScene("Unlock", "Face key, 4 digits", length = 4, face = true, defaultValue = "1")
        InputScene.Amount -> AmountScene("USD, empty", "USD", us)
        InputScene.AmountFilled -> AmountScene("USD, typed", "USD", us)
        InputScene.AmountLong -> AmountScene("USD, long amount", "USD", us)
        InputScene.AmountEuro -> AmountScene("EUR, de-DE", "EUR", Locale.GERMANY)
        InputScene.AmountLira -> AmountScene("TRY, tr-TR", "TRY", Locale.forLanguageTag("tr-TR"))
        InputScene.AmountYen -> AmountScene("JPY, ja-JP (no decimals)", "JPY", Locale.JAPAN)
        InputScene.AmountMax -> AmountScene("USD, max 500", "USD", us, max = 500.0)
        InputScene.AmountDisabled -> AmountScene("Disabled", "USD", us, defaultValue = "42.5", enabled = false)
        InputScene.OtpAutofill -> OtpScene(Code)
        InputScene.OtpAutofillVerified -> OtpScene(Code)
        InputScene.OtpAutofillInvalid -> OtpScene("113355")
    }
}

@RunWith(AndroidJUnit4::class)
class InputGalleryTest {
    @get:Rule
    val compose = createComposeRule()

    private fun tap(vararg keys: String) {
        keys.forEach {
            compose.onNodeWithText(it).performClick()
            compose.mainClock.advanceTimeBy(50)
            compose.waitForIdle()
        }
    }

    @Test
    fun rendersInputsInBothSchemes() {
        var dark by mutableStateOf(false)
        var scene by mutableStateOf(InputScene.PinPad)
        compose.mainClock.autoAdvance = false
        compose.setContent {
            EsuissTheme(darkTheme = dark) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(EsuissTheme.colors.surface)
                        .safeDrawingPadding()
                        .padding(16.dp),
                    contentAlignment = Alignment.TopCenter,
                ) {
                    key(scene, dark) { Scene(scene) }
                }
            }
        }
        val instrumentation = InstrumentationRegistry.getInstrumentation()
        val context = instrumentation.targetContext
        for (current in InputScene.entries) {
            for (scheme in listOf(false, true)) {
                scene = current
                dark = scheme
                settle()
                when (current) {
                    InputScene.Keypad -> {
                        compose.onAllNodesWithText("7")[0].performClick()
                        compose.onAllNodesWithText(",")[0].performClick()
                        compose.onAllNodesWithContentDescription("Delete")[0].performClick()
                        compose.onNodeWithContentDescription("Use biometrics").performClick()
                        settle()
                        compose.onNodeWithText("Keys: 7 decimal delete").assertExists()
                    }
                    InputScene.PinPad -> {
                        compose.onNodeWithContentDescription("0 of 6 entered").assertExists()
                        compose.onNodeWithContentDescription("Use biometrics").assertDoesNotExist()
                    }
                    InputScene.PinPadFilled -> {
                        tap("1", "2", "3", "4")
                        compose.onNodeWithContentDescription("Delete").performClick()
                        settle()
                        compose.onNodeWithContentDescription("3 of 6 entered").assertExists()
                        compose.onNodeWithText("Value: 123").assertExists()
                    }
                    InputScene.PinPadError -> {
                        tap("1", "9", "8", "4", "5")
                        settle()
                        compose.onNodeWithContentDescription("4 of 4 entered").assertExists()
                        compose.onNodeWithText("Wrong passcode (1984)").assertExists()
                    }
                    InputScene.PinPadDisabled -> {
                        compose.onNodeWithText("5").performClick()
                        settle()
                        compose.onNodeWithContentDescription("2 of 6 entered").assertExists()
                    }
                    InputScene.PinPadBiometric -> {
                        compose.onNodeWithContentDescription("Use biometrics").performClick()
                        settle()
                        compose.onNodeWithText("Biometric requested").assertExists()
                    }
                    InputScene.PinPadFace -> {
                        tap("7")
                        settle()
                        compose.onNodeWithContentDescription("2 of 4 entered").assertExists()
                        compose.onNodeWithContentDescription("Use face recognition").assertExists()
                    }
                    InputScene.Amount -> compose.onNodeWithContentDescription("$0").assertExists()
                    InputScene.AmountFilled -> {
                        tap("0", "0", "1", "2", "3", "4", ".", "5", "6", "7", ".")
                        settle()
                        compose.onNodeWithContentDescription("$1,234.56").assertExists()
                        compose.onNodeWithText("value \"1234.56\" amount 1234.56").assertExists()
                    }
                    InputScene.AmountLong -> {
                        tap("9", "8", "7", "6", "5", "4", "3", "2", "1", "9", "8", "7", "6", ".", "9", "9")
                        compose.onNodeWithText("value \"9876543219876.99\" amount 9.87654321987699E12").assertExists()
                        settle()
                        compose.onNodeWithContentDescription("$9,876,543,219,876.99").assertExists()
                    }
                    InputScene.AmountEuro -> {
                        tap("1", "2", "3", "4", ",", "5")
                        settle()
                        compose.onNodeWithContentDescription("1.234,5", substring = true).assertExists()
                        compose.onNodeWithContentDescription("€", substring = true).assertExists()
                        compose.onNodeWithText("value \"1234.5\" amount 1234.5").assertExists()
                    }
                    InputScene.AmountLira -> {
                        tap("2", "5", "0", "0", "0", ",", "7", "5")
                        settle()
                        compose.onNodeWithContentDescription("₺25.000,75").assertExists()
                    }
                    InputScene.AmountYen -> {
                        compose.onNodeWithText(".").assertDoesNotExist()
                        compose.onNodeWithText(",").assertDoesNotExist()
                        tap("1", "2", "3", "4", "5")
                        settle()
                        compose.onNodeWithContentDescription("12,345", substring = true).assertExists()
                        compose.onNodeWithText("value \"12345\" amount 12345.0").assertExists()
                    }
                    InputScene.AmountMax -> {
                        tap("5", "0", "0", "0")
                        settle()
                        compose.onNodeWithContentDescription("$500").assertExists()
                    }
                    InputScene.AmountDisabled -> {
                        compose.onNodeWithText("3").performClick()
                        settle()
                        compose.onNodeWithContentDescription("$42.5").assertExists()
                    }
                    InputScene.OtpAutofill -> {
                        compose.onNodeWithText("From Messages").assertExists()
                        compose.onNodeWithText(Code).assertExists()
                    }
                    InputScene.OtpAutofillVerified -> {
                        compose.onNodeWithText("From Messages").performClick()
                        settle()
                        settle()
                        compose.onNodeWithText("Verified").assertExists()
                    }
                    InputScene.OtpAutofillInvalid -> {
                        compose.onNodeWithText("From Messages").performClick()
                        var elapsed = 0
                        while (elapsed < 3000 &&
                            compose.onAllNodesWithText("That code didn't work. Try again.").fetchSemanticsNodes().isEmpty()
                        ) {
                            compose.mainClock.advanceTimeBy(50)
                            compose.waitForIdle()
                            elapsed += 50
                        }
                        android.util.Log.i("InputGallery", "invalid after $elapsed")
                        compose.mainClock.advanceTimeBy(400)
                        compose.waitForIdle()
                        compose.onNodeWithText("That code didn't work. Try again.").assertExists()
                    }
                }
                SystemClock.sleep(if (current.name.startsWith("Otp")) 1200 else 600)
                val bitmap = checkNotNull(instrumentation.uiAutomation.takeScreenshot())
                val name = "inputs-${current.name.lowercase()}-${if (scheme) "dark" else "light"}.png"
                File(context.getExternalFilesDir(null), name).outputStream().use {
                    bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)
                }
            }
        }
    }

    @Test
    fun keypadsPerformFeedback() {
        val recorder = KeypadHaptics()
        var error by mutableStateOf(false)
        compose.setContent {
            EsuissTheme(darkTheme = false) {
                CompositionLocalProvider(LocalHapticFeedback provides recorder) {
                    PinPad(length = 4, error = error)
                }
            }
        }
        tap("1", "2")
        compose.onNodeWithContentDescription("2 of 4 entered").assertExists()
        error = true
        compose.waitForIdle()
        assertEquals(
            listOf(HapticFeedbackType.SegmentTick, HapticFeedbackType.SegmentTick, HapticFeedbackType.Reject),
            recorder.events,
        )
    }

    private fun settle() {
        repeat(4) {
            compose.mainClock.advanceTimeBy(300)
            compose.waitForIdle()
        }
    }
}
