package com.esuiss.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.EnterTransition
import androidx.compose.animation.ExitTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.layout.layout
import androidx.compose.ui.layout.layoutId
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.ProgressBarRangeInfo
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.error
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.progressBarRangeInfo
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.constrainHeight
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.bold.Check
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

enum class QuestionnaireItemStatus { Unanswered, Answered, Skipped }

@Immutable
class QuestionnaireItemDefinition(
    val name: String,
    val required: Boolean = false,
    val disabled: Boolean = false,
)

@Stable
internal class QuestionnaireItemRecord(val name: String) {
    var required by mutableStateOf(false)
    var disabled by mutableStateOf(false)
    var multiple by mutableStateOf(false)
    var invalidProp by mutableStateOf(false)
    var skipped by mutableStateOf(false)
    var attempted by mutableStateOf(false)
    var input by mutableStateOf("")
    var defaultInput = ""
    val selected = mutableStateListOf<String>()
    val defaults = mutableListOf<String>()
    val initialized = mutableSetOf<String>()
    var onStatusChange: ((QuestionnaireItemStatus) -> Unit)? = null
    private var reported = QuestionnaireItemStatus.Unanswered

    val answered: Boolean
        get() = selected.isNotEmpty() || input.isNotBlank()

    val status: QuestionnaireItemStatus
        get() = when {
            skipped -> QuestionnaireItemStatus.Skipped
            answered -> QuestionnaireItemStatus.Answered
            else -> QuestionnaireItemStatus.Unanswered
        }

    val satisfied: Boolean
        get() = disabled || (skipped && !required) || (!invalidProp && status == QuestionnaireItemStatus.Answered)

    val invalid: Boolean
        get() = !disabled && !(skipped && !required) && (invalidProp || (attempted && !satisfied))

    fun select(value: String, on: Boolean) {
        skipped = false
        when {
            !on -> selected.remove(value)
            multiple -> if (value !in selected) selected.add(value)
            else -> if (selected.size != 1 || selected[0] != value) {
                selected.clear()
                selected.add(value)
            }
        }
    }

    fun updateInput(text: String) {
        if (text.isNotBlank()) skipped = false
        input = text
    }

    fun skip() {
        if (required) return
        selected.clear()
        input = ""
        skipped = true
    }

    fun reset() {
        attempted = false
        skipped = false
        selected.clear()
        selected.addAll(if (multiple) defaults else defaults.take(1))
        input = defaultInput
    }

    fun report() {
        val current = status
        if (current == reported) return
        reported = current
        onStatusChange?.invoke(current)
    }
}

@Stable
class QuestionnaireState internal constructor(
    defaultItem: String?,
    private val definitions: List<QuestionnaireItemDefinition>?,
) {
    private val records = mutableStateMapOf<String, QuestionnaireItemRecord>()
    private val order = mutableStateListOf<String>()
    private var requested by mutableStateOf(defaultItem)
    internal var forward by mutableStateOf(true)
    internal var animated by mutableStateOf(false)
    internal var onItemChange: ((String) -> Unit)? = null
    internal var onSubmit: ((Map<String, List<String>>) -> Unit)? = null
    internal var onInvalid: (() -> Unit)? = null

    private val sequence: List<String>
        get() = definitions?.filter { !it.disabled }?.map { it.name }
            ?: order.filter { records[it]?.disabled != true }

    val item: String?
        get() {
            val names = sequence
            return requested?.takeIf { it in names } ?: names.firstOrNull()
        }

    private val index: Int
        get() = item?.let { sequence.indexOf(it) } ?: -1

    val total: Int
        get() = sequence.size

    val current: Int
        get() = index + 1

    val first: Boolean
        get() = total > 0 && index == 0

    val last: Boolean
        get() = total > 0 && index == total - 1

    val activeItemRequired: Boolean?
        get() {
            val name = item ?: return null
            return definitions?.firstOrNull { it.name == name }?.required ?: records[name]?.required ?: false
        }

    val activeItemStatus: QuestionnaireItemStatus?
        get() {
            val name = item ?: return null
            return records[name]?.status ?: QuestionnaireItemStatus.Unanswered
        }

    val values: Map<String, List<String>>
        get() = sequence.mapNotNull { name ->
            val record = records[name] ?: return@mapNotNull null
            if (record.skipped || !record.answered) return@mapNotNull null
            name to (record.selected.toList() + listOfNotNull(record.input.takeIf { it.isNotBlank() }))
        }.toMap()

    fun status(name: String): QuestionnaireItemStatus = records[name]?.status ?: QuestionnaireItemStatus.Unanswered

    internal fun record(name: String): QuestionnaireItemRecord = records.getOrPut(name) { QuestionnaireItemRecord(name) }

    internal fun register(name: String): () -> Unit {
        record(name)
        if (name !in order) order.add(name)
        return { order.remove(name) }
    }

    internal fun isActive(name: String) = item == name

    fun goTo(name: String) {
        val names = sequence
        val target = names.indexOf(name)
        if (target < 0 || name == item) return
        forward = target > index
        animated = true
        requested = name
        onItemChange?.invoke(name)
    }

    fun goPrevious() {
        val previous = sequence.getOrNull(index - 1) ?: return
        goTo(previous)
    }

    fun goNext() {
        val name = item ?: return
        val next = sequence.getOrNull(index + 1) ?: return
        if (!validate(name)) {
            onInvalid?.invoke()
            return
        }
        goTo(next)
    }

    fun skipCurrent() {
        val name = item ?: return
        if (activeItemRequired != false) return
        records[name]?.skip()
        val next = sequence.getOrNull(index + 1)
        if (next != null) goTo(next) else submit()
    }

    fun submit() {
        val invalid = sequence.firstOrNull { !validate(it) }
        if (invalid != null) {
            goTo(invalid)
            onInvalid?.invoke()
            return
        }
        onSubmit?.invoke(values)
    }

    fun reset() {
        records.values.forEach { it.reset() }
        val start = sequence.firstOrNull() ?: return
        if (start != item) goTo(start)
    }

    private fun validate(name: String): Boolean {
        val record = records[name] ?: return definitions?.firstOrNull { it.name == name }?.required != true
        record.attempted = true
        return record.satisfied
    }
}

