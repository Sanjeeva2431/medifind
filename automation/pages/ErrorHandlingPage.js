import { BasePage } from './BasePage.js';

export class ErrorHandlingPage extends BasePage {
    selectors = {
        errorBanner: 'com.medifind.app:id/banner_error',
        retryBtn: 'com.medifind.app:id/btn_retry_connection',
        errorTitle: 'com.medifind.app:id/tv_error_title',
        errorDetails: 'com.medifind.app:id/tv_error_details'
    };

    async triggerRetry() {
        await this.click(this.selectors.retryBtn);
    }
}
