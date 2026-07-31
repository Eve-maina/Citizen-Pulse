export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'sw', label: 'Kiswahili' },
];

export const TOPIC_LABELS = {
  en: {
    Governance: 'Governance',
    Education: 'Education',
    Health: 'Health',
    'Water & Infrastructure': 'Water & Infrastructure',
    Security: 'Security',
    Agriculture: 'Agriculture',
    Environment: 'Environment',
  },
  sw: {
    Governance: 'Utawala',
    Education: 'Elimu',
    Health: 'Afya',
    'Water & Infrastructure': 'Maji na Miundombinu',
    Security: 'Usalama',
    Agriculture: 'Kilimo',
    Environment: 'Mazingira',
  },
};

export const URGENCY_LABELS = {
  en: { high: 'High', medium: 'Medium', low: 'Low' },
  sw: { high: 'Juu', medium: 'Wastani', low: 'Chini' },
};

export const TOPIC_DESCRIPTIONS = {
  en: {
    Governance:
      'Report issues with local administration, public services, or accountability in your ward.',
    Education:
      'Speak up about schools, classrooms, teachers, vocational training, or student welfare.',
    Health:
      'Flag clinic shortages, medicine gaps, maternal care, or access to health facilities.',
    'Water & Infrastructure':
      'Request boreholes, piped water, roads, bridges, or other essential infrastructure.',
    Security:
      'Raise concerns about safety, policing, lighting, or community security in your area.',
    Agriculture:
      'Share needs around farming support, markets, irrigation, livestock, or crop losses.',
    Environment:
      'Report pollution, waste collection, flooding, deforestation, or coastal protection.',
  },
  sw: {
    Governance:
      'Ripoti matatizo ya utawala wa eneo, huduma za umma, au uwajibikaji katika kata yako.',
    Education:
      'Sema kuhusu shule, madarasa, walimu, mafunzo ya ufundi, au hali ya wanafunzi.',
    Health:
      'Onyesha uhaba wa kliniki, dawa, huduma ya uzazi, au ufikiaji wa vituo vya afya.',
    'Water & Infrastructure':
      'Omba visima, maji ya bomba, barabara, madaraja, au miundombinu muhimu.',
    Security:
      'Eleza wasiwasi kuhusu usalama, polisi, taa za barabarani, au usalama wa jamii.',
    Agriculture:
      'Shiriki mahitaji ya kilimo, masoko, umwagiliaji, mifugo, au hasara za mazao.',
    Environment:
      'Ripoti uchafuzi, uchukuzi wa taka, mafuriko, ukataji miti, au ulinzi wa pwani.',
  },
};

export const TOPIC_EXAMPLES = {
  en: {
    Governance: ['Delayed IDs', 'Corruption reports', 'Chief’s office'],
    Education: ['Classroom shortage', 'School fees', 'Lab equipment'],
    Health: ['Drug stock-outs', 'Clinic hours', 'Ambulance access'],
    'Water & Infrastructure': ['Broken borehole', 'Potholed roads', 'Power cuts'],
    Security: ['Street lighting', 'Youth gangs', 'Police response'],
    Agriculture: ['Fertilizer access', 'Market prices', 'Irrigation'],
    Environment: ['Garbage dumps', 'Beach erosion', 'Flooding'],
  },
  sw: {
    Governance: ['Ucheleweshaji wa vitambulisho', 'Ripoti za rushwa', 'Ofisi ya chief'],
    Education: ['Uhaba wa madarasa', 'Ada za shule', 'Vifaa vya maabara'],
    Health: ['Uhaba wa dawa', 'Saa za kliniki', 'Ufikiaji wa gari la wagonjwa'],
    'Water & Infrastructure': ['Kisima kilichovunjika', 'Barabara zenye mashimo', 'Ukataji wa umeme'],
    Security: ['Taa za barabarani', 'Vikundi vya vijana', 'Mwitikio wa polisi'],
    Agriculture: ['Ufikiaji wa mbolea', 'Bei za sokoni', 'Umwagiliaji'],
    Environment: ['Taka za mchanga', 'Mmomonyoko wa pwani', 'Mafuriko'],
  },
};

