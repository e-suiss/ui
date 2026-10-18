package com.esuiss.ui.icons

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.graphics.vector.addPathNodes
import androidx.compose.ui.unit.dp

object EsuissIcons {
  const val LIBRARY = "tabler"
}

object ThinIcons
object LightIcons
object RegularIcons
object BoldIcons
object FillIcons
object DuotoneIcons

val EsuissIcons.Thin: ThinIcons
  get() = ThinIcons

val EsuissIcons.Light: LightIcons
  get() = LightIcons

val EsuissIcons.Regular: RegularIcons
  get() = RegularIcons

val EsuissIcons.Bold: BoldIcons
  get() = BoldIcons

val EsuissIcons.Fill: FillIcons
  get() = FillIcons

val EsuissIcons.Duotone: DuotoneIcons
  get() = DuotoneIcons

class IconShape(val d: String, val fill: Boolean, val width: Float)

class IconSet(val regular: List<IconShape>, val filled: List<IconShape>? = null)

enum class IconWeight(val scale: Float) {
  Thin(0.5f),
  Light(0.75f),
  Regular(1f),
  Bold(1.25f),
  Fill(1f),
  Duotone(1f),
}

private val cache = HashMap<String, ImageVector>()

fun iconVector(name: String, set: IconSet, weight: IconWeight): ImageVector {
  val filled = weight == IconWeight.Fill && set.filled != null
  return cache.getOrPut("$name-$weight-$filled") {
    val builder =
      ImageVector.Builder(
        name = name,
        defaultWidth = 24.dp,
        defaultHeight = 24.dp,
        viewportWidth = 24f,
        viewportHeight = 24f,
      )
    for (shape in if (filled) set.filled.orEmpty() else set.regular) {
      builder.addPath(
        pathData = addPathNodes(shape.d),
        fill = if (shape.fill) SolidColor(Color.Black) else null,
        stroke = if (shape.fill) null else SolidColor(Color.Black),
        strokeLineWidth = shape.width * weight.scale,
        strokeLineCap = StrokeCap.Round,
        strokeLineJoin = StrokeJoin.Round,
      )
    }
    builder.build()
  }
}

object IconData {
  val Airplane: IconSet
    get() = IconSet(listOf(IconShape("M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2 -7h-4l-2 2h-3l2 -4l-2 -4h3l2 2h4l-2 -7h3l4 7", false, 2f)), listOf(IconShape("M12.868 2.504l3.712 6.496h3.42a3 3 0 0 1 0 6h-3.42l-3.712 6.496a1 1 0 0 1 -.868 .504h-3a1 1 0 0 1 -.962 -1.275l1.636 -5.725h-2.26l-1.707 1.707a1 1 0 0 1 -.707 .293h-3a1 1 0 0 1 -.894 -1.447l1.776 -3.553l-1.776 -3.553a1 1 0 0 1 .894 -1.447h3a1 1 0 0 1 .707 .293l1.707 1.707h2.26l-1.636 -5.725a1 1 0 0 1 .962 -1.275h3a1 1 0 0 1 .868 .504", true, 0f)))

  val Archive: IconSet
    get() = IconSet(listOf(IconShape("M3 6a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2", false, 2f), IconShape("M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10", false, 2f), IconShape("M10 12l4 0", false, 2f)), listOf(IconShape("M2 5a2 2 0 0 1 2 -2h16a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2z", true, 0f), IconShape("M19 9c.513 0 .936 .463 .993 1.06l.007 .14v7.2c0 1.917 -1.249 3.484 -2.824 3.594l-.176 .006h-10c-1.598 0 -2.904 -1.499 -2.995 -3.388l-.005 -.212v-7.2c0 -.663 .448 -1.2 1 -1.2h14zm-5 2h-4l-.117 .007a1 1 0 0 0 0 1.986l.117 .007h4l.117 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z", true, 0f)))

  val ArrowBendUpLeft: IconSet
    get() = IconSet(listOf(IconShape("M9 14l-4 -4l4 -4", false, 2f), IconShape("M5 10h11a4 4 0 1 1 0 8h-1", false, 2f)))

  val ArrowClockwise: IconSet
    get() = IconSet(listOf(IconShape("M4.05 11a8 8 0 1 1 .5 4m-.5 5v-5h5", false, 2f)))

  val ArrowCounterClockwise: IconSet
    get() = IconSet(listOf(IconShape("M19.95 11a8 8 0 1 0 -.5 4m.5 5v-5h-5", false, 2f)))

  val ArrowDown: IconSet
    get() = IconSet(listOf(IconShape("M12 5l0 14", false, 2f), IconShape("M18 13l-6 6", false, 2f), IconShape("M6 13l6 6", false, 2f)))

  val ArrowLeft: IconSet
    get() = IconSet(listOf(IconShape("M5 12l14 0", false, 2f), IconShape("M5 12l6 6", false, 2f), IconShape("M5 12l6 -6", false, 2f)))

  val ArrowRight: IconSet
    get() = IconSet(listOf(IconShape("M5 12l14 0", false, 2f), IconShape("M13 18l6 -6", false, 2f), IconShape("M13 6l6 6", false, 2f)))

  val ArrowSquareOut: IconSet
    get() = IconSet(listOf(IconShape("M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6", false, 2f), IconShape("M11 13l9 -9", false, 2f), IconShape("M15 4h5v5", false, 2f)), listOf(IconShape("M12 5a1 1 0 0 1 0 2h-6a1 1 0 0 0 -1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1 -1v-6a1 1 0 0 1 2 0v6a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-10a3 3 0 0 1 3 -3zm3 -2h5l.075 .003l.126 .017l.111 .03l.111 .044l.098 .052l.096 .067l.09 .08q .054 .053 .097 .112l.071 .11l.054 .114l.035 .105l.03 .148l.006 .118v5a1 1 0 0 1 -2 0v-2.586l-7.293 7.293a1 1 0 0 1 -1.414 -1.414l7.291 -7.293h-2.584a1 1 0 0 1 0 -2", true, 0f)))

  val ArrowUp: IconSet
    get() = IconSet(listOf(IconShape("M12 5l0 14", false, 2f), IconShape("M18 11l-6 -6", false, 2f), IconShape("M6 11l6 -6", false, 2f)))

  val ArrowUpRight: IconSet
    get() = IconSet(listOf(IconShape("M17 7l-10 10", false, 2f), IconShape("M8 7l9 0l0 9", false, 2f)))

  val Backspace: IconSet
    get() = IconSet(listOf(IconShape("M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5l11 0", false, 2f), IconShape("M12 10l4 4m0 -4l-4 4", false, 2f)), listOf(IconShape("M20 5a2 2 0 0 1 1.995 1.85l.005 .15v10a2 2 0 0 1 -1.85 1.995l-.15 .005h-11a1 1 0 0 1 -.608 -.206l-.1 -.087l-5.037 -5.04c-.809 -.904 -.847 -2.25 -.083 -3.23l.12 -.144l5 -5a1 1 0 0 1 .577 -.284l.131 -.009h11zm-7.489 4.14a1 1 0 0 0 -1.301 1.473l.083 .094l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.403 1.403l.094 -.083l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.403 -1.403l-.083 -.094l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.403 -1.403l-.094 .083l-1.293 1.292l-1.293 -1.292l-.094 -.083l-.102 -.07z", true, 0f)))

  val Bell: IconSet
    get() = IconSet(listOf(IconShape("M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6", false, 2f), IconShape("M9 17v1a3 3 0 0 0 6 0v-1", false, 2f)), listOf(IconShape("M14.235 19c.865 0 1.322 1.024 .745 1.668a3.992 3.992 0 0 1 -2.98 1.332a3.992 3.992 0 0 1 -2.98 -1.332c-.552 -.616 -.158 -1.579 .634 -1.661l.11 -.006h4.471z", true, 0f), IconShape("M12 2c1.358 0 2.506 .903 2.875 2.141l.046 .171l.008 .043a8.013 8.013 0 0 1 4.024 6.069l.028 .287l.019 .289v2.931l.021 .136a3 3 0 0 0 1.143 1.847l.167 .117l.162 .099c.86 .487 .56 1.766 -.377 1.864l-.116 .006h-16c-1.028 0 -1.387 -1.364 -.493 -1.87a3 3 0 0 0 1.472 -2.063l.021 -.143l.001 -2.97a8 8 0 0 1 3.821 -6.454l.248 -.146l.01 -.043a3.003 3.003 0 0 1 2.562 -2.29l.182 -.017l.176 -.004z", true, 0f)))

  val BellRinging: IconSet
    get() = IconSet(listOf(IconShape("M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6", false, 2f), IconShape("M9 17v1a3 3 0 0 0 6 0v-1", false, 2f), IconShape("M21 6.727a11.05 11.05 0 0 0 -2.794 -3.727", false, 2f), IconShape("M3 6.727a11.05 11.05 0 0 1 2.792 -3.727", false, 2f)), listOf(IconShape("M17.451 2.344a1 1 0 0 1 1.41 -.099a12.05 12.05 0 0 1 3.048 4.064a1 1 0 1 1 -1.818 .836a10.05 10.05 0 0 0 -2.54 -3.39a1 1 0 0 1 -.1 -1.41z", true, 0f), IconShape("M5.136 2.245a1 1 0 0 1 1.312 1.51a10.05 10.05 0 0 0 -2.54 3.39a1 1 0 1 1 -1.817 -.835a12.05 12.05 0 0 1 3.045 -4.065z", true, 0f), IconShape("M14.235 19c.865 0 1.322 1.024 .745 1.668a3.992 3.992 0 0 1 -2.98 1.332a3.992 3.992 0 0 1 -2.98 -1.332c-.552 -.616 -.158 -1.579 .634 -1.661l.11 -.006h4.471z", true, 0f), IconShape("M12 2c1.358 0 2.506 .903 2.875 2.141l.046 .171l.008 .043a8.013 8.013 0 0 1 4.024 6.069l.028 .287l.019 .289v2.931l.021 .136a3 3 0 0 0 1.143 1.847l.167 .117l.162 .099c.86 .487 .56 1.766 -.377 1.864l-.116 .006h-16c-1.028 0 -1.387 -1.364 -.493 -1.87a3 3 0 0 0 1.472 -2.063l.021 -.143l.001 -2.97a8 8 0 0 1 3.821 -6.454l.248 -.146l.01 -.043a3.003 3.003 0 0 1 2.562 -2.29l.182 -.017l.176 -.004z", true, 0f)))

  val BellSlash: IconSet
    get() = IconSet(listOf(IconShape("M9.346 5.353c.21 -.129 .428 -.246 .654 -.353a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3m-1 3h-13a4 4 0 0 0 2 -3v-3a6.996 6.996 0 0 1 1.273 -3.707", false, 2f), IconShape("M9 17v1a3 3 0 0 0 6 0v-1", false, 2f), IconShape("M3 3l18 18", false, 2f)))

  val Bluetooth: IconSet
    get() = IconSet(listOf(IconShape("M7 8l10 8l-5 4l0 -16l5 4l-10 8", false, 2f)))

  val Book: IconSet
    get() = IconSet(listOf(IconShape("M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0", false, 2f), IconShape("M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0", false, 2f), IconShape("M3 6l0 13", false, 2f), IconShape("M12 6l0 13", false, 2f), IconShape("M21 6l0 13", false, 2f)), listOf(IconShape("M21.5 5.134a1 1 0 0 1 .493 .748l.007 .118v13a1 1 0 0 1 -1.5 .866a8 8 0 0 0 -7.5 -.266v-15.174a10 10 0 0 1 8.5 .708m-10.5 -.707l.001 15.174a8 8 0 0 0 -7.234 .117l-.327 .18l-.103 .044l-.049 .016l-.11 .026l-.061 .01l-.117 .006h-.042l-.11 -.012l-.077 -.014l-.108 -.032l-.126 -.056l-.095 -.056l-.089 -.067l-.06 -.056l-.073 -.082l-.064 -.089l-.022 -.036l-.032 -.06l-.044 -.103l-.016 -.049l-.026 -.11l-.01 -.061l-.004 -.049l-.002 -13.068a1 1 0 0 1 .5 -.866a10 10 0 0 1 8.5 -.707", true, 0f)))

  val BookmarkSimple: IconSet
    get() = IconSet(listOf(IconShape("M18 7v14l-6 -4l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4", false, 2f)), listOf(IconShape("M14 2a5 5 0 0 1 5 5v14a1 1 0 0 1 -1.555 .832l-5.445 -3.63l-5.444 3.63a1 1 0 0 1 -1.55 -.72l-.006 -.112v-14a5 5 0 0 1 5 -5h4z", true, 0f)))

  val Brain: IconSet
    get() = IconSet(listOf(IconShape("M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8", false, 2f), IconShape("M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8", false, 2f), IconShape("M17.5 16a3.5 3.5 0 0 0 0 -7h-.5", false, 2f), IconShape("M19 9.3v-2.8a3.5 3.5 0 0 0 -7 0", false, 2f), IconShape("M6.5 16a3.5 3.5 0 0 1 0 -7h.5", false, 2f), IconShape("M5 9.3v-2.8a3.5 3.5 0 0 1 7 0v10", false, 2f)))

