import { ActivityFeed } from "@/components/create/cards/activity-feed"
import { ActivityRings } from "@/components/create/cards/activity-rings"
import { AiAssistant } from "@/components/create/cards/ai-assistant"
import { ApiKeys } from "@/components/create/cards/api-keys"
import { BatteryStatus } from "@/components/create/cards/battery-status"
import { BookAppointment } from "@/components/create/cards/book-appointment"
import { BudgetCategories } from "@/components/create/cards/budget-categories"
import { CalendarRange } from "@/components/create/cards/calendar-range"
import { ChatThread } from "@/components/create/cards/chat-thread"
import { Contributors } from "@/components/create/cards/contributors"
import { CookieConsent } from "@/components/create/cards/cookie-consent"
import { CreateAccount } from "@/components/create/cards/create-account"
import { DeliveryTracking } from "@/components/create/cards/delivery-tracking"
import { Deployments } from "@/components/create/cards/deployments"
import { EmptyPhotos } from "@/components/create/cards/empty-photos"
import { EnvironmentVariables } from "@/components/create/cards/environment-variables"
import { FamilySharing } from "@/components/create/cards/family-sharing"
import { FeedbackForm } from "@/components/create/cards/feedback-form"
import { FileUpload } from "@/components/create/cards/file-upload"
import { GiftCardRedeem } from "@/components/create/cards/gift-card-redeem"
import { HeartRate } from "@/components/create/cards/heart-rate"
import { HomeScenes } from "@/components/create/cards/home-scenes"
import { IconGrid } from "@/components/create/cards/icon-grid"
import { InviteTeam } from "@/components/create/cards/invite-team"
import { Invoice } from "@/components/create/cards/invoice"
import { NotFound } from "@/components/create/cards/not-found"
import { NotesEditor } from "@/components/create/cards/notes-editor"
import { NotificationSettings } from "@/components/create/cards/notification-settings"
import { NowPlaying } from "@/components/create/cards/now-playing"
import { OrderSummary } from "@/components/create/cards/order-summary"
import { PaymentMethod } from "@/components/create/cards/payment-method"
import { Playlist } from "@/components/create/cards/playlist"
import { PrivacySettings } from "@/components/create/cards/privacy-settings"
import { ProjectOverview } from "@/components/create/cards/project-overview"
import { RecentTransactions } from "@/components/create/cards/recent-transactions"
import { Reminders } from "@/components/create/cards/reminders"
import { ReportIssue } from "@/components/create/cards/report-issue"
import { Revenue } from "@/components/create/cards/revenue"
import { SavingsGoal } from "@/components/create/cards/savings-goal"
import { SecuritySettings } from "@/components/create/cards/security-settings"
import { ShippingAddress } from "@/components/create/cards/shipping-address"
import { Shortcuts } from "@/components/create/cards/shortcuts"
import { SignIn } from "@/components/create/cards/sign-in"
import { SkeletonLoading } from "@/components/create/cards/skeleton-loading"
import { SleepReport } from "@/components/create/cards/sleep-report"
import { SoftwareUpdate } from "@/components/create/cards/software-update"
import { StatusPage } from "@/components/create/cards/status-page"
import { StockPerformance } from "@/components/create/cards/stock-performance"
import { StorageUsage } from "@/components/create/cards/storage-usage"
import { StyleOverview } from "@/components/create/cards/style-overview"
import { SubscriptionPlans } from "@/components/create/cards/subscription-plans"
import { TeamMembers } from "@/components/create/cards/team-members"
import { Thermostat } from "@/components/create/cards/thermostat"
import { TrafficSources } from "@/components/create/cards/traffic-sources"
import { TransferFunds } from "@/components/create/cards/transfer-funds"
import { TypographySpecimen } from "@/components/create/cards/typography-specimen"
import { UiElements } from "@/components/create/cards/ui-elements"
import { UsageLimits } from "@/components/create/cards/usage-limits"
import { Visitors } from "@/components/create/cards/visitors"
import { Weather } from "@/components/create/cards/weather"

export function Board01() {
  return (
    <div className="min-h-svh overflow-auto bg-muted [--gap:--spacing(6)] md:[--gap:--spacing(10)] dark:bg-background">
      <div className="grid w-max grid-cols-[repeat(7,380px)] items-start gap-(--gap) p-(--gap)">
        <div className="flex flex-col gap-(--gap)">
          <StyleOverview />
          <TypographySpecimen />
          <SignIn />
          <EmptyPhotos />
        </div>
        <div className="flex flex-col gap-(--gap)">
          <IconGrid />
          <NowPlaying />
          <Playlist />
          <GiftCardRedeem />
        </div>
        <div className="flex flex-col gap-(--gap)">
          <UiElements />
          <OrderSummary />
          <DeliveryTracking />
          <NotesEditor />
        </div>
        <div className="flex flex-col gap-(--gap)">
          <ActivityRings />
          <SleepReport />
          <PaymentMethod />
          <Reminders />
        </div>
        <div className="flex flex-col gap-(--gap)">
          <HomeScenes />
          <Thermostat />
          <SubscriptionPlans />
          <PrivacySettings />
        </div>
        <div className="flex flex-col gap-(--gap)">
          <Weather />
          <HeartRate />
          <BookAppointment />
          <BatteryStatus />
          <SoftwareUpdate />
        </div>
        <div className="flex flex-col gap-(--gap)">
          <CreateAccount />
          <NotificationSettings />
          <FamilySharing />
          <StorageUsage />
          <ShippingAddress />
        </div>
      </div>
    </div>
  )
}

export function Board02() {
  return (
    <div className="min-h-svh overflow-auto bg-muted [--gap:--spacing(6)] md:[--gap:--spacing(10)] dark:bg-background">
      <div className="grid w-max grid-cols-[repeat(7,380px)] items-start gap-(--gap) p-(--gap)">
        <div className="flex flex-col gap-(--gap)">
          <ProjectOverview />
          <TeamMembers />
          <ChatThread />
          <SkeletonLoading />
        </div>
        <div className="flex flex-col gap-(--gap)">
          <Revenue />
          <InviteTeam />
          <AiAssistant />
          <Shortcuts />
        </div>
        <div className="flex flex-col gap-(--gap)">
          <Visitors />
          <RecentTransactions />
          <Deployments />
          <NotFound />
        </div>
        <div className="flex flex-col gap-(--gap)">
          <TrafficSources />
          <EnvironmentVariables />
          <FeedbackForm />
          <Contributors />
        </div>
        <div className="flex flex-col gap-(--gap)">
          <Invoice />
          <ApiKeys />
          <FileUpload />
          <CookieConsent />
        </div>
        <div className="flex flex-col gap-(--gap)">
          <StockPerformance />
          <UsageLimits />
          <SecuritySettings />
          <ActivityFeed />
          <SavingsGoal />
        </div>
        <div className="flex flex-col gap-(--gap)">
          <TransferFunds />
          <BudgetCategories />
          <StatusPage />
          <ReportIssue />
          <CalendarRange />
        </div>
      </div>
    </div>
  )
}
