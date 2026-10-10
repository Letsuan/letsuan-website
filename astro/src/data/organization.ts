const copyEn = {
  credential: {
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'Government License',
    name: "室內裝修業登記證 (Interior Decorators' Registration Certificate)",
    recognizedBy: {
      '@type': 'GovernmentOrganization',
      name: '內政部國土管理署 (National Land Management Agency, MOI)',
      alternateName: '內政部營建署',
    },
    identifier: '40E2007328',
  },
  knows: [
    'Exhibition Design',
    'Museum Engineering',
    'Interior Design',
    'Visual Design',
    'Heritage Site Non-Invasive Construction',
    'VR Immersive Space Integration',
    'Licensed Interior Decoration',
  ],
  offers: {
    '@type': 'OfferCatalog',
    name: 'Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Exhibition Design', serviceType: 'Exhibition Design', provider: { '@id': 'https://letsuan.com/#organization' } } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Interior Design', serviceType: 'Interior Design', provider: { '@id': 'https://letsuan.com/#organization' } } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Visual Design', serviceType: 'Visual Design', provider: { '@id': 'https://letsuan.com/#organization' } } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Design-Build Construction', serviceType: 'Construction', provider: { '@id': 'https://letsuan.com/#organization' } } },
    ],
  },
};

const copyZh = {
  credential: {
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'Government License',
    name: '室內裝修從業者登記字號',
    recognizedBy: {
      '@type': 'GovernmentOrganization',
      name: '內政部國土管理署',
      alternateName: '內政部營建署',
    },
    identifier: '40E2007328',
  },
  knows: [
    '展覽設計',
    '博物館工程',
    '室內設計',
    '視覺設計',
    '文化場館無損施工',
    '沉浸式空間整合',
    '合法室內裝修',
  ],
  offers: {
    '@type': 'OfferCatalog',
    name: '服務項目',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '展覽設計', serviceType: '展覽設計', provider: { '@id': 'https://letsuan.com/#organization' } } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '室內設計', serviceType: '室內設計', provider: { '@id': 'https://letsuan.com/#organization' } } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '視覺設計', serviceType: '視覺設計', provider: { '@id': 'https://letsuan.com/#organization' } } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '全案施工', serviceType: '施工', provider: { '@id': 'https://letsuan.com/#organization' } } },
    ],
  },
};

type Copy = typeof copyEn;

const organizationNode = (description: string, t: Copy = copyEn) => ({
  '@type': ['GeneralContractor', 'ProfessionalService'],
  '@id': 'https://letsuan.com/#organization',
  name: 'Letsuan Design',
  alternateName: ['麗荃室內裝修有限公司', '麗荃設計', 'Le Tsuan Design', 'Letsuan Design Ltd.'],
  url: 'https://letsuan.com/',
  logo: 'https://letsuan.com/assets/logo.png',
  image: 'https://letsuan.com/assets/logo.png',
  description,
  foundingDate: '2014',
  telephone: '+886-4-2321-5956',
  email: 'info@letsuan.com',
  priceRange: '$$$$',
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: '6F.-1, No. 85, Sec. 1, Huamei W. St.',
      addressLocality: 'West District, Taichung City',
      addressRegion: 'Taichung',
      postalCode: '403020',
      addressCountry: 'TW',
    },
    {
      '@type': 'PostalAddress',
      streetAddress: '3F., No. 62, Sec. 6, Yanping N. Rd.',
      addressLocality: 'Shilin District, Taipei City',
      addressRegion: 'Taipei',
      postalCode: '111069',
      addressCountry: 'TW',
    },
  ],
  geo: { '@type': 'GeoCoordinates', latitude: 24.1555, longitude: 120.662 },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+886-4-2321-5956',
    email: 'info@letsuan.com',
    contactType: 'Customer Service & Project Inquiries',
    availableLanguage: ['English', 'Traditional Chinese'],
    areaServed: ['TW', 'International'],
  },
  areaServed: ['TW', 'International'],
  hasCredential: t.credential,
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
  knowsAbout: t.knows,
  sameAs: [
    'https://www.facebook.com/LETSUANDESIGN',
    'https://www.pinterest.com/Letsuan_Design/',
    'https://www.linkedin.com/company/letsuan-design/',
  ],
  hasOfferCatalog: t.offers,
});

const websiteNode = (inLanguage: string) => ({
  '@type': 'WebSite',
  '@id': 'https://letsuan.com/#website',
  url: 'https://letsuan.com/',
  name: 'Letsuan Design',
  inLanguage,
  publisher: { '@id': 'https://letsuan.com/#organization' },
});

// English pages (site root). Each locale gets a single-language description.
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    organizationNode(
      'Letsuan Design is a Taiwan-based design and construction studio specializing in museum exhibition design, cultural venue curation, commercial interiors and full design-build construction, with studios in Taichung and Taipei.',
    ),
    websiteNode('en'),
  ],
};

// zh-TW pages (/zh-TW/...). Same @id as the English graph so entities stay linked.
export const organizationJsonLdZh = {
  '@context': 'https://schema.org',
  '@graph': [
    organizationNode(
      '麗荃室內裝修（Letsuan Design）是一間位於臺灣臺中與臺北的專業設計與工程工作室，專精於博物館展示設計、文化場館策展、商業室內設計與全案工程施作。',
      copyZh
    ),
    websiteNode('zh-TW'),
  ],
};