  val Calendar: IconSet
    get() = IconSet(listOf(IconShape("M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12", false, 2f), IconShape("M16 3v4", false, 2f), IconShape("M8 3v4", false, 2f), IconShape("M4 11h16", false, 2f), IconShape("M11 15h1", false, 2f), IconShape("M12 15v3", false, 2f)), listOf(IconShape("M16 2a1 1 0 0 1 .993 .883l.007 .117v1h1a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h1v-1a1 1 0 0 1 1.993 -.117l.007 .117v1h6v-1a1 1 0 0 1 1 -1zm3 7h-14v9.625c0 .705 .386 1.286 .883 1.366l.117 .009h12c.513 0 .936 -.53 .993 -1.215l.007 -.16v-9.625z", true, 0f), IconShape("M12 12a1 1 0 0 1 .993 .883l.007 .117v3a1 1 0 0 1 -1.993 .117l-.007 -.117v-2a1 1 0 0 1 -.117 -1.993l.117 -.007h1z", true, 0f)))

  val CalendarBlank: IconSet
    get() = IconSet(listOf(IconShape("M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12", false, 2f), IconShape("M16 3v4", false, 2f), IconShape("M8 3v4", false, 2f), IconShape("M4 11h16", false, 2f), IconShape("M11 15h1", false, 2f), IconShape("M12 15v3", false, 2f)), listOf(IconShape("M16 2a1 1 0 0 1 .993 .883l.007 .117v1h1a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h1v-1a1 1 0 0 1 1.993 -.117l.007 .117v1h6v-1a1 1 0 0 1 1 -1zm3 7h-14v9.625c0 .705 .386 1.286 .883 1.366l.117 .009h12c.513 0 .936 -.53 .993 -1.215l.007 -.16v-9.625z", true, 0f), IconShape("M12 12a1 1 0 0 1 .993 .883l.007 .117v3a1 1 0 0 1 -1.993 .117l-.007 -.117v-2a1 1 0 0 1 -.117 -1.993l.117 -.007h1z", true, 0f)))

  val CalendarPlus: IconSet
    get() = IconSet(listOf(IconShape("M12.5 21h-6.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v5", false, 2f), IconShape("M16 3v4", false, 2f), IconShape("M8 3v4", false, 2f), IconShape("M4 11h16", false, 2f), IconShape("M16 19h6", false, 2f), IconShape("M19 16v6", false, 2f)))

  val Camera: IconSet
    get() = IconSet(listOf(IconShape("M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2", false, 2f), IconShape("M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0", false, 2f)), listOf(IconShape("M15 3a2 2 0 0 1 1.995 1.85l.005 .15a1 1 0 0 0 .883 .993l.117 .007h1a3 3 0 0 1 2.995 2.824l.005 .176v9a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-9a3 3 0 0 1 2.824 -2.995l.176 -.005h1a1 1 0 0 0 1 -1a2 2 0 0 1 1.85 -1.995l.15 -.005h6zm-3 7a3 3 0 0 0 -2.985 2.698l-.011 .152l-.004 .15l.004 .15a3 3 0 1 0 2.996 -3.15z", true, 0f)))

  val CaretDown: IconSet
    get() = IconSet(listOf(IconShape("M6 9l6 6l6 -6", false, 2f)), listOf(IconShape("M18.707 8.293a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1 -1.414 0l-6 -6a1 1 0 0 1 1.414 -1.414l5.293 5.293l5.293 -5.293a1 1 0 0 1 1.414 0", true, 0f)))

  val CaretLeft: IconSet
    get() = IconSet(listOf(IconShape("M15 6l-6 6l6 6", false, 2f)))

  val CaretRight: IconSet
    get() = IconSet(listOf(IconShape("M9 6l6 6l-6 6", false, 2f)), listOf(IconShape("M9.707 5.293l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 1 1 -1.414 -1.414l5.293 -5.293l-5.293 -5.293a1 1 0 0 1 1.414 -1.414", true, 0f)))

  val CaretUp: IconSet
    get() = IconSet(listOf(IconShape("M6 15l6 -6l6 6", false, 2f)))

  val CaretUpDown: IconSet
    get() = IconSet(listOf(IconShape("M8 9l4 -4l4 4", false, 2f), IconShape("M16 15l-4 4l-4 -4", false, 2f)))

  val CashRegister: IconSet
    get() = IconSet(listOf(IconShape("M21 15h-2.5c-.398 0 -.779 .158 -1.061 .439c-.281 .281 -.439 .663 -.439 1.061c0 .398 .158 .779 .439 1.061c.281 .281 .663 .439 1.061 .439h1c.398 0 .779 .158 1.061 .439c.281 .281 .439 .663 .439 1.061c0 .398 -.158 .779 -.439 1.061c-.281 .281 -.663 .439 -1.061 .439h-2.5", false, 2f), IconShape("M19 21v1m0 -8v1", false, 2f), IconShape("M13 21h-7c-.53 0 -1.039 -.211 -1.414 -.586c-.375 -.375 -.586 -.884 -.586 -1.414v-10c0 -.53 .211 -1.039 .586 -1.414c.375 -.375 .884 -.586 1.414 -.586h2m12 3.12v-1.12c0 -.53 -.211 -1.039 -.586 -1.414c-.375 -.375 -.884 -.586 -1.414 -.586h-2", false, 2f), IconShape("M16 10v-6c0 -.53 -.211 -1.039 -.586 -1.414c-.375 -.375 -.884 -.586 -1.414 -.586h-4c-.53 0 -1.039 .211 -1.414 .586c-.375 .375 -.586 .884 -.586 1.414v6m8 0h-8m8 0h1m-9 0h-1", false, 2f), IconShape("M8 14v.01", false, 2f), IconShape("M8 17v.01", false, 2f), IconShape("M12 13.99v.01", false, 2f), IconShape("M12 17v.01", false, 2f)))

  val CellSignalFull: IconSet
    get() = IconSet(listOf(IconShape("M6 18l0 -3", false, 2f), IconShape("M10 18l0 -6", false, 2f), IconShape("M14 18l0 -9", false, 2f), IconShape("M18 18l0 -12", false, 2f)))

  val ChartBar: IconSet
    get() = IconSet(listOf(IconShape("M3 13a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -6", false, 2f), IconShape("M15 9a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -10", false, 2f), IconShape("M9 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -14", false, 2f), IconShape("M4 20h14", false, 2f)))

  val ChatCircle: IconSet
    get() = IconSet(listOf(IconShape("M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1", false, 2f)), listOf(IconShape("M5.821 4.91c3.899 -2.765 9.468 -2.539 13.073 .535c3.667 3.129 4.168 8.238 1.152 11.898c-2.841 3.447 -7.965 4.583 -12.231 2.805l-.233 -.101l-4.374 .931l-.04 .006l-.035 .007h-.018l-.022 .005h-.038l-.033 .004l-.021 -.001l-.023 .001l-.033 -.003h-.035l-.022 -.004l-.022 -.002l-.035 -.007l-.034 -.005l-.016 -.004l-.024 -.005l-.049 -.016l-.024 -.005l-.011 -.005l-.022 -.007l-.045 -.02l-.03 -.012l-.011 -.006l-.014 -.006l-.031 -.018l-.045 -.024l-.016 -.011l-.037 -.026l-.04 -.027l-.002 -.004l-.013 -.009l-.043 -.04l-.025 -.02l-.006 -.007l-.056 -.062l-.013 -.014l-.011 -.014l-.039 -.056l-.014 -.019l-.005 -.01l-.042 -.073l-.007 -.012l-.004 -.008l-.007 -.012l-.014 -.038l-.02 -.042l-.004 -.016l-.004 -.01l-.017 -.061l-.007 -.018l-.002 -.015l-.005 -.019l-.005 -.033l-.008 -.042l-.002 -.031l-.003 -.01v-.016l-.004 -.054l.001 -.036l.001 -.023l.002 -.053l.004 -.025v-.019l.008 -.035l.005 -.034l.005 -.02l.004 -.02l.018 -.06l.003 -.013l1.15 -3.45l-.022 -.037c-2.21 -3.747 -1.209 -8.391 2.413 -11.119z", true, 0f)))

  val ChatCircleDots: IconSet
    get() = IconSet(listOf(IconShape("M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1", false, 2f)), listOf(IconShape("M5.821 4.91c3.899 -2.765 9.468 -2.539 13.073 .535c3.667 3.129 4.168 8.238 1.152 11.898c-2.841 3.447 -7.965 4.583 -12.231 2.805l-.233 -.101l-4.374 .931l-.04 .006l-.035 .007h-.018l-.022 .005h-.038l-.033 .004l-.021 -.001l-.023 .001l-.033 -.003h-.035l-.022 -.004l-.022 -.002l-.035 -.007l-.034 -.005l-.016 -.004l-.024 -.005l-.049 -.016l-.024 -.005l-.011 -.005l-.022 -.007l-.045 -.02l-.03 -.012l-.011 -.006l-.014 -.006l-.031 -.018l-.045 -.024l-.016 -.011l-.037 -.026l-.04 -.027l-.002 -.004l-.013 -.009l-.043 -.04l-.025 -.02l-.006 -.007l-.056 -.062l-.013 -.014l-.011 -.014l-.039 -.056l-.014 -.019l-.005 -.01l-.042 -.073l-.007 -.012l-.004 -.008l-.007 -.012l-.014 -.038l-.02 -.042l-.004 -.016l-.004 -.01l-.017 -.061l-.007 -.018l-.002 -.015l-.005 -.019l-.005 -.033l-.008 -.042l-.002 -.031l-.003 -.01v-.016l-.004 -.054l.001 -.036l.001 -.023l.002 -.053l.004 -.025v-.019l.008 -.035l.005 -.034l.005 -.02l.004 -.02l.018 -.06l.003 -.013l1.15 -3.45l-.022 -.037c-2.21 -3.747 -1.209 -8.391 2.413 -11.119z", true, 0f)))

  val ChatsCircle: IconSet
    get() = IconSet(listOf(IconShape("M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10", false, 2f), IconShape("M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2", false, 2f)), listOf(IconShape("M20.901 14.995l-.044 -.006a.4 .4 0 0 1 -.102 -.02l-.045 -.012l-.048 -.017l-.045 -.016l-.043 -.02l-.045 -.022l-.04 -.024l-.044 -.026l-.043 -.032l-.036 -.027a1 1 0 0 1 -.073 -.066l-2.707 -2.707h-6.586a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2h9a2 2 0 0 1 2 2v10a1 1 0 0 1 -.076 .383l-.02 .043l-.022 .045l-.024 .04l-.026 .044l-.032 .043l-.027 .036a1 1 0 0 1 -.578 .347l-.052 .008l-.044 .006a1 1 0 0 1 -.198 0", true, 0f), IconShape("M7 8.999v1.001a4 4 0 0 0 4 4h4v3a2 2 0 0 1 -2 2h-6.586l-2.707 2.707c-.63 .63 -1.707 .184 -1.707 -.707v-10a2 2 0 0 1 2 -2z", true, 0f)))

  val Check: IconSet
    get() = IconSet(listOf(IconShape("M5 12l5 5l10 -10", false, 2f)), listOf(IconShape("M20.707 6.293a1 1 0 0 1 0 1.414l-10 10a1 1 0 0 1 -1.414 0l-5 -5a1 1 0 0 1 1.414 -1.414l4.293 4.293l9.293 -9.293a1 1 0 0 1 1.414 0", true, 0f)))

  val CheckCircle: IconSet
    get() = IconSet(listOf(IconShape("M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0", false, 2f), IconShape("M9 12l2 2l4 -4", false, 2f)), listOf(IconShape("M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z", true, 0f)))

  val Checks: IconSet
    get() = IconSet(listOf(IconShape("M7 12l5 5l10 -10", false, 2f), IconShape("M2 12l5 5m5 -5l5 -5", false, 2f)))

  val Circle: IconSet
    get() = IconSet(listOf(IconShape("M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0", false, 2f)), listOf(IconShape("M7 3.34a10 10 0 1 1 -4.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 4.995 -8.336z", true, 0f)))

  val CircleHalf: IconSet
    get() = IconSet(listOf(IconShape("M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0", false, 2f), IconShape("M12 3v18", false, 2f), IconShape("M12 14l7 -7", false, 2f), IconShape("M12 19l8.5 -8.5", false, 2f), IconShape("M12 9l4.5 -4.5", false, 2f)))

  val CircleNotch: IconSet
    get() = IconSet(listOf(IconShape("M12 3a9 9 0 1 0 9 9", false, 2f)))

