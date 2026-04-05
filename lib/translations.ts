type TranslationKey =
  | "home"
  | "workshops"
  | "experts"
  | "quickpath"
  | "about"
  | "contact"
  | "bookNow"
  | "learnMore"
  | "viewDetails"
  | "footerRights"
  | "supportingFamilies"
  | "empoweringParents"
  | "workshopsGuidance"
  | "browseWorkshops"
  | "discoverQuickPath"
  | "familiesHelped"
  | "categories"
  | "exploreCategoriesDesc"
  | "sleep"
  | "nutrition"
  | "behavior"
  | "learning"
  | "emotions"
  | "other"
  | "meetExperts"
  | "learnFromExpertsDesc"
  | "introducingQuickPath"
  | "quickPathGuidance"
  | "instantAdviceDesc"
  | "shareChallenge"
  | "shareChallengeDesc"
  | "getPersonalizedGuidance"
  | "getPersonalizedGuidanceDesc"
  | "followYourPath"
  | "followYourPathDesc"
  | "trackProgress"
  | "trackProgressDesc"
  | "step"
  | "startQuickPathJourney"
  | "quickLinks"
  | "support"
  | "faq"
  | "aboutUs"
  | "legal"
  | "privacyPolicy"
  | "termsOfService"
  | "madeWithLove"
  | "upcomingWorkshops"
  | "upcomingWorkshopsDesc"
  | "noWorkshops"
  | "moreWorkshops"
  | "moreExperts"
  | "tagline"
  | "ourValues"
  | "ourValuesDesc"
  | "valueTrust"
  | "valueTrustDesc"
  | "valueKindness"
  | "valueKindnessDesc"
  | "valueAccessibility"
  | "valueAccessibilityDesc"
  | "valueGrowth"
  | "valueGrowthDesc"
  | "valueCulturalFit"
  | "valueCulturalFitDesc"
  | "aboutPageTitle"
  | "ourMission"
  | "missionText1"
  | "missionText2"
  | "ourStory"
  | "storyText1"
  | "storyText2"
  | "contactUs"
  | "contactDesc"
  | "yourName"
  | "namePlaceholder"
  | "yourEmail"
  | "emailPlaceholder"
  | "subject"
  | "subjectPlaceholder"
  | "message"
  | "messagePlaceholder"
  | "sendMessage"

type Translations = {
  [lang in "en" | "fr" | "ar"]: {
    [key in TranslationKey]: string
  }
}

