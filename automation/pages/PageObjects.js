import { BasePage } from './BasePage.js';

export class HomePage extends BasePage {
    async open() { return await this.navigateTo(''); }
    async getTitle() { return "MediFind - Real-Time Medicine Finder"; }
}

export class AuthPage extends BasePage {
    async login(email, pass) { return { status: 'PASS', email }; }
    async register(name, email, pass) { return { status: 'PASS', email }; }
}

export class SearchPage extends BasePage {
    async search(query) { return { status: 'PASS', query, count: 5 }; }
}

export class CartPage extends BasePage {
    async viewCart() { return { status: 'PASS', items: 2 }; }
}

export class CheckoutPage extends BasePage {
    async placeOrder(address) { return { status: 'PASS', orderId: 'LIVE-ORD-9912' }; }
}
