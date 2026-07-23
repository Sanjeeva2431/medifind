import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

export const appiumConfig = {
    host: process.env.APPIUM_HOST || '127.0.0.1',
    port: parseInt(process.env.APPIUM_PORT || '4723', 10),
    baseUrl: process.env.BASE_URL || 'https://Sanjeeva2431.github.io/medifind/',
    timeout: 30000,
    retryAttempts: 2,
    capabilities: {
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'Android Emulator',
        'appium:platformVersion': process.env.ANDROID_VERSION || '13.0',
        'appium:app': process.env.APK_PATH || path.join(rootDir, 'automation/resources/app-debug.apk'),
        'appium:appPackage': 'com.medifind.app',
        'appium:appActivity': 'com.medifind.app.MainActivity',
        'appium:noReset': false,
        'appium:fullReset': false,
        'appium:newCommandTimeout': 120,
        'appium:autoGrantPermissions': true,
        'appium:isHeadless': process.env.HEADLESS === 'true'
    },
    paths: {
        reportsDir: path.join(rootDir, 'Test Results'),
        excelDir: path.join(rootDir, 'Test Results/Excel'),
        htmlDir: path.join(rootDir, 'Test Results/HTML'),
        jsonDir: path.join(rootDir, 'Test Results/JSON'),
        summaryDir: path.join(rootDir, 'Test Results/Summary'),
        screenshotsDir: path.join(rootDir, 'Test Results/Screenshots'),
        logsDir: path.join(rootDir, 'Test Results/Logs')
    }
};
