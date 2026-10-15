package com.esuiss.ui.blocks

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.fill.Bell
import com.adamglin.phosphoricons.regular.ChatCircle
import com.adamglin.phosphoricons.regular.Package
import com.adamglin.phosphoricons.regular.ShieldCheck
import com.esuiss.ui.components.BottomBar
import com.esuiss.ui.components.BottomBarContent
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Screen
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

@Immutable
class PermissionPrimerBenefit(
    val icon: ImageVector,
    val title: String,
    val description: String,
)

private val DemoBenefits = listOf(
    PermissionPrimerBenefit(PhosphorIcons.Regular.ChatCircle, "Messages", "Know right away when someone writes to you."),
    PermissionPrimerBenefit(PhosphorIcons.Regular.Package, "Order updates", "See when your order ships and arrives."),
    PermissionPrimerBenefit(PhosphorIcons.Regular.ShieldCheck, "Security alerts", "Get told about new sign-ins to your account."),
)

@Composable
fun PermissionPrimer(
    modifier: Modifier = Modifier,
    icon: ImageVector = PhosphorIcons.Fill.Bell,
    title: String = "Turn on notifications",
    description: String = "We only send what matters. You can change this anytime in Settings.",
    benefits: List<PermissionPrimerBenefit> = DemoBenefits,
    allowLabel: String = "Allow",
    dismissLabel: String = "Not now",
    onAllow: () -> Unit = {},
    onDismiss: () -> Unit = {},
) {
    val colors = EsuissTheme.colors
    Screen(modifier) {
        Column(Modifier.fillMaxSize()) {
            BoxWithConstraints(Modifier.weight(1f)) {
                val height = maxHeight
                Column(
                    Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState()),
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(min = height)
                            .padding(horizontal = 24.dp, vertical = 32.dp),
                        verticalArrangement = Arrangement.Center,
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        Box(
                            Modifier
                                .size(88.dp)
                                .background(colors.primary, RoundedCornerShape(22.dp)),
                            contentAlignment = Alignment.Center,
                        ) {
                            Icon(icon, contentDescription = null, size = 44.dp, tint = colors.primaryForeground)
                        }
                        Spacer(Modifier.height(24.dp))
                        BasicText(
                            title,
                            modifier = Modifier.semantics { heading() },
                            style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center),
                        )
                        Spacer(Modifier.height(12.dp))
                        BasicText(
                            description,
                            modifier = Modifier.widthIn(max = 420.dp),
                            style = Typography.lg.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
                        )
                        Spacer(Modifier.height(36.dp))
                        Column(
                            modifier = Modifier.widthIn(max = 420.dp),
                            verticalArrangement = Arrangement.spacedBy(20.dp),
                        ) {
                            benefits.forEach { BenefitRow(it) }
                        }
                    }
                }
            }
            BottomBar {
                BottomBarContent {
                    Button(allowLabel, onAllow, size = ButtonSize.Lg, block = true)
                    Button(dismissLabel, onDismiss, modifier = Modifier.fillMaxWidth(), variant = ButtonVariant.Plain)
                }
            }
        }
    }
}

@Composable
private fun BenefitRow(benefit: PermissionPrimerBenefit) {
    val colors = EsuissTheme.colors
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .semantics(mergeDescendants = true) {},
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            Modifier
                .size(44.dp)
                .background(colors.primary.copy(alpha = if (colors.isDark) 0.2f else 0.1f), CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            Icon(benefit.icon, contentDescription = null, size = 22.dp, tint = colors.primary)
        }
        Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
            BasicText(benefit.title, style = Typography.base.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold))
            BasicText(benefit.description, style = Typography.sm.copy(color = colors.mutedForeground))
        }
    }
}
