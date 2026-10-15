package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.SignaturePad
import com.esuiss.ui.components.SignatureStroke
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.toSvg
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography
import kotlin.math.PI
import kotlin.math.sin

val signaturePadStories = StoryGroup(
    section = Section.Components,
    title = "Signature Pad",
    stories = listOf(
        Story("Default") { SignaturePad(Modifier.fillMaxWidth()) },
        Story("Signed") { SignaturePad(Modifier.fillMaxWidth(), defaultValue = signaturePadSample) },
        Story("ThickStroke") { SignaturePad(Modifier.fillMaxWidth(), defaultValue = signaturePadSample, strokeWidth = 5.dp) },
        Story("Disabled") { SignaturePad(Modifier.fillMaxWidth(), defaultValue = signaturePadSample, enabled = false) },
        Story("Controlled") { SignaturePadControlled() },
    ),
)

private fun signaturePadWave(startX: Float, baseY: Float, length: Float, amplitude: Float, turns: Float): SignatureStroke =
    SignatureStroke(
        List(48) { index ->
            val progress = index / 47f
            Offset(
                startX + progress * length,
                baseY - sin(progress * PI.toFloat() * turns) * amplitude * (1 - progress * 0.4f),
            )
        },
    )

private val signaturePadSample = listOf(
    signaturePadWave(40f, 120f, 70f, 40f, 3f),
    signaturePadWave(110f, 115f, 110f, 22f, 5f),
    SignatureStroke(listOf(Offset(60f, 140f), Offset(140f, 136f), Offset(230f, 134f))),
)

@Composable
private fun SignaturePadControlled() {
    var strokes by remember { mutableStateOf(signaturePadSample) }
    var exported by rememberSaveable { mutableStateOf("") }
    var size by remember { mutableStateOf(IntSize.Zero) }
    val density = LocalDensity.current
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        SignaturePad(
            Modifier.fillMaxWidth().onSizeChanged { size = it },
            value = strokes,
            onValueChange = { strokes = it },
        )
        Button(
            "Export SVG",
            onClick = {
                val svg = with(density) { strokes.toSvg(size.width.toDp().value, size.height.toDp().value) }
                exported = "SVG: ${svg.length} characters"
            },
            modifier = Modifier.fillMaxWidth(),
            variant = ButtonVariant.Outline,
        )
        Text(
            "${strokes.size} strokes" + if (exported.isNotEmpty()) " · $exported" else "",
            modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
            style = Typography.sm,
            color = EsuissTheme.colors.mutedForeground,
        )
    }
}
