package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Fingerprint
import com.adamglin.phosphoricons.regular.ScanSmiley
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.PinPad
import com.esuiss.ui.components.Text
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

val pinPadStories = StoryGroup(
    section = Section.Components,
    title = "Pin Pad",
    stories = listOf(
        Story("Default") { PinPadCentered { PinPad() } },
        Story("Filled") { PinPadCentered { PinPad(defaultValue = "1234") } },
        Story("ErrorState", displayName = "Error") { PinPadCentered { PinPad(defaultValue = "654321", error = true) } },
        Story("Verify") { PinPadVerify() },
        Story("Disabled") { PinPadCentered { PinPad(defaultValue = "12", enabled = false, onBiometric = {}) } },
        Story("Biometric") { PinPadBiometric(faceId = false) },
        Story("FaceBiometric") { PinPadBiometric(faceId = true) },
        Story("FourDigits") { PinPadCentered { PinPad(defaultValue = "1", length = 4) } },
    ),
)

private const val PinPadPasscode = "123456"

@Composable
private fun PinPadCentered(content: @Composable () -> Unit) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(24.dp),
    ) {
        content()
    }
}

@Composable
private fun PinPadVerify() {
    var value by rememberSaveable { mutableStateOf("") }
    var error by rememberSaveable { mutableStateOf(false) }
    var status by rememberSaveable { mutableStateOf("Enter 123456") }
    val scope = rememberCoroutineScope()
    val colors = EsuissTheme.colors
    PinPadCentered {
        Text(
            status,
            modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
            style = Typography.sm,
            color = if (error) colors.danger else colors.labelSecondary,
        )
        PinPad(
            value = value,
            error = error,
            onValueChange = { next ->
                value = next
                if (next.isNotEmpty()) error = false
            },
            onComplete = { code ->
                if (code == PinPadPasscode) {
                    status = "Unlocked"
                } else {
                    error = true
                    status = "Wrong passcode. Try again."
                    scope.launch {
                        delay(600)
                        value = ""
                    }
                }
            },
        )
    }
}

@Composable
private fun PinPadBiometric(faceId: Boolean) {
    var log by rememberSaveable { mutableIntStateOf(0) }
    PinPadCentered {
        Text(
            if (log > 0) "Biometric requested ($log)" else "Biometric key",
            style = Typography.sm,
            color = EsuissTheme.colors.labelSecondary,
        )
        PinPad(
            biometricIcon = if (faceId) PhosphorIcons.Regular.ScanSmiley else PhosphorIcons.Regular.Fingerprint,
            biometricLabel = if (faceId) "Use Face ID" else "Use Touch ID",
            onBiometric = { log += 1 },
        )
    }
}
