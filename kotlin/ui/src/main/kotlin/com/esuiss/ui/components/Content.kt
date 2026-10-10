package com.esuiss.ui.components

import androidx.compose.runtime.compositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

val LocalContentStyle = compositionLocalOf { TextStyle.Default }

val LocalContentColor = compositionLocalOf { Color.Unspecified }

val LocalIconSize = compositionLocalOf { 20.dp }
