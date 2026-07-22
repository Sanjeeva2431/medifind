import fs from 'fs';
import path from 'path';

export async function captureScreenshot(driver, testId, screenshotDir) {
    if (!driver || typeof driver.takeScreenshot !== 'function') {
        return null;
    }
    try {
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }
        const imageBase64 = await driver.takeScreenshot();
        const fileName = `Screenshot_${testId}_${Date.now()}.png`;
        const filePath = path.join(screenshotDir, fileName);
        fs.writeFileSync(filePath, imageBase64, 'base64');
        return filePath;
    } catch (err) {
        console.error(`Failed to capture screenshot for ${testId}:`, err.message);
        return null;
    }
}
