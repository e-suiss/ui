package com.esuiss.catalog.stories.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.QrScanner
import com.esuiss.ui.components.QrScannerState
import com.esuiss.ui.theme.DarkColors
import com.esuiss.ui.theme.Palette

val qrScannerStories = StoryGroup(
    section = Section.Components,
    title = "QR Scanner",
    stories = listOf(
        Story("Default", fullScreen = true) { QrScannerDemo(hint = "Point your camera at a code to pay or connect.") },
        Story("Success", fullScreen = true) { QrScannerDemo(state = QrScannerState.Success, hint = "Code recognised") },
        Story("ErrorState", displayName = "Error", fullScreen = true) { QrScannerDemo(state = QrScannerState.Error, hint = "This code is not supported.") },
        Story("WithScanLine", fullScreen = true) { QrScannerDemo(scanLine = true, hint = "Hold steady over the code.") },
        Story("WithoutTorch", fullScreen = true) { QrScannerWithoutTorch() },
    ),
)

private const val QrModules = 21
private val QrModule = 6.dp

private fun qrModuleDark(r: Int, c: Int): Boolean {
    val boxes = listOf(0 to 0, 0 to 13, 13 to 0)
    for ((top, left) in boxes) {
        if (r in top until top + 8 && c in left until left + 8) {
            val fr = if (top == 0) 0 else 14
            val fc = if (left == 0) 0 else 14
            val i = r - fr
            val j = c - fc
            if (i !in 0..6 || j !in 0..6) return false
            return i == 0 || i == 6 || j == 0 || j == 6 || (i in 2..4 && j in 2..4)
        }
    }
    return (r * 7 + c * 11 + r * c) % 5 < 2
}

@Composable
private fun BoxScope.QrScannerCameraPlaceholder() {
    val colors = DarkColors
    val modules = remember {
        (0 until QrModules).flatMap { r -> (0 until QrModules).filter { c -> qrModuleDark(r, c) }.map { c -> r to c } }
    }
    Box(
        modifier = Modifier.matchParentSize().background(Palette.black),
        contentAlignment = Alignment.Center,
    ) {
        Box(
            Modifier
                .offset(y = (-24).dp)
                .rotate(-6f)
                .background(Palette.white, RoundedCornerShape(12.dp))
                .padding(10.dp),
        ) {
            Canvas(Modifier.size(QrModule * QrModules)) {
                val unit = size.width / QrModules
                val path = Path().apply {
                    modules.forEach { (r, c) -> addRect(Rect(c * unit, r * unit, (c + 1) * unit, (r + 1) * unit)) }
                }
                drawPath(path, Palette.black)
            }
        }
    }
}

@Composable
private fun QrScannerDemo(
    state: QrScannerState = QrScannerState.Idle,
    hint: String? = null,
    scanLine: Boolean = false,
) {
    var torch by rememberSaveable { mutableStateOf(false) }
    QrScanner(
        modifier = Modifier.fillMaxSize(),
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
        modifier = Modifier.fillMaxSize(),
        title = "Scan to sign in",
        hint = "Open Settings on your other device.",
    ) {
        QrScannerCameraPlaceholder()
    }
}
