import { Logger } from '../utils/logger.js';
import { ScreenshotUtil } from '../utils/screenshotUtil.js';

export class TestListener {
    static async onTestStart(testCase) {
        Logger.info(`▶️ [START] ${testCase.id} - ${testCase.name} [Priority: ${testCase.priority || 'P2'}]`);
    }

    static async onTestSuccess(testCase, durationSec) {
        Logger.info(`✅ [PASS] ${testCase.id} - ${testCase.name} (${durationSec}s)`);
    }

    static async onTestFailure(testCase, error, durationSec) {
        Logger.error(`❌ [FAIL] ${testCase.id} - ${testCase.name} (${durationSec}s) | Error: ${error.message}`);
        const screenshotPath = await ScreenshotUtil.captureScreenshot(testCase.id, 'FAIL');
        testCase.screenshot = screenshotPath;
        testCase.failureReason = error.message;
        testCase.stackTrace = error.stack || error.message;
    }

    static async onTestSkipped(testCase, reason) {
        Logger.warn(`⏸️ [SKIP] ${testCase.id} - ${testCase.name} | Reason: ${reason}`);
    }
}
