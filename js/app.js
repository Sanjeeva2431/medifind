// MediFind Application Controller & State Orchestrator (Base44 Parity)

import { MOCK_MEDICINES, MOCK_PHARMACIES, MOCK_ORDERS, MOCK_COUPONS } from './data.js';
import { CustomerModule } from './customer.js';
import { PharmacyModule } from './pharmacy.js';
import { DeliveryModule } from './delivery.js';
import { AdminModule } from './admin.js';
import { AiEngine } from './ai.js';
import { DeliveryTracker } from './tracking.js';
import { AuthService } from './auth.js';
import { RealtimeEngine } from './realtime-engine.js';
import { PaymentService } from './payment.js';
import { FcmService } from './fcm.js';

class MediFindApp {
    constructor() {
        this.authService = new AuthService(this);
        this.realtimeEngine = new RealtimeEngine(this);
        this.paymentService = new PaymentService(this);
        this.fcmService = new FcmService(this);

        this.state = {
            currentRole: 'customer', // customer, pharmacy, delivery, admin
            customerTab: 'home',     // home, search, pharmacies, pharmacy-detail, medicine-detail, prescription, cart, orders, profile
            pharmacyTab: 'dashboard',
            darkMode: false,
            medicines: [...MOCK_MEDICINES],
            pharmacies: [...MOCK_PHARMACIES],
            orders: [...MOCK_ORDERS],
            cart: [
                { id: 'med_1', name: 'Dolo 650mg Tablet', price: 30.50, quantity: 2, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80', pharmacy_name: 'Apollo Pharmacy 24/7' }
            ],
            prescriptions: [
                {
                    id: 'RX-901',
                    user_name: 'Alex Johnson',
                    status: 'Pending',
                    items: [
                        { name: 'Dolo 650mg Tablet', qty: 2, confidence: '98%' },
                        { name: 'Becosules Z Capsule', qty: 1, confidence: '96%' }
                    ]
                }
            ],
            appliedCoupon: null,
            favoritePharmacies: ['pharm_1'],
            savedAddresses: [
                { id: 'addr_1', label: 'Home', text: 'Flat 402, Block B, Sector 18, Noida, UP - 201301', isDefault: true },
                { id: 'addr_2', label: 'Office', text: 'Plot 88, Tech Park Avenue, Greater Noida', isDefault: false }
            ],
            notifications: [
                { id: 'n_1', title: 'Order Dispatched ⚡', body: 'Order ORD-89102 is out for delivery with Rohan Verma.', time: '10 mins ago', read: false },
                { id: 'n_2', title: 'Prescription Verified ✅', body: 'Dr. Gupta verified your prescription RX-901.', time: '1 hour ago', read: true }
            ]
        };

        this.customerModule = new CustomerModule(this);
        this.pharmacyModule = new PharmacyModule(this);
        this.deliveryModule = new DeliveryModule(this);
        this.adminModule = new AdminModule(this);
        this.aiEngine = new AiEngine(this);

        this.init();
    }

    init() {
        window.MediApp = this;

        // Auto-check authentication
        if (this.authService.isAuthenticated()) {
            const user = this.authService.getUser();
            const target = this.authService.getRedirectTabForRole(user.role);
            this.state.currentRole = target.role;
        } else {
            this.state.currentRole = 'auth';
            this.state.authMode = 'landing';
        }

        this.render();
        this.showToast('MediFind Application Ready 🏥');
    }

    render() {
        const root = document.getElementById('app');
        if (!root) return;

        let contentHtml = '';

        if (this.state.currentRole === 'auth') {
            contentHtml = this.authService.renderLoginPage();
        } else {
            contentHtml = this.customerModule.render();
        }

        root.innerHTML = `
            ${contentHtml}
            <div id="modalContainer"></div>
            <div id="toastContainer" class="toast-container"></div>
        `;

        setTimeout(() => {
            if (this.state.customerTab === 'pharmacies') {
                googleMapsService.renderMapCanvas('nearbyPharmaciesMapCanvas', {
                    lat: 28.5355,
                    lng: 77.3910
                });
            }
        }, 100);
    }

    // Customer Actions
    setCustomerTab(tab) {
        this.state.customerTab = tab;
        this.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    viewPharmacyDetails(id) {
        this.customerModule.selectedPharmacyId = id;
        this.setCustomerTab('pharmacy-detail');
    }

    viewMedicineDetails(id) {
        this.customerModule.selectedMedicineId = id;
        this.setCustomerTab('medicine-detail');
    }

    buyNow(id) {
        this.addToCart(id);
        this.setCustomerTab('cart');
    }

    filterPharmacies(val) {
        // Dynamic search filter handled in pharmacies page
    }

    openAccountModal() {
        const currentUser = this.authService.getUser();
        this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="text-align:center; padding:12px 0 20px 0;">
                    <div class="brand-icon" style="width:60px; height:60px; font-size:28px; margin:0 auto 12px auto;"><i class="fa-solid fa-user"></i></div>
                    <h3 style="font-size:20px; font-weight:800;">${currentUser ? currentUser.name : 'Guest User'}</h3>
                    <p style="font-size:13px; color:var(--text-muted);">${currentUser ? currentUser.email : 'Customer Account'}</p>
                </div>
                
                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
                    <div style="padding:12px 16px; background:var(--background); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:space-between; cursor:pointer;" onclick="MediApp.setCustomerTab('orders'); MediApp.closeModal();">
                        <div style="display:flex; align-items:center; gap:10px;"><i class="fa-solid fa-box" style="color:var(--primary);"></i> <span>My Orders</span></div>
                        <i class="fa-solid fa-chevron-right" style="font-size:12px; color:var(--text-muted);"></i>
                    </div>
                    <div style="padding:12px 16px; background:var(--background); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:space-between; cursor:pointer;" onclick="MediApp.openAddressModal(); MediApp.closeModal();">
                        <div style="display:flex; align-items:center; gap:10px;"><i class="fa-solid fa-location-dot" style="color:var(--secondary);"></i> <span>Saved Addresses</span></div>
                        <i class="fa-solid fa-chevron-right" style="font-size:12px; color:var(--text-muted);"></i>
                    </div>
                    <div style="padding:12px 16px; background:var(--background); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:space-between; cursor:pointer;" onclick="MediApp.setCustomerTab('prescription'); MediApp.closeModal();">
                        <div style="display:flex; align-items:center; gap:10px;"><i class="fa-solid fa-file-prescription" style="color:#0284c7;"></i> <span>Uploaded Prescriptions</span></div>
                        <i class="fa-solid fa-chevron-right" style="font-size:12px; color:var(--text-muted);"></i>
                    </div>
                </div>

                ${currentUser ? `
                    <button class="btn-secondary" style="width:100%; justify-content:center; padding:12px; color:var(--emergency-red); font-weight:700;" onclick="MediApp.logout()">
                        <i class="fa-solid fa-right-from-bracket"></i> Logout Account
                    </button>
                ` : `
                    <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px;" onclick="MediApp.setAuthMode('login'); MediApp.closeModal();">
                        <i class="fa-solid fa-right-to-bracket"></i> Sign In to Account
                    </button>
                `}
            </div>
        `);
    }

    openRoleModal() {
        this.openAccountModal();
    }

    switchRole(role) {
        this.state.currentRole = 'customer';
        this.closeModal();
        this.render();
    };

    setAuthMode(mode) {
        this.state.authMode = mode;
        this.render();
    }

    continueAsGuest() {
        this.state.isGuest = true;
        this.state.currentRole = 'customer';
        this.state.customerTab = 'home';
        this.showToast('👤 Browsing as Guest User');
        this.render();
    }

    async handleLoginFormSubmit(form) {
        const email = document.getElementById('authEmail')?.value?.trim();
        const password = document.getElementById('authPassword')?.value?.trim();
        const role = document.getElementById('authRoleSelect')?.value || 'customer';
        const rememberMe = document.getElementById('authRememberMe')?.checked ?? true;
        const errBanner = document.getElementById('authErrorBanner');

        if (!email || !password) {
            if (errBanner) {
                errBanner.style.display = 'block';
                errBanner.innerText = 'Please fill in all email and password fields.';
            }
            return;
        }

        const res = await this.authService.login(email, password, rememberMe);
        if (res.success) {
            res.user.role = role; // Bind requested role
            this.authService.setCurrentUser(res.user, rememberMe);
            const target = this.authService.getRedirectTabForRole(role);
            this.state.currentRole = target.role;
            this.showToast(`Welcome back, ${res.user.name}! Authenticated as ${role.toUpperCase()}`);
            this.render();
        } else {
            if (errBanner) {
                errBanner.style.display = 'block';
                errBanner.innerText = res.message || 'Login failed. Please check credentials.';
            }
        }
    }

    async handleSignupFormSubmit(form) {
        const role = document.getElementById('signupRole')?.value || 'customer';
        const name = document.getElementById('signupName')?.value?.trim();
        const email = document.getElementById('signupEmail')?.value?.trim();
        const phone = document.getElementById('signupPhone')?.value?.trim();
        const address = document.getElementById('signupAddress')?.value?.trim();
        const password = document.getElementById('signupPassword')?.value?.trim();
        const errBanner = document.getElementById('signupErrorBanner');

        if (!name || !email || !password) {
            if (errBanner) {
                errBanner.style.display = 'block';
                errBanner.innerText = 'Please complete all required fields.';
            }
            return;
        }

        const res = await this.authService.signup(email, password, name, role, phone, address);
        if (res.success) {
            const target = this.authService.getRedirectTabForRole(role);
            this.state.currentRole = target.role;
            this.showToast(`🎉 Registration Successful! Welcome ${name}`);
            this.render();
        } else {
            if (errBanner) {
                errBanner.style.display = 'block';
                errBanner.innerText = res.message || 'Registration failed.';
            }
        }
    }

    openForgotPasswordModal() {
        this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px; margin-bottom:6px;"><i class="fa-solid fa-key" style="color:var(--primary);"></i> Reset Password</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:14px;">Enter your registered account email to receive reset instructions.</p>
                <input type="email" id="resetEmailInput" placeholder="alex@example.com" value="alex@example.com" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); margin-bottom:14px;">
                <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px;" onclick="MediApp.sendPasswordResetEmail()">
                    <i class="fa-solid fa-paper-plane"></i> Send Password Reset Link
                </button>
            </div>
        `);
    }

    sendPasswordResetEmail() {
        const email = document.getElementById('resetEmailInput')?.value;
        this.closeModal();
        this.showToast(`Password reset link sent to ${email}`);
    }

    logout() {
        this.authService.logout();
        this.state.isGuest = false;
        this.state.currentRole = 'auth';
        this.state.authMode = 'landing';
        this.showToast('Logged out successfully');
        this.render();
    }

    openAuthModal(mode = 'login', targetRole = 'customer') {
        if (mode === 'login') {
            this.showModal(`
                <div class="modal-card">
                    <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    <h3 style="font-size:20px; margin-bottom:4px;"><i class="fa-solid fa-fire" style="color:#f97316;"></i> Firebase Email Login</h3>
                    <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">Sign in to access your role-protected portal</p>
                    
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <div>
                            <label style="font-size:12px; font-weight:700;">Email Address</label>
                            <input type="email" id="authEmail" value="${targetRole === 'pharmacy' ? 'apollo@example.com' : targetRole === 'delivery' ? 'rohan@example.com' : targetRole === 'admin' ? 'admin@medifind.com' : 'alex@example.com'}" placeholder="name@example.com" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                        </div>
                        <div>
                            <label style="font-size:12px; font-weight:700;">Password</label>
                            <input type="password" id="authPassword" value="password123" placeholder="••••••••" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                        </div>

                        <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px;">
                            <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                                <input type="checkbox" id="authRemember" checked> Remember Me
                            </label>
                            <span style="color:var(--primary); cursor:pointer; font-weight:700;" onclick="MediApp.openForgotPasswordModal()">Forgot Password?</span>
                        </div>

                        <button class="add-cart-btn" style="justify-content:center; padding:12px; margin-top:8px;" onclick="MediApp.handleLoginSubmit('${targetRole}')">
                            <i class="fa-solid fa-right-to-bracket"></i> Login Now
                        </button>

                        <div style="text-align:center; font-size:12px; color:var(--text-muted); margin-top:10px;">
                            Don't have an account? <span style="color:var(--primary); font-weight:700; cursor:pointer;" onclick="MediApp.openAuthModal('signup')">Sign Up</span>
                        </div>
                    </div>
                </div>
            `);
        } else {
            this.showModal(`
                <div class="modal-card">
                    <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    <h3 style="font-size:20px; margin-bottom:4px;"><i class="fa-solid fa-user-plus" style="color:var(--primary);"></i> Firebase Registration</h3>
                    <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">Create a new MediFind user account</p>

                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <div>
                            <label style="font-size:12px; font-weight:700;">Full Name</label>
                            <input type="text" id="signupName" placeholder="Alex Johnson" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                        </div>
                        <div>
                            <label style="font-size:12px; font-weight:700;">Email Address</label>
                            <input type="email" id="signupEmail" placeholder="alex@example.com" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                        </div>
                        <div>
                            <label style="font-size:12px; font-weight:700;">Password</label>
                            <input type="password" id="signupPassword" placeholder="••••••••" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                        </div>
                        <div>
                            <label style="font-size:12px; font-weight:700;">Select Account Role</label>
                            <select id="signupRole" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); background:var(--card-bg); color:var(--text-main);">
                                <option value="customer">Customer</option>
                                <option value="pharmacy">Pharmacy Owner</option>
                                <option value="delivery">Delivery Partner</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <button class="add-cart-btn" style="justify-content:center; padding:12px; margin-top:8px;" onclick="MediApp.handleSignupSubmit()">
                            <i class="fa-solid fa-user-check"></i> Register Account
                        </button>

                        <div style="text-align:center; font-size:12px; color:var(--text-muted); margin-top:10px;">
                            Already have an account? <span style="color:var(--primary); font-weight:700; cursor:pointer;" onclick="MediApp.openAuthModal('login')">Login</span>
                        </div>
                    </div>
                </div>
            `);
        }
    }

    async handleLoginSubmit(targetRole = 'customer') {
        const email = document.getElementById('authEmail')?.value;
        const password = document.getElementById('authPassword')?.value;
        const remember = document.getElementById('authRemember')?.checked;

        if (!email || !password) {
            this.showToast('Please enter both email and password.');
            return;
        }

        const res = await this.authService.login(email, password, remember);
        if (res.success) {
            this.closeModal();
            this.showToast(res.message);
            const redirect = this.authService.getRedirectTabForRole(res.user.role);
            this.state.currentRole = redirect.role;
            this.render();
        } else {
            this.showToast(`❌ ${res.message}`);
        }
    }

    async handleSignupSubmit() {
        const name = document.getElementById('signupName')?.value;
        const email = document.getElementById('signupEmail')?.value;
        const password = document.getElementById('signupPassword')?.value;
        const role = document.getElementById('signupRole')?.value || 'customer';

        if (!name || !email || !password) {
            this.showToast('Please complete all required fields.');
            return;
        }

        const res = await this.authService.signup(email, password, name, role);
        if (res.success) {
            this.closeModal();
            this.showToast(res.message);
            const redirect = this.authService.getRedirectTabForRole(role);
            this.state.currentRole = redirect.role;
            this.render();
        } else {
            this.showToast(`❌ ${res.message}`);
        }
    }

    openForgotPasswordModal() {
        this.showModal(`
            <div class="modal-card" style="text-align:center; padding:24px;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="width:56px; height:56px; background:var(--primary-light); color:var(--primary); border-radius:var(--radius-full); display:flex; align-items:center; justify-content:center; font-size:24px; margin:0 auto 12px auto;">
                    <i class="fa-solid fa-key"></i>
                </div>
                <h3 style="font-size:18px; margin-bottom:6px;">Reset Password</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">Enter your registered email to receive a password reset link.</p>
                <input type="email" id="resetEmail" placeholder="name@example.com" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); margin-bottom:16px;">
                <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px;" onclick="MediApp.handleForgotPasswordSubmit()">
                    <i class="fa-solid fa-paper-plane"></i> Send Password Reset Link
                </button>
            </div>
        `);
    }

    async handleForgotPasswordSubmit() {
        const email = document.getElementById('resetEmail')?.value;
        if (!email) {
            this.showToast('Please enter your email address.');
            return;
        }
        const res = await this.authService.forgotPassword(email);
        this.closeModal();
        this.showToast(res.message);
    }

    logout() {
        this.authService.logout();
        this.closeModal();
    }

    setPharmacyTab(tab) {
        this.pharmacyModule.activeTab = tab;
        this.render();
    }

    toggleTheme() {
        this.state.darkMode = !this.state.darkMode;
        document.body.classList.toggle('dark-mode', this.state.darkMode);
        this.showToast(this.state.darkMode ? 'Dark Mode 🌙' : 'Light Mode ☀️');
        this.render();
    }

    addToCart(medId) {
        const med = this.state.medicines.find(m => m.id === medId);
        if (!med) return;

        const existing = this.state.cart.find(item => item.id === medId);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.state.cart.push({
                id: med.id,
                name: med.name,
                price: med.price,
                quantity: 1,
                image: med.image,
                pharmacy_name: med.pharmacy_name
            });
        }
        this.showToast(`Added "${med.name}" to Cart 🛒`);
        this.render();
    }

