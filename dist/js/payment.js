// MediFind Demo Payment System Engine
// Handles Payment Method Selection (UPI, Card, Net Banking, COD) and Two-Step Payment Processing Flow

export class PaymentService {
    constructor(app) {
        this.app = app;
        this.selectedMethod = 'UPI'; // 'UPI' | 'CARD' | 'NETBANKING' | 'COD'
        this.isProcessing = false;
        this.paymentHistory = [
            {
                txId: 'pay_demo_UPI90182',
                orderId: 'ORD-89102',
                amount: 86.00,
                method: 'UPI (Google Pay)',
                status: 'Success',
                timestamp: '2026-07-22T10:15:00Z'
            }
        ];
    }

    // 1. Open Checkout Payment Modal (Step 1: Selection & Input)
    openRazorpayCheckout(amount) {
        const cart = this.app.state.cart;
        if (cart.length === 0) {
            this.app.showToast('Your cart is empty!');
            return;
        }

        this.selectedMethod = this.selectedMethod || 'UPI';
        this.isProcessing = false;
        this.renderCheckoutModal(amount);
    }

    // 2. Select Payment Method (ONLY changes selection state, NEVER places order or clears cart)
    selectPaymentMethod(method, amount) {
        this.selectedMethod = method;
        this.renderCheckoutModal(amount);
    }

    // 3. Render Checkout Payment Modal UI
    renderCheckoutModal(amount) {
        const method = this.selectedMethod;

        this.app.showModal(`
            <div class="modal-card" style="max-width:460px; padding:0; overflow:hidden; border-radius:var(--radius-lg);">
                <!-- Header -->
                <div style="background:#0c2340; color:white; padding:20px; position:relative;">
                    <button class="modal-close-btn" style="color:white;" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <i class="fa-solid fa-shield-halved" style="color:#0ea5e9; font-size:20px;"></i>
                            <strong style="font-size:16px;">MediFind Secure Payment</strong>
                        </div>
                        <span style="background:rgba(255,255,255,0.15); padding:2px 8px; border-radius:4px; font-size:11px; font-weight:700;">DEMO GATEWAY</span>
                    </div>
                    <div style="font-size:12px; opacity:0.8;">Total Order Amount</div>
                    <div style="font-size:26px; font-weight:800; color:#38bdf8;">₹${amount.toFixed(2)}</div>
                </div>

                <!-- Body -->
                <div style="padding:20px; background:var(--card-bg);">
                    <h4 style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted); margin-bottom:12px; font-weight:800;">
                        1. Select Payment Method
                    </h4>

                    <!-- Method Selection List -->
                    <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
                        <!-- Option 1: UPI -->
                        <div style="border:${method === 'UPI' ? '2px solid var(--primary)' : '1px solid var(--card-border)'}; background:${method === 'UPI' ? 'var(--primary-light)' : 'var(--background)'}; border-radius:var(--radius-md); padding:12px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;"
                             onclick="MediApp.selectPaymentMethod('UPI', ${amount})">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <i class="fa-solid fa-mobile-screen-button" style="font-size:20px; color:#22c55e;"></i>
                                <div>
                                    <strong style="font-size:14px; color:var(--text-main);">UPI (Google Pay / PhonePe / Paytm)</strong>
                                    <div style="font-size:11px; color:var(--text-muted);">Instant 0% Fee Transfer</div>
                                </div>
                            </div>
                            <input type="radio" name="paymentOption" ${method === 'UPI' ? 'checked' : ''} style="cursor:pointer;">
                        </div>

                        <!-- Option 2: Credit / Debit Card -->
                        <div style="border:${method === 'CARD' ? '2px solid var(--primary)' : '1px solid var(--card-border)'}; background:${method === 'CARD' ? 'var(--primary-light)' : 'var(--background)'}; border-radius:var(--radius-md); padding:12px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;"
                             onclick="MediApp.selectPaymentMethod('CARD', ${amount})">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <i class="fa-solid fa-credit-card" style="font-size:20px; color:#0ea5e9;"></i>
                                <div>
                                    <strong style="font-size:14px; color:var(--text-main);">Credit / Debit Card</strong>
                                    <div style="font-size:11px; color:var(--text-muted);">Visa, Mastercard, RuPay, Amex</div>
                                </div>
                            </div>
                            <input type="radio" name="paymentOption" ${method === 'CARD' ? 'checked' : ''} style="cursor:pointer;">
                        </div>

                        <!-- Option 3: Net Banking -->
                        <div style="border:${method === 'NETBANKING' ? '2px solid var(--primary)' : '1px solid var(--card-border)'}; background:${method === 'NETBANKING' ? 'var(--primary-light)' : 'var(--background)'}; border-radius:var(--radius-md); padding:12px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;"
                             onclick="MediApp.selectPaymentMethod('NETBANKING', ${amount})">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <i class="fa-solid fa-building-columns" style="font-size:20px; color:#f59e0b;"></i>
                                <div>
                                    <strong style="font-size:14px; color:var(--text-main);">Net Banking</strong>
                                    <div style="font-size:11px; color:var(--text-muted);">SBI, HDFC, ICICI, Axis, Kotak</div>
                                </div>
                            </div>
                            <input type="radio" name="paymentOption" ${method === 'NETBANKING' ? 'checked' : ''} style="cursor:pointer;">
                        </div>

                        <!-- Option 4: Cash on Delivery -->
                        <div style="border:${method === 'COD' ? '2px solid var(--primary)' : '1px solid var(--card-border)'}; background:${method === 'COD' ? 'var(--primary-light)' : 'var(--background)'}; border-radius:var(--radius-md); padding:12px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;"
                             onclick="MediApp.selectPaymentMethod('COD', ${amount})">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <i class="fa-solid fa-money-bill-wave" style="font-size:20px; color:#10b981;"></i>
                                <div>
                                    <strong style="font-size:14px; color:var(--text-main);">Cash on Delivery (COD)</strong>
                                    <div style="font-size:11px; color:var(--text-muted);">Pay cash upon doorstep delivery</div>
                                </div>
                            </div>
                            <input type="radio" name="paymentOption" ${method === 'COD' ? 'checked' : ''} style="cursor:pointer;">
                        </div>
                    </div>

                    <!-- Payment Details Form (Step 2: Input & Submit) -->
                    <div style="border-top:1px dashed var(--card-border); padding-top:16px;">
                        <h4 style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted); margin-bottom:12px; font-weight:800;">
                            2. Enter Payment Details
                        </h4>
                        
                        ${this.renderPaymentFormFields(method, amount)}
                    </div>
                </div>
            </div>
        `);
    }

