package com.esuiss.ui.blocks

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.bold.Airplane
import com.adamglin.phosphoricons.bold.Bell
import com.adamglin.phosphoricons.bold.Bluetooth
import com.adamglin.phosphoricons.bold.CaretRight
import com.adamglin.phosphoricons.bold.CellSignalFull
import com.adamglin.phosphoricons.bold.Gear
import com.adamglin.phosphoricons.bold.Hourglass
import com.adamglin.phosphoricons.bold.MagnifyingGlass
import com.adamglin.phosphoricons.bold.Moon
import com.adamglin.phosphoricons.bold.SpeakerHigh
import com.adamglin.phosphoricons.bold.Sun
import com.adamglin.phosphoricons.bold.WifiHigh
import com.esuiss.ui.components.Avatar
import com.esuiss.ui.components.AvatarSize
import com.esuiss.ui.components.Header
import com.esuiss.ui.components.HeaderLargeTitle
import com.esuiss.ui.components.HeaderTitle
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.InputGroup
import com.esuiss.ui.components.InputGroupAddon
import com.esuiss.ui.components.InputGroupInput
import com.esuiss.ui.components.Item
import com.esuiss.ui.components.ItemActions
import com.esuiss.ui.components.ItemContent
import com.esuiss.ui.components.ItemDescription
import com.esuiss.ui.components.ItemGroup
import com.esuiss.ui.components.ItemGroupVariant
import com.esuiss.ui.components.ItemMedia
import com.esuiss.ui.components.ItemSeparator
import com.esuiss.ui.components.ItemSize
import com.esuiss.ui.components.ItemTitle
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.Switch
import com.esuiss.ui.components.rememberHeaderState
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

@Immutable
private data class DeviceToggles(
    val airplane: Boolean = false,
    val wifi: Boolean = true,
    val bluetooth: Boolean = true,
    val focus: Boolean = false,
)

private enum class ToggleKey { Airplane, Focus }

private class DeviceRow(
    val label: String,
    val icon: ImageVector,
    val tint: (Colors) -> Color,
    val toggle: ToggleKey? = null,
    val detail: ((DeviceToggles) -> String)? = null,
)

private val DeviceGroups = listOf(
    listOf(
        DeviceRow("Airplane Mode", PhosphorIcons.Bold.Airplane, { it.orange }, toggle = ToggleKey.Airplane),
        DeviceRow("Wi-Fi", PhosphorIcons.Bold.WifiHigh, { it.blue }, detail = { if (it.wifi) "Home" else "Off" }),
        DeviceRow("Bluetooth", PhosphorIcons.Bold.Bluetooth, { it.blue }, detail = { if (it.bluetooth) "On" else "Off" }),
        DeviceRow("Cellular", PhosphorIcons.Bold.CellSignalFull, { it.green }, detail = { if (it.airplane) "Off" else "" }),
    ),
    listOf(
        DeviceRow("Notifications", PhosphorIcons.Bold.Bell, { it.red }),
        DeviceRow("Sounds & Haptics", PhosphorIcons.Bold.SpeakerHigh, { it.pink }),
        DeviceRow("Focus", PhosphorIcons.Bold.Moon, { it.indigo }, toggle = ToggleKey.Focus),
        DeviceRow("Screen Time", PhosphorIcons.Bold.Hourglass, { it.indigo }),
    ),
    listOf(
        DeviceRow("General", PhosphorIcons.Bold.Gear, { it.gray }),
        DeviceRow("Display & Brightness", PhosphorIcons.Bold.Sun, { it.blue }),
    ),
)

