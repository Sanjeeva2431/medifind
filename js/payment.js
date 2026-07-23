// MediFind Razorpay Payment Gateway & GST Invoice Engine
// Handles UPI, Credit/Debit Cards, Net Banking, Wallets, Cash on Delivery, GST Tax Invoice Generation, and Failed Payment Retry Handling

export class PaymentService {
    constructor(app) {
        this.app = app;
        this.paymentHistory = [
            {
                txId: 'pay_RZP90182',
                orderId: 'ORD-89102',
                amount: 86.00,
                method: 'UPI (Google Pay)',
                status: 'Success',
                timestamp: '2026-07-22T10:15:00Z'
            }
        ];
    }

    // 1. Launch Razorpay Checkout Modal
    openRazorpayCheckout(amount) {
        const cart = this.app.state.cart;
        if (cart.length === 0) {
            this.app.showToast('Your cart is empty!');
            return;
        }

        this.app.showModal(`
            <div class="modal-card" style="max-width:440px; padding:0; overflow:hidden;">
                <!-- Razorpay Header -->
                <div style="background:#0c2340; color:white; padding:20px; position:relative;">
                    <button class="modal-close-btn" style="color:white;" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <i class="fa-solid fa-bolt" style="color:#0ea5e9; font-size:20px;"></i>
                            <strong style="font-size:16px;">Razorpay Secure</strong>
                        </div>
                        <span style="background:rgba(255,255,255,0.15); padding:2px 8px; border-radius:4px; font-size:11px;">TEST MODE</span>
                    </div>
                    <div style="font-size:12px; opacity:0.8;">MediFind Healthcare • Order Total</div>
                    <div style="font-size:26px; font-weight:800; color:#38bdf8;">₹${amount.toFixed(2)}</div>
                </div>

                <!-- Payment Options List -->
                <div style="padding:20px; background:var(--card-bg);">
                    <h4 style="font-size:13px; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted); margin-bottom:12px;">Select Payment Method</h4>

                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <!-- Option 1: UPI -->
                        <div style="border:1px solid var(--card-border); border-radius:var(--radius-md); padding:12px; display:flex; align-items:center; justify-content:space-between; cursor:pointer; background:var(--background);"
                             onclick="MediApp.processPayment('UPI', ${amount})">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <i class="fa-solid fa-mobile-screen-button" style="font-size:22px; color:#22c55e;"></i>
                                <div>
                                    <strong style="font-size:14px;">UPI (Google Pay / PhonePe / Paytm)</strong>
                                    <div style="font-size:11px; color:var(--text-muted);">Instant 0% Fee Instant Transfer</div>
                                </div>
                            </div>
                            <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                        </div>

                        <!-- Option 2: Cards -->
                        <div style="border:1px solid var(--card-border); border-radius:var(--radius-md); padding:12px; display:flex; align-items:center; justify-content:space-between; cursor:pointer; background:var(--background);"
                             onclick="MediApp.processPayment('Card', ${amount})">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <i class="fa-solid fa-credit-card" style="font-size:22px; color:#0ea5e9;"></i>
                                <div>
                                    <strong style="font-size:14px;">Credit / Debit Card</strong>
                                    <div style="font-size:11px; color:var(--text-muted);">Visa, Mastercard, RuPay, Amex</div>
                                </div>
                            </div>
                            <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                        </div>

                        <!-- Option 3: Net Banking -->
                        <div style="border:1px solid var(--card-border); border-radius:var(--radius-md); padding:12px; display:flex; align-items:center; justify-content:space-between; cursor:pointer; background:var(--background);"
                             onclick="MediApp.processPayment('NetBanking', ${amount})">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <i class="fa-solid fa-building-columns" style="font-size:22px; color:#f59e0b;"></i>
                                <div>
                                    <strong style="font-size:14px;">Net Banking</strong>
                                    <div style="font-size:11px; color:var(--text-muted);">HDFC, ICICI, SBI, Axis, Kotak</div>
                                </div>
                            </div>
                            <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                        </div>

                        <!-- Option 4: Wallets -->
                        <div style="border:1px solid var(--card-border); border-radius:var(--radius-md); padding:12px; display:flex; align-items:center; justify-content:space-between; cursor:pointer; background:var(--background);"
                             onclick="MediApp.processPayment('Wallet', ${amount})">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <i class="fa-solid fa-wallet" style="font-size:22px; color:#9333ea;"></i>
                                <div>
                                    <strong style="font-size:14px;">Wallets</strong>
                                    <div style="font-size:11px; color:var(--text-muted);">Amazon Pay, Mobikwik</div>
                                </div>
                            </div>
                            <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                        </div>

                        <!-- Option 5: Cash on Delivery -->
                        <div style="border:1px solid var(--card-border); border-radius:var(--radius-md); padding:12px; display:flex; align-items:center; justify-content:space-between; cursor:pointer; background:var(--background);"
                             onclick="MediApp.processPayment('COD', ${amount})">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <i class="fa-solid fa-money-bill-wave" style="font-size:22px; color:#10b981;"></i>
                                <div>
                                    <strong style="font-size:14px;">Cash on Delivery (COD)</strong>
                                    <div style="font-size:11px; color:var(--text-muted);">Pay cash upon 15-min delivery</div>
                                </div>
                            </div>
                            <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                        </div>
                    </div>

                    <!-- Simulate Failure Trigger -->
                    <div style="margin-top:14px; text-align:center;">
                        <button class="btn-secondary" style="font-size:11px; color:var(--emergency-red);" onclick="MediApp.simulatePaymentFailure(${amount})">
                            <i class="fa-solid fa-bug"></i> Simulate Bank Payment Failure
                        </button>
                    </div>
                </div>
            </div>
        `);
    }

