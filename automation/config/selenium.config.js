import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// STRICT CONFIGURATION: BASE_URL defaults to LIVE GitHub Pages deployment URL
export const config = {
    baseUrl: process.env.BASE_URL || 'https://Sanjeeva2431.github.io/medifind/',
    browser: process.env.BROWSER || 'chrome',
    headless: process.env.HEADLESS !== 'false', // Default to Headless in CI/CD
    implicitWaitMs: 10000,
    pageLoadWaitMs: 30000,
    screenshotDir: path.join(rootDir, '..', 'Test Results', 'Screenshots'),
    logsDir: path.join(rootDir, '..', 'Test Results', 'Logs'),
    reportsDir: path.join(rootDir, '..', 'Test Results')
};

// Validate that localhost is forbidden unless explicitly overridden for local debugging
if (config.baseUrl.includes('localhost') || config.baseUrl.includes('127.0.0.1')) {
    console.warn('⚠️ WARNING: BASE_URL is set to localhost. Mandatory policy requires testing against live GitHub Pages deployment URL.');
}
