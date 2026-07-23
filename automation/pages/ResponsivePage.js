import { BasePage } from './BasePage.js';

export class ResponsivePage extends BasePage {
    selectors = {
        containerLayout: 'com.medifind.app:id/layout_responsive_container',
        tabletViewPane: 'com.medifind.app:id/pane_tablet_split'
    };

    async isTabletLayoutActive() {
        return await this.isDisplayed(this.selectors.tabletViewPane);
    }
}