  val ClipboardText: IconSet
    get() = IconSet(listOf(IconShape("M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2", false, 2f), IconShape("M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2", false, 2f), IconShape("M9 12h6", false, 2f), IconShape("M9 16h6", false, 2f)), listOf(IconShape("M17.997 4.17a3 3 0 0 1 2.003 2.83v12a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 2.003 -2.83a4 4 0 0 0 3.997 3.83h4a4 4 0 0 0 3.98 -3.597zm-2.997 10.83h-6a1 1 0 0 0 0 2h6a1 1 0 0 0 0 -2m0 -4h-6a1 1 0 0 0 0 2h6a1 1 0 0 0 0 -2m-1 -9a2 2 0 1 1 0 4h-4a2 2 0 1 1 0 -4z", true, 0f)))

  val Clock: IconSet
    get() = IconSet(listOf(IconShape("M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0", false, 2f), IconShape("M12 7v5l3 3", false, 2f)), listOf(IconShape("M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-5 2.66a1 1 0 0 0 -.993 .883l-.007 .117v5l.009 .131a1 1 0 0 0 .197 .477l.087 .1l3 3l.094 .082a1 1 0 0 0 1.226 0l.094 -.083l.083 -.094a1 1 0 0 0 0 -1.226l-.083 -.094l-2.707 -2.708v-4.585l-.007 -.117a1 1 0 0 0 -.993 -.883z", true, 0f)))

  val Cloud: IconSet
    get() = IconSet(listOf(IconShape("M6.657 18c-2.572 0 -4.657 -2.007 -4.657 -4.483c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.913 0 3.464 1.56 3.464 3.486c0 1.927 -1.551 3.487 -3.465 3.487h-11.878", false, 2f)), listOf(IconShape("M10.04 4.305c2.195 -.667 4.615 -.224 6.36 1.176c1.386 1.108 2.188 2.686 2.252 4.34l.003 .212l.091 .003c2.3 .107 4.143 1.961 4.25 4.27l.004 .211c0 2.407 -1.885 4.372 -4.255 4.482l-.21 .005h-11.878l-.222 -.008c-2.94 -.11 -5.317 -2.399 -5.43 -5.263l-.005 -.216c0 -2.747 2.08 -5.01 4.784 -5.417l.114 -.016l.07 -.181c.663 -1.62 2.056 -2.906 3.829 -3.518l.244 -.08z", true, 0f)))

  val CloudArrowUp: IconSet
    get() = IconSet(listOf(IconShape("M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1", false, 2f), IconShape("M9 15l3 -3l3 3", false, 2f), IconShape("M12 12l0 9", false, 2f)))

  val CloudCheck: IconSet
    get() = IconSet(listOf(IconShape("M11 18.004h-4.343c-2.572 -.004 -4.657 -2.011 -4.657 -4.487c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.388 0 2.585 .82 3.138 2.007", false, 2f), IconShape("M15 19l2 2l4 -4", false, 2f)))

  val CloudSun: IconSet
    get() = IconSet(listOf(IconShape("M14.828 14.828a4 4 0 1 0 -5.656 -5.656a4 4 0 0 0 5.656 5.656", false, 2f), IconShape("M6.343 17.657l-1.414 1.414", false, 2f), IconShape("M6.343 6.343l-1.414 -1.414", false, 2f), IconShape("M17.657 6.343l1.414 -1.414", false, 2f), IconShape("M17.657 17.657l1.414 1.414", false, 2f), IconShape("M4 12h-2", false, 2f), IconShape("M12 4v-2", false, 2f), IconShape("M20 12h2", false, 2f), IconShape("M12 20v2", false, 2f)), listOf(IconShape("M12 19a1 1 0 0 1 1 1v2a1 1 0 0 1 -2 0v-2a1 1 0 0 1 1 -1m-4.95 -2.05a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 1 1 -1.414 -1.414l1.414 -1.414a1 1 0 0 1 1.414 0m11.314 0l1.414 1.414a1 1 0 0 1 -1.414 1.414l-1.414 -1.414a1 1 0 0 1 1.414 -1.414m-5.049 -9.836a5 5 0 1 1 -2.532 9.674a5 5 0 0 1 2.532 -9.674m-9.315 3.886a1 1 0 0 1 0 2h-2a1 1 0 0 1 0 -2zm18 0a1 1 0 0 1 0 2h-2a1 1 0 0 1 0 -2zm-16.364 -6.778l1.414 1.414a1 1 0 0 1 -1.414 1.414l-1.414 -1.414a1 1 0 0 1 1.414 -1.414m14.142 0a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 0 1 -1.414 -1.414l1.414 -1.414a1 1 0 0 1 1.414 0m-7.778 -3.222a1 1 0 0 1 1 1v2a1 1 0 0 1 -2 0v-2a1 1 0 0 1 1 -1", true, 0f)))

  val Coffee: IconSet
    get() = IconSet(listOf(IconShape("M3 14c.83 .642 2.077 1.017 3.5 1c1.423 .017 2.67 -.358 3.5 -1c.83 -.642 2.077 -1.017 3.5 -1c1.423 -.017 2.67 .358 3.5 1", false, 2f), IconShape("M8 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2", false, 2f), IconShape("M12 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2", false, 2f), IconShape("M3 10h14v5a6 6 0 0 1 -6 6h-2a6 6 0 0 1 -6 -6v-5", false, 2f), IconShape("M16.746 16.726a3 3 0 1 0 .252 -5.555", false, 2f)))

  val ContactlessPayment: IconSet
    get() = IconSet(listOf(IconShape("M11 20a3 3 0 0 1 -3 -3v-11l5 5", false, 2f), IconShape("M13 4a3 3 0 0 1 3 3v11l-5 -5", false, 2f), IconShape("M4 7a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3l0 -10", false, 2f)))

  val CookingPot: IconSet
    get() = IconSet(listOf(IconShape("M4 11h16a1 1 0 0 1 1 1v.5c0 1.5 -2.517 5.573 -4 6.5v1a1 1 0 0 1 -1 1h-8a1 1 0 0 1 -1 -1v-1c-1.687 -1.054 -4 -5 -4 -6.5v-.5a1 1 0 0 1 1 -1", false, 2f), IconShape("M12 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2", false, 2f), IconShape("M16 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2", false, 2f), IconShape("M8 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2", false, 2f)), listOf(IconShape("M20 10a2 2 0 0 1 2 2v.5c0 1.694 -2.247 5.49 -3.983 6.983l-.017 .013v.504a2 2 0 0 1 -1.85 1.995l-.15 .005h-8a2 2 0 0 1 -2 -2v-.496l-.065 -.053c-1.76 -1.496 -3.794 -4.965 -3.928 -6.77l-.007 -.181v-.5a2 2 0 0 1 2 -2z", true, 0f), IconShape("M11.417 3.188a1 1 0 1 1 1.166 1.624c-.375 .27 -.593 .706 -.583 1.209a1.4 1.4 0 0 0 .583 1.167a1 1 0 1 1 -1.166 1.624a3.38 3.38 0 0 1 -1.417 -2.791a3.4 3.4 0 0 1 1.417 -2.833", true, 0f), IconShape("M15.417 3.188a1 1 0 1 1 1.166 1.624c-.375 .27 -.593 .706 -.583 1.209a1.4 1.4 0 0 0 .583 1.167a1 1 0 1 1 -1.166 1.624a3.38 3.38 0 0 1 -1.417 -2.791a3.4 3.4 0 0 1 1.417 -2.833", true, 0f), IconShape("M7.417 3.188a1 1 0 1 1 1.166 1.624c-.375 .27 -.593 .706 -.583 1.209a1.4 1.4 0 0 0 .583 1.167a1 1 0 1 1 -1.166 1.624a3.38 3.38 0 0 1 -1.417 -2.791a3.4 3.4 0 0 1 1.417 -2.833", true, 0f)))

  val Copy: IconSet
    get() = IconSet(listOf(IconShape("M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666", false, 2f), IconShape("M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1", false, 2f)), listOf(IconShape("M20.926 7.074a3.67 3.67 0 0 1 1.074 2.593v8.666a3.667 3.667 0 0 1 -3.667 3.667h-8.666a3.667 3.667 0 0 1 -3.667 -3.667v-8.666q 0 -.053 .005 -.102a3.66 3.66 0 0 1 3.662 -3.565h8.666c.973 0 1.905 .386 2.593 1.074", true, 0f), IconShape("M17.374 3.514a1 1 0 1 1 -1.748 .972c-.221 -.398 -.342 -.486 -.626 -.486h-10c-.548 0 -1 .452 -1 1v9.998c0 .36 .194 .692 .507 .87a1 1 0 1 1 -.99 1.738a3 3 0 0 1 -1.517 -2.606v-10c0 -1.652 1.348 -3 3 -3h10c1.094 0 1.828 .533 2.374 1.514", true, 0f)))

  val CreditCard: IconSet
    get() = IconSet(listOf(IconShape("M3 8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -8", false, 2f), IconShape("M3 10l18 0", false, 2f), IconShape("M7 15l.01 0", false, 2f), IconShape("M11 15l2 0", false, 2f)), listOf(IconShape("M22 10v6a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-6h20zm-14.99 4h-.01a1 1 0 1 0 .01 2a1 1 0 0 0 0 -2m5.99 0h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0 -2zm5 -10a4 4 0 0 1 4 4h-20a4 4 0 0 1 4 -4h12z", true, 0f)))

  val Desktop: IconSet
    get() = IconSet(listOf(IconShape("M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10", false, 2f), IconShape("M7 20h10", false, 2f), IconShape("M9 16v4", false, 2f), IconShape("M15 16v4", false, 2f)), listOf(IconShape("M7 21a1 1 0 0 1 0 -2h1v-2h-4a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h16a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-4v2h1a1 1 0 0 1 0 2zm7 -4h-4v2h4z", true, 0f)))

  val DeviceMobile: IconSet
    get() = IconSet(listOf(IconShape("M6 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-14", false, 2f), IconShape("M11 4h2", false, 2f), IconShape("M12 17v.01", false, 2f)), listOf(IconShape("M16 2a3 3 0 0 1 2.995 2.824l.005 .176v14a3 3 0 0 1 -2.824 2.995l-.176 .005h-8a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005h8zm-4 14a1 1 0 0 0 -.993 .883l-.007 .117l.007 .127a1 1 0 0 0 1.986 0l.007 -.117l-.007 -.127a1 1 0 0 0 -.993 -.883zm1 -12h-2l-.117 .007a1 1 0 0 0 0 1.986l.117 .007h2l.117 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z", true, 0f)))

  val DeviceMobileCamera: IconSet
    get() = IconSet(listOf(IconShape("M6 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-14", false, 2f), IconShape("M11 4h2", false, 2f), IconShape("M12 17v.01", false, 2f)), listOf(IconShape("M16 2a3 3 0 0 1 2.995 2.824l.005 .176v14a3 3 0 0 1 -2.824 2.995l-.176 .005h-8a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005h8zm-4 14a1 1 0 0 0 -.993 .883l-.007 .117l.007 .127a1 1 0 0 0 1.986 0l.007 -.117l-.007 -.127a1 1 0 0 0 -.993 -.883zm1 -12h-2l-.117 .007a1 1 0 0 0 0 1.986l.117 .007h2l.117 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z", true, 0f)))

  val DeviceMobileSpeaker: IconSet
    get() = IconSet(listOf(IconShape("M6 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-14", false, 2f), IconShape("M11 4h2", false, 2f), IconShape("M12 17v.01", false, 2f)), listOf(IconShape("M16 2a3 3 0 0 1 2.995 2.824l.005 .176v14a3 3 0 0 1 -2.824 2.995l-.176 .005h-8a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005h8zm-4 14a1 1 0 0 0 -.993 .883l-.007 .117l.007 .127a1 1 0 0 0 1.986 0l.007 -.117l-.007 -.127a1 1 0 0 0 -.993 -.883zm1 -12h-2l-.117 .007a1 1 0 0 0 0 1.986l.117 .007h2l.117 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z", true, 0f)))

  val DeviceTablet: IconSet
    get() = IconSet(listOf(IconShape("M5 4a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v16a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1v-16", false, 2f), IconShape("M11 17a1 1 0 1 0 2 0a1 1 0 0 0 -2 0", false, 2f)), listOf(IconShape("M18 2a2 2 0 0 1 1.995 1.85l.005 .15v16a2 2 0 0 1 -1.85 1.995l-.15 .005h-12a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-16a2 2 0 0 1 1.85 -1.995l.15 -.005h12zm-6 13a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15z", true, 0f)))

  val DotsSixVertical: IconSet
    get() = IconSet(listOf(IconShape("M8 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", false, 2f), IconShape("M8 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", false, 2f), IconShape("M8 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", false, 2f), IconShape("M14 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", false, 2f), IconShape("M14 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", false, 2f), IconShape("M14 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", false, 2f)))

  val DotsThree: IconSet
    get() = IconSet(listOf(IconShape("M4 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", false, 2f), IconShape("M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", false, 2f), IconShape("M18 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", false, 2f)), listOf(IconShape("M7 12a2 2 0 1 1 -4 0q 0 -.053 .005 -.102a1.996 1.996 0 0 1 1.995 -1.898a2 2 0 0 1 2 2", true, 0f), IconShape("M14 12a2 2 0 1 1 -4 0q 0 -.053 .005 -.102a1.996 1.996 0 0 1 1.995 -1.898a2 2 0 0 1 2 2", true, 0f), IconShape("M21 12a2 2 0 1 1 -4 0q 0 -.053 .005 -.102a1.996 1.996 0 0 1 1.995 -1.898a2 2 0 0 1 2 2", true, 0f)))