    // 2. Process Selected Payment
    processPayment(method, amount) {
        const txId = `pay_RZP${Math.floor(100000 + Math.random() * 900000)}`;
        const txRecord = {
            txId,
            amount,
            method,
            status: 'Success',
            timestamp: new Date().toISOString()
        };

        this.paymentHistory.push(txRecord);
        this.app.completeCheckoutOrder(txId, method, amount);
    }

    // 3. Handle Payment Rejection & Failure Modal
    handlePaymentFailure(amount, reason = 'Bank Server Timeout / Insufficient Funds') {
        const txId = `pay_FAIL${Math.floor(100000 + Math.random() * 900000)}`;
        this.paymentHistory.push({
            txId,
            amount,
            method: 'Failed Attempt',
            status: 'Failed',
            reason,
            timestamp: new Date().toISOString()
        });

        this.app.showModal(`
            <div class="modal-card" style="text-align:center; padding:24px;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="width:60px; height:60px; background:var(--emergency-light); color:var(--emergency-red); border-radius:var(--radius-full); display:flex; align-items:center; justify-content:center; font-size:28px; margin:0 auto 14px auto;">
                    <i class="fa-solid fa-circle-xmark"></i>
                </div>
                <h3 style="font-size:18px; margin-bottom:4px; color:var(--emergency-red);">Payment Declined</h3>
                <p style="font-size:13px; color:var(--text-body); margin-bottom:16px;">${reason}. Transaction reference: <code>${txId}</code></p>

                <div style="display:flex; gap:10px;">
                    <button class="add-cart-btn" style="flex:1; justify-content:center;" onclick="MediApp.simulateRazorpayCheckout(${amount})">
                        <i class="fa-solid fa-rotate-right"></i> Retry Payment
                    </button>
                    <button class="btn-secondary" style="flex:1; justify-content:center;" onclick="MediApp.closeModal()">
                        Cancel
                    </button>
                </div>
            </div>
        `);
    }

    // 4. Generate Official GST Tax Invoice View
    openGstInvoiceModal(orderId) {
        const order = this.app.state.orders.find(o => o.id === orderId) || this.app.state.orders[0];
        const subtotal = order.total_amount * 0.95;
        const gstTax = order.total_amount * 0.05;

        this.app.showModal(`
            <div class="modal-card" style="max-width:520px; padding:24px;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>

                <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid var(--primary); padding-bottom:14px; margin-bottom:16px;">
                    <div>
                        <h2 style="font-size:20px; color:var(--primary); font-weight:800;">MediFind Healthcare</h2>
                        <div style="font-size:11px; color:var(--text-muted);">GSTIN: 07AAAAA0000A1Z5 • DL No: DL-2023-APO891</div>
                        <div style="font-size:11px; color:var(--text-muted);">Apollo Pharmacy 24/7, Sector 18, Noida</div>
                    </div>
                    <div style="text-align:right;">
                        <span class="role-badge-btn" style="background:var(--secondary-light); color:var(--secondary); font-size:11px;">PAID INVOICE</span>
                        <div style="font-weight:800; font-size:14px; margin-top:4px;">${order.id}</div>
                        <div style="font-size:11px; color:var(--text-muted);">${new Date(order.created_at || Date.now()).toLocaleDateString()}</div>
                    </div>
                </div>

                <!-- Billed To -->
                <div style="background:var(--background); padding:10px 14px; border-radius:var(--radius-sm); font-size:12px; margin-bottom:16px;">
                    <strong>BILLED TO:</strong> ${order.customer_name} (${order.customer_phone})<br>
                    <strong>ADDRESS:</strong> ${order.customer_address}
                </div>

                <!-- Items Table -->
                <table class="data-table" style="font-size:12px; margin-bottom:16px;">
                    <thead>
                        <tr>
                            <th>Item Description</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Total (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(it => `
                            <tr>
                                <td><b>${it.name}</b></td>
                                <td>${it.quantity}</td>
                                <td>₹${it.price.toFixed(2)}</td>
                                <td>₹${(it.price * it.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <!-- Summary Breakdown -->
                <div style="display:flex; flex-direction:column; gap:4px; font-size:12px; margin-bottom:16px; border-top:1px dashed var(--card-border); pt:8px;">
                    <div style="display:flex; justify-content:space-between;"><span>Subtotal (Excl. Tax)</span><span>₹${subtotal.toFixed(2)}</span></div>
                    <div style="display:flex; justify-content:space-between;"><span>GST Tax (5%)</span><span>₹${gstTax.toFixed(2)}</span></div>
                    <div style="display:flex; justify-content:space-between;"><span>Delivery Fee</span><span style="color:var(--secondary); font-weight:700;">FREE</span></div>
                    <div style="display:flex; justify-content:space-between; font-weight:800; font-size:15px; border-top:1px solid var(--card-border); padding-top:6px; margin-top:4px;">
                        <span>Grand Total Paid</span><span style="color:var(--primary);">₹${order.total_amount.toFixed(2)}</span>
                    </div>
                </div>

                <div style="display:flex; gap:10px;">
                    <button class="add-cart-btn" style="flex:1; justify-content:center;" onclick="window.print()">
                        <i class="fa-solid fa-print"></i> Print GST Invoice
                    </button>
                    <button class="btn-secondary" style="flex:1; justify-content:center;" onclick="MediApp.closeModal()">
                        Close
                    </button>
                </div>
            </div>
        `);
    }
}
