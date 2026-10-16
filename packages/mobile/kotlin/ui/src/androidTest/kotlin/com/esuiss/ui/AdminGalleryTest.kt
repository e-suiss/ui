package com.esuiss.ui

import android.graphics.Bitmap
import android.os.SystemClock
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.focus.FocusManager
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.semantics.SemanticsActions
import androidx.compose.ui.test.assertCountEquals
import androidx.compose.ui.test.performSemanticsAction
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performScrollTo
import androidx.compose.ui.test.performTextInput
import androidx.compose.ui.test.performTouchInput
import androidx.compose.ui.test.click
import androidx.compose.ui.test.swipeLeft
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.esuiss.ui.blocks.DashAnalytics
import com.esuiss.ui.blocks.DashHealth
import com.esuiss.ui.blocks.DashStore
import com.esuiss.ui.blocks.InboxCategories
import com.esuiss.ui.blocks.InboxMail
import com.esuiss.ui.blocks.InboxSupport
import com.esuiss.ui.blocks.LogActivity
import com.esuiss.ui.blocks.LogLive
import com.esuiss.ui.blocks.LogSecurity
import com.esuiss.ui.blocks.RolesEditor
import com.esuiss.ui.blocks.RolesRequests
import com.esuiss.ui.blocks.UsersDetail
import com.esuiss.ui.blocks.UsersInvite
import com.esuiss.ui.blocks.UsersTable
import com.esuiss.ui.theme.EsuissTheme
import org.junit.Assert.assertEquals
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import java.io.File

private enum class AdminScene {
    DashHealth,
    DashHealthEditing,
    DashHealthHeart,
    DashAnalytics,
    DashAnalyticsRevenue,
    DashAnalyticsMenu,
    DashAnalyticsNotebook,
    DashAnalyticsRatings,
    DashStore,
    DashStoreSaturday,
    DashStoreReturned,
    DashStoreMenu,
    DashStoreFifthAvenue,
    InboxCategories,
    InboxCategoriesUpdates,
    InboxMail,
    InboxMailSwipe,
    InboxMailReply,
    InboxMailArchived,
    InboxSupport,
    InboxSupportSolved,
    LogActivity,
    LogActivityPrice,
    LogActivitySettings,
    LogLive,
    LogLivePaused,
    LogSecurity,
    LogSecurityResolved,
    UsersTable,
    UsersTableSelecting,
    UsersTableSuspended,
    UsersDetail,
    UsersDetailSecurity,
    UsersInvite,
    UsersInviteSent,
    RolesEditor,
    RolesEditorToggled,
    RolesRequests,
    RolesRequestsApproved,
    RolesRequestsEmpty,
}

