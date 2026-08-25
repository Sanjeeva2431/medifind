// MediFind Global App & Backend Configuration
// For Production APK / Cloud Hosting, update API_BASE_URL to your deployed domain.
// Example: 'https://medifind-backend.onrender.com/api' or 'https://api.medifind.com/api'

window.MEDIFIND_CONFIG = {
    // 🌐 PRODUCTION BACKEND URL CONFIGURATION
    // Change the string below to your live server URL when hosting in production:
    API_BASE_URL: (typeof window !== 'undefined' && window.location && window.location.origin.includes('5000'))
        ? 'http://localhost:5000/api'
        : 'http://localhost:5000/api', // Replace 'http://localhost:5000/api' with your HTTPS production domain for Android APK

    APP_NAME: 'MediFind',
    VERSION: '1.0.0',
    DEFAULT_CITY: 'Noida',
    SUPPORT_EMAIL: 'support@medifind.com'
};
