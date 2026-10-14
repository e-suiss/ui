package com.esuiss.ui

import android.graphics.Bitmap
import android.os.SystemClock
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.focus.FocusManager
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.semantics.SemanticsActions
import androidx.compose.ui.test.hasSetTextAction
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onAllNodesWithContentDescription
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performSemanticsAction
import androidx.compose.ui.test.performTextInput
import androidx.compose.ui.test.performTouchInput
import androidx.compose.ui.test.isRoot
import androidx.compose.ui.test.swipeUp
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.esuiss.ui.blocks.BagCheckout
import com.esuiss.ui.blocks.BagConfigure
import com.esuiss.ui.blocks.BagReview
import com.esuiss.ui.blocks.ChatConversations
import com.esuiss.ui.blocks.ChatSupport
import com.esuiss.ui.blocks.ChatThread
import com.esuiss.ui.blocks.GridAccessories
import com.esuiss.ui.blocks.GridCarousel
import com.esuiss.ui.blocks.GridLineup
import com.esuiss.ui.blocks.NavCategories
import com.esuiss.ui.blocks.PriceBundle
import com.esuiss.ui.blocks.PriceCare
import com.esuiss.ui.blocks.PriceStorage
import com.esuiss.ui.theme.EsuissTheme
import java.io.File
import org.junit.Assert.assertEquals
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

private enum class CommerceScene {
    ChatConversations,
    ChatConversationsThread,
    ChatSupport,
    ChatSupportAnswered,
    ChatThread,
    ChatThreadSent,
    BagCheckout,
    BagCheckoutReview,
    BagCheckoutPlaced,
    BagConfigure,
    BagConfigureAdded,
    BagReview,
    BagReviewChanged,
    PriceBundle,
    PriceBundleSelected,
    PriceCare,
    PriceCareWatch,
    PriceStorage,
    PriceStorageYearly,
    GridCarousel,
    GridCarouselNext,
    GridAccessories,
    GridAccessoriesAdded,
    GridLineup,
    NavCategories,
    NavCategoriesSelected,
}

@Composable
private fun Scene(scene: CommerceScene, events: MutableList<String>) {
    when (scene) {
        CommerceScene.ChatConversations, CommerceScene.ChatConversationsThread -> ChatConversations(
            onSend = { text, conversation -> events += "send:$conversation:$text" },
        )
        CommerceScene.ChatSupport, CommerceScene.ChatSupportAnswered -> ChatSupport(onSend = { events += "ask:$it" })
        CommerceScene.ChatThread, CommerceScene.ChatThreadSent -> ChatThread(
            onSend = { text, attachment -> events += "send:$text:$attachment" },
            onAttach = { events += "attach" },
            onLikeChange = { id, liked -> events += "like:$id:$liked" },
        )
        CommerceScene.BagCheckout, CommerceScene.BagCheckoutReview, CommerceScene.BagCheckoutPlaced -> BagCheckout(
            onPlaceOrder = { shipping, payment, total -> events += "order:$shipping:$payment:$total" },
        )
        CommerceScene.BagConfigure, CommerceScene.BagConfigureAdded -> BagConfigure(
            onAddToBag = { model, finish, storage, price -> events += "add:$model:$finish:$storage:$price" },
        )
        CommerceScene.BagReview, CommerceScene.BagReviewChanged -> BagReview(
            onQuantityChange = { name, quantity -> events += "quantity:$name:$quantity" },
            onRemove = { events += "remove:$it" },
            onCheckout = { events += "checkout:$it" },
        )
        CommerceScene.PriceBundle, CommerceScene.PriceBundleSelected -> PriceBundle(onSelectPlan = { events += "plan:$it" })
        CommerceScene.PriceCare, CommerceScene.PriceCareWatch -> PriceCare(
            onAddToBag = { device, option, theft, total -> events += "care:$device:$option:$theft:$total" },
        )
        CommerceScene.PriceStorage, CommerceScene.PriceStorageYearly -> PriceStorage(
            onSelectPlan = { plan, period -> events += "storage:$plan:$period" },
            onPeriodChange = { events += "period:$it" },
        )
        CommerceScene.GridCarousel, CommerceScene.GridCarouselNext -> GridCarousel(onSelectProduct = { events += "product:$it" })
        CommerceScene.GridAccessories, CommerceScene.GridAccessoriesAdded -> GridAccessories(
            onAddToBag = { events += "bag:$it" },
            onFilterChange = { events += "filter:$it" },
        )
        CommerceScene.GridLineup -> GridLineup(onBuy = { name, finish -> events += "buy:$name:$finish" })
        CommerceScene.NavCategories, CommerceScene.NavCategoriesSelected -> NavCategories(
            onSelectCategory = { events += "category:$it" },
        )
    }
}

