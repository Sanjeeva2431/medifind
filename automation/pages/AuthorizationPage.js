import { BasePage } from './BasePage.js';

export class AuthorizationPage extends BasePage {
    selectors = {
        roleBadge: 'com.medifind.app:id/tv_role_badge',
        adminPanelBtn: 'com.medifind.app:id/btn_admin_panel',
        pharmacyConsoleBtn: 'com.medifind.app:id/btn_pharmacy_console',
        accessDeniedMsg: 'com.medifind.app:id/tv_access_denied'
    };

    async verifyRoleAccess(role) {
        return await this.isDisplayed(this.selectors.roleBadge);
    }
}
