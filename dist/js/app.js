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
import { googleMapsService } from './maps.js';
import { SocketClient } from './socket.js';

export class MediFindApp {
    constructor() {
        this.authService = new AuthService(this);
        this.realtimeEngine = new RealtimeEngine(this);
        this.paymentService = new PaymentService(this);
        this.fcmService = new FcmService(this);
        this.socketClient = new SocketClient(this);

        this.state = {
            currentRole: 'customer', // customer, pharmacy, delivery, admin
            customerTab: 'home',     // home, search, pharmacies, pharmacy-detail, medicine-detail, prescription, cart, orders, profile
            pharmacyTab: 'dashboard',
            darkMode: false,
            medicines: [...MOCK_MEDICINES],
            pharmacies: [...MOCK_PHARMACIES],
            orders: [...MOCK_ORDERS],
            usersList: [],
            cart: [],
            prescriptions: [],
            appliedCoupon: null,
            favoritePharmacies: [],
            savedAddresses: [],
            notifications: []
        };

        this.customerModule = new CustomerModule(this);
        this.pharmacyModule = new PharmacyModule(this);
        this.deliveryModule = new DeliveryModule(this);
        this.adminModule = new AdminModule(this);
        this.aiEngine = new AiEngine(this);

        this.mapPickerState = null;
        this.init();
    }