    // 4. Render Form Fields according to selected payment method
    renderPaymentFormFields(method, amount) {
        if (method === 'UPI') {
            return `
                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
                    <div>
                        <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">UPI ID</label>
                        <input type="text" id="payUpiIdInput" placeholder="username@okaxis or mobile@upi" value="alex@okaxis" style="width:100%; border:1px solid var(--card-border); padding:10px; border-radius:var(--radius-md); font-size:13px; font-weight:600;">
                    </div>
                </div>
                <button class="add-cart-btn" id="paySubmitBtn" style="width:100%; justify-content:center; padding:14px; font-size:15px;"
                        onclick="MediApp.submitDemoPayment('UPI', ${amount})">
                    <i class="fa-solid fa-lock"></i> Pay ₹${amount.toFixed(2)}
                </button>
            `;
        }

        if (method === 'CARD') {
            return `
                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
                    <div>
                        <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">CARD NUMBER</label>
                        <input type="text" id="payCardNumInput" placeholder="4532 •••• •••• 8910" value="4532 8901 2345 8910" style="width:100%; border:1px solid var(--card-border); padding:10px; border-radius:var(--radius-md); font-size:13px; font-weight:600;">
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <div>
                            <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">EXPIRY DATE</label>
                            <input type="text" id="payCardExpInput" placeholder="MM/YY" value="12/28" style="width:100%; border:1px solid var(--card-border); padding:10px; border-radius:var(--radius-md); font-size:13px; font-weight:600;">
                        </div>
                        <div>
                            <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">CVV</label>
                            <input type="password" id="payCardCvvInput" placeholder="•••" value="891" maxlength="4" style="width:100%; border:1px solid var(--card-border); padding:10px; border-radius:var(--radius-md); font-size:13px; font-weight:600;">
                        </div>
                    </div>
                    <div>
                        <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">CARDHOLDER NAME</label>
                        <input type="text" id="payCardNameInput" placeholder="Name on Card" value="Alex Johnson" style="width:100%; border:1px solid var(--card-border); padding:10px; border-radius:var(--radius-md); font-size:13px; font-weight:600;">
                    </div>
                </div>
                <button class="add-cart-btn" id="paySubmitBtn" style="width:100%; justify-content:center; padding:14px; font-size:15px;"
                        onclick="MediApp.submitDemoPayment('CARD', ${amount})">
                    <i class="fa-solid fa-lock"></i> Pay ₹${amount.toFixed(2)}
                </button>
            `;
        }

        if (method === 'NETBANKING') {
            return `
                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
                    <div>
                        <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">SELECT YOUR BANK</label>
                        <select id="payNetBankSelect" style="width:100%; border:1px solid var(--card-border); padding:10px; border-radius:var(--radius-md); font-size:13px; font-weight:600; background:var(--card-bg); color:var(--text-main);">
                            <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                            <option value="HDFC Bank">HDFC Bank</option>
                            <option value="ICICI Bank">ICICI Bank</option>
                            <option value="Axis Bank">Axis Bank</option>
                            <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                        </select>
                    </div>
                </div>
                <button class="add-cart-btn" id="paySubmitBtn" style="width:100%; justify-content:center; padding:14px; font-size:15px;"
                        onclick="MediApp.submitDemoPayment('NETBANKING', ${amount})">
                    <i class="fa-solid fa-lock"></i> Pay ₹${amount.toFixed(2)}
                </button>
            `;
        }

        // Cash on Delivery
        return `
            <div style="background:var(--background); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:14px; margin-bottom:16px; font-size:13px;">
                <div style="display:flex; align-items:center; gap:10px; color:var(--secondary); font-weight:700;">
                    <i class="fa-solid fa-truck-ramp-box" style="font-size:18px;"></i>
                    <span>Pay cash when your medicine is delivered.</span>
                </div>
                <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">
                    Please keep exact cash ready upon 15-minute delivery arrival.
                </div>
            </div>
            <button class="add-cart-btn" id="paySubmitBtn" style="width:100%; justify-content:center; padding:14px; font-size:15px; background:var(--secondary);"
                    onclick="MediApp.submitDemoPayment('COD', ${amount})">
                <i class="fa-solid fa-check"></i> Place Order (Cash on Delivery)
            </button>
        `;
    }

