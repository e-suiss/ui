package com.esuiss.catalog.stories.interactions

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.InputOTPGroup
import com.esuiss.ui.components.InputOTPSeparator
import com.esuiss.ui.components.InputOTPSlot
import com.esuiss.ui.components.Text
import com.esuiss.ui.interactions.OtpAutofill
import com.esuiss.ui.interactions.OtpAutofillInput
import com.esuiss.ui.interactions.OtpAutofillScope
import com.esuiss.ui.interactions.OtpAutofillState
import com.esuiss.ui.interactions.OtpAutofillSuggestion
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.delay

val otpAutofillStories = StoryGroup(
    section = Section.Interactions,
    title = "OTP Autofill",
    stories = listOf(
        Story("Default") { OtpAutofillVerification(incoming = OtpAutofillCode) },
        Story("WrongCode") { OtpAutofillVerification(incoming = "113355") },
        Story("FourDigits") { OtpAutofillFourDigits() },
    ),
)

private const val OtpAutofillCode = "482913"

@Composable
private fun OtpAutofillScope.OtpAutofillStatus() {
    val colors = EsuissTheme.colors
    val (text, color) = when (state) {
        OtpAutofillState.Verifying -> "Verifying…" to colors.mutedForeground
        OtpAutofillState.Verified -> "Verified" to if (colors.isDark) Palette.green400 else Palette.green600
        OtpAutofillState.Invalid -> "That code didn't work. Try again." to colors.destructive
        else -> "" to colors.mutedForeground
    }
    Text(
        text,
        modifier = Modifier.heightIn(min = 20.dp).semantics { liveRegion = LiveRegionMode.Polite },
        style = Typography.sm.copy(color = color),
    )
}

@Composable
private fun OtpAutofillVerification(incoming: String) {
    val colors = EsuissTheme.colors
    var suggestion by rememberSaveable { mutableStateOf<String?>(null) }
    var sending by rememberSaveable { mutableStateOf(false) }
    var request by rememberSaveable { mutableIntStateOf(0) }
    LaunchedEffect(request) {
        sending = true
        suggestion = null
        delay(1200)
        suggestion = incoming
        sending = false
    }
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Text("Enter the code", style = Typography.xl2.copy(fontWeight = FontWeight.Bold), textAlign = TextAlign.Center)
        Text(
            "We sent a 6-digit code to +1 555 0100.",
            style = Typography.sm.copy(color = colors.mutedForeground),
            textAlign = TextAlign.Center,
        )
        OtpAutofill(
            maxLength = 6,
            onVerify = { code ->
                delay(700)
                code == OtpAutofillCode
            },
            modifier = Modifier.padding(top = 16.dp),
        ) {
            OtpAutofillInput(contentDescription = "Verification code", autoFocus = true) {
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
            OtpAutofillStatus()
            OtpAutofillSuggestion(code = suggestion)
        }
        Button(
            if (sending) "Sending…" else "Resend code",
            onClick = { request += 1 },
            variant = ButtonVariant.Plain,
            enabled = !sending,
        )
    }
}

@Composable
private fun OtpAutofillFourDigits() {
    OtpAutofill(maxLength = 4, onVerify = { code -> code == "2468" }, modifier = Modifier.fillMaxWidth()) {
        OtpAutofillInput(contentDescription = "Verification code") {
            InputOTPGroup {
                InputOTPSlot(0)
                InputOTPSlot(1)
                InputOTPSlot(2)
                InputOTPSlot(3)
            }
        }
        OtpAutofillStatus()
        OtpAutofillSuggestion(code = "2468", source = "From Messages")
    }
}
