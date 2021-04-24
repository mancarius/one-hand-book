import firebase from "firebase/app";
import "firebase/auth";

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASURAMENT_ID
};


class Firebase {
    constructor() {
        firebase.initializeApp(config);
        this.auth = firebase.auth();
    }

    GoogleAuth = () => {
        try {
            let provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/books');
            firebase.auth().useDeviceLanguage();
            this.auth.signInWithRedirect(provider);
        } catch (err) {
            throw err;
        }
    }

    getGoogleRedirectResult = async () => {
        return await this.auth.getRedirectResult();
    }


    signOut = async () => {
        return this.auth.signOut();
    }


    getCurrentUser = () => firebase.auth().currentUser;
}

export default new Firebase();