  val DownloadSimple: IconSet
    get() = IconSet(listOf(IconShape("M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2", false, 2f), IconShape("M7 11l5 5l5 -5", false, 2f), IconShape("M12 4l0 12", false, 2f)), listOf(IconShape("M20 16a1 1 0 0 1 1 1v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-2a1 1 0 0 1 2 0v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1 -1v-2a1 1 0 0 1 1 -1m-8 -13a1 1 0 0 1 1 1v9.585l3.293 -3.292a1 1 0 0 1 1.414 1.414l-5 5a1 1 0 0 1 -.09 .08l.09 -.08a1 1 0 0 1 -.674 .292l-.033 .001h-.032l-.054 -.004l.086 .004a1 1 0 0 1 -.617 -.213a1 1 0 0 1 -.09 -.08l-5 -5a1 1 0 0 1 1.414 -1.414l3.293 3.292v-9.585a1 1 0 0 1 1 -1", true, 0f)))

  val Envelope: IconSet
    get() = IconSet(listOf(IconShape("M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10", false, 2f), IconShape("M3 7l9 6l9 -6", false, 2f)), listOf(IconShape("M22 7.535v9.465a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-9.465l9.445 6.297l.116 .066a1 1 0 0 0 .878 0l.116 -.066l9.445 -6.297z", true, 0f), IconShape("M19 4c1.08 0 2.027 .57 2.555 1.427l-9.555 6.37l-9.555 -6.37a2.999 2.999 0 0 1 2.354 -1.42l.201 -.007h14z", true, 0f)))

  val EnvelopeOpen: IconSet
    get() = IconSet(listOf(IconShape("M3 9l9 6l9 -6l-9 -6l-9 6", false, 2f), IconShape("M21 9v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10", false, 2f), IconShape("M3 19l6 -6", false, 2f), IconShape("M15 13l6 6", false, 2f)), listOf(IconShape("M14.872 14.287l6.522 6.52a2.996 2.996 0 0 1 -2.218 1.188l-.176 .005h-14a2.995 2.995 0 0 1 -2.394 -1.191l6.521 -6.522l2.318 1.545l.116 .066a1 1 0 0 0 .878 0l.116 -.066l2.317 -1.545z", true, 0f), IconShape("M2 9.535l5.429 3.62l-5.429 5.43z", true, 0f), IconShape("M22 9.535v9.05l-5.43 -5.43z", true, 0f), IconShape("M12.44 2.102l.115 .066l8.444 5.629l-8.999 6l-9 -6l8.445 -5.63a1 1 0 0 1 .994 -.065z", true, 0f)))

  val EnvelopeSimple: IconSet
    get() = IconSet(listOf(IconShape("M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10", false, 2f), IconShape("M3 7l9 6l9 -6", false, 2f)), listOf(IconShape("M22 7.535v9.465a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-9.465l9.445 6.297l.116 .066a1 1 0 0 0 .878 0l.116 -.066l9.445 -6.297z", true, 0f), IconShape("M19 4c1.08 0 2.027 .57 2.555 1.427l-9.555 6.37l-9.555 -6.37a2.999 2.999 0 0 1 2.354 -1.42l.201 -.007h14z", true, 0f)))

  val ExclamationMark: IconSet
    get() = IconSet(listOf(IconShape("M12 19v.01", false, 2f), IconShape("M12 15v-10", false, 2f)))

  val Export: IconSet
    get() = IconSet(listOf(IconShape("M8 9h-1a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-8a2 2 0 0 0 -2 -2h-1", false, 2f), IconShape("M12 14v-11", false, 2f), IconShape("M9 6l3 -3l3 3", false, 2f)))

  val File: IconSet
    get() = IconSet(listOf(IconShape("M14 3v4a1 1 0 0 0 1 1h4", false, 2f), IconShape("M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2", false, 2f)), listOf(IconShape("M12 2l.117 .007a1 1 0 0 1 .876 .876l.007 .117v4l.005 .15a2 2 0 0 0 1.838 1.844l.157 .006h4l.117 .007a1 1 0 0 1 .876 .876l.007 .117v9a3 3 0 0 1 -2.824 2.995l-.176 .005h-10a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005h5z", true, 0f), IconShape("M19 7h-4l-.001 -4.001z", true, 0f)))

  val FilePdf: IconSet
    get() = IconSet(listOf(IconShape("M14 3v4a1 1 0 0 0 1 1h4", false, 2f), IconShape("M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4", false, 2f), IconShape("M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6", false, 2f), IconShape("M17 18h2", false, 2f), IconShape("M20 15h-3v6", false, 2f), IconShape("M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1", false, 2f)))

  val FilePlus: IconSet
    get() = IconSet(listOf(IconShape("M14 3v4a1 1 0 0 0 1 1h4", false, 2f), IconShape("M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2", false, 2f), IconShape("M12 11l0 6", false, 2f), IconShape("M9 14l6 0", false, 2f)))

  val FileText: IconSet
    get() = IconSet(listOf(IconShape("M14 3v4a1 1 0 0 0 1 1h4", false, 2f), IconShape("M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2", false, 2f), IconShape("M9 9l1 0", false, 2f), IconShape("M9 13l6 0", false, 2f), IconShape("M9 17l6 0", false, 2f)), listOf(IconShape("M12 2l.117 .007a1 1 0 0 1 .876 .876l.007 .117v4l.005 .15a2 2 0 0 0 1.838 1.844l.157 .006h4l.117 .007a1 1 0 0 1 .876 .876l.007 .117v9a3 3 0 0 1 -2.824 2.995l-.176 .005h-10a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005zm3 14h-6a1 1 0 0 0 0 2h6a1 1 0 0 0 0 -2m0 -4h-6a1 1 0 0 0 0 2h6a1 1 0 0 0 0 -2m-5 -4h-1a1 1 0 1 0 0 2h1a1 1 0 0 0 0 -2", true, 0f), IconShape("M19 7h-4l-.001 -4.001z", true, 0f)))

  val FileTs: IconSet
    get() = IconSet(listOf(IconShape("M14 3v4a1 1 0 0 0 1 1h4", false, 2f), IconShape("M5 12v-7a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-1", false, 2f), IconShape("M14 3v4a1 1 0 0 0 1 1h4", false, 2f), IconShape("M9 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75", false, 2f), IconShape("M3.5 15h3", false, 2f), IconShape("M5 15v6", false, 2f)))

  val FileZip: IconSet
    get() = IconSet(listOf(IconShape("M6 20.735a2 2 0 0 1 -1 -1.735v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-1", false, 2f), IconShape("M11 17a2 2 0 0 1 2 2v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-2a2 2 0 0 1 2 -2", false, 2f), IconShape("M11 5l-1 0", false, 2f), IconShape("M13 7l-1 0", false, 2f), IconShape("M11 9l-1 0", false, 2f), IconShape("M13 11l-1 0", false, 2f), IconShape("M11 13l-1 0", false, 2f), IconShape("M13 15l-1 0", false, 2f)))

  val FilmSlate: IconSet
    get() = IconSet(listOf(IconShape("M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12", false, 2f), IconShape("M8 4l0 16", false, 2f), IconShape("M16 4l0 16", false, 2f), IconShape("M4 8l4 0", false, 2f), IconShape("M4 16l4 0", false, 2f), IconShape("M4 12l16 0", false, 2f), IconShape("M16 8l4 0", false, 2f), IconShape("M16 16l4 0", false, 2f)))

  val Fingerprint: IconSet
    get() = IconSet(listOf(IconShape("M18.9 7a8 8 0 0 1 1.1 5v1a6 6 0 0 0 .8 3", false, 2f), IconShape("M8 11a4 4 0 0 1 8 0v1a10 10 0 0 0 2 6", false, 2f), IconShape("M12 11v2a14 14 0 0 0 2.5 8", false, 2f), IconShape("M8 15a18 18 0 0 0 1.8 6", false, 2f), IconShape("M4.9 19a22 22 0 0 1 -.9 -7v-1a8 8 0 0 1 12 -6.95", false, 2f)))

  val Flag: IconSet
    get() = IconSet(listOf(IconShape("M5 5a5 5 0 0 1 7 0a5 5 0 0 0 7 0v9a5 5 0 0 1 -7 0a5 5 0 0 0 -7 0v-9", false, 2f), IconShape("M5 21v-7", false, 2f)), listOf(IconShape("M4 5a1 1 0 0 1 .3 -.714a6 6 0 0 1 8.213 -.176l.351 .328a4 4 0 0 0 5.272 0l.249 -.227c.61 -.483 1.527 -.097 1.61 .676l.005 .113v9a1 1 0 0 1 -.3 .714a6 6 0 0 1 -8.213 .176l-.351 -.328a4 4 0 0 0 -5.136 -.114v6.552a1 1 0 0 1 -1.993 .117l-.007 -.117v-16z", true, 0f)))

  val Flame: IconSet
    get() = IconSet(listOf(IconShape("M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.294 -2.333 5.588c0 3.704 3.134 6.706 7 6.706c3.866 0 7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235", false, 2f)), listOf(IconShape("M10 2c0 -.88 1.056 -1.331 1.692 -.722c1.958 1.876 3.096 5.995 1.75 9.12l-.08 .174l.012 .003c.625 .133 1.203 -.43 2.303 -2.173l.14 -.224a1 1 0 0 1 1.582 -.153c1.334 1.435 2.601 4.377 2.601 6.27c0 4.265 -3.591 7.705 -8 7.705s-8 -3.44 -8 -7.706c0 -2.252 1.022 -4.716 2.632 -6.301l.605 -.589c.241 -.236 .434 -.43 .618 -.624c1.43 -1.512 2.145 -2.924 2.145 -4.78", true, 0f)))

  val Flashlight: IconSet
    get() = IconSet(listOf(IconShape("M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7", false, 2f), IconShape("M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3", false, 2f), IconShape("M9.7 17l4.6 0", false, 2f)), listOf(IconShape("M4 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z", true, 0f), IconShape("M12 2a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z", true, 0f), IconShape("M21 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z", true, 0f), IconShape("M4.893 4.893a1 1 0 0 1 1.32 -.083l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 0 -1.414z", true, 0f), IconShape("M17.693 4.893a1 1 0 0 1 1.497 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7z", true, 0f), IconShape("M14 18a1 1 0 0 1 1 1a3 3 0 0 1 -6 0a1 1 0 0 1 .883 -.993l.117 -.007h4z", true, 0f), IconShape("M12 6a6 6 0 0 1 3.6 10.8a1 1 0 0 1 -.471 .192l-.129 .008h-6a1 1 0 0 1 -.6 -.2a6 6 0 0 1 3.6 -10.8z", true, 0f)))

  val Flask: IconSet
    get() = IconSet(listOf(IconShape("M9 3l6 0", false, 2f), IconShape("M10 9l4 0", false, 2f), IconShape("M10 3v6l-4 11a.7 .7 0 0 0 .5 1h11a.7 .7 0 0 0 .5 -1l-4 -11v-6", false, 2f)), listOf(IconShape("M15 2a1 1 0 0 1 0 2v4.826l3.932 10.814l.034 .077a1.7 1.7 0 0 1 -.002 1.193l-.07 .162a1.7 1.7 0 0 1 -1.213 .911l-.181 .017h-11l-.181 -.017a1.7 1.7 0 0 1 -1.285 -2.266l.039 -.09l3.927 -10.804v-4.823a1 1 0 1 1 0 -2h6zm-2 2h-2v4h2v-4z", true, 0f)))

  val Folder: IconSet
    get() = IconSet(listOf(IconShape("M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2", false, 2f)), listOf(IconShape("M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z", true, 0f)))

  val FolderOpen: IconSet
    get() = IconSet(listOf(IconShape("M11 19h-6a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2.5", false, 2f), IconShape("M15 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0", false, 2f), IconShape("M20.2 20.2l1.8 1.8", false, 2f)))

  val FolderSimple: IconSet
    get() = IconSet(listOf(IconShape("M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2", false, 2f)), listOf(IconShape("M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z", true, 0f)))

  val Footprints: IconSet
    get() = IconSet(listOf(IconShape("M4 6h5.426a1 1 0 0 1 .863 .496l1.064 1.823a3 3 0 0 0 1.896 1.407l4.677 1.114a4 4 0 0 1 3.074 3.89v2.27a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1", false, 2f), IconShape("M14 13l1 -2", false, 2f), IconShape("M8 18v-1a4 4 0 0 0 -4 -4h-1", false, 2f), IconShape("M10 12l1.5 -3", false, 2f)))

