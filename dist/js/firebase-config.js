// MediFind Firebase Client Engine Configuration (Auth, FCM Push Notifications & Cloud Storage)

export const firebaseConfig = {
    apiKey: "AIzaSy_placeholder_firebase_api_key",
    authDomain: "medifind-app.firebaseapp.com",
    projectId: "medifind-app",
    storageBucket: "medifind-app.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
};

export class FirebaseService {
    constructor() {
        this.initialized = false;
        this.init();
    }

    init() {
        console.log('[Firebase Engine] Initialized Firebase configuration module.');
        this.initialized = true;
    }

    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            console.log('[Firebase Messaging] Desktop notifications not supported.');
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('[Firebase Messaging] Notification permission granted.');
                return true;
            }
        } catch (err) {
            console.warn('[Firebase Messaging] Permission request error:', err);
        }
        return false;
    }
}

export const firebaseService = new FirebaseService();