@RunWith(AndroidJUnit4::class)
class CommerceGalleryTest {
    @get:Rule
    val compose = createComposeRule()

    @Test
    fun rendersCommerceBlocksInBothSchemes() {
        var dark by mutableStateOf(false)
        var scene by mutableStateOf(CommerceScene.ChatConversations)
        val events = mutableListOf<String>()
        var focus: FocusManager? = null
        compose.mainClock.autoAdvance = false
        compose.setContent {
            focus = LocalFocusManager.current
            EsuissTheme(darkTheme = dark) {
                key(scene, dark) { Scene(scene, events) }
            }
        }
        val instrumentation = InstrumentationRegistry.getInstrumentation()
        val context = instrumentation.targetContext
        for (current in CommerceScene.entries) {
            for (scheme in listOf(false, true)) {
                events.clear()
                scene = current
                dark = scheme
                settle()
                interact(current, events)
                settle()
                compose.runOnIdle { focus?.clearFocus(force = true) }
                compose.mainClock.advanceTimeBy(300)
                compose.waitForIdle()
                SystemClock.sleep(600)
                repeat(2) {
                    compose.mainClock.advanceTimeBy(300)
                    compose.waitForIdle()
                }
                SystemClock.sleep(300)
                val bitmap = checkNotNull(instrumentation.uiAutomation.takeScreenshot())
                val name = "commerce-${current.name.lowercase()}-${if (scheme) "dark" else "light"}.png"
                File(context.getExternalFilesDir(null), name).outputStream().use {
                    bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)
                }
            }
        }
    }

    private fun interact(scene: CommerceScene, events: MutableList<String>) {
        when (scene) {
            CommerceScene.ChatConversationsThread -> {
                compose.onNodeWithText("Riley Chen").performClick()
                settle()
                compose.onNode(hasSetTextAction()).performTextInput("See you at the dock")
                settle()
                compose.onNodeWithContentDescription("Send").performClick()
                assertEquals(listOf("send:Riley Chen:See you at the dock"), events)
                settle()
                settle()
                compose.onNodeWithText("Sounds good").assertExists()
            }
            CommerceScene.ChatSupportAnswered -> {
                compose.onNodeWithText("Where's my order?").performClick()
                assertEquals(listOf("ask:Where's my order?"), events)
                settle()
                settle()
                compose.onNodeWithText("Order W1048 has shipped. It arrives tomorrow between 10 AM and 2 PM.").assertExists()
            }
            CommerceScene.ChatThreadSent -> {
                compose.onNodeWithText("Great, I'll bring the camera").performSemanticsAction(SemanticsActions.OnClick)
                compose.onNodeWithContentDescription("Add attachment").performClick()
                settle()
                compose.onNodeWithText("IMG_0142.jpeg").assertExists()
                compose.onNode(hasSetTextAction()).performTextInput("Look at this")
                settle()
                compose.onNodeWithContentDescription("Send").performClick()
                assertEquals(listOf("like:3:true", "attach", "send:Look at this:IMG_0142.jpeg"), events)
            }
            CommerceScene.BagCheckoutReview -> {
                compose.onNodeWithText("Express · Tomorrow").performSemanticsAction(SemanticsActions.OnClick)
                compose.onNodeWithText("Continue to Payment").performClick()
                settle()
                compose.onNodeWithText("Continue to Review").performClick()
            }
            CommerceScene.BagCheckoutPlaced -> {
                compose.onNodeWithText("Continue to Payment").performClick()
                settle()
                compose.onNodeWithText("suiss Pay").performSemanticsAction(SemanticsActions.OnClick)
                compose.onNodeWithText("Continue to Review").performClick()
                settle()
                compose.onNodeWithText("Place Order").performClick()
                assertEquals(listOf("order:Standard:Pay:1697.0"), events)
                settle()
                compose.onNodeWithText("Thank you. Your order is in.").assertExists()
            }
            CommerceScene.BagConfigureAdded -> {
                compose.onNodeWithContentDescription("Deep Blue").performSemanticsAction(SemanticsActions.OnClick)
                compose.onNodeWithText("512 GB").performSemanticsAction(SemanticsActions.OnClick)
                compose.onNodeWithText("Add to Bag").performClick()
                assertEquals(listOf("add:Phone Pro:Deep Blue:512 GB:1299.0"), events)
            }
            CommerceScene.BagReviewChanged -> {
                compose.onAllNodesWithContentDescription("Increase")[0].performClick()
                compose.onNodeWithContentDescription("Remove Pods Studio").performSemanticsAction(SemanticsActions.OnClick)
                settle()
                compose.onNodeWithText("Check Out").performClick()
                assertEquals(listOf("quantity:Phone Pro:2", "remove:Pods Studio", "checkout:Default"), events)
                compose.onNodeWithText("Your bag total is \$2,296.00.").assertExists()
            }
            CommerceScene.PriceBundleSelected -> {
                compose.onNodeWithText("Premier").performSemanticsAction(SemanticsActions.OnClick)
                settle()
                compose.onNodeWithText("Try it free").performClick()
                assertEquals(listOf("plan:Premier"), events)
                compose.onAllNodes(isRoot())[0].performTouchInput { swipeUp(startY = bottom * 0.7f, endY = bottom * 0.1f, durationMillis = 400) }
            }
            CommerceScene.PriceCareWatch -> {
                compose.onNodeWithText("Watch").performClick()
                settle()
                compose.onNodeWithText("Monthly payment").performSemanticsAction(SemanticsActions.OnClick)
                compose.onNodeWithText("Add to Bag").performClick()
                assertEquals(listOf("care:Watch:Monthly:false:3.99"), events)
            }
            CommerceScene.PriceStorageYearly -> {
                compose.onNodeWithText("Yearly · 2 months free").performClick()
                compose.onNodeWithText("2 TB").performSemanticsAction(SemanticsActions.OnClick)
                settle()
                compose.onNodeWithText("Switch to 2 TB").performClick()
                assertEquals(listOf("period:Yearly", "storage:2 TB:Yearly"), events)
            }
            CommerceScene.GridCarouselNext -> {
                compose.onNodeWithContentDescription("Next slide").performClick()
                settle()
                compose.onNodeWithText("Book Air").performClick()
                assertEquals(listOf("product:Book Air"), events)
            }
            CommerceScene.GridAccessoriesAdded -> {
                compose.onNodeWithText("Audio").performClick()
                settle()
                compose.onNodeWithContentDescription("Add Pods Studio Headphones to bag").performSemanticsAction(SemanticsActions.OnClick)
                assertEquals(listOf("filter:Audio", "bag:Pods Studio Headphones"), events)
            }
            CommerceScene.NavCategoriesSelected -> {
                compose.onNodeWithText("Watch").performClick()
                assertEquals(listOf("category:Watch"), events)
                settle()
                compose.onNodeWithText("The latest. Take a look at what's new in Watch.").assertExists()
            }
            else -> Unit
        }
    }

    private fun settle() {
        repeat(4) {
            compose.mainClock.advanceTimeBy(300)
            compose.waitForIdle()
        }
    }
}
