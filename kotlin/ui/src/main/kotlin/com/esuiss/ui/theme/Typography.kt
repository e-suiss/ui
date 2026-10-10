package com.esuiss.ui.theme

import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.LineHeightStyle
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp

private fun textStyle(size: Double, lineHeight: Int, letterSpacing: Double) = TextStyle(
    fontSize = size.sp,
    lineHeight = lineHeight.sp,
    letterSpacing = letterSpacing.em,
    lineHeightStyle = LineHeightStyle(
        alignment = LineHeightStyle.Alignment.Center,
        trim = LineHeightStyle.Trim.None,
    ),
)

object EsuissTypography {
    val xs3 = textStyle(11.0, 13, 0.006)
    val xs2 = textStyle(12.0, 16, 0.0)
    val xs = textStyle(13.0, 18, -0.006)
    val sm = textStyle(15.0, 20, -0.016)
    val md = textStyle(16.0, 21, -0.02)
    val base = textStyle(17.0, 22, -0.026)
    val lg = textStyle(20.0, 25, -0.023)
    val xl = textStyle(22.0, 28, -0.012)
    val xl2 = textStyle(28.0, 34, 0.014)
    val xl3 = textStyle(34.0, 41, 0.012)

    val all = listOf(xs3, xs2, xs, sm, md, base, lg, xl, xl2, xl3)
}
