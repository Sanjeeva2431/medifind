/**
 * Appium Driver & Android Capabilities Configuration for MediFind Mobile
 */
export const appiumConfig = {
    host: process.env.APPIUM_HOST || '127.0.0.1',
    port: parseInt(process.env.APPIUM_PORT || '4723', 10),
    path: '/wd/hub',
    
    // Android Device & Application Capabilities
    capabilities: {
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'Android Emulator',
        'appium:platformVersion': process.env.ANDROID_VERSION || '13.0',
        'appium:app': process.env.APK_PATH || './builds/medifind-mobile.apk',
        'appium:appPackage': 'com.medifind.app',
        'appium:appActivity': 'com.medifind.app.MainActivity',
        'appium:noReset': false,
        'appium:fullReset': false,
        'appium:newCommandTimeout': 300,
        'appium:autoGrantPermissions': true
    },

    // Target API Server Endpoint
    targetApiUrl: process.env.API_URL || 'http://localhost:5000'
};