    clearLocalOrderStorage() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(k => {
                if (k.startsWith('medifind_user_orders_') || k === 'medifind_global_orders_backup' || k.includes('orders')) {
                    localStorage.removeItem(k);
                }
            });
        } catch (e) {}
    }

    saveOrdersToStorage() {
        try {
            const currentUser = this.authService ? this.authService.getUser() : null;
            const storageKey = currentUser ? `medifind_user_orders_${currentUser.id}` : 'medifind_user_orders_guest';
            localStorage.setItem(storageKey, JSON.stringify(this.state.orders));
            localStorage.setItem('medifind_global_orders_backup', JSON.stringify(this.state.orders));
        } catch (e) {
            console.warn('[Orders Persistence] Error saving to localStorage:', e);
        }
    }

    async resetAdminOrdersAndRevenue() {
        if (!confirm('Are you sure you want to reset all platform orders and revenue to ₹0?')) return;
        try {
            const res = await fetch('/api/orders/reset', { method: 'POST' });
            const data = await res.json();
            this.clearLocalOrderStorage();
            this.state.orders = [];
            this.saveOrdersToStorage();
            this.showToast('🧹 All Platform Orders & Revenue Reset to ₹0');
            this.render();
        } catch (err) {
            console.error('Reset orders error:', err);
            this.clearLocalOrderStorage();
            this.state.orders = [];
            this.render();
        }
    }

    async loadSavedOrders(skipRenderIfModalOpen = false) {
        const currentUser = this.authService ? this.authService.getUser() : null;
        const currentRole = this.state.currentRole;
        const keysToTry = [
            currentUser ? `medifind_user_orders_${currentUser.id}` : null,
            'medifind_user_orders_guest',
            'medifind_global_orders_backup'
        ].filter(Boolean);

        const orderMap = new Map();

        // 1. Recover orders from local storage keys
        for (const key of keysToTry) {
            try {
                const localData = localStorage.getItem(key);
                if (localData && localData !== 'undefined') {
                    const parsed = JSON.parse(localData);
                    if (Array.isArray(parsed)) {
                        parsed.forEach(o => { if (o && o.id) orderMap.set(o.id, o); });
                    }
                }
            } catch (e) {}
        }

        // 2. Sync with remote API backend as authoritative source
        if (this.authService && this.authService.api) {
            try {
                const remoteOrders = await this.authService.api.fetchUserOrders();
                if (Array.isArray(remoteOrders)) {
                    if (remoteOrders.length === 0 && currentRole === 'admin') {
                        orderMap.clear();
                        this.clearLocalOrderStorage();
                    } else {
                        remoteOrders.forEach(o => { if (o && o.id) orderMap.set(o.id, o); });
                    }
                }
            } catch (err) {
                console.warn('[Orders Persistence] Remote order sync note:', err);
            }
        }

        let allOrders = Array.from(orderMap.values());
        allOrders.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

        if (currentRole === 'customer' && currentUser) {
            const userEmail = (currentUser.email || '').toLowerCase();
            const userName = (currentUser.name || '').toLowerCase();
            const userId = String(currentUser.id || '');

            const filtered = allOrders.filter(o => {
                if (!o) return false;
                const oUserId = String(o.user_id || '');
                const oCustId = String(o.customer_id || '');
                const oEmail = (o.customer_email || '').toLowerCase();
                const oName = (o.customer_name || '').toLowerCase();

                return (
                    (userId && (oUserId === userId || oCustId === userId)) ||
                    (userEmail && oEmail && oEmail === userEmail) ||
                    (userName && oName && oName === userName) ||
                    oUserId.startsWith('usr_guest_')
                );
            });

            this.state.orders = (filtered.length > 0) ? filtered : allOrders;
        } else {
            this.state.orders = allOrders;
        }

        this.saveOrdersToStorage();
        if (!skipRenderIfModalOpen || !this.isModalOpen()) {
            this.render();
        }
    }

    async loadAllUsers(skipRenderIfModalOpen = false) {
        if (this.authService && this.authService.api) {
            try {
                const users = await this.authService.api.fetchAllUsers();
                if (Array.isArray(users) && users.length > 0) {
                    this.state.usersList = users;
                    if (!skipRenderIfModalOpen || !this.isModalOpen()) {
                        this.render();
                    }
                }
            } catch (err) {
                console.warn('[Users Fetch Note]:', err);
            }
        }
    }

    syncMedicinesToFirestore() {
        try {
            if (window.firestoreDb && this.state && this.state.medicines) {
                window.firestoreDb.collections.Medicines.clear();
                this.state.medicines.forEach(m => window.firestoreDb.collections.Medicines.set(m.id, m));
            }
        } catch (e) {
            console.warn('[Firestore Sync Note]', e);
        }
    }

    saveMedicinesToStorage() {
        try {
            localStorage.setItem('medifind_medicines_catalog', JSON.stringify(this.state.medicines));
            if (typeof this.syncMedicinesToFirestore === 'function') {
                this.syncMedicinesToFirestore();
            }
        } catch (e) {
            console.warn('[Medicines Persistence] Error saving to localStorage:', e);
        }
    }

    async loadSavedMedicines() {
        // 1. Instant recovery of price changes & catalog updates from local storage on refresh
        try {
            const localData = localStorage.getItem('medifind_medicines_catalog');
            if (localData) {
                const parsed = JSON.parse(localData);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    this.state.medicines = parsed;
                    const localMap = new Map(parsed.map(m => [m.id, m]));
                    MOCK_MEDICINES.forEach(mockMed => {
                        if (localMap.has(mockMed.id)) {
                            const updated = localMap.get(mockMed.id);
                            mockMed.price = updated.price;
                            mockMed.stock = updated.stock;
                        }
                    });
                }
            }
        } catch (e) {
            console.warn('[Medicines Persistence] Error reading local storage:', e);
        }

        // 2. Sync with backend REST API
        try {
            const res = await fetch('/api/medicines');
            if (res.ok) {
                const data = await res.json();
                if (data && data.success && Array.isArray(data.medicines) && data.medicines.length > 0) {
                    const localMap = new Map(this.state.medicines.map(m => [m.id, m]));
                    for (const remoteMed of data.medicines) {
                        if (localMap.has(remoteMed.id)) {
                            const localMed = localMap.get(remoteMed.id);
                            localMed.price = remoteMed.price;
                            localMed.stock = remoteMed.stock;
                        } else {
                            this.state.medicines.push(remoteMed);
                        }

                        const mockMed = MOCK_MEDICINES.find(m => m.id === remoteMed.id);
                        if (mockMed) {
                            mockMed.price = remoteMed.price;
                            mockMed.stock = remoteMed.stock;
                        }
                    }
                    this.saveMedicinesToStorage();
                    this.render();
                }
            }
        } catch (err) {
            console.warn('[Medicines Persistence] Remote fetch note:', err);
        }
    }

    async init() {
        window.MediApp = this;
        this.state.cart = [];
        this.state.orders = [];
        this.clearLocalOrderStorage();

        // Always start on Landing Page on fresh page reload or initial site open
        sessionStorage.removeItem('medifind_current_role');
        sessionStorage.removeItem('medifind_admin_tab');
        this.state.currentRole = 'auth';
        this.state.authMode = 'landing';

        // 2. Load orders, medicines, and users with established user & role context
        await Promise.all([
            this.loadSavedOrders(),
            this.loadSavedMedicines(),
            this.loadAllUsers()
        ]);

        // Auto-detect real browser GPS location on startup
        if (navigator.geolocation) {
            googleMapsService.requestBrowserLocation().then(res => {
                this.render();
            });
        }

        // Enable position watcher for real-time updates when moving
        googleMapsService.startWatchPosition();

        this.showSplashScreen();
        this.render();
        this.initAndroidBackButton();
        this.showToast('MediFind Application Ready 🏥');
    }

    initAndroidBackButton() {
        if (window.Capacitor && window.Capacitor.isPluginAvailable && window.Capacitor.isPluginAvailable('App')) {
            const App = window.Capacitor.Plugins ? window.Capacitor.Plugins.App : null;
            if (App) {
                App.addListener('backButton', () => {
                    if (this.activeModal) {
                        this.closeModal();
                    } else if (this.state.customerTab !== 'home') {
                        this.setCustomerTab('home');
                    } else {
                        App.exitApp();
                    }
                });
            }
        }

        if (typeof window !== 'undefined' && window.addEventListener) {
            window.addEventListener('offline', () => {
                this.showModal(`
                    <div class="modal-card" style="max-width:380px; padding:24px; text-align:center;">
                        <div style="font-size:44px; color:var(--emergency-red); margin-bottom:12px;"><i class="fa-solid fa-wifi"></i></div>
                        <h3 style="font-size:18px; margin-bottom:6px;">No Internet Connection</h3>
                        <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">MediFind requires an internet connection to load live pharmacies and medicines.</p>
                        <button class="add-cart-btn" style="width:100%; justify-content:center;" onclick="window.location.reload()">
                            <i class="fa-solid fa-rotate-right"></i> Retry
                        </button>
                    </div>
                `);
            });
        }
    }

    showSplashScreen() {
        if (sessionStorage.getItem('medifind_splash_shown')) return;
        sessionStorage.setItem('medifind_splash_shown', 'true');

        const splash = document.createElement('div');
        splash.className = 'splash-screen';
        splash.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:linear-gradient(135deg, #0b1329 0%, #0f172a 100%); display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:999999; transition:opacity 0.4s ease, visibility 0.4s ease; color:white;';
        splash.innerHTML = `
            <div class="splash-logo" style="width:72px; height:72px; background:linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:32px; color:white; margin-bottom:16px; box-shadow:0 0 30px rgba(14,165,233,0.4);">
                <i class="fa-solid fa-notes-medical"></i>
            </div>
            <h1 style="font-size:28px; font-weight:800; color:white; margin-bottom:4px; font-family:sans-serif;">MediFind</h1>
            <p style="font-size:13px; color:#94a3b8; font-weight:600; text-align:center; max-width:280px; margin:0 auto; font-family:sans-serif;">
                Find Medicines. Find Pharmacies. Get Care Faster.
            </p>
            <div style="margin-top:24px; width:32px; height:32px; border:3px solid rgba(255,255,255,0.2); border-top-color:#0ea5e9; border-radius:50%; animation:spin 0.8s linear infinite;"></div>
        `;
        document.body.appendChild(splash);

        setTimeout(() => {
            splash.style.opacity = '0';
            splash.style.visibility = 'hidden';
            setTimeout(() => { try { splash.remove(); } catch(e){} }, 400);
        }, 1000);
    }

    isModalOpen() {
        const container = document.getElementById('modalContainer');
        return container && container.children.length > 0 && container.innerHTML.trim() !== '';
    }

    render() {
        const root = document.getElementById('app');
        if (!root) return;

        // Save active focused element and selection range
        const activeEl = document.activeElement;
        const focusedId = (activeEl && activeEl.id) ? activeEl.id : null;
        let selectionStart = null;
        let selectionEnd = null;

        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
            try {
                selectionStart = activeEl.selectionStart;
                selectionEnd = activeEl.selectionEnd;
            } catch (e) {}
        }

        // Sync live input values to DOM value attributes inside modalContainer so innerHTML captures them
        const modalContainer = document.getElementById('modalContainer');
        if (modalContainer) {
            modalContainer.querySelectorAll('input, select, textarea').forEach(el => {
                el.setAttribute('value', el.value);
            });
        }

        const existingModal = modalContainer?.innerHTML || '';
        const existingToasts = document.getElementById('toastContainer')?.innerHTML || '';

        let contentHtml = '';

        if (this.state.currentRole === 'auth') {
            contentHtml = this.authService.renderLoginPage();
        } else if (this.state.currentRole === 'admin') {
            contentHtml = this.adminModule.render();
        } else if (this.state.currentRole === 'pharmacy') {
            contentHtml = this.pharmacyModule.render();
        } else if (this.state.currentRole === 'delivery') {
            contentHtml = this.deliveryModule.render();
        } else {
            contentHtml = this.customerModule.render();
        }

        root.innerHTML = `
            ${contentHtml}
            <div id="modalContainer">${existingModal}</div>
            <div id="toastContainer" class="toast-container">${existingToasts}</div>
        `;

        // Restore focus and cursor selection if user was typing
        if (focusedId) {
            const restoredEl = document.getElementById(focusedId);
            if (restoredEl) {
                restoredEl.focus();
                if (selectionStart !== null && selectionEnd !== null && (restoredEl.tagName === 'INPUT' || restoredEl.tagName === 'TEXTAREA')) {
                    try {
                        restoredEl.setSelectionRange(selectionStart, selectionEnd);
                    } catch (e) {}
                }
            }
        }

        setTimeout(() => {
            if (this.state.customerTab === 'pharmacies') {
                googleMapsService.renderMapCanvas('nearbyPharmaciesMapCanvas');
            }
            if (this.state.currentRole === 'auth' && this.state.authMode === 'signup') {
                this.autoDetectSignupLocation();
            }
        }, 100);
    }

    async setAdminTab(tab) {
        if (this.adminModule) {
            this.adminModule.activeTab = tab;
            sessionStorage.setItem('medifind_admin_tab', tab);
        }
        sessionStorage.setItem('medifind_current_role', 'admin');
        await Promise.all([this.loadSavedOrders(), this.loadAllUsers()]);
        this.startAdminLivePolling();
        this.render();
        setTimeout(() => {
            if (this.adminModule && this.adminModule.initCharts) {
                this.adminModule.initCharts();
            }
        }, 100);
    }

    startAdminLivePolling() {
        if (this._adminPollTimer) return;
        this._adminPollTimer = setInterval(async () => {
            if (this.state && this.state.currentRole === 'admin') {
                await Promise.all([this.loadSavedOrders(true), this.loadAllUsers(true)]);
            }
        }, 5000);
    }

    async handleAdminLoginFormSubmit(form) {
        const email = document.getElementById('adminAuthEmail')?.value?.trim();
        const password = document.getElementById('adminAuthPassword')?.value?.trim();
        const errorBanner = document.getElementById('adminAuthErrorBanner');

        if (!email || !password) return;

        let res = await this.authService.login(email, password, true);

        if (res.success) {
            const userRole = (res.user && res.user.role) ? res.user.role : '';
            const userEmail = (res.user && res.user.email) ? res.user.email.toLowerCase() : '';

            // Reject any customer account attempting to access Admin Control Panel
            if (userRole !== 'admin' && userEmail !== 'admin@medifind.com') {
                if (errorBanner) {
                    errorBanner.style.display = 'block';
                    errorBanner.innerText = 'Access Denied: Only administrator accounts can access the Admin Portal.';
                }
                return;
            }

            this.state.currentRole = 'admin';
            sessionStorage.setItem('medifind_current_role', 'admin');
            sessionStorage.setItem('medifind_admin_tab', 'medicines');
            this.authService.setCurrentUser(res.user, true);
            this.showToast('🛡️ Admin Control Panel Access Granted');
            await Promise.all([this.loadAllUsers(), this.loadSavedOrders()]);
            this.startAdminLivePolling();
            this.render();
            setTimeout(() => {
                if (this.adminModule && this.adminModule.initCharts) {
                    this.adminModule.initCharts();
                }
            }, 100);
        } else {
            if (errorBanner) {
                errorBanner.style.display = 'block';
                errorBanner.innerText = res.message || 'Invalid administrator credentials.';
            }
        }
    }

    async fetchRealtimeAdminUsers() {
        try {
            const res = await fetch('/api/auth/users');
            if (res.ok) {
                const data = await res.json();
                if (data && data.success && Array.isArray(data.users)) {
                    this.state.usersList = data.users;
                }
            }

            // Sync orders as well
            const ordRes = await fetch('/api/orders');
            if (ordRes.ok) {
                const ordData = await ordRes.json();
                if (ordData && ordData.success && Array.isArray(ordData.orders)) {
                    this.state.orders = ordData.orders;
                }
            }

            this.render();
        } catch (e) {
            console.warn('[Admin Live Sync Warning]:', e);
        }
    }

    viewUserOrdersModal(userId, userName) {
        const allOrders = this.state.orders || [];
        const userOrders = allOrders.filter(o => o.user_id === userId || (o.customer_name && userName && o.customer_name.toLowerCase() === userName.toLowerCase()));

        this.showModal(`
            <div class="modal-card" style="max-width:600px;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px;">
                    <div style="width:44px; height:44px; background:var(--primary-light); color:var(--primary); border-radius:var(--radius-full); display:flex; align-items:center; justify-content:center; font-size:20px;">
                        <i class="fa-solid fa-user-gear"></i>
                    </div>
                    <div>
                        <h3 style="font-size:18px; margin:0;">Real-Time Orders for ${userName}</h3>
                        <p style="font-size:12px; color:var(--text-muted); margin:0;">User ID: ${userId} • ${userOrders.length} Total Orders Placed</p>
                    </div>
                </div>

                ${userOrders.length === 0 ? `
                    <div style="text-align:center; padding:30px; background:var(--background); border-radius:var(--radius-md);">
                        <i class="fa-solid fa-box-open" style="font-size:32px; color:var(--text-muted); margin-bottom:8px;"></i>
                        <p style="font-size:13px; color:var(--text-muted);">No orders placed yet by this user.</p>
                    </div>
                ` : `
                    <div style="display:flex; flex-direction:column; gap:12px; max-height:400px; overflow-y:auto; padding-right:4px;">
                        ${userOrders.map(o => `
                            <div style="background:var(--background); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:14px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                                    <strong style="color:var(--primary); font-size:14px;">${o.id}</strong>
                                    <span class="role-badge-btn" style="font-size:10px;">${o.order_status}</span>
                                </div>
                                <div style="font-size:12px; color:var(--text-main); margin-bottom:4px;">
                                    <strong>Pharmacy:</strong> ${o.pharmacy_name || 'Apollo Pharmacy 24/7'}
                                </div>
                                <div style="font-size:12px; color:var(--text-muted); margin-bottom:6px;">
                                    <strong>Items:</strong> ${(o.items || []).map(it => `${it.quantity || 1}x ${it.name}`).join(', ')}
                                </div>
                                <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; border-top:1px dashed var(--card-border); padding-top:6px;">
                                    <span style="color:var(--text-muted);">Payment: <strong>${o.payment_method || 'UPI'} (${o.payment_status})</strong></span>
                                    <strong style="color:var(--secondary); font-size:14px;">₹${(o.total_amount || 0).toFixed(2)}</strong>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
                <button class="btn-secondary" style="width:100%; justify-content:center; margin-top:16px;" onclick="MediApp.closeModal()">Close</button>
            </div>
        `);
    }

    openAddMedicineModal() {
        this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px; margin-bottom:14px;"><i class="fa-solid fa-pills" style="color:var(--primary);"></i> Add New Medicine to Catalog</h3>
                <form onsubmit="event.preventDefault(); MediApp.handleAddMedicineSubmit(this);">
                    <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:16px;">
                        <div>
                            <label style="font-size:11px; font-weight:700; display:block; margin-bottom:2px;">MEDICINE BRAND NAME *</label>
                            <input type="text" id="adminMedName" placeholder="e.g. Dolo 650 Tablet" required style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                        </div>
                        <div style="display:flex; gap:8px;">
                            <div style="flex:1;">
                                <label style="font-size:11px; font-weight:700; display:block; margin-bottom:2px;">GENERIC NAME</label>
                                <input type="text" id="adminMedGeneric" placeholder="Paracetamol 650mg" style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>
                            <div style="flex:1;">
                                <label style="font-size:11px; font-weight:700; display:block; margin-bottom:2px;">CATEGORY</label>
                                <select id="adminMedCategory" style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                                    <option value="pain-relief">Pain Relief</option>
                                    <option value="antibiotics">Antibiotics</option>
                                    <option value="first-aid">First Aid</option>
                                    <option value="vitamins">Vitamins & Supplements</option>
                                    <option value="cardiac">Cardiac & BP</option>
                                </select>
                            </div>
                        </div>
                        <div style="display:flex; gap:8px;">
                            <div style="flex:1;">
                                <label style="font-size:11px; font-weight:700; display:block; margin-bottom:2px;">UNIT PRICE (₹) *</label>
                                <input type="number" step="0.5" id="adminMedPrice" placeholder="30.00" required style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>
                            <div style="flex:1;">
                                <label style="font-size:11px; font-weight:700; display:block; margin-bottom:2px;">STOCK UNITS *</label>
                                <input type="number" id="adminMedStock" placeholder="100" required style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="add-cart-btn" style="width:100%; justify-content:center; padding:10px; font-size:14px;">
                        <i class="fa-solid fa-plus"></i> Save Medicine to Catalog
                    </button>
                </form>
            </div>
        `);
    }

    async handleAddMedicineSubmit() {
        const name = document.getElementById('adminMedName')?.value?.trim();
        const generic_name = document.getElementById('adminMedGeneric')?.value?.trim() || name;
        const category = document.getElementById('adminMedCategory')?.value || 'general';
        const price = parseFloat(document.getElementById('adminMedPrice')?.value || '0');
        const stock = parseInt(document.getElementById('adminMedStock')?.value || '50');

        if (!name || !price) return;

        const newMed = {
            id: `med_${Date.now()}`,
            name,
            generic_name,
            category,
            price,
            stock,
            dosage: 'Standard Dosage',
            pharmacy_id: 'pharm_1',
            pharmacy_name: 'Apollo Pharmacy 24/7',
            requires_prescription: false,
            image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'
        };

        this.state.medicines.unshift(newMed);
        this.saveMedicinesToStorage();
        this.closeModal();
        this.showToast(`✅ Added ${name} to Catalog!`);

        try {
            const token = localStorage.getItem('medifind_auth_token') || localStorage.getItem('medifind_jwt_token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            await fetch('/api/medicines', {
                method: 'POST',
                headers,
                body: JSON.stringify(newMed)
            });
        } catch (e) {
            console.warn('[Admin Add Medicine] API note:', e);
        }

        this.render();
    }

    openEditMedicinePriceModal(medId) {
        const med = this.state.medicines.find(m => m.id === medId);
        if (!med) return;

        this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px; margin-bottom:14px;"><i class="fa-solid fa-pen-to-square" style="color:var(--primary);"></i> Update Medicine Price & Stock</h3>
                <div style="background:var(--background); padding:10px; border-radius:var(--radius-sm); margin-bottom:14px; font-size:13px;">
                    <strong>${med.name}</strong><br>
                    <span style="font-size:11px; color:var(--text-muted);">${med.generic_name} • Store: Nazarathpet Medicine Supply Store</span>
                </div>
                <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:16px;">
                    <div>
                        <label style="font-size:11px; font-weight:700; display:block; margin-bottom:2px;">NEW UNIT PRICE (₹) *</label>
                        <input type="number" step="0.5" id="editMedPrice" value="${med.price}" oninput="this.setAttribute('value', this.value)" style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:14px; font-weight:700; color:var(--secondary);">
                    </div>
                    <div>
                        <label style="font-size:11px; font-weight:700; display:block; margin-bottom:2px;">NEW STOCK UNITS *</label>
                        <input type="number" id="editMedStock" value="${med.stock}" oninput="this.setAttribute('value', this.value)" style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                    </div>
                </div>
                <button type="button" class="add-cart-btn" style="width:100%; justify-content:center; padding:10px; font-size:14px;" onclick="MediApp.handleUpdateMedicinePriceSubmit('${med.id}')">
                    <i class="fa-solid fa-floppy-disk"></i> Update Price & Stock
                </button>
            </div>
        `);
    }

    async handleUpdateMedicinePriceSubmit(medId) {
        const priceVal = parseFloat(document.getElementById('editMedPrice')?.value || '0');
        const stockVal = parseInt(document.getElementById('editMedStock')?.value || '0', 10);

        if (isNaN(priceVal) || priceVal < 0) return;
        if (isNaN(stockVal) || stockVal < 0) return;

        const med = this.state.medicines.find(m => m.id === medId);
        if (med) {
            med.price = priceVal;
            med.stock = stockVal;
        }

        const mockMed = MOCK_MEDICINES.find(m => m.id === medId);
        if (mockMed) {
            mockMed.price = priceVal;
            mockMed.stock = stockVal;
        }

        // Sync price in active cart items
        (this.state.cart || []).forEach(item => {
            if (item.id === medId) {
                item.price = priceVal;
            }
        });

        this.saveMedicinesToStorage();

        // Socket IO Realtime Emission to all connected customer clients
        if (this.socketClient && this.socketClient.socket) {
            this.socketClient.socket.emit('medicine_updated', { id: medId, price: priceVal, stock: stockVal, medicine: med });
        }
        if (this.realtimeEngine && this.realtimeEngine.socket) {
            this.realtimeEngine.socket.emit('medicine_updated', { id: medId, price: priceVal, stock: stockVal, medicine: med });
        }

        // Ensure active role and admin tab remain on Medicines tab
        this.state.currentRole = 'admin';
        sessionStorage.setItem('medifind_current_role', 'admin');
        if (this.adminModule) {
            this.adminModule.activeTab = 'medicines';
            sessionStorage.setItem('medifind_admin_tab', 'medicines');
        }

        this.closeModal();

        try {
            const token = localStorage.getItem('medifind_auth_token') || localStorage.getItem('medifind_jwt_token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            await fetch(`/api/medicines/${medId}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ price: priceVal, stock: stockVal })
            });
        } catch (e) {
            console.warn('[Admin Update Medicine] API note:', e);
        }

        this.render();
        this.showToast(`✅ Price updated to ₹${priceVal.toFixed(2)}`);
    }

    async deleteMedicine(medId) {
        const med = this.state.medicines.find(m => m.id === medId);
        if (!confirm(`Are you sure you want to delete "${med ? med.name : 'this medicine'}" from the catalog?`)) {
            return;
        }

        this.state.medicines = this.state.medicines.filter(m => m.id !== medId);
        this.saveMedicinesToStorage();
        this.showToast('🗑️ Medicine removed from catalog');

        try {
            const token = localStorage.getItem('medifind_auth_token') || localStorage.getItem('medifind_jwt_token');
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            await fetch(`/api/medicines/${medId}`, { method: 'DELETE', headers });
        } catch (e) {
            console.warn('[Admin Delete Medicine] API note:', e);
        }

        this.render();
    }

    openAddPharmacyModal() {
        this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px; margin-bottom:14px;"><i class="fa-solid fa-store" style="color:var(--warning-amber);"></i> Register New Pharmacy Store</h3>
                <form onsubmit="event.preventDefault(); MediApp.handleAddPharmacySubmit();">
                    <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:16px;">
                        <div>
                            <label style="font-size:11px; font-weight:700; display:block; margin-bottom:2px;">PHARMACY SHOP NAME *</label>
                            <input type="text" id="adminPharmName" placeholder="e.g. MedPlus Pharmacy" required style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                        </div>
                        <div style="display:flex; gap:8px;">
                            <div style="flex:1;">
                                <label style="font-size:11px; font-weight:700; display:block; margin-bottom:2px;">OWNER NAME</label>
                                <input type="text" id="adminPharmOwner" placeholder="Rajesh Kumar" style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>
                            <div style="flex:1;">
                                <label style="font-size:11px; font-weight:700; display:block; margin-bottom:2px;">DRUG LICENSE NO. *</label>
                                <input type="text" id="adminPharmLicense" placeholder="DL-2026-98765" required style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>
                        </div>
                        <div>
                            <label style="font-size:11px; font-weight:700; display:block; margin-bottom:2px;">STORE ADDRESS *</label>
                            <input type="text" id="adminPharmAddress" placeholder="Main Market Road, Noida" required style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                        </div>
                    </div>
                    <button type="submit" class="add-cart-btn" style="width:100%; justify-content:center; padding:10px; font-size:14px;">
                        <i class="fa-solid fa-plus"></i> Register Pharmacy Store
                    </button>
                </form>
            </div>
        `);
    }

    async handleAddPharmacySubmit() {
        const shop_name = document.getElementById('adminPharmName')?.value?.trim();
        const owner_name = document.getElementById('adminPharmOwner')?.value?.trim() || 'Verified Owner';
        const license_number = document.getElementById('adminPharmLicense')?.value?.trim();
        const address = document.getElementById('adminPharmAddress')?.value?.trim();

        if (!shop_name || !license_number) return;

        const newPharm = {
            id: `pharm_${Date.now()}`,
            shop_name,
            owner_name,
            license_number,
            address: address || 'Main Road',
            phone: '+91 98765 00000',
            rating: 4.9,
            status: 'open',
            license_verified: true,
            logo: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=150&auto=format&fit=crop&q=80'
        };

        this.state.pharmacies.unshift(newPharm);
        this.closeModal();
        this.showToast(`✅ Registered ${shop_name}!`);

        try {
            await fetch('/api/pharmacies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPharm)
            });
        } catch (e) {
            console.warn('[Admin Add Pharmacy] API note:', e);
        }

        this.render();
    }

    async deletePharmacy(pharmId) {
        const pharm = this.state.pharmacies.find(p => p.id === pharmId);
        if (!confirm(`Are you sure you want to delete pharmacy store "${pharm ? pharm.shop_name : 'this store'}"?`)) {
            return;
        }

        this.state.pharmacies = this.state.pharmacies.filter(p => p.id !== pharmId);
        this.showToast('🗑️ Pharmacy store removed');

        try {
            await fetch(`/api/pharmacies/${pharmId}`, { method: 'DELETE' });
        } catch (e) {
            console.warn('[Admin Delete Pharmacy] API note:', e);
        }

        this.render();
    }

    // Location & Pharmacy Actions
    async detectLiveLocation() {
        this.showToast('📍 Detecting your location via GPS...');
        const res = await googleMapsService.requestBrowserLocation();
        if (res.success) {
            this.showToast(`📍 Location Detected: ${res.location.label}`);
        } else {
            this.showToast(`⚠️ ${res.message}`);
        }
        this.render();
    }

    autoDetectSignupLocation() {
        if (this._signupLocAutoDetected) return;
        this._signupLocAutoDetected = true;
        this.detectSignupLocation();
    }

    updateSignupFullAddress() {
        const house = document.getElementById('signupHouseNumber')?.value?.trim();
        const street = document.getElementById('signupStreet')?.value?.trim();
        const city = document.getElementById('signupCity')?.value?.trim();
        const state = document.getElementById('signupState')?.value?.trim();
        const pin = document.getElementById('signupPincode')?.value?.trim();
        const fullInput = document.getElementById('signupAddress');

        if (fullInput) {
            const parts = [house, street, city, state, pin ? `PIN ${pin}` : ''].filter(Boolean);
            if (parts.length > 0) {
                fullInput.value = parts.join(', ');
                fullInput.dispatchEvent(new Event('input', { bubbles: true }));
                fullInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    }

    async detectSignupLocation() {
        const statusBanner = document.getElementById('signupLocStatus');
        const houseInput = document.getElementById('signupHouseNumber');
        const streetInput = document.getElementById('signupStreet');
        const cityInput = document.getElementById('signupCity');
        const stateInput = document.getElementById('signupState');
        const pinInput = document.getElementById('signupPincode');
        const fullAddrInput = document.getElementById('signupAddress');
        const latInput = document.getElementById('signupLat');
        const lngInput = document.getElementById('signupLng');

        if (statusBanner) {
            statusBanner.style.display = 'block';
            statusBanner.style.background = 'var(--primary-light)';
            statusBanner.style.color = 'var(--primary)';
            statusBanner.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Detecting your location...`;
        }

        let lat = null;
        let lng = null;

        const getGpsPosition = () => new Promise((resolve, reject) => {
            if (!navigator.geolocation) return reject(new Error('Geolocation unsupported'));
            let resolved = false;
            const timer = setTimeout(() => {
                if (!resolved) {
                    // Fast low-accuracy fallback if high accuracy takes > 10 seconds
                    navigator.geolocation.getCurrentPosition(
                        pos => { if (!resolved) { resolved = true; resolve(pos); } },
                        err => { if (!resolved) { resolved = true; reject(err); } },
                        { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
                    );
                }
            }, 10000);

            navigator.geolocation.getCurrentPosition(
                pos => {
                    if (!resolved) {
                        resolved = true;
                        clearTimeout(timer);
                        resolve(pos);
                    }
                },
                err => {
                    if (!resolved) {
                        // Attempt low accuracy cell/wifi positioning before rejecting
                        navigator.geolocation.getCurrentPosition(
                            pos => { if (!resolved) { resolved = true; clearTimeout(timer); resolve(pos); } },
                            lowErr => { if (!resolved) { resolved = true; clearTimeout(timer); reject(err); } },
                            { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
                        );
                    }
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        });

        try {
            const position = await getGpsPosition();
            lat = position.coords.latitude;
            lng = position.coords.longitude;
        } catch (gpsError) {
            console.warn('[Signup Geolocation GPS Warning]:', gpsError);
            try {
                const ipRes = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client');
                if (ipRes.ok) {
                    const ipData = await ipRes.json();
                    lat = ipData.latitude;
                    lng = ipData.longitude;
                }
            } catch (ipErr) {
                console.warn('[Signup Geolocation IP Warning]:', ipErr);
            }
        }

        if (!lat || !lng) {
            lat = 13.0827;
            lng = 80.2707;
        }

        if (latInput) latInput.value = lat;
        if (lngInput) lngInput.value = lng;

        let detectedHouseNumber = '';
        let detectedStreet = '';
        let detectedCity = '';
        let detectedState = '';
        let detectedPincode = '';

        // Tier 1: Backend Reverse Geocode API (High precision OpenStreetMap / Google Geocoding)
        try {
            const proxyRes = await fetch(`/api/places/geocode?lat=${lat}&lng=${lng}`);
            if (proxyRes.ok) {
                const proxyData = await proxyRes.json();
                if (proxyData && proxyData.success) {
                    detectedHouseNumber = proxyData.house_number || '';
                    detectedStreet = proxyData.street || '';
                    detectedCity = proxyData.city || '';
                    detectedState = proxyData.state || '';
                    detectedPincode = proxyData.pincode || '';
                }
            }
        } catch (e1) {
            console.warn('[Reverse Geocode Tier 1 Backend Error]:', e1);
        }

        // Tier 2: OpenStreetMap Nominatim Direct Reverse Geocode API
        if (!detectedStreet || !detectedCity || !detectedState) {
            try {
                const osmRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
                    headers: { 'Accept-Language': 'en' }
                });
                if (osmRes.ok) {
                    const osm = await osmRes.json();
                    const addr = osm.address || {};
                    if (!detectedHouseNumber) detectedHouseNumber = addr.house_number || addr.building || addr.house_name || addr.amenity || addr.shop || '';
                    if (!detectedStreet) detectedStreet = addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood || addr.residential || '';
                    if (!detectedCity) detectedCity = addr.city || addr.town || addr.village || addr.municipality || addr.city_district || addr.county || addr.state_district || '';
                    if (!detectedState) detectedState = addr.state || addr.region || '';
                    if (!detectedPincode) detectedPincode = (addr.postcode || '').replace(/\D/g, '').slice(0, 6);
                }
            } catch (e2) {
                console.warn('[Reverse Geocode Tier 2 OSM Error]:', e2);
            }
        }

        // Tier 3: BigDataCloud Fallback
        if (!detectedStreet || !detectedCity) {
            try {
                const bdcRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
                if (bdcRes.ok) {
                    const bdc = await bdcRes.json();
                    if (!detectedStreet) detectedStreet = bdc.locality || bdc.subLocality || bdc.street || '';
                    if (!detectedCity) detectedCity = bdc.city || bdc.localityInfo?.administrative?.[2]?.name || bdc.localityInfo?.administrative?.[1]?.name || '';
                    if (!detectedState) detectedState = bdc.principalSubdivision || bdc.localityInfo?.administrative?.[0]?.name || '';
                    if (!detectedPincode) detectedPincode = (bdc.postcode || '').replace(/\D/g, '').slice(0, 6);
                }
            } catch (e3) {
                console.warn('[Reverse Geocode Tier 3 BDC Error]:', e3);
            }
        }

        // Auto-fill address form input fields
        if (houseInput && detectedHouseNumber) houseInput.value = detectedHouseNumber;
        if (streetInput && detectedStreet) streetInput.value = detectedStreet;
        if (cityInput && detectedCity) cityInput.value = detectedCity;
        if (stateInput && detectedState) stateInput.value = detectedState;
        if (pinInput && detectedPincode) pinInput.value = detectedPincode;

        // Compile full delivery address string
        this.updateSignupFullAddress();

        // Dispatch input & change events for validation triggers
        [houseInput, streetInput, cityInput, stateInput, pinInput, fullAddrInput].forEach(inp => {
            if (inp) {
                inp.dispatchEvent(new Event('input', { bubbles: true }));
                inp.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });

        if (statusBanner) {
            statusBanner.style.background = '#f0fdf4';
            statusBanner.style.color = '#166534';
            statusBanner.innerHTML = `Location detected ✓`;
        }
    }

    setAuthMode(mode) {
        this.state.currentRole = 'auth';
        this.state.authMode = mode;
        if (mode === 'signup') {
            this._signupLocAutoDetected = false;
        }
        this.closeModal();
        this.render();
    }

    openEditProfileModal() {
        const user = this.authService ? this.authService.getUser() : null;
        if (!user) {
            this.showToast('Please sign in to edit your profile');
            this.openAuthModal('login');
            return;
        }

        const name = user.name || '';
        const phone = user.phone || '';
        const address = user.address || '';
        const houseNumber = user.house_number || '';
        const street = user.street || '';
        const city = user.city || '';
        const state = user.state || '';
        const pincode = user.pincode || '';
        const profileImage = user.profile_image || '';

        this.showModal(`
            <div class="modal-card" style="max-width:560px;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                    <div style="width:40px; height:40px; border-radius:var(--radius-full); background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; font-size:18px;">
                        <i class="fa-solid fa-user-pen"></i>
                    </div>
                    <div>
                        <h3 style="font-size:18px; margin:0;">Edit Profile & Delivery Address</h3>
                        <p style="font-size:12px; color:var(--text-muted); margin:0;">Update your contact info and delivery address in database</p>
                    </div>
                </div>

                <form onsubmit="MediApp.saveProfileChanges(event)" style="display:flex; flex-direction:column; gap:14px;">
                    <!-- Personal Information -->
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <div>
                            <label style="font-size:12px; font-weight:700;">Full Name *</label>
                            <input type="text" id="editProfileName" class="search-input" value="${name}" required style="width:100%;">
                        </div>
                        <div>
                            <label style="font-size:12px; font-weight:700;">Phone Number *</label>
                            <input type="text" id="editProfilePhone" class="search-input" value="${phone}" required style="width:100%;">
                        </div>
                    </div>

                    <!-- Delivery Address Details -->
                    <div>
                        <label style="font-size:12px; font-weight:700;">Full Delivery Address *</label>
                        <input type="text" id="editProfileAddress" class="search-input" value="${address}" required placeholder="e.g. Flat 302, Green Park Apartments, Sector 18, Noida" style="width:100%;">
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <div>
                            <label style="font-size:12px; font-weight:700;">Flat / House No</label>
                            <input type="text" id="editProfileHouse" class="search-input" value="${houseNumber}" placeholder="e.g. Flat 302" style="width:100%;">
                        </div>
                        <div>
                            <label style="font-size:12px; font-weight:700;">Street / Area</label>
                            <input type="text" id="editProfileStreet" class="search-input" value="${street}" placeholder="e.g. Sector 18" style="width:100%;">
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px;">
                        <div>
                            <label style="font-size:12px; font-weight:700;">City</label>
                            <input type="text" id="editProfileCity" class="search-input" value="${city}" placeholder="Noida" style="width:100%;">
                        </div>
                        <div>
                            <label style="font-size:12px; font-weight:700;">State</label>
                            <input type="text" id="editProfileState" class="search-input" value="${state}" placeholder="Uttar Pradesh" style="width:100%;">
                        </div>
                        <div>
                            <label style="font-size:12px; font-weight:700;">Pincode</label>
                            <input type="text" id="editProfilePincode" class="search-input" value="${pincode}" placeholder="201301" style="width:100%;">
                        </div>
                    </div>

                    <button type="submit" id="saveProfileBtn" class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; font-size:14px; margin-top:6px;">
                        <i class="fa-solid fa-floppy-disk"></i> Save Profile to Database
                    </button>
                </form>
            </div>
        `);
    }

    handleProfilePhotoUpload(event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_SIZE = 250;
                let width = img.width;
                let height = img.height;
                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

                const preview = document.getElementById('editProfilePhotoPreview');
                const input = document.getElementById('editProfileImageInput');
                if (preview) preview.src = compressedDataUrl;
                if (input) input.value = compressedDataUrl;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    async saveProfileChanges(event) {
        event.preventDefault();
        const submitBtn = document.getElementById('saveProfileBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving to Database...';
        }

        const profileData = {
            name: document.getElementById('editProfileName')?.value,
            phone: document.getElementById('editProfilePhone')?.value,
            address: document.getElementById('editProfileAddress')?.value,
            house_number: document.getElementById('editProfileHouse')?.value,
            street: document.getElementById('editProfileStreet')?.value,
            city: document.getElementById('editProfileCity')?.value,
            state: document.getElementById('editProfileState')?.value,
            pincode: document.getElementById('editProfilePincode')?.value
        };

        const res = await this.authService.updateProfile(profileData);
        this.closeModal();

        if (res && res.success) {
            this.showToast('✅ Profile and Address updated successfully in database!');
            if (res.user && this.authService) {
                this.authService.currentUser = { ...this.authService.currentUser, ...res.user };
                localStorage.setItem('medifind_auth_user', JSON.stringify(this.authService.currentUser));
                if (sessionStorage.getItem('medifind_auth_user')) {
                    sessionStorage.setItem('medifind_auth_user', JSON.stringify(this.authService.currentUser));
                }
            }
            if (profileData.address) {
                const existing = (this.state.savedAddresses || []).find(a => a.text === profileData.address);
                if (!existing) {
                    this.state.savedAddresses.unshift({
                        id: `addr_${Date.now()}`,
                        label: 'Home',
                        text: profileData.address
                    });
                }
            }
            this.render();
        } else {
            this.showToast(res ? res.message : 'Failed to update profile.');
        }
    }

    async refreshNearbyPharmacies() {
        const loc = googleMapsService.getUserLocation();
        this.showToast('🔎 Refreshing nearby pharmacies via Google Places...');
        await googleMapsService.fetchNearbyPharmacies(loc.lat, loc.lng);
        this.showToast('✅ Nearby pharmacies updated');
        this.render();
    }

    openAddressModal() {
        const currentLoc = googleMapsService.getUserLocation();
        this.showModal(`
            <div class="modal-card" style="max-width:460px; width:92%;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px; margin-bottom:12px;"><i class="fa-solid fa-location-crosshairs" style="color:var(--primary);"></i> Select Your Location</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">
                    Find pharmacies and check medicine availability near your exact position.
                </p>
                
                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
                    <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px;" onclick="MediApp.closeModal(); MediApp.detectLiveLocation();">
                        <i class="fa-solid fa-location-arrow"></i> Detect My Current GPS Location
                    </button>

                    <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; background:linear-gradient(135deg, #0284c7 0%, #0369a1 100%);" onclick="MediApp.openMapPickerModal();">
                        <i class="fa-solid fa-map-location-dot"></i> Select Location on Map
                    </button>
                </div>
                
                <div style="border-top:1px dashed var(--card-border); margin:16px 0; padding-top:14px;">
                    <label style="font-size:11px; font-weight:800; color:var(--text-muted); display:block; margin-bottom:6px;">ENTER LOCATION MANUALLY</label>
                    <div style="display:flex; gap:8px;">
                        <input type="text" id="manualLocationInput" placeholder="Enter area, city or street address..." value="${currentLoc.label}" style="flex:1; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-md); font-size:13px;" onkeydown="if(event.key==='Enter') MediApp.submitManualLocation()">
                        <button class="add-cart-btn" style="padding:10px 14px;" onclick="MediApp.submitManualLocation()">Set</button>
                    </div>
                </div>

                <div style="margin-top:14px;">
                    <label style="font-size:11px; font-weight:800; color:var(--text-muted); display:block; margin-bottom:6px;">POPULAR CITIES & PRESETS</label>
                    <div style="display:flex; flex-wrap:wrap; gap:8px;">
                        <button class="btn-secondary" style="font-size:11px;" onclick="MediApp.setPresetLocation('Anna Nagar, Chennai', 13.0827, 80.2707)">Chennai</button>
                        <button class="btn-secondary" style="font-size:11px;" onclick="MediApp.setPresetLocation('Sector 18, Noida', 28.5355, 77.3910)">Noida</button>
                        <button class="btn-secondary" style="font-size:11px;" onclick="MediApp.setPresetLocation('Connaught Place, New Delhi', 28.6315, 77.2167)">Delhi</button>
                        <button class="btn-secondary" style="font-size:11px;" onclick="MediApp.setPresetLocation('Bandra West, Mumbai', 19.0596, 72.8295)">Mumbai</button>
                        <button class="btn-secondary" style="font-size:11px;" onclick="MediApp.setPresetLocation('Koramangala, Bengaluru', 12.9352, 77.6245)">Bengaluru</button>
                    </div>
                </div>
            </div>
        `);
    }

    openMapPickerModal() {
        const currentLoc = googleMapsService.getUserLocation();
        const initialLat = currentLoc.lat || 13.0827;
        const initialLng = currentLoc.lng || 80.2707;
        const initialLabel = currentLoc.label || 'Anna Nagar, Chennai';

        this.mapPickerState = {
            lat: initialLat,
            lng: initialLng,
            label: initialLabel,
            map: null,
            marker: null,
            isGeocoding: false
        };

        this.showModal(`
            <div class="modal-card" style="max-width:580px; width:95%; padding:20px;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px; margin-bottom:4px; display:flex; align-items:center; gap:8px;">
                    <i class="fa-solid fa-map-location-dot" style="color:var(--primary);"></i> Select Location on Map
                </h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:14px;">
                    Drag the red pin or click anywhere on the map to set your exact position.
                </p>

                <div style="display:flex; gap:8px; margin-bottom:12px;">
                    <input type="text" id="mapPickerSearchInput" placeholder="Search city, area, or landmark..." value="" style="flex:1; padding:9px 12px; border:1px solid var(--card-border); border-radius:var(--radius-md); font-size:13px;" onkeydown="if(event.key==='Enter') MediApp.searchMapPickerLocation()">
                    <button class="add-cart-btn" style="padding:9px 14px; font-size:12px;" onclick="MediApp.searchMapPickerLocation()">
                        <i class="fa-solid fa-magnifying-glass"></i> Search
                    </button>
                </div>

                <div class="map-picker-wrapper">
                    <div id="mapPickerContainer" style="width:100%; height:100%;"></div>
                    <button class="map-picker-gps-btn" onclick="MediApp.centerMapPickerOnGps()" title="Center on My GPS Location">
                        <i class="fa-solid fa-crosshairs" style="font-size:16px;"></i>
                    </button>
                </div>

                <div style="margin-top:12px; padding:12px 14px; background:var(--background); border-radius:var(--radius-md); border:1px solid var(--card-border); display:flex; align-items:center; gap:12px;">
                    <div style="width:36px; height:36px; border-radius:var(--radius-full); background:var(--emergency-light, #fee2e2); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                        <i class="fa-solid fa-location-dot" style="color:var(--emergency-red, #ef4444); font-size:18px;"></i>
                    </div>
                    <div style="flex:1; overflow:hidden;">
                        <div id="mapPickerAddressText" style="font-size:13px; font-weight:700; color:var(--text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                            ${initialLabel}
                        </div>
                        <div id="mapPickerCoordsText" style="font-size:11px; color:var(--text-muted); margin-top:2px;">
                            Coordinates: ${initialLat.toFixed(4)}, ${initialLng.toFixed(4)}
                        </div>
                    </div>
                </div>

                <div style="display:flex; gap:10px; margin-top:16px;">
                    <button class="btn-secondary" style="flex:1; justify-content:center; padding:11px;" onclick="MediApp.openAddressModal()">Back</button>
                    <button class="add-cart-btn" style="flex:2; justify-content:center; padding:11px;" onclick="MediApp.confirmMapPickerLocation()">
                        <i class="fa-solid fa-check"></i> Confirm Location
                    </button>
                </div>
            </div>
        `);

        setTimeout(() => {
            this.initMapPicker(initialLat, initialLng);
        }, 120);
    }

    loadLeafletLibrary() {
        return new Promise((resolve) => {
            if (typeof window.L !== 'undefined') return resolve(true);

            if (!document.getElementById('leaflet-css')) {
                const link = document.createElement('link');
                link.id = 'leaflet-css';
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);
            }

            if (document.getElementById('leaflet-js')) {
                let checks = 0;
                const interval = setInterval(() => {
                    checks++;
                    if (typeof window.L !== 'undefined' || checks > 30) {
                        clearInterval(interval);
                        resolve(typeof window.L !== 'undefined');
                    }
                }, 100);
                return;
            }

            const script = document.createElement('script');
            script.id = 'leaflet-js';
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.head.appendChild(script);
        });
    }

    async initMapPicker(lat, lng) {
        const container = document.getElementById('mapPickerContainer');
        if (!container) return;

        if (typeof window.L === 'undefined') {
            const addrText = document.getElementById('mapPickerAddressText');
            if (addrText) addrText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading map engine...';
            await this.loadLeafletLibrary();
        }

        if (typeof window.L === 'undefined') {
            container.innerHTML = `<div style="padding:20px; text-align:center; color:var(--text-muted); display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size:28px; color:var(--warning-amber); margin-bottom:8px;"></i>
                <div style="font-size:13px; font-weight:600;">Unable to load map engine</div>
                <div style="font-size:11px; margin-top:4px;">Please check internet connection or try again.</div>
            </div>`;
            return;
        }

        try {
            if (this.mapPickerState && this.mapPickerState.map) {
                try { this.mapPickerState.map.remove(); } catch(e) {}
            }

            const map = L.map('mapPickerContainer', {
                center: [lat, lng],
                zoom: 15,
                zoomControl: true
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            const customPinIcon = L.divIcon({
                className: 'custom-map-picker-pin',
                html: `<div style="display:flex; flex-direction:column; align-items:center; justify-content:center;">
                    <div style="width:36px; height:36px; background:#ef4444; border:3px solid #ffffff; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; box-shadow:0 4px 10px rgba(239,68,68,0.5); font-size:16px;">
                        <i class="fa-solid fa-location-dot"></i>
                    </div>
                    <div style="width:3px; height:8px; background:#ef4444; border-radius:2px;"></div>
                </div>`,
                iconSize: [36, 44],
                iconAnchor: [18, 44]
            });

            const marker = L.marker([lat, lng], {
                draggable: true,
                icon: customPinIcon
            }).addTo(map);

            this.mapPickerState.map = map;
            this.mapPickerState.marker = marker;

            setTimeout(() => {
                map.invalidateSize();
            }, 200);

            marker.on('dragend', (e) => {
                const pos = e.target.getLatLng();
                this.updateMapPickerPosition(pos.lat, pos.lng);
            });

            map.on('click', (e) => {
                marker.setLatLng(e.latlng);
                this.updateMapPickerPosition(e.latlng.lat, e.latlng.lng);
            });

            this.updateMapPickerPosition(lat, lng);

        } catch (e) {
            console.error('[MapPicker Init Error]:', e);
        }
    }

    async updateMapPickerPosition(lat, lng) {
        const fixedLat = parseFloat(lat.toFixed(6));
        const fixedLng = parseFloat(lng.toFixed(6));

        if (this.mapPickerState) {
            this.mapPickerState.lat = fixedLat;
            this.mapPickerState.lng = fixedLng;
        }

        const coordsText = document.getElementById('mapPickerCoordsText');
        if (coordsText) {
            coordsText.textContent = `Coordinates: ${fixedLat.toFixed(4)}, ${fixedLng.toFixed(4)}`;
        }

        const addrText = document.getElementById('mapPickerAddressText');
        if (addrText) {
            addrText.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="color:var(--primary);"></i> Fetching address...`;
        }

        try {
            const res = await fetch(`/api/places/geocode?lat=${fixedLat}&lng=${fixedLng}`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.success && data.formatted_address) {
                    if (this.mapPickerState) this.mapPickerState.label = data.formatted_address;
                    if (addrText) addrText.textContent = data.formatted_address;
                    return;
                }
            }
        } catch (e) {
            console.warn('[MapPicker Geocode Error]:', e);
        }

        const fallbackLabel = `Location (${fixedLat.toFixed(4)}, ${fixedLng.toFixed(4)})`;
        if (this.mapPickerState) this.mapPickerState.label = fallbackLabel;
        if (addrText) addrText.textContent = fallbackLabel;
    }

    async searchMapPickerLocation() {
        const input = document.getElementById('mapPickerSearchInput');
        const query = input?.value?.trim();
        if (!query) return;

        const addrText = document.getElementById('mapPickerAddressText');
        if (addrText) {
            addrText.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="color:var(--primary);"></i> Searching location...`;
        }

        try {
            const res = await fetch(`/api/places/geocode?address=${encodeURIComponent(query)}`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.success && data.lat && data.lng) {
                    const newLat = data.lat;
                    const newLng = data.lng;
                    const formatted = data.formatted_address || query;

                    if (this.mapPickerState) {
                        this.mapPickerState.lat = newLat;
                        this.mapPickerState.lng = newLng;
                        this.mapPickerState.label = formatted;
                    }

                    if (this.mapPickerState && this.mapPickerState.map) {
                        this.mapPickerState.map.setView([newLat, newLng], 16);
                    }
                    if (this.mapPickerState && this.mapPickerState.marker) {
                        this.mapPickerState.marker.setLatLng([newLat, newLng]);
                    }

                    if (addrText) addrText.textContent = formatted;
                    const coordsText = document.getElementById('mapPickerCoordsText');
                    if (coordsText) coordsText.textContent = `Coordinates: ${newLat.toFixed(4)}, ${newLng.toFixed(4)}`;

                    this.showToast(`📍 Found: ${formatted}`);
                    return;
                }
            }
        } catch (e) {
            console.warn('[MapPicker Search Error]:', e);
        }

        this.showToast(`⚠️ Could not locate address "${query}". Try pinning directly on map.`);
        if (addrText) addrText.textContent = this.mapPickerState?.label || query;
    }

    centerMapPickerOnGps() {
        if (!navigator.geolocation) {
            this.showToast('⚠️ Geolocation is not supported by your browser.');
            return;
        }

        this.showToast('📡 Detecting current GPS position...');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = parseFloat(pos.coords.latitude.toFixed(6));
                const lng = parseFloat(pos.coords.longitude.toFixed(6));

                if (this.mapPickerState && this.mapPickerState.map) {
                    this.mapPickerState.map.setView([lat, lng], 16);
                }
                if (this.mapPickerState && this.mapPickerState.marker) {
                    this.mapPickerState.marker.setLatLng([lat, lng]);
                }

                this.updateMapPickerPosition(lat, lng);
                this.showToast('🎯 Centered map on GPS position');
            },
            (err) => {
                console.warn('[GPS Center Error]:', err.message);
                this.showToast('⚠️ GPS location unavailable. Pin location manually on map.');
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    }

    async confirmMapPickerLocation() {
        if (!this.mapPickerState) return;
        const { label, lat, lng } = this.mapPickerState;
        if (!label || !lat || !lng) {
            this.showToast('⚠️ Please select a location on the map first.');
            return;
        }

        this.closeModal();

        // If location was selected specifically during Checkout
        if (this.isSelectingCheckoutMapLocation) {
            this.isSelectingCheckoutMapLocation = false;
            const locObj = { lat, lng, label, isLiveGps: false };
            googleMapsService.currentLocation = locObj;
            localStorage.setItem('medifind_user_location', JSON.stringify(locObj));

            const serviceability = googleMapsService.isLocationServiceable(locObj, 15.0);
            if (!serviceability.serviceable) {
                this.showToast('⚠️ The location is currently not serviceable', 'error');
                alert(`The location is currently not serviceable. Selected map location is ${serviceability.distanceKm} km away. Delivery is available strictly within a 15 km radius of our medicine supply store.`);
                this.render();
                return;
            }

            const addrInput = document.getElementById('deliveryAddressInput');
            if (addrInput) addrInput.value = label;

            this.showToast(`✅ Selected map location verified within 15 km radius!`, 'success');
            this.render();
            this.simulateRazorpayCheckout(this.pendingCheckoutTotal || 0);
            return;
        }

        this.showToast(`📍 Setting location to: ${label.split(',')[0]}...`);
        await googleMapsService.setManualLocation(label, lat, lng);
        this.showToast(`✅ Location set to: ${label.split(',')[0]}`);
        this.render();
    }

    async submitManualLocation() {
        const input = document.getElementById('manualLocationInput')?.value?.trim();
        if (!input) return;
        this.closeModal();
        this.showToast('📍 Updating location...');
        await googleMapsService.setManualLocation(input);
        this.showToast(`📍 Location updated to: ${input}`);
        this.render();
    }

    async setPresetLocation(label, lat, lng) {
        this.closeModal();
        this.showToast(`📍 Setting location to ${label}...`);
        await googleMapsService.setManualLocation(label, lat, lng);
        this.showToast(`📍 Location set to: ${label}`);
        this.render();
    }

    // Customer Actions
    setCustomerTab(tab) {
        this.state.customerTab = tab;
        this.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    filterPharmacies(val) {
        this.customerModule.pharmacySearchQuery = val;
        this.render();
    }

    openAccountModal() {
        const currentUser = this.authService.getUser();
        const isAdmin = currentUser && (currentUser.role === 'admin' || (currentUser.email && currentUser.email.toLowerCase() === 'admin@medifind.com') || this.state.currentRole === 'admin');

        this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="text-align:center; padding:12px 0 20px 0;">
                    <div class="brand-icon" style="width:60px; height:60px; font-size:28px; margin:0 auto 12px auto; ${isAdmin ? 'background:linear-gradient(135deg, #0284c7 0%, #0f172a 100%); color:white;' : ''}">
                        <i class="fa-solid ${isAdmin ? 'fa-user-shield' : 'fa-user'}"></i>
                    </div>
                    <h3 style="font-size:20px; font-weight:800;">${currentUser ? currentUser.name : 'Guest User'}</h3>
                    <p style="font-size:13px; color:var(--text-muted);">${currentUser ? currentUser.email : 'Customer Account'}</p>
                </div>
                
                ${!isAdmin ? `
                    <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
                        <div style="padding:12px 16px; background:var(--background); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:space-between; cursor:pointer;" onclick="MediApp.setCustomerTab('orders'); MediApp.closeModal();">
                            <div style="display:flex; align-items:center; gap:10px;"><i class="fa-solid fa-box" style="color:var(--primary);"></i> <span>My Orders</span></div>
                            <i class="fa-solid fa-chevron-right" style="font-size:12px; color:var(--text-muted);"></i>
                        </div>
                    </div>
                ` : ''}

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
    }

    continueAsGuest() {
        this.state.isGuest = true;
        this.state.currentRole = 'customer';
        this.state.customerTab = 'home';
        this.state.cart = []; // Reset cart for guest
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
            const actualRole = (email.toLowerCase() === 'admin@medifind.com' || role === 'admin' || res.user.role === 'admin') ? 'admin' : role;
            res.user.role = actualRole;
            this.authService.setCurrentUser(res.user, rememberMe);
            const target = this.authService.getRedirectTabForRole(actualRole);
            this.state.currentRole = target.role;
            this.state.cart = []; // Reset cart on login
            await this.loadSavedOrders();
            if (target.role === 'admin') {
                await this.loadAllUsers();
                this.startAdminLivePolling();
            }
            this.showToast(`Welcome back, ${res.user.name}! Authenticated as ${actualRole.toUpperCase()}`);
            this.render();
            if (target.role === 'admin') {
                setTimeout(() => {
                    if (this.adminModule && this.adminModule.initCharts) {
                        this.adminModule.initCharts();
                    }
                }, 100);
            }
        } else {
            if (errBanner) {
                errBanner.style.display = 'block';
                errBanner.innerText = res.message || 'Login failed. Please check credentials.';
            }
        }
    }

    handleGoogleSignIn() {
        this.showModal(`
            <div class="modal-card" style="max-width:440px; text-align:center;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>

                <div style="margin-bottom:16px;">
                    <svg width="48" height="48" viewBox="0 0 18 18" style="margin-bottom:8px;"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
                    <h3 style="font-size:20px; font-weight:800; color:var(--text-main);">Sign in with Google</h3>
                    <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">Choose an account to continue to <strong>MediFind</strong></p>
                </div>

                <div id="googleAccountList" style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px; text-align:left;">
                    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border:1.5px solid var(--card-border); border-radius:var(--radius-md); cursor:pointer; background:var(--card-bg);" onclick="MediApp.executeGoogleAuth('sanjeevareddytallapureddy@gmail.com', 'Sanjeeva Reddy')">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <div style="width:38px; height:38px; border-radius:50%; background:#4285F4; color:white; font-weight:800; display:flex; align-items:center; justify-content:center; font-size:16px;">S</div>
                            <div>
                                <div style="font-weight:700; font-size:14px; color:var(--text-main);">Sanjeeva Reddy</div>
                                <div style="font-size:12px; color:var(--text-muted);">sanjeevareddytallapureddy@gmail.com</div>
                            </div>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                    </div>

                    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border:1.5px solid var(--card-border); border-radius:var(--radius-md); cursor:pointer; background:var(--card-bg);" onclick="MediApp.executeGoogleAuth('medifind.official@gmail.com', 'MediFind User')">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <div style="width:38px; height:38px; border-radius:50%; background:#34A853; color:white; font-weight:800; display:flex; align-items:center; justify-content:center; font-size:16px;">M</div>
                            <div>
                                <div style="font-weight:700; font-size:14px; color:var(--text-main);">MediFind Official</div>
                                <div style="font-size:12px; color:var(--text-muted);">medifind.official@gmail.com</div>
                            </div>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                    </div>
                </div>

                <div style="border-top:1px dashed var(--card-border); padding-top:14px; text-align:left;">
                    <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">OR ENTER ANOTHER GMAIL ACCOUNT</label>
                    <div style="display:flex; gap:8px;">
                        <input type="email" id="customGoogleEmail" placeholder="yourname@gmail.com" style="flex:1; padding:9px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;" onkeypress="if(event.key==='Enter') MediApp.submitCustomGoogleAccount()">
                        <button class="add-cart-btn" style="padding:9px 16px; font-size:13px;" onclick="MediApp.submitCustomGoogleAccount()">Continue</button>
                    </div>
                </div>
            </div>
        `);
    }

    async executeGoogleAuth(email, name = '') {
        this.closeModal();
        this.showToast(`🔑 Authenticating Google Account (${email})...`);

        let res = await this.authService.api.googleAuth(email, name);

        if (res && res.success) {
            this.authService.setCurrentUser(res.user, true);
            this.state.currentRole = 'customer';
            this.state.cart = [];
            await this.loadSavedOrders();
            this.showToast(`🎉 Logged in with Google as ${res.user.name || email}`);
            this.render();
        } else {
            this.showToast(`❌ Google authentication failed: ${res.message || 'Error'}`);
        }
    }

    submitCustomGoogleAccount() {
        const email = document.getElementById('customGoogleEmail')?.value?.trim();
        if (!email || !email.includes('@')) {
            this.showToast('Please enter a valid Gmail address.');
            return;
        }
        this.executeGoogleAuth(email);
    }

    async handleSignupFormSubmit(form) {
        const role = 'customer';
        const name = document.getElementById('signupName')?.value?.trim();
        const email = document.getElementById('signupEmail')?.value?.trim();
        const phone = document.getElementById('signupPhone')?.value?.trim();
        const password = document.getElementById('signupPassword')?.value?.trim();

        const houseNumber = document.getElementById('signupHouseNumber')?.value?.trim() || '';
        const street = document.getElementById('signupStreet')?.value?.trim() || '';
        const city = document.getElementById('signupCity')?.value?.trim() || '';
        const state = document.getElementById('signupState')?.value?.trim() || '';
        const pincode = document.getElementById('signupPincode')?.value?.trim() || '';
        const fullAddress = document.getElementById('signupAddress')?.value?.trim() || '';
        const latVal = document.getElementById('signupLat')?.value;
        const lngVal = document.getElementById('signupLng')?.value;

        const latitude = latVal ? parseFloat(latVal) : null;
        const longitude = lngVal ? parseFloat(lngVal) : null;

        const errBanner = document.getElementById('signupErrorBanner');

        if (!name || !email || !password) {
            if (errBanner) {
                errBanner.style.display = 'block';
                errBanner.innerText = 'Please complete name, email, and password.';
            }
            return;
        }

        const addressDetails = {
            house_number: houseNumber,
            street: street,
            city: city,
            state: state,
            pincode: pincode,
            latitude: latitude,
            longitude: longitude
        };

        const res = await this.authService.signup(email, password, name, role, phone, fullAddress, addressDetails);
        if (res.success && res.requiresOtp) {
            this.state.pendingOtpEmail = email;
            this.state.authMode = 'otp';
            this.showToast(`📩 Verification code sent to ${email}`);
            this.render();
        } else if (res.success) {
            const target = this.authService.getRedirectTabForRole(role);
            this.state.currentRole = target.role;
            this.state.cart = [];
            this.showToast(`🎉 Registration Successful! Welcome ${name}`);
            this.render();
        } else {
            if (errBanner) {
                errBanner.style.display = 'block';
                errBanner.innerText = res.message || 'Registration failed.';
            }
        }
    }

    async handleVerifyOtpSubmit(form) {
        const otp = document.getElementById('otpCodeInput')?.value?.trim();
        const email = this.state.pendingOtpEmail;
        const errBanner = document.getElementById('otpErrorBanner');
        const successBanner = document.getElementById('otpSuccessBanner');

        if (!otp || otp.length !== 6) {
            if (errBanner) {
                errBanner.innerText = 'Please enter the complete 6-digit OTP code.';
                errBanner.style.display = 'block';
            }
            return;
        }

        const btn = document.getElementById('btnVerifyOtp');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying Code...';
        }

        const apiClient = (this.authService && this.authService.api) ? this.authService.api : (typeof api !== 'undefined' ? api : null);
        let res = apiClient ? await apiClient.verifyOtp(email, otp) : { success: false, message: 'API client error' };

        if (!res.success && res.message === 'Network connection failed.') {
            const cleanEmail = (email || '').toLowerCase().trim();
            const pendingStr = localStorage.getItem(`medifind_pending_user_${cleanEmail}`);
            if (pendingStr) {
                const pending = JSON.parse(pendingStr);
                if (otp === '123456' || otp === pending.rawOtp || (otp && otp.length === 6)) {
                    const localUser = {
                        ...pending,
                        isVerified: true,
                        token: `jwt_token_local_${Date.now()}`
                    };
                    res = { success: true, user: localUser, token: localUser.token };
                }
            }
        }

        if (res.success) {
            if (errBanner) errBanner.style.display = 'none';
            if (successBanner) {
                successBanner.innerText = '✅ Verification Successful! Accessing MediFind...';
                successBanner.style.display = 'block';
            }
            
            const userWithToken = { ...res.user, token: res.token };
            if (res.token && apiClient) apiClient.setToken(res.token);
            this.authService.setCurrentUser(userWithToken, true);
            const target = this.authService.getRedirectTabForRole(res.user.role || 'customer');
            this.state.currentRole = target.role;
            this.state.cart = [];
            this.showToast(`🎉 Email Verified! Welcome, ${res.user.name}`);
            delete this.state.pendingOtpEmail;
            this.render();
        } else {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-shield-check"></i> Verify OTP';
            }
            if (errBanner) {
                errBanner.innerText = res.message || 'Invalid OTP code. Please check your email.';
                errBanner.style.display = 'block';
            }
        }
    }

    async handleResendOtp() {
        const email = this.state.pendingOtpEmail;
        if (!email) {
            this.showToast('No pending email address found.');
            return;
        }
        const res = await api.resendOtp(email);
        if (res.success) {
            this.showToast(`📩 A new 6-digit OTP code has been sent to ${email}`);
        } else {
            this.showToast(res.message || 'Failed to resend OTP.');
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
        this.closeModal();
        this.state.orders = [];
        this.state.cart = [];
        this.authService.logout();
        this.state.isGuest = false;
        this.state.currentRole = 'auth';
        this.state.authMode = 'login';
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

    clearCart() {
        this.state.cart = [];
        this.showToast('Shopping Cart Emptied 🛒');
        this.render();
    }

    getCartCount() {
        return this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    async validateCheckoutAddress(addressText) {
        if (!addressText || typeof addressText !== 'string' || addressText.trim().length === 0) return;
        const res = await googleMapsService.verifyDeliveryServiceability(addressText, 15.0);
        const alertBox = document.getElementById('checkoutServiceabilityAlert');
        const placeBtn = document.getElementById('placeOrderBtn');

        const distSpan = document.getElementById('cartDistanceText');
        const feeSpan = document.getElementById('cartDeliveryFeeText');
        const totalSpan = document.getElementById('cartTotalText');

        const subtotal = this.state.cart.reduce((sum, i) => sum + (parseFloat(i.price) || 0) * (parseInt(i.quantity) || 1), 0);
        const discount = this.state.appliedCoupon ? (subtotal * 0.2) : 0;
        const tax = parseFloat((subtotal * 0.05).toFixed(2));
        const distKm = res.distanceKm || 0;
        const deliveryFee = subtotal > 0 ? parseFloat((distKm * 10).toFixed(2)) : 0;
        const computedTotal = Math.max(0, subtotal + deliveryFee + tax - discount);

        if (distSpan) distSpan.textContent = `${distKm.toFixed(1)} km`;
        if (feeSpan) feeSpan.textContent = `₹${deliveryFee.toFixed(2)}`;
        if (totalSpan) totalSpan.textContent = `₹${computedTotal.toFixed(2)}`;

        if (alertBox && placeBtn) {
            if (!res.serviceable) {
                alertBox.style.display = 'flex';
                alertBox.innerHTML = `
                    <i class="fa-solid fa-triangle-exclamation" style="font-size:20px;"></i>
                    <div>
                        <div style="font-size:14px; font-weight:800;">The location is currently not serviceable</div>
                        <div style="font-size:11px; font-weight:600; opacity:0.9; margin-top:2px;">Delivery is available only within a 15 km radius of our medicine supply store (Distance: ${distKm.toFixed(1)} km away).</div>
                    </div>
                `;
                placeBtn.disabled = true;
                placeBtn.style.opacity = '0.5';
                placeBtn.style.cursor = 'not-allowed';
                placeBtn.style.background = 'var(--text-muted)';
                placeBtn.style.borderColor = 'var(--text-muted)';
                placeBtn.setAttribute('onclick', `MediApp.simulateRazorpayCheckout(${computedTotal.toFixed(2)})`);
                placeBtn.innerHTML = '<i class="fa-solid fa-ban"></i> The location is currently not serviceable';
            } else {
                alertBox.style.display = 'none';
                placeBtn.disabled = false;
                placeBtn.style.opacity = '1';
                placeBtn.style.cursor = 'pointer';
                placeBtn.style.background = '';
                placeBtn.style.borderColor = '';
                placeBtn.setAttribute('data-total', computedTotal.toFixed(2));
                placeBtn.setAttribute('onclick', `MediApp.simulateRazorpayCheckout(${computedTotal.toFixed(2)})`);
                placeBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Place Order • ₹${computedTotal.toFixed(2)}`;
            }
        }
    }

    async simulateRazorpayCheckout(amount) {
        const userLoc = googleMapsService.getUserLocation();
        const serviceability = await googleMapsService.verifyDeliveryServiceability(userLoc, 15.0);

        if (!serviceability.serviceable) {
            this.showToast('⚠️ The location is currently not serviceable', 'error');
            alert('The location is currently not serviceable. Delivery is available only within a 15 km radius of our medicine supply store.');
            return;
        }

        this.paymentService.openRazorpayCheckout(amount);
    }

    selectPaymentMethod(method, amount) {
        this.paymentService.selectPaymentMethod(method, amount);
    }

    submitDemoPayment(method, amount) {
        this.paymentService.submitDemoPayment(method, amount);
    }

    processPayment(method, amount) {
        this.paymentService.submitDemoPayment(method, amount);
    }

    simulatePaymentFailure(amount) {
        this.paymentService.handlePaymentFailure(amount);
    }

    completeCheckoutOrder(txId, paymentMethod, amount, paymentStatus = 'Paid') {
        const currentUser = this.authService.getUser();
        const userId = currentUser ? currentUser.id : `usr_guest_${Date.now()}`;
        const userName = currentUser ? currentUser.name : 'Guest Customer';
        const userEmail = currentUser ? currentUser.email : 'guest@example.com';
        const userPhone = currentUser ? (currentUser.phone || '+91 98765 43210') : '+91 98765 43210';
        const userAddress = document.getElementById('deliveryAddressInput')?.value || (currentUser?.address ? (typeof currentUser.address === 'string' ? currentUser.address : `${currentUser.address.street || ''}, ${currentUser.address.city || ''}`) : 'Flat 402, Block B, Sector 18, Noida');

        const userLoc = googleMapsService.getUserLocation();
        const serviceability = googleMapsService.isLocationServiceable(userLoc, 15.0);
        const distKm = serviceability.distanceKm || 0;

        const cartItems = [...this.state.cart];
        const subtotal = cartItems.reduce((sum, i) => sum + (parseFloat(i.price) || 0) * (parseInt(i.quantity) || 1), 0);
        const deliveryFee = subtotal > 0 ? parseFloat((distKm * 10).toFixed(2)) : 0;
        const tax = parseFloat((subtotal * 0.05).toFixed(2));
        const discount = this.state.appliedCoupon ? parseFloat((subtotal * 0.2).toFixed(2)) : 0;
        const computedTotal = parseFloat(Math.max(0, subtotal + deliveryFee + tax - discount).toFixed(2));
        const finalTotal = (amount && typeof amount === 'number') ? parseFloat(amount.toFixed(2)) : computedTotal;

        const newOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
        const newOrder = {
            id: newOrderId,
            user_id: userId,
            customer_id: userId,
            customer_name: userName,
            customer_email: userEmail,
            customer_phone: userPhone,
            customer_address: userAddress,
            pharmacy_id: 'pharm_1',
            pharmacy_name: 'Apollo Pharmacy 24/7',
            pharmacy_phone: '+91 98765 12345',
            items: cartItems,
            subtotal: parseFloat(subtotal.toFixed(2)),
            tax,
            delivery_fee: deliveryFee,
            discount,
            total_amount: finalTotal,
            payment_method: paymentMethod,
            payment_status: paymentStatus || (paymentMethod === 'COD' ? 'Pending COD' : 'Paid'),
            payment_id: txId,
            order_status: 'Confirmed',
            tracking_step: 1,
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
        this.saveOrdersToStorage();
        if (this.authService && this.authService.api) {
            this.authService.api.createOrder(newOrder).catch(e => console.warn('[API Create Order Note]:', e));
        }
        this.state.cart = [];
        this.closeModal();
        this.setCustomerTab('orders');
        this.showToast(paymentMethod === 'COD' ? `🎉 COD Order ${newOrderId} Placed!` : `🎉 Payment Successful! Order ${newOrderId} Confirmed`);
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
        return;
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
        // Disabled top-right toast popups during operation
        return;
    }

    showModal(html) {
        const container = document.getElementById('modalContainer');
        if (!container) return;
        container.innerHTML = `<div class="modal-overlay active">${html}</div>`;
    }

    closeModal() {
        if (this.mapPickerState && this.mapPickerState.map) {
            try { this.mapPickerState.map.remove(); } catch(e) {}
            this.mapPickerState.map = null;
            this.mapPickerState.marker = null;
        }
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



    updateOrderStatus(orderId, status, step) {
        const order = this.state.orders.find(o => o.id === orderId);
        if (order) {
            order.order_status = status;
            if (step) order.tracking_step = step;
            this.saveOrdersToStorage();

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

    async updatePrice(medId, newPrice) {
        const priceVal = parseFloat(newPrice);
        if (isNaN(priceVal)) return;

        const med = this.state.medicines.find(m => m.id === medId);
        if (med) {
            med.price = priceVal;
            med.original_price = Math.round((priceVal * 1.15) * 10) / 10;
            this.saveMedicinesToStorage();
            this.showToast(`Price for ${med.name} updated to ₹${med.price.toFixed(2)}`);

            try {
                const token = localStorage.getItem('medifind_auth_token') || localStorage.getItem('medifind_jwt_token');
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                await fetch(`/api/medicines/${medId}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify({ price: priceVal, stock: med.stock })
                });
            } catch (e) {
                console.warn('[Update Price API] Note:', e);
            }

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

    toggleUserStatus(userId) {
        if (!this.state.usersList) this.state.usersList = [];
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



    async setManualLocationFromInput() {
        const val = document.getElementById('manualLocationInput')?.value?.trim();
        if (!val) {
            this.showToast('Please enter an address or city name.');
            return;
        }
        this.showToast(`🔍 Locating "${val}"...`);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    const lat = parseFloat(parseFloat(data[0].lat).toFixed(4));
                    const lng = parseFloat(parseFloat(data[0].lon).toFixed(4));
                    const displayLabel = data[0].display_name.split(',').slice(0, 2).join(', ');
                    googleMapsService.setManualLocation(displayLabel || val, lat, lng);
                } else {
                    googleMapsService.setManualLocation(val);
                }
            } else {
                googleMapsService.setManualLocation(val);
            }
        } catch (e) {
            googleMapsService.setManualLocation(val);
        }
        this.closeModal();
        this.showToast(`📍 Real-Time Location Updated: "${val}"`);
        this.render();
    }

    selectSavedAddress(label, text) {
        googleMapsService.setManualLocation(`${label}: ${text}`);
        this.closeModal();
        this.showToast(`📍 Selected Address: ${label}`);
        this.render();
    }

    openHelpSupportModal() {
        this.showModal(`
            <div class="modal-card" style="max-width:440px; padding:24px;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="text-align:center; margin-bottom:16px;">
                    <div style="width:56px; height:56px; background:var(--primary-light); color:var(--primary); border-radius:var(--radius-full); display:flex; align-items:center; justify-content:center; font-size:26px; margin:0 auto 10px auto;">
                        <i class="fa-solid fa-headset"></i>
                    </div>
                    <h3 style="font-size:18px;">MediFind 24/7 Support</h3>
                    <p style="font-size:12px; color:var(--text-muted);">We are here to help you with medicine orders, prescription uploads, or pharmacy queries.</p>
                </div>
                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
                    <a href="tel:+919876543210" class="add-cart-btn" style="justify-content:center; text-decoration:none;">
                        <i class="fa-solid fa-phone"></i> Call Emergency Support (+91 98765 43210)
                    </a>
                    <a href="mailto:support@medifind.health" class="btn-secondary" style="justify-content:center; text-decoration:none;">
                        <i class="fa-solid fa-envelope"></i> Email Customer Care
                    </a>
                </div>
                <button class="btn-secondary" style="width:100%; justify-content:center;" onclick="MediApp.closeModal()">Close</button>
            </div>
        `);
    }

    openAboutModal() {
        this.showModal(`
            <div class="modal-card" style="max-width:440px; padding:24px; text-align:center;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div class="splash-logo" style="margin:0 auto 14px auto; width:64px; height:64px; font-size:32px;">
                    <i class="fa-solid fa-notes-medical"></i>
                </div>
                <h2 style="font-size:20px; font-weight:800; margin-bottom:2px;">MediFind</h2>
                <div style="font-size:12px; color:var(--primary); font-weight:700; margin-bottom:12px;">"Find Medicines. Find Pharmacies. Get Care Faster."</div>
                <p style="font-size:12px; color:var(--text-muted); line-height:1.6; margin-bottom:16px;">
                    MediFind is a modern, mobile-first real-time medicine discovery and 15-minute home delivery platform built for final-year project demonstration using HTML5 Geolocation, Google Places API, PWA, and Socket.IO.
                </p>
                <div style="font-size:11px; color:var(--text-muted); background:var(--background); padding:10px; border-radius:var(--radius-md); margin-bottom:16px;">
                    Version 2.5.0 • PWA Enabled • License: Open Demonstration
                </div>
                <button class="add-cart-btn" style="width:100%; justify-content:center;" onclick="MediApp.closeModal()">Got it!</button>
            </div>
        `);
    }
}

const initMediApp = () => {
    try {
        if (!window.MediApp) {
            const instance = new MediFindApp();
            window.MediApp = instance;
        }
    } catch (e) {
        console.error('MediFindApp init error:', e);
        window.MediApp = null;
        const root = document.getElementById('app');
        if (root) {
            const errStr = e ? (e.stack || e.message || e.toString()) : 'Unknown Initialization Error';
            root.innerHTML = `
                <div style="min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; font-family:sans-serif; text-align:center; background:#f8fafc; color:#0f172a;">
                    <div style="font-size:48px; color:#0ea5e9; margin-bottom:12px;"><i class="fa-solid fa-notes-medical"></i></div>
                    <h2 style="font-size:22px; font-weight:800; margin-bottom:8px;">MediFind Application</h2>
                    <div style="font-size:12px; color:#ef4444; background:#fee2e2; border:1px solid #fca5a5; padding:12px; border-radius:8px; margin:12px auto 20px auto; max-width:550px; text-align:left; font-family:monospace; word-break:break-all; white-space:pre-wrap;">${errStr}</div>
                    <button style="background:#0ea5e9; color:white; border:none; padding:12px 24px; font-size:14px; font-weight:700; border-radius:12px; cursor:pointer;" onclick="localStorage.clear(); sessionStorage.clear(); window.location.reload();">
                        🚀 Clear Cache & Launch MediFind
                    </button>
                </div>
            `;
        }
    }
};

if (typeof window !== 'undefined') {
    initMediApp();
}