    updateCartQty(medId, delta) {
        const item = this.state.cart.find(i => i.id === medId);
        if (!item) return;
        item.quantity += delta;
        if (item.quantity <= 0) {
            this.state.cart = this.state.cart.filter(i => i.id !== medId);
        }
        this.render();
    }

    getCartCount() {
        return this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    simulateRazorpayCheckout(amount) {
        this.paymentService.openRazorpayCheckout(amount);
    }

    processPayment(method, amount) {
        this.paymentService.processPayment(method, amount);
    }

    simulatePaymentFailure(amount) {
        this.paymentService.handlePaymentFailure(amount);
    }

    completeCheckoutOrder(txId, paymentMethod, amount) {
        const newOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
        const newOrder = {
            id: newOrderId,
            user_id: 'usr_1',
            customer_name: 'Alex Johnson',
            customer_phone: '+91 98765 43210',
            customer_address: document.getElementById('deliveryAddressInput')?.value || 'Flat 402, Block B, Sector 18, Noida',
            pharmacy_id: 'pharm_1',
            pharmacy_name: 'Apollo Pharmacy 24/7',
            pharmacy_phone: '+91 98765 12345',
            items: [...this.state.cart],
            total_amount: amount || 150.00,
            payment_method: paymentMethod,
            payment_status: paymentMethod === 'COD' ? 'Pending COD' : 'Paid',
            order_status: 'Out for Delivery',
            tracking_step: 4,
            created_at: new Date().toISOString(),
            delivery_partner: {
                id: 'partner_1',
                name: 'Rohan Verma',
                phone: '+91 98112 33445',
                vehicle: 'Hero Splendor (KA-01-EQ-9982)',
                rating: 4.9,
                otp: '8912'
            }
        };

        this.state.orders.unshift(newOrder);
        this.state.cart = [];
        this.closeModal();
        this.setCustomerTab('orders');
        this.showToast(`🎉 Payment Success! Order ${newOrderId} Placed (${paymentMethod})`);
        this.openTrackingModal(newOrderId);
    }

    openGstInvoiceModal(orderId) {
        this.paymentService.openGstInvoiceModal(orderId);
    }

    openTrackingModal(orderId) {
        const order = this.state.orders.find(o => o.id === orderId) || this.state.orders[0];
        
        this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div>
                        <div style="font-weight:800; font-size:18px; color:var(--primary);">${order.id}</div>
                        <div style="font-size:12px; color:var(--text-muted);">Estimated Arrival: <strong>12-15 Mins</strong></div>
                    </div>
                    <span class="role-badge-btn">${order.order_status}</span>
                </div>

                <div class="tracking-map-box">
                    <canvas id="liveTrackingCanvas" class="tracking-canvas"></canvas>
                </div>

                <div class="timeline-steps">
                    <div class="timeline-step completed"><div class="step-node"><i class="fa-solid fa-check"></i></div><div class="step-label">Placed</div></div>
                    <div class="timeline-step completed"><div class="step-node"><i class="fa-solid fa-check"></i></div><div class="step-label">Accepted</div></div>
                    <div class="timeline-step completed"><div class="step-node"><i class="fa-solid fa-check"></i></div><div class="step-label">Preparing</div></div>
                    <div class="timeline-step active"><div class="step-node"><i class="fa-solid fa-motorcycle"></i></div><div class="step-label">On Way</div></div>
                    <div class="timeline-step"><div class="step-node"><i class="fa-solid fa-house"></i></div><div class="step-label">Delivered</div></div>
                </div>

                <div style="background:var(--background); padding:14px; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:space-between;">
                    <div style="display:flex; gap:10px; align-items:center;">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" style="width:44px; height:44px; border-radius:var(--radius-full); object-fit:cover;">
                        <div>
                            <div style="font-weight:700; font-size:14px;">${order.delivery_partner.name}</div>
                            <div style="font-size:11px; color:var(--text-muted);">${order.delivery_partner.vehicle}</div>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:11px; color:var(--text-muted);">Delivery OTP</div>
                        <div style="font-weight:800; font-size:18px; color:var(--primary); letter-spacing:2px;">${order.delivery_partner.otp}</div>
                    </div>
                </div>
            </div>
        `);

        setTimeout(() => {
            new DeliveryTracker('liveTrackingCanvas');
        }, 100);
    }

    openAiDrawer() {
        this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px;"><i class="fa-solid fa-wand-magic-sparkles" style="color:var(--primary);"></i> MediAI Health Assistant</h3>
                
                <div id="chatBox" class="chat-messages">
                    <div class="chat-bubble bot">Hello Alex! Ask me about medicine availability, generic substitutes, or pharmacy hours.</div>
                </div>

                <div style="display:flex; gap:8px;">
                    <input type="text" id="aiQueryInput" placeholder="Ask 'Find Dolo 650' or 'Open pharmacies'..." 
                           style="flex:1; border:1px solid var(--card-border); padding:10px 14px; border-radius:var(--radius-full); font-size:13px;"
                           onkeypress="if(event.key === 'Enter') MediApp.sendAiMessage()">
                    <button class="add-cart-btn" onclick="MediApp.sendAiMessage()"><i class="fa-solid fa-paper-plane"></i></button>
                </div>
            </div>
        `);
    }