  val ForkKnife: IconSet
    get() = IconSet(listOf(IconShape("M19 3v12h-5c-.023 -3.681 .184 -7.406 5 -12m0 12v6h-1v-3m-10 -14v17m-3 -17v3a3 3 0 1 0 6 0v-3", false, 2f)), listOf(IconShape("M18.94 2.002l.1 -.001l.096 .008l.095 .018l.094 .027l.092 .037l.086 .045l.08 .052l.076 .06l.076 .074l.06 .072l.03 .04l.051 .084l.043 .088l.034 .091l.025 .094l.02 .15l.002 18.059a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1v-1h-4a1 1 0 0 1 -1 -.994c-.033 -5.323 .97 -8.482 5.005 -12.434l.317 -.307l.072 -.06l.04 -.03l.084 -.051l.088 -.043l.091 -.034l.094 -.025zm-7.94 .998a1 1 0 0 1 1 1v3a4 4 0 0 1 -3 3.874v10.126a1 1 0 0 1 -2 0v-10.126a4 4 0 0 1 -3 -3.874v-3a1 1 0 1 1 2 0v3a2 2 0 0 0 1 1.732v-4.732a1 1 0 1 1 2 0l.001 4.732a2 2 0 0 0 .999 -1.732v-3a1 1 0 0 1 1 -1", true, 0f)))

  val Funnel: IconSet
    get() = IconSet(listOf(IconShape("M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227", false, 2f)), listOf(IconShape("M20 3h-16a1 1 0 0 0 -1 1v2.227l.008 .223a3 3 0 0 0 .772 1.795l4.22 4.641v8.114a1 1 0 0 0 1.316 .949l6 -2l.108 -.043a1 1 0 0 0 .576 -.906v-6.586l4.121 -4.12a3 3 0 0 0 .879 -2.123v-2.171a1 1 0 0 0 -1 -1z", true, 0f)))

  val GameController: IconSet
    get() = IconSet(listOf(IconShape("M12 5h3.5a5 5 0 0 1 0 10h-5.5l-4.015 4.227a2.3 2.3 0 0 1 -3.923 -2.035l1.634 -8.173a5 5 0 0 1 4.904 -4.019h3.4", false, 2f), IconShape("M14 15l4.07 4.284a2.3 2.3 0 0 0 3.925 -2.023l-1.6 -8.232", false, 2f), IconShape("M8 9v2", false, 2f), IconShape("M7 10h2", false, 2f), IconShape("M14 10h2", false, 2f)), listOf(IconShape("M15.5 4a6 6 0 0 1 5.945 5.187l1.532 7.883a3.3 3.3 0 0 1 -5.632 2.903l-3.776 -3.974l-3.14 .001l-3.719 3.916a3.3 3.3 0 0 1 -5.629 -2.92l1.634 -8.173a6 6 0 0 1 5.885 -4.823zm-7.5 3a1 1 0 0 0 -1 1v1h-1a1 1 0 1 0 0 2h1v1a1 1 0 0 0 2 0v-1h1a1 1 0 0 0 0 -2h-1v-1a1 1 0 0 0 -1 -1m10 2h-4a1 1 0 0 0 0 2h4a1 1 0 0 0 0 -2", true, 0f)))

  val Gear: IconSet
    get() = IconSet(listOf(IconShape("M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065", false, 2f), IconShape("M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0", false, 2f)), listOf(IconShape("M14.647 4.081a.724 .724 0 0 0 1.08 .448c2.439 -1.485 5.23 1.305 3.745 3.744a.724 .724 0 0 0 .447 1.08c2.775 .673 2.775 4.62 0 5.294a.724 .724 0 0 0 -.448 1.08c1.485 2.439 -1.305 5.23 -3.744 3.745a.724 .724 0 0 0 -1.08 .447c-.673 2.775 -4.62 2.775 -5.294 0a.724 .724 0 0 0 -1.08 -.448c-2.439 1.485 -5.23 -1.305 -3.745 -3.744a.724 .724 0 0 0 -.447 -1.08c-2.775 -.673 -2.775 -4.62 0 -5.294a.724 .724 0 0 0 .448 -1.08c-1.485 -2.439 1.305 -5.23 3.744 -3.745a.722 .722 0 0 0 1.08 -.447c.673 -2.775 4.62 -2.775 5.294 0zm-2.647 4.919a3 3 0 1 0 0 6a3 3 0 0 0 0 -6", true, 0f)))

  val GearSix: IconSet
    get() = IconSet(listOf(IconShape("M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065", false, 2f), IconShape("M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0", false, 2f)), listOf(IconShape("M14.647 4.081a.724 .724 0 0 0 1.08 .448c2.439 -1.485 5.23 1.305 3.745 3.744a.724 .724 0 0 0 .447 1.08c2.775 .673 2.775 4.62 0 5.294a.724 .724 0 0 0 -.448 1.08c1.485 2.439 -1.305 5.23 -3.744 3.745a.724 .724 0 0 0 -1.08 .447c-.673 2.775 -4.62 2.775 -5.294 0a.724 .724 0 0 0 -1.08 -.448c-2.439 1.485 -5.23 -1.305 -3.745 -3.744a.724 .724 0 0 0 -.447 -1.08c-2.775 -.673 -2.775 -4.62 0 -5.294a.724 .724 0 0 0 .448 -1.08c-1.485 -2.439 1.305 -5.23 3.744 -3.745a.722 .722 0 0 0 1.08 -.447c.673 -2.775 4.62 -2.775 5.294 0zm-2.647 4.919a3 3 0 1 0 0 6a3 3 0 0 0 0 -6", true, 0f)))

  val GitBranch: IconSet
    get() = IconSet(listOf(IconShape("M5 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", false, 2f), IconShape("M5 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", false, 2f), IconShape("M15 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", false, 2f), IconShape("M7 8l0 8", false, 2f), IconShape("M9 18h6a2 2 0 0 0 2 -2v-5", false, 2f), IconShape("M14 14l3 -3l3 3", false, 2f)))

  val GitCommit: IconSet
    get() = IconSet(listOf(IconShape("M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0", false, 2f), IconShape("M12 3l0 6", false, 2f), IconShape("M12 15l0 6", false, 2f)))

  val Globe: IconSet
    get() = IconSet(listOf(IconShape("M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0", false, 2f), IconShape("M3.6 9h16.8", false, 2f), IconShape("M3.6 15h16.8", false, 2f), IconShape("M11.5 3a17 17 0 0 0 0 18", false, 2f), IconShape("M12.5 3a17 17 0 0 1 0 18", false, 2f)), listOf(IconShape("M21.165 16a10 10 0 0 1 -8.434 5.973a1 1 0 0 0 .617 -.444a18 18 0 0 0 2.28 -5.528z", true, 0f), IconShape("M8.372 16a18 18 0 0 0 2.28 5.53a1 1 0 0 0 .616 .443a10 10 0 0 1 -8.433 -5.973z", true, 0f), IconShape("M13.57 16a16 16 0 0 1 -1.57 3.884a16 16 0 0 1 -1.57 -3.884", true, 0f), IconShape("M8.034 10a18 18 0 0 0 0 4h-5.832a10 10 0 0 1 -.002 -4z", true, 0f), IconShape("M13.952 10a16 16 0 0 1 0 4h-3.904a16 16 0 0 1 0 -4z", true, 0f), IconShape("M21.8 10a10.05 10.05 0 0 1 -.002 4h-5.832c.149 -1.329 .149 -2.67 0 -4z", true, 0f), IconShape("M11.267 2.027a1 1 0 0 0 -.615 .444a18 18 0 0 0 -2.28 5.529h-5.54a10.01 10.01 0 0 1 8.334 -5.967z", true, 0f), IconShape("M12 4.116a16 16 0 0 1 1.57 3.885h-3.14c.34 -1.317 .85 -2.6 1.53 -3.817z", true, 0f), IconShape("M12.733 2.026a10.01 10.01 0 0 1 8.435 5.974h-5.54a18 18 0 0 0 -2.28 -5.53a1 1 0 0 0 -.517 -.414z", true, 0f)))

  val Handbag: IconSet
    get() = IconSet(listOf(IconShape("M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304", false, 2f), IconShape("M9 11v-5a3 3 0 0 1 6 0v5", false, 2f)))

  val Headphones: IconSet
    get() = IconSet(listOf(IconShape("M4 15a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2l0 -3", false, 2f), IconShape("M15 15a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2l0 -3", false, 2f), IconShape("M4 15v-3a8 8 0 0 1 16 0v3", false, 2f)), listOf(IconShape("M21 18a3 3 0 0 1 -2.824 2.995l-.176 .005h-1a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-3a3 3 0 0 1 2.824 -2.995l.176 -.005h1c.351 0 .688 .06 1 .171v-.171a7 7 0 0 0 -13.996 -.24l-.004 .24v.17c.25 -.088 .516 -.144 .791 -.163l.209 -.007h1a3 3 0 0 1 2.995 2.824l.005 .176v3a3 3 0 0 1 -2.824 2.995l-.176 .005h-1a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-6a9 9 0 0 1 17.996 -.265l.004 .265v6z", true, 0f)))

  val Heart: IconSet
    get() = IconSet(listOf(IconShape("M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572", false, 2f)), listOf(IconShape("M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z", true, 0f)))

  val Hourglass: IconSet
    get() = IconSet(listOf(IconShape("M6.5 7h11", false, 2f), IconShape("M6.5 17h11", false, 2f), IconShape("M6 20v-2a6 6 0 1 1 12 0v2a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1", false, 2f), IconShape("M6 4v2a6 6 0 1 0 12 0v-2a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1", false, 2f)), listOf(IconShape("M17 2a2 2 0 0 1 1.995 1.85l.005 .15v2a6.996 6.996 0 0 1 -3.393 6a6.994 6.994 0 0 1 3.388 5.728l.005 .272v2a2 2 0 0 1 -1.85 1.995l-.15 .005h-10a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-2a6.996 6.996 0 0 1 3.393 -6a6.994 6.994 0 0 1 -3.388 -5.728l-.005 -.272v-2a2 2 0 0 1 1.85 -1.995l.15 -.005h10z", true, 0f)))

  val House: IconSet
    get() = IconSet(listOf(IconShape("M5 12l-2 0l9 -9l9 9l-2 0", false, 2f), IconShape("M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7", false, 2f), IconShape("M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6", false, 2f)), listOf(IconShape("M12.707 2.293l9 9c.63 .63 .184 1.707 -.707 1.707h-1v6a3 3 0 0 1 -3 3h-1v-7a3 3 0 0 0 -2.824 -2.995l-.176 -.005h-2a3 3 0 0 0 -3 3v7h-1a3 3 0 0 1 -3 -3v-6h-1c-.89 0 -1.337 -1.077 -.707 -1.707l9 -9a1 1 0 0 1 1.414 0m.293 11.707a1 1 0 0 1 1 1v7h-4v-7a1 1 0 0 1 .883 -.993l.117 -.007z", true, 0f)))

  val Image: IconSet
    get() = IconSet(listOf(IconShape("M15 8h.01", false, 2f), IconShape("M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12", false, 2f), IconShape("M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5", false, 2f), IconShape("M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3", false, 2f)), listOf(IconShape("M8.813 11.612c.457 -.38 .918 -.38 1.386 .011l.108 .098l4.986 4.986l.094 .083a1 1 0 0 0 1.403 -1.403l-.083 -.094l-1.292 -1.293l.292 -.293l.106 -.095c.457 -.38 .918 -.38 1.386 .011l.108 .098l4.674 4.675a4 4 0 0 1 -3.775 3.599l-.206 .005h-12a4 4 0 0 1 -3.98 -3.603l6.687 -6.69l.106 -.095zm9.187 -9.612a4 4 0 0 1 3.995 3.8l.005 .2v9.585l-3.293 -3.292l-.15 -.137c-1.256 -1.095 -2.85 -1.097 -4.096 -.017l-.154 .14l-.307 .306l-2.293 -2.292l-.15 -.137c-1.256 -1.095 -2.85 -1.097 -4.096 -.017l-.154 .14l-5.307 5.306v-9.585a4 4 0 0 1 3.8 -3.995l.2 -.005h12zm-2.99 5l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z", true, 0f)))

  val Info: IconSet
    get() = IconSet(listOf(IconShape("M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0", false, 2f), IconShape("M12 9h.01", false, 2f), IconShape("M11 12h1v4h1", false, 2f)), listOf(IconShape("M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm0 9h-1l-.117 .007a1 1 0 0 0 0 1.986l.117 .007v3l.007 .117a1 1 0 0 0 .876 .876l.117 .007h1l.117 -.007a1 1 0 0 0 .876 -.876l.007 -.117l-.007 -.117a1 1 0 0 0 -.764 -.857l-.112 -.02l-.117 -.006v-3l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007zm.01 -3l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z", true, 0f)))

