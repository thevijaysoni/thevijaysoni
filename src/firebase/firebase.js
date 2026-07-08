import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyACPQ9jXS_xSe35oIA9fnA8r-YKXNuKXC0",
    authDomain: "thevijaysoniweb.firebaseapp.com",
    databaseURL: "https://thevijaysoniweb.firebaseio.com",
    projectId: "thevijaysoniweb",
    storageBucket: "thevijaysoniweb.appspot.com",
    messagingSenderId: "997109063925",
    appId: "1:997109063925:web:99aa750e679e231862e5bc",
    measurementId: "G-15QMDCMN93"
};

const firebaseApp = firebase.initializeApp(config);

export default firebaseApp;