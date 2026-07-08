import * as Astronomy from 'astronomy-engine';

// Visha Ghati start times (in ghatis) for the 27 Nakshatras (0-indexed)
const VISHA_GHATI_OFFSETS = [
  50, // Ashwini (1)
  24, // Bharani (2)
  30, // Krittika (3)
  40, // Rohini (4)
  14, // Mrigashirsha (5)
  21, // Ardra (6)
  30, // Punarvasu (7)
  20, // Pushya (8)
  32, // Ashlesha (9)
  30, // Magha (10)
  20, // Purva Phalguni (11)
  18, // Uttara Phalguni (12)
  22, // Hasta (13)
  20, // Chitra (14)
  14, // Swati (15)
  14, // Vishakha (16)
  10, // Anuradha (17)
  14, // Jyeshtha (18)
  20, // Moola (19)
  24, // Purvashadha (20)
  20, // Uttarashadha (21)
  10, // Shravana (22)
  10, // Dhanishta (23)
  18, // Shatabhisha (24)
  16, // Purva Bhadrapada (25)
  24, // Uttara Bhadrapada (26)
  30  // Revati (27)
];

// Calculate Lahiri Ayanamsha for a given Date
export function getAyanamsa(date) {
  const timeMs = date.getTime();
  const jd = (timeMs / 86400000) + 2440587.5;
  const T = (jd - 2451545.0) / 36525;
  // Precise Lahiri Ayanamsha polynomial
  return 23.85709 + 1.396974 * T + 0.000309 * T * T;
}

// Helper to normalize degree between 0 and 360
function normalize360(deg) {
  let val = deg % 360;
  if (val < 0) val += 360;
  return val;
}