@Composable
private fun Scene(scene: AdminScene, events: MutableList<String>) {
    when (scene) {
        AdminScene.DashHealth, AdminScene.DashHealthEditing, AdminScene.DashHealthHeart -> DashHealth(
            onPinnedChange = { events += "pinned:${it.joinToString(",")}" },
        )
        AdminScene.DashAnalytics, AdminScene.DashAnalyticsRevenue, AdminScene.DashAnalyticsMenu,
        AdminScene.DashAnalyticsNotebook, AdminScene.DashAnalyticsRatings -> DashAnalytics(
            onAppChange = { events += "app:$it" },
            onMetricChange = { events += "metric:$it" },
            onNavigate = { events += "navigate:$it" },
        )
        AdminScene.DashStore, AdminScene.DashStoreSaturday, AdminScene.DashStoreReturned,
        AdminScene.DashStoreMenu, AdminScene.DashStoreFifthAvenue -> DashStore(
            onRangeChange = { events += "range:$it" },
            onFilterChange = { events += "filter:$it" },
            onStoreChange = { events += "store:$it" },
            onOrderPress = { events += "order:$it" },
            onNavigate = { events += "navigate:$it" },
        )
        AdminScene.InboxCategories, AdminScene.InboxCategoriesUpdates -> InboxCategories(
            onCategoryChange = { events += "category:$it" },
        )
        AdminScene.InboxMail, AdminScene.InboxMailSwipe, AdminScene.InboxMailReply, AdminScene.InboxMailArchived -> InboxMail(
            onArchive = { events += "archive:$it" },
            onDelete = { events += "delete:$it" },
            onReply = { id, text -> events += "reply:$id:$text" },
        )
        AdminScene.InboxSupport, AdminScene.InboxSupportSolved -> InboxSupport(
            onStatusChange = { id, status -> events += "status:$id:$status" },
        )
        AdminScene.LogActivity, AdminScene.LogActivityPrice, AdminScene.LogActivitySettings -> LogActivity(
            onFilterChange = { events += "filter:$it" },
            onNavigate = { events += "navigate:$it" },
        )
        AdminScene.LogLive, AdminScene.LogLivePaused -> LogLive(onRunningChange = { events += "running:$it" })
        AdminScene.LogSecurity, AdminScene.LogSecurityResolved -> LogSecurity(
            onFilterChange = { events += "filter:$it" },
            onResolve = { title, resolved -> events += "resolve:$title:$resolved" },
        )
        AdminScene.UsersTable, AdminScene.UsersTableSelecting, AdminScene.UsersTableSuspended -> UsersTable(
            onFilterChange = { events += "filter:$it" },
            onBulkUpdate = { emails, role, status -> events += "bulk:${emails.joinToString(",")}:$role:$status" },
        )
        AdminScene.UsersDetail, AdminScene.UsersDetailSecurity -> UsersDetail(
            onSecurityChange = { email, setting, enabled -> events += "security:$email:$setting:$enabled" },
        )
        AdminScene.UsersInvite, AdminScene.UsersInviteSent -> UsersInvite(
            onInvite = { emails, role, welcome -> events += "invite:${emails.joinToString(",")}:$role:$welcome" },
        )
        AdminScene.RolesEditor, AdminScene.RolesEditorToggled -> RolesEditor(
            onTogglePermission = { role, permission, enabled -> events += "toggle:$role:$permission:$enabled" },
        )
        AdminScene.RolesRequests, AdminScene.RolesRequestsApproved, AdminScene.RolesRequestsEmpty -> RolesRequests(
            onApprove = { name, duration -> events += "approve:$name:$duration" },
            onDeny = { events += "deny:$it" },
        )
    }
}

@RunWith(AndroidJUnit4::class)
class AdminGalleryTest {
    @get:Rule
    val compose = createComposeRule()

