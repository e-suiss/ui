package com.esuiss.catalog.stories.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.QrScanner
import com.esuiss.ui.components.QrScannerState
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius

val qrScannerStories = StoryGroup(
    section = Section.Components,
    title = "QR Scanner",
    stories = listOf(
        Story("Default") { QrScannerDemo(hint = "Point your camera at a code to pay or connect.") },
        Story("Success") { QrScannerDemo(state = QrScannerState.Success, hint = "Code recognised") },
        Story("ErrorState", displayName = "Error") { QrScannerDemo(state = QrScannerState.Error, hint = "This code is not supported.") },
        Story("WithoutScanLine") { QrScannerDemo(scanLine = false, hint = "Hold steady over the code.") },
        Story("WithoutTorch") { QrScannerWithoutTorch() },
    ),
)

private val qrScannerModifier = Modifier
    .fillMaxWidth()
    .height(560.dp)
    .clip(RoundedCornerShape(Radius.xl3))

@Composable
private fun BoxScope.QrScannerCameraPlaceholder() {
    val colors = EsuissTheme.colors
    Box(
        modifier = Modifier.matchParentSize().background(colors.surfaceTertiary),
        contentAlignment = Alignment.Center,
    ) {
        Box(
            Modifier
                .align(Alignment.TopStart)
                .offset(x = 32.dp, y = 40.dp)
                .size(96.dp)
                .background(colors.labelQuaternary, CircleShape),
        )
        Box(
            Modifier
                .align(Alignment.BottomEnd)
                .offset(x = (-24).dp, y = (-64).dp)
                .size(width = 160.dp, height = 128.dp)
                .background(colors.labelTertiary, RoundedCornerShape(24.dp)),
        )
        Column(
            modifier = Modifier
                .size(144.dp)
                .rotate(6f)
                .background(colors.surface, RoundedCornerShape(Radius.xl))
                .padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            (0 until 4).forEach { row ->
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    (0 until 4).forEach { column ->
                        val cell = row * 4 + column
                        Box(
                            Modifier
                                .size(24.dp)
                                .background(if (cell % 3 == 0) colors.label else colors.surface, RoundedCornerShape(Radius.xs)),
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun QrScannerDemo(
    state: QrScannerState = QrScannerState.Idle,
    hint: String? = null,
    scanLine: Boolean = true,
) {
    var torch by rememberSaveable { mutableStateOf(false) }
    QrScanner(
        modifier = qrScannerModifier,
        state = state,
        title = "Scan QR code",
        hint = hint,
        scanLine = scanLine,
        torch = torch,
        onTorchToggle = { torch = it },
    ) {
        QrScannerCameraPlaceholder()
    }
}

@Composable
private fun QrScannerWithoutTorch() {
    QrScanner(
        modifier = qrScannerModifier,
        title = "Scan to sign in",
        hint = "Open Settings on your other device.",
    ) {
        QrScannerCameraPlaceholder()
    }
}