@Composable
fun rememberQuestionnaireState(
    defaultItem: String? = null,
    items: List<QuestionnaireItemDefinition>? = null,
): QuestionnaireState = remember(items) { QuestionnaireState(defaultItem, items) }

private val LocalQuestionnaire = staticCompositionLocalOf<QuestionnaireState?> { null }

private val LocalQuestionnaireItem = staticCompositionLocalOf<QuestionnaireItemRecord?> { null }

@Composable
fun useQuestionnaire(): QuestionnaireState =
    checkNotNull(LocalQuestionnaire.current) { "Questionnaire parts must be used within a Questionnaire" }

@Composable
private fun questionnaireItem(): QuestionnaireItemRecord =
    checkNotNull(LocalQuestionnaireItem.current) { "Questionnaire item parts must be used within a QuestionnaireItem" }

private object QuestionnaireItemSlot

private object QuestionnairePreviousSlot

private fun Modifier.pullUp(amount: Dp): Modifier = layout { measurable, constraints ->
    val placeable = measurable.measure(constraints)
    val pull = amount.roundToPx()
    layout(placeable.width, (placeable.height - pull).coerceAtLeast(0)) { placeable.place(0, -pull) }
}

@Composable
fun Questionnaire(
    modifier: Modifier = Modifier,
    state: QuestionnaireState = rememberQuestionnaireState(),
    onItemChange: ((String) -> Unit)? = null,
    onSubmit: (Map<String, List<String>>) -> Unit = {},
    content: @Composable () -> Unit,
) {
    val haptics = rememberHaptics()
    val itemChange by rememberUpdatedState(onItemChange)
    val submit by rememberUpdatedState(onSubmit)
    SideEffect {
        state.onItemChange = { itemChange?.invoke(it) }
        state.onSubmit = { submit(it) }
        state.onInvalid = { haptics.perform(HapticFeedbackType.Reject) }
    }
    CompositionLocalProvider(LocalQuestionnaire provides state) {
        Layout(content = content, modifier = modifier.fillMaxWidth()) { measurables, constraints ->
            val loose = constraints.copy(minWidth = 0, minHeight = 0)
            val placeables = measurables.map { it.measure(loose) }
            val slots = measurables.map { it.layoutId == QuestionnaireItemSlot }
            val gap = 24.dp.roundToPx()
            val positions = IntArray(placeables.size)
            var y = 0
            var started = false
            var index = 0
            while (index < placeables.size) {
                var end = index + 1
                if (slots[index]) while (end < placeables.size && slots[end]) end++
                val height = (index until end).maxOf { placeables[it].height }
                if (height > 0 && started) y += gap
                for (cell in index until end) positions[cell] = y
                if (height > 0) {
                    y += height
                    started = true
                }
                index = end
            }
            val width = constraints.maxWidth.takeIf { it != Constraints.Infinity }
                ?: placeables.maxOfOrNull { it.width } ?: 0
            layout(width, constraints.constrainHeight(y)) {
                placeables.forEachIndexed { i, placeable -> placeable.place(0, positions[i]) }
            }
        }
    }
}

