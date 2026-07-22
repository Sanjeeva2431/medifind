/**
 * Selenium WebDriver Configuration for MediFind Web Application
 */
export const seleniumConfig = {
    baseUrl: process.env.BASE_URL || 'http://localhost:5000',
    browserName: process.env.BROWSER || 'chrome',
    headless: process.env.HEADLESS === 'true',
    implicitTimeoutMs: 10000,
    pageLoadTimeoutMs: 30000,
    scriptTimeoutMs: 30000,
    
    // Default Chrome Options
    chromeOptions: [
        '--start-maximized',
        '--disable-notifications',
        '--disable-popup-blocking',
        '--ignore-certificate-errors',
        '--no-sandbox',
        '--disable-dev-shm-usage'
    ]
};
