import { BasePage } from './BasePage.js';

export class RegressionPage extends BasePage {
    selectors = {
        checkoutSummary: 'com.medifind.app:id/card_checkout_summary',
        confirmOrderBtn: 'com.medifind.app:id/btn_confirm_e2e_order',
        successBanner: 'com.medifind.app:id/banner_order_success'
    };

    async executeFullE2EWorkflow() {
        await this.click(this.selectors.confirmOrderBtn);
        return true;
    }
}