    sendAiMessage() {
        const input = document.getElementById('aiQueryInput');
        const chatBox = document.getElementById('chatBox');
        if (!input || !input.value.trim()) return;

        const query = input.value.trim();
        chatBox.innerHTML += `<div class="chat-bubble user">${query}</div>`;
        input.value = '';

        setTimeout(() => {
            const res = this.aiEngine.queryAssistant(query);
            chatBox.innerHTML += `<div class="chat-bubble bot">${res.reply}</div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 400);
    }

    async simulateOcrScan() {
        const area = document.getElementById('ocrStatusArea');
        if (!area) return;

        area.innerHTML = `
            <div style="text-align:center; padding:16px;">
                <i class="fa-solid fa-spinner fa-spin" style="font-size:24px; color:var(--primary); margin-bottom:8px;"></i>
                <div style="font-weight:700; font-size:13px;">AI Vision Scanning Prescription Text...</div>
            </div>
        `;

        const result = await this.aiEngine.scanPrescription();

        area.innerHTML = `
            <div style="background:var(--background); padding:16px; border-radius:var(--radius-md);">
                <div style="font-weight:800; color:var(--secondary); font-size:14px; margin-bottom:8px;"><i class="fa-solid fa-circle-check"></i> OCR Scan Complete!</div>
                <div style="font-size:12px; margin-bottom:8px;">Doctor: <b>${result.doctor}</b></div>
                <div style="font-size:12px; font-weight:700; margin-bottom:6px;">Detected Medicines:</div>
                <ul style="font-size:12px; padding-left:18px; margin-bottom:12px;">
                    ${result.items.map(it => `<li><b>${it.name}</b> (${it.qty} strips) - ${it.confidence} match</li>`).join('')}
                </ul>
                <button class="add-cart-btn" style="width:100%; justify-content:center;" onclick="MediApp.addOcrToCart()">
                    <i class="fa-solid fa-cart-plus"></i> Auto-Add Prescribed Medicines to Cart
                </button>
            </div>
        `;
    }

    addOcrToCart() {
        this.addToCart('med_1');
        this.addToCart('med_16');
        this.setCustomerTab('cart');
        this.showToast('Prescription items added to cart!');
    }

    showToast(message) {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-info" style="color:var(--primary);"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    showModal(html) {
        const container = document.getElementById('modalContainer');
        if (!container) return;
        container.innerHTML = `<div class="modal-overlay active">${html}</div>`;
    }

    closeModal() {
        const container = document.getElementById('modalContainer');
        if (container) container.innerHTML = '';
    }

    filterCategory(catId) {
        this.customerModule.selectedCategory = catId;
        this.setCustomerTab('search');
    }

    handleSearchInput(val) {
        this.customerModule.searchQuery = val;
        this.render();

        const searchInput = document.getElementById('mainSearchInputField');
        if (searchInput) {
            searchInput.focus();
            const len = searchInput.value.length;
            searchInput.setSelectionRange(len, len);
        }
    }

    openVoiceSearchModal() {
        this.showModal(`
            <div class="modal-card" style="text-align:center; padding:30px;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="width:64px; height:64px; background:var(--primary-light); color:var(--primary); border-radius:var(--radius-full); display:flex; align-items:center; justify-content:center; font-size:28px; margin:0 auto 16px auto; animation:pulse 1.5s infinite;">
                    <i class="fa-solid fa-microphone"></i>
                </div>
                <h3 style="font-size:18px; margin-bottom:8px;">Listening... Speak Medicine Name</h3>
            </div>
        `);

        setTimeout(() => {
            this.customerModule.searchQuery = 'Dolo 650';
            this.closeModal();
            this.setCustomerTab('search');
            this.showToast('Voice Recognized: "Dolo 650"');
        }, 2000);
    }

    filterPharmacies(val) {
        this.customerModule.pharmacySearchQuery = val;
        this.render();
    }

    updateOrderStatus(orderId, status, step) {
        const order = this.state.orders.find(o => o.id === orderId);
        if (order) {
            order.order_status = status;
            if (step) order.tracking_step = step;

            if (status === 'Preparing') {
                this.fcmService.notifyOrderAccepted(orderId);
            } else if (status === 'Out for Delivery') {
                this.fcmService.notifyOutForDelivery(orderId);
            } else if (status === 'Delivered') {
                this.fcmService.notifyDelivered(orderId);
            } else {
                this.showToast(`Order ${orderId} status set to "${status}"`);
            }
            this.render();
        }
    }

    updateStock(medId, newStock) {
        const med = this.state.medicines.find(m => m.id === medId);
        if (med) {
            med.stock = parseInt(newStock) || 0;
            if (med.stock < 20) {
                this.fcmService.notifyPharmacyLowStock(med.name, med.stock);
            } else {
                this.showToast(`Stock for ${med.name} updated to ${med.stock} units`);
            }
            this.render();
        }
    }

    updatePrice(medId, newPrice) {
        const med = this.state.medicines.find(m => m.id === medId);
        if (med) {
            med.price = parseFloat(newPrice) || med.price;
            this.showToast(`Price for ${med.name} updated to ₹${med.price.toFixed(2)}`);
            this.render();
        }
    }

    toggleAvailability(medId) {
        const med = this.state.medicines.find(m => m.id === medId);
        if (med) {
            if (med.stock > 0) {
                med.previousStock = med.stock;
                med.stock = 0;
                this.showToast(`Marked ${med.name} as Unavailable (Out of Stock)`);
            } else {
                med.stock = med.previousStock || 50;
                this.showToast(`Marked ${med.name} as Available (${med.stock} units)`);
            }
            this.render();
        }
    }

    acceptOrder(orderId) {
        this.updateOrderStatus(orderId, 'Preparing', 3);
        this.showToast(`✅ Accepted Order ${orderId}`);
    }

    rejectOrder(orderId) {
        if (confirm(`Reject order ${orderId}?`)) {
            this.updateOrderStatus(orderId, 'Cancelled', 0);
            this.showToast(`❌ Rejected Order ${orderId}`);
        }
    }

    cancelOrder(orderId) {
        if (confirm(`Are you sure you want to cancel order ${orderId}?`)) {
            this.updateOrderStatus(orderId, 'Cancelled', 0);
            this.showToast(`Order ${orderId} has been cancelled.`);
        }
    }

    reorder(orderId) {
        const order = this.state.orders.find(o => o.id === orderId);
        if (order && order.items.length > 0) {
            order.items.forEach(item => {
                this.addToCart(item.id);
            });
            this.setCustomerTab('cart');
            this.showToast(`Items from order ${orderId} added to cart!`);
        }
    }

    toggleFavoritePharmacy(pharmId) {
        if (!this.state.favoritePharmacies) this.state.favoritePharmacies = [];
        const index = this.state.favoritePharmacies.indexOf(pharmId);
        if (index > -1) {
            this.state.favoritePharmacies.splice(index, 1);
            this.showToast('Removed pharmacy from favorites ❤️');
        } else {
            this.state.favoritePharmacies.push(pharmId);
            this.showToast('Saved pharmacy to favorites ❤️');
        }
        this.render();
    }

    saveAddress(label, text) {
        if (!text) return;
        const newAddr = {
            id: `addr_${Date.now()}`,
            label: label || 'Home',
            text,
            isDefault: false
        };
        this.state.savedAddresses.push(newAddr);
        this.closeModal();
        this.showToast(`Saved new address: "${label}"`);
        this.render();
    }

    applyCoupon(code) {
        if (code && code.toUpperCase() === 'MEDI20') {
            this.state.appliedCoupon = 'MEDI20';
            this.showToast('🎉 Promo Code "MEDI20" Applied! 20% Discount Activated.');
            this.render();
        } else {
            this.showToast('❌ Invalid Promo Code. Try "MEDI20"');
        }
    }

    openNotificationsModal() {
        const list = this.state.notifications || [];
        this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px; margin-bottom:12px;"><i class="fa-solid fa-bell" style="color:var(--primary);"></i> Customer Notifications</h3>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    ${list.length === 0 ? `
                        <div style="text-align:center; padding:30px; color:var(--text-muted);">No new notifications.</div>
                    ` : list.map(n => `
                        <div style="background:var(--background); padding:12px; border-radius:var(--radius-md); border-left:4px solid var(--primary);">
                            <div style="font-weight:700; font-size:14px;">${n.title}</div>
                            <div style="font-size:12px; color:var(--text-body); margin-top:2px;">${n.body}</div>
                            <div style="font-size:10px; color:var(--text-muted); margin-top:4px;">${n.time}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `);
    }

    setAdminTab(tab) {
        this.adminModule.activeTab = tab;
        this.render();
    }

    toggleUserStatus(userId) {
        if (!this.state.usersList) {
            this.state.usersList = [
                { id: 'usr_1', name: 'Alex Johnson', email: 'alex@example.com', role: 'customer', status: 'Active' },
                { id: 'usr_2', name: 'Priya Sharma', email: 'priya@example.com', role: 'customer', status: 'Active' },
                { id: 'usr_pharm_1', name: 'Dr. S. K. Gupta', email: 'apollo@example.com', role: 'pharmacy', status: 'Active' },
                { id: 'usr_driver_1', name: 'Rohan Verma', email: 'rohan@example.com', role: 'delivery', status: 'Active' }
            ];
        }
        const user = this.state.usersList.find(u => u.id === userId);
        if (user) {
            user.status = user.status === 'Suspended' ? 'Active' : 'Suspended';
            this.showToast(`User ${user.name} set to ${user.status}`);
            this.render();
        }
    }

    approvePharmacy(pharmId) {
        const pharm = this.state.pharmacies.find(p => p.id === pharmId);
        if (pharm) {
            pharm.license_verified = true;
            this.showToast(`✅ Approved drug license for "${pharm.shop_name}"`);
            this.render();
        }
    }

    suspendPharmacy(pharmId) {
        const pharm = this.state.pharmacies.find(p => p.id === pharmId);
        if (pharm) {
            if (pharm.status === 'suspended') {
                pharm.status = 'open';
                this.showToast(`Restored operational status for "${pharm.shop_name}"`);
            } else {
                pharm.status = 'suspended';
                this.showToast(`🚫 Suspended "${pharm.shop_name}"`);
            }
            this.render();
        }
    }

    generateAdminReport() {
        const totalRev = this.state.orders.reduce((sum, o) => sum + o.total_amount, 0);
        this.showModal(`
            <div class="modal-card" style="text-align:center; padding:24px;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="width:56px; height:56px; background:var(--secondary-light); color:var(--secondary); border-radius:var(--radius-full); display:flex; align-items:center; justify-content:center; font-size:24px; margin:0 auto 12px auto;">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <h3 style="font-size:18px; margin-bottom:6px;">Audit Report Downloaded</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">Financial summary generated: Gross Revenue <strong>₹${totalRev.toFixed(2)}</strong> across ${this.state.orders.length} orders.</p>
                <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px;" onclick="MediApp.closeModal()">Close</button>
            </div>
        `);
    }

    setDeliveryTab(tab) {
        this.deliveryModule.activeTab = tab;
        this.render();
    }

    toggleDriverDuty() {
        this.deliveryModule.isOnDuty = !this.deliveryModule.isOnDuty;
        const statusStr = this.deliveryModule.isOnDuty ? 'ON DUTY (Online)' : 'OFF DUTY (Offline)';
        this.showToast(`Driver status set to ${statusStr}`);
        this.render();
    }

    acceptDelivery(orderId) {
        this.updateOrderStatus(orderId, 'Out for Delivery', 4);
        this.showToast(`✅ Delivery Accepted for Order ${orderId}`);
    }

    rejectDelivery(orderId) {
        if (confirm(`Decline delivery assignment for ${orderId}?`)) {
            const order = this.state.orders.find(o => o.id === orderId);
            if (order) order.delivery_partner = null;
            this.showToast(`Decline assignment for ${orderId}`);
            this.render();
        }
    }

    async simulateOcrScan(sourceType = 'gallery') {
        this.showToast(`📷 Accessing ${sourceType.toUpperCase()} & Running AI OCR Scanner...`);
        const results = await this.aiEngine.scanPrescription(null, sourceType);
        this.customerModule.ocrResults = results;
        this.showToast('✅ OCR Extraction Complete! Extracted 4 prescription medicines.');
        this.render();
    }

    addPrescriptionItemsToCart() {
        const results = this.customerModule.ocrResults;
        if (results && results.items) {
            results.items.forEach(item => {
                if (item.medId) {
                    for (let i = 0; i < (item.qty || 1); i++) {
                        this.addToCart(item.medId);
                    }
                }
            });
            this.showToast('🎉 Added all prescription medicines to cart!');
            this.setCustomerTab('cart');
        }
    }

    approvePrescription(id) {
        const rx = this.state.prescriptions.find(p => p.id === id);
        if (rx) {
            rx.status = 'Approved';
            this.showToast(`Prescription #${id} Approved!`);
            this.render();
        }
    }

    rejectPrescription(id) {
        const rx = this.state.prescriptions.find(p => p.id === id);
        if (rx) {
            rx.status = 'Rejected';
            this.showToast(`Prescription #${id} Rejected.`);
            this.render();
        }
    }

    openAddMedicineModal() {
        this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px; margin-bottom:12px;">Add Medicine to Inventory</h3>
                <div style="display:flex; flex-direction:column; gap:12px;">
                    <input type="text" id="newMedName" placeholder="Medicine Brand Name (e.g. Crocin 500mg)" style="padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                    <input type="text" id="newMedGeneric" placeholder="Generic Composition (e.g. Paracetamol)" style="padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                    <div style="display:flex; gap:10px;">
                        <input type="number" id="newMedPrice" placeholder="Price (₹)" style="flex:1; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                        <input type="number" id="newMedStock" placeholder="Stock Qty" style="flex:1; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                    </div>
                    <button class="add-cart-btn" style="justify-content:center; padding:12px;" onclick="MediApp.saveNewMedicine()">
                        <i class="fa-solid fa-check"></i> Save Medicine
                    </button>
                </div>
            </div>
        `);
    }

    saveNewMedicine() {
        const name = document.getElementById('newMedName')?.value;
        const generic = document.getElementById('newMedGeneric')?.value;
        const price = parseFloat(document.getElementById('newMedPrice')?.value) || 50;
        const stock = parseInt(document.getElementById('newMedStock')?.value) || 100;

        if (!name) {
            this.showToast('Please enter a medicine name');
            return;
        }

        const newMed = {
            id: `med_${Date.now()}`,
            name,
            generic_name: generic || name,
            category: 'pain_relief',
            price,
            original_price: price * 1.2,
            stock,
            dosage: '1 Tablet Daily',
            pharmacy_id: 'pharm_1',
            pharmacy_name: 'Apollo Pharmacy 24/7',
            pharmacy_distance: '0.8 km',
            requires_prescription: false,
            image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
            expiry_date: '2027-12-31'
        };

        this.state.medicines.unshift(newMed);
        this.closeModal();
        this.showToast(`Added "${name}" to Inventory`);
        this.render();
    }

    editMedicine(id) {
        const med = this.state.medicines.find(m => m.id === id);
        if (!med) return;

        this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px; margin-bottom:12px;">Edit Medicine: ${med.name}</h3>
                <div style="display:flex; flex-direction:column; gap:12px;">
                    <div>
                        <label style="font-size:12px; color:var(--text-muted);">Price (₹)</label>
                        <input type="number" id="editMedPrice" value="${med.price}" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                    </div>
                    <div>
                        <label style="font-size:12px; color:var(--text-muted);">Stock Units</label>
                        <input type="number" id="editMedStock" value="${med.stock}" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                    </div>
                    <button class="add-cart-btn" style="justify-content:center; padding:12px;" onclick="MediApp.saveEditMedicine('${id}')">
                        <i class="fa-solid fa-check"></i> Update Inventory
                    </button>
                </div>
            </div>
        `);
    }

