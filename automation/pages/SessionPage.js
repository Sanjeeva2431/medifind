import { BasePage } from './BasePage.js';

export class SessionPage extends BasePage {
    selectors = {
        sessionExpiredDialog: 'com.medifind.app:id/dialog_session_expired',
        reLoginBtn: 'com.medifind.app:id/btn_relogin',
        tokenTimer: 'com.medifind.app:id/tv_token_countdown'
    };

    async acknowledgeExpiredSession() {
        await this.click(this.selectors.reLoginBtn);
    }
}