@Composable
fun SettingsDevice(
    modifier: Modifier = Modifier,
    onAccountPress: () -> Unit = {},
    onRowPress: (label: String) -> Unit = {},
) {
    val colors = EsuissTheme.colors
    var query by rememberSaveable { mutableStateOf("") }
    var toggles by remember { mutableStateOf(DeviceToggles()) }
    val header = rememberHeaderState()

    fun setToggle(key: ToggleKey, value: Boolean) {
        toggles = when (key) {
            ToggleKey.Airplane -> if (value) toggles.copy(airplane = true, wifi = false, bluetooth = false) else toggles.copy(airplane = false)
            ToggleKey.Focus -> toggles.copy(focus = value)
        }
    }

    fun isOn(key: ToggleKey) = when (key) {
        ToggleKey.Airplane -> toggles.airplane
        ToggleKey.Focus -> toggles.focus
    }

    val visible = DeviceGroups
        .map { rows -> rows.filter { query.isBlank() || it.label.contains(query.trim(), ignoreCase = true) } }
        .filter { it.isNotEmpty() }

    Screen(modifier) {
        Column(
            Modifier
                .fillMaxSize()
                .nestedScroll(header.nestedScrollConnection),
        ) {
            Header(state = header) {
                HeaderTitle("Settings")
                HeaderLargeTitle("Settings")
            }
            Column(
                modifier = Modifier
                    .weight(1f)
                    .verticalScroll(rememberScrollState())
                    .padding(start = 16.dp, end = 16.dp, top = 4.dp, bottom = 24.dp),
                verticalArrangement = Arrangement.spacedBy(18.dp),
            ) {
                InputGroup {
                    InputGroupAddon {
                        Icon(PhosphorIcons.Bold.MagnifyingGlass, contentDescription = null)
                    }
                    InputGroupInput(value = query, onValueChange = { query = it }, placeholder = "Search")
                }
                if (query.isBlank()) {
                    ItemGroup(variant = ItemGroupVariant.Inset) {
                        Item(size = ItemSize.Sm, onClick = onAccountPress) {
                            Avatar(
                                modifier = Modifier.size(58.dp),
                                size = AvatarSize.Xl,
                                fallback = {
                                    Box(
                                        Modifier
                                            .fillMaxSize()
                                            .background(colors.indigo, CircleShape),
                                        contentAlignment = Alignment.Center,
                                    ) {
                                        BasicText("JR", style = Typography.xl.copy(color = colors.onAccent, fontWeight = FontWeight.SemiBold))
                                    }
                                },
                            )
                            ItemContent {
                                BasicText("Jamie Rivera", style = Typography.xl.copy(color = colors.label, fontWeight = FontWeight.SemiBold))
                                ItemDescription("suiss Account, Cloud and more")
                            }
                            ItemActions {
                                Icon(PhosphorIcons.Bold.CaretRight, contentDescription = null, size = 14.dp, tint = colors.labelTertiary)
                            }
                        }
                    }
                }
                visible.forEach { rows ->
                    ItemGroup(variant = ItemGroupVariant.Inset) {
                        rows.forEachIndexed { index, row ->
                            if (index > 0) ItemSeparator(Modifier.padding(start = 41.dp))
                            val toggle = row.toggle
                            Item(
                                size = ItemSize.Sm,
                                onClick = if (toggle == null) ({ onRowPress(row.label) }) else null,
                            ) {
                                ItemMedia(
                                    Modifier
                                        .size(29.dp)
                                        .background(row.tint(colors), RoundedCornerShape(7.dp)),
                                ) {
                                    Icon(row.icon, contentDescription = null, size = 17.dp, tint = colors.onAccent)
                                }
                                ItemContent {
                                    ItemTitle {
                                        BasicText(row.label, style = Typography.base.copy(color = colors.label), maxLines = 1)
                                    }
                                }
                                ItemActions {
                                    if (toggle != null) {
                                        Switch(checked = isOn(toggle), onCheckedChange = { setToggle(toggle, it) })
                                    } else {
                                        val detail = row.detail?.invoke(toggles).orEmpty()
                                        if (detail.isNotEmpty()) {
                                            BasicText(detail, style = Typography.base.copy(color = colors.labelSecondary))
                                        }
                                        Icon(PhosphorIcons.Bold.CaretRight, contentDescription = null, size = 14.dp, tint = colors.labelTertiary)
                                    }
                                }
                            }
                        }
                    }
                }
                if (visible.isEmpty()) {
                    BasicText(
                        "No Results",
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(30.dp),
                        style = Typography.base.copy(color = colors.labelSecondary, textAlign = TextAlign.Center),
                    )
                }
            }
        }
    }
}