    @Test
    fun rendersAdminBlocksInBothSchemes() {
        var dark by mutableStateOf(false)
        var scene by mutableStateOf(AdminScene.DashHealth)
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
        for (current in AdminScene.entries) {
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
                val name = "admin-${current.name.lowercase()}-${if (scheme) "dark" else "light"}.png"
                File(context.getExternalFilesDir(null), name).outputStream().use {
                    bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)
                }
            }
        }
    }

    private fun interact(scene: AdminScene, events: MutableList<String>) {
        when (scene) {
            AdminScene.DashHealthEditing -> {
                compose.onNodeWithText("Edit").performClick()
                settle()
                compose.onNodeWithContentDescription("Pin Cardio Fitness").performClick()
                assertEquals(listOf("pinned:Move,Steps,Resting Heart Rate,Sleep,Cardio Fitness"), events)
            }
            AdminScene.DashHealthHeart -> {
                compose.onNodeWithText("Heart").performScrollTo().performClick()
                settle()
                compose.onNodeWithText("Last 7 days").assertExists()
            }
            AdminScene.DashAnalytics -> {
                compose.onNodeWithText("This week · Downloads").assertExists()
                compose.onNodeWithText("5.6 K").assertExists()
            }
            AdminScene.DashAnalyticsRevenue -> {
                compose.onNodeWithText("Revenue").performClick()
                settle()
                compose.onNodeWithContentDescription("Revenue", substring = true).performTouchInput {
                    click(Offset(width * 0.5f, height * 0.5f))
                }
                settle()
                assertEquals(listOf("metric:revenue"), events)
                compose.onNodeWithText("Week 7 · Revenue").assertExists()
                compose.onNodeWithText("15.0 K $").assertExists()
            }
            AdminScene.DashAnalyticsMenu -> {
                compose.onNodeWithContentDescription("Apps").performClick()
                settle()
                compose.onNodeWithText("Notebook").assertExists()
            }
            AdminScene.DashAnalyticsNotebook -> {
                compose.onNodeWithContentDescription("Apps").performClick()
                settle()
                compose.onNodeWithText("Notebook").performClick()
                settle()
                assertEquals(listOf("app:notebook"), events)
                compose.onAllNodesWithText("Notebook").assertCountEquals(2)
                compose.onNodeWithText("4.0 K").assertExists()
            }
            AdminScene.DashAnalyticsRatings -> {
                compose.onNodeWithText("Ratings").performClick()
                settle()
                assertEquals(listOf("navigate:ratings"), events)
                compose.onNodeWithText("This section isn't part of the sample. Choose Analytics.").assertExists()
            }
            AdminScene.DashStore -> {
                compose.onNodeWithText("Weekly sales").assertExists()
                compose.onNodeWithText("All stores").assertExists()
            }
            AdminScene.DashStoreSaturday -> {
                compose.onNodeWithText("30 Days").performClick()
                settle()
                compose.onNodeWithContentDescription("Weekly sales", substring = true).performTouchInput {
                    click(Offset(width * 5.5f / 7f, height * 0.6f))
                }
                settle()
                assertEquals(listOf("range:30d"), events)
                compose.onNodeWithText("Sat").assertExists()
                compose.onNodeWithText("$142,000").assertExists()
                compose.onNodeWithText("$5,523,350").assertExists()
            }
            AdminScene.DashStoreReturned -> {
                compose.onAllNodesWithText("Returned")[0].performScrollTo().performClick()
                settle()
                assertEquals(listOf("filter:Returned"), events)
                compose.onNodeWithText("Riley Chen").assertDoesNotExist()
                compose.onNodeWithText("Avery Brooks").performSemanticsAction(SemanticsActions.OnClick)
                assertEquals(listOf("filter:Returned", "order:W1045"), events)
            }
            AdminScene.DashStoreMenu -> {
                compose.onNodeWithContentDescription("Stores").performClick()
                settle()
                compose.onNodeWithText("Fifth Avenue").assertExists()
            }
            AdminScene.DashStoreFifthAvenue -> {
                compose.onNodeWithContentDescription("Stores").performClick()
                settle()
                compose.onNodeWithText("Fifth Avenue").performClick()
                settle()
                assertEquals(listOf("store:Fifth Avenue"), events)
                compose.onNodeWithText("Fifth Avenue").assertExists()
            }
            AdminScene.InboxCategoriesUpdates -> {
                compose.onNodeWithContentDescription("Updates").performClick()
                assertEquals(listOf("category:Updates"), events)
                settle()
                compose.onNodeWithText("Your storage is almost full").assertExists()
            }
            AdminScene.InboxMailSwipe -> {
                compose.onNodeWithText("Riley Chen").performTouchInput {
                    swipeLeft(startX = right - 20f, endX = right - 470f, durationMillis = 2000)
                }
                settle()
                compose.onNodeWithText("Archive").assertExists()
            }
            AdminScene.InboxMailReply -> {
                compose.onNodeWithText("Morgan Lee").performClick()
                settle()
                compose.onNodeWithContentDescription("Reply").performClick()
                settle()
                compose.onNodeWithContentDescription("Reply to Morgan Lee").performTextInput("Works for me")
                settle()
                compose.onNodeWithText("Send").performClick()
                assertEquals(listOf("reply:1:Works for me"), events)
            }
            AdminScene.InboxMailArchived -> {
                compose.onNodeWithText("Morgan Lee").performClick()
                settle()
                compose.onNodeWithContentDescription("Archive").performClick()
                assertEquals(listOf("archive:1"), events)
                settle()
                compose.onNodeWithText("Morgan Lee").assertDoesNotExist()
            }
            AdminScene.InboxSupportSolved -> {
                compose.onNodeWithText("Screen flickers").performClick()
                settle()
                compose.onNodeWithText("Mark as solved").performClick()
                assertEquals(listOf("status:#4821:Solved"), events)
            }
            AdminScene.LogActivityPrice -> {
                compose.onNodeWithText("Price").performClick()
                assertEquals(listOf("filter:Price"), events)
                settle()
                compose.onNodeWithText("Price: Phone Pro").performClick()
                settle()
                compose.onNodeWithText("Before").assertExists()
            }
            AdminScene.LogActivitySettings -> {
                compose.onNodeWithText("Settings").performClick()
                assertEquals(listOf("navigate:settings"), events)
                settle()
                compose.onNodeWithText("This section isn't part of the sample. Choose Activity.").assertExists()
            }
            AdminScene.LogLive -> advance(5000)
            AdminScene.LogLivePaused -> {
                advance(5000)
                compose.onNodeWithText("Pause").performClick()
                assertEquals(listOf("running:false"), events)
                settle()
                compose.onNodeWithText("Paused").assertExists()
            }
            AdminScene.LogSecurityResolved -> {
                compose.onAllNodesWithText("Resolve")[0].performClick()
                settle()
                compose.onNodeWithText("All").performClick()
                assertEquals(listOf("resolve:Sign-in from an unusual location:true", "filter:All"), events)
                settle()
                compose.onNodeWithText("Reopen").assertExists()
            }
            AdminScene.UsersTableSelecting -> {
                compose.onAllNodesWithText("Editor")[0].performClick()
                assertEquals(listOf("filter:Editor"), events)
                settle()
                compose.onNodeWithText("All").performClick()
                settle()
                compose.onNodeWithText("Select").performClick()
                settle()
                compose.onNodeWithContentDescription("Morgan Lee").performClick()
                compose.onNodeWithContentDescription("Riley Chen").performClick()
                settle()
                compose.onNodeWithText("2 selected").assertExists()
            }
            AdminScene.UsersTableSuspended -> {
                compose.onNodeWithText("Morgan Lee").performClick()
                settle()
                compose.onNodeWithText("Suspend").performClick()
                assertEquals(listOf("bulk:morgan@example.com:null:Suspended"), events)
            }
            AdminScene.UsersDetailSecurity -> {
                compose.onNodeWithText("Morgan Lee").performClick()
                settle()
                compose.onNodeWithText("Security").performClick()
                settle()
                compose.onNodeWithContentDescription("Require passkey").performClick()
                assertEquals(listOf("security:morgan@example.com:Require passkey:true"), events)
            }
            AdminScene.UsersInviteSent -> {
                compose.onNodeWithContentDescription("Email").performTextInput("sam@example.com,")
                settle()
                compose.onNodeWithText("sam@example.com").assertExists()
                compose.onNodeWithText("Send Invites").performClick()
                assertEquals(listOf("invite:avery@example.com,sam@example.com:Editor:true"), events)
                settle()
                compose.onNodeWithText("2 invitations sent").assertExists()
            }
            AdminScene.RolesEditorToggled -> {
                compose.onNodeWithText("Editor").performClick()
                settle()
                compose.onNodeWithContentDescription("Delete").performClick()
                assertEquals(listOf("toggle:Editor:Delete:true"), events)
                settle()
                compose.onNodeWithText("Save").assertExists()
            }
            AdminScene.RolesRequestsApproved -> {
                compose.onAllNodesWithText("Approve")[0].performClick()
                compose.mainClock.advanceTimeBy(100)
                compose.waitForIdle()
                compose.onAllNodesWithText("Deny")[0].performClick()
                assertEquals(listOf("approve:Morgan Lee:Permanent", "deny:Riley Chen"), events)
                compose.mainClock.advanceTimeBy(200)
                compose.waitForIdle()
                compose.onNodeWithText("Approved").assertExists()
            }
            AdminScene.RolesRequestsEmpty -> {
                repeat(4) {
                    compose.onAllNodesWithText("Approve")[0].performClick()
                    settle()
                }
                assertEquals(4, events.size)
                compose.onNodeWithText("No pending requests.").assertExists()
            }
            else -> Unit
        }
    }

    private fun advance(millis: Long) {
        var left = millis
        while (left > 0) {
            compose.mainClock.advanceTimeBy(300)
            compose.waitForIdle()
            left -= 300
        }
    }

    private fun settle() {
        repeat(4) {
            compose.mainClock.advanceTimeBy(300)
            compose.waitForIdle()
        }
    }
}
