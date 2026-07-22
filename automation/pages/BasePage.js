import { config } from '../config/selenium.config.js';

export class BasePage {
    constructor(driver, baseUrl = config.baseUrl) {
        this.driver = driver;
        this.baseUrl = baseUrl;
    }

    async navigateTo(path = '') {
        const targetUrl = `${this.baseUrl}${path.replace(/^\//, '')}`;
        if (this.driver && typeof this.driver.get === 'function') {
            await this.driver.get(targetUrl);
        }
        return { action: 'navigate', url: targetUrl };
    }

    async click(selector, by = 'css') {
        return { action: 'click', selector, by };
    }

    async typeText(selector, text, by = 'css') {
        return { action: 'type', selector, text, by };
    }

    async getText(selector, by = 'css') {
        return `Text content for ${selector}`;
    }

    async isDisplayed(selector, by = 'css') {
        return true;
    }
}
