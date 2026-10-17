import type { Locale, Text } from "@/lib/i18n"
import { site } from "@/lib/site"

type List = Record<Locale, string[]>

const t = (en: string, tr: string): Text => ({ en, tr })
const l = (en: string[], tr: string[]): List => ({ en, tr })

type Status = "development" | "planned"

export type Product = {
  slug: string
  name: string
  image: string
  status: Status
  verb: Text
  category: Text
  tagline: Text
  summary: Text
  description: Text
  question: Text
  principles: { title: Text; body: Text }[]
  groups: { title: Text; items: List }[]
  agent: { lead: Text; items: List }
  rules?: { title: Text; lead: Text; items: List }
  standards?: string[]
  facts: { label: Text; value: Text }[]
  connections: { slug: string; text: Text }[]
  faq: { question: Text; answer: Text }[]
}

export const products: Product[] = [
  {
    slug: "one",
    name: "One",
    image: "/images/products/one.jpg",
    status: "development",
    verb: t("Understand", "Anla"),
    category: t("Personal agent", "Kişisel agent"),
    tagline: t(
      "The personal agent that works for you.",
      "Senin için çalışan kişisel agent."
    ),
    summary: t(
      "One is a personal agent that belongs to you, not to a model provider. It learns how you live and work through memory you can see and correct, keeps your tasks going across your devices, acts only within the limits you set, and interrupts you only when it is worth it.",
      "One, bir model sağlayıcısına değil sana ait kişisel bir agent. Görebildiğin ve düzeltebildiğin bir hafızayla nasıl yaşadığını ve çalıştığını öğrenir, işlerini cihazların arasında sürdürür, sadece senin belirlediğin sınırlar içinde hareket eder ve seni yalnızca gerçekten değdiğinde rahatsız eder."
    ),
    description: t(
      "One is a personal agent that belongs to you, not a model provider: memory you can see and correct, tasks across devices, and only the limits you set.",
      "One, bir model sağlayıcısına değil sana ait kişisel bir agent: görüp düzeltebildiğin hafıza, cihazlar arasında süren işler ve senin belirlediğin sınırlar."
    ),
    question: t(
      "What should be done for you now, who should do it, and is it worth interrupting you?",
      "Şu an senin için ne yapılmalı, bunu kim yapmalı ve seni rahatsız etmeye değer mi?"
    ),
    principles: [
      {
        title: t(
          "Remembers you, on your terms",
          "Seni, senin koşullarınla hatırlar"
        ),
        body: t(
          "Every memory shows where it came from: something you said, something One observed or something it inferred. You can correct it, stop it being used or forget it for good.",
          "Her hatıra nereden geldiğini gösterir: senin söylediğin, One'ın gözlemlediği ya da çıkardığı bir şey. Düzeltebilir, kullanımını durdurabilir ya da tamamen unutturabilirsin."
        ),
      },
      {
        title: t(
          "Acts within your limits",
          "Senin sınırların içinde hareket eder"
        ),
        body: t(
          "For each kind of action you choose: do it, ask me first, or leave it to me. Authority comes from Access, never from a conversation.",
          "Her işlem türü için sen seçersin: yap, önce bana sor ya da bana bırak. Yetki bir sohbetten değil, Access'ten gelir."
        ),
      },
      {
        title: t("Protects your attention", "Dikkatini korur"),
        body: t(
          "A small daily interruption budget, a clear “why now?” on every interruption, and a daily summary that ends. One is never built to keep you scrolling.",
          "Küçük bir günlük bölme bütçesi, her bildirimde net bir “neden şimdi?” ve biten bir günlük özet. One seni ekranda tutmak için tasarlanmaz."
        ),
      },
      {
        title: t("Independent of any model", "Hiçbir modele bağlı değil"),
        body: t(
          "Your memory, tasks, personality and permissions live outside the model. You never have to pick one, and your agent stays the same when models change.",
          "Hafızan, işlerin, kişiliğin ve izinlerin modelin dışında durur. Model seçmek zorunda kalmazsın; modeller değişse de agent'ın aynı kalır."
        ),
      },
      {
        title: t("Private and yours", "Gizli ve sana ait"),
        body: t(
          "Your keys stay on your devices and data is processed so that suiss cannot read it. It is never used for advertising, and you can export everything.",
          "Anahtarların cihazlarında kalır ve verin suiss'in okuyamayacağı şekilde işlenir. Asla reklam için kullanılmaz ve her şeyi dışa aktarabilirsin."
        ),
      },
      {
        title: t(
          "Works with other people's agents",
          "Başkalarının agent'larıyla çalışır"
        ),
        body: t(
          "Your One can propose, counter and agree with someone else's One. Agreements become commitments in Work.",
          "One'ın, başka birinin One'ıyla teklif yapabilir, karşı teklif verebilir ve anlaşabilir. Anlaşmalar Work'te taahhüde dönüşür."
        ),
      },
    ],
    groups: [
      {
        title: t("Memory", "Hafıza"),
        items: l(
          [
            "Source on every memory: said, observed or inferred",
            "Correct, don't use, or forget for good",
            "Life areas and your own projects",
            "A screen that shows how One knows you",
            "Full structured export",
          ],
          [
            "Her hatırada kaynak: söylenen, gözlenen ya da çıkarılan",
            "Düzelt, kullanma ya da tamamen unut",
            "Yaşam alanları ve kendi projelerin",
            "One'ın seni nasıl tanıdığını gösteren ekran",
            "Eksiksiz yapılandırılmış dışa aktarma",
          ]
        ),
      },
      {
        title: t("Tasks", "İşler"),
        items: l(
          [
            "Plans with steps, checkpoints and a clear finish",
            "Official APIs and app actions first",
            "A cloud browser that identifies itself",
            "Long tasks that survive restarts",
            "Hand-off to you when only you can do it",
          ],
          [
            "Adımları, kontrol noktaları ve net bir bitişi olan planlar",
            "Önce resmi API'ler ve uygulama eylemleri",
            "Kendini tanıtan bir bulut tarayıcı",
            "Yeniden başlatmalara dayanan uzun işler",
            "Sadece senin yapabileceğin yerde işi sana devreder",
          ]
        ),
      },
      {
        title: t("Autonomy", "Özerklik"),
        items: l(
          [
            "Act, act if pre-approved, ask, or hand off",
            "Rules in plain language with a preview",
            "“If this, do that, up to this amount, until this date”",
            "Undo only where an action is truly reversible",
            "What are you doing? Why? Stop. Undo. Don't do this again.",
          ],
          [
            "Yap, önceden onaylıysa yap, sor ya da devret",
            "Önizlemeli, sade dilde kurallar",
            "“Şu olursa bunu yap, şu tutara kadar, şu tarihe kadar”",
            "Geri alma sadece gerçekten geri alınabilen işlemlerde",
            "Ne yapıyorsun? Neden? Dur. Geri al. Bunu bir daha yapma.",
          ]
        ),
      },
      {
        title: t("Attention", "Dikkat"),
        items: l(
          [
            "Decided on your device",
            "Four interruption levels",
            "A daily interruption budget you set",
            "Waits for your next natural break",
            "Quiet hours and focus modes as hard limits",
          ],
          [
            "Kararı cihazında verilir",
            "Dört bölme seviyesi",
            "Senin belirlediğin günlük bölme bütçesi",
            "Bir sonraki doğal molanı bekler",
            "Sessiz saatler ve odak modları kesin sınır",
          ]
        ),
      },
      {
        title: t("Everywhere you are", "Olduğun her yerde"),
        items: l(
          [
            "iPhone and iPad: widgets, Live Activities, Shortcuts",
            "Android: quick settings and live updates",
            "Mac menu bar, Windows and Linux tray",
            "Watch for status and quick approvals",
            "CarPlay and Android Auto by voice",
            "Turkish and English",
          ],
          [
            "iPhone ve iPad: widget'lar, Live Activities, Kestirmeler",
            "Android: hızlı ayarlar ve canlı güncellemeler",
            "Mac menü çubuğu, Windows ve Linux tepsisi",
            "Durum ve hızlı onaylar için saat",
            "Sesle CarPlay ve Android Auto",
            "Türkçe ve İngilizce",
          ]
        ),
      },
    ],
    agent: {
      lead: t(
        "One plans the work, Access decides whether it may happen, and the action runs through a controlled executor. The model never holds your credentials.",
        "One işi planlar, Access yapılıp yapılamayacağına karar verir ve işlem kontrollü bir yürütücüden geçer. Model kimlik bilgilerini asla tutmaz."
      ),
      items: l(
        [
          "Sub-agents that report back",
          "Capabilities named by meaning",
          "Browser extension and desktop helper",
          "Bridge to your own coding agents",
          "Content from emails and web pages treated as data, not instructions",
          "Agent-to-agent agreements",
        ],
        [
          "Rapor veren alt agent'lar",
          "Anlamına göre adlandırılmış yetenekler",
          "Tarayıcı eklentisi ve masaüstü yardımcısı",
          "Kendi kodlama agent'larına köprü",
          "E-posta ve web içeriği talimat değil veri olarak işlenir",
          "Agent'lar arası anlaşmalar",
        ]
      ),
    },
    rules: {
      title: t("Never on its own", "Asla kendi başına"),
      lead: t(
        "Some actions always need you, whatever your settings say.",
        "Ayarların ne derse desin, bazı işlemler her zaman sana ihtiyaç duyar."
      ),
      items: l(
        [
          "Change passwords, two-factor or recovery settings",
          "Add a payment method",
          "Widen its own permissions",
          "Delete your account or wipe its memory",
          "Send money to a new recipient for the first time",
          "Share sensitive data with someone new",
          "Sign out or authorize devices",
          "Install software",
        ],
        [
          "Şifre, iki adımlı doğrulama ya da kurtarma ayarlarını değiştirmek",
          "Ödeme yöntemi eklemek",
          "Kendi izinlerini genişletmek",
          "Hesabını silmek ya da hafızasını sıfırlamak",
          "Yeni bir alıcıya ilk kez para göndermek",
          "Hassas veriyi ilk kez yeni biriyle paylaşmak",
          "Cihazların oturumunu kapatmak ya da yetkilendirmek",
          "Yazılım kurmak",
        ]
      ),
    },
    standards: ["MCP", "A2A", "App Intents", "Web Bot Auth", "WCAG 2.2 AA"],
    facts: [
      {
        label: t("Models", "Modeller"),
        value: t(
          "Operated by suiss, chosen for you per request",
          "suiss tarafından işletilir, her istek için senin yerine seçilir"
        ),
      },
      {
        label: t("On device", "Cihazda"),
        value: t(
          "Attention decisions, voice detection and an offline core",
          "Dikkat kararları, ses algılama ve çevrimdışı çekirdek"
        ),
      },
      {
        label: t("Privacy", "Gizlilik"),
        value: t(
          "Keys on your devices, processing suiss cannot read",
          "Anahtarlar cihazlarında, suiss'in okuyamadığı işleme"
        ),
      },
      {
        label: t("Hardware", "Donanım"),
        value: t("No suiss device required", "suiss cihazı gerekmez"),
      },
      {
        label: t("Languages", "Diller"),
        value: t("Turkish and English", "Türkçe ve İngilizce"),
      },
      {
        label: t("If One ever closes", "One kapanırsa"),
        value: t(
          "At least 90 days' notice, then 30 days to export",
          "En az 90 gün önceden haber, ardından 30 gün dışa aktarma"
        ),
      },
    ],
    connections: [
      {
        slug: "access",
        text: t(
          "Holds One's permissions and approvals. One cannot create authority from memory or conversation.",
          "One'ın izinlerini ve onaylarını tutar. One hafızadan ya da sohbetten yetki üretemez."
        ),
      },
      {
        slug: "relay",
        text: t(
          "Delivers One's interruptions, waits and messages between agents.",
          "One'ın bildirimlerini, beklemelerini ve agent'lar arası mesajlarını iletir."
        ),
      },
      {
        slug: "work",
        text: t(
          "Anything promised to someone else becomes a commitment in Work.",
          "Başkasına verilen her söz Work'te bir taahhüt olur."
        ),
      },
      {
        slug: "pay",
        text: t(
          "Every payment goes through Pay. One never sees card data.",
          "Her ödeme Pay'den geçer. One kart verisini asla görmez."
        ),
      },
    ],
    faq: [
      {
        question: t("What is suiss One?", "suiss One nedir?"),
        answer: t(
          "A personal agent that belongs to you. It remembers what matters with memory you control, does tasks for you within limits you set, and works on your phone, computer, watch and car.",
          "Sana ait kişisel bir agent. Kontrolü sende olan bir hafızayla önemli olanı hatırlar, belirlediğin sınırlar içinde işlerini yapar ve telefonunda, bilgisayarında, saatinde ve arabanda çalışır."
        ),
      },
      {
        question: t(
          "Which AI model does One use?",
          "One hangi yapay zekâ modelini kullanır?"
        ),
        answer: t(
          "You don't have to choose. suiss operates the models and picks one per request. Your memory and permissions live outside the model, so One stays the same when models change.",
          "Seçmek zorunda değilsin. Modelleri suiss işletir ve her istek için birini seçer. Hafızan ve izinlerin modelin dışında durur; modeller değişse de One aynı kalır."
        ),
      },
      {
        question: t(
          "Can One spend money or change my accounts?",
          "One para harcayabilir ya da hesaplarımı değiştirebilir mi?"
        ),
        answer: t(
          "Only within limits you approve through Access, and some actions, like adding a payment method or changing your password, always need you.",
          "Sadece Access üzerinden onayladığın sınırlar içinde. Ödeme yöntemi eklemek ya da şifre değiştirmek gibi bazı işlemler her zaman seni gerektirir."
        ),
      },
      {
        question: t("Is One available?", "One kullanılabilir mi?"),
        answer: t("One is in development.", "One geliştiriliyor."),
      },
    ],
  },
  {
    slug: "access",
    name: "Access",
    image: "/images/products/access.jpg",
    status: "development",
    verb: t("Authorize", "Yetkilendir"),
    category: t("Identity and authority", "Kimlik ve yetki"),
    tagline: t(
      "Identity and authority for people, organizations and AI agents.",
      "İnsanlar, kurumlar ve AI agent'ları için kimlik ve yetki."
    ),
    summary: t(
      "Access is a complete identity provider with authority built in. It signs in people, services, devices and AI agents over standard protocols, and before an action happens it decides whether that actor, on that authority, may do this exact thing now: allow, deny, or say what is still required. Every decision leaves a signed record that others can check without asking suiss.",
      "Access, yetkinin içine yerleştirildiği eksiksiz bir kimlik sağlayıcı. İnsanları, servisleri, cihazları ve AI agent'larını standart protokollerle oturum açtırır ve bir işlem gerçekleşmeden önce o aktörün, o yetkiyle, tam bu işi şimdi yapıp yapamayacağına karar verir: izin ver, reddet ya da neyin eksik olduğunu söyle. Her karar, başkalarının suiss'e sormadan doğrulayabileceği imzalı bir kayıt bırakır."
    ),
    description: t(
      "Access is an identity provider with authority built in. It signs in people, services, devices and AI agents and decides what each may do, with signed records.",
      "Access, yetkinin içinde olduğu bir kimlik sağlayıcı: insanları, servisleri, cihazları ve AI agent'larını oturum açtırır, ne yapabileceklerine karar verir."
    ),
    question: t(
      "May this actor, on this authority, do this exact thing now?",
      "Bu aktör, bu yetkiyle, tam bu işi şimdi yapabilir mi?"
    ),
    principles: [
      {
        title: t("Two planes, one product", "İki düzlem, tek ürün"),
        body: t(
          "A full identity provider plus explicit, checkable authority. Signing in never grants authority on its own.",
          "Eksiksiz bir kimlik sağlayıcı artı açık, denetlenebilir yetki. Oturum açmak tek başına asla yetki vermez."
        ),
      },
      {
        title: t("Delegation only narrows", "Delegasyon sadece daralır"),
        body: t(
          "Grants, mandates and delegation chains can never widen. Every action is checked against scope, amount, time, purpose and budget.",
          "Yetkiler, talimatlar ve delegasyon zincirleri asla genişleyemez. Her işlem kapsam, tutar, zaman, amaç ve bütçeye göre denetlenir."
        ),
      },
      {
        title: t("Approvals bound to intent", "Niyete bağlı onaylar"),
        body: t(
          "A human approval is tied to the exact action it approves, so it can be proven later and cannot be reused for something else.",
          "Bir insan onayı, onayladığı işlemin kendisine bağlıdır; sonradan kanıtlanabilir ve başka bir iş için tekrar kullanılamaz."
        ),
      },
      {
        title: t("Revocation that cascades", "Zincirleme iptal"),
        body: t(
          "Revoke, suspend or narrow authority, and the change applies from the moment it is committed, down the whole delegation chain.",
          "Yetkiyi iptal et, askıya al ya da daralt; değişiklik kaydedildiği andan itibaren tüm delegasyon zincirine uygulanır."
        ),
      },
      {
        title: t("Records you can verify", "Doğrulanabilir kayıtlar"),
        body: t(
          "Signed decision records and an offline verifier let auditors and counterparties check what happened without asking Access.",
          "İmzalı karar kayıtları ve çevrimdışı doğrulayıcı, denetçilerin ve karşı tarafların ne olduğunu Access'e sormadan kontrol etmesini sağlar."
        ),
      },
      {
        title: t("Fails closed", "Şüphede reddeder"),
        body: t(
          "If something cannot be verified, the answer is not allow. There is no impersonation, and support never signs in as you.",
          "Bir şey doğrulanamıyorsa cevap izin değildir. Kimliğe bürünme yoktur ve destek ekibi asla senin yerine oturum açmaz."
        ),
      },
    ],
    groups: [
      {
        title: t("Identity", "Kimlik"),
        items: l(
          [
            "OpenID Connect and OAuth 2.1",
            "Passkeys, authenticator codes and passwordless email",
            "Step-up authentication",
            "Sessions, account lifecycle and recovery",
            "Hosted pages and embeddable components",
          ],
          [
            "OpenID Connect ve OAuth 2.1",
            "Passkey, doğrulama kodları ve şifresiz e-posta",
            "Ek doğrulama",
            "Oturumlar, hesap yaşam döngüsü ve kurtarma",
            "Barındırılan sayfalar ve gömülebilir bileşenler",
          ]
        ),
      },
      {
        title: t("Enterprise", "Kurumsal"),
        items: l(
          [
            "SAML 2.0 and SCIM 2.0",
            "LDAP, Kerberos, RADIUS and WS-Federation",
            "OpenID Federation",
            "Bring your existing identity provider",
            "Organizations, invitations and verified domains",
            "Self-service SSO and SCIM setup",
          ],
          [
            "SAML 2.0 ve SCIM 2.0",
            "LDAP, Kerberos, RADIUS ve WS-Federation",
            "OpenID Federation",
            "Mevcut kimlik sağlayıcınla çalışır",
            "Kurumlar, davetler ve doğrulanmış alan adları",
            "Kendi kendine SSO ve SCIM kurulumu",
          ]
        ),
      },
      {
        title: t("Authority", "Yetki"),
        items: l(
          [
            "Grants, mandates and delegation chains",
            "Allow, deny or require action, with an explanation",
            "Approvals bound to the exact intent",
            "Revoke, suspend and narrow with cascade",
            "Consequence tiers for every action",
          ],
          [
            "Yetkiler, talimatlar ve delegasyon zincirleri",
            "İzin ver, reddet ya da eylem iste; gerekçesiyle",
            "Tam niyete bağlı onaylar",
            "Zincirleme iptal, askıya alma ve daraltma",
            "Her işlem için sonuç seviyeleri",
          ]
        ),
      },
      {
        title: t("Proof and audit", "Kanıt ve denetim"),
        items: l(
          [
            "Signed decision receipts",
            "Portable proof of authority",
            "Offline verifier",
            "Tamper-evident, append-only log",
            "Audit export and replay",
            "Webhooks, SIEM streams and shared signals",
          ],
          [
            "İmzalı karar makbuzları",
            "Taşınabilir yetki kanıtı",
            "Çevrimdışı doğrulayıcı",
            "Değiştirildiğinde fark edilen, sadece eklenen kayıt",
            "Denetim dışa aktarma ve tekrar oynatma",
            "Webhook'lar, SIEM akışları ve paylaşılan sinyaller",
          ]
        ),
      },
      {
        title: t("For developers", "Geliştiriciler için"),
        items: l(
          [
            "Management REST API",
            "Decision API",
            "SDKs and an access proxy for your services",
            "Developer console and decision lab",
            "Sandbox environment",
          ],
          [
            "Yönetim REST API'si",
            "Karar API'si",
            "Servislerin için SDK'lar ve erişim proxy'si",
            "Geliştirici konsolu ve karar laboratuvarı",
            "Sandbox ortamı",
          ]
        ),
      },
      {
        title: t("Governance", "Yönetişim"),
        items: l(
          [
            "Access reviews",
            "Separation of duties",
            "Break-glass access",
            "Hardware-backed signing keys",
            "Personal data erasure by crypto-shredding",
          ],
          [
            "Erişim gözden geçirmeleri",
            "Görevler ayrılığı",
            "Acil durum erişimi",
            "Donanım destekli imza anahtarları",
            "Kişisel verinin kriptografik imha ile silinmesi",
          ]
        ),
      },
    ],
    agent: {
      lead: t(
        "Take authorization out of the model and put it in a deterministic layer. Agents get identity, bounded authority and a human in the loop when it matters.",
        "Yetkilendirmeyi modelden çıkar ve deterministik bir katmana koy. Agent'lar kimlik, sınırlı yetki ve gerektiğinde araya giren bir insan alır."
      ),
      items: l(
        [
          "Agent identity with an accountable owner",
          "Authority budgets and mandates per run",
          "Sub-agent and agent-to-agent delegation",
          "MCP authorization server",
          "Credential vault: the model never sees secrets",
          "Human approval in the middle of a task",
        ],
        [
          "Sorumlu bir sahibi olan agent kimliği",
          "Her çalıştırma için yetki bütçeleri ve talimatlar",
          "Alt agent ve agent'lar arası delegasyon",
          "MCP yetkilendirme sunucusu",
          "Kimlik bilgisi kasası: model sırları asla görmez",
          "Görevin ortasında insan onayı",
        ]
      ),
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
        label: t("Decisions", "Kararlar"),
        value: t(
          "Allow, deny or require action, each with a signed record",
          "İzin ver, reddet ya da eylem iste; her biri imzalı kayıtla"
        ),
      },
      {
        label: t("Built with", "Teknoloji"),
        value: t(
          "Rust, with a shared core for server, browser and mobile",
          "Rust; sunucu, tarayıcı ve mobil için ortak çekirdek"
        ),
      },
      {
        label: t("Keys", "Anahtarlar"),
        value: t(
          "Hardware-backed, kept outside the web processes",
          "Donanım destekli, web süreçlerinin dışında tutulur"
        ),
      },
      {
        label: t("Data", "Veri"),
        value: t(
          "No physical deletes; personal data erased by crypto-shredding",
          "Fiziksel silme yok; kişisel veri kriptografik imha ile silinir"
        ),
      },
      {
        label: t("SDKs", "SDK'lar"),
        value: t(
          "TypeScript, Python, Go, Java, .NET and mobile",
          "TypeScript, Python, Go, Java, .NET ve mobil"
        ),
      },
      {
        label: t("Console", "Konsol"),
        value: t("Built to WCAG 2.2 AA", "WCAG 2.2 AA hedefiyle"),
      },
    ],
    connections: [
      {
        slug: "relay",
        text: t(
          "Access and Relay run together: every message Access sends goes through Relay.",
          "Access ve Relay birlikte çalışır: Access'in gönderdiği her mesaj Relay'den geçer."
        ),
      },
      {
        slug: "one",
        text: t(
          "Holds One's agent identities, grants and mandates.",
          "One'ın agent kimliklerini, yetkilerini ve talimatlarını tutar."
        ),
      },
      {
        slug: "pay",
        text: t(
          "Decides payment authority; Money holds the funds and Pay moves them.",
          "Ödeme yetkisine karar verir; parayı Money tutar, Pay taşır."
        ),
      },
      {
        slug: "work",
        text: t(
          "Decides who may approve; Work coordinates the decision.",
          "Kimin onaylayabileceğine karar verir; kararı Work koordine eder."
        ),
      },
    ],
    faq: [
      {
        question: t("What is suiss Access?", "suiss Access nedir?"),
        answer: t(
          "An identity provider with an authority layer. It signs in people, services and AI agents, and decides before each action whether it may happen, leaving a signed record.",
          "Yetki katmanı olan bir kimlik sağlayıcı. İnsanları, servisleri ve AI agent'larını oturum açtırır ve her işlemden önce gerçekleşip gerçekleşemeyeceğine karar verip imzalı bir kayıt bırakır."
        ),
      },
      {
        question: t(
          "How does Access work with AI agents?",
          "Access AI agent'larıyla nasıl çalışır?"
        ),
        answer: t(
          "Each agent has its own identity and an accountable owner. Its authority is delegated, can only narrow, and is checked against a budget and purpose on every action. When something needs a person, Access asks for an approval tied to that exact action.",
          "Her agent'ın kendi kimliği ve sorumlu bir sahibi vardır. Yetkisi delege edilir, sadece daralabilir ve her işlemde bir bütçe ve amaca göre denetlenir. Bir insana ihtiyaç olduğunda Access, tam o işleme bağlı bir onay ister."
        ),
      },
      {
        question: t(
          "Which protocols does Access support?",
          "Access hangi protokolleri destekler?"
        ),
        answer: t(
          "OpenID Connect, OAuth 2.1, SAML 2.0, SCIM 2.0, passkeys, LDAP, Kerberos, RADIUS, WS-Federation and MCP authorization, among others.",
          "Diğerlerinin yanında OpenID Connect, OAuth 2.1, SAML 2.0, SCIM 2.0, passkey, LDAP, Kerberos, RADIUS, WS-Federation ve MCP yetkilendirmesi."
        ),
      },
      {
        question: t("Is Access available?", "Access kullanılabilir mi?"),
        answer: t("Access is in development.", "Access geliştiriliyor."),
      },
    ],
  },
  {
    slug: "relay",
    name: "Relay",
    image: "/images/products/relay.jpg",
    status: "development",
    verb: t("Communicate", "İlet"),
    category: t("Events and messaging", "Event ve mesajlaşma"),
    tagline: t("Every message accounted for.", "Her mesajın hesabı verilir."),
    summary: t(
      "Relay takes an event from your product and gets it to the right person, service, device or AI agent, on the right channel and at the right time, within consent rules. It handles retries, failover and preferences, and keeps a record of what happened to every message, including the ones it chose not to send and why.",
      "Relay, ürününden gelen bir event'i doğru kişiye, servise, cihaza ya da AI agent'ına, doğru kanaldan ve doğru zamanda, izin kuralları içinde ulaştırır. Yeniden denemeleri, yedeklemeyi ve tercihleri yönetir; her mesajın başına ne geldiğinin kaydını tutar; göndermemeyi seçtiklerini ve nedenini de."
    ),
    description: t(
      "Relay gets events from your product to the right person, service, device or AI agent, on the right channel and time, with a record of every message.",
      "Relay, ürününden gelen event'leri doğru kişiye, servise, cihaza ya da AI agent'ına doğru kanaldan ve zamanda ulaştırır, her mesajın kaydını tutar."
    ),
    question: t(
      "How does this event or message reach the right person, service, device or agent?",
      "Bu event ya da mesaj doğru kişiye, servise, cihaza ya da agent'a nasıl ulaşır?"
    ),
    principles: [
      {
        title: t("One entry point", "Tek giriş noktası"),
        body: t(
          "Send events through one API or as CloudEvents. Idempotency and deduplication keys prevent accidental double sends.",
          "Event'leri tek bir API ya da CloudEvents ile gönder. Idempotency ve tekilleştirme anahtarları yanlışlıkla çift gönderimi önler."
        ),
      },
      {
        title: t("Right channel, right time", "Doğru kanal, doğru zaman"),
        body: t(
          "Fallback, escalation, quiet hours and the recipient's time zone are handled for you, without code in your product.",
          "Yedek kanal, eskalasyon, sessiz saatler ve alıcının saat dilimi senin ürününde kod yazmadan yönetilir."
        ),
      },
      {
        title: t("Consent in the send path", "Gönderim yolunda izin"),
        body: t(
          "Preferences, legal consent, one-click unsubscribe and country rules are checked before every send, and a send is skipped when a check fails.",
          "Tercihler, yasal izin, tek tıkla abonelikten çıkma ve ülke kuralları her gönderimden önce denetlenir; bir kontrol başarısız olursa gönderim yapılmaz."
        ),
      },
      {
        title: t("A reason for every skip", "Her atlamanın bir nedeni"),
        body: t(
          "When a message is not sent, Relay records why and which rule decided it. “Why didn't I get it?” has an answer.",
          "Bir mesaj gönderilmediğinde Relay nedenini ve kararı veren kuralı kaydeder. “Neden almadım?” sorusunun bir cevabı vardır."
        ),
      },
      {
        title: t("Replies that find their way back", "Yolunu bulan cevaplar"),
        body: t(
          "Messages stay in the inbox or mailbox even if a push is lost, and replies are matched on whichever channel they arrive.",
          "Bir push kaybolsa bile mesajlar gelen kutusunda kalır ve cevaplar hangi kanaldan gelirse gelsin eşleştirilir."
        ),
      },
    ],
    groups: [
      {
        title: t("Channels", "Kanallar"),
        items: l(
          [
            "iOS, Android and web push",
            "Email through providers or your own SMTP",
            "SMS and voice codes",
            "WhatsApp, Slack, Microsoft Teams, Telegram and Discord",
            "In-app inbox with real-time updates",
          ],
          [
            "iOS, Android ve web push",
            "Sağlayıcılar ya da kendi SMTP'n üzerinden e-posta",
            "SMS ve sesli kodlar",
            "WhatsApp, Slack, Microsoft Teams, Telegram ve Discord",
            "Gerçek zamanlı güncellenen uygulama içi gelen kutusu",
          ]
        ),
      },
      {
        title: t("Workflows", "İş akışları"),
        items: l(
          [
            "Visual editor, files in git, or code",
            "Wait, digest, throttle and conditions",
            "Fallback, fan-out and last active device",
            "Escalate unless seen",
            "Scheduling and recurring notifications",
            "Topics and subscriptions",
          ],
          [
            "Görsel editör, git'te dosyalar ya da kod",
            "Bekleme, özet, kısma ve koşullar",
            "Yedek kanal, çoklu gönderim ve son aktif cihaz",
            "Görülmezse eskale et",
            "Zamanlama ve tekrarlayan bildirimler",
            "Konular ve abonelikler",
          ]
        ),
      },
      {
        title: t("Reliability", "Güvenilirlik"),
        items: l(
          [
            "At-least-once delivery with durable idempotency",
            "Retries with backoff and circuit breakers",
            "Provider failover to verified providers only",
            "Priority lanes so security codes are never shed",
            "Fair limits per customer",
            "Dead-letter queue and replay",
          ],
          [
            "Kalıcı idempotency ile en az bir kez teslim",
            "Geri çekilmeli yeniden deneme ve devre kesiciler",
            "Sadece doğrulanmış sağlayıcılara yedekleme",
            "Güvenlik kodları asla düşürülmesin diye öncelik şeritleri",
            "Müşteri başına adil limitler",
            "Teslim edilemeyen mesaj kuyruğu ve tekrar oynatma",
          ]
        ),
      },
      {
        title: t("Consent and compliance", "İzin ve uyum"),
        items: l(
          [
            "Message classes from security to marketing",
            "Preference center by category and channel",
            "Turkey's İYS consent registry",
            "One-click unsubscribe",
            "Country rules for Turkey, the EU and the US",
            "Crypto-shredding for personal data erasure",
          ],
          [
            "Güvenlikten pazarlamaya mesaj sınıfları",
            "Kategori ve kanala göre tercih merkezi",
            "İYS izin sistemi",
            "Tek tıkla abonelikten çıkma",
            "Türkiye, AB ve ABD için ülke kuralları",
            "Kişisel veri silme için kriptografik imha",
          ]
        ),
      },
      {
        title: t("Content", "İçerik"),
        items: l(
          [
            "Versioned templates per channel and language",
            "Templates that never run code",
            "Responsive email layouts",
            "Brands, including per customer",
            "Previews and test sends",
          ],
          [
            "Kanal ve dil başına sürümlü şablonlar",
            "Asla kod çalıştırmayan şablonlar",
            "Duyarlı e-posta düzenleri",
            "Müşteri bazında dahil markalar",
            "Önizlemeler ve test gönderimleri",
          ]
        ),
      },
      {
        title: t("Webhooks and insight", "Webhook ve görünürlük"),
        items: l(
          [
            "Signed webhooks",
            "Delivery to queues, streams and object storage",
            "Embeddable webhook portal",
            "“Why didn't I get it?” lookup",
            "Delivery funnel reports",
            "OpenTelemetry tracing",
          ],
          [
            "İmzalı webhook'lar",
            "Kuyruklara, akışlara ve nesne depolamaya teslim",
            "Gömülebilir webhook portalı",
            "“Neden almadım?” sorgusu",
            "Teslimat hunisi raporları",
            "OpenTelemetry izleme",
          ]
        ),
      },
    ],
    agent: {
      lead: t(
        "Agents can ask a person a question and wait for the answer without holding a process open. Relay holds the wait and hands the answer back.",
        "Agent'lar bir insana soru sorup bir süreci açık tutmadan cevabı bekleyebilir. Beklemeyi Relay tutar ve cevabı geri verir."
      ),
      items: l(
        [
          "Waitpoints that resolve from any channel",
          "Notify, question and review messages",
          "Durable agent mailbox, read in order",
          "Wake-up signals for sleeping agents",
          "Escalation chains that never auto-approve",
          "MCP, A2A and AG-UI support",
        ],
        [
          "Herhangi bir kanaldan çözülen bekleme noktaları",
          "Bildirim, soru ve inceleme mesajları",
          "Sırayla okunan kalıcı agent posta kutusu",
          "Uyuyan agent'lar için uyandırma sinyalleri",
          "Asla otomatik onaylamayan eskalasyon zincirleri",
          "MCP, A2A ve AG-UI desteği",
        ]
      ),
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
        label: t("Delivery", "Teslimat"),
        value: t(
          "At-least-once with durable idempotency",
          "Kalıcı idempotency ile en az bir kez"
        ),
      },
      {
        label: t("Built with", "Teknoloji"),
        value: t("Elixir, OTP and Phoenix", "Elixir, OTP ve Phoenix"),
      },
      {
        label: t("Requires", "Gereksinim"),
        value: t("PostgreSQL and Valkey", "PostgreSQL ve Valkey"),
      },
      {
        label: t("Regions", "Bölgeler"),
        value: t(
          "Separate installations for Turkey, the EU and the US",
          "Türkiye, AB ve ABD için ayrı kurulumlar"
        ),
      },
      {
        label: t("SDKs", "SDK'lar"),
        value: t(
          "Server, iOS, Android, React Native and Flutter, plus inbox components",
          "Sunucu, iOS, Android, React Native ve Flutter, ayrıca gelen kutusu bileşenleri"
        ),
      },
      {
        label: t("Long waits", "Uzun beklemeler"),
        value: t(
          "Up to 90 days, stored durably",
          "90 güne kadar, kalıcı olarak saklanır"
        ),
      },
    ],
    connections: [
      {
        slug: "access",
        text: t(
          "Sign-in, credentials and approvals come from Access; Access sends all its messages through Relay.",
          "Oturum, kimlik bilgileri ve onaylar Access'ten gelir; Access tüm mesajlarını Relay'den gönderir."
        ),
      },
      {
        slug: "work",
        text: t(
          "Work decides who to escalate to; Relay delivers it.",
          "Kime eskale edileceğine Work karar verir; Relay iletir."
        ),
      },
      {
        slug: "one",
        text: t(
          "One sends and receives through Relay like any other agent.",
          "One, diğer her agent gibi Relay üzerinden gönderir ve alır."
        ),
      },
      {
        slug: "commerce",
        text: t(
          "Order, payment and delivery updates from Commerce, Serve and Pay reach people through Relay.",
          "Commerce, Serve ve Pay'den gelen sipariş, ödeme ve teslimat güncellemeleri insanlara Relay ile ulaşır."
        ),
      },
    ],
    faq: [
      {
        question: t("What is suiss Relay?", "suiss Relay nedir?"),
        answer: t(
          "Infrastructure for notifications, messaging and event delivery. It sends over push, email, SMS, chat apps, in-app and webhooks, with consent rules, retries and a record for every message.",
          "Bildirim, mesajlaşma ve event teslimi için altyapı. Push, e-posta, SMS, sohbet uygulamaları, uygulama içi ve webhook üzerinden; izin kuralları, yeniden denemeler ve her mesaj için bir kayıtla gönderir."
        ),
      },
      {
        question: t(
          "How does Relay handle consent?",
          "Relay izinleri nasıl yönetir?"
        ),
        answer: t(
          "Every send passes one decision layer that checks message class, preferences, legal consent including İYS, country rules and quiet hours. If a check fails, the message is skipped and the reason is recorded.",
          "Her gönderim; mesaj sınıfını, tercihleri, İYS dahil yasal izni, ülke kurallarını ve sessiz saatleri denetleyen tek bir karar katmanından geçer. Bir kontrol başarısız olursa mesaj atlanır ve nedeni kaydedilir."
        ),
      },
      {
        question: t(
          "Can AI agents use Relay?",
          "AI agent'ları Relay'i kullanabilir mi?"
        ),
        answer: t(
          "Yes. Agents can ask a person and wait for the reply, read a durable mailbox after waking up, and connect over MCP and A2A.",
          "Evet. Agent'lar bir insana sorup cevabı bekleyebilir, uyandıktan sonra kalıcı posta kutusunu okuyabilir ve MCP ile A2A üzerinden bağlanabilir."
        ),
      },
      {
        question: t("Is Relay available?", "Relay kullanılabilir mi?"),
        answer: t("Relay is in development.", "Relay geliştiriliyor."),
      },
    ],
  },
  {
    slug: "money",
    name: "Money",
    image: "/images/products/money.jpg",
    status: "planned",
    verb: t("Hold", "Tut"),
    category: t("Personal money", "Kişisel para"),
    tagline: t("Your money, in one place.", "Paran, tek bir yerde."),
    summary: t(
      "Money is a personal money account for everyday life: balances in several currencies, physical and virtual cards, transfers, budgets, subscriptions and rewards. It is built so that your agent can pay for things on your behalf, using only the accounts and limits you allow.",
      "Money, gündelik hayat için kişisel bir para hesabı: birden fazla para biriminde bakiye, fiziksel ve sanal kartlar, transferler, bütçeler, abonelikler ve ödüller. Agent'ının senin adına ödeme yapabilmesi için tasarlanır; sadece izin verdiğin hesapları ve limitleri kullanarak."
    ),
    description: t(
      "Money is a personal account for everyday life: multi-currency balances, cards, transfers and budgets, built so your agent can pay within your limits.",
      "Money, gündelik hayat için kişisel para hesabı: çok para birimli bakiye, kartlar, transferler ve bütçeler; agent'ın senin limitlerinle ödeme yapabilir."
    ),
    question: t(
      "Which of your accounts, balances or cards should be used?",
      "Hangi hesabın, bakiyen ya da kartın kullanılmalı?"
    ),
    principles: [
      {
        title: t("Everything in one account", "Her şey tek hesapta"),
        body: t(
          "Balances, cards, transfers and statements in one place, in more than one currency.",
          "Bakiyeler, kartlar, transferler ve hesap özetleri tek yerde, birden fazla para biriminde."
        ),
      },
      {
        title: t("Cards you control", "Kontrolü sende kartlar"),
        body: t(
          "Freeze a card, set limits, allow or block merchants and categories, and create single-use cards in seconds.",
          "Kartı dondur, limit belirle, satıcıları ve kategorileri aç ya da kapat, saniyeler içinde tek kullanımlık kart oluştur."
        ),
      },
      {
        title: t("Ready for your agent", "Agent'ına hazır"),
        body: t(
          "Your agent can pay only from the sources you choose, within budgets and purposes you set. Access decides whether it may.",
          "Agent'ın sadece senin seçtiğin kaynaklardan, belirlediğin bütçe ve amaçlar içinde ödeme yapabilir. Yapıp yapamayacağına Access karar verir."
        ),
      },
      {
        title: t("Clear about your money", "Paran hakkında net"),
        body: t(
          "See where money goes, spot recurring costs and manage subscriptions before they renew.",
          "Paranın nereye gittiğini gör, tekrarlayan masrafları fark et ve abonelikleri yenilenmeden yönet."
        ),
      },
    ],
    groups: [
      {
        title: t("Account", "Hesap"),
        items: l(
          [
            "Multi-currency balances",
            "Available and pending balance",
            "Transaction ledger and statements",
            "Bank account and card linking",
            "Scheduled and automatic top-up",
          ],
          [
            "Çoklu para birimli bakiyeler",
            "Kullanılabilir ve bekleyen bakiye",
            "İşlem defteri ve hesap özetleri",
            "Banka hesabı ve kart bağlama",
            "Zamanlanmış ve otomatik bakiye yükleme",
          ]
        ),
      },
      {
        title: t("Cards", "Kartlar"),
        items: l(
          [
            "Physical and virtual cards",
            "Single-use and disposable cards",
            "Freeze and unfreeze",
            "Merchant and category controls",
            "Online, contactless and international controls",
          ],
          [
            "Fiziksel ve sanal kartlar",
            "Tek kullanımlık ve geçici kartlar",
            "Dondur ve çöz",
            "Satıcı ve kategori kontrolleri",
            "Online, temassız ve yurt dışı kontrolleri",
          ]
        ),
      },
      {
        title: t("Transfers and payments", "Transfer ve ödemeler"),
        items: l(
          [
            "Send and request money",
            "Bank and internal transfers",
            "Scheduled and recurring transfers",
            "QR and contactless payments",
            "Saved recipients",
          ],
          [
            "Para gönder ve iste",
            "Banka ve hesaplar arası transferler",
            "Zamanlanmış ve tekrarlayan transferler",
            "QR ve temassız ödemeler",
            "Kayıtlı alıcılar",
          ]
        ),
      },
      {
        title: t("Insight", "Görünürlük"),
        items: l(
          [
            "Spending by category",
            "Budgets and cash-flow view",
            "Recurring expense detection",
            "Subscription management",
            "Smart alerts",
          ],
          [
            "Kategoriye göre harcama",
            "Bütçeler ve nakit akışı",
            "Tekrarlayan masraf tespiti",
            "Abonelik yönetimi",
            "Akıllı uyarılar",
          ]
        ),
      },
      {
        title: t("Rewards and protection", "Ödül ve koruma"),
        items: l(
          [
            "Cashback and offers",
            "Refund tracking",
            "Card disputes",
            "Fraud monitoring",
            "Account security",
          ],
          [
            "Nakit iade ve teklifler",
            "İade takibi",
            "Kart itirazları",
            "Dolandırıcılık izleme",
            "Hesap güvenliği",
          ]
        ),
      },
    ],
    agent: {
      lead: t(
        "Access decides whether an agent may spend. Money decides which of your accounts or cards it uses.",
        "Bir agent'ın harcayıp harcayamayacağına Access karar verir. Hangi hesabının ya da kartının kullanılacağına Money karar verir."
      ),
      items: l(
        [
          "Delegated access to chosen sources",
          "Virtual cards just for your agent",
          "Budget-aware spending",
          "Merchant, category, purpose and time limits",
          "Receipts for every agent payment",
          "Your approval above the amounts you set",
        ],
        [
          "Seçtiğin kaynaklara delege erişim",
          "Sadece agent'ın için sanal kartlar",
          "Bütçeye duyarlı harcama",
          "Satıcı, kategori, amaç ve zaman limitleri",
          "Her agent ödemesi için makbuz",
          "Belirlediğin tutarların üstünde senin onayın",
        ]
      ),
    },
    facts: [
      {
        label: t("For", "Kimin için"),
        value: t("Individuals and their agents", "Bireyler ve agent'ları"),
      },
      {
        label: t("Currencies", "Para birimleri"),
        value: t(
          "Multi-currency accounts and conversion",
          "Çoklu para birimli hesaplar ve dönüşüm"
        ),
      },
      {
        label: t("Cards", "Kartlar"),
        value: t(
          "Physical, virtual and single-use",
          "Fiziksel, sanal ve tek kullanımlık"
        ),
      },
      { label: t("Status", "Durum"), value: t("Planned", "Planlanıyor") },
    ],
    connections: [
      {
        slug: "access",
        text: t(
          "Decides whether an agent may use your money.",
          "Bir agent'ın paranı kullanıp kullanamayacağına karar verir."
        ),
      },
      {
        slug: "pay",
        text: t(
          "Executes the payment to the merchant.",
          "Ödemeyi satıcıya gerçekleştirir."
        ),
      },
      {
        slug: "one",
        text: t(
          "Pays for things on your behalf, within your limits.",
          "Senin adına, senin sınırların içinde ödeme yapar."
        ),
      },
    ],
    faq: [
      {
        question: t("What is suiss Money?", "suiss Money nedir?"),
        answer: t(
          "A personal money account with cards, transfers, budgets, multiple currencies and rewards, designed so your agent can pay within limits you set.",
          "Kartları, transferleri, bütçeleri, çoklu para birimi ve ödülleri olan kişisel bir para hesabı; agent'ının belirlediğin limitler içinde ödeme yapabilmesi için tasarlanır."
        ),
      },
      {
        question: t(
          "How is Money different from Pay?",
          "Money'nin Pay'den farkı ne?"
        ),
        answer: t(
          "Money is your money and your financial life. Pay is the infrastructure businesses use to accept payments.",
          "Money senin paran ve finansal hayatın. Pay, işletmelerin ödeme almak için kullandığı altyapı."
        ),
      },
      {
        question: t("Is Money available?", "Money kullanılabilir mi?"),
        answer: t("Money is planned.", "Money planlanıyor."),
      },
    ],
  },
  {
    slug: "pay",
    name: "Pay",
    image: "/images/products/pay.jpg",
    status: "planned",
    verb: t("Move", "Taşı"),
    category: t("Payment infrastructure", "Ödeme altyapısı"),
    tagline: t(
      "Accept payments from anyone, or any agent.",
      "Herkesten ya da her agent'tan ödeme al."
    ),
    summary: t(
      "Pay is payment infrastructure for businesses and platforms: payment and checkout APIs, virtual POS, payment links, settlement and payouts, and marketplace payments. Checkout is built for agents too, so a purchase made by someone's agent is as clear as one made by a person.",
      "Pay, işletmeler ve platformlar için ödeme altyapısı: ödeme ve checkout API'leri, sanal POS, ödeme linkleri, mutabakat ve ödemeler ve pazaryeri ödemeleri. Checkout agent'lar için de tasarlanır; birinin agent'ının yaptığı alışveriş, bir insanın yaptığı kadar nettir."
    ),
    description: t(
      "Pay is payment infrastructure for businesses and platforms: checkout APIs, virtual POS, payment links, payouts and marketplace payments, built for agents too.",
      "Pay, işletmeler ve platformlar için ödeme altyapısı: checkout API'leri, sanal POS, ödeme linkleri, ödemeler ve pazaryeri ödemeleri; agent'lar için de."
    ),
    question: t(
      "How does a payment actually reach the merchant?",
      "Bir ödeme satıcıya gerçekte nasıl ulaşır?"
    ),
    principles: [
      {
        title: t("Every way to accept", "Ödeme almanın her yolu"),
        body: t(
          "Cards, bank payments, Money and alternative methods through one API, hosted checkout or payment links.",
          "Kartlar, banka ödemeleri, Money ve alternatif yöntemler; tek API, barındırılan checkout ya da ödeme linkleri ile."
        ),
      },
      {
        title: t("The whole payment lifecycle", "Ödemenin tüm yaşam döngüsü"),
        body: t(
          "Authorize, capture, void and refund, with disputes and reconciliation handled in the same place.",
          "Provizyon, tahsilat, iptal ve iade; itirazlar ve uzlaştırma aynı yerde."
        ),
      },
      {
        title: t("Built for platforms", "Platformlar için"),
        body: t(
          "Split payments, commissions, escrow and seller payouts for marketplaces.",
          "Pazaryerleri için bölünmüş ödemeler, komisyonlar, emanet ve satıcı ödemeleri."
        ),
      },
      {
        title: t("Agent checkout", "Agent checkout"),
        body: t(
          "Agents pay with mandates from Access and machine-readable payment intents, with approvals above set amounts.",
          "Agent'lar Access'ten gelen talimatlar ve makinenin okuyabildiği ödeme niyetleriyle öder; belirlenen tutarların üstünde onayla."
        ),
      },
    ],
    groups: [
      {
        title: t("Accept", "Ödeme al"),
        items: l(
          [
            "Payment and checkout APIs",
            "Hosted checkout",
            "Payment links",
            "Virtual POS",
            "Tokenization and saved cards",
          ],
          [
            "Ödeme ve checkout API'leri",
            "Barındırılan checkout",
            "Ödeme linkleri",
            "Sanal POS",
            "Tokenizasyon ve kayıtlı kartlar",
          ]
        ),
      },
      {
        title: t("Lifecycle", "Yaşam döngüsü"),
        items: l(
          [
            "Authorize and capture, partial or full",
            "Void and refund",
            "Chargebacks and disputes",
            "Payment status and retries",
            "Reconciliation",
          ],
          [
            "Kısmi ya da tam provizyon ve tahsilat",
            "İptal ve iade",
            "Ters ibraz ve itirazlar",
            "Ödeme durumu ve yeniden denemeler",
            "Uzlaştırma",
          ]
        ),
      },
      {
        title: t("Money movement", "Para hareketi"),
        items: l(
          [
            "Merchant balance",
            "Settlement",
            "Scheduled and instant payouts",
            "Multi-currency settlement",
          ],
          [
            "Satıcı bakiyesi",
            "Mutabakat",
            "Zamanlanmış ve anında ödemeler",
            "Çoklu para birimli mutabakat",
          ]
        ),
      },
      {
        title: t("Marketplaces", "Pazaryerleri"),
        items: l(
          [
            "Split payments",
            "Commissions and platform fees",
            "Escrow",
            "Sub-merchants and connected accounts",
            "Seller onboarding and payouts",
          ],
          [
            "Bölünmüş ödemeler",
            "Komisyonlar ve platform ücretleri",
            "Emanet",
            "Alt satıcılar ve bağlı hesaplar",
            "Satıcı kaydı ve ödemeleri",
          ]
        ),
      },
      {
        title: t("Developers", "Geliştiriciler"),
        items: l(
          [
            "SDKs and webhooks",
            "Sandbox and test cards",
            "Developer dashboard and API keys",
            "Payment event stream",
            "Observability",
          ],
          [
            "SDK'lar ve webhook'lar",
            "Sandbox ve test kartları",
            "Geliştirici paneli ve API anahtarları",
            "Ödeme event akışı",
            "Gözlemlenebilirlik",
          ]
        ),
      },
    ],
    agent: {
      lead: t(
        "Access decides whether an agent may pay, Money decides where the money comes from, and Pay makes the payment happen.",
        "Bir agent'ın ödeme yapıp yapamayacağına Access, paranın nereden geleceğine Money karar verir; ödemeyi Pay gerçekleştirir."
      ),
      items: l(
        [
          "Agent checkout",
          "Payment mandates",
          "Machine-readable payment intents",
          "Approval thresholds",
          "Agent-to-agent and procurement payments",
          "Purchase receipts for agents",
        ],
        [
          "Agent checkout",
          "Ödeme talimatları",
          "Makinenin okuyabildiği ödeme niyetleri",
          "Onay eşikleri",
          "Agent'lar arası ve satın alma ödemeleri",
          "Agent'lar için satın alma makbuzları",
        ]
      ),
    },
    facts: [
      {
        label: t("For", "Kimin için"),
        value: t(
          "Businesses, platforms and marketplaces",
          "İşletmeler, platformlar ve pazaryerleri"
        ),
      },
      {
        label: t("Methods", "Yöntemler"),
        value: t(
          "Cards, bank payments, Money and alternatives",
          "Kartlar, banka ödemeleri, Money ve alternatifler"
        ),
      },
      {
        label: t("Integration", "Entegrasyon"),
        value: t(
          "APIs, SDKs, webhooks and hosted pages",
          "API'ler, SDK'lar, webhook'lar ve barındırılan sayfalar"
        ),
      },
      { label: t("Status", "Durum"), value: t("Planned", "Planlanıyor") },
    ],
    connections: [
      {
        slug: "money",
        text: t(
          "Money is one of the ways people pay.",
          "Money, insanların ödeme yollarından biri."
        ),
      },
      {
        slug: "access",
        text: t(
          "Agent payments run on mandates from Access.",
          "Agent ödemeleri Access'ten gelen talimatlarla yapılır."
        ),
      },
      {
        slug: "commerce",
        text: t(
          "Checkout for every store and the marketplace.",
          "Her mağaza ve pazaryeri için checkout."
        ),
      },
      {
        slug: "serve",
        text: t(
          "Payments at the table, the kiosk and the door.",
          "Masada, kioskta ve kapıda ödemeler."
        ),
      },
    ],
    faq: [
      {
        question: t("What is suiss Pay?", "suiss Pay nedir?"),
        answer: t(
          "Payment infrastructure that lets businesses and platforms accept payments, manage refunds and disputes, settle funds and pay out sellers, with checkout that works for AI agents.",
          "İşletmelerin ve platformların ödeme almasını, iade ve itirazları yönetmesini, fonları mutabakatlamasını ve satıcılara ödeme yapmasını sağlayan ödeme altyapısı; AI agent'larıyla da çalışan checkout ile."
        ),
      },
      {
        question: t(
          "How do agents pay with Pay?",
          "Agent'lar Pay ile nasıl öder?"
        ),
        answer: t(
          "An agent presents a mandate from Access and a machine-readable payment intent. Pay checks it, asks a person above set amounts, and leaves a receipt.",
          "Agent, Access'ten bir talimat ve makinenin okuyabildiği bir ödeme niyeti sunar. Pay bunu denetler, belirlenen tutarların üstünde bir insana sorar ve makbuz bırakır."
        ),
      },
      {
        question: t("Is Pay available?", "Pay kullanılabilir mi?"),
        answer: t("Pay is planned.", "Pay planlanıyor."),
      },
    ],
  },
  {
    slug: "commerce",
    name: "Commerce",
    image: "/images/products/commerce.jpg",
    status: "planned",
    verb: t("Buy and sell", "Al ve sat"),
    category: t("Agentic commerce", "Agent'lı ticaret"),
    tagline: t(
      "A store for people. And their agents.",
      "İnsanlar için bir mağaza. Ve agent'ları için."
    ),
    summary: t(
      "Commerce brings together a multi-seller marketplace, a platform for merchants to run their own stores, and commerce that agents can use. An agent can discover, compare, buy and return on your behalf, with Access deciding what it may spend and Relay keeping you posted.",
      "Commerce; çok satıcılı bir pazaryerini, satıcıların kendi mağazalarını yönettiği bir platformu ve agent'ların kullanabildiği ticareti bir araya getirir. Bir agent senin adına keşfedebilir, karşılaştırabilir, satın alabilir ve iade edebilir; ne harcayabileceğine Access karar verir, Relay seni haberdar eder."
    ),
    description: t(
      "Commerce brings a multi-seller marketplace, a store platform for merchants and agent-ready commerce together, so agents can discover, compare and buy for you.",
      "Commerce; çok satıcılı pazaryerini, satıcı mağaza platformunu ve agent'ların kullanabildiği ticareti birleştirir, agent'ın senin için bulur ve satın alır."
    ),
    question: t(
      "What should be bought, from whom, and at what price?",
      "Ne, kimden ve hangi fiyata satın alınmalı?"
    ),
    principles: [
      {
        title: t(
          "A marketplace and a store builder",
          "Pazaryeri ve mağaza kurucu"
        ),
        body: t(
          "Sell on the marketplace, on your own storefront, or both, from one catalog and one order system.",
          "Pazaryerinde, kendi vitrininde ya da ikisinde birden sat; tek katalog ve tek sipariş sistemiyle."
        ),
      },
      {
        title: t("Made for agents", "Agent'lar için yapıldı"),
        body: t(
          "Products, offers and checkout are readable by agents, so a request like “find me a lighter laptop under a budget” can end in an order.",
          "Ürünler, teklifler ve checkout agent'lar tarafından okunabilir; “bütçemin altında daha hafif bir laptop bul” gibi bir istek siparişle bitebilir."
        ),
      },
      {
        title: t("Business buying too", "Kurumsal alım da"),
        body: t(
          "Procurement, requests for quotation, bulk orders and reordering for companies.",
          "Şirketler için satın alma, teklif talepleri, toplu siparişler ve tekrar sipariş."
        ),
      },
      {
        title: t("Global from the start", "Baştan küresel"),
        body: t(
          "Multiple countries, currencies and languages, with tax, shipping and invoices built in.",
          "Birden fazla ülke, para birimi ve dil; vergi, kargo ve fatura dahil."
        ),
      },
    ],
    groups: [
      {
        title: t("Marketplace", "Pazaryeri"),
        items: l(
          [
            "Multi-seller catalog with variants",
            "Search and recommendations",
            "Promotions and coupons",
            "Cart, checkout and orders",
            "Returns, shipping and fulfillment",
            "Reviews, ratings and Q&A",
          ],
          [
            "Varyantlı çok satıcılı katalog",
            "Arama ve öneriler",
            "Promosyonlar ve kuponlar",
            "Sepet, checkout ve siparişler",
            "İade, kargo ve gönderim",
            "Yorumlar, puanlar ve soru-cevap",
          ]
        ),
      },
      {
        title: t("Merchant platform", "Satıcı platformu"),
        items: l(
          [
            "Store creation and custom domains",
            "Themes and headless storefront API",
            "Orders, inventory and customers",
            "Discounts, campaigns and loyalty",
            "Tax, invoices and shipping",
            "Extensions, webhooks and merchant API",
          ],
          [
            "Mağaza oluşturma ve özel alan adları",
            "Temalar ve headless vitrin API'si",
            "Siparişler, stok ve müşteriler",
            "İndirimler, kampanyalar ve sadakat",
            "Vergi, fatura ve kargo",
            "Eklentiler, webhook'lar ve satıcı API'si",
          ]
        ),
      },
      {
        title: t("Business", "Kurumsal"),
        items: l(
          [
            "B2B marketplace",
            "Procurement",
            "Requests for quotation",
            "Bulk purchasing",
            "Reordering and subscriptions",
          ],
          [
            "B2B pazaryeri",
            "Satın alma",
            "Teklif talepleri",
            "Toplu alım",
            "Tekrar sipariş ve abonelikler",
          ]
        ),
      },
      {
        title: t("Operations", "Operasyon"),
        items: l(
          [
            "Seller onboarding and seller center",
            "Warehouses and inventory",
            "Seller payouts and commissions",
            "Marketplace accounting",
            "Fraud and risk checks",
            "Customer service and disputes",
          ],
          [
            "Satıcı kaydı ve satıcı merkezi",
            "Depolar ve stok",
            "Satıcı ödemeleri ve komisyonlar",
            "Pazaryeri muhasebesi",
            "Dolandırıcılık ve risk kontrolleri",
            "Müşteri hizmetleri ve itirazlar",
          ]
        ),
      },
    ],
    agent: {
      lead: t(
        "From a sentence to a delivered order: discover, compare, check authority, pay, and follow the delivery.",
        "Tek bir cümleden teslim edilmiş bir siparişe: keşfet, karşılaştır, yetkiyi denetle, öde ve teslimatı takip et."
      ),
      items: l(
        [
          "Product discovery by meaning",
          "Comparison and offer gathering",
          "Negotiation with sellers",
          "Agent cart and checkout",
          "Returns and warranty",
          "Booking, tickets and food orders",
        ],
        [
          "Anlama göre ürün keşfi",
          "Karşılaştırma ve teklif toplama",
          "Satıcılarla pazarlık",
          "Agent sepeti ve checkout",
          "İade ve garanti",
          "Rezervasyon, bilet ve yemek siparişi",
        ]
      ),
    },
    facts: [
      {
        label: t("For", "Kimin için"),
        value: t(
          "Shoppers, merchants, marketplaces and companies",
          "Alıcılar, satıcılar, pazaryerleri ve şirketler"
        ),
      },
      {
        label: t("Selling", "Satış"),
        value: t(
          "Marketplace, own storefront or headless",
          "Pazaryeri, kendi vitrini ya da headless"
        ),
      },
      {
        label: t("Reach", "Erişim"),
        value: t(
          "Multi-country, multi-currency, multi-language",
          "Çok ülkeli, çok para birimli, çok dilli"
        ),
      },
      { label: t("Status", "Durum"), value: t("Planned", "Planlanıyor") },
    ],
    connections: [
      {
        slug: "pay",
        text: t(
          "Checkout and seller payouts.",
          "Checkout ve satıcı ödemeleri."
        ),
      },
      {
        slug: "access",
        text: t(
          "Decides what an agent may buy and spend.",
          "Bir agent'ın neyi alıp ne harcayabileceğine karar verir."
        ),
      },
      {
        slug: "relay",
        text: t(
          "Order and delivery updates to buyers and sellers.",
          "Alıcılara ve satıcılara sipariş ve teslimat güncellemeleri."
        ),
      },
    ],
    faq: [
      {
        question: t("What is suiss Commerce?", "suiss Commerce nedir?"),
        answer: t(
          "A marketplace, a platform for merchants to run their own stores, and commerce that AI agents can use to buy on someone's behalf.",
          "Bir pazaryeri, satıcıların kendi mağazalarını yönettiği bir platform ve AI agent'larının birinin adına alışveriş yapmak için kullanabildiği ticaret."
        ),
      },
      {
        question: t(
          "Can an agent shop for me?",
          "Bir agent benim için alışveriş yapabilir mi?"
        ),
        answer: t(
          "Yes. It can search, compare offers and check out, within the budget and limits you set through Access.",
          "Evet. Access üzerinden belirlediğin bütçe ve limitler içinde arayabilir, teklifleri karşılaştırabilir ve ödemeyi tamamlayabilir."
        ),
      },
      {
        question: t("Is Commerce available?", "Commerce kullanılabilir mi?"),
        answer: t("Commerce is planned.", "Commerce planlanıyor."),
      },
    ],
  },
  {
    slug: "serve",
    name: "Serve",
    image: "/images/products/serve.jpg",
    status: "planned",
    verb: t("Fulfill", "Gerçekleştir"),
    category: t("Restaurant platform", "Restoran platformu"),
    tagline: t(
      "The whole restaurant, on one system.",
      "Restoranın tamamı, tek sistemde."
    ),
    summary: t(
      "Serve brings a restaurant operating system, a food marketplace and a delivery network together. Every order from every channel lands in one place and goes straight to the kitchen, and agents help with stock, purchasing, scheduling, pricing and customer support.",
      "Serve; bir restoran işletim sistemini, bir yemek pazaryerini ve bir teslimat ağını bir araya getirir. Her kanaldan gelen her sipariş tek bir yere düşer ve doğrudan mutfağa gider; agent'lar stok, satın alma, vardiya, fiyat ve müşteri desteğinde yardım eder."
    ),
    description: t(
      "Serve brings a restaurant operating system, a food marketplace and a delivery network together: every order in one place, with agents helping run it.",
      "Serve; restoran işletim sistemini, yemek pazaryerini ve teslimat ağını birleştirir: her kanaldan gelen sipariş tek yerde, agent'lar işletmeye yardım eder."
    ),
    question: t(
      "How does every order get cooked and delivered on time?",
      "Her sipariş zamanında nasıl hazırlanır ve teslim edilir?"
    ),
    principles: [
      {
        title: t("Every order in one place", "Her sipariş tek yerde"),
        body: t(
          "POS, kiosk, QR menu, phone and delivery apps all feed one order system and one kitchen display.",
          "POS, kiosk, QR menü, telefon ve teslimat uygulamaları tek bir sipariş sistemine ve tek bir mutfak ekranına akar."
        ),
      },
      {
        title: t("Front to back", "Salondan mutfağa"),
        body: t(
          "Tables, menus, kitchen, stock, suppliers, staff and loyalty in one operating system.",
          "Masalar, menüler, mutfak, stok, tedarikçiler, personel ve sadakat tek işletim sisteminde."
        ),
      },
      {
        title: t("Your own delivery", "Kendi teslimatın"),
        body: t(
          "Dispatch, routing and live tracking with a courier app, with zones and pricing you control.",
          "Kurye uygulamasıyla dağıtım, rota ve canlı takip; bölgeleri ve fiyatları sen kontrol edersin."
        ),
      },
      {
        title: t("Agents in the kitchen", "Mutfakta agent'lar"),
        body: t(
          "Agents watch stock, plan purchasing and shifts, adjust prices and answer customers, within the limits you set.",
          "Agent'lar stoku izler, satın almayı ve vardiyaları planlar, fiyatları ayarlar ve müşterilere cevap verir; senin belirlediğin sınırlar içinde."
        ),
      },
    ],
    groups: [
      {
        title: t("Restaurant apps", "Restoran uygulamaları"),
        items: l(
          [
            "POS and handheld POS",
            "Waiter app",
            "Kiosk",
            "Kitchen display",
            "Back office and manager app",
            "Customer and courier apps",
          ],
          [
            "POS ve el terminali",
            "Garson uygulaması",
            "Kiosk",
            "Mutfak ekranı",
            "Arka ofis ve yönetici uygulaması",
            "Müşteri ve kurye uygulamaları",
          ]
        ),
      },
      {
        title: t("Operations", "Operasyon"),
        items: l(
          [
            "Orders, tables and reservations",
            "Menus and modifiers",
            "Inventory, procurement and suppliers",
            "Staff and shifts",
            "Loyalty and campaigns",
            "Analytics and accounting integration",
          ],
          [
            "Siparişler, masalar ve rezervasyonlar",
            "Menüler ve seçenekler",
            "Stok, satın alma ve tedarikçiler",
            "Personel ve vardiyalar",
            "Sadakat ve kampanyalar",
            "Analitik ve muhasebe entegrasyonu",
          ]
        ),
      },
      {
        title: t("Marketplace", "Pazaryeri"),
        items: l(
          [
            "Restaurant discovery and search",
            "Menus, cart and checkout",
            "Live order tracking",
            "Group, scheduled and corporate orders",
            "Reviews, favorites and reorder",
          ],
          [
            "Restoran keşfi ve arama",
            "Menü, sepet ve checkout",
            "Canlı sipariş takibi",
            "Grup, zamanlanmış ve kurumsal siparişler",
            "Yorumlar, favoriler ve tekrar sipariş",
          ]
        ),
      },
      {
        title: t("Delivery network", "Teslimat ağı"),
        items: l(
          [
            "Courier onboarding and availability",
            "Dispatch and assignment",
            "Route optimization and batching",
            "Live tracking and ETA",
            "Proof of delivery",
            "Delivery zones, pricing and earnings",
          ],
          [
            "Kurye kaydı ve müsaitlik",
            "Dağıtım ve atama",
            "Rota optimizasyonu ve toplu teslimat",
            "Canlı takip ve tahmini varış",
            "Teslimat kanıtı",
            "Teslimat bölgeleri, fiyatlar ve kazançlar",
          ]
        ),
      },
    ],
    agent: {
      lead: t(
        "Restaurant agents run the routine work. Customer agents can order for people: “something high in protein, under budget, here in 30 minutes.”",
        "Restoran agent'ları rutin işi yürütür. Müşteri agent'ları insanlar için sipariş verebilir: “yüksek proteinli, bütçemin altında, 30 dakikada gelecek bir şey.”"
      ),
      items: l(
        [
          "Inventory and procurement agents",
          "Kitchen and scheduling agents",
          "Pricing and campaign agents",
          "Finance agent",
          "Customer support agent",
          "Orders placed by customers' agents",
        ],
        [
          "Stok ve satın alma agent'ları",
          "Mutfak ve vardiya agent'ları",
          "Fiyat ve kampanya agent'ları",
          "Finans agent'ı",
          "Müşteri destek agent'ı",
          "Müşteri agent'larının verdiği siparişler",
        ]
      ),
    },
    facts: [
      {
        label: t("For", "Kimin için"),
        value: t(
          "Restaurants, chains, couriers and diners",
          "Restoranlar, zincirler, kuryeler ve müşteriler"
        ),
      },
      {
        label: t("Channels", "Kanallar"),
        value: t(
          "POS, kiosk, QR menu, phone, apps and delivery platforms",
          "POS, kiosk, QR menü, telefon, uygulamalar ve teslimat platformları"
        ),
      },
      {
        label: t("Kitchen", "Mutfak"),
        value: t(
          "One kitchen display for every channel",
          "Her kanal için tek mutfak ekranı"
        ),
      },
      { label: t("Status", "Durum"), value: t("Planned", "Planlanıyor") },
    ],
    connections: [
      {
        slug: "pay",
        text: t(
          "Payments at the table, the kiosk and the door.",
          "Masada, kioskta ve kapıda ödemeler."
        ),
      },
      {
        slug: "commerce",
        text: t(
          "Food ordering for agents shopping on someone's behalf.",
          "Birinin adına alışveriş yapan agent'lar için yemek siparişi."
        ),
      },
      {
        slug: "relay",
        text: t(
          "Order and delivery updates to diners, staff and couriers.",
          "Müşterilere, personele ve kuryelere sipariş ve teslimat güncellemeleri."
        ),
      },
    ],
    faq: [
      {
        question: t("What is suiss Serve?", "suiss Serve nedir?"),
        answer: t(
          "A restaurant platform that combines an operating system for the restaurant, a food marketplace and a delivery network, with agents that help run the business.",
          "Restoran için bir işletim sistemini, bir yemek pazaryerini ve bir teslimat ağını birleştiren; işi yürütmeye yardım eden agent'ları olan bir restoran platformu."
        ),
      },
      {
        question: t(
          "Does Serve work with delivery apps?",
          "Serve teslimat uygulamalarıyla çalışır mı?"
        ),
        answer: t(
          "Orders from delivery platforms, the POS, kiosks, QR menus and phone calls all land in one order system and one kitchen display.",
          "Teslimat platformlarından, POS'tan, kiosklardan, QR menülerden ve telefonla gelen siparişlerin hepsi tek sipariş sistemine ve tek mutfak ekranına düşer."
        ),
      },
      {
        question: t("Is Serve available?", "Serve kullanılabilir mi?"),
        answer: t("Serve is planned.", "Serve planlanıyor."),
      },
    ],
  },
  {
    slug: "work",
    name: "Work",
    image: "/images/products/work.jpg",
    status: "development",
    verb: t("Coordinate", "Koordine et"),
    category: t("Work coordination", "İş koordinasyonu"),
    tagline: t(
      "Who promised what, what is waiting, and who is needed now.",
      "Kim neyi söz verdi, ne bekliyor ve şimdi kime ihtiyaç var."
    ),
    summary: t(
      "Work coordinates work shared between people, AI agents, systems and machines. It records who promised what to whom, who acts on whose behalf, what each piece of work is waiting on and which decision falls to whom, and it brings each person only the items that need them. Work coordinates; the work itself is done by people and agents.",
      "Work; insanlar, AI agent'ları, sistemler ve makineler arasında paylaşılan işi koordine eder. Kimin kime neyi söz verdiğini, kimin kimin adına hareket ettiğini, her işin neyi beklediğini ve hangi kararın kime düştüğünü kaydeder; her insana sadece ona ihtiyaç duyan işleri getirir. Work koordine eder; işin kendisini insanlar ve agent'lar yapar."
    ),
    description: t(
      "Work coordinates work shared between people, AI agents, systems and machines: who promised what, what is waiting, and who is needed now.",
      "Work; insanlar, AI agent'ları, sistemler ve makineler arasındaki işi koordine eder: kim neyi söz verdi, ne bekliyor ve şimdi kime ihtiyaç var."
    ),
    question: t(
      "Who promised what to whom, what is waiting on what, and whose attention is needed now?",
      "Kim kime neyi söz verdi, ne neyi bekliyor ve şimdi kimin dikkatine ihtiyaç var?"
    ),
    principles: [
      {
        title: t("Commitments, not just tasks", "Sadece görev değil, taahhüt"),
        body: t(
          "Someone requests, someone promises, someone delivers and someone accepts. Saying “done” is not the same as acceptance.",
          "Biri ister, biri söz verir, biri teslim eder ve biri kabul eder. “Bitti” demek kabul etmekle aynı şey değildir."
        ),
      },
      {
        title: t("Only what needs you", "Sadece sana ihtiyaç duyan"),
        body: t(
          "Needs Attention shows only the items that need you, why now, and what happens if you wait. Briefing shows what changed while you were away.",
          "Dikkat Gerekenler sadece sana ihtiyaç duyan işleri, neden şimdi olduğunu ve beklersen ne olacağını gösterir. Özet, sen yokken neyin değiştiğini gösterir."
        ),
      },
      {
        title: t(
          "People and agents together",
          "İnsanlar ve agent'lar birlikte"
        ),
        body: t(
          "Hand work to agents, watch progress live and step in. Every piece of work has one accountable owner and one driver at a time.",
          "İşi agent'lara ver, ilerlemeyi canlı izle ve araya gir. Her işin tek bir sorumlu sahibi ve aynı anda tek bir yürütücüsü vardır."
        ),
      },
      {
        title: t("Honest controls", "Dürüst kontroller"),
        body: t(
          "Stop, take over and change are offered only where the agent or system doing the work actually supports them.",
          "Durdur, devral ve değiştir sadece işi yapan agent ya da sistem bunları gerçekten destekliyorsa sunulur."
        ),
      },
      {
        title: t("A record you can trust", "Güvenebileceğin bir kayıt"),
        body: t(
          "Every change is a signed record, and the state of work is computed from those records rather than edited by hand.",
          "Her değişiklik imzalı bir kayıttır ve işin durumu elle düzenlenmez, bu kayıtlardan hesaplanır."
        ),
      },
    ],
    groups: [
      {
        title: t("Commitments", "Taahhütler"),
        items: l(
          [
            "Request, promise, decline and counter-offer",
            "Conditional promises",
            "Declare done, then accept or reject",
            "Two-person acceptance",
            "Sub-commitments with risk roll-up",
            "Budgets, deadlines and regular updates",
          ],
          [
            "İste, söz ver, reddet ve karşı teklif yap",
            "Koşullu sözler",
            "Bitti de, sonra kabul ya da reddet",
            "İki kişilik kabul",
            "Risk toplamalı alt taahhütler",
            "Bütçeler, son tarihler ve düzenli güncellemeler",
          ]
        ),
      },
      {
        title: t("Attention", "Dikkat"),
        items: l(
          [
            "Needs Attention",
            "Briefing",
            "My Work",
            "Waits that say who or what, why and until when",
            "Escalation through Relay",
            "Muting that never stops the clock",
          ],
          [
            "Dikkat Gerekenler",
            "Özet",
            "İşlerim",
            "Kimi ya da neyi, neden ve ne zamana kadar beklediğini söyleyen beklemeler",
            "Relay üzerinden eskalasyon",
            "Saati asla durdurmayan sessize alma",
          ]
        ),
      },
      {
        title: t("Control", "Kontrol"),
        items: l(
          [
            "Accountable owner and single driver",
            "Take control and give back with a handoff note",
            "Stop now, finish safely or pause",
            "Automatic, intervened and manual modes",
            "Proceed, notify, require a decision or deny",
            "Queues and pools",
          ],
          [
            "Sorumlu sahip ve tek yürütücü",
            "Devir notuyla kontrolü al ve geri ver",
            "Hemen dur, güvenle bitir ya da duraklat",
            "Otomatik, müdahaleli ve manuel modlar",
            "Devam et, bildir, karar iste ya da reddet",
            "Kuyruklar ve havuzlar",
          ]
        ),
      },
      {
        title: t("Decisions", "Kararlar"),
        items: l(
          [
            "Decision, acceptance and plan approval gates",
            "All, any, K-of-N and sequential approvals",
            "Live presence and control handoff",
            "Approvals never inferred from chat",
            "Authority checked by Access",
          ],
          [
            "Karar, kabul ve plan onayı kapıları",
            "Hepsi, herhangi biri, K'da N ve sıralı onaylar",
            "Canlı varlık ve kontrol devri",
            "Onaylar asla sohbetten çıkarılmaz",
            "Yetki Access tarafından denetlenir",
          ]
        ),
      },
      {
        title: t("Trust", "Güven"),
        items: l(
          [
            "Signed, append-only records",
            "Offline verification",
            "Evidence and provenance",
            "Export and replay",
            "Work across organizations",
            "Crypto-shredding for personal data",
          ],
          [
            "İmzalı, sadece eklenen kayıtlar",
            "Çevrimdışı doğrulama",
            "Kanıt ve köken",
            "Dışa aktarma ve tekrar oynatma",
            "Kurumlar arası iş",
            "Kişisel veri için kriptografik imha",
          ]
        ),
      },
      {
        title: t("Extend", "Genişlet"),
        items: l(
          [
            "Practices: templates for each industry",
            "REST API",
            "CloudEvents and signed webhooks",
            "Importers for existing tools",
            "Web app and mobile app with offline queue",
          ],
          [
            "Uygulamalar: her sektör için şablonlar",
            "REST API",
            "CloudEvents ve imzalı webhook'lar",
            "Mevcut araçlar için içe aktarıcılar",
            "Web uygulaması ve çevrimdışı kuyruklu mobil uygulama",
          ]
        ),
      },
    ],
    agent: {
      lead: t(
        "Give work to agents and receive work from them over open protocols. Work never runs the agent; it keeps the commitment, the waits and the decisions honest.",
        "Açık protokollerle agent'lara iş ver ve onlardan iş al. Work agent'ı çalıştırmaz; taahhüdü, beklemeleri ve kararları dürüst tutar."
      ),
      items: l(
        [
          "Assign work to agents across machines",
          "A2A client and server",
          "MCP tools scoped to the caller's authority",
          "Controls offered only when the agent supports them",
          "Heartbeats and progress reports",
          "No agent can answer a human decision",
        ],
        [
          "Makineler arasında agent'lara iş ata",
          "A2A istemci ve sunucu",
          "Çağıranın yetkisine göre daraltılmış MCP araçları",
          "Kontroller sadece agent destekliyorsa sunulur",
          "Nabız ve ilerleme raporları",
          "Hiçbir agent bir insan kararını yanıtlayamaz",
        ]
      ),
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
        label: t("For", "Kimin için"),
        value: t(
          "Teams coordinating people, agents, systems and machines",
          "İnsanları, agent'ları, sistemleri ve makineleri koordine eden ekipler"
        ),
      },
      {
        label: t("Built with", "Teknoloji"),
        value: t(
          "Rust, with one core shared by server, web and mobile",
          "Rust; sunucu, web ve mobil için tek ortak çekirdek"
        ),
      },
      {
        label: t("Clients", "İstemciler"),
        value: t("Web app and mobile app", "Web uygulaması ve mobil uygulama"),
      },
      {
        label: t("Records", "Kayıtlar"),
        value: t(
          "Signed and verifiable offline",
          "İmzalı ve çevrimdışı doğrulanabilir"
        ),
      },
    ],
    connections: [
      {
        slug: "access",
        text: t(
          "Identity and authority; Work can narrow authority but never create it.",
          "Kimlik ve yetki; Work yetkiyi daraltabilir ama asla üretemez."
        ),
      },
      {
        slug: "relay",
        text: t(
          "Notifications, real-time updates and escalation delivery.",
          "Bildirimler, gerçek zamanlı güncellemeler ve eskalasyon iletimi."
        ),
      },
      {
        slug: "one",
        text: t(
          "Your One takes part as your representative; its private context never enters Work.",
          "One'ın senin temsilcin olarak katılır; özel bağlamı asla Work'e girmez."
        ),
      },
    ],
    faq: [
      {
        question: t("What is suiss Work?", "suiss Work nedir?"),
        answer: t(
          "A work coordination system for people and AI agents. It tracks commitments, what each piece of work is waiting on and whose decision or attention is needed.",
          "İnsanlar ve AI agent'ları için bir iş koordinasyon sistemi. Taahhütleri, her işin neyi beklediğini ve kimin kararına ya da dikkatine ihtiyaç olduğunu takip eder."
        ),
      },
      {
        question: t(
          "Does Work run AI agents?",
          "Work AI agent'larını çalıştırır mı?"
        ),
        answer: t(
          "No. Agents run wherever they run. Work assigns them work, follows their progress and offers controls like stop or take over when the agent supports them.",
          "Hayır. Agent'lar nerede çalışıyorsa orada çalışır. Work onlara iş atar, ilerlemelerini takip eder ve agent destekliyorsa durdur ya da devral gibi kontroller sunar."
        ),
      },
      {
        question: t(
          "How is a commitment different from a task?",
          "Taahhüdün görevden farkı ne?"
        ),
        answer: t(
          "A commitment has a requester and a promiser. It is finished when the requester accepts the delivery, not when the doer says it is done.",
          "Bir taahhüdün bir isteyeni ve bir söz vereni vardır. Yapan “bitti” dediğinde değil, isteyen teslimatı kabul ettiğinde tamamlanır."
        ),
      },
      {
        question: t("Is Work available?", "Work kullanılabilir mi?"),
        answer: t("Work is in development.", "Work geliştiriliyor."),
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
  status: Text
  tagline: Text
  points: List
}

export const libraries: Library[] = [
  {
    slug: "ui",
    name: "suiss/ui",
    image: "/images/products/ui.jpg",
    url: `${site.url}/ui`,
    install: "npx @esuiss/ui@latest init",
    status: t(
      "Open source · Available now",
      "Açık kaynak · Şimdi kullanılabilir"
    ),
    tagline: t(
      "Copy-paste components, patterns, charts and blocks with a clean, minimal design, for React, React Native, SwiftUI and Jetpack Compose.",
      "React, React Native, SwiftUI ve Jetpack Compose için sade ve minimal tasarımlı kopyala-yapıştır bileşenler, kalıplar, grafikler ve bloklar."
    ),
    points: l(
      [
        "React, React Native, SwiftUI and Jetpack Compose",
        "Base UI, Radix or React Aria",
        "One set of design tokens",
        "You own the code",
      ],
      [
        "React, React Native, SwiftUI ve Jetpack Compose",
        "Base UI, Radix ya da React Aria",
        "Tek tasarım token seti",
        "Kod senin",
      ]
    ),
  },
]
