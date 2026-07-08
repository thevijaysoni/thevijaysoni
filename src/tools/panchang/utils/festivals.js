import { calculatePanchang } from './panchangEngine';

// List of supported festivals and their astronomical rules
// Rules specify:
// - month (0 to 11, Chaitra to Phalguna, Amanta)
// - paksha ('Shukla' or 'Krishna')
// - tithi (1 to 15)
// - OR a custom matching function (e.g. for Makar Sankranti, which depends on Sun's longitude)
export const FESTIVAL_RULES = [
  {
    id: 'ram_navami',
    nameKeys: {
      en: 'Rama Navami',
      hi: 'राम नवमी',
      gu: 'રામ નવમી',
      mr: 'राम नवमी',
      ta: 'இராம நவமி',
      te: 'శ్రీరామ నవమి',
      kn: 'ರಾಮ ನವಮಿ',
      ml: 'രാമനവമി',
      pa: 'ਰਾਮ ਨੌਮੀ'
    },
    month: 0, // Chaitra
    paksha: 'Shukla',
    tithi: 9
  },
  {
    id: 'hanuman_jayanti',
    nameKeys: {
      en: 'Hanuman Jayanti',
      hi: 'हनुमान जयंती',
      gu: 'હનુમાન જયંતી',
      mr: 'हनुमान जयंती',
      ta: 'அனுமன் ஜெயந்தி',
      te: 'హనుమాన్ జయంతి',
      kn: 'ಹನುಮಾನ್ ಜಯಂತಿ',
      ml: 'ഹനുമാൻ ജയന്തി',
      pa: 'ਹਨੂਮਾਨ ਜਯੰਤੀ'
    },
    month: 0, // Chaitra
    paksha: 'Shukla',
    tithi: 15 // Purnima
  },
  {
    id: 'raksha_bandhan',
    nameKeys: {
      en: 'Raksha Bandhan',
      hi: 'रक्षा बंधन',
      gu: 'રક્ષાબંધન',
      mr: 'रक्षाबंधन',
      ta: 'ரக்ஷா பந்தன்',
      te: 'రాఖీ పౌర్ణమి',
      kn: 'ರಕ್ಷಾಬಂಧನ',
      ml: 'രക്ഷാബന്ധൻ',
      pa: 'ਰੱਖੜੀ'
    },
    month: 4, // Shravana
    paksha: 'Shukla',
    tithi: 15 // Purnima
  },
  {
    id: 'janmashtami',
    nameKeys: {
      en: 'Krishna Janmashtami',
      hi: 'कृष्ण जन्माष्टमी',
      gu: 'કૃષ્ણ જન્માષ્ટમી',
      mr: 'गोकुळाष्टमी',
      ta: 'கிருஷ்ண ஜெயந்தி',
      te: 'శ్రీకృష్ణాష్టమి',
      kn: 'ಕೃಷ್ಣ ಜನ್ಮಾಷ್ಟಮಿ',
      ml: 'ശ്രീകൃഷ്ണ ജയന്തി',
      pa: 'ਜਨਮਾਸ਼ਟਮੀ'
    },
    month: 5, // Bhadrapada
    paksha: 'Krishna',
    tithi: 8
  },
  {
    id: 'ganesh_chaturthi',
    nameKeys: {
      en: 'Ganesh Chaturthi',
      hi: 'गणेश चतुर्थी',
      gu: 'ગણેશ ચતુર્થી',
      mr: 'गणेश चतुर्थी',
      ta: 'விநாயகர் சதுர்த்தி',
      te: 'వినాయక చవితి',
      kn: 'ಗಣೇಶ ಚತುರ್ಥಿ',
      ml: 'ഗണേശ ചതുർത്ഥി',
      pa: 'ਗਣੇਸ਼ ਚਤੁਰਥੀ'
    },
    month: 5, // Bhadrapada
    paksha: 'Shukla',
    tithi: 4
  },
  {
    id: 'dussehra',
    nameKeys: {
      en: 'Dussehra / Vijayadashami',
      hi: 'दशहरा / विजयादशमी',
      gu: 'દશેરા / વિજયાદશમી',
      mr: 'दसरा / विजयादशमी',
      ta: 'விஜயதசமி',
      te: 'విజయదశమి',
      kn: 'ವಿಜಯದಶಮಿ',
      ml: 'വിജയദശമി',
      pa: 'ਦੁਸਹਿਰਾ'
    },
    month: 6, // Ashvina
    paksha: 'Shukla',
    tithi: 10
  },
  {
    id: 'karwa_chauth',
    nameKeys: {
      en: 'Karwa Chauth',
      hi: 'करवा चौथ',
      gu: 'કરવા ચોથ',
      mr: 'करवा चौथ',
      ta: 'கர்வா சௌத்',
      te: 'కర్వా చౌత్',
      kn: 'ಕರ್ವಾ ಚೌತ್',
      ml: 'കർവാ ചൗത്',
      pa: 'ਕਰਵਾ ਚੌਥ'
    },
    month: 7, // Kartika
    paksha: 'Krishna',
    tithi: 4
  },
  {
    id: 'diwali',
    nameKeys: {
      en: 'Diwali / Deepavali',
      hi: 'दीपावली / दिवाली',
      gu: 'દિવાળી',
      mr: 'दिवाळी',
      ta: 'தீபாவளி',
      te: 'దీపావళి',
      kn: 'ದೀಪಾವಳಿ',
      ml: 'ദീപാവലി',
      pa: 'ਦੀਵਾਲੀ'
    },
    month: 7, // Kartika
    paksha: 'Krishna',
    tithi: 15 // Amavasya
  },
  {
    id: 'maha_shivratri',
    nameKeys: {
      en: 'Maha Shivratri',
      hi: 'महाशिवरात्रि',
      gu: 'મહા શિવરાત્રી',
      mr: 'महाशिवरात्री',
      ta: 'மகா சிவராத்திரி',
      te: 'महाశివరాత్రి',
      kn: 'ಮಹಾ ಶಿವರಾತ್ರಿ',
      ml: 'മഹാ ശിവരാത്രി',
      pa: 'ਮਹਾ ਸ਼ਿਵਰਾਤਰੀ'
    },
    month: 11, // Phalguna
    paksha: 'Krishna',
    tithi: 14 // Chaturdashi
  },
  {
    id: 'holi',
    nameKeys: {
      en: 'Holi',
      hi: 'होली',
      gu: 'હોળી',
      mr: 'होळी',
      ta: 'ஹோலி',
      te: 'హోలీ',
      kn: 'ಹೋಳಿ',
      ml: 'ഹോളി',
      pa: 'ਹੋਲੀ'
    },
    month: 11, // Phalguna
    paksha: 'Shukla',
    tithi: 15 // Purnima
  },
  {
    id: 'makar_sankranti',
    nameKeys: {
      en: 'Makar Sankranti',
      hi: 'मकर संक्रांति',
      gu: 'મકરસંક્રાંતિ',
      mr: 'मकर संक्रांत',
      ta: 'பொங்கல் / மகர சங்கராந்தி',
      te: 'మకర సంక్రాంతి',
      kn: 'ಮಕರ ಸಂಕ್ರಾಂತಿ',
      ml: 'മകര സംക്രാന്തി / പൊങ്കൽ',
      pa: 'ਲੋਹੜੀ / ਮਕਰ ਸੰਕ੍ਰਾਂਤੀ'
    },
    customMatch: (panchang, prevPanchang) => {
      // Occurs when Sun's sidereal longitude crosses 270° (enters Makara Rasi).
      // We look for when the Sun's longitude crosses 270° from below to above.
      if (!prevPanchang) return false;
      const prevLon = prevPanchang.sunLon;
      const currLon = panchang.sunLon;
      // Normal crossover check: previous was between 240 and 270, current is 270 or above
      return prevLon < 270 && currLon >= 270 && currLon < 280;
    }
  }
];

