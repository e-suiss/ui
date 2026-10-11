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
import androidx.compose.ui.test.assertIsEnabled
import androidx.compose.ui.test.hasSetTextAction
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.onLast
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.isRoot
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performSemanticsAction
import androidx.compose.ui.test.performTextClearance
import androidx.compose.ui.test.performTextInput
import androidx.compose.ui.test.performTouchInput
import androidx.compose.ui.test.swipeUp
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.esuiss.ui.blocks.EmptyBag
import com.esuiss.ui.blocks.EmptyOffline
import com.esuiss.ui.blocks.EmptySearch
import com.esuiss.ui.blocks.LoginAccount
import com.esuiss.ui.blocks.LoginPasskey
import com.esuiss.ui.blocks.LoginSheet
import com.esuiss.ui.blocks.Onboarding
import com.esuiss.ui.blocks.PermissionPrimer
import com.esuiss.ui.blocks.SettingsAccount
import com.esuiss.ui.blocks.SettingsDevice
import com.esuiss.ui.blocks.SettingsNotifications
import com.esuiss.ui.blocks.SignupForm
import com.esuiss.ui.blocks.SignupSteps
import com.esuiss.ui.blocks.SignupTrial
import com.esuiss.ui.blocks.VerifyCode
import com.esuiss.ui.blocks.VerifyDevice
import com.esuiss.ui.blocks.VerifyEmail
import com.esuiss.ui.theme.EsuissTheme
import java.io.File
import org.junit.Assert.assertEquals
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

private enum class BlockScene {
    LoginAccount,
    LoginAccountPassword,
    LoginPasskey,
    LoginPasskeyScan,
    LoginSheet,
    LoginSheetOpen,
    SignupForm,
    SignupFormInvalid,
    SignupFormDone,
    SignupSteps,
    SignupStepsPassword,
    SignupTrial,
    SignupTrialFilled,
    VerifyCode,
    VerifyCodeVerified,
    VerifyDevice,
    VerifyDeviceCode,
    VerifyEmail,
    SettingsAccount,
    SettingsAccountEdit,
    SettingsAccountList,
    SettingsDevice,
    SettingsDeviceSearch,
    SettingsNotifications,
    SettingsNotificationsPreview,
    EmptyBag,
    EmptyBagAdded,
    EmptyOffline,
    EmptyOfflineOnline,
    EmptySearch,
    EmptySearchSuggested,
    Onboarding,
    OnboardingLast,
    PermissionPrimer,
}

@Composable
private fun Scene(scene: BlockScene, events: MutableList<String>) {
    when (scene) {
        BlockScene.LoginAccount, BlockScene.LoginAccountPassword -> LoginAccount(
            onSubmit = { email, _ -> events += "login:$email" },
        )
        BlockScene.LoginPasskey, BlockScene.LoginPasskeyScan -> LoginPasskey(onContinue = { events += "passkey" })
        BlockScene.LoginSheet, BlockScene.LoginSheetOpen -> LoginSheet(onContinue = { events += "sheet:$it" })
        BlockScene.SignupForm, BlockScene.SignupFormInvalid, BlockScene.SignupFormDone -> SignupForm(
            onSubmit = { events += "signup:${it.firstName} ${it.lastName} ${it.country} ${it.email}" },
        )
        BlockScene.SignupSteps, BlockScene.SignupStepsPassword -> SignupSteps(onSubmit = { name, _, _ -> events += "steps:$name" })
        BlockScene.SignupTrial, BlockScene.SignupTrialFilled -> SignupTrial(onSubmit = { email, _ -> events += "trial:$email" })
        BlockScene.VerifyCode, BlockScene.VerifyCodeVerified -> VerifyCode(
            onVerify = { code ->
                events += "verify:$code"
                code == "482913"
            },
        )
        BlockScene.VerifyDevice, BlockScene.VerifyDeviceCode -> VerifyDevice()
        BlockScene.VerifyEmail -> VerifyEmail(onOpenMail = { events += "mail" })
        BlockScene.SettingsAccount, BlockScene.SettingsAccountEdit, BlockScene.SettingsAccountList -> SettingsAccount(
            onSave = { field, value -> events += "save:$field=$value" },
        )
        BlockScene.SettingsDevice, BlockScene.SettingsDeviceSearch -> SettingsDevice(onRowPress = { events += "row:$it" })
        BlockScene.SettingsNotifications, BlockScene.SettingsNotificationsPreview -> SettingsNotifications()
        BlockScene.EmptyBag, BlockScene.EmptyBagAdded -> EmptyBag()
        BlockScene.EmptyOffline, BlockScene.EmptyOfflineOnline -> EmptyOffline()
        BlockScene.EmptySearch, BlockScene.EmptySearchSuggested -> EmptySearch()
        BlockScene.Onboarding, BlockScene.OnboardingLast -> Onboarding(onDone = { events += "done" })
        BlockScene.PermissionPrimer -> PermissionPrimer(
            onAllow = { events += "allow" },
            onDismiss = { events += "dismiss" },
        )
    }
}

