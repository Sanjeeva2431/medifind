import { BasePage } from './BasePage.js';

export class UploadPage extends BasePage {
    selectors = {
        selectFileBtn: 'com.medifind.app:id/btn_choose_file',
        cameraBtn: 'com.medifind.app:id/btn_take_photo',
        galleryBtn: 'com.medifind.app:id/btn_open_gallery',
        uploadProgress: 'com.medifind.app:id/pb_upload_progress',
        uploadSuccessBadge: 'com.medifind.app:id/ic_upload_success'
    };

    async uploadPrescriptionFile() {
        await this.click(this.selectors.selectFileBtn);
    }
}
