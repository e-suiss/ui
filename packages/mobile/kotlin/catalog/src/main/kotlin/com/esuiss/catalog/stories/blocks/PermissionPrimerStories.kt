package com.esuiss.catalog.stories.blocks

import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.fill.Camera
import com.adamglin.phosphoricons.fill.MapPin
import com.adamglin.phosphoricons.regular.NavigationArrow
import com.adamglin.phosphoricons.regular.QrCode
import com.adamglin.phosphoricons.regular.ShieldCheck
import com.adamglin.phosphoricons.regular.Storefront
import com.adamglin.phosphoricons.regular.UserFocus
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.blocks.PermissionPrimer
import com.esuiss.ui.blocks.PermissionPrimerBenefit

val permissionPrimerStories = StoryGroup(
    section = Section.Blocks,
    title = "Permission Primer",
    stories = listOf(
        Story("Default", fullScreen = true) { PermissionPrimer(onAllow = {}, onDismiss = {}) },
        Story("Camera", fullScreen = true) {
            PermissionPrimer(
                icon = PhosphorIcons.Fill.Camera,
                title = "Scan and snap",
                description = "Allow camera access to scan codes and add photos to your messages.",
                benefits = listOf(
                    PermissionPrimerBenefit(PhosphorIcons.Regular.QrCode, "Scan codes", "Pay, sign in and join networks with a QR code."),
                    PermissionPrimerBenefit(PhosphorIcons.Regular.UserFocus, "Profile photo", "Take a new picture without leaving the app."),
                    PermissionPrimerBenefit(PhosphorIcons.Regular.ShieldCheck, "Only when you ask", "The camera is used only while this screen is open."),
                ),
                allowLabel = "Allow Camera",
                onAllow = {},
                onDismiss = {},
            )
        },
        Story("Location", fullScreen = true) {
            PermissionPrimer(
                icon = PhosphorIcons.Fill.MapPin,
                title = "Find stores near you",
                description = "Share your location to see pickup times and directions.",
                benefits = listOf(
                    PermissionPrimerBenefit(PhosphorIcons.Regular.Storefront, "Nearby stores", "See which store has your item in stock today."),
                    PermissionPrimerBenefit(PhosphorIcons.Regular.NavigationArrow, "Directions", "Get walking and driving routes in one tap."),
                ),
                allowLabel = "Share Location",
                dismissLabel = "Maybe later",
                onAllow = {},
                onDismiss = {},
            )
        },
    ),
)
