export const locales = ["en", "tr"] as const

export type Locale = (typeof locales)[number]

const defaultLocale: Locale = "en"

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value)

export const localePath = (locale: Locale, path = "/") =>
  locale === defaultLocale ? path : `/${locale}${path === "/" ? "" : path}`

export type Text = Record<Locale, string>

const dictionaries = {
  en: {
    htmlLang: "en",
    ogLocale: "en_US",
    languageName: "English",
    switchLanguage: "Türkçe",
    title: "suiss – Infrastructure for the agent era",
    description:
      "suiss builds agent-native infrastructure: a personal agent, identity and authority, events and messaging, personal money, payments, commerce, restaurants and work coordination.",
    heroTitle: "Infrastructure for the agent era.",
    heroSubtitle:
      "Eight products that let people and their agents understand, authorize, communicate, pay, buy and coordinate work together.",
    exploreProducts: "Explore products",
    forDevelopers: "For developers",
    approachLabel: "Approach",
    approachLead: "Eight products.",
    approachLeadMuted: "One system.",
    approachBody:
      "Each product does one job and does it for people and agents alike.",
    approachBodyMuted:
      "Together they let an agent act on your behalf, with authority you control.",
    productsLabel: "Products",
    productsTitle: "Meet the lineup.",
    productsTitleMuted: "Each one ready for agents.",
    verbsLabel: "One verb each",
    verbsTitle: "Every product answers one question.",
    developersLabel: "Developers",
    developersTitle: "Build with suiss today.",
    developersBody:
      "Our component libraries are open source and available now.",
    learnMore: "Learn more",
    visitSite: "Visit site",
    inDevelopment: "In development",
    planned: "Planned",
    principlesLabel: "Principles",
    standardsLabel: "Standards and protocols",
    factsLabel: "At a glance",
    faqLabel: "Questions",
    rulesLabel: "Guarantees",
    availableNow: "Available now",
    capabilitiesLabel: "Capabilities",
    agentLabel: "Agent-native",
    questionLabel: "The question",
    worksWithLabel: "Works with",
    nextProduct: "Next product",
    menu: "Menu",
    close: "Close",
    products: "Products",
    developers: "Developers",
    company: "Company",
    github: "GitHub",
    copyright: "Copyright © 2026 suiss. All rights reserved.",
    backToTop: "Back to top",
    themeSystem: "Theme: system",
    themeLight: "Theme: light",
    themeDark: "Theme: dark",
    allProducts: "All products",
  },
  tr: {
    htmlLang: "tr",
    ogLocale: "tr_TR",
    languageName: "Türkçe",
    switchLanguage: "English",
    title: "suiss – Agent çağı için altyapı",
    description:
      "suiss agent-native altyapı geliştirir: kişisel agent, kimlik ve yetki, event ve mesajlaşma, kişisel para, ödeme, ticaret, restoran ve iş koordinasyonu.",
    heroTitle: "Agent çağı için altyapı.",
    heroSubtitle:
      "İnsanların ve agent'larının birlikte anlamasını, yetkilendirmesini, iletişim kurmasını, ödemesini, alışveriş yapmasını ve işi koordine etmesini sağlayan sekiz ürün.",
    exploreProducts: "Ürünleri keşfet",
    forDevelopers: "Geliştiriciler için",
    approachLabel: "Yaklaşım",
    approachLead: "Sekiz ürün.",
    approachLeadMuted: "Tek sistem.",
    approachBody:
      "Her ürün tek bir işi yapar ve bunu insanlar ve agent'lar için aynı şekilde yapar.",
    approachBodyMuted:
      "Birlikte, bir agent'ın senin kontrol ettiğin yetkiyle senin adına hareket etmesini sağlar.",
    productsLabel: "Ürünler",
    productsTitle: "Ürün ailesiyle tanış.",
    productsTitleMuted: "Her biri agent'lara hazır.",
    verbsLabel: "Her biri tek fiil",
    verbsTitle: "Her ürün tek bir soruyu yanıtlar.",
    developersLabel: "Geliştiriciler",
    developersTitle: "suiss ile bugün geliştir.",
    developersBody:
      "Bileşen kütüphanelerimiz açık kaynak ve şimdi kullanılabilir.",
    learnMore: "Daha fazla bilgi",
    visitSite: "Siteye git",
    inDevelopment: "Geliştiriliyor",
    planned: "Planlanıyor",
    principlesLabel: "İlkeler",
    standardsLabel: "Standartlar ve protokoller",
    factsLabel: "Bir bakışta",
    faqLabel: "Sorular",
    rulesLabel: "Güvenceler",
    availableNow: "Şimdi kullanılabilir",
    capabilitiesLabel: "Yetenekler",
    agentLabel: "Agent-native",
    questionLabel: "Soru",
    worksWithLabel: "Birlikte çalışır",
    nextProduct: "Sonraki ürün",
    menu: "Menü",
    close: "Kapat",
    products: "Ürünler",
    developers: "Geliştiriciler",
    company: "Şirket",
    github: "GitHub",
    copyright: "Telif hakkı © 2026 suiss. Tüm hakları saklıdır.",
    backToTop: "Başa dön",
    themeSystem: "Tema: sistem",
    themeLight: "Tema: açık",
    themeDark: "Tema: koyu",
    allProducts: "Tüm ürünler",
  },
} satisfies Record<Locale, Record<string, string>>

export type Dictionary = (typeof dictionaries)["en"]

export const getDictionary = (locale: Locale): Dictionary =>
  dictionaries[locale]
