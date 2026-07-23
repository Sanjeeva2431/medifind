import { BasePage } from './BasePage.js';

export class NotificationPage extends BasePage {
    selectors = {
        notificationBell: 'com.medifind.app:id/ic_notification_bell',
        notificationList: 'com.medifind.app:id/rv_notifications',
        clearAllBtn: 'com.medifind.app:id/btn_clear_notifications',
        badgeCount: 'com.medifind.app:id/tv_notification_count'
    };

    async openNotifications() {
        await this.click(this.selectors.notificationBell);
    }
}
