import { site } from "@/lib/site"

type Status = "development" | "planned"

export type Product = {
  slug: string
  name: string
  image: string
  status: Status
  verb: string
  category: string
  tagline: string
  summary: string
  description: string
  question: string
  principles: { title: string; body: string }[]
  groups: { title: string; items: string[] }[]
  agent: { lead: string; items: string[] }
  rules?: { title: string; lead: string; items: string[] }
  standards?: string[]
  facts: { label: string; value: string }[]
  connections: { slug: string; text: string }[]
  faq: { question: string; answer: string }[]
}

export const products: Product[] = [
  {
    slug: "one",
    name: "One",
    image: "/images/products/one.jpg",
    status: "development",
    verb: "Understand",
    category: "Personal agent",
    tagline: "The personal agent that works for you.",
    summary:
      "One is a personal agent that belongs to you, not to a model provider. It learns how you live and work through memory you can see and correct, keeps your tasks going across your devices, acts only within the limits you set, and interrupts you only when it is worth it.",
    description:
      "One is a personal agent that belongs to you, not a model provider: memory you can see and correct, tasks across devices, and only the limits you set.",
    question:
      "What should be done for you now, who should do it, and is it worth interrupting you?",
    principles: [
      {
        title: "Remembers you, on your terms",
        body: "Every memory shows where it came from: something you said, something One observed or something it inferred. You can correct it, stop it being used or forget it for good.",
      },
      {
        title: "Acts within your limits",
        body: "For each kind of action you choose: do it, ask me first, or leave it to me. Authority comes from Access, never from a conversation.",
      },
      {
        title: "Protects your attention",
        body: "A small daily interruption budget, a clear “why now?” on every interruption, and a daily summary that ends. One is never built to keep you scrolling.",
      },
      {
        title: "Independent of any model",
        body: "Your memory, tasks, personality and permissions live outside the model. You never have to pick one, and your agent stays the same when models change.",
      },
      {
        title: "Private and yours",
        body: "Your keys stay on your devices and data is processed so that suiss cannot read it. It is never used for advertising, and you can export everything.",
      },
      {
        title: "Works with other people's agents",
        body: "Your One can propose, counter and agree with someone else's One. Agreements become commitments in Work.",
      },
    ],
    groups: [
      {
        title: "Memory",
        items: [
          "Source on every memory: said, observed or inferred",
          "Correct, don't use, or forget for good",
          "Life areas and your own projects",
          "A screen that shows how One knows you",
          "Full structured export",
        ],
      },
      {
        title: "Tasks",
        items: [
          "Plans with steps, checkpoints and a clear finish",
          "Official APIs and app actions first",
          "A cloud browser that identifies itself",
          "Long tasks that survive restarts",
          "Hand-off to you when only you can do it",
        ],
      },
      {
        title: "Autonomy",
        items: [
          "Act, act if pre-approved, ask, or hand off",
          "Rules in plain language with a preview",
          "“If this, do that, up to this amount, until this date”",
          "Undo only where an action is truly reversible",
          "What are you doing? Why? Stop. Undo. Don't do this again.",
        ],
      },
      {
        title: "Attention",
        items: [
          "Decided on your device",
          "Four interruption levels",
          "A daily interruption budget you set",
          "Waits for your next natural break",
          "Quiet hours and focus modes as hard limits",
        ],
      },
      {
        title: "Everywhere you are",
        items: [
          "iPhone and iPad: widgets, Live Activities, Shortcuts",
          "Android: quick settings and live updates",
          "Mac menu bar, Windows and Linux tray",
          "Watch for status and quick approvals",
          "CarPlay and Android Auto by voice",
          "Turkish and English",
        ],
      },
    ],
    agent: {
      lead: "One plans the work, Access decides whether it may happen, and the action runs through a controlled executor. The model never holds your credentials.",
      items: [
        "Sub-agents that report back",
        "Capabilities named by meaning",
        "Browser extension and desktop helper",
        "Bridge to your own coding agents",
        "Content from emails and web pages treated as data, not instructions",
        "Agent-to-agent agreements",
      ],
    },
    rules: {
      title: "Never on its own",
      lead: "Some actions always need you, whatever your settings say.",
      items: [
        "Change passwords, two-factor or recovery settings",
        "Add a payment method",
        "Widen its own permissions",
        "Delete your account or wipe its memory",
        "Send money to a new recipient for the first time",
        "Share sensitive data with someone new",
        "Sign out or authorize devices",
        "Install software",
      ],
    },
    standards: ["MCP", "A2A", "App Intents", "Web Bot Auth", "WCAG 2.2 AA"],
    facts: [
      {
        label: "Models",
        value: "Operated by suiss, chosen for you per request",
      },
      {
        label: "On device",
        value: "Attention decisions, voice detection and an offline core",
      },
      {
        label: "Privacy",
        value: "Keys on your devices, processing suiss cannot read",
      },
      {
        label: "Hardware",
        value: "No suiss device required",
      },
      {
        label: "Languages",
        value: "Turkish and English",
      },
      {
        label: "If One ever closes",
        value: "At least 90 days' notice, then 30 days to export",
      },
    ],
    connections: [
      {
        slug: "access",
        text: "Holds One's permissions and approvals. One cannot create authority from memory or conversation.",
      },
      {
        slug: "relay",
        text: "Delivers One's interruptions, waits and messages between agents.",
      },
      {
        slug: "work",
        text: "Anything promised to someone else becomes a commitment in Work.",
      },
      {
        slug: "pay",
        text: "Every payment goes through Pay. One never sees card data.",
      },
    ],
    faq: [
      {
        question: "What is suiss One?",
        answer:
          "A personal agent that belongs to you. It remembers what matters with memory you control, does tasks for you within limits you set, and works on your phone, computer, watch and car.",
      },
      {
        question: "Which AI model does One use?",
        answer:
          "You don't have to choose. suiss operates the models and picks one per request. Your memory and permissions live outside the model, so One stays the same when models change.",
      },
      {
        question: "Can One spend money or change my accounts?",
        answer:
          "Only within limits you approve through Access, and some actions, like adding a payment method or changing your password, always need you.",
      },
      {
        question: "Is One available?",
        answer: "One is in development.",
      },
    ],
  },
  {
    slug: "access",
    name: "Access",
    image: "/images/products/access.jpg",
    status: "development",
    verb: "Authorize",
    category: "Identity and authority",
    tagline: "Identity and authority for people, organizations and AI agents.",
    summary:
      "Access is a complete identity provider with authority built in. It signs in people, services, devices and AI agents over standard protocols, and before an action happens it decides whether that actor, on that authority, may do this exact thing now: allow, deny, or say what is still required. Every decision leaves a signed record that others can check without asking suiss.",
    description:
      "Access is an identity provider with authority built in. It signs in people, services, devices and AI agents and decides what each may do, with signed records.",
    question: "May this actor, on this authority, do this exact thing now?",
    principles: [
      {
        title: "Two planes, one product",
        body: "A full identity provider plus explicit, checkable authority. Signing in never grants authority on its own.",
      },
      {
        title: "Delegation only narrows",
        body: "Grants, mandates and delegation chains can never widen. Every action is checked against scope, amount, time, purpose and budget.",
      },
      {
        title: "Approvals bound to intent",
        body: "A human approval is tied to the exact action it approves, so it can be proven later and cannot be reused for something else.",
      },
      {
        title: "Revocation that cascades",
        body: "Revoke, suspend or narrow authority, and the change applies from the moment it is committed, down the whole delegation chain.",
      },
      {
        title: "Records you can verify",
        body: "Signed decision records and an offline verifier let auditors and counterparties check what happened without asking Access.",
      },
      {
        title: "Fails closed",
        body: "If something cannot be verified, the answer is not allow. There is no impersonation, and support never signs in as you.",
      },
    ],
    groups: [
      {
        title: "Identity",
        items: [
          "OpenID Connect and OAuth 2.1",
          "Passkeys, authenticator codes and passwordless email",
          "Step-up authentication",
          "Sessions, account lifecycle and recovery",
          "Hosted pages and embeddable components",
        ],
      },
      {
        title: "Enterprise",
        items: [
          "SAML 2.0 and SCIM 2.0",
          "LDAP, Kerberos, RADIUS and WS-Federation",
          "OpenID Federation",
          "Bring your existing identity provider",
          "Organizations, invitations and verified domains",
          "Self-service SSO and SCIM setup",
        ],
      },
      {
        title: "Authority",
        items: [
          "Grants, mandates and delegation chains",
          "Allow, deny or require action, with an explanation",
          "Approvals bound to the exact intent",
          "Revoke, suspend and narrow with cascade",
          "Consequence tiers for every action",
        ],
      },
      {
        title: "Proof and audit",
        items: [
          "Signed decision receipts",
          "Portable proof of authority",
          "Offline verifier",
          "Tamper-evident, append-only log",
          "Audit export and replay",
          "Webhooks, SIEM streams and shared signals",
        ],
      },
      {
        title: "For developers",
        items: [
          "Management REST API",
          "Decision API",
          "SDKs and an access proxy for your services",
          "Developer console and decision lab",
          "Sandbox environment",
        ],
      },
      {
        title: "Governance",
        items: [
          "Access reviews",
          "Separation of duties",
          "Break-glass access",
          "Hardware-backed signing keys",
          "Personal data erasure by crypto-shredding",
        ],
      },
    ],
    agent: {
      lead: "Take authorization out of the model and put it in a deterministic layer. Agents get identity, bounded authority and a human in the loop when it matters.",
      items: [
        "Agent identity with an accountable owner",
        "Authority budgets and mandates per run",
        "Sub-agent and agent-to-agent delegation",
        "MCP authorization server",
        "Credential vault: the model never sees secrets",
        "Human approval in the middle of a task",
      ],
    },
    standards: [
      "OpenID Connect",
      "OAuth 2.1",
      "FAPI 2.0",
      "PKCE",
      "DPoP",
      "SAML 2.0",
      "SCIM 2.0",
      "WebAuthn",
      "LDAP",
      "Kerberos",
      "RADIUS",
      "WS-Federation",
      "OpenID Federation",
      "AuthZEN",
      "CIBA",
      "Token Exchange",
      "SSF / CAEP",
      "SD-JWT",
      "W3C VC 2.0",
      "MCP",
      "A2A",
    ],
    facts: [
      {
        label: "Decisions",
        value: "Allow, deny or require action, each with a signed record",
      },
      {
        label: "Built with",
        value: "Rust, with a shared core for server, browser and mobile",
      },
      {
        label: "Keys",
        value: "Hardware-backed, kept outside the web processes",
      },
      {
        label: "Data",
        value: "No physical deletes; personal data erased by crypto-shredding",
      },
      {
        label: "SDKs",
        value: "TypeScript, Python, Go, Java, .NET and mobile",
      },
      {
        label: "Console",
        value: "Built to WCAG 2.2 AA",
      },
    ],
    connections: [
      {
        slug: "relay",
        text: "Access and Relay run together: every message Access sends goes through Relay.",
      },
      {
        slug: "one",
        text: "Holds One's agent identities, grants and mandates.",
      },
      {
        slug: "pay",
        text: "Decides payment authority; Money holds the funds and Pay moves them.",
      },
      {
        slug: "work",
        text: "Decides who may approve; Work coordinates the decision.",
      },
    ],
    faq: [
      {
        question: "What is suiss Access?",
        answer:
          "An identity provider with an authority layer. It signs in people, services and AI agents, and decides before each action whether it may happen, leaving a signed record.",
      },
      {
        question: "How does Access work with AI agents?",
        answer:
          "Each agent has its own identity and an accountable owner. Its authority is delegated, can only narrow, and is checked against a budget and purpose on every action. When something needs a person, Access asks for an approval tied to that exact action.",
      },
      {
        question: "Which protocols does Access support?",
        answer:
          "OpenID Connect, OAuth 2.1, SAML 2.0, SCIM 2.0, passkeys, LDAP, Kerberos, RADIUS, WS-Federation and MCP authorization, among others.",
      },
      {
        question: "Is Access available?",
        answer: "Access is in development.",
      },
    ],
  },
  {
    slug: "relay",
    name: "Relay",
    image: "/images/products/relay.jpg",
    status: "development",
    verb: "Communicate",
    category: "Events and messaging",
    tagline: "Every message accounted for.",
    summary:
      "Relay takes an event from your product and gets it to the right person, service, device or AI agent, on the right channel and at the right time, within consent rules. It handles retries, failover and preferences, and keeps a record of what happened to every message, including the ones it chose not to send and why.",
    description:
      "Relay gets events from your product to the right person, service, device or AI agent, on the right channel and time, with a record of every message.",
    question:
      "How does this event or message reach the right person, service, device or agent?",
    principles: [
      {
        title: "One entry point",
        body: "Send events through one API or as CloudEvents. Idempotency and deduplication keys prevent accidental double sends.",
      },
      {
        title: "Right channel, right time",
        body: "Fallback, escalation, quiet hours and the recipient's time zone are handled for you, without code in your product.",
      },
      {
        title: "Consent in the send path",
        body: "Preferences, legal consent, one-click unsubscribe and country rules are checked before every send, and a send is skipped when a check fails.",
      },
      {
        title: "A reason for every skip",
        body: "When a message is not sent, Relay records why and which rule decided it. “Why didn't I get it?” has an answer.",
      },
      {
        title: "Replies that find their way back",
        body: "Messages stay in the inbox or mailbox even if a push is lost, and replies are matched on whichever channel they arrive.",
      },
    ],
    groups: [
      {
        title: "Channels",
        items: [
          "iOS, Android and web push",
          "Email through providers or your own SMTP",
          "SMS and voice codes",
          "WhatsApp, Slack, Microsoft Teams, Telegram and Discord",
          "In-app inbox with real-time updates",
        ],
      },
      {
        title: "Workflows",
        items: [
          "Visual editor, files in git, or code",
          "Wait, digest, throttle and conditions",
          "Fallback, fan-out and last active device",
          "Escalate unless seen",
          "Scheduling and recurring notifications",
          "Topics and subscriptions",
        ],
      },
      {
        title: "Reliability",
        items: [
          "At-least-once delivery with durable idempotency",
          "Retries with backoff and circuit breakers",
          "Provider failover to verified providers only",
          "Priority lanes so security codes are never shed",
          "Fair limits per customer",
          "Dead-letter queue and replay",
        ],
      },
      {
        title: "Consent and compliance",
        items: [
          "Message classes from security to marketing",
          "Preference center by category and channel",
          "Turkey's İYS consent registry",
          "One-click unsubscribe",
          "Country rules for Turkey, the EU and the US",
          "Crypto-shredding for personal data erasure",
        ],
      },
      {
        title: "Content",
        items: [
          "Versioned templates per channel and language",
          "Templates that never run code",
          "Responsive email layouts",
          "Brands, including per customer",
          "Previews and test sends",
        ],
      },
      {
        title: "Webhooks and insight",
        items: [
          "Signed webhooks",
          "Delivery to queues, streams and object storage",
          "Embeddable webhook portal",
          "“Why didn't I get it?” lookup",
          "Delivery funnel reports",
          "OpenTelemetry tracing",
        ],
      },
    ],
    agent: {
      lead: "Agents can ask a person a question and wait for the answer without holding a process open. Relay holds the wait and hands the answer back.",
      items: [
        "Waitpoints that resolve from any channel",
        "Notify, question and review messages",
        "Durable agent mailbox, read in order",
        "Wake-up signals for sleeping agents",
        "Escalation chains that never auto-approve",
        "MCP, A2A and AG-UI support",
      ],
    },
    standards: [
      "CloudEvents",
      "Standard Webhooks",
      "APNs",
      "FCM",
      "Web Push",
      "SMTP",
      "WebSocket",
      "Server-Sent Events",
      "RFC 8058",
      "OpenAPI 3.1",
      "AsyncAPI 3",
      "MCP",
      "A2A",
      "AG-UI",
      "OpenTelemetry",
    ],
    facts: [
      {
        label: "Delivery",
        value: "At-least-once with durable idempotency",
      },
      {
        label: "Built with",
        value: "Elixir, OTP and Phoenix",
      },
      {
        label: "Requires",
        value: "PostgreSQL and Valkey",
      },
      {
        label: "Regions",
        value: "Separate installations for Turkey, the EU and the US",
      },
      {
        label: "SDKs",
        value:
          "Server, iOS, Android, React Native and Flutter, plus inbox components",
      },
      {
        label: "Long waits",
        value: "Up to 90 days, stored durably",
      },
    ],
    connections: [
      {
        slug: "access",
        text: "Sign-in, credentials and approvals come from Access; Access sends all its messages through Relay.",
      },
      {
        slug: "work",
        text: "Work decides who to escalate to; Relay delivers it.",
      },
      {
        slug: "one",
        text: "One sends and receives through Relay like any other agent.",
      },
      {
        slug: "commerce",
        text: "Order, payment and delivery updates from Commerce, Serve and Pay reach people through Relay.",
      },
    ],
    faq: [
      {
        question: "What is suiss Relay?",
        answer:
          "Infrastructure for notifications, messaging and event delivery. It sends over push, email, SMS, chat apps, in-app and webhooks, with consent rules, retries and a record for every message.",
      },
      {
        question: "How does Relay handle consent?",
        answer:
          "Every send passes one decision layer that checks message class, preferences, legal consent including İYS, country rules and quiet hours. If a check fails, the message is skipped and the reason is recorded.",
      },
      {
        question: "Can AI agents use Relay?",
        answer:
          "Yes. Agents can ask a person and wait for the reply, read a durable mailbox after waking up, and connect over MCP and A2A.",
      },
      {
        question: "Is Relay available?",
        answer: "Relay is in development.",
      },
    ],
  },
  {
    slug: "money",
    name: "Money",
    image: "/images/products/money.jpg",
    status: "planned",
    verb: "Hold",
    category: "Personal money",
    tagline: "Your money, in one place.",
    summary:
      "Money is a personal money account for everyday life: balances in several currencies, physical and virtual cards, transfers, budgets, subscriptions and rewards. It is built so that your agent can pay for things on your behalf, using only the accounts and limits you allow.",
    description:
      "Money is a personal account for everyday life: multi-currency balances, cards, transfers and budgets, built so your agent can pay within your limits.",
    question: "Which of your accounts, balances or cards should be used?",
    principles: [
      {
        title: "Everything in one account",
        body: "Balances, cards, transfers and statements in one place, in more than one currency.",
      },
      {
        title: "Cards you control",
        body: "Freeze a card, set limits, allow or block merchants and categories, and create single-use cards in seconds.",
      },
      {
        title: "Ready for your agent",
        body: "Your agent can pay only from the sources you choose, within budgets and purposes you set. Access decides whether it may.",
      },
      {
        title: "Clear about your money",
        body: "See where money goes, spot recurring costs and manage subscriptions before they renew.",
      },
    ],
    groups: [
      {
        title: "Account",
        items: [
          "Multi-currency balances",
          "Available and pending balance",
          "Transaction ledger and statements",
          "Bank account and card linking",
          "Scheduled and automatic top-up",
        ],
      },
      {
        title: "Cards",
        items: [
          "Physical and virtual cards",
          "Single-use and disposable cards",
          "Freeze and unfreeze",
          "Merchant and category controls",
          "Online, contactless and international controls",
        ],
      },
      {
        title: "Transfers and payments",
        items: [
          "Send and request money",
          "Bank and internal transfers",
          "Scheduled and recurring transfers",
          "QR and contactless payments",
          "Saved recipients",
        ],
      },
      {
        title: "Insight",
        items: [
          "Spending by category",
          "Budgets and cash-flow view",
          "Recurring expense detection",
          "Subscription management",
          "Smart alerts",
        ],
      },
      {
        title: "Rewards and protection",
        items: [
          "Cashback and offers",
          "Refund tracking",
          "Card disputes",
          "Fraud monitoring",
          "Account security",
        ],
      },
    ],
    agent: {
      lead: "Access decides whether an agent may spend. Money decides which of your accounts or cards it uses.",
      items: [
        "Delegated access to chosen sources",
        "Virtual cards just for your agent",
        "Budget-aware spending",
        "Merchant, category, purpose and time limits",
        "Receipts for every agent payment",
        "Your approval above the amounts you set",
      ],
    },
    facts: [
      {
        label: "For",
        value: "Individuals and their agents",
      },
      {
        label: "Currencies",
        value: "Multi-currency accounts and conversion",
      },
      {
        label: "Cards",
        value: "Physical, virtual and single-use",
      },
      { label: "Status", value: "Planned" },
    ],
    connections: [
      {
        slug: "access",
        text: "Decides whether an agent may use your money.",
      },
      {
        slug: "pay",
        text: "Executes the payment to the merchant.",
      },
      {
        slug: "one",
        text: "Pays for things on your behalf, within your limits.",
      },
    ],
    faq: [
      {
        question: "What is suiss Money?",
        answer:
          "A personal money account with cards, transfers, budgets, multiple currencies and rewards, designed so your agent can pay within limits you set.",
      },
      {
        question: "How is Money different from Pay?",
        answer:
          "Money is your money and your financial life. Pay is the infrastructure businesses use to accept payments.",
      },
      {
        question: "Is Money available?",
        answer: "Money is planned.",
      },
    ],
  },
  {
    slug: "pay",
    name: "Pay",
    image: "/images/products/pay.jpg",
    status: "planned",
    verb: "Move",
    category: "Payment infrastructure",
    tagline: "Accept payments from anyone, or any agent.",
    summary:
      "Pay is payment infrastructure for businesses and platforms: payment and checkout APIs, virtual POS, payment links, settlement and payouts, and marketplace payments. Checkout is built for agents too, so a purchase made by someone's agent is as clear as one made by a person.",
    description:
      "Pay is payment infrastructure for businesses and platforms: checkout APIs, virtual POS, payment links, payouts and marketplace payments, built for agents too.",
    question: "How does a payment actually reach the merchant?",
    principles: [
      {
        title: "Every way to accept",
        body: "Cards, bank payments, Money and alternative methods through one API, hosted checkout or payment links.",
      },
      {
        title: "The whole payment lifecycle",
        body: "Authorize, capture, void and refund, with disputes and reconciliation handled in the same place.",
      },
      {
        title: "Built for platforms",
        body: "Split payments, commissions, escrow and seller payouts for marketplaces.",
      },
      {
        title: "Agent checkout",
        body: "Agents pay with mandates from Access and machine-readable payment intents, with approvals above set amounts.",
      },
    ],
    groups: [
      {
        title: "Accept",
        items: [
          "Payment and checkout APIs",
          "Hosted checkout",
          "Payment links",
          "Virtual POS",
          "Tokenization and saved cards",
        ],
      },
      {
        title: "Lifecycle",
        items: [
          "Authorize and capture, partial or full",
          "Void and refund",
          "Chargebacks and disputes",
          "Payment status and retries",
          "Reconciliation",
        ],
      },
      {
        title: "Money movement",
        items: [
          "Merchant balance",
          "Settlement",
          "Scheduled and instant payouts",
          "Multi-currency settlement",
        ],
      },
      {
        title: "Marketplaces",
        items: [
          "Split payments",
          "Commissions and platform fees",
          "Escrow",
          "Sub-merchants and connected accounts",
          "Seller onboarding and payouts",
        ],
      },
      {
        title: "Developers",
        items: [
          "SDKs and webhooks",
          "Sandbox and test cards",
          "Developer dashboard and API keys",
          "Payment event stream",
          "Observability",
        ],
      },
    ],
    agent: {
      lead: "Access decides whether an agent may pay, Money decides where the money comes from, and Pay makes the payment happen.",
      items: [
        "Agent checkout",
        "Payment mandates",
        "Machine-readable payment intents",
        "Approval thresholds",
        "Agent-to-agent and procurement payments",
        "Purchase receipts for agents",
      ],
    },
    facts: [
      {
        label: "For",
        value: "Businesses, platforms and marketplaces",
      },
      {
        label: "Methods",
        value: "Cards, bank payments, Money and alternatives",
      },
      {
        label: "Integration",
        value: "APIs, SDKs, webhooks and hosted pages",
      },
      { label: "Status", value: "Planned" },
    ],
    connections: [
      {
        slug: "money",
        text: "Money is one of the ways people pay.",
      },
      {
        slug: "access",
        text: "Agent payments run on mandates from Access.",
      },
      {
        slug: "commerce",
        text: "Checkout for every store and the marketplace.",
      },
      {
        slug: "serve",
        text: "Payments at the table, the kiosk and the door.",
      },
    ],
    faq: [
      {
        question: "What is suiss Pay?",
        answer:
          "Payment infrastructure that lets businesses and platforms accept payments, manage refunds and disputes, settle funds and pay out sellers, with checkout that works for AI agents.",
      },
      {
        question: "How do agents pay with Pay?",
        answer:
          "An agent presents a mandate from Access and a machine-readable payment intent. Pay checks it, asks a person above set amounts, and leaves a receipt.",
      },
      {
        question: "Is Pay available?",
        answer: "Pay is planned.",
      },
    ],
  },
  {
    slug: "commerce",
    name: "Commerce",
    image: "/images/products/commerce.jpg",
    status: "planned",
    verb: "Buy and sell",
    category: "Agentic commerce",
    tagline: "A store for people. And their agents.",
    summary:
      "Commerce brings together a multi-seller marketplace, a platform for merchants to run their own stores, and commerce that agents can use. An agent can discover, compare, buy and return on your behalf, with Access deciding what it may spend and Relay keeping you posted.",
    description:
      "Commerce brings a multi-seller marketplace, a store platform for merchants and agent-ready commerce together, so agents can discover, compare and buy for you.",
    question: "What should be bought, from whom, and at what price?",
    principles: [
      {
        title: "A marketplace and a store builder",
        body: "Sell on the marketplace, on your own storefront, or both, from one catalog and one order system.",
      },
      {
        title: "Made for agents",
        body: "Products, offers and checkout are readable by agents, so a request like “find me a lighter laptop under a budget” can end in an order.",
      },
      {
        title: "Business buying too",
        body: "Procurement, requests for quotation, bulk orders and reordering for companies.",
      },
      {
        title: "Global from the start",
        body: "Multiple countries, currencies and languages, with tax, shipping and invoices built in.",
      },
    ],
    groups: [
      {
        title: "Marketplace",
        items: [
          "Multi-seller catalog with variants",
          "Search and recommendations",
          "Promotions and coupons",
          "Cart, checkout and orders",
          "Returns, shipping and fulfillment",
          "Reviews, ratings and Q&A",
        ],
      },
      {
        title: "Merchant platform",
        items: [
          "Store creation and custom domains",
          "Themes and headless storefront API",
          "Orders, inventory and customers",
          "Discounts, campaigns and loyalty",
          "Tax, invoices and shipping",
          "Extensions, webhooks and merchant API",
        ],
      },
      {
        title: "Business",
        items: [
          "B2B marketplace",
          "Procurement",
          "Requests for quotation",
          "Bulk purchasing",
          "Reordering and subscriptions",
        ],
      },
      {
        title: "Operations",
        items: [
          "Seller onboarding and seller center",
          "Warehouses and inventory",
          "Seller payouts and commissions",
          "Marketplace accounting",
          "Fraud and risk checks",
          "Customer service and disputes",
        ],
      },
    ],
    agent: {
      lead: "From a sentence to a delivered order: discover, compare, check authority, pay, and follow the delivery.",
      items: [
        "Product discovery by meaning",
        "Comparison and offer gathering",
        "Negotiation with sellers",
        "Agent cart and checkout",
        "Returns and warranty",
        "Booking, tickets and food orders",
      ],
    },
    facts: [
      {
        label: "For",
        value: "Shoppers, merchants, marketplaces and companies",
      },
      {
        label: "Selling",
        value: "Marketplace, own storefront or headless",
      },
      {
        label: "Reach",
        value: "Multi-country, multi-currency, multi-language",
      },
      { label: "Status", value: "Planned" },
    ],
    connections: [
      {
        slug: "pay",
        text: "Checkout and seller payouts.",
      },
      {
        slug: "access",
        text: "Decides what an agent may buy and spend.",
      },
      {
        slug: "relay",
        text: "Order and delivery updates to buyers and sellers.",
      },
    ],
    faq: [
      {
        question: "What is suiss Commerce?",
        answer:
          "A marketplace, a platform for merchants to run their own stores, and commerce that AI agents can use to buy on someone's behalf.",
      },
      {
        question: "Can an agent shop for me?",
        answer:
          "Yes. It can search, compare offers and check out, within the budget and limits you set through Access.",
      },
      {
        question: "Is Commerce available?",
        answer: "Commerce is planned.",
      },
    ],
  },
  {
    slug: "serve",
    name: "Serve",
    image: "/images/products/serve.jpg",
    status: "planned",
    verb: "Fulfill",
    category: "Restaurant platform",
    tagline: "The whole restaurant, on one system.",
    summary:
      "Serve brings a restaurant operating system, a food marketplace and a delivery network together. Every order from every channel lands in one place and goes straight to the kitchen, and agents help with stock, purchasing, scheduling, pricing and customer support.",
    description:
      "Serve brings a restaurant operating system, a food marketplace and a delivery network together: every order in one place, with agents helping run it.",
    question: "How does every order get cooked and delivered on time?",
    principles: [
      {
        title: "Every order in one place",
        body: "POS, kiosk, QR menu, phone and delivery apps all feed one order system and one kitchen display.",
      },
      {
        title: "Front to back",
        body: "Tables, menus, kitchen, stock, suppliers, staff and loyalty in one operating system.",
      },
      {
        title: "Your own delivery",
        body: "Dispatch, routing and live tracking with a courier app, with zones and pricing you control.",
      },
      {
        title: "Agents in the kitchen",
        body: "Agents watch stock, plan purchasing and shifts, adjust prices and answer customers, within the limits you set.",
      },
    ],
    groups: [
      {
        title: "Restaurant apps",
        items: [
          "POS and handheld POS",
          "Waiter app",
          "Kiosk",
          "Kitchen display",
          "Back office and manager app",
          "Customer and courier apps",
        ],
      },
      {
        title: "Operations",
        items: [
          "Orders, tables and reservations",
          "Menus and modifiers",
          "Inventory, procurement and suppliers",
          "Staff and shifts",
          "Loyalty and campaigns",
          "Analytics and accounting integration",
        ],
      },
      {
        title: "Marketplace",
        items: [
          "Restaurant discovery and search",
          "Menus, cart and checkout",
          "Live order tracking",
          "Group, scheduled and corporate orders",
          "Reviews, favorites and reorder",
        ],
      },
      {
        title: "Delivery network",
        items: [
          "Courier onboarding and availability",
          "Dispatch and assignment",
          "Route optimization and batching",
          "Live tracking and ETA",
          "Proof of delivery",
          "Delivery zones, pricing and earnings",
        ],
      },
    ],
    agent: {
      lead: "Restaurant agents run the routine work. Customer agents can order for people: “something high in protein, under budget, here in 30 minutes.”",
      items: [
        "Inventory and procurement agents",
        "Kitchen and scheduling agents",
        "Pricing and campaign agents",
        "Finance agent",
        "Customer support agent",
        "Orders placed by customers' agents",
      ],
    },
    facts: [
      {
        label: "For",
        value: "Restaurants, chains, couriers and diners",
      },
      {
        label: "Channels",
        value: "POS, kiosk, QR menu, phone, apps and delivery platforms",
      },
      {
        label: "Kitchen",
        value: "One kitchen display for every channel",
      },
      { label: "Status", value: "Planned" },
    ],
    connections: [
      {
        slug: "pay",
        text: "Payments at the table, the kiosk and the door.",
      },
      {
        slug: "commerce",
        text: "Food ordering for agents shopping on someone's behalf.",
      },
      {
        slug: "relay",
        text: "Order and delivery updates to diners, staff and couriers.",
      },
    ],
    faq: [
      {
        question: "What is suiss Serve?",
        answer:
          "A restaurant platform that combines an operating system for the restaurant, a food marketplace and a delivery network, with agents that help run the business.",
      },
      {
        question: "Does Serve work with delivery apps?",
        answer:
          "Orders from delivery platforms, the POS, kiosks, QR menus and phone calls all land in one order system and one kitchen display.",
      },
      {
        question: "Is Serve available?",
        answer: "Serve is planned.",
      },
    ],
  },
  {
    slug: "work",
    name: "Work",
    image: "/images/products/work.jpg",
    status: "development",
    verb: "Coordinate",
    category: "Work coordination",
    tagline: "Who promised what, what is waiting, and who is needed now.",
    summary:
      "Work coordinates work shared between people, AI agents, systems and machines. It records who promised what to whom, who acts on whose behalf, what each piece of work is waiting on and which decision falls to whom, and it brings each person only the items that need them. Work coordinates; the work itself is done by people and agents.",
    description:
      "Work coordinates work shared between people, AI agents, systems and machines: who promised what, what is waiting, and who is needed now.",
    question:
      "Who promised what to whom, what is waiting on what, and whose attention is needed now?",
    principles: [
      {
        title: "Commitments, not just tasks",
        body: "Someone requests, someone promises, someone delivers and someone accepts. Saying “done” is not the same as acceptance.",
      },
      {
        title: "Only what needs you",
        body: "Needs Attention shows only the items that need you, why now, and what happens if you wait. Briefing shows what changed while you were away.",
      },
      {
        title: "People and agents together",
        body: "Hand work to agents, watch progress live and step in. Every piece of work has one accountable owner and one driver at a time.",
      },
      {
        title: "Honest controls",
        body: "Stop, take over and change are offered only where the agent or system doing the work actually supports them.",
      },
      {
        title: "A record you can trust",
        body: "Every change is a signed record, and the state of work is computed from those records rather than edited by hand.",
      },
    ],
    groups: [
      {
        title: "Commitments",
        items: [
          "Request, promise, decline and counter-offer",
          "Conditional promises",
          "Declare done, then accept or reject",
          "Two-person acceptance",
          "Sub-commitments with risk roll-up",
          "Budgets, deadlines and regular updates",
        ],
      },
      {
        title: "Attention",
        items: [
          "Needs Attention",
          "Briefing",
          "My Work",
          "Waits that say who or what, why and until when",
          "Escalation through Relay",
          "Muting that never stops the clock",
        ],
      },
      {
        title: "Control",
        items: [
          "Accountable owner and single driver",
          "Take control and give back with a handoff note",
          "Stop now, finish safely or pause",
          "Automatic, intervened and manual modes",
          "Proceed, notify, require a decision or deny",
          "Queues and pools",
        ],
      },
      {
        title: "Decisions",
        items: [
          "Decision, acceptance and plan approval gates",
          "All, any, K-of-N and sequential approvals",
          "Live presence and control handoff",
          "Approvals never inferred from chat",
          "Authority checked by Access",
        ],
      },
      {
        title: "Trust",
        items: [
          "Signed, append-only records",
          "Offline verification",
          "Evidence and provenance",
          "Export and replay",
          "Work across organizations",
          "Crypto-shredding for personal data",
        ],
      },
      {
        title: "Extend",
        items: [
          "Practices: templates for each industry",
          "REST API",
          "CloudEvents and signed webhooks",
          "Importers for existing tools",
          "Web app and mobile app with offline queue",
        ],
      },
    ],
    agent: {
      lead: "Give work to agents and receive work from them over open protocols. Work never runs the agent; it keeps the commitment, the waits and the decisions honest.",
      items: [
        "Assign work to agents across machines",
        "A2A client and server",
        "MCP tools scoped to the caller's authority",
        "Controls offered only when the agent supports them",
        "Heartbeats and progress reports",
        "No agent can answer a human decision",
      ],
    },
    standards: [
      "A2A",
      "MCP",
      "CloudEvents",
      "REST",
      "OpenAPI",
      "W3C Trace Context",
    ],
    facts: [
      {
        label: "For",
        value: "Teams coordinating people, agents, systems and machines",
      },
      {
        label: "Built with",
        value: "Rust, with one core shared by server, web and mobile",
      },
      {
        label: "Clients",
        value: "Web app and mobile app",
      },
      {
        label: "Records",
        value: "Signed and verifiable offline",
      },
    ],
    connections: [
      {
        slug: "access",
        text: "Identity and authority; Work can narrow authority but never create it.",
      },
      {
        slug: "relay",
        text: "Notifications, real-time updates and escalation delivery.",
      },
      {
        slug: "one",
        text: "Your One takes part as your representative; its private context never enters Work.",
      },
    ],
    faq: [
      {
        question: "What is suiss Work?",
        answer:
          "A work coordination system for people and AI agents. It tracks commitments, what each piece of work is waiting on and whose decision or attention is needed.",
      },
      {
        question: "Does Work run AI agents?",
        answer:
          "No. Agents run wherever they run. Work assigns them work, follows their progress and offers controls like stop or take over when the agent supports them.",
      },
      {
        question: "How is a commitment different from a task?",
        answer:
          "A commitment has a requester and a promiser. It is finished when the requester accepts the delivery, not when the doer says it is done.",
      },
      {
        question: "Is Work available?",
        answer: "Work is in development.",
      },
    ],
  },
]

export const getProduct = (slug: string) =>
  products.find((product) => product.slug === slug)

export type Library = {
  slug: string
  name: string
  image: string
  url: string
  install: string
  status: string
  tagline: string
  points: string[]
}

export const libraries: Library[] = [
  {
    slug: "ui",
    name: "suiss/ui",
    image: "/images/products/ui.jpg",
    url: `${site.url}/ui`,
    install: "npx @esuiss/ui@latest init",
    status: "Open source · Available now",
    tagline:
      "Copy-paste components, patterns, charts and blocks with a clean, minimal design, for React, React Native, SwiftUI and Jetpack Compose.",
    points: [
      "React, React Native, SwiftUI and Jetpack Compose",
      "Base UI, Radix or React Aria",
      "One set of design tokens",
      "You own the code",
    ],
  },
]
