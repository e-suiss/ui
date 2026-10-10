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
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.unit.dp
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.ArrowRight
import com.adamglin.phosphoricons.regular.Plus
import com.esuiss.ui.components.Badge
import com.esuiss.ui.components.BadgeVariant
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardFooter
import com.esuiss.ui.components.CardHeader
import com.esuiss.ui.components.CardSize
import com.esuiss.ui.components.CardVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.EsuissTypography
import java.io.File
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@Composable
private fun Gallery() {
    val colors = EsuissTheme.colors
    Column(
        modifier = Modifier
            .testTag("gallery")
            .width(402.dp)
            .background(colors.surface)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            BadgeVariant.entries.forEach { variant ->
                Badge(variant.name.lowercase(), variant = variant)
            }
        }
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            ButtonVariant.entries.forEach { variant ->
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(variant.name.lowercase(), onClick = {}, variant = variant)
                    Button("Disabled", onClick = {}, variant = variant, enabled = false)
                }
            }
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
        Button(onClick = {}, size = ButtonSize.Xl, block = true) {
            Icon(PhosphorIcons.Regular.ArrowRight, contentDescription = null)
            BasicText("Continue", style = LocalContentStyle.current)
        }
        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            EsuissTypography.all.forEach { style ->
                BasicText("Type ${style.fontSize.value.toInt()}", style = style.copy(color = colors.label))
            }
        }
        Card {
            CardHeader(
                "Login to your account",
                description = "Enter your email below.",
                action = { Button("Sign Up", onClick = {}, variant = ButtonVariant.Link, size = ButtonSize.Sm) },
            )
            CardContent {
                BasicText("Card content", style = EsuissTypography.base.copy(color = colors.labelSecondary))
            }
            CardFooter {
                Button("Login", onClick = {}, block = true)
            }
        }
        Card(variant = CardVariant.Filled, size = CardSize.Sm) {
            CardHeader("Filled", description = "Small filled card.")
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
