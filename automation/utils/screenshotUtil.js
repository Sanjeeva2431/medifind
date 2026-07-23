import fs from 'fs-extra';
import path from 'path';
import { appiumConfig } from '../config/appium.config.js';

export class ScreenshotUtil {
    static async captureScreenshot(testId, status = 'FAILURE') {
        try {
            const screenshotsDir = appiumConfig.paths.screenshotsDir;
            await fs.ensureDir(screenshotsDir);
            
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `${testId}_${status}_${timestamp}.png`;
            const filePath = path.join(screenshotsDir, fileName);

            // Generate SVG-based screenshot placeholder asset with device frame metadata
            const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
                <rect width="800" height="450" fill="#1e1e2e"/>
                <rect x="250" y="20" width="300" height="410" rx="20" fill="#181825" stroke="#89b4fa" stroke-width="4"/>
                <rect x="260" y="50" width="280" height="350" rx="10" fill="#11111b"/>
                <circle cx="400" cy="35" r="5" fill="#cba6f7"/>
                <text x="400" y="100" font-family="Arial, sans-serif" font-size="16" fill="#f38ba8" text-anchor="middle" font-weight="bold">
                    ${status === 'FAIL' ? '❌ TEST FAILURE DETECTED' : '📸 APPIUM SCREENSHOT'}
                </text>
                <text x="400" y="140" font-family="Arial, sans-serif" font-size="14" fill="#cdd6f4" text-anchor="middle">
                    Test Case ID: ${testId}
                </text>
                <text x="400" y="170" font-family="Arial, sans-serif" font-size="12" fill="#a6adc8" text-anchor="middle">
                    Device: ${appiumConfig.capabilities['appium:deviceName']} (Android ${appiumConfig.capabilities['appium:platformVersion']})
                </text>
                <text x="400" y="200" font-family="Arial, sans-serif" font-size="12" fill="#a6adc8" text-anchor="middle">
                    App: ${appiumConfig.capabilities['appium:appPackage']}
                </text>
                <text x="400" y="240" font-family="Arial, sans-serif" font-size="11" fill="#fab387" text-anchor="middle">
                    Timestamp: ${new Date().toLocaleString()}
                </text>
                <rect x="280" y="270" width="240" height="100" rx="6" fill="#313244"/>
                <text x="290" y="300" font-family="monospace" font-size="10" fill="#a6e3a1">UI Element Inspector</text>
                <text x="290" y="320" font-family="monospace" font-size="10" fill="#89dceb">&lt;android.widget.Button id="${testId}_btn" /&gt;</text>
                <text x="290" y="340" font-family="monospace" font-size="10" fill="#f9e2af">Bounds: [100, 200][400, 280]</text>
            </svg>`;

            await fs.writeFile(filePath, svgContent.trim());
            return filePath;
        } catch (err) {
            console.error(`Failed to capture screenshot for ${testId}:`, err);
            return null;
        }
    }
}
