package com.esuiss.ui.patterns

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.esuiss.ui.components.SelectSize

enum class SegmentPickerSize { Sm, Default }

interface SegmentPickerScope {
    fun SegmentPickerItem(value: String, label: String, enabled: Boolean = true)
}

private class SegmentPickerScopeImpl : SegmentPickerScope {
    val items = mutableListOf<PickerItemData>()

    override fun SegmentPickerItem(value: String, label: String, enabled: Boolean) {
        items += PickerItemData(value, label, enabled)
    }
}

@Composable
fun SegmentPicker(
    value: String?,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    size: SegmentPickerSize = SegmentPickerSize.Default,
    enabled: Boolean = true,
    content: SegmentPickerScope.() -> Unit,
) {
    val items = SegmentPickerScopeImpl().apply(content).items.toList()
    Picker(
        value = value,
        onValueChange = { if (it != value) onValueChange(it) },
        modifier = modifier,
        items = items,
        size = if (size == SegmentPickerSize.Sm) SelectSize.Sm else SelectSize.Default,
        enabled = enabled,
    )
}