@RunWith(AndroidJUnit4::class)
class BlocksGalleryTest {
    @get:Rule
    val compose = createComposeRule()

    @Test
    fun rendersBlocksInBothSchemes() {
        var dark by mutableStateOf(false)
        var scene by mutableStateOf(BlockScene.LoginAccount)
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
        for (current in BlockScene.entries) {
            for (scheme in listOf(false, true)) {
                events.clear()
                scene = current
                dark = scheme
                settle()
                interact(current, events)
                if (current != BlockScene.LoginPasskeyScan) settle()
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
                val name = "blocks-${current.name.lowercase()}-${if (scheme) "dark" else "light"}.png"
                File(context.getExternalFilesDir(null), name).outputStream().use {
                    bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)
                }
                after(current, events)
            }
        }
    }

    private fun interact(scene: BlockScene, events: MutableList<String>) {
        when (scene) {
            BlockScene.LoginAccountPassword -> {
                compose.onNodeWithContentDescription("Email or phone number").performTextInput("jamie@suiss.com")
                compose.onNodeWithContentDescription("Continue").performClick()
                settle()
                compose.onNodeWithContentDescription("Password").performTextInput("hunter2")
            }
            BlockScene.LoginPasskeyScan -> {
                compose.onNodeWithText("Continue with passkey").performClick()
                assertEquals(listOf("passkey"), events)
                compose.mainClock.advanceTimeBy(300)
                compose.waitForIdle()
                compose.onNodeWithText("Face scan").assertExists()
            }
            BlockScene.LoginSheetOpen -> {
                compose.onNodeWithText("Sign in with suiss").performClick()
                settle()
                compose.onNodeWithText("Share My Email").performClick()
            }
            BlockScene.SignupFormInvalid -> {
                compose.onNodeWithContentDescription("First name").performTextInput("Jamie")
                compose.onNodeWithContentDescription("Password").performTextInput("Secret12")
                compose.onNodeWithContentDescription("Confirm password").performTextInput("Secret13")
                compose.onNodeWithText("Continue").performClick()
                settle()
                compose.onNodeWithText("Please fill in every field correctly.").assertExists()
                assertEquals(emptyList<String>(), events)
            }
            BlockScene.SignupFormDone -> {
                compose.onNodeWithContentDescription("First name").performTextInput("Jamie")
                compose.onNodeWithContentDescription("Last name").performTextInput("Rivera")
                compose.onNodeWithContentDescription("Birthday (MM/DD/YYYY)").performTextInput("04/12/1994")
                compose.onNodeWithContentDescription("name@example.com").performTextInput("jamie@suiss.com")
                compose.onNodeWithContentDescription("Password").performTextInput("Secret12")
                compose.onNodeWithContentDescription("Confirm password").performTextInput("Secret12")
                compose.onNodeWithText("Continue").performClick()
                assertEquals(listOf("signup:Jamie Rivera United States jamie@suiss.com"), events)
                settle()
                compose.onNodeWithText("Your suiss Account is ready.").assertExists()
            }
            BlockScene.SignupStepsPassword -> {
                compose.onNodeWithContentDescription("Full name").performTextInput("Jamie Rivera")
                compose.onNodeWithText("Continue").performClick()
                settle()
                compose.onNodeWithContentDescription("name@example.com").performTextInput("jamie@suiss.com")
                compose.onNodeWithText("Continue").performClick()
                settle()
                compose.onNodeWithContentDescription("Password").performTextInput("secret1")
                settle()
                compose.onNodeWithText("Step 3 of 3").assertExists()
            }
            BlockScene.SignupTrialFilled -> {
                compose.onNodeWithContentDescription("suiss Account email").performTextInput("jamie@suiss.com")
                compose.onNodeWithContentDescription("Create a password").performTextInput("Secret12")
                compose.onNodeWithText("I have read and agree to the suiss Media Services Terms and Conditions.").performSemanticsAction(SemanticsActions.OnClick)
                settle()
                compose.onNodeWithText("Start free trial").assertIsEnabled()
            }
            BlockScene.VerifyCodeVerified -> {
                compose.onNodeWithContentDescription("Verification code").performTextInput("482913")
                settle()
                settle()
                assertEquals(listOf("verify:482913"), events)
                settle()
                compose.onNodeWithText("Verified.").assertExists()
            }
            BlockScene.VerifyDeviceCode -> {
                compose.onNodeWithText("Allow").performClick()
                settle()
                compose.onNodeWithText("Enter the verification code.").assertExists()
            }
            BlockScene.VerifyEmail -> {
                compose.onNodeWithText("Resend").performClick()
                assertEquals(emptyList<String>(), events)
            }
            BlockScene.SettingsAccountEdit -> {
                settle()
                compose.onNodeWithText("Trusted phone number").assertExists()
                compose.onAllNodesWithText("Edit ›")[0].performClick()
                settle()
                compose.onNodeWithText("Save").performClick()
                assertEquals(listOf("save:email=jamie@suiss.com"), events)
                compose.onAllNodesWithText("Edit ›").onLast().performClick()
                settle()
            }
            BlockScene.SettingsAccountList -> {
                compose.onNodeWithText("Account").performClick()
                settle()
                compose.onNodeWithText("Family Sharing").assertExists()
            }
            BlockScene.SettingsDeviceSearch -> {
                compose.onNodeWithText("General").performClick()
                assertEquals(listOf("row:General"), events)
                compose.onNode(hasSetTextAction()).performTextInput("Bl")
                settle()
                compose.onNodeWithText("Bluetooth").assertExists()
            }
            BlockScene.SettingsNotificationsPreview -> repeat(2) {
                compose.onAllNodes(isRoot())[0].performTouchInput { swipeUp(startY = bottom * 0.85f, endY = bottom * 0.15f, durationMillis = 400) }
                settle()
            }
            BlockScene.EmptyBagAdded -> {
                compose.onNodeWithContentDescription("Add Pods Studio to bag").performClick()
                settle()
                compose.onNodeWithText("There is 1 item in your bag.").assertExists()
                settle()
                compose.onNodeWithText("Check Out").assertExists()
            }
            BlockScene.EmptyOfflineOnline -> {
                compose.onNodeWithText("Try Again").performClick()
                settle()
                settle()
                compose.onNodeWithText("Disconnect ›").assertExists()
            }
            BlockScene.EmptySearchSuggested -> {
                compose.onNodeWithContentDescription("Search suiss").performTextClearance()
                compose.onNodeWithContentDescription("Search suiss").performTextInput("book")
                settle()
                compose.onNodeWithText("Book mini").assertExists()
            }
            BlockScene.OnboardingLast -> repeat(3) {
                compose.onNodeWithText("Continue").performClick()
                settle()
            }
            BlockScene.PermissionPrimer -> {
                compose.onNodeWithText("Allow").performClick()
                compose.onNodeWithText("Not now").performClick()
                assertEquals(listOf("allow", "dismiss"), events)
            }
            else -> Unit
        }
    }

    private fun after(scene: BlockScene, events: MutableList<String>) {
        when (scene) {
            BlockScene.LoginAccountPassword -> {
                compose.onNodeWithContentDescription("Continue").performClick()
                assertEquals(listOf("login:jamie@suiss.com"), events)
            }
            BlockScene.LoginSheetOpen -> {
                compose.onNodeWithText("Continue with face scan").performClick()
                assertEquals(listOf("sheet:share"), events)
                settle()
            }
            BlockScene.OnboardingLast -> {
                compose.onNodeWithText("Get started").performClick()
                assertEquals(listOf("done"), events)
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
