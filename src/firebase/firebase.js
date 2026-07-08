import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent as firebaseLogEvent } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyACPQ9jXS_xSe35oIA9fnA8r-YKXNuKXC0",
  authDomain: "thevijaysoniweb.firebaseapp.com",
  databaseURL: "https://thevijaysoniweb.firebaseio.com",
  projectId: "thevijaysoniweb",
  storageBucket: "thevijaysoniweb.appspot.com",
  messagingSenderId: "997109063925",
  appId: "1:997109063925:web:99aa750e679e231862e5bc",
  measurementId: "G-15QMDCMN93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

/**
 * Log custom events to Firebase Analytics
 * @param {string} eventName
 * @param {Object} eventParams
 */
export const logEvent = (eventName, eventParams = {}) => {
  if (analytics) {
    firebaseLogEvent(analytics, eventName, eventParams);
  }
};

export default app;