@Composable
fun QuestionnaireProgress(
    modifier: Modifier = Modifier,
    content: (@Composable (current: Int, total: Int) -> Unit)? = null,
) {
    val state = useQuestionnaire()
    val total = state.total
    val current = state.current
    val text = if (total > 0) "Question $current of $total" else ""
    Box(
        modifier = modifier
            .heightIn(min = 18.dp)
            .semantics(mergeDescendants = true) {
                contentDescription = "Questionnaire progress"
                liveRegion = LiveRegionMode.Polite
                if (total > 0) {
                    progressBarRangeInfo = ProgressBarRangeInfo(current.toFloat(), 1f..total.toFloat())
                    stateDescription = text
                }
            },
    ) {
        if (content != null) {
            CompositionLocalProvider(
                LocalContentStyle provides Typography.xs.copy(color = EsuissTheme.colors.mutedForeground),
                LocalContentColor provides EsuissTheme.colors.mutedForeground,
            ) {
                content(current, total)
            }
        } else {
            BasicText(text, style = Typography.xs.copy(color = EsuissTheme.colors.mutedForeground))
        }
    }
}

@Composable
fun QuestionnaireItem(
    name: String,
    modifier: Modifier = Modifier,
    required: Boolean = false,
    multiple: Boolean = false,
    enabled: Boolean = true,
    invalid: Boolean = false,
    onStatusChange: ((QuestionnaireItemStatus) -> Unit)? = null,
    content: @Composable ColumnScope.() -> Unit,
) {
    val state = useQuestionnaire()
    val record = remember(state, name) { state.record(name) }
    DisposableEffect(state, name) { onDispose(state.register(name)) }
    val wasMultiple = remember(record) { mutableStateOf(multiple) }
    SideEffect {
        record.required = required
        record.disabled = !enabled
        record.invalidProp = invalid
        record.onStatusChange = onStatusChange
        if (wasMultiple.value && !multiple && record.selected.size > 1) {
            val keep = record.selected.first()
            record.selected.clear()
            record.selected.add(keep)
        }
        wasMultiple.value = multiple
        record.multiple = multiple
    }
    LaunchedEffect(record) {
        snapshotFlow { record.status }.collect { record.report() }
    }
    val active = enabled && state.isActive(name)
    val reduced = formReducedMotion()
    val animate = state.animated && !reduced
    val enter = if (animate) {
        slideInHorizontally(tween(320, easing = FormEasing)) { if (state.forward) it else -it } +
            fadeIn(tween(320, easing = FormEasing))
    } else {
        EnterTransition.None
    }
    val exit = if (animate) {
        slideOutHorizontally(tween(320, easing = FormEasing)) { if (state.forward) -it else it } +
            fadeOut(tween(200, easing = FormEasing))
    } else {
        ExitTransition.None
    }
    Box(modifier = Modifier.layoutId(QuestionnaireItemSlot).fillMaxWidth().clipToBounds()) {
        AnimatedVisibility(visible = active, enter = enter, exit = exit) {
            CompositionLocalProvider(LocalQuestionnaireItem provides record) {
                Column(
                    modifier = modifier
                        .fillMaxWidth()
                        .semantics {
                            if (record.invalid) error(if (required) "Choose an answer to continue." else "Choose an answer or skip this question.")
                        },
                    verticalArrangement = Arrangement.spacedBy(20.dp),
                    content = content,
                )
            }
        }
    }
}

@Composable
fun QuestionnaireTitle(text: String, modifier: Modifier = Modifier) {
    questionnaireItem()
    BasicText(
        text,
        modifier = modifier.semantics { heading() },
        style = Typography.base.copy(color = EsuissTheme.colors.foreground, fontWeight = FontWeight.SemiBold),
    )
}

@Composable
fun QuestionnaireDescription(text: String, modifier: Modifier = Modifier) {
    BasicText(
        text,
        modifier = modifier.pullUp(16.dp),
        style = Typography.sm.copy(color = EsuissTheme.colors.mutedForeground),
    )
}

@Composable
fun QuestionnaireChoices(modifier: Modifier = Modifier, content: @Composable ColumnScope.() -> Unit) {
    val item = questionnaireItem()
    Column(
        modifier = modifier
            .fillMaxWidth()
            .then(if (item.multiple) Modifier else Modifier.selectableGroup()),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        content = content,
    )
}

