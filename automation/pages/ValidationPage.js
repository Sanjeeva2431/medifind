import { BasePage } from './BasePage.js';

export class ValidationPage extends BasePage {
    selectors = {
        emailErrorText: 'com.medifind.app:id/tv_email_error',
        phoneErrorText: 'com.medifind.app:id/tv_phone_error',
        passwordLengthError: 'com.medifind.app:id/tv_password_error',
        pincodeError: 'com.medifind.app:id/tv_pincode_error'
    };

    async getValidationError(fieldSelector) {
        return await this.getText(fieldSelector);
    }
}