// Calculate festivals for a given date
// Returns an array of matching festivals
export function getFestivalsForDay(panchang, prevPanchang) {
  const list = [];

  // Check static rules
  for (const rule of FESTIVAL_RULES) {
    if (rule.customMatch) {
      if (rule.customMatch(panchang, prevPanchang)) {
        list.push({
          id: rule.id,
          nameKeys: rule.nameKeys
        });
      }
    } else {
      if (
        panchang.lunarMonth.amantaIndex === rule.month &&
        panchang.tithi.paksha === rule.paksha &&
        panchang.tithi.displayVal === rule.tithi
      ) {
        list.push({
          id: rule.id,
          nameKeys: rule.nameKeys
        });
      }
    }
  }

  // Add general recurring calendar days (Ekadashi, Purnima, Amavasya)
  if (panchang.tithi.displayVal === 11) {
    const isShukla = panchang.tithi.paksha === 'Shukla';
    const ekadashiNameKeys = {
      en: `${isShukla ? 'Shukla' : 'Krishna'} Ekadashi`,
      hi: `${isShukla ? 'शुक्ल' : 'कृष्ण'} एकादशी`,
      gu: `${isShukla ? 'શુક્લ' : 'કૃષ્ણ'} એકાદશી`,
      mr: `${isShukla ? 'शुक्ल' : 'कृष्ण'} एकादशी`,
      ta: `${isShukla ? 'வளர்பிறை' : 'தேய்பிறை'} ஏகாதசி`,
      te: `${isShukla ? 'శుక్ల' : 'కృష్ణ'} ఏకాదశి`,
      kn: `${isShukla ? 'ಶುಕ್ಲ' : 'ಕೃಷ್ಣ'} ಏಕಾದಶಿ`,
      ml: `${isShukla ? 'ശുക്ല' : 'കൃഷ്ണ'} ഏകാദശി`,
      pa: `${isShukla ? 'ਸ਼ੁਕਲ' : 'ਕ੍ਰਿਸ਼ਨ'} ਇਕਾਦਸ਼ੀ`
    };
    list.push({
      id: 'ekadashi',
      nameKeys: ekadashiNameKeys,
      isMinor: true
    });
  }

  if (panchang.tithi.number === 15) {
    list.push({
      id: 'purnima',
      nameKeys: {
        en: 'Purnima (Full Moon)',
        hi: 'पूर्णिमा',
        gu: 'પૂનમ',
        mr: 'पौर्णिमा',
        ta: 'பௌர்ணமி',
        te: 'పౌర్ణమి',
        kn: 'ಹುಣ್ಣಿಮೆ',
        ml: 'പൗർണ്ണമി',
        pa: 'ਪੂਰਨਮਾਸ਼ੀ'
      },
      isMinor: true
    });
  }

  if (panchang.tithi.number === 30) {
    list.push({
      id: 'amavasya',
      nameKeys: {
        en: 'Amavasya (New Moon)',
        hi: 'अमावस्या',
        gu: 'અમાસ',
        mr: 'अमावास्या',
        ta: 'அமாவாசை',
        te: 'అమావాస్య',
        kn: 'ಅಮಾವಾಸ್ಯೆ',
        ml: 'അമാവാസി',
        pa: 'ਮੱਸਿਆ'
      },
      isMinor: true
    });
  }

  return list;
}

// Generate all festivals for a given Gregorian year
export function getFestivalsForYear(year, latitude, longitude, timezoneOffsetHours) {
  const festivals = [];
  const startYear = new Date(Date.UTC(year, 0, 1, 12, 0, 0)); // Start mid-day to be safe
  let prevPanchang = null;

  // We loop 366 days to cover the whole year
  for (let d = 0; d < 366; d++) {
    const targetDate = new Date(startYear.getTime() + d * 24 * 3600 * 1000);
    if (targetDate.getFullYear() !== year) break;

    const panchang = calculatePanchang(targetDate, latitude, longitude, timezoneOffsetHours);
    const dayFestivals = getFestivalsForDay(panchang, prevPanchang);

    for (const fest of dayFestivals) {
      festivals.push({
        ...fest,
        date: new Date(targetDate)
      });
    }

    prevPanchang = panchang;
  }

  return festivals;
}