@Composable
fun QuestionnaireChoice(
    value: String,
    modifier: Modifier = Modifier,
    checked: Boolean? = null,
    onCheckedChange: ((Boolean) -> Unit)? = null,
    defaultChecked: Boolean = false,
    enabled: Boolean = true,
    content: @Composable ColumnScope.() -> Unit,
) {
    val item = questionnaireItem()
    val colors = EsuissTheme.colors
    val haptics = rememberHaptics()
    val source = remember { MutableInteractionSource() }
    val pressed by source.collectIsPressedAsState()
    SideEffect {
        if (value !in item.initialized) {
            item.initialized.add(value)
            if (defaultChecked) {
                item.defaults.add(value)
                if (checked == null && (item.multiple || item.selected.isEmpty())) item.selected.add(value)
            }
        }
    }
    LaunchedEffect(item, value, checked) {
        if (checked == null) return@LaunchedEffect
        if (checked) item.select(value, true) else item.selected.remove(value)
    }
    val active = enabled && !item.disabled
    val on = if (checked != null) checked && !item.skipped else value in item.selected
    val invalid = item.invalid
    val multiple = item.multiple
    val change: (Boolean) -> Unit = { next ->
        haptics.selection()
        if (checked == null) item.select(value, next) else item.skipped = false
        onCheckedChange?.invoke(next)
    }
    val shape = RoundedCornerShape(Radius.xl)
    val background = when {
        invalid -> colors.destructive.copy(alpha = if (colors.isDark) 0.1f else 0.05f)
        else -> Color.Transparent
    }
    val border = when {
        on -> colors.primary
        invalid -> colors.destructive
        else -> colors.border
    }
    val interaction = if (multiple) {
        Modifier.toggleable(on, source, null, active, Role.Checkbox) { change(it) }
    } else {
        Modifier.selectable(on, source, null, active, Role.RadioButton) { change(true) }
    }
    Row(
        modifier = modifier
            .fillMaxWidth()
            .heightIn(min = 44.dp)
            .alpha(
                when {
                    !active -> 0.5f
                    pressed -> 0.8f
                    else -> 1f
                },
            )
            .clip(shape)
            .background(background, shape)
            .border(if (on) 2.dp else 1.dp, border, shape)
            .then(interaction)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.spacedBy(10.dp),
        verticalAlignment = Alignment.Top,
    ) {
        Box(
            modifier = Modifier
                .padding(top = 3.dp)
                .size(16.dp)
                .background(if (on) colors.primary else colors.border, if (multiple) RoundedCornerShape(Radius.xs) else CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            if (on && multiple) {
                Icon(PhosphorIcons.Bold.Check, contentDescription = null, size = 12.dp, tint = colors.primaryForeground)
            } else if (on) {
                Box(Modifier.size(if (colors.isDark) 10.dp else 8.dp).background(colors.primaryForeground, CircleShape))
            }
        }
        val foreground = colors.foreground
        CompositionLocalProvider(
            LocalContentStyle provides Typography.base.copy(color = foreground),
            LocalContentColor provides foreground,
        ) {
            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp), content = content)
        }
    }
}

@Composable
fun QuestionnaireChoice(
    text: String,
    value: String,
    modifier: Modifier = Modifier,
    checked: Boolean? = null,
    onCheckedChange: ((Boolean) -> Unit)? = null,
    defaultChecked: Boolean = false,
    enabled: Boolean = true,
) {
    QuestionnaireChoice(value, modifier, checked, onCheckedChange, defaultChecked, enabled) {
        BasicText(text, style = LocalContentStyle.current)
    }
}

@Composable
fun QuestionnaireChoiceDescription(text: String, modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    BasicText(
        text,
        modifier = modifier,
        style = LocalContentStyle.current.copy(
            color = colors.mutedForeground,
        ),
    )
}

@Composable
fun QuestionnaireInput(
    modifier: Modifier = Modifier,
    value: String? = null,
    onValueChange: ((String) -> Unit)? = null,
    defaultValue: String = "",
    enabled: Boolean = true,
    placeholder: String? = null,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
) {
    val item = questionnaireItem()
    val state = useQuestionnaire()
    SideEffect {
        if (InputMarker !in item.initialized) {
            item.initialized.add(InputMarker)
            item.defaultInput = defaultValue
            if (value == null) item.input = defaultValue
        }
    }
    LaunchedEffect(item, value) {
        if (value != null) item.updateInput(value)
    }
    Input(
        value = value ?: item.input,
        onValueChange = { next ->
            if (value == null) item.updateInput(next)
            onValueChange?.invoke(next)
        },
        modifier = modifier,
        enabled = enabled && !item.disabled,
        invalid = item.invalid,
        placeholder = placeholder,
        keyboardOptions = keyboardOptions,
        keyboardActions = KeyboardActions(onDone = {
            if (state.last) state.submit() else state.goNext()
        }),
    )
}

