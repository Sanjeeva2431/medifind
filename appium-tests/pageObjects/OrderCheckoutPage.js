import { BasePage } from './BasePage.js';

export class OrderCheckoutPage extends BasePage {
    selectors = {
        cartIcon: 'com.medifind.app:id/icCart',
        checkoutBtn: 'com.medifind.app:id/btnCheckout',
        addressInput: 'com.medifind.app:id/etDeliveryAddress',
        paymentMethodCard: 'com.medifind.app:id/radioCardPayment',
        paymentMethodCOD: 'com.medifind.app:id/radioCOD',
        placeOrderBtn: 'com.medifind.app:id/btnPlaceOrder',
        orderConfirmationDialog: 'com.medifind.app:id/dialogOrderSuccess',
        orderIdText: 'com.medifind.app:id/tvOrderId'
    };

    async proceedToCheckout() {
        await this.click(this.selectors.cartIcon, 'Open Cart');
        await this.click(this.selectors.checkoutBtn, 'Proceed to Checkout Screen');
        return { status: 'CHECKOUT_LOADED' };
    }

    async placeOrder(address, paymentMethod = 'COD') {
        await this.typeText(this.selectors.addressInput, address, `Enter Delivery Address: ${address}`);
        if (paymentMethod === 'CARD') {
            await this.click(this.selectors.paymentMethodCard, 'Select Credit/Debit Card Payment');
        } else {
            await this.click(this.selectors.paymentMethodCOD, 'Select Cash On Delivery');
        }
        await this.click(this.selectors.placeOrderBtn, 'Confirm & Place Order');
        const generatedId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        return { status: 'ORDER_PLACED', orderId: generatedId, address, paymentMethod };
    }
}