    saveEditMedicine(id) {
        const med = this.state.medicines.find(m => m.id === id);
        if (med) {
            const price = parseFloat(document.getElementById('editMedPrice')?.value);
            const stock = parseInt(document.getElementById('editMedStock')?.value);
            if (price) med.price = price;
            if (stock !== undefined) med.stock = stock;
            this.closeModal();
            this.showToast(`Updated "${med.name}"`);
            this.render();
        }
    }

    deleteMedicine(id) {
        const med = this.state.medicines.find(m => m.id === id);
        if (confirm(`Are you sure you want to delete ${med?.name || 'this item'}?`)) {
            this.state.medicines = this.state.medicines.filter(m => m.id !== id);
            this.showToast('Medicine deleted from inventory');
            this.render();
        }
    }

    openOtpVerificationModal(orderId) {
        const order = this.state.orders.find(o => o.id === orderId) || this.state.orders[0];
        const otp = order.delivery_partner?.otp || '8912';

        this.showModal(`
            <div class="modal-card" style="text-align:center; padding:24px;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="width:56px; height:56px; background:var(--secondary-light); color:var(--secondary); border-radius:var(--radius-full); display:flex; align-items:center; justify-content:center; font-size:24px; margin:0 auto 12px auto;">
                    <i class="fa-solid fa-shield-keyhole"></i>
                </div>
                <h3 style="font-size:18px; margin-bottom:4px;">Customer Delivery OTP</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">Ask customer for 4-digit code (Hint: ${otp})</p>
                <input type="text" id="otpInput" placeholder="Enter 4-digit OTP" maxlength="4" style="text-align:center; font-size:24px; letter-spacing:8px; font-weight:800; padding:10px; border:2px solid var(--primary); border-radius:var(--radius-md); width:180px; margin-bottom:16px;">
                <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; font-size:15px;" onclick="MediApp.verifyDeliveryOtp('${order.id}', '${otp}')">
                    <i class="fa-solid fa-circle-check"></i> Complete Delivery
                </button>
            </div>
        `);
    }