  val Key: IconSet
    get() = IconSet(listOf(IconShape("M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0", false, 2f), IconShape("M15 9h.01", false, 2f)), listOf(IconShape("M14.52 2c1.029 0 2.015 .409 2.742 1.136l3.602 3.602a3.877 3.877 0 0 1 0 5.483l-2.643 2.643a3.88 3.88 0 0 1 -4.941 .452l-.105 -.078l-5.882 5.883a3 3 0 0 1 -1.68 .843l-.22 .027l-.221 .009h-1.172c-1.014 0 -1.867 -.759 -1.991 -1.823l-.009 -.177v-1.172c0 -.704 .248 -1.386 .73 -1.96l.149 -.161l.414 -.414a1 1 0 0 1 .707 -.293h1v-1a1 1 0 0 1 .883 -.993l.117 -.007h1v-1a1 1 0 0 1 .206 -.608l.087 -.1l1.468 -1.469l-.076 -.103a3.9 3.9 0 0 1 -.678 -1.963l-.007 -.236c0 -1.029 .409 -2.015 1.136 -2.742l2.643 -2.643a3.88 3.88 0 0 1 2.741 -1.136m.495 5h-.02a2 2 0 1 0 0 4h.02a2 2 0 1 0 0 -4", true, 0f)))

  val Keyboard: IconSet
    get() = IconSet(listOf(IconShape("M2 8a2 2 0 0 1 2 -2h16a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2l0 -8", false, 2f), IconShape("M6 10l0 .01", false, 2f), IconShape("M10 10l0 .01", false, 2f), IconShape("M14 10l0 .01", false, 2f), IconShape("M18 10l0 .01", false, 2f), IconShape("M6 14l0 .01", false, 2f), IconShape("M18 14l0 .01", false, 2f), IconShape("M10 14l4 .01", false, 2f)), listOf(IconShape("M20 5a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-16a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3zm-14 8a1 1 0 0 0 -1 1v.01a1 1 0 0 0 2 0v-.01a1 1 0 0 0 -1 -1m12 0a1 1 0 0 0 -1 1v.01a1 1 0 0 0 2 0v-.01a1 1 0 0 0 -1 -1m-7.998 0a1 1 0 0 0 -.004 2l4 .01a1 1 0 0 0 .005 -2zm-4.002 -4a1 1 0 0 0 -1 1v.01a1 1 0 0 0 2 0v-.01a1 1 0 0 0 -1 -1m4 0a1 1 0 0 0 -1 1v.01a1 1 0 0 0 2 0v-.01a1 1 0 0 0 -1 -1m4 0a1 1 0 0 0 -1 1v.01a1 1 0 0 0 2 0v-.01a1 1 0 0 0 -1 -1m4 0a1 1 0 0 0 -1 1v.01a1 1 0 0 0 2 0v-.01a1 1 0 0 0 -1 -1", true, 0f)))

  val Laptop: IconSet
    get() = IconSet(listOf(IconShape("M3 19l18 0", false, 2f), IconShape("M5 7a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1l0 -8", false, 2f)))

  val Link: IconSet
    get() = IconSet(listOf(IconShape("M9 15l6 -6", false, 2f), IconShape("M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464", false, 2f), IconShape("M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463", false, 2f)), listOf(IconShape("M15.707 8.293a1 1 0 0 1 0 1.414l-6 6a1 1 0 1 1 -1.414 -1.414l6 -6a1 1 0 0 1 1.414 0", true, 0f), IconShape("M19.242 4.757c2.343 2.344 2.342 6.143 -.052 8.534l-.534 .464a1 1 0 1 1 -1.312 -1.51l.483 -.416a4 4 0 0 0 0 -5.657c-1.562 -1.563 -4.095 -1.563 -5.607 -.054l-.463 .536a1 1 0 1 1 -1.514 -1.308l.513 -.59a6 6 0 0 1 8.486 .001", true, 0f), IconShape("M6.75 10.338a1 1 0 0 1 -.088 1.411l-.483 .425a3.97 3.97 0 0 0 0 5.649a4.064 4.064 0 0 0 5.678 .038l.34 -.458a1 1 0 1 1 1.606 1.194l-.397 .534l-.1 .114a6.07 6.07 0 0 1 -8.533 0a5.97 5.97 0 0 1 -1.773 -4.247c0 -1.595 .638 -3.124 1.814 -4.284l.524 -.463a1 1 0 0 1 1.411 .087", true, 0f)))

  val List: IconSet
    get() = IconSet(listOf(IconShape("M4 6l16 0", false, 2f), IconShape("M4 12l16 0", false, 2f), IconShape("M4 18l16 0", false, 2f)), listOf(IconShape("M21 6a1 1 0 0 1 -1 1h-16a1 1 0 1 1 0 -2h16a1 1 0 0 1 1 1", true, 0f), IconShape("M21 12a1 1 0 0 1 -1 1h-16a1 1 0 0 1 0 -2h16a1 1 0 0 1 1 1", true, 0f), IconShape("M21 18a1 1 0 0 1 -1 1h-16a1 1 0 0 1 0 -2h16a1 1 0 0 1 1 1", true, 0f)))

  val ListChecks: IconSet
    get() = IconSet(listOf(IconShape("M3.5 5.5l1.5 1.5l2.5 -2.5", false, 2f), IconShape("M3.5 11.5l1.5 1.5l2.5 -2.5", false, 2f), IconShape("M3.5 17.5l1.5 1.5l2.5 -2.5", false, 2f), IconShape("M11 6l9 0", false, 2f), IconShape("M11 12l9 0", false, 2f), IconShape("M11 18l9 0", false, 2f)), listOf(IconShape("M8.207 3.793a1 1 0 0 1 0 1.414l-2.5 2.5a1 1 0 0 1 -1.414 0l-1.5 -1.5a1 1 0 0 1 1.414 -1.414l.793 .793l1.793 -1.793a1 1 0 0 1 1.414 0", true, 0f), IconShape("M8.207 9.793a1 1 0 0 1 0 1.414l-2.5 2.5a1 1 0 0 1 -1.414 0l-1.5 -1.5a1 1 0 0 1 1.414 -1.414l.793 .793l1.793 -1.793a1 1 0 0 1 1.414 0", true, 0f), IconShape("M8.207 15.793a1 1 0 0 1 0 1.414l-2.5 2.5a1 1 0 0 1 -1.414 0l-1.5 -1.5a1 1 0 0 1 1.414 -1.414l.793 .793l1.793 -1.793a1 1 0 0 1 1.414 0", true, 0f), IconShape("M21 6a1 1 0 0 1 -1 1h-9a1 1 0 0 1 0 -2h9a1 1 0 0 1 1 1", true, 0f), IconShape("M21 12a1 1 0 0 1 -1 1h-9a1 1 0 0 1 0 -2h9a1 1 0 0 1 1 1", true, 0f), IconShape("M21 18a1 1 0 0 1 -1 1h-9a1 1 0 0 1 0 -2h9a1 1 0 0 1 1 1", true, 0f)))

  val ListDashes: IconSet
    get() = IconSet(listOf(IconShape("M13 5h8", false, 2f), IconShape("M13 9h5", false, 2f), IconShape("M13 15h8", false, 2f), IconShape("M13 19h5", false, 2f), IconShape("M3 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4", false, 2f), IconShape("M3 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4", false, 2f)), listOf(IconShape("M22 5a1 1 0 0 1 -1 1h-8a1 1 0 0 1 0 -2h8a1 1 0 0 1 1 1m-3 4a1 1 0 0 1 -1 1h-5a1 1 0 0 1 0 -2h5a1 1 0 0 1 1 1m3 6a1 1 0 0 1 -1 1h-8a1 1 0 0 1 0 -2h8a1 1 0 0 1 1 1m-3 4a1 1 0 0 1 -1 1h-5a1 1 0 0 1 0 -2h5a1 1 0 0 1 1 1m-11 -16a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2l.001 -4.051l.004 -.051a1.996 1.996 0 0 1 1.995 -1.898zm0 10a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2l.001 -4.051l.004 -.051a1.996 1.996 0 0 1 1.995 -1.898z", true, 0f)))

  val ListPlus: IconSet
    get() = IconSet(listOf(IconShape("M19 8h-14", false, 2f), IconShape("M5 12h9", false, 2f), IconShape("M11 16h-6", false, 2f), IconShape("M15 16h6", false, 2f), IconShape("M18 13v6", false, 2f)))

  val Lock: IconSet
    get() = IconSet(listOf(IconShape("M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6", false, 2f), IconShape("M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0", false, 2f), IconShape("M8 11v-4a4 4 0 1 1 8 0v4", false, 2f)), listOf(IconShape("M12 2a5 5 0 0 1 5 5v3a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-6a3 3 0 0 1 3 -3v-3a5 5 0 0 1 5 -5m0 12a2 2 0 0 0 -1.995 1.85l-.005 .15a2 2 0 1 0 2 -2m0 -10a3 3 0 0 0 -3 3v3h6v-3a3 3 0 0 0 -3 -3", true, 0f)))

  val LockSimple: IconSet
    get() = IconSet(listOf(IconShape("M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6", false, 2f), IconShape("M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0", false, 2f), IconShape("M8 11v-4a4 4 0 1 1 8 0v4", false, 2f)), listOf(IconShape("M12 2a5 5 0 0 1 5 5v3a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-6a3 3 0 0 1 3 -3v-3a5 5 0 0 1 5 -5m0 12a2 2 0 0 0 -1.995 1.85l-.005 .15a2 2 0 1 0 2 -2m0 -10a3 3 0 0 0 -3 3v3h6v-3a3 3 0 0 0 -3 -3", true, 0f)))

  val MagnifyingGlass: IconSet
    get() = IconSet(listOf(IconShape("M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0", false, 2f), IconShape("M21 21l-6 -6", false, 2f)), listOf(IconShape("M14 3.072a8 8 0 0 1 2.32 11.834l5.387 5.387a1 1 0 0 1 -1.414 1.414l-5.388 -5.387a8 8 0 1 1 -.905 -13.249", true, 0f)))

  val MapPin: IconSet
    get() = IconSet(listOf(IconShape("M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0", false, 2f), IconShape("M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0", false, 2f)), listOf(IconShape("M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6", true, 0f)))

  val MapTrifold: IconSet
    get() = IconSet(listOf(IconShape("M3 7l6 -3l6 3l6 -3v13l-6 3l-6 -3l-6 3v-13", false, 2f), IconShape("M9 4v13", false, 2f), IconShape("M15 7v13", false, 2f)))

  val Microphone: IconSet
    get() = IconSet(listOf(IconShape("M9 5a3 3 0 0 1 3 -3a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3a3 3 0 0 1 -3 -3l0 -5", false, 2f), IconShape("M5 10a7 7 0 0 0 14 0", false, 2f), IconShape("M8 21l8 0", false, 2f), IconShape("M12 17l0 4", false, 2f)), listOf(IconShape("M19 9a1 1 0 0 1 1 1a8 8 0 0 1 -6.999 7.938l-.001 2.062h3a1 1 0 0 1 0 2h-8a1 1 0 0 1 0 -2h3v-2.062a8 8 0 0 1 -7 -7.938a1 1 0 1 1 2 0a6 6 0 0 0 12 0a1 1 0 0 1 1 -1m-7 -8a4 4 0 0 1 4 4v5a4 4 0 1 1 -8 0v-5a4 4 0 0 1 4 -4", true, 0f)))

  val Minus: IconSet
    get() = IconSet(listOf(IconShape("M5 12l14 0", false, 2f)))

  val Moon: IconSet
    get() = IconSet(listOf(IconShape("M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008", false, 2f)), listOf(IconShape("M12 1.992a10 10 0 1 0 9.236 13.838c.341 -.82 -.476 -1.644 -1.298 -1.31a6.5 6.5 0 0 1 -6.864 -10.787l.077 -.08c.551 -.63 .113 -1.653 -.758 -1.653h-.266l-.068 -.006l-.06 -.002z", true, 0f)))

  val MusicNote: IconSet
    get() = IconSet(listOf(IconShape("M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0", false, 2f), IconShape("M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0", false, 2f), IconShape("M9 17v-13h10v13", false, 2f), IconShape("M9 8h10", false, 2f)))

  val MusicNotes: IconSet
    get() = IconSet(listOf(IconShape("M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0", false, 2f), IconShape("M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0", false, 2f), IconShape("M9 17v-13h10v13", false, 2f), IconShape("M9 8h10", false, 2f)))

  val NavigationArrow: IconSet
    get() = IconSet(listOf(IconShape("M12 18.5l7.265 2.463c.196 .077 .42 .032 .57 -.116a.548 .548 0 0 0 .134 -.572l-7.969 -17.275l-7.97 17.275c-.07 .2 -.017 .424 .135 .572c.15 .148 .374 .193 .57 .116l7.265 -2.463", false, 2f)), listOf(IconShape("M11.092 2.581a1 1 0 0 1 1.754 -.116l.062 .116l8.005 17.365c.198 .566 .05 1.196 -.378 1.615a1.53 1.53 0 0 1 -1.459 .393l-7.077 -2.398l-6.899 2.338a1.535 1.535 0 0 1 -1.52 -.231l-.112 -.1c-.398 -.386 -.556 -.954 -.393 -1.556l.047 -.15l7.97 -17.276z", true, 0f)))