private const val InputMarker = "\u0000input"

@Composable
fun QuestionnaireError(text: String? = null, modifier: Modifier = Modifier) {
    val item = questionnaireItem()
    if (!item.invalid) return
    BasicText(
        text ?: if (item.required) "Choose an answer to continue." else "Choose an answer or skip this question.",
        modifier = modifier
            .pullUp(12.dp)
            .semantics { liveRegion = LiveRegionMode.Assertive },
        style = Typography.sm.copy(color = EsuissTheme.colors.destructive),
    )
}

@Composable
fun QuestionnaireActions(modifier: Modifier = Modifier, content: @Composable () -> Unit) {
    Layout(content = content, modifier = modifier.fillMaxWidth().heightIn(min = 44.dp)) { measurables, constraints ->
        val loose = constraints.copy(minWidth = 0, minHeight = 0)
        val placeables = measurables.map { it.measure(loose) }
        val previous = measurables.map { it.layoutId == QuestionnairePreviousSlot }
        val gap = 8.dp.roundToPx()
        val width = constraints.maxWidth
        val height = constraints.constrainHeight(placeables.maxOfOrNull { it.height } ?: 0)
        layout(width, height) {
            var start = 0
            placeables.forEachIndexed { i, placeable ->
                if (!previous[i] || placeable.width == 0) return@forEachIndexed
                placeable.place(start, (height - placeable.height) / 2)
                start += placeable.width + gap
            }
            var end = width
            placeables.indices.reversed().forEach { i ->
                val placeable = placeables[i]
                if (previous[i] || placeable.width == 0) return@forEach
                end -= placeable.width
                placeable.place(end, (height - placeable.height) / 2)
                end -= gap
            }
        }
    }
}

@Composable
private fun QuestionnaireNavigation(
    text: String,
    visible: Boolean,
    onClick: () -> Unit,
    modifier: Modifier,
    variant: ButtonVariant,
    size: ButtonSize,
    enabled: Boolean,
) {
    if (!visible) return
    Button(
        text = text,
        onClick = onClick,
        modifier = modifier.heightIn(min = 44.dp),
        variant = variant,
        size = size,
        enabled = enabled,
    )
}

@Composable
fun QuestionnairePrevious(
    modifier: Modifier = Modifier,
    text: String = "Previous",
    variant: ButtonVariant = ButtonVariant.Outline,
    size: ButtonSize = ButtonSize.Default,
    enabled: Boolean = true,
) {
    val state = useQuestionnaire()
    QuestionnaireNavigation(
        text,
        state.total > 1 && !state.first,
        state::goPrevious,
        modifier.layoutId(QuestionnairePreviousSlot),
        variant,
        size,
        enabled,
    )
}

@Composable
fun QuestionnaireSkip(
    modifier: Modifier = Modifier,
    text: String = "Skip",
    variant: ButtonVariant = ButtonVariant.Outline,
    size: ButtonSize = ButtonSize.Default,
    enabled: Boolean = true,
) {
    val state = useQuestionnaire()
    QuestionnaireNavigation(text, state.activeItemRequired == false, state::skipCurrent, modifier, variant, size, enabled)
}

@Composable
fun QuestionnaireNext(
    modifier: Modifier = Modifier,
    text: String = "Next",
    variant: ButtonVariant = ButtonVariant.Default,
    size: ButtonSize = ButtonSize.Default,
    enabled: Boolean = true,
) {
    val state = useQuestionnaire()
    QuestionnaireNavigation(text, state.total > 1 && !state.last, state::goNext, modifier, variant, size, enabled)
}

@Composable
fun QuestionnaireSubmit(
    modifier: Modifier = Modifier,
    text: String = "Submit",
    variant: ButtonVariant = ButtonVariant.Default,
    size: ButtonSize = ButtonSize.Default,
    enabled: Boolean = true,
) {
    val state = useQuestionnaire()
    QuestionnaireNavigation(text, state.total > 0 && state.last, state::submit, modifier, variant, size, enabled)
}