// Main function to calculate all Panchang details for a date, location, and timezone
export function calculatePanchang(date, latitude, longitude, timezoneOffsetHours) {
  const observer = new Astronomy.Observer(latitude, longitude, 0);
  const astroTime = Astronomy.MakeTime(date);

  // 1. Calculate Sidereal Sun and Moon Longitudes
  const ayanamsa = getAyanamsa(date);
  const sunLonTropical = Astronomy.SunPosition(astroTime).elon;
  const moonLonTropical = Astronomy.EclipticGeoMoon(astroTime).lon;

  const sunLon = normalize360(sunLonTropical - ayanamsa);
  const moonLon = normalize360(moonLonTropical - ayanamsa);

  // 2. Tithi calculation
  // Angular separation = Moon Longitude - Sun Longitude
  const tithiDiff = normalize360(moonLon - sunLon);
  const tithiIndex = Math.floor(tithiDiff / 12); // 0 to 29
  const tithiNumber = tithiIndex + 1; // 1 to 30
  const paksha = tithiNumber <= 15 ? 'Shukla' : 'Krishna';
  const displayTithiVal = tithiNumber <= 15 ? tithiNumber : tithiNumber - 15; // 1 to 15

  // 3. Nakshatra calculation
  // Each Nakshatra spans 13°20' (13.333333 degrees)
  const nakIndex = Math.floor(moonLon / 13.333333333); // 0 to 26
  const nakNumber = nakIndex + 1; // 1 to 27

  // 4. Yoga calculation
  // (Sun Longitude + Moon Longitude) % 360
  const yogaDiff = normalize360(sunLon + moonLon);
  const yogaIndex = Math.floor(yogaDiff / 13.333333333); // 0 to 26
  const yogaNumber = yogaIndex + 1; // 1 to 27

  // 5. Karana calculation
  // Half of a Tithi (6 degrees)
  const karanaIndex = Math.floor(tithiDiff / 6); // 0 to 59
  let karanaNumber = 1; // Default
  if (karanaIndex === 0) {
    karanaNumber = 1; // Kinstughna
  } else if (karanaIndex === 57) {
    karanaNumber = 9; // Shakuni
  } else if (karanaIndex === 58) {
    karanaNumber = 10; // Chatuspada
  } else if (karanaIndex === 59) {
    karanaNumber = 11; // Naga
  } else {
    // Repeating cycle of 7 moveable karanas
    karanaNumber = 2 + ((karanaIndex - 1) % 7); // 2 to 8 (Bava to Vishti)
  }

  // 6. Lunar Month (Amanta)
  // Determined by Sun's Zodiac sign (Rasi) at the previous New Moon (Amavasya ending)
  // Let's find the previous New Moon
  const prevNewMoonTime = findPreviousNewMoon(date);
  const sunLonAtNewMoon = normalize360(Astronomy.SunPosition(Astronomy.MakeTime(prevNewMoonTime)).elon - getAyanamsa(prevNewMoonTime));
  const sunRasiAtNewMoon = Math.floor(sunLonAtNewMoon / 30); // 0 = Mesha, 11 = Meena
  // Sun Rasi maps to Lunar Month:
  // Mesha (0) -> Vaishakha (1)
  // Vrishabha (1) -> Jyeshtha (2)
  // Mithuna (2) -> Ashadha (3)
  // Karka (3) -> Shravana (4)
  // Simha (4) -> Bhadrapada (5)
  // Kanya (5) -> Ashvina (6)
  // Tula (6) -> Kartika (7)
  // Vrishchika (7) -> Margashirsha (8)
  // Dhanu (8) -> Pausha (9)
  // Makara (9) -> Magha (10)
  // Kumbha (10) -> Phalguna (11)
  // Meena (11) -> Chaitra (0)
  const amantaMonthIndex = (sunRasiAtNewMoon + 1) % 12;

  // Purnimanta month system:
  // Starts after Purnima (Full Moon). Krishna Paksha is in next month.
  const purnimantaMonthIndex = (paksha === 'Krishna') ? (amantaMonthIndex + 1) % 12 : amantaMonthIndex;

  // 7. Samvat calculation
  // Vikram Samvat is approximately Gregorian Year + 57 (or +56 if before Chaitra Pratipada)
  // Shaka Samvat is approximately Gregorian Year - 78 (or -79 if before Chaitra Pratipada)
  // Chaitra Pratipada is the start of Chaitra Shukla Pratipada.
  // For simplicity, we can determine the exact start of Chaitra Pratipada in the current Gregorian year.
  const gregYear = date.getUTCFullYear();
  let vikramSamvat = gregYear + 57;
  let shakaSamvat = gregYear - 78;

  // If month is Chaitra and paksha is Shukla, or if month is before Chaitra (i.e. Pausha, Magha, Phalguna),
  // we check if we're before or after the Chaitra Shukla Pratipada.
  // Pause: A quick check. Chaitra is index 0. Months 9 (Pausha), 10 (Magha), 11 (Phalguna) are definitely before Chaitra Shukla Pratipada.
  // For month index 9, 10, 11, the Samvat is Year - 1 + 57 = Year + 56, and Shaka is Year - 79.
  if (amantaMonthIndex >= 9 && amantaMonthIndex <= 11) {
    vikramSamvat -= 1;
    shakaSamvat -= 1;
  } else if (amantaMonthIndex === 0 && paksha === 'Krishna') {
    // Chaitra Krishna Paksha is also before Chaitra Shukla Pratipada (which starts Chaitra Shukla 1)
    vikramSamvat -= 1;
    shakaSamvat -= 1;
  }

  // 8. Sunrise and Sunset
  // Local midnight of target date
  const startOfDay = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - timezoneOffsetHours * 3600000);
  const sunriseTimeObj = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, Astronomy.MakeTime(startOfDay), 1);
  const sunsetTimeObj = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, Astronomy.MakeTime(startOfDay), 1);

  const sunrise = sunriseTimeObj ? sunriseTimeObj.date : null;
  const sunset = sunsetTimeObj ? sunsetTimeObj.date : null;

  // 9. Moonrise and Moonset
  const moonriseTimeObj = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, +1, Astronomy.MakeTime(startOfDay), 1.2);
  const moonsetTimeObj = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, -1, Astronomy.MakeTime(startOfDay), 1.2);

  const moonrise = moonriseTimeObj ? moonriseTimeObj.date : null;
  const moonset = moonsetTimeObj ? moonsetTimeObj.date : null;

  // 10. Transitions (Start and End times)
  const tithiStart = findTransition(t => {
    const s = normalize360(Astronomy.EclipticGeoMoon(t).lon - Astronomy.SunPosition(t).elon);
    return Math.floor(s / 12);
  }, date, false);
  const tithiEnd = findTransition(t => {
    const s = normalize360(Astronomy.EclipticGeoMoon(t).lon - Astronomy.SunPosition(t).elon);
    return Math.floor(s / 12);
  }, date, true);

  const nakStart = findTransition(t => {
    const s = normalize360(Astronomy.EclipticGeoMoon(t).lon - getAyanamsa(t.date));
    return Math.floor(s / 13.333333333);
  }, date, false);
  const nakEnd = findTransition(t => {
    const s = normalize360(Astronomy.EclipticGeoMoon(t).lon - getAyanamsa(t.date));
    return Math.floor(s / 13.333333333);
  }, date, true);

  const yogaStart = findTransition(t => {
    const sun = normalize360(Astronomy.SunPosition(t).elon - getAyanamsa(t.date));
    const moon = normalize360(Astronomy.EclipticGeoMoon(t).lon - getAyanamsa(t.date));
    return Math.floor(normalize360(sun + moon) / 13.333333333);
  }, date, false);
  const yogaEnd = findTransition(t => {
    const sun = normalize360(Astronomy.SunPosition(t).elon - getAyanamsa(t.date));
    const moon = normalize360(Astronomy.EclipticGeoMoon(t).lon - getAyanamsa(t.date));
    return Math.floor(normalize360(sun + moon) / 13.333333333);
  }, date, true);

  const karanaStart = findTransition(t => {
    const s = normalize360(Astronomy.EclipticGeoMoon(t).lon - Astronomy.SunPosition(t).elon);
    return Math.floor(s / 6);
  }, date, false);
  const karanaEnd = findTransition(t => {
    const s = normalize360(Astronomy.EclipticGeoMoon(t).lon - Astronomy.SunPosition(t).elon);
    return Math.floor(s / 6);
  }, date, true);

  // 11. Muhurta and Kaal calculations
  // Only calculated if sunrise and sunset are available
  let brahmaStart = null, brahmaEnd = null;
  let rahuStart = null, rahuEnd = null;
  let gulikaStart = null, gulikaEnd = null;
  let yamaStart = null, yamaEnd = null;
  let abhijitStart = null, abhijitEnd = null;
  let durMuhurtas = [];
  let amritStart = null, amritEnd = null;

  if (sunrise && sunset) {
    const sunriseMs = sunrise.getTime();
    const sunsetMs = sunset.getTime();
    const daytimeDuration = sunsetMs - sunriseMs;
    const octantDuration = daytimeDuration / 8;
    const slotDuration15 = daytimeDuration / 15;

    // Weekday: 0 = Sun, 1 = Mon, ..., 6 = Sat
    const weekday = date.getDay();

    // Brahma Muhurta: 96 mins before sunrise to 48 mins before sunrise
    brahmaStart = new Date(sunriseMs - 96 * 60 * 1000);
    brahmaEnd = new Date(sunriseMs - 48 * 60 * 1000);

    // Rahu Kaal, Gulika, Yamaganda octants (0-indexed)
    const rahuOctants = [7, 1, 6, 4, 5, 3, 2];
    const yamagandaOctants = [4, 3, 2, 1, 0, 6, 5];
    const gulikaOctants = [6, 5, 4, 3, 2, 1, 0];

    const ro = rahuOctants[weekday];
    rahuStart = new Date(sunriseMs + ro * octantDuration);
    rahuEnd = new Date(sunriseMs + (ro + 1) * octantDuration);

    const yo = yamagandaOctants[weekday];
    yamaStart = new Date(sunriseMs + yo * octantDuration);
    yamaEnd = new Date(sunriseMs + (yo + 1) * octantDuration);

    const go = gulikaOctants[weekday];
    gulikaStart = new Date(sunriseMs + go * octantDuration);
    gulikaEnd = new Date(sunriseMs + (go + 1) * octantDuration);

    // Abhijit Muhurta: 8th slot out of 15 slots (index 7)
    abhijitStart = new Date(sunriseMs + 7 * slotDuration15);
    abhijitEnd = new Date(sunriseMs + 8 * slotDuration15);

    // Dur Muhurtas
    const durSlotsMap = [
      [5],       // Sun (6th slot)
      [6, 14],   // Mon (7th & 15th slot)
      [6],       // Tue (7th slot)
      [6, 14],   // Wed (7th & 15th slot)
      [6],       // Thu (7th slot)
      [9],       // Fri (10th slot)
      [7, 8]     // Sat (8th & 9th slot)
    ];
    const durSlots = durSlotsMap[weekday];
    durMuhurtas = durSlots.map(slotIdx => ({
      start: new Date(sunriseMs + slotIdx * slotDuration15),
      end: new Date(sunriseMs + (slotIdx + 1) * slotDuration15)
    }));

    // Amrit Kaal & Visha Ghati based on Nakshatra
    // We get the current Nakshatra's start and end times
    if (nakStart && nakEnd) {
      const nakDuration = nakEnd.getTime() - nakStart.getTime();
      const ghatiMs = nakDuration / 60;
      const vishaOffsetGhatis = VISHA_GHATI_OFFSETS[nakIndex];

      // Amrit Kaal is 24 ghatis after Visha Ghati start, modulo 60
      const amritOffsetGhatis = (vishaOffsetGhatis + 24) % 60;

      amritStart = new Date(nakStart.getTime() + amritOffsetGhatis * ghatiMs);
      amritEnd = new Date(amritStart.getTime() + 4 * ghatiMs); // Lasts 4 ghatis
    }
  }

  // Calculate completion percentage of Tithi
  let tithiCompletion = 0;
  if (tithiStart && tithiEnd) {
    const total = tithiEnd.getTime() - tithiStart.getTime();
    const nowTime = new Date().getTime();
    if (nowTime > tithiEnd.getTime()) {
      tithiCompletion = 100;
    } else if (nowTime < tithiStart.getTime()) {
      tithiCompletion = 0;
    } else {
      const elapsed = nowTime - tithiStart.getTime();
      tithiCompletion = Math.min(100, Math.max(0, Math.floor((elapsed / total) * 100)));
    }
  }

  return {
    date,
    latitude,
    longitude,
    timezoneOffsetHours,
    sunLon,
    moonLon,
    ayanamsa,
    tithi: {
      number: tithiNumber,
      displayVal: displayTithiVal,
      paksha,
      start: tithiStart,
      end: tithiEnd,
      completion: tithiCompletion
    },
    nakshatra: {
      number: nakNumber,
      index: nakIndex,
      start: nakStart,
      end: nakEnd
    },
    yoga: {
      number: yogaNumber,
      start: yogaStart,
      end: yogaEnd
    },
    karana: {
      number: karanaNumber,
      start: karanaStart,
      end: karanaEnd
    },
    lunarMonth: {
      amantaIndex: amantaMonthIndex,
      purnimantaIndex: purnimantaMonthIndex
    },
    samvat: {
      vikram: vikramSamvat,
      shaka: shakaSamvat
    },
    timings: {
      sunrise,
      sunset,
      moonrise,
      moonset,
      brahmaStart,
      brahmaEnd,
      rahuStart,
      rahuEnd,
      gulikaStart,
      gulikaEnd,
      yamaStart,
      yamaEnd,
      abhijitStart,
      abhijitEnd,
      durMuhurtas,
      amritStart,
      amritEnd
    }
  };
}

