package com.esuiss.ui

import android.graphics.Bitmap
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.asAndroidBitmap
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.test.captureToImage
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.unit.dp
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Plus
import com.esuiss.ui.components.Badge
import com.esuiss.ui.components.BadgeVariant
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardHeader
import com.esuiss.ui.components.Icon
import com.esuiss.ui.theme.EsuissTheme
import java.io.File
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@Composable
private fun Gallery() {
    Column(
        modifier = Modifier
            .testTag("gallery")
            .width(402.dp)
            .background(EsuissTheme.colors.background)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Badge("Badge")
            Badge("Secondary", variant = BadgeVariant.Secondary)
            Badge("Error", variant = BadgeVariant.Destructive)
            Badge("Outline", variant = BadgeVariant.Outline)
        }
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            ButtonVariant.entries.forEach { variant ->
                Button(variant.name.lowercase(), onClick = {}, variant = variant)
            }
            Button("Disabled", onClick = {}, enabled = false)
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button("XS", onClick = {}, size = ButtonSize.Xs)
            Button("SM", onClick = {}, size = ButtonSize.Sm)
            Button("Default", onClick = {})
            Button("LG", onClick = {}, size = ButtonSize.Lg)
            Button(onClick = {}, variant = ButtonVariant.Outline, size = ButtonSize.Icon) {
                Icon(PhosphorIcons.Regular.Plus, contentDescription = "Add")
            }
        }
        Card {
            CardHeader("Login to your account", description = "Enter your email below.")
            Button("Login", onClick = {})
        }
    }
}

@RunWith(AndroidJUnit4::class)
class GalleryTest {
    @get:Rule
    val compose = createComposeRule()

    @Test
    fun rendersGalleryInBothSchemes() {
        var dark by mutableStateOf(false)
        compose.setContent { EsuissTheme(darkTheme = dark) { Gallery() } }
        val context = InstrumentationRegistry.getInstrumentation().targetContext
        for (scheme in listOf(false, true)) {
            dark = scheme
            compose.waitForIdle()
            val bitmap = compose.onNodeWithTag("gallery").captureToImage().asAndroidBitmap()
            val name = if (scheme) "gallery-dark.png" else "gallery-light.png"
            File(context.getExternalFilesDir(null), name).outputStream().use {
                bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)
            }
        }
    }
}