    // 5. Submit Demo Payment & Process Order Creation
    async submitDemoPayment(method, amount) {
        // Prevent duplicate order creation on double clicks
        if (this.isProcessing) return;
        this.isProcessing = true;

        const btn = document.getElementById('paySubmitBtn');

        // Step 1: Input Validation
        if (method === 'UPI') {
            const upiId = document.getElementById('payUpiIdInput')?.value?.trim();
            if (!upiId || !upiId.includes('@')) {
                this.app.showToast('⚠️ Please enter a valid UPI ID (e.g. username@upi)');
                this.isProcessing = false;
                return;
            }
        } else if (method === 'CARD') {
            const cardNum = document.getElementById('payCardNumInput')?.value?.trim();
            const cvv = document.getElementById('payCardCvvInput')?.value?.trim();
            if (!cardNum || cardNum.length < 12 || !cvv || cvv.length < 3) {
                this.app.showToast('⚠️ Please enter valid Card Details & CVV');
                this.isProcessing = false;
                return;
            }
        }

        // Step 2: Show Processing UI and Disable Submit Button
        if (btn) {
            btn.disabled = true;
            btn.style.opacity = '0.7';
            btn.style.cursor = 'not-allowed';
            btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Processing Payment...`;
        }

        this.app.showToast('⏳ Processing payment securely...');

        // Step 3: Simulated Payment Processing Delay (1.5s)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Step 4: Generate Demo Payment ID & Record History
        const txId = method === 'COD' ? `cod_${Date.now()}` : `pay_demo_${method}_${Math.floor(100000 + Math.random() * 900000)}`;
        const paymentStatus = method === 'COD' ? 'Pending COD' : 'Paid';

        this.paymentHistory.push({
            txId,
            amount,
            method,
            status: method === 'COD' ? 'Pending COD' : 'Success',
            timestamp: new Date().toISOString()
        });

        this.isProcessing = false;

        // Step 5: ONLY NOW Create/Confirm Order & Clear Cart
        this.app.completeCheckoutOrder(txId, method, amount, paymentStatus);
    }
}