// Find previous New Moon starting from a given date
// A New Moon occurs when (MoonLongitude - SunLongitude) % 360 is 0
function findPreviousNewMoon(date) {
  // Let's go back 32 days and search forward for a New Moon
  let t = Astronomy.MakeTime(new Date(date.getTime() - 32 * 24 * 3600 * 1000));
  let mq = Astronomy.SearchMoonQuarter(t);
  
  let prevNewMoon = null;
  // Keep searching quarters until we find the New Moon that is closest to but before date
  while (mq && mq.time.date.getTime() <= date.getTime()) {
    if (mq.quarter === 0) { // 0 = New Moon
      prevNewMoon = mq.time.date;
    }
    mq = Astronomy.NextMoonQuarter(mq);
  }
  
  if (!prevNewMoon) {
    // Backup fallback in case the search failed: estimate roughly based on current tithi angle
    const tithiAngle = normalize360(Astronomy.EclipticGeoMoon(Astronomy.MakeTime(date)).lon - Astronomy.SunPosition(Astronomy.MakeTime(date)).elon);
    const elapsedDays = tithiAngle / 12.190749; // Average speed of moon relative to sun in deg/day
    prevNewMoon = new Date(date.getTime() - elapsedDays * 24 * 3600 * 1000);
  }
  return prevNewMoon;
}