export const STRINGS = {
  en: {
    appName: 'Citizen Pulse',
    tagline: "Your development voice, heard by your MP",
    chooseTopic: 'Choose the topic that best fits your request',
    impactCaption: 'Every submission, from a school to a clinic to a road, helps build the picture your MP acts on.',
    topicsSectionTitle: 'What would you like to report?',
    topicsSectionSubtitle: 'Pick a category below — each card opens a short form for your ward.',
    howItWorksTitle: 'How it works',
    howItWorksStep1Title: 'Choose a topic',
    howItWorksStep1Desc: 'Select the area that best matches your need.',
    howItWorksStep2Title: 'Share your story',
    howItWorksStep2Desc: 'Describe the issue in any language, with an optional photo.',
    howItWorksStep3Title: 'MP sees the signal',
    howItWorksStep3Desc: 'AI summarizes submissions so your MP can prioritize action.',
    dashboardNavLink: 'MP Dashboard',
    topicCardCta: 'Submit request',
    feedNavLink: 'Grievances Feed',
    feedTitle: 'What citizens are saying',
    feedSubtitle: 'Vote on submissions to help surface what matters most.',
    feedFilterAll: 'All topics',
    feedSortNewest: 'Newest',
    feedSortTop: 'Most voted',
    feedEmpty: 'No grievances posted yet.',
    backToTopics: '← Back to topics',
    formTitle: 'Tell us what you need',
    formWard: 'Ward',
    formWardPlaceholder: 'Select your ward',
    formText: 'Describe your request or grievance',
    formTextPlaceholder: 'Type in any language…',
    formPhoto: 'Attach a photo (optional)',
    formSubmit: 'Submit',
    formSubmitting: 'Gemma is reading your submission…',
    rejectedTitle: 'Submission rejected',
    rejectedHint: 'Please rephrase without abusive or threatening language and try again.',
    confirmTitle: 'Here is what we understood',
    confirmLanguage: 'Detected language',
    confirmSummary: 'Summary',
    confirmUrgency: 'Urgency',
    confirmPhotoCaption: 'What the photo shows',
    confirmSubmitAnother: 'Submit another',
    dashboardTitle: 'Ranked recommendations',
    dashboardSubtitle: 'Generated by Gemma from citizen submissions, ward data, and the local development plan',
    dashboardUrgency: 'By urgency',
    dashboardTopics: 'By topic',
    dashboardHotspots: 'By ward (hotspots)',
    dashboardLoading: 'Gemma is analyzing demand across wards…',
    dashboardEmpty: 'No submissions yet. Recommendations will appear once citizens submit requests.',
    dashboardEvidence: 'Evidence',
    dashboardSource: 'Source',
    dashboardFeedSubtitle: 'Every individual submission, exactly as citizens see it, with vote counts.',
  },
  sw: {
    appName: 'Citizen Pulse',
    tagline: 'Sauti yako ya maendeleo, inasikika na Mbunge wako',
    chooseTopic: 'Chagua mada inayolingana zaidi na ombi lako',
    impactCaption: 'Kila ombi, iwe shule, zahanati au barabara, husaidia kujenga picha ambayo Mbunge wako anaifanyia kazi.',
    topicsSectionTitle: 'Ungependa kuripoti nini?',
    topicsSectionSubtitle: 'Chagua mada hapa chini — kila kadi inafungua fomu fupi ya kata yako.',
    howItWorksTitle: 'Jinsi inavyofanya kazi',
    howItWorksStep1Title: 'Chagua mada',
    howItWorksStep1Desc: 'Chagua eneo linalolingana na hitaji lako.',
    howItWorksStep2Title: 'Shiriki hadithi yako',
    howItWorksStep2Desc: 'Eleza tatizo kwa lugha yoyote, na picha ikiwa unayo.',
    howItWorksStep3Title: 'Mbunge anaona ishara',
    howItWorksStep3Desc: 'AI inafupisha maombi ili Mbunge apange kipaumbele.',
    dashboardNavLink: 'Dashibodi ya Mbunge',
    topicCardCta: 'Wasilisha ombi',
    feedNavLink: 'Malalamiko ya Wananchi',
    feedTitle: 'Wananchi wanasema nini',
    feedSubtitle: 'Piga kura kwenye maombi kusaidia kuonyesha yaliyo muhimu zaidi.',
    feedFilterAll: 'Mada zote',
    feedSortNewest: 'Mapya zaidi',
    feedSortTop: 'Kura nyingi zaidi',
    feedEmpty: 'Hakuna malalamiko yaliyowasilishwa bado.',
    backToTopics: '← Rudi kwa mada',
    formTitle: 'Tuambie unahitaji nini',
    formWard: 'Kata',
    formWardPlaceholder: 'Chagua kata yako',
    formText: 'Eleza ombi lako au malalamiko',
    formTextPlaceholder: 'Andika kwa lugha yoyote…',
    formPhoto: 'Ambatanisha picha (si lazima)',
    formSubmit: 'Wasilisha',
    formSubmitting: 'Gemma inasoma ombi lako…',
    rejectedTitle: 'Ombi limekataliwa',
    rejectedHint: 'Tafadhali andika upya bila lugha ya matusi au vitisho kisha ujaribu tena.',
    confirmTitle: 'Hivi ndivyo tulivyoelewa',
    confirmLanguage: 'Lugha iliyotambuliwa',
    confirmSummary: 'Muhtasari',
    confirmUrgency: 'Uharaka',
    confirmPhotoCaption: 'Picha inaonyesha nini',
    confirmSubmitAnother: 'Wasilisha jingine',
    dashboardTitle: 'Mapendekezo yaliyopangwa',
    dashboardSubtitle: 'Yametengenezwa na Gemma kutoka kwa maombi ya wananchi, data ya kata, na mpango wa maendeleo wa eneo',
    dashboardUrgency: 'Kwa uharaka',
    dashboardTopics: 'Kwa mada',
    dashboardHotspots: 'Kwa kata (maeneo yenye maombi mengi)',
    dashboardLoading: 'Gemma inachanganua mahitaji katika kata…',
    dashboardEmpty: 'Hakuna maombi bado. Mapendekezo yataonekana wananchi wakiwasilisha maombi.',
    dashboardEvidence: 'Ushahidi',
    dashboardSource: 'Chanzo',
    dashboardFeedSubtitle: 'Kila ombi mmoja mmoja, sawasawa na wananchi wanavyoliona, likiwa na idadi ya kura.',
  },
};
