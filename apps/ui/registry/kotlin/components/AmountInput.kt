package com.esuiss.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography
import java.text.DecimalFormat
import java.text.DecimalFormatSymbols
import java.text.NumberFormat
import java.util.Currency
import java.util.Locale
import kotlinx.coroutines.launch

private const val AmountMaxIntegerDigits = 15

private const val AmountFontSize = 60f

private const val AmountMinFontSize = 28f

private class AmountFormat(
    val prefix: String,
    val suffix: String,
    val decimal: Char,
    val fractionDigits: Int,
    val integer: NumberFormat,
)

private fun amountFormat(currency: String?, locale: Locale, maxFractionDigits: Int?): AmountFormat {
    val integer = NumberFormat.getIntegerInstance(locale).apply { isGroupingUsed = true }
    if (currency == null) {
        return AmountFormat(
            prefix = "",
            suffix = "",
            decimal = DecimalFormatSymbols.getInstance(locale).decimalSeparator,
            fractionDigits = (maxFractionDigits ?: 2).coerceAtLeast(0),
            integer = integer,
        )
    }
    val code = Currency.getInstance(currency)
    val format = NumberFormat.getCurrencyInstance(locale).apply { this.currency = code }
    val decimal = format as? DecimalFormat
    return AmountFormat(
        prefix = decimal?.positivePrefix ?: code.getSymbol(locale),
        suffix = decimal?.positiveSuffix ?: "",
        decimal = decimal?.decimalFormatSymbols?.monetaryDecimalSeparator
            ?: DecimalFormatSymbols.getInstance(locale).decimalSeparator,
        fractionDigits = (maxFractionDigits ?: code.defaultFractionDigits).coerceAtLeast(0),
        integer = integer,
    )
}

private fun AmountFormat.number(value: String): String {
    val whole = value.substringBefore('.')
    val grouped = whole.toLongOrNull()?.let { integer.format(it) } ?: whole
    return if (value.contains('.')) grouped + decimal + value.substringAfter('.') else grouped
}

private fun amountOf(value: String): Double = value.trimEnd('.').toDoubleOrNull() ?: 0.0

@Composable
fun AmountInput(
    modifier: Modifier = Modifier,
    value: String? = null,
    onValueChange: ((value: String, amount: Double) -> Unit)? = null,
    defaultValue: String = "",
    currency: String? = null,
    locale: Locale = Locale.getDefault(),
    maxFractionDigits: Int? = null,
    max: Double? = null,
    placeholder: String = "0",
    enabled: Boolean = true,
    decimalLabel: String = "Decimal separator",
    deleteLabel: String = "Delete",
) {
    val colors = EsuissTheme.colors
    val format = remember(currency, locale, maxFractionDigits) { amountFormat(currency, locale, maxFractionDigits) }
    var internal by remember { mutableStateOf(defaultValue) }
    val current = value ?: internal
    val haptics = rememberHaptics()
    val reduced = formReducedMotion()
    val offset = remember { Animatable(0f) }
    val scope = rememberCoroutineScope()
    val reject = {
        haptics.perform(HapticFeedbackType.Reject)
        if (!reduced) scope.launch { offset.shake() }
    }
    val update: (String) -> Unit = { next ->
        if (next != current) {
            if (max != null && amountOf(next) > max) {
                reject()
            } else {
                if (value == null) internal = next
                onValueChange?.invoke(next, amountOf(next))
            }
        }
    }
    val empty = current.isEmpty()
    val number = if (empty) placeholder else format.number(current)
    val foreground = when {
        !enabled -> colors.labelQuaternary
        empty -> colors.labelTertiary
        else -> colors.label
    }
    val symbol = if (enabled && !empty) colors.labelSecondary else foreground
    val text: AnnotatedString = buildAnnotatedString {
        if (format.prefix.isNotEmpty()) withStyle(SpanStyle(fontSize = 0.5.em, color = symbol)) { append(format.prefix) }
        append(number)
        if (format.suffix.isNotEmpty()) withStyle(SpanStyle(fontSize = 0.5.em, color = symbol)) { append(format.suffix) }
    }
    val base = Typography.xl3.copy(
        color = foreground,
        fontSize = AmountFontSize.sp,
        lineHeight = 1.1.em,
        letterSpacing = 0.em,
        fontWeight = FontWeight.SemiBold,
        fontFeatureSettings = "tnum",
        textAlign = TextAlign.Center,
    )
    val measurer = rememberTextMeasurer()
    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        BoxWithConstraints(
            modifier = Modifier
                .fillMaxWidth()
                .height(72.dp)
                .graphicsLayer { translationX = offset.value.dp.toPx() }
                .clearAndSetSemantics {
                    contentDescription = text.text
                    liveRegion = LiveRegionMode.Polite
                },
            contentAlignment = Alignment.Center,
        ) {
            val available = constraints.maxWidth
            val width = remember(text, base, available) {
                measurer.measure(text, base.copy(textAlign = TextAlign.Start), maxLines = 1, softWrap = false).size.width
            }
            val fontSize = if (width > available && width > 0) {
                (AmountFontSize * available / width).coerceAtLeast(AmountMinFontSize)
            } else {
                AmountFontSize
            }
            BasicText(text, style = base.copy(fontSize = fontSize.sp), maxLines = 1, softWrap = false)
        }
        Keypad(
            onKeyPress = { key ->
                when (key) {
                    is KeypadKey.Digit -> {
                        val digit = key.value.toString()
                        val fraction = current.substringAfter('.', "")
                        val whole = current.substringBefore('.')
                        when {
                            current.contains('.') -> if (fraction.length < format.fractionDigits) update(current + digit) else reject()
                            whole == "0" -> update(digit)
                            whole.length >= AmountMaxIntegerDigits -> reject()
                            else -> update(current + digit)
                        }
                    }
                    KeypadKey.Decimal -> when {
                        format.fractionDigits == 0 || current.contains('.') -> reject()
                        current.isEmpty() -> update("0.")
                        else -> update("$current.")
                    }
                    KeypadKey.Delete -> if (current.isNotEmpty()) update(current.dropLast(1))
                    KeypadKey.Biometric -> Unit
                }
            },
            accessory = if (format.fractionDigits > 0) KeypadAccessory.Decimal(format.decimal.toString(), decimalLabel) else KeypadAccessory.None,
            deleteLabel = deleteLabel,
            enabled = enabled,
        )
    }
}