// Find the start/end transition of a value (e.g. Tithi index) using bisection
// isEnd = true to find next transition (end of current index), false to find previous transition (start of current index)
function findTransition(getIndexFn, date, isEnd) {
  const currentIdx = getIndexFn(Astronomy.MakeTime(date));
  const t = date.getTime();
  const stepMs = 2 * 3600 * 1000; // 2 hour steps

  let searchLimit = 15; // 30 hours
  let boundaryFound = false;
  let t1 = t, t2 = t;

  if (isEnd) {
    // Search forward
    for (let i = 1; i <= searchLimit; i++) {
      const targetTime = t + i * stepMs;
      const idx = getIndexFn(Astronomy.MakeTime(new Date(targetTime)));
      if (idx !== currentIdx) {
        t1 = t + (i - 1) * stepMs;
        t2 = targetTime;
        boundaryFound = true;
        break;
      }
    }
  } else {
    // Search backward
    for (let i = 1; i <= searchLimit; i++) {
      const targetTime = t - i * stepMs;
      const idx = getIndexFn(Astronomy.MakeTime(new Date(targetTime)));
      if (idx !== currentIdx) {
        t1 = targetTime;
        t2 = t - (i - 1) * stepMs;
        boundaryFound = true;
        break;
      }
    }
  }

  if (!boundaryFound) return null;

  // Bisection search inside [t1, t2]
  let low = t1;
  let high = t2;
  for (let i = 0; i < 16; i++) {
    const mid = (low + high) / 2;
    const idx = getIndexFn(Astronomy.MakeTime(new Date(mid)));
    if (idx === currentIdx) {
      if (isEnd) {
        low = mid;
      } else {
        high = mid;
      }
    } else {
      if (isEnd) {
        high = mid;
      } else {
        low = mid;
      }
    }
  }
  return new Date(high);
}
