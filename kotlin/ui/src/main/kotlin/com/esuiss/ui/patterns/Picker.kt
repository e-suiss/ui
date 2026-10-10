package com.esuiss.ui.patterns

import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.ui.Modifier
import com.esuiss.ui.components.Select
import com.esuiss.ui.components.SelectGroup
import com.esuiss.ui.components.SelectItem
import com.esuiss.ui.components.SelectLabel
import com.esuiss.ui.components.SelectSize

@Immutable
class PickerItemData(
    val value: String,
    val label: String,
    val enabled: Boolean = true,
)

@Composable
fun Picker(
    value: String?,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    items: List<PickerItemData> = emptyList(),
    placeholder: String = "",
    size: SelectSize = SelectSize.Default,
    enabled: Boolean = true,
    invalid: Boolean? = null,
    content: (@Composable ColumnScope.() -> Unit)? = null,
) {
    Select(
        value = value,
        onValueChange = onValueChange,
        displayValue = items.firstOrNull { it.value == value }?.label,
        modifier = modifier,
        placeholder = placeholder,
        size = size,
        invalid = invalid,
        enabled = enabled,
    ) {
        if (content != null) {
            content()
        } else {
            SelectGroup {
                items.forEach { PickerItem(it.value, it.label, enabled = it.enabled) }
            }
        }
    }
}

@Composable
fun PickerGroup(
    label: String? = null,
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    SelectGroup(modifier) {
        if (label != null) SelectLabel(label)
        content()
    }
}

@Composable
fun PickerItem(
    value: String,
    text: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    SelectItem(value, text, modifier, enabled)
}

@Composable
fun PickerSeparator() {
}
