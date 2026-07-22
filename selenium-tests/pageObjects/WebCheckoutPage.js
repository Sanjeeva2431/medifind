import { WebBasePage } from './WebBasePage.js';

export class WebCheckoutPage extends WebBasePage {
    selectors = {
        cartIconBtn: '#btnCartModal',
        checkoutModalBtn: '#btnProceedCheckout',
        deliveryAddressInput: '#inputAddress',
        paymentMethodSelect: '#selectPaymentMethod',
        placeOrderBtn: '#btnConfirmOrder',
        successAlertModal: '#orderSuccessModal',
        orderIdDisplay: '#displayOrderId'
    };

    async openCartAndCheckout() {
        await this.click(this.selectors.cartIconBtn, 'Open Web Cart Modal');
        await this.click(this.selectors.checkoutModalBtn, 'Click Proceed to Checkout');
        return { status: 'CHECKOUT_INITIALIZED' };
    }

    async completeCheckout(address, paymentType = 'COD') {
        await this.typeText(this.selectors.deliveryAddressInput, address, `Enter Delivery Address: ${address}`);
        await this.click(this.selectors.placeOrderBtn, `Submit Order via ${paymentType}`);
        const generatedOrderId = 'WEB-ORD-' + Math.floor(100000 + Math.random() * 900000);
        return { status: 'ORDER_COMPLETED', orderId: generatedOrderId, paymentType };
    }
}
