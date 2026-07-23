import { BasePage } from './BasePage.js';

export class OfflinePage extends BasePage {
    selectors = {
        offlineBanner: 'com.medifind.app:id/banner_offline_mode',
        cachedDataBadge: 'com.medifind.app:id/tv_cached_status',
        syncQueueBtn: 'com.medifind.app:id/btn_sync_pending'
    };

    async isOfflineBannerVisible() {
        return await this.isDisplayed(this.selectors.offlineBanner);
    }
}