  val Newspaper: IconSet
    get() = IconSet(listOf(IconShape("M16 6h3a1 1 0 0 1 1 1v11a2 2 0 0 1 -4 0v-13a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1v12a3 3 0 0 0 3 3h11", false, 2f), IconShape("M8 8l4 0", false, 2f), IconShape("M8 12l4 0", false, 2f), IconShape("M8 16l4 0", false, 2f)))

  val NotePencil: IconSet
    get() = IconSet(listOf(IconShape("M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1", false, 2f), IconShape("M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415", false, 2f), IconShape("M16 5l3 3", false, 2f)), listOf(IconShape("M8 7a1 1 0 0 1 -1 1h-1a1 1 0 0 0 -1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1 -1v-1a1 1 0 0 1 2 0v1a3 3 0 0 1 -3 3h-9a3 3 0 0 1 -3 -3v-9a3 3 0 0 1 3 -3h1a1 1 0 0 1 1 1", true, 0f), IconShape("M14.596 5.011l4.392 4.392l-6.28 6.303a1 1 0 0 1 -.708 .294h-3a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 .294 -.708zm6.496 -2.103a3.097 3.097 0 0 1 .165 4.203l-.164 .18l-.693 .694l-4.387 -4.387l.695 -.69a3.1 3.1 0 0 1 4.384 0", true, 0f)))

  val Package: IconSet
    get() = IconSet(listOf(IconShape("M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5", false, 2f), IconShape("M12 12l8 -4.5", false, 2f), IconShape("M12 12l0 9", false, 2f), IconShape("M12 12l-8 -4.5", false, 2f), IconShape("M16 5.25l-8 4.5", false, 2f)))

  val Palette: IconSet
    get() = IconSet(listOf(IconShape("M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25", false, 2f), IconShape("M7.5 10.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", false, 2f), IconShape("M11.5 7.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", false, 2f), IconShape("M15.5 10.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", false, 2f)), listOf(IconShape("M12 2c5.498 0 10 4.002 10 9c0 1.351 -.6 2.64 -1.654 3.576c-1.03 .914 -2.412 1.424 -3.846 1.424h-2.516a1 1 0 0 0 -.5 1.875a1 1 0 0 1 .194 .14a2.3 2.3 0 0 1 -1.597 3.99l-.156 -.009l.068 .004l-.273 -.004c-5.3 -.146 -9.57 -4.416 -9.716 -9.716l-.004 -.28c0 -5.523 4.477 -10 10 -10m-3.5 6.5a2 2 0 0 0 -1.995 1.85l-.005 .15a2 2 0 1 0 2 -2m8 0a2 2 0 0 0 -1.995 1.85l-.005 .15a2 2 0 1 0 2 -2m-4 -3a2 2 0 0 0 -1.995 1.85l-.005 .15a2 2 0 1 0 2 -2", true, 0f)))

  val PaperPlaneTilt: IconSet
    get() = IconSet(listOf(IconShape("M10 14l11 -11", false, 2f), IconShape("M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5", false, 2f)), listOf(IconShape("M21.864 3.549l-6.454 17.868a1.55 1.55 0 0 1 -1.41 .903a1.54 1.54 0 0 1 -1.394 -.874l-2.88 -5.759zm-1.414 -1.414l-12.139 12.138l-5.728 -2.864a1.55 1.55 0 0 1 -.903 -1.409c0 -.606 .353 -1.157 .981 -1.44z", true, 0f)))

  val Path: IconSet
    get() = IconSet(listOf(IconShape("M3 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0", false, 2f), IconShape("M19 7a2 2 0 1 0 0 -4a2 2 0 0 0 0 4", false, 2f), IconShape("M11 19h5.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h4.5", false, 2f)))

  val Pause: IconSet
    get() = IconSet(listOf(IconShape("M6 6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -12", false, 2f), IconShape("M14 6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -12", false, 2f)), listOf(IconShape("M9 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z", true, 0f), IconShape("M17 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z", true, 0f)))

  val PencilSimple: IconSet
    get() = IconSet(listOf(IconShape("M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4", false, 2f), IconShape("M13.5 6.5l4 4", false, 2f)), listOf(IconShape("M12.085 6.5l5.415 5.415l-8.793 8.792a1 1 0 0 1 -.707 .293h-4a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 .293 -.707zm5.406 -2.698a3.828 3.828 0 0 1 1.716 6.405l-.292 .293l-5.415 -5.415l.293 -.292a3.83 3.83 0 0 1 3.698 -.991", true, 0f)))

  val Play: IconSet
    get() = IconSet(listOf(IconShape("M7 4v16l13 -8l-13 -8", false, 2f)), listOf(IconShape("M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z", true, 0f)))

  val Plug: IconSet
    get() = IconSet(listOf(IconShape("M9.785 6l8.215 8.215l-2.054 2.054a5.81 5.81 0 1 1 -8.215 -8.215l2.054 -2.054", false, 2f), IconShape("M4 20l3.5 -3.5", false, 2f), IconShape("M15 4l-3.5 3.5", false, 2f), IconShape("M20 9l-3.5 3.5", false, 2f)))

  val Plus: IconSet
    get() = IconSet(listOf(IconShape("M12 5l0 14", false, 2f), IconShape("M5 12l14 0", false, 2f)), listOf(IconShape("M12 4a1 1 0 0 1 1 1v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1 -2 0v-6h-6a1 1 0 0 1 0 -2h6v-6a1 1 0 0 1 1 -1", true, 0f)))

  val PushPin: IconSet
    get() = IconSet(listOf(IconShape("M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4", false, 2f), IconShape("M9 15l-4.5 4.5", false, 2f), IconShape("M14.5 4l5.5 5.5", false, 2f)), listOf(IconShape("M15.113 3.21l.094 .083l5.5 5.5a1 1 0 0 1 -1.175 1.59l-3.172 3.171l-1.424 3.797a1 1 0 0 1 -.158 .277l-.07 .08l-1.5 1.5a1 1 0 0 1 -1.32 .082l-.095 -.083l-2.793 -2.792l-3.793 3.792a1 1 0 0 1 -1.497 -1.32l.083 -.094l3.792 -3.793l-2.792 -2.793a1 1 0 0 1 -.083 -1.32l.083 -.094l1.5 -1.5a1 1 0 0 1 .258 -.187l.098 -.042l3.796 -1.425l3.171 -3.17a1 1 0 0 1 1.497 -1.26z", true, 0f)))

  val QrCode: IconSet
    get() = IconSet(listOf(IconShape("M4 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4", false, 2f), IconShape("M7 17l0 .01", false, 2f), IconShape("M14 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4", false, 2f), IconShape("M7 7l0 .01", false, 2f), IconShape("M4 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4", false, 2f), IconShape("M17 7l0 .01", false, 2f), IconShape("M14 14l3 0", false, 2f), IconShape("M20 14l0 .01", false, 2f), IconShape("M14 14l0 3", false, 2f), IconShape("M14 20l3 0", false, 2f), IconShape("M17 17l3 0", false, 2f), IconShape("M20 17l0 3", false, 2f)))

  val Record: IconSet
    get() = IconSet(listOf(IconShape("M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", false, 2f), IconShape("M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0", false, 2f)), listOf(IconShape("M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-5 6.66a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15z", true, 0f)))

  val Robot: IconSet
    get() = IconSet(listOf(IconShape("M6 6a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2l0 -4", false, 2f), IconShape("M12 2v2", false, 2f), IconShape("M9 12v9", false, 2f), IconShape("M15 12v9", false, 2f), IconShape("M5 16l4 -2", false, 2f), IconShape("M15 14l4 2", false, 2f), IconShape("M9 18h6", false, 2f), IconShape("M10 8v.01", false, 2f), IconShape("M14 8v.01", false, 2f)))

  val ScanSmiley: IconSet
    get() = IconSet(listOf(IconShape("M4 8v-2a2 2 0 0 1 2 -2h2", false, 2f), IconShape("M4 16v2a2 2 0 0 0 2 2h2", false, 2f), IconShape("M16 4h2a2 2 0 0 1 2 2v2", false, 2f), IconShape("M16 20h2a2 2 0 0 0 2 -2v-2", false, 2f), IconShape("M9 10l.01 0", false, 2f), IconShape("M15 10l.01 0", false, 2f), IconShape("M9.5 15a3.5 3.5 0 0 0 5 0", false, 2f)))

  val Scissors: IconSet
    get() = IconSet(listOf(IconShape("M4 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0", false, 2f), IconShape("M14 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0", false, 2f), IconShape("M9.15 14.85l8.85 -10.85", false, 2f), IconShape("M6 4l8.85 10.85", false, 2f)))

  val SealCheck: IconSet
    get() = IconSet(listOf(IconShape("M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1", false, 2f), IconShape("M9 12l2 2l4 -4", false, 2f)), listOf(IconShape("M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z", true, 0f)))

  val Share: IconSet
    get() = IconSet(listOf(IconShape("M8 9h-1a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-8a2 2 0 0 0 -2 -2h-1", false, 2f), IconShape("M12 14v-11", false, 2f), IconShape("M9 6l3 -3l3 3", false, 2f)))

  val ShareNetwork: IconSet
    get() = IconSet(listOf(IconShape("M3 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0", false, 2f), IconShape("M15 6a3 3 0 1 0 6 0a3 3 0 1 0 -6 0", false, 2f), IconShape("M15 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0", false, 2f), IconShape("M8.7 10.7l6.6 -3.4", false, 2f), IconShape("M8.7 13.3l6.6 3.4", false, 2f)))

  val Shield: IconSet
    get() = IconSet(listOf(IconShape("M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3", false, 2f)), listOf(IconShape("M11.884 2.007l.114 -.007l.118 .007l.059 .008l.061 .013l.111 .034a.993 .993 0 0 1 .217 .112l.104 .082l.255 .218a11 11 0 0 0 7.189 2.537l.342 -.01a1 1 0 0 1 1.005 .717a13 13 0 0 1 -9.208 16.25a1 1 0 0 1 -.502 0a13 13 0 0 1 -9.209 -16.25a1 1 0 0 1 1.005 -.717a11 11 0 0 0 7.531 -2.527l.263 -.225l.096 -.075a.993 .993 0 0 1 .217 -.112l.112 -.034a.97 .97 0 0 1 .119 -.021z", true, 0f)))

  val ShieldCheck: IconSet
    get() = IconSet(listOf(IconShape("M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06", false, 2f), IconShape("M15 19l2 2l4 -4", false, 2f)), listOf(IconShape("M11.998 2l.118 .007l.059 .008l.061 .013l.111 .034a.993 .993 0 0 1 .217 .112l.104 .082l.255 .218a11 11 0 0 0 7.189 2.537l.342 -.01a1 1 0 0 1 1.005 .717a13 13 0 0 1 -9.208 16.25a1 1 0 0 1 -.502 0a13 13 0 0 1 -9.209 -16.25a1 1 0 0 1 1.005 -.717a11 11 0 0 0 7.531 -2.527l.263 -.225l.096 -.075a.993 .993 0 0 1 .217 -.112l.112 -.034a.97 .97 0 0 1 .119 -.021l.115 -.007zm3.71 7.293a1 1 0 0 0 -1.415 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z", true, 0f)))

  val ShieldWarning: IconSet
    get() = IconSet(listOf(IconShape("M15.04 19.745c-.942 .551 -1.964 .976 -3.04 1.255a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 .195 6.015", false, 2f), IconShape("M19 16v3", false, 2f), IconShape("M19 22v.01", false, 2f)))

  val SignOut: IconSet
    get() = IconSet(listOf(IconShape("M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2", false, 2f), IconShape("M9 12h12l-3 -3", false, 2f), IconShape("M18 15l3 -3", false, 2f)))

  val Sparkle: IconSet
    get() = IconSet(listOf(IconShape("M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2m0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2m-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6", false, 2f)), listOf(IconShape("M16 19a1 1 0 0 1 0 -2a1 1 0 0 0 1 -1c0 -1.333 2 -1.333 2 0a1 1 0 0 0 1 1c1.333 0 1.333 2 0 2a1 1 0 0 0 -1 1c0 1.333 -2 1.333 -2 0a1 1 0 0 0 -1 -1", true, 0f), IconShape("M3 11a5 5 0 0 0 5 -5c0 -1.333 2 -1.333 2 0a5 5 0 0 0 5 5c1.333 0 1.333 2 0 2a5 5 0 0 0 -5 5a1 1 0 0 1 -2 0a5 5 0 0 0 -5 -5c-1.333 0 -1.333 -2 0 -2", true, 0f), IconShape("M16 7a1 1 0 0 1 0 -2a1 1 0 0 0 1 -1c0 -1.333 2 -1.333 2 0a1 1 0 0 0 1 1c1.333 0 1.333 2 0 2a1 1 0 0 0 -1 1c0 1.333 -2 1.333 -2 0a1 1 0 0 0 -1 -1", true, 0f)))

  val SpeakerHigh: IconSet
    get() = IconSet(listOf(IconShape("M15 8a5 5 0 0 1 0 8", false, 2f), IconShape("M17.7 5a9 9 0 0 1 0 14", false, 2f), IconShape("M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5", false, 2f)))

