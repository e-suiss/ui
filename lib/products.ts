import type { Locale, Text } from "@/lib/i18n";

type Group = { title: Text; items: Record<Locale, string[]> };

export type Product = {
  slug: string;
  name: string;
  image: string;
  verb: Text;
  category: Text;
  tagline: Text;
  summary: Text;
  question: Text;
  groups: Group[];
  agent: Record<Locale, string[]>;
  related: string[];
};

export const products: Product[] = [
  {
    slug: "one",
    name: "One",
    image: "/images/products/one.jpg",
    verb: { en: "Understand", tr: "Anla" },
    category: { en: "Personal agent", tr: "Kişisel agent" },
    tagline: { en: "Your agent. On every device.", tr: "Senin agent'ın. Her cihazda." },
    summary: {
      en: "A persistent personal agent that belongs to you, works with any model, stays with you across devices, learns how you work and acts on your behalf when you let it.",
      tr: "Sana ait, her modelle çalışan, cihazlar arasında seninle kalan, nasıl çalıştığını öğrenen ve izin verdiğinde senin adına hareket eden kalıcı bir kişisel agent.",
    },
    question: {
      en: "What do you need, and how can it be done for you?",
      tr: "Neye ihtiyacın var ve bu senin için nasıl yapılabilir?",
    },
    groups: [
      {
        title: { en: "Yours", tr: "Senin" },
        items: {
          en: ["Owned by you", "Model independent", "Continuous across devices", "Learns your preferences", "Orchestrates models and tools"],
          tr: ["Sana ait", "Modelden bağımsız", "Cihazlar arasında sürekli", "Tercihlerini öğrenir", "Modelleri ve araçları yönetir"],
        },
      },
      {
        title: { en: "Everywhere", tr: "Her yerde" },
        items: {
          en: ["iPhone Dynamic Island and Live Activities", "Mac menu bar", "Windows, Linux and Android surfaces", "Watch, car and earbuds", "Glasses and future devices"],
          tr: ["iPhone Dynamic Island ve Live Activities", "Mac menü çubuğu", "Windows, Linux ve Android yüzeyleri", "Saat, araba ve kulaklık", "Gözlük ve gelecekteki cihazlar"],
        },
      },
      {
        title: { en: "Always clear", tr: "Her zaman net" },
        items: {
          en: ["Listening and thinking", "Searching and executing", "Waiting for your approval", "Completed or failed", "Local or cloud runtime"],
          tr: ["Dinliyor ve düşünüyor", "Arıyor ve yürütüyor", "Onayını bekliyor", "Tamamlandı ya da başarısız", "Yerel ya da bulut çalışma ortamı"],
        },
      },
    ],
    agent: {
      en: ["Capability router", "Execution arbitration", "Local tools and apps", "Cloud models and other agents", "Acts only with authority from Access"],
      tr: ["Yetenek yönlendirici", "Yürütme hakemliği", "Yerel araçlar ve uygulamalar", "Bulut modelleri ve diğer agent'lar", "Sadece Access'ten aldığı yetkiyle hareket eder"],
    },
    related: ["access", "relay", "money"],
  },
  {
    slug: "access",
    name: "Access",
    image: "/images/products/access.jpg",
    verb: { en: "Authorize", tr: "Yetkilendir" },
    category: { en: "Identity and authority", tr: "Kimlik ve yetki" },
    tagline: { en: "Authority for every actor.", tr: "Her aktör için yetki." },
    summary: {
      en: "One identity, authorization and delegation layer for people, services, machines, workloads and AI agents, from sign-in to delegated spending authority.",
      tr: "İnsanlar, servisler, makineler, iş yükleri ve AI agent'ları için tek bir kimlik, yetkilendirme ve delegasyon katmanı; girişten delege edilmiş harcama yetkisine kadar.",
    },
    question: {
      en: "Who or what may do what, on whose behalf, under which conditions?",
      tr: "Kim veya ne, neyi, kimin adına, hangi koşullar altında yapmaya yetkili?",
    },
    groups: [
      {
        title: { en: "Identity", tr: "Kimlik" },
        items: {
          en: ["User identity", "Service and workload identity", "Agent identity", "Authentication and sessions", "Credential lifecycle and revocation"],
          tr: ["Kullanıcı kimliği", "Servis ve iş yükü kimliği", "Agent kimliği", "Kimlik doğrulama ve oturumlar", "Kimlik bilgisi yaşam döngüsü ve iptal"],
        },
      },
      {
        title: { en: "Authorization", tr: "Yetkilendirme" },
        items: {
          en: ["RBAC, ABAC and ReBAC", "Fine-grained permissions", "Policy engine", "Risk-based and step-up checks", "Multi-tenant authorization"],
          tr: ["RBAC, ABAC ve ReBAC", "İnce taneli izinler", "Politika motoru", "Risk tabanlı ve ek doğrulama", "Çok kiracılı yetkilendirme"],
        },
      },
      {
        title: { en: "Delegation", tr: "Delegasyon" },
        items: {
          en: ["Delegation chains", "Consent and approval flows", "Authority intersection", "Service-to-service auth", "Complete audit logs"],
          tr: ["Delegasyon zincirleri", "Onay ve izin akışları", "Yetki kesişimi", "Servisler arası kimlik doğrulama", "Eksiksiz denetim kayıtları"],
        },
      },
    ],
    agent: {
      en: ["Agent permissions and sessions", "Sub-agent delegation", "Budget and spending limits", "Merchant, category and purpose restrictions", "Payment mandates", "Human approval"],
      tr: ["Agent izinleri ve oturumları", "Alt agent delegasyonu", "Bütçe ve harcama limitleri", "Satıcı, kategori ve amaç kısıtları", "Ödeme talimatları", "İnsan onayı"],
    },
    related: ["one", "money", "pay"],
  },
  {
    slug: "relay",
    name: "Relay",
    image: "/images/products/relay.jpg",
    verb: { en: "Communicate", tr: "İlet" },
    category: { en: "Events and messaging", tr: "Event ve mesajlaşma" },
    tagline: { en: "Every message, delivered.", tr: "Her mesaj, yerine ulaşır." },
    summary: {
      en: "Notification, messaging and event orchestration between people, devices, apps, services and agents, across every channel, with retries, preferences and delivery you can see.",
      tr: "İnsanlar, cihazlar, uygulamalar, servisler ve agent'lar arasında her kanalda bildirim, mesajlaşma ve event orkestrasyonu; yeniden denemeler, tercihler ve görünür teslimatla.",
    },
    question: {
      en: "How does this event or message reach the right person, service, device or agent?",
      tr: "Bu event ya da mesaj doğru kişiye, servise, cihaza ya da agent'a nasıl ulaşır?",
    },
    groups: [
      {
        title: { en: "Channels", tr: "Kanallar" },
        items: {
          en: ["Push, email and SMS", "In-app and realtime", "Webhooks", "Multi-channel routing", "Provider failover"],
          tr: ["Push, e-posta ve SMS", "Uygulama içi ve gerçek zamanlı", "Webhook'lar", "Çok kanallı yönlendirme", "Sağlayıcı yedekleme"],
        },
      },
      {
        title: { en: "Delivery", tr: "Teslimat" },
        items: {
          en: ["Scheduling and quiet hours", "Retry and backoff", "Deduplication and idempotency", "Rate limiting", "Dead-letter handling"],
          tr: ["Zamanlama ve sessiz saatler", "Yeniden deneme ve geri çekilme", "Tekilleştirme ve idempotency", "Hız sınırlama", "Teslim edilemeyen mesaj yönetimi"],
        },
      },
      {
        title: { en: "Content", tr: "İçerik" },
        items: {
          en: ["Templates", "Localization", "Personalization", "User preferences", "Delivery analytics"],
          tr: ["Şablonlar", "Yerelleştirme", "Kişiselleştirme", "Kullanıcı tercihleri", "Teslimat analitiği"],
        },
      },
    ],
    agent: {
      en: ["Agent-to-agent events", "Agent wake-up and resume", "Human approval requests", "Durable agent mailbox", "Timeouts and escalation", "Cross-device fanout"],
      tr: ["Agent'lar arası event'ler", "Agent uyandırma ve devam ettirme", "İnsan onayı istekleri", "Kalıcı agent posta kutusu", "Zaman aşımı ve eskalasyon", "Cihazlar arası dağıtım"],
    },
    related: ["one", "work", "commerce"],
  },
  {
    slug: "money",
    name: "Money",
    image: "/images/products/money.jpg",
    verb: { en: "Hold", tr: "Tut" },
    category: { en: "Personal money", tr: "Kişisel para" },
    tagline: { en: "Your money, in one place.", tr: "Paran, tek bir yerde." },
    summary: {
      en: "A personal money account with cards, transfers, budgets, multiple currencies and rewards, ready for agents that spend only within the limits you set.",
      tr: "Kartlar, transferler, bütçeler, çoklu para birimi ve ödüllerle kişisel bir para hesabı; sadece senin belirlediğin limitler içinde harcayan agent'lara hazır.",
    },
    question: {
      en: "Which of your accounts, balances or cards should be used?",
      tr: "Hangi hesabın, bakiyen ya da kartın kullanılmalı?",
    },
    groups: [
      {
        title: { en: "Account and cards", tr: "Hesap ve kartlar" },
        items: {
          en: ["Multi-currency balance", "Physical and virtual cards", "Single-use cards", "Freeze and spending controls", "Statements"],
          tr: ["Çoklu para birimli bakiye", "Fiziksel ve sanal kartlar", "Tek kullanımlık kartlar", "Dondurma ve harcama kontrolleri", "Hesap özetleri"],
        },
      },
      {
        title: { en: "Moving money", tr: "Para hareketi" },
        items: {
          en: ["Send and request money", "Bank transfers", "Scheduled and recurring transfers", "QR and contactless payments", "Automatic top-up"],
          tr: ["Para gönder ve iste", "Banka transferleri", "Zamanlanmış ve tekrarlayan transferler", "QR ve temassız ödeme", "Otomatik bakiye yükleme"],
        },
      },
      {
        title: { en: "Insight and protection", tr: "Görünürlük ve koruma" },
        items: {
          en: ["Spending analytics and budgets", "Subscription management", "Cashback and rewards", "Disputes and refunds", "Fraud protection"],
          tr: ["Harcama analitiği ve bütçeler", "Abonelik yönetimi", "Nakit iade ve ödüller", "İtiraz ve iadeler", "Dolandırıcılık koruması"],
        },
      },
    ],
    agent: {
      en: ["Delegated wallet access", "Agent virtual cards", "Budget-aware spending", "Merchant and purpose limits", "Agent spending receipts", "Authority checked by Access"],
      tr: ["Delege edilmiş cüzdan erişimi", "Agent sanal kartları", "Bütçeye duyarlı harcama", "Satıcı ve amaç limitleri", "Agent harcama makbuzları", "Yetki Access tarafından denetlenir"],
    },
    related: ["access", "pay", "commerce"],
  },
  {
    slug: "pay",
    name: "Pay",
    image: "/images/products/pay.jpg",
    verb: { en: "Move", tr: "Taşı" },
    category: { en: "Payment infrastructure", tr: "Ödeme altyapısı" },
    tagline: { en: "Accept payments. From anyone, or any agent.", tr: "Ödeme al. Herkesten ya da her agent'tan." },
    summary: {
      en: "Payment infrastructure for businesses and platforms: checkout, virtual POS, payouts and marketplace payments, with agent-native checkout built in.",
      tr: "İşletmeler ve platformlar için ödeme altyapısı: checkout, sanal POS, ödemeler ve pazaryeri ödemeleri; agent-native checkout dahil.",
    },
    question: {
      en: "How does a payment actually reach the merchant?",
      tr: "Bir ödeme satıcıya gerçekte nasıl ulaşır?",
    },
    groups: [
      {
        title: { en: "Accept", tr: "Ödeme al" },
        items: {
          en: ["Payment and checkout APIs", "Hosted checkout and payment links", "Virtual POS", "Cards, bank and alternative methods", "Tokenization"],
          tr: ["Ödeme ve checkout API'leri", "Barındırılan checkout ve ödeme linkleri", "Sanal POS", "Kart, banka ve alternatif yöntemler", "Tokenizasyon"],
        },
      },
      {
        title: { en: "Manage", tr: "Yönet" },
        items: {
          en: ["Capture, void and refund", "Chargebacks and disputes", "Settlement and payouts", "Split and marketplace payments", "Reconciliation"],
          tr: ["Tahsilat, iptal ve iade", "Ters ibraz ve itirazlar", "Mutabakat ve ödemeler", "Bölünmüş ve pazaryeri ödemeleri", "Uzlaştırma"],
        },
      },
      {
        title: { en: "Build", tr: "Geliştir" },
        items: {
          en: ["SDKs and webhooks", "Sandbox and test cards", "Developer dashboard", "Payment event stream", "Observability"],
          tr: ["SDK'lar ve webhook'lar", "Sandbox ve test kartları", "Geliştirici paneli", "Ödeme event akışı", "Gözlemlenebilirlik"],
        },
      },
    ],
    agent: {
      en: ["Agent checkout", "Payment mandates", "Machine-readable payment intents", "Approval thresholds", "Agent-to-agent payments", "Agent purchase receipts"],
      tr: ["Agent checkout", "Ödeme talimatları", "Makine tarafından okunabilir ödeme niyetleri", "Onay eşikleri", "Agent'lar arası ödemeler", "Agent satın alma makbuzları"],
    },
    related: ["money", "access", "commerce"],
  },
  {
    slug: "commerce",
    name: "Commerce",
    image: "/images/products/commerce.jpg",
    verb: { en: "Buy and sell", tr: "Al ve sat" },
    category: { en: "Agentic commerce", tr: "Agent'lı ticaret" },
    tagline: { en: "A store for people. And their agents.", tr: "İnsanlar için bir mağaza. Ve agent'ları için." },
    summary: {
      en: "A global marketplace, a platform for merchants to run their own stores, and commerce that agents can use: discover, compare, buy and return on your behalf.",
      tr: "Küresel bir pazaryeri, satıcıların kendi mağazalarını yönettiği bir platform ve agent'ların kullanabildiği ticaret: senin adına keşfet, karşılaştır, satın al ve iade et.",
    },
    question: {
      en: "What should be bought, from whom, and at what price?",
      tr: "Ne, kimden ve hangi fiyata satın alınmalı?",
    },
    groups: [
      {
        title: { en: "Marketplace", tr: "Pazaryeri" },
        items: {
          en: ["Multi-seller catalog", "Search and recommendations", "Cart, checkout and orders", "Returns and shipping", "Reviews and Q&A"],
          tr: ["Çok satıcılı katalog", "Arama ve öneriler", "Sepet, checkout ve siparişler", "İade ve kargo", "Yorumlar ve soru-cevap"],
        },
      },
      {
        title: { en: "Merchants", tr: "Satıcılar" },
        items: {
          en: ["Storefronts and custom domains", "Headless commerce API", "Orders, inventory and customers", "Campaigns and loyalty", "Multi-country and multi-currency"],
          tr: ["Vitrinler ve özel alan adları", "Headless ticaret API'si", "Sipariş, stok ve müşteriler", "Kampanyalar ve sadakat", "Çok ülkeli ve çok para birimli"],
        },
      },
      {
        title: { en: "Business", tr: "Kurumsal" },
        items: {
          en: ["B2B procurement", "Requests for quotation", "Bulk purchasing", "Reordering", "Subscriptions"],
          tr: ["B2B satın alma", "Teklif talepleri", "Toplu alım", "Tekrar sipariş", "Abonelikler"],
        },
      },
    ],
    agent: {
      en: ["Semantic product discovery", "Comparison and offer gathering", "Seller negotiation", "Autonomous cart and checkout", "Returns and warranty", "Booking and ticketing"],
      tr: ["Anlamsal ürün keşfi", "Karşılaştırma ve teklif toplama", "Satıcıyla pazarlık", "Otonom sepet ve checkout", "İade ve garanti", "Rezervasyon ve biletleme"],
    },
    related: ["pay", "money", "relay"],
  },
  {
    slug: "serve",
    name: "Serve",
    image: "/images/products/serve.jpg",
    verb: { en: "Fulfill", tr: "Gerçekleştir" },
    category: { en: "Restaurant platform", tr: "Restoran platformu" },
    tagline: { en: "The restaurant, run by one system.", tr: "Restoran, tek sistemle yönetilir." },
    summary: {
      en: "A restaurant operating system, a food marketplace and a delivery network in one, with every order from every channel landing in one place and agents that help run the kitchen.",
      tr: "Restoran işletim sistemi, yemek pazaryeri ve teslimat ağı bir arada; her kanaldan gelen her sipariş tek bir yere düşer ve agent'lar mutfağın yönetimine yardım eder.",
    },
    question: {
      en: "How does every order get cooked and delivered on time?",
      tr: "Her sipariş zamanında nasıl hazırlanır ve teslim edilir?",
    },
    groups: [
      {
        title: { en: "Restaurant OS", tr: "Restoran OS" },
        items: {
          en: ["POS, handheld and kiosk", "Kitchen display", "Tables and reservations", "Inventory and suppliers", "Staff and shifts"],
          tr: ["POS, el terminali ve kiosk", "Mutfak ekranı", "Masalar ve rezervasyonlar", "Stok ve tedarikçiler", "Personel ve vardiyalar"],
        },
      },
      {
        title: { en: "Marketplace", tr: "Pazaryeri" },
        items: {
          en: ["Restaurant discovery", "Menus, cart and checkout", "Live order tracking", "Group and scheduled orders", "Reviews and favorites"],
          tr: ["Restoran keşfi", "Menü, sepet ve checkout", "Canlı sipariş takibi", "Grup ve zamanlanmış siparişler", "Yorumlar ve favoriler"],
        },
      },
      {
        title: { en: "Delivery", tr: "Teslimat" },
        items: {
          en: ["Dispatch and assignment", "Route optimization", "Live tracking and ETA", "Proof of delivery", "Courier earnings"],
          tr: ["Dağıtım ve atama", "Rota optimizasyonu", "Canlı takip ve tahmini varış", "Teslimat kanıtı", "Kurye kazançları"],
        },
      },
    ],
    agent: {
      en: ["Unified orders from every channel", "Inventory and procurement agents", "Kitchen and scheduling agents", "Pricing and campaign agents", "Customer support agent", "Ordering by agents"],
      tr: ["Her kanaldan birleşik siparişler", "Stok ve satın alma agent'ları", "Mutfak ve vardiya agent'ları", "Fiyat ve kampanya agent'ları", "Müşteri destek agent'ı", "Agent'larla sipariş"],
    },
    related: ["commerce", "pay", "relay"],
  },
  {
    slug: "work",
    name: "Work",
    image: "/images/products/work.jpg",
    verb: { en: "Collaborate", tr: "Birlikte çalış" },
    category: { en: "Collaborative agent sessions", tr: "Ortak agent oturumları" },
    tagline: { en: "Work with agents. Together.", tr: "Agent'larla çalış. Birlikte." },
    summary: {
      en: "A multiplayer workspace where several people join the same agent session in real time, see what it does, steer it, approve its steps and take control when needed.",
      tr: "Birden fazla insanın aynı agent oturumuna gerçek zamanlı katıldığı, agent'ın ne yaptığını gördüğü, onu yönlendirdiği, adımlarını onayladığı ve gerektiğinde kontrolü aldığı çok oyunculu bir çalışma alanı.",
    },
    question: {
      en: "Why should working with an agent be a single-player chat?",
      tr: "Bir agent ile çalışmak neden tek kişilik bir sohbet olsun?",
    },
    groups: [
      {
        title: { en: "Together", tr: "Birlikte" },
        items: {
          en: ["Shared agent sessions", "Presence", "Observer and controller modes", "Roles and permissions", "Live prompting"],
          tr: ["Ortak agent oturumları", "Anlık varlık", "İzleyici ve kontrol modları", "Roller ve izinler", "Canlı yönlendirme"],
        },
      },
      {
        title: { en: "In control", tr: "Kontrolde" },
        items: {
          en: ["Pause, resume and cancel", "Approve or reject steps", "Take and hand over control", "Multi-user approval", "Session replay and audit"],
          tr: ["Duraklat, devam et ve iptal", "Adımları onayla ya da reddet", "Kontrolü al ve devret", "Çok kişili onay", "Oturum tekrarı ve denetim"],
        },
      },
      {
        title: { en: "Shared", tr: "Ortak" },
        items: {
          en: ["Shared context and memory", "Shared artifacts", "Shared terminal", "Shared browser", "Shared code execution"],
          tr: ["Ortak bağlam ve hafıza", "Ortak çıktılar", "Ortak terminal", "Ortak tarayıcı", "Ortak kod çalıştırma"],
        },
      },
    ],
    agent: {
      en: ["Agent activity stream", "Human intervention", "Sub-agents", "Agent delegation", "Collaborative memory", "Permissions from Access"],
      tr: ["Agent etkinlik akışı", "İnsan müdahalesi", "Alt agent'lar", "Agent delegasyonu", "Ortak hafıza", "İzinler Access'ten"],
    },
    related: ["one", "access", "relay"],
  },
];

export const getProduct = (slug: string) => products.find((product) => product.slug === slug);

export type Library = {
  slug: string;
  name: string;
  image: string;
  url: string;
  install: string;
  tagline: Text;
};

export const libraries: Library[] = [
  {
    slug: "ui",
    name: "suiss/ui",
    image: "/images/products/ui.jpg",
    url: "https://ui.suiss.app",
    install: "npx @esuiss/ui@latest init",
    tagline: {
      en: "Copy-paste React components, patterns, charts and blocks built on Base UI and Tailwind CSS.",
      tr: "Base UI ve Tailwind CSS üzerine kurulu, kopyala-yapıştır React bileşenleri, kalıpları, grafikleri ve blokları.",
    },
  },
  {
    slug: "uim",
    name: "suiss/uim",
    image: "/images/products/uim.jpg",
    url: "https://uim.suiss.app",
    install: "npx @esuiss/uim@latest init",
    tagline: {
      en: "Copy-paste React Native components for Expo, styled with Uniwind, NativeWind or StyleSheet.",
      tr: "Expo için Uniwind, NativeWind ya da StyleSheet ile stillenen kopyala-yapıştır React Native bileşenleri.",
    },
  },
];
