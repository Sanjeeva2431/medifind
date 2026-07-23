import { BasePage } from './BasePage.js';

export class DashboardPage extends BasePage {
    selectors = {
        greetingHeader: 'com.medifind.app:id/tv_greeting',
        searchBarBanner: 'com.medifind.app:id/banner_search',
        quickUploadRx: 'com.medifind.app:id/btn_quick_upload',
        nearbyPharmaciesCard: 'com.medifind.app:id/card_nearby_pharmacies'
    };

    async clickQuickRxUpload() {
        await this.click(this.selectors.quickUploadRx);
    }
}