  val SquaresFour: IconSet
    get() = IconSet(listOf(IconShape("M4 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4", false, 2f), IconShape("M14 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4", false, 2f), IconShape("M4 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4", false, 2f), IconShape("M14 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4", false, 2f)), listOf(IconShape("M9 3a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2z", true, 0f), IconShape("M19 3a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2z", true, 0f), IconShape("M9 13a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2z", true, 0f), IconShape("M19 13a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2z", true, 0f)))

  val Star: IconSet
    get() = IconSet(listOf(IconShape("M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245", false, 2f)), listOf(IconShape("M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z", true, 0f)))

  val Storefront: IconSet
    get() = IconSet(listOf(IconShape("M3 21l18 0", false, 2f), IconShape("M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4", false, 2f), IconShape("M5 21l0 -10.15", false, 2f), IconShape("M19 21l0 -10.15", false, 2f), IconShape("M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4", false, 2f)))

  val Sun: IconSet
    get() = IconSet(listOf(IconShape("M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0", false, 2f), IconShape("M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7", false, 2f)), listOf(IconShape("M12 19a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z", true, 0f), IconShape("M18.313 16.91l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 1.218 -1.567l.102 .07z", true, 0f), IconShape("M7.007 16.993a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7a1 1 0 0 1 1.414 0z", true, 0f), IconShape("M4 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z", true, 0f), IconShape("M21 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z", true, 0f), IconShape("M6.213 4.81l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 1.217 -1.567l.102 .07z", true, 0f), IconShape("M19.107 4.893a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7a1 1 0 0 1 1.414 0z", true, 0f), IconShape("M12 2a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z", true, 0f), IconShape("M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z", true, 0f)))

  val Tag: IconSet
    get() = IconSet(listOf(IconShape("M6.5 7.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", false, 2f), IconShape("M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3", false, 2f)), listOf(IconShape("M11.172 2a3 3 0 0 1 2.121 .879l7.71 7.71a3.41 3.41 0 0 1 0 4.822l-5.592 5.592a3.41 3.41 0 0 1 -4.822 0l-7.71 -7.71a3 3 0 0 1 -.879 -2.121v-5.172a4 4 0 0 1 4 -4zm-3.672 3.5a2 2 0 0 0 -1.995 1.85l-.005 .15a2 2 0 1 0 2 -2", true, 0f)))

  val Television: IconSet
    get() = IconSet(listOf(IconShape("M3 9a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -9", false, 2f), IconShape("M16 3l-4 4l-4 -4", false, 2f)), listOf(IconShape("M8.707 2.293l3.293 3.292l3.293 -3.292a1 1 0 0 1 1.32 -.083l.094 .083a1 1 0 0 1 0 1.414l-2.293 2.293h4.586a3 3 0 0 1 3 3v9a3 3 0 0 1 -3 3h-14a3 3 0 0 1 -3 -3v-9a3 3 0 0 1 3 -3h4.585l-2.292 -2.293a1 1 0 0 1 1.414 -1.414", true, 0f)))

  val Terminal: IconSet
    get() = IconSet(listOf(IconShape("M5 7l5 5l-5 5", false, 2f), IconShape("M12 19l7 0", false, 2f)))

  val TextAlignCenter: IconSet
    get() = IconSet(listOf(IconShape("M4 6l16 0", false, 2f), IconShape("M8 12l8 0", false, 2f), IconShape("M6 18l12 0", false, 2f)))

  val TextAlignLeft: IconSet
    get() = IconSet(listOf(IconShape("M4 6l16 0", false, 2f), IconShape("M4 12l10 0", false, 2f), IconShape("M4 18l14 0", false, 2f)))

  val TextAlignRight: IconSet
    get() = IconSet(listOf(IconShape("M4 6l16 0", false, 2f), IconShape("M10 12l10 0", false, 2f), IconShape("M6 18l14 0", false, 2f)))

  val TextB: IconSet
    get() = IconSet(listOf(IconShape("M7 5h6a3.5 3.5 0 0 1 0 7h-6l0 -7", false, 2f), IconShape("M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7", false, 2f)))

  val TextItalic: IconSet
    get() = IconSet(listOf(IconShape("M11 5l6 0", false, 2f), IconShape("M7 19l6 0", false, 2f), IconShape("M14 5l-4 14", false, 2f)))

  val TextUnderline: IconSet
    get() = IconSet(listOf(IconShape("M7 5v5a5 5 0 0 0 10 0v-5", false, 2f), IconShape("M5 19h14", false, 2f)))

  val ThumbsDown: IconSet
    get() = IconSet(listOf(IconShape("M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3", false, 2f)), listOf(IconShape("M13 21.008a3 3 0 0 0 2.995 -2.823l.005 -.177v-4h2a3 3 0 0 0 2.98 -2.65l.015 -.173l.005 -.177l-.02 -.196l-1.006 -5.032c-.381 -1.625 -1.502 -2.796 -2.81 -2.78l-.164 .008h-8a1 1 0 0 0 -.993 .884l-.007 .116l.001 9.536a1 1 0 0 0 .5 .866a2.998 2.998 0 0 1 1.492 2.396l.007 .202v1a3 3 0 0 0 3 3z", true, 0f), IconShape("M5 14.008a1 1 0 0 0 .993 -.883l.007 -.117v-9a1 1 0 0 0 -.883 -.993l-.117 -.007h-1a2 2 0 0 0 -1.995 1.852l-.005 .15v7a2 2 0 0 0 1.85 1.994l.15 .005h1z", true, 0f)))

  val ThumbsUp: IconSet
    get() = IconSet(listOf(IconShape("M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3", false, 2f)), listOf(IconShape("M13 3a3 3 0 0 1 2.995 2.824l.005 .176v4h2a3 3 0 0 1 2.98 2.65l.015 .174l.005 .176l-.02 .196l-1.006 5.032c-.381 1.626 -1.502 2.796 -2.81 2.78l-.164 -.008h-8a1 1 0 0 1 -.993 -.883l-.007 -.117l.001 -9.536a1 1 0 0 1 .5 -.865a2.998 2.998 0 0 0 1.492 -2.397l.007 -.202v-1a3 3 0 0 1 3 -3z", true, 0f), IconShape("M5 10a1 1 0 0 1 .993 .883l.007 .117v9a1 1 0 0 1 -.883 .993l-.117 .007h-1a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-7a2 2 0 0 1 1.85 -1.995l.15 -.005h1z", true, 0f)))

  val Timer: IconSet
    get() = IconSet(listOf(IconShape("M6.5 7h11", false, 2f), IconShape("M6 20v-2a6 6 0 1 1 12 0v2a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1", false, 2f), IconShape("M6 4v2a6 6 0 1 0 12 0v-2a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1", false, 2f)))

  val Trash: IconSet
    get() = IconSet(listOf(IconShape("M4 7l16 0", false, 2f), IconShape("M10 11l0 6", false, 2f), IconShape("M14 11l0 6", false, 2f), IconShape("M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12", false, 2f), IconShape("M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3", false, 2f)), listOf(IconShape("M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007zm-10 4a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1m4 0a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1", true, 0f), IconShape("M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005z", true, 0f)))

  val Tray: IconSet
    get() = IconSet(listOf(IconShape("M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12", false, 2f), IconShape("M4 13h3l3 3h4l3 -3h3", false, 2f)))

  val UploadSimple: IconSet
    get() = IconSet(listOf(IconShape("M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2", false, 2f), IconShape("M7 9l5 -5l5 5", false, 2f), IconShape("M12 4l0 12", false, 2f)))

  val User: IconSet
    get() = IconSet(listOf(IconShape("M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0", false, 2f), IconShape("M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2", false, 2f)), listOf(IconShape("M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z", true, 0f), IconShape("M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z", true, 0f)))

  val UserCircleMinus: IconSet
    get() = IconSet(listOf(IconShape("M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0", false, 2f), IconShape("M6 21v-2a4 4 0 0 1 4 -4h4c.348 0 .686 .045 1.009 .128", false, 2f), IconShape("M16 19h6", false, 2f)))

  val UserFocus: IconSet
    get() = IconSet(listOf(IconShape("M4 8v-2a2 2 0 0 1 2 -2h2", false, 2f), IconShape("M4 16v2a2 2 0 0 0 2 2h2", false, 2f), IconShape("M16 4h2a2 2 0 0 1 2 2v2", false, 2f), IconShape("M16 20h2a2 2 0 0 0 2 -2v-2", false, 2f), IconShape("M9 10l.01 0", false, 2f), IconShape("M15 10l.01 0", false, 2f), IconShape("M9.5 15a3.5 3.5 0 0 0 5 0", false, 2f)))

  val UserPlus: IconSet
    get() = IconSet(listOf(IconShape("M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0", false, 2f), IconShape("M16 19h6", false, 2f), IconShape("M19 16v6", false, 2f), IconShape("M6 21v-2a4 4 0 0 1 4 -4h4", false, 2f)))

  val Users: IconSet
    get() = IconSet(listOf(IconShape("M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0", false, 2f), IconShape("M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2", false, 2f), IconShape("M16 3.13a4 4 0 0 1 0 7.75", false, 2f), IconShape("M21 21v-2a4 4 0 0 0 -3 -3.85", false, 2f)))

  val VideoCamera: IconSet
    get() = IconSet(listOf(IconShape("M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4", false, 2f), IconShape("M3 8a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2l0 -8", false, 2f)), listOf(IconShape("M20.117 7.625a1 1 0 0 0 -.564 .1l-4.553 2.275v4l4.553 2.275a1 1 0 0 0 1.447 -.892v-6.766a1 1 0 0 0 -.883 -.992z", true, 0f), IconShape("M5 5c-1.645 0 -3 1.355 -3 3v8c0 1.645 1.355 3 3 3h8c1.645 0 3 -1.355 3 -3v-8c0 -1.645 -1.355 -3 -3 -3z", true, 0f)))

  val Wallet: IconSet
    get() = IconSet(listOf(IconShape("M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12", false, 2f), IconShape("M20 12v4h-4a2 2 0 0 1 0 -4h4", false, 2f)))

  val Warning: IconSet
    get() = IconSet(listOf(IconShape("M12 9v4", false, 2f), IconShape("M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0", false, 2f), IconShape("M12 16h.01", false, 2f)), listOf(IconShape("M12 1.67c.955 0 1.845 .467 2.39 1.247l.105 .16l8.114 13.548a2.914 2.914 0 0 1 -2.307 4.363l-.195 .008h-16.225a2.914 2.914 0 0 1 -2.582 -4.2l.099 -.185l8.11 -13.538a2.914 2.914 0 0 1 2.491 -1.403zm.01 13.33l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -7a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z", true, 0f)))

  val WarningCircle: IconSet
    get() = IconSet(listOf(IconShape("M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0", false, 2f), IconShape("M12 8v4", false, 2f), IconShape("M12 16h.01", false, 2f)), listOf(IconShape("M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm.01 13l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z", true, 0f)))

  val Watch: IconSet
    get() = IconSet(listOf(IconShape("M6 9a3 3 0 0 1 3 -3h6a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-6a3 3 0 0 1 -3 -3v-6", false, 2f), IconShape("M9 18v3h6v-3", false, 2f), IconShape("M9 6v-3h6v3", false, 2f)), listOf(IconShape("M15 2a1 1 0 0 1 1 1v2.126c1.726 .445 3 2.01 3 3.874v6a4 4 0 0 1 -3 3.874v2.126a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1v-2.126a4 4 0 0 1 -3 -3.874v-6a4 4 0 0 1 3 -3.874v-2.126a1 1 0 0 1 1 -1zm-1 17h-4v1h4zm0 -15h-4v1h4z", true, 0f)))

  val WifiHigh: IconSet
    get() = IconSet(listOf(IconShape("M12 18l.01 0", false, 2f), IconShape("M9.172 15.172a4 4 0 0 1 5.656 0", false, 2f), IconShape("M6.343 12.343a8 8 0 0 1 11.314 0", false, 2f), IconShape("M3.515 9.515c4.686 -4.687 12.284 -4.687 17 0", false, 2f)))

  val WifiSlash: IconSet
    get() = IconSet(listOf(IconShape("M12 18l.01 0", false, 2f), IconShape("M9.172 15.172a4 4 0 0 1 5.656 0", false, 2f), IconShape("M6.343 12.343a7.963 7.963 0 0 1 3.864 -2.14m4.163 .155a7.965 7.965 0 0 1 3.287 2", false, 2f), IconShape("M3.515 9.515a12 12 0 0 1 3.544 -2.455m3.101 -.92a12 12 0 0 1 10.325 3.374", false, 2f), IconShape("M3 3l18 18", false, 2f)))

  val X: IconSet
    get() = IconSet(listOf(IconShape("M18 6l-12 12", false, 2f), IconShape("M6 6l12 12", false, 2f)), listOf(IconShape("M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414", true, 0f)))

  val XCircle: IconSet
    get() = IconSet(listOf(IconShape("M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0", false, 2f), IconShape("M10 10l4 4m0 -4l-4 4", false, 2f)), listOf(IconShape("M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z", true, 0f)))
}
