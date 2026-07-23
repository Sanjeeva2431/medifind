import { BasePage } from './BasePage.js';

export class NavigationPage extends BasePage {
    selectors = {
        drawerMenu: 'com.medifind.app:id/btn_drawer',
        navHome: 'com.medifind.app:id/nav_home',
        navSearch: 'com.medifind.app:id/nav_search',
        navOrders: 'com.medifind.app:id/nav_orders',
        navProfile: 'com.medifind.app:id/nav_profile'
    };

    async openDrawerAndNavigate(target) {
        await this.click(this.selectors.drawerMenu);
        await this.click(this.selectors[target]);
    }
}