const translations: Translations = {
  en: {
    home: "Home",
    workshops: "Workshops",
    experts: "Experts",
    quickpath: "QuickPath",
    about: "About",
    contact: "Contact",
    bookNow: "Book Now",
    learnMore: "Learn More",
    viewDetails: "View details",
    footerRights: "All rights reserved.",
    supportingFamilies: "Supporting families worldwide",
    empoweringParents: "Empowering parents together",
    workshopsGuidance: "Workshops, guidance, and expert support for every parenting journey.",
    browseWorkshops: "Browse workshops",
    discoverQuickPath: "Discover QuickPath",
    familiesHelped: "Families helped",
    categories: "Categories",
    exploreCategoriesDesc: "Explore workshops by topic to find what you need",
    sleep: "Sleep",
    nutrition: "Nutrition",
    behavior: "Behavior",
    learning: "Learning",
    emotions: "Emotions",
    other: "Other",
    meetExperts: "Meet our experts",
    learnFromExpertsDesc: "Learn from experienced professionals dedicated to supporting families",
    introducingQuickPath: "Introducing QuickPath",
    quickPathGuidance: "QuickPath Guidance",
    instantAdviceDesc: "Get instant, personalized parenting advice tailored to your unique situation",
    shareChallenge: "Share Your Challenge",
    shareChallengeDesc: "Tell us about the parenting situation you're facing in your own words.",
    getPersonalizedGuidance: "Get Personalized Guidance",
    getPersonalizedGuidanceDesc: "Receive tailored advice from our expert system matched to your needs.",
    followYourPath: "Follow Your Path",
    followYourPathDesc: "Access a customized action plan with resources and workshop recommendations.",
    trackProgress: "Track Your Progress",
    trackProgressDesc: "Monitor improvements and adjust your approach with ongoing support.",
    step: "STEP",
    startQuickPathJourney: "Start your QuickPath journey",
    quickLinks: "Quick Links",
    support: "Support",
    faq: "FAQ",
    aboutUs: "About Us",
    legal: "Legal",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    madeWithLove: "Made with love for families everywhere.",
    upcomingWorkshops: "Upcoming Workshops",
    upcomingWorkshopsDesc: "Join our upcoming sessions to learn and connect with other parents",
    noWorkshops: "No upcoming workshops at the moment.",
    moreWorkshops: "More workshops",
    moreExperts: "More experts",
    tagline: "With you, from bump to baby and beyond.",
    ourValues: "Our Values",
    ourValuesDesc: "The principles that guide everything we do at Parentys",
    valueTrust: "Trust",
    valueTrustDesc: "We partner with verified experts and provide evidence-based guidance you can rely on.",
    valueKindness: "Kindness",
    valueKindnessDesc: "Every parent's journey is unique. We offer compassionate, judgment-free support.",
    valueAccessibility: "Accessibility",
    valueAccessibilityDesc: "Quality parenting support should be available to everyone, everywhere.",
    valueGrowth: "Growth",
    valueGrowthDesc: "We celebrate every milestone and support continuous learning for parents and children.",
    valueCulturalFit: "Cultural Fit",
    valueCulturalFitDesc: "We respect and honor diverse cultural perspectives on parenting and family.",
    aboutPageTitle: "About Parentys",
    ourMission: "Our Mission",
    missionText1:
      "Parentys was created with a simple belief: every parent deserves access to trusted guidance and a supportive community during their parenting journey.",
    missionText2:
      "We bring together experienced professionals, evidence-based content, and innovative technology to provide personalized support that fits your unique situation and cultural context.",
    ourStory: "Our Story",
    storyText1:
      "Founded by parents who understand the challenges of raising children in today's world, Parentys combines the wisdom of traditional parenting with modern insights.",
    storyText2:
      "Our platform connects you with experts who respect your values while providing practical, actionable guidance for real-world parenting situations.",
    contactUs: "Contact Us",
    contactDesc: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    yourName: "Your Name",
    namePlaceholder: "Enter your name",
    yourEmail: "Your Email",
    emailPlaceholder: "Enter your email",
    subject: "Subject",
    subjectPlaceholder: "What is this about?",
    message: "Message",
    messagePlaceholder: "Tell us how we can help...",
    sendMessage: "Send Message",
  },
  fr: {
    home: "Accueil",
    workshops: "Ateliers",
    experts: "Experts",
    quickpath: "QuickPath",
    about: "À propos",
    contact: "Contact",
    bookNow: "Réserver",
    learnMore: "En savoir plus",
    viewDetails: "Voir les détails",
    footerRights: "Tous droits réservés.",
    supportingFamilies: "Accompagner les familles du monde entier",
    empoweringParents: "Autonomiser les parents ensemble",
    workshopsGuidance: "Ateliers, conseils et soutien d'experts pour chaque parcours parental.",
    browseWorkshops: "Parcourir les ateliers",
    discoverQuickPath: "Découvrir QuickPath",
    familiesHelped: "Familles aidées",
    categories: "Catégories",
    exploreCategoriesDesc: "Explorez les ateliers par thème pour trouver ce dont vous avez besoin",
    sleep: "Sommeil",
    nutrition: "Nutrition",
    behavior: "Comportement",
    learning: "Apprentissage",
    emotions: "Émotions",
    other: "Autre",
    meetExperts: "Rencontrez nos experts",
    learnFromExpertsDesc: "Apprenez auprès de professionnels expérimentés dédiés au soutien des familles",
    introducingQuickPath: "Présentation de QuickPath",
    quickPathGuidance: "Orientation QuickPath",
    instantAdviceDesc: "Obtenez des conseils parentaux instantanés et personnalisés adaptés à votre situation unique",
    shareChallenge: "Partagez votre défi",
    shareChallengeDesc: "Parlez-nous de la situation parentale à laquelle vous êtes confronté avec vos propres mots.",
    getPersonalizedGuidance: "Obtenez des conseils personnalisés",
    getPersonalizedGuidanceDesc: "Recevez des conseils adaptés de notre système d'experts correspondant à vos besoins.",
    followYourPath: "Suivez votre parcours",
    followYourPathDesc:
      "Accédez à un plan d'action personnalisé avec des ressources et des recommandations d'ateliers.",
    trackProgress: "Suivez vos progrès",
    trackProgressDesc: "Surveillez les améliorations et ajustez votre approche avec un soutien continu.",
    step: "ÉTAPE",
    startQuickPathJourney: "Commencez votre parcours QuickPath",
    quickLinks: "Liens rapides",
    support: "Assistance",
    faq: "FAQ",
    aboutUs: "À propos de nous",
    legal: "Mentions légales",
    privacyPolicy: "Politique de confidentialité",
    termsOfService: "Conditions d'utilisation",
    madeWithLove: "Fait avec amour pour les familles du monde entier.",
    upcomingWorkshops: "Ateliers à venir",
    upcomingWorkshopsDesc: "Rejoignez nos prochaines sessions pour apprendre et vous connecter avec d'autres parents",
    noWorkshops: "Aucun atelier à venir pour le moment.",
    moreWorkshops: "Plus d'ateliers",
    moreExperts: "Plus d'experts",
    tagline: "Avec vous, du ventre au bébé et au-delà.",
    ourValues: "Nos Valeurs",
    ourValuesDesc: "Les principes qui guident tout ce que nous faisons chez Parentys",
    valueTrust: "Confiance",
    valueTrustDesc: "Nous collaborons avec des experts vérifiés et fournissons des conseils fondés sur des preuves.",
    valueKindness: "Bienveillance",
    valueKindnessDesc: "Chaque parcours parental est unique. Nous offrons un soutien compatissant et sans jugement.",
    valueAccessibility: "Accessibilité",
    valueAccessibilityDesc: "Un soutien parental de qualité devrait être accessible à tous, partout.",
    valueGrowth: "Épanouissement",
    valueGrowthDesc: "Nous célébrons chaque étape et soutenons l'apprentissage continu des parents et des enfants.",
    valueCulturalFit: "Adaptation culturelle",
    valueCulturalFitDesc: "Nous respectons et honorons les perspectives culturelles diverses sur la parentalité.",
    aboutPageTitle: "À propos de Parentys",
    ourMission: "Notre Mission",
    missionText1:
      "Parentys a été créé avec une conviction simple : chaque parent mérite d'accéder à des conseils fiables et à une communauté solidaire pendant son parcours parental.",
    missionText2:
      "Nous réunissons des professionnels expérimentés, du contenu fondé sur des preuves et une technologie innovante pour fournir un soutien personnalisé adapté à votre situation unique et à votre contexte culturel.",
    ourStory: "Notre Histoire",
    storyText1:
      "Fondé par des parents qui comprennent les défis d'élever des enfants dans le monde d'aujourd'hui, Parentys combine la sagesse de la parentalité traditionnelle avec des idées modernes.",
    storyText2:
      "Notre plateforme vous met en relation avec des experts qui respectent vos valeurs tout en fournissant des conseils pratiques et concrets pour des situations parentales réelles.",
    contactUs: "Contactez-nous",
    contactDesc:
      "Nous aimerions avoir de vos nouvelles. Envoyez-nous un message et nous vous répondrons dès que possible.",
    yourName: "Votre nom",
    namePlaceholder: "Entrez votre nom",
    yourEmail: "Votre email",
    emailPlaceholder: "Entrez votre email",
    subject: "Sujet",
    subjectPlaceholder: "De quoi s'agit-il ?",
    message: "Message",
    messagePlaceholder: "Dites-nous comment nous pouvons vous aider...",
    sendMessage: "Envoyer le message",
  },
  ar: {
    home: "الرئيسية",
    workshops: "ورشات",
    experts: "الخبراء",
    quickpath: "QuickPath",
    about: "حول",
    contact: "اتصال",
    bookNow: "احجز الآن",
    learnMore: "اكتشف المزيد",
    viewDetails: "عرض التفاصيل",
    footerRights: "جميع الحقوق محفوظة.",
    supportingFamilies: "دعم العائلات في جميع أنحاء العالم",
    empoweringParents: "تمكين الآباء معًا",
    workshopsGuidance: "ورش عمل وإرشادات ودعم الخبراء لكل رحلة أبوية.",
    browseWorkshops: "تصفح الورشات",
    discoverQuickPath: "اكتشف QuickPath",
    familiesHelped: "العائلات التي ساعدناها",
    categories: "الفئات",
    exploreCategoriesDesc: "استكشف الورش حسب الموضوع للعثور على ما تحتاجه",
    sleep: "النوم",
    nutrition: "التغذية",
    behavior: "السلوك",
    learning: "التعلم",
    emotions: "المشاعر",
    other: "أخرى",
    meetExperts: "تعرف على خبرائنا",
    learnFromExpertsDesc: "تعلم من المهنيين ذوي الخبرة المكرسين لدعم العائلات",
    introducingQuickPath: "تقديم QuickPath",
    quickPathGuidance: "إرشادات QuickPath",
    instantAdviceDesc: "احصل على نصائح أبوية فورية وشخصية مصممة خصيصًا لموقفك الفريد",
    shareChallenge: "شارك تحديك",
    shareChallengeDesc: "أخبرنا عن الموقف الأبوي الذي تواجهه بكلماتك الخاصة.",
    getPersonalizedGuidance: "احصل على إرشادات شخصية",
    getPersonalizedGuidanceDesc: "احصل على نصائح مخصصة من نظام الخبراء لدينا تتناسب مع احتياجاتك.",
    followYourPath: "اتبع مسارك",
    followYourPathDesc: "الوصول إلى خطة عمل مخصصة مع الموارد وتوصيات الورشة.",
    trackProgress: "تتبع تقدمك",
    trackProgressDesc: "راقب التحسينات واضبط نهجك مع الدعم المستمر.",
    step: "الخطوة",
    startQuickPathJourney: "ابدأ رحلة QuickPath الخاصة بك",
    quickLinks: "روابط سريعة",
    support: "الدعم",
    faq: "الأسئلة الشائعة",
    aboutUs: "معلومات عنا",
    legal: "القانونية",
    privacyPolicy: "سياسة الخصوصية",
    termsOfService: "شروط الخدمة",
    madeWithLove: "صنع بحب للعائلات في كل مكان.",
    upcomingWorkshops: "الورشات القادمة",
    upcomingWorkshopsDesc: "انضم إلى جلساتنا القادمة للتعلم والتواصل مع الآباء الآخرين",
    noWorkshops: "لا توجد ورش عمل قادمة في الوقت الحالي.",
    moreWorkshops: "المزيد من الورشات",
    moreExperts: "المزيد من الخبراء",
    tagline: "معاك، من الحمل للطفل وما بعد.",
    ourValues: "قيمنا",
    ourValuesDesc: "المبادئ التي توجه كل ما نقوم به في Parentys",
    valueTrust: "الثقة",
    valueTrustDesc: "نتعاون مع خبراء معتمدين ونقدم إرشادات مبنية على الأدلة يمكنك الوثوق بها.",
    valueKindness: "اللطف",
    valueKindnessDesc: "كل رحلة أبوية فريدة. نقدم دعمًا عطوفًا وخاليًا من الأحكام.",
    valueAccessibility: "سهولة الوصول",
    valueAccessibilityDesc: "يجب أن يكون الدعم الأبوي عالي الجودة متاحًا للجميع في كل مكان.",
    valueGrowth: "النمو",
    valueGrowthDesc: "نحتفل بكل مرحلة وندعم التعلم المستمر للآباء والأطفال.",
    valueCulturalFit: "التوافق الثقافي",
    valueCulturalFitDesc: "نحترم ونكرم وجهات النظر الثقافية المتنوعة حول الأبوة والأسرة.",
    aboutPageTitle: "حول Parentys",
    ourMission: "مهمتنا",
    missionText1:
      "تم إنشاء Parentys بمعتقد بسيط: يستحق كل والد الوصول إلى التوجيه الموثوق والمجتمع الداعم خلال رحلته الأبوية.",
    missionText2:
      "نجمع بين المهنيين ذوي الخبرة والمحتوى القائم على الأدلة والتكنولوجيا المبتكرة لتقديم دعم مخصص يناسب وضعك الفريد وسياقك الثقافي.",
    ourStory: "قصتنا",
    storyText1:
      "تأسست من قبل آباء يفهمون تحديات تربية الأطفال في عالم اليوم، تجمع Parentys بين حكمة الأبوة التقليدية والأفكار الحديثة.",
    storyText2: "تربطك منصتنا بخبراء يحترمون قيمك مع تقديم إرشادات عملية وقابلة للتنفيذ لمواقف أبوية حقيقية.",
    contactUs: "اتصل بنا",
    contactDesc: "نود أن نسمع منك. أرسل لنا رسالة وسنرد في أقرب وقت ممكن.",
    yourName: "اسمك",
    namePlaceholder: "أدخل اسمك",
    yourEmail: "بريدك الإلكتروني",
    emailPlaceholder: "أدخل بريدك الإلكتروني",
    subject: "الموضوع",
    subjectPlaceholder: "ما هو هذا؟",
    message: "الرسالة",
    messagePlaceholder: "أخبرنا كيف يمكننا المساعدة...",
    sendMessage: "إرسال الرسالة",
  },
}

export function t(key: TranslationKey, userLang?: "en" | "fr" | "ar"): string {
  const lang = userLang || "fr"
  return translations[lang]?.[key] || translations["fr"][key] || key
}
