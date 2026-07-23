import { BasePage } from './BasePage.js';

export class AccessibilityPage extends BasePage {
    selectors = {
        mainHeading: 'com.medifind.app:id/tv_main_heading',
        screenReaderLabel: 'com.medifind.app:id/tv_accessible_label'
    };

    async verifyAccessibilityLabel(selector) {
        return await this.getText(selector);
    }
}
