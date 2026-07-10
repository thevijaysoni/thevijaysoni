import PanchangAppWrapper from '../tools/panchang/PanchangAppWrapper';

export const toolsData = [
  {
    id: 'kalachakra',
    name: 'Kalachakra',
    path: '/labs/kalachakra',
    category: 'Hindu Luni-Solar Calendar Engine',
    description: 'A highly accurate, client-side Hindu Panchang calendar using astronomy algorithms. Calculates dynamic Tithis, Nakshatras, Yogas, and Muhurtas locally. Offline-first, location-aware, and translated in 9 Indian languages.',
    active: true,
    component: PanchangAppWrapper,
    icon: 'Compass',
    seo: {
      title: "Kalachakra - High Precision Hindu Panchang Calendar Engine",
      description: "Offline-first client-side Hindu calendar calculating dynamic Tithis, Nakshatras, Yogas, and Muhurtas locally using astronomy math.",
      keywords: "Kalachakra, SmartPanchang, Panchang calendar, Hindu astronomical calculations, Tithi calculator, Nakshatra engine, Indian calendar",
      favicon: "/favicon-kalachakra.svg",
      ogImage: "https://thevijaysoni.com/vijay_soni.jpeg"
    }
  },
];
