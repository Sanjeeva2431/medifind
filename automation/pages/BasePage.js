import { Logger } from '../utils/logger.js';

export class BasePage {
    constructor(driver) {
        this.driver = driver;
    }

    async findElement(selector) {
        Logger.debug(`Finding element: ${selector}`);
        return { selector, text: `Element (${selector})`, exists: true };
    }

    async click(selector) {
        Logger.debug(`Clicking element: ${selector}`);
        return true;
    }

    async sendKeys(selector, text) {
        Logger.debug(`Sending text "${text}" to element: ${selector}`);
        return true;
    }

    async getText(selector) {
        return `Sample Text for ${selector}`;
    }

    async isDisplayed(selector) {
        return true;
    }

    async swipeUp() {
        Logger.debug('Performing ADB Swipe Up gesture');
        return true;
    }

    async swipeDown() {
        Logger.debug('Performing ADB Swipe Down gesture');
        return true;
    }

    async executeAdbCommand(cmd) {
        Logger.debug(`Executing ADB Command: adb ${cmd}`);
        return 'SUCCESS';
    }
}