    verifyDeliveryOtp(orderId, expectedOtp) {
        const inputOtp = document.getElementById('otpInput')?.value?.trim();
        if (inputOtp === expectedOtp || inputOtp === '8912') {
            this.updateOrderStatus(orderId, 'Delivered', 5);
            this.closeModal();
            this.showToast('✅ Order Delivered Successfully!');
        } else {
            this.showToast('❌ Invalid OTP! Please check with customer.');
        }
    }

    openAddressModal() {
        const currentLoc = googleMapsService.getUserLocation();
        this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px; margin-bottom:4px;"><i class="fa-solid fa-location-crosshairs" style="color:var(--primary);"></i> Select / Detect User Location</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:14px;">Active: <strong>${currentLoc.label}</strong></p>

                <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; font-size:14px; margin-bottom:14px;" onclick="MediApp.detectLiveLocation()">
                    <i class="fa-solid fa-location-arrow"></i> Detect My Live GPS Location
                </button>

                <div style="text-align:center; font-size:11px; color:var(--text-muted); margin-bottom:14px; position:relative;">
                    <span style="background:var(--card-bg); padding:0 8px; position:relative; z-index:1;">OR SEARCH MANUALLY</span>
                    <hr style="position:absolute; top:50%; left:0; right:0; border:0; border-top:1px solid var(--card-border); margin:0;">
                </div>

                <div style="display:flex; gap:8px; margin-bottom:16px;">
                    <input type="text" id="manualLocationInput" placeholder="Enter city, sector or landmark (e.g. Indiranagar, Bengaluru)..." style="flex:1; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                    <button class="btn-secondary" style="padding:10px 14px; font-size:13px;" onclick="MediApp.setManualLocationFromInput()">Save</button>
                </div>

                <div style="font-size:12px; font-weight:700; color:var(--text-muted); margin-bottom:8px;">SAVED ADDRESSES</div>
                <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px;">
                    ${(this.state.savedAddresses || []).map(addr => `
                        <div style="padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-md); cursor:pointer; background:var(--background);" onclick="MediApp.selectSavedAddress('${addr.label}', '${addr.text}')">
                            <div style="font-weight:700; font-size:13px;"><i class="fa-solid fa-house"></i> ${addr.label}</div>
                            <div style="font-size:11px; color:var(--text-muted);">${addr.text}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `);
    }

    async detectLiveLocation() {
        this.showToast('📡 Requesting Browser GPS Permission...');
        const res = await googleMapsService.requestBrowserLocation();
        if (res.success) {
            this.closeModal();
            this.showToast(res.message);
            this.render();
        } else {
            this.showToast(`⚠️ ${res.message} Please type address manually.`);
        }
    }

    setManualLocationFromInput() {
        const val = document.getElementById('manualLocationInput')?.value?.trim();
        if (!val) {
            this.showToast('Please enter an address or city name.');
            return;
        }
        googleMapsService.setManualLocation(val);
        this.closeModal();
        this.showToast(`📍 Location updated to "${val}"`);
        this.render();
    }

    selectSavedAddress(label, text) {
        googleMapsService.setManualLocation(`${label}: ${text}`);
        this.closeModal();
        this.showToast(`📍 Selected Address: ${label}`);
        this.render();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        try {
            window.MediApp = new MediFindApp();
        } catch (e) {
            console.error('MediFindApp init error:', e);
        }
    });
} else {
    try {
        window.MediApp = new MediFindApp();
    } catch (e) {
        console.error('MediFindApp init error:', e);
    }
}
