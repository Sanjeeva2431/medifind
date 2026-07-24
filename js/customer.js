import { MEDICINE_CATEGORIES, MOCK_MEDICINES, MOCK_PHARMACIES, MOCK_COUPONS } from './data.js';
import { IntelligentSearchEngine } from './search-engine.js';
import { googleMapsService } from './maps.js';
import { firestoreDb } from './firestore-db.js';

export class CustomerModule {
    constructor(app) {
        this.app = app;
        this.selectedCategory = 'all';
        this.searchQuery = '';
        this.selectedPharmacyId = null;
        this.selectedMedicineId = null;
        this.searchEngine = new IntelligentSearchEngine(MOCK_MEDICINES, MOCK_PHARMACIES);
    }

    // Main Router Renderer based on app state
    render() {
        const tab = this.app.state.customerTab;
        if (tab === 'home') return this.renderHome();
        if (tab === 'search') return this.renderSearchPage();
        if (tab === 'pharmacies') return this.renderPharmaciesPage();
        if (tab === 'pharmacy-detail') return this.renderPharmacyDetailPage();
        if (tab === 'medicine-detail') return this.renderMedicineDetailPage();
        if (tab === 'prescription') return this.renderPrescriptionPage();
        if (tab === 'cart') return this.renderCartPage();
        if (tab === 'orders') return this.renderOrdersPage();
        if (tab === 'profile') return this.renderProfilePage();
        return this.renderHome();
    }

    // 1. Home Feed
    renderHome() {
        const cartCount = this.app.getCartCount();
        const activeOrder = this.app.state.orders.find(o => o.order_status !== 'Delivered');

        return `
            <!-- Top Navbar -->
            <header class="navbar-top">
                <div class="brand-logo" onclick="MediApp.setCustomerTab('home')">
                    <div class="brand-icon"><i class="fa-solid fa-notes-medical"></i></div>
                    <span class="brand-text">MediFind</span>
                </div>

                <div class="location-selector" onclick="MediApp.openAddressModal()">
                    <i class="fa-solid fa-location-crosshairs" style="color:var(--primary);"></i>
                    <span>${googleMapsService.getUserLocation().label}</span>
                    <i class="fa-solid fa-chevron-down" style="font-size:10px;"></i>
                </div>

                <div class="top-actions">
                    <button class="role-badge-btn" onclick="MediApp.openAccountModal()">
                        <i class="fa-solid fa-user"></i> Account
                    </button>
                    <button class="icon-btn" onclick="MediApp.toggleTheme()" title="Toggle Dark/Light Mode">
                        <i class="fa-solid ${this.app.state.darkMode ? 'fa-sun' : 'fa-moon'}"></i>
                    </button>
                    <button class="icon-btn" onclick="MediApp.setCustomerTab('cart')">
                        <i class="fa-solid fa-bag-shopping"></i>
                        ${cartCount > 0 ? `<span class="badge-count">${cartCount}</span>` : ''}
                    </button>
                </div>
            </header>

            <main class="main-content">
                <!-- Search Hero Banner -->
                <section class="search-hero">
                    <h2 class="search-title">Fast 15-Minute Medicine Delivery ⚡</h2>
                    <p class="search-subtitle">Order genuine medicines from verified nearby pharmacies at lowest prices</p>
                    
                    <div class="main-search-bar" onclick="MediApp.setCustomerTab('search')">
                        <i class="fa-solid fa-magnifying-glass search-icon"></i>
                        <input type="text" placeholder="Search 'Dolo 650', 'Paracetamol', or generic name..." readonly>
                        <button class="voice-btn" onclick="event.stopPropagation(); MediApp.openVoiceSearchModal()" title="Voice Search">
                            <i class="fa-solid fa-microphone"></i>
                        </button>
                        <button class="camera-rx-btn" onclick="event.stopPropagation(); MediApp.setCustomerTab('prescription')" title="Upload Prescription">
                            <i class="fa-solid fa-file-prescription"></i>
                        </button>
                    </div>
                </section>

                ${activeOrder ? `
                    <!-- Active Live Order Banner -->
                    <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color:white; border-radius:var(--radius-lg); padding:16px 20px; display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; box-shadow:var(--shadow-md);">
                        <div>
                            <div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; font-weight:800;">ACTIVE LIVE ORDER</div>
                            <div style="font-size:16px; font-weight:800;">${activeOrder.id} - ${activeOrder.order_status}</div>
                            <div style="font-size:12px; opacity:0.9;">Estimated Arrival in 12 mins • Driver: ${activeOrder.delivery_partner.name}</div>
                        </div>
                        <button class="emergency-btn" onclick="MediApp.openTrackingModal('${activeOrder.id}')">
                            <i class="fa-solid fa-map-location-dot"></i> Live Track
                        </button>
                    </div>
                ` : ''}

                <!-- Quick Prescription Banner Card -->
                <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color:white; border-radius:var(--radius-lg); padding:18px 20px; display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; box-shadow:0 8px 16px rgba(34,197,94,0.25);">
                    <div>
                        <div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; font-weight:800;">AI PRESCRIPTION SCANNER</div>
                        <div style="font-size:16px; font-weight:800;">Have a Doctor's Prescription?</div>
                        <div style="font-size:12px; opacity:0.9;">Upload photo to auto-extract items and place order</div>
                    </div>
                    <button class="emergency-btn" style="color:#16a34a;" onclick="MediApp.setCustomerTab('prescription')">
                        <i class="fa-solid fa-file-arrow-up"></i> Upload Rx
                    </button>
                </div>

                <!-- Categories -->
                <section style="margin-bottom: 24px;">
                    <div class="section-header">
                        <h3 class="section-title"><i class="fa-solid fa-shapes" style="color:var(--primary);"></i> Medicine Categories</h3>
                    </div>
                    <div class="category-scroll">
                        ${MEDICINE_CATEGORIES.map(cat => `
                            <div class="category-chip ${this.selectedCategory === cat.id ? 'active' : ''}" 
                                 onclick="MediApp.filterCategory('${cat.id}')">
                                <i class="fa-solid ${cat.icon}"></i>
                                <span>${cat.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </section>

                <!-- Nearby Pharmacies Horizontal Carousel -->
                <section style="margin-bottom: 24px;">
                    <div class="section-header">
                        <h3 class="section-title"><i class="fa-solid fa-store" style="color:var(--primary);"></i> Nearby Open Pharmacies</h3>
                        <span class="see-all-link" onclick="MediApp.setCustomerTab('pharmacies')">View All (20)</span>
                    </div>
                    <div style="display:flex; gap:16px; overflow-x:auto; padding-bottom:10px; scrollbar-width:none;">
                        ${MOCK_PHARMACIES.slice(0, 4).map(p => `
                            <div style="flex:0 0 260px; background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:14px; box-shadow:var(--shadow-sm); cursor:pointer;"
                                 onclick="MediApp.viewPharmacyDetails('${p.id}')">
                                <div style="display:flex; gap:12px; align-items:center; margin-bottom:8px;">
                                    <img src="${p.logo}" style="width:48px; height:48px; border-radius:var(--radius-sm); object-fit:cover;">
                                    <div>
                                        <div style="font-weight:700; font-size:14px;">${p.shop_name}</div>
                                        <div style="font-size:11px; color:var(--text-muted);">${p.distance} • ⚡ ${p.delivery_time}</div>
                                    </div>
                                </div>
                                <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px;">
                                    <span style="background:var(--warning-light); color:var(--warning-amber); padding:2px 6px; border-radius:4px; font-weight:700;"><i class="fa-solid fa-star"></i> ${p.rating}</span>
                                    <span style="color:var(--secondary); font-weight:700;">● OPEN NOW</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </section>

                <!-- Popular Medicines Grid -->
                <section>
                    <div class="section-header">
                        <h3 class="section-title"><i class="fa-solid fa-fire" style="color:var(--warning-amber);"></i> Trending Medicines</h3>
                        <span class="see-all-link" onclick="MediApp.setCustomerTab('search')">Browse All</span>
                    </div>
                    <div class="cards-grid">
                        ${this.renderMedicineCards(MOCK_MEDICINES.slice(0, 8))}
                    </div>
                </section>
            </main>

            ${this.renderBottomNav()}
            ${this.renderAiFab()}
        `;
    }

    // 2. All Pharmacies Page (/pharmacies)
    renderPharmaciesPage() {
        const query = (this.pharmacySearchQuery || '').toLowerCase();
        const filteredPharmacies = MOCK_PHARMACIES.filter(p => 
            !query || p.shop_name.toLowerCase().includes(query) || p.address.toLowerCase().includes(query)
        );

        setTimeout(() => {
            googleMapsService.renderMapCanvas('nearbyPharmaciesMapCanvas', {
                pharmacies: filteredPharmacies,
                showDirections: true
            });
        }, 50);

        return `
            <header class="navbar-top">
                <button class="icon-btn" onclick="MediApp.setCustomerTab('home')"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 style="font-size:18px; flex:1;">Nearby Pharmacies (${filteredPharmacies.length})</h2>
            </header>

            <main class="main-content">
                <!-- Interactive Google Maps View Box -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:12px; margin-bottom:20px; box-shadow:var(--shadow-sm);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-size:13px; font-weight:800; color:var(--primary);"><i class="fa-solid fa-map-location-dot"></i> Live Geolocation Map & Directions API</span>
                        <span style="font-size:11px; background:var(--primary-light); color:var(--primary); padding:2px 8px; border-radius:4px; font-weight:700;">Marker Clustering Active</span>
                    </div>
                    <div class="tracking-map-box" style="height:180px;">
                        <canvas id="nearbyPharmaciesMapCanvas" class="tracking-canvas"></canvas>
                    </div>
                </div>

                <div style="margin-bottom:16px;">
                    <div class="main-search-bar" style="margin:0;">
                        <i class="fa-solid fa-magnifying-glass search-icon"></i>
                        <input type="text" placeholder="Search pharmacies by name or location..." value="${this.pharmacySearchQuery || ''}" oninput="MediApp.filterPharmacies(this.value)">
                    </div>
                </div>

                <div style="display:flex; flex-direction:column; gap:14px;">
                    ${filteredPharmacies.map(p => {
                        const isFav = (this.app.state.favoritePharmacies || []).includes(p.id);
                        return `
                            <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:16px; display:flex; gap:14px; align-items:center; box-shadow:var(--shadow-sm); cursor:pointer;"
                                 onclick="MediApp.viewPharmacyDetails('${p.id}')">
                                <img src="${p.logo}" style="width:64px; height:64px; border-radius:var(--radius-md); object-fit:cover;">
                                <div style="flex:1;">
                                    <div style="font-weight:700; font-size:16px; display:flex; align-items:center; justify-content:space-between;">
                                        <span>${p.shop_name} <i class="fa-solid fa-circle-check" style="color:var(--primary); font-size:14px;" title="Verified License"></i></span>
                                        <button class="icon-btn" style="padding:4px; color:${isFav ? 'var(--emergency-red)' : 'var(--text-muted)'};" onclick="event.stopPropagation(); MediApp.toggleFavoritePharmacy('${p.id}')">
                                            <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
                                        </button>
                                    </div>
                                    <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">${p.address}</div>
                                    <div style="display:flex; gap:10px; font-size:12px; align-items:center;">
                                        <span style="background:var(--warning-light); color:var(--warning-amber); padding:2px 6px; border-radius:4px; font-weight:700;"><i class="fa-solid fa-star"></i> ${p.rating} (${p.reviews_count})</span>
                                        <span>📍 ${p.distance}</span>
                                        <span>⚡ ${p.delivery_time}</span>
                                    </div>
                                </div>
                                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.shop_name + ' ' + p.address)}" target="_blank" class="add-cart-btn" style="text-decoration:none; padding:8px 12px; font-size:12px;" onclick="event.stopPropagation();">
                                    <i class="fa-solid fa-location-arrow"></i> Nav
                                </a>
                            </div>
                        `;
                    }).join('')}
                </div>
            </main>
            ${this.renderBottomNav()}
        `;
    }

    // 3. Pharmacy Details Page (/pharmacy/:id)
    renderPharmacyDetailPage() {
        const p = MOCK_PHARMACIES.find(item => item.id === this.selectedPharmacyId) || MOCK_PHARMACIES[0];
        const pMedicines = MOCK_MEDICINES.filter(m => m.pharmacy_id === p.id);

        return `
            <header class="navbar-top">
                <button class="icon-btn" onclick="MediApp.setCustomerTab('pharmacies')"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 style="font-size:18px; flex:1;">${p.shop_name}</h2>
            </header>

            <main class="main-content">
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:20px; margin-bottom:20px; box-shadow:var(--shadow-sm);">
                    <div style="display:flex; gap:16px; align-items:center; margin-bottom:14px;">
                        <img src="${p.logo}" style="width:72px; height:72px; border-radius:var(--radius-md); object-fit:cover;">
                        <div>
                            <h2 style="font-size:20px;">${p.shop_name}</h2>
                            <div style="font-size:12px; color:var(--text-muted); margin-bottom:4px;">${p.address}</div>
                            <div style="font-size:12px; color:var(--primary); font-weight:700;">Drug License: <code>${p.license_number}</code></div>
                        </div>
                    </div>

                    <div style="display:flex; gap:10px;">
                        <button class="btn-secondary" style="flex:1; justify-content:center;" onclick="alert('Calling ${p.shop_name} at ${p.phone}')">
                            <i class="fa-solid fa-phone"></i> Call Pharmacy
                        </button>
                        <button class="add-cart-btn" style="flex:1; justify-content:center;" onclick="MediApp.openAiDrawer()">
                            <i class="fa-solid fa-comments"></i> Chat Pharmacy
                        </button>
                    </div>
                </div>

                <h3 style="font-size:16px; margin-bottom:14px;">Available Medicines in this Pharmacy (${pMedicines.length})</h3>
                <div class="cards-grid">
                    ${this.renderMedicineCards(pMedicines)}
                </div>
            </main>
            ${this.renderBottomNav()}
        `;
    }

    // 4. Medicine Details Page (/medicine/:id)
    renderMedicineDetailPage() {
        const med = MOCK_MEDICINES.find(m => m.id === this.selectedMedicineId) || MOCK_MEDICINES[0];

        return `
            <header class="navbar-top">
                <button class="icon-btn" onclick="MediApp.setCustomerTab('search')"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 style="font-size:18px; flex:1;">Medicine Details</h2>
                <button class="icon-btn" onclick="MediApp.setCustomerTab('cart')"><i class="fa-solid fa-bag-shopping"></i></button>
            </header>

            <main class="main-content">
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:20px; margin-bottom:20px; box-shadow:var(--shadow-sm);">
                    <div style="height:220px; width:100%; border-radius:var(--radius-md); overflow:hidden; background:#f1f5f9; margin-bottom:16px; position:relative;">
                        <img src="${med.image}" style="width:100%; height:100%; object-fit:cover;">
                        ${med.requires_prescription ? `<span class="rx-badge">Rx PRESCRIPTION REQUIRED</span>` : ''}
                    </div>

                    <h1 style="font-size:22px; margin-bottom:4px;">${med.name}</h1>
                    <div style="font-size:14px; color:var(--primary); font-weight:700; margin-bottom:12px;">Generic: ${med.generic_name}</div>

                    <div style="display:flex; justify-content:space-between; align-items:center; background:var(--background); padding:12px 16px; border-radius:var(--radius-md); margin-bottom:16px;">
                        <div>
                            <span class="current-price" style="font-size:24px;">₹${med.price.toFixed(2)}</span>
                            <span class="original-price" style="font-size:14px; margin-left:8px;">₹${med.original_price.toFixed(2)}</span>
                        </div>
                        <span style="color:var(--secondary); font-weight:800; font-size:13px;">In Stock (${med.stock} units)</span>
                    </div>

                    <div style="font-size:13px; line-height:1.6; margin-bottom:16px;">
                        <strong>Description:</strong> ${med.description}<br><br>
                        <strong>Dosage:</strong> ${med.dosage}<br>
                        <strong>Manufacturer:</strong> ${med.manufacturer}<br>
                        <strong>Expiry Date:</strong> ${med.expiry_date}<br>
                        <strong>Side Effects:</strong> ${med.side_effects}
                    </div>

                    <div style="display:flex; gap:12px;">
                        <button class="add-cart-btn" style="flex:1; justify-content:center; padding:12px; font-size:15px;" onclick="MediApp.addToCart('${med.id}')">
                            <i class="fa-solid fa-cart-plus"></i> Add To Cart
                        </button>
                        <button class="add-cart-btn" style="flex:1; justify-content:center; padding:12px; font-size:15px; background:var(--secondary);" onclick="MediApp.buyNow('${med.id}')">
                            <i class="fa-solid fa-bolt"></i> Buy Now
                        </button>
                    </div>
                </div>
            </main>
            ${this.renderBottomNav()}
        `;
    }

    // 5. Prescription Upload Page (/prescription)
    renderPrescriptionPage() {
        const scanned = this.ocrResults || null;

        return `
            <header class="navbar-top">
                <button class="icon-btn" onclick="MediApp.setCustomerTab('home')"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 style="font-size:18px; flex:1;">Upload Doctor Prescription</h2>
            </header>

            <main class="main-content">
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-sm); margin-bottom:20px;">
                    <h3 style="font-size:16px; margin-bottom:12px;">Choose Prescription Upload Source</h3>
                    
                    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px; margin-bottom:16px;">
                        <button class="btn-secondary" style="flex-direction:column; padding:16px; gap:8px; align-items:center;" onclick="MediApp.simulateOcrScan('camera')">
                            <i class="fa-solid fa-camera" style="font-size:24px; color:var(--primary);"></i>
                            <span style="font-size:12px; font-weight:700;">Camera Snap</span>
                        </button>
                        <button class="btn-secondary" style="flex-direction:column; padding:16px; gap:8px; align-items:center;" onclick="MediApp.simulateOcrScan('gallery')">
                            <i class="fa-solid fa-image" style="font-size:24px; color:var(--secondary);"></i>
                            <span style="font-size:12px; font-weight:700;">Photo Gallery</span>
                        </button>
                        <button class="btn-secondary" style="flex-direction:column; padding:16px; gap:8px; align-items:center;" onclick="MediApp.simulateOcrScan('pdf')">
                            <i class="fa-solid fa-file-pdf" style="font-size:24px; color:var(--warning-amber);"></i>
                            <span style="font-size:12px; font-weight:700;">PDF File</span>
                        </button>
                    </div>

                    <div style="border:2px dashed var(--primary); background:var(--primary-light); padding:24px 16px; border-radius:var(--radius-md); text-align:center; cursor:pointer;" onclick="MediApp.simulateOcrScan('gallery')">
                        <i class="fa-solid fa-wand-magic-sparkles" style="font-size:36px; color:var(--primary); margin-bottom:8px;"></i>
                        <h4 style="font-size:15px; margin-bottom:4px;">Drag & Drop Prescription Document</h4>
                        <p style="font-size:12px; color:var(--text-muted);">AI OCR will automatically parse doctor handwriting, match inventory, and calculate confidence</p>
                    </div>
                </div>

                ${scanned ? `
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-md);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1px solid var(--card-border); padding-bottom:10px;">
                            <div>
                                <h3 style="font-size:16px;"><i class="fa-solid fa-receipt" style="color:var(--primary);"></i> AI OCR Extracted Prescription</h3>
                                <div style="font-size:12px; color:var(--text-muted);">${scanned.doctor} • Patient: ${scanned.patient}</div>
                            </div>
                            <span style="background:var(--secondary-light); color:var(--secondary); padding:4px 10px; border-radius:var(--radius-full); font-size:11px; font-weight:800;">4 Items Found</span>
                        </div>

                        <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
                            ${scanned.items.map((item, idx) => `
                                <div style="background:${item.isLowConfidence ? 'var(--warning-light)' : 'var(--background)'}; border:1px solid ${item.isLowConfidence ? 'var(--warning-amber)' : 'var(--card-border)'}; padding:14px; border-radius:var(--radius-md);">
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                        <div style="display:flex; align-items:center; gap:8px;">
                                            <strong style="font-size:14px;">${item.name}</strong>
                                            ${item.isLowConfidence ? `
                                                <span style="background:var(--warning-amber); color:white; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:800;">
                                                    <i class="fa-solid fa-triangle-exclamation"></i> Low Confidence (${item.confidence}%)
                                                </span>
                                            ` : `
                                                <span style="background:var(--secondary-light); color:var(--secondary); padding:2px 6px; border-radius:4px; font-size:10px; font-weight:800;">
                                                    <i class="fa-solid fa-circle-check"></i> ${item.confidence}% Verified
                                                </span>
                                            `}
                                        </div>
                                    </div>

                                    <!-- Manual Correction Input -->
                                    <div style="display:flex; gap:10px; align-items:center; margin-top:8px;">
                                        <div style="flex:2;">
                                            <label style="font-size:10px; font-weight:700; color:var(--text-muted);">MANUAL CORRECTION</label>
                                            <input type="text" value="${item.name}" style="width:100%; padding:6px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:12px; font-weight:700;">
                                        </div>
                                        <div style="flex:1;">
                                            <label style="font-size:10px; font-weight:700; color:var(--text-muted);">QTY (STRIPS)</label>
                                            <input type="number" value="${item.qty}" style="width:100%; padding:6px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:12px; font-weight:700;">
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <button class="add-cart-btn" style="width:100%; justify-content:center; padding:14px; font-size:15px;" onclick="MediApp.addPrescriptionItemsToCart()">
                            <i class="fa-solid fa-cart-plus"></i> Automatically Add All Matched Medicines to Cart
                        </button>
                    </div>
                ` : ''}
            </main>
            ${this.renderBottomNav()}
        `;
    }

    // 6. Cart & Checkout Page (/cart)
    renderCartPage() {
        const subtotal = this.app.state.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const deliveryFee = subtotal > 0 ? (subtotal > 200 ? 0 : 25) : 0;
        const discount = this.app.state.appliedCoupon ? (subtotal * 0.2) : 0;
        const tax = subtotal * 0.05;
        const total = Math.max(0, subtotal + deliveryFee + tax - discount);

        return `
            <header class="navbar-top">
                <button class="icon-btn" onclick="MediApp.setCustomerTab('home')"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 style="font-size:18px; flex:1;">Shopping Cart (${this.app.getCartCount()} items)</h2>
            </header>

            <main class="main-content">
                ${this.app.state.cart.length === 0 ? `
                    <div style="text-align:center; padding:60px 20px;">
                        <i class="fa-solid fa-basket-shopping" style="font-size:64px; color:var(--text-muted); margin-bottom:16px;"></i>
                        <h3 style="font-size:18px; margin-bottom:8px;">Your Cart is Empty</h3>
                        <p style="font-size:13px; color:var(--text-muted); margin-bottom:20px;">Search medicines from nearby pharmacies to add items.</p>
                        <button class="add-cart-btn" onclick="MediApp.setCustomerTab('search')">Browse Medicines</button>
                    </div>
                ` : `
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:20px; margin-bottom:20px; box-shadow:var(--shadow-sm);">
                        <h3 style="font-size:16px; margin-bottom:14px;">Items in Cart</h3>
                        <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:20px;">
                            ${this.app.state.cart.map(item => `
                                <div style="display:flex; align-items:center; gap:14px; border-bottom:1px solid var(--card-border); padding-bottom:12px;">
                                    <img src="${item.image}" style="width:52px; height:52px; border-radius:var(--radius-sm); object-fit:cover;">
                                    <div style="flex:1;">
                                        <div style="font-weight:700; font-size:15px;">${item.name}</div>
                                        <div style="font-size:13px; color:var(--primary); font-weight:700;">₹${item.price.toFixed(2)}</div>
                                    </div>
                                    <div style="display:flex; align-items:center; gap:10px; background:var(--background); padding:6px 12px; border-radius:var(--radius-full);">
                                        <button onclick="MediApp.updateCartQty('${item.id}', -1)" style="font-weight:800; font-size:16px;">-</button>
                                        <span style="font-weight:700; font-size:14px;">${item.quantity}</span>
                                        <button onclick="MediApp.updateCartQty('${item.id}', 1)" style="font-weight:800; font-size:16px;">+</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <!-- Delivery Address Input -->
                        <div style="margin-bottom:16px;">
                            <label style="font-size:12px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">DELIVERY ADDRESS</label>
                            <input type="text" id="deliveryAddressInput" value="Flat 402, Block B, Sector 18, Noida" 
                                   style="width:100%; border:1px solid var(--card-border); padding:10px 14px; border-radius:var(--radius-md); font-size:13px;">
                        </div>

                        <!-- Bill Summary -->
                        <div style="background:var(--background); padding:14px; border-radius:var(--radius-md); font-size:13px; margin-bottom:20px;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                <span>Subtotal</span><span>₹${subtotal.toFixed(2)}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                <span>Delivery Charge</span><span>${deliveryFee === 0 ? '<span style="color:var(--secondary); font-weight:700;">FREE</span>' : '₹' + deliveryFee}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                <span>Taxes (GST 5%)</span><span>₹${tax.toFixed(2)}</span>
                            </div>
                            <div style="border-top:1px dashed var(--card-border); margin-top:8px; padding-top:8px; display:flex; justify-content:space-between; font-weight:800; font-size:16px;">
                                <span>Total Amount</span><span style="color:var(--primary);">₹${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button class="add-cart-btn" style="width:100%; justify-content:center; padding:14px; font-size:16px;" onclick="MediApp.simulateRazorpayCheckout(${total})">
                            <i class="fa-solid fa-lock"></i> Place Order • ₹${total.toFixed(2)}
                        </button>
                    </div>
                `}
            </main>
            ${this.renderBottomNav()}
        `;
    }

    // Helper render helpers
    renderMedicineCards(medList) {
        const enriched = this.searchEngine.enrichMedicines(medList);

        return enriched.map(med => {
            const isOpen = med.pharmacy_status === 'open';
            const inStock = med.stock > 0;

            return `
                <div class="med-card" style="display:flex; flex-direction:column; justify-content:space-between; position:relative;">
                    <div>
                        <div class="med-img-wrapper" onclick="MediApp.viewMedicineDetails('${med.id}')">
                            <img src="${med.image}" alt="${med.name}">
                            ${med.requires_prescription ? `<span class="rx-badge">Rx REQUIRED</span>` : ''}
                            <span class="discount-tag">15% OFF</span>
                        </div>

                        <!-- 1. Medicine Brand Name -->
                        <div class="med-title" onclick="MediApp.viewMedicineDetails('${med.id}')">${med.name}</div>
                        
                        <!-- 2. Generic Name -->
                        <div class="med-generic" style="color:var(--primary); font-weight:600; font-size:12px; margin-bottom:4px;">
                            🧪 ${med.generic_name}
                        </div>

                        <!-- 4. Manufacturer -->
                        <div style="font-size:11px; color:var(--text-muted); margin-bottom:8px;">
                            🏢 Mfr: <strong>${med.manufacturer}</strong>
                        </div>

                        <!-- 5. Stock Status -->
                        <div style="font-size:11px; font-weight:700; margin-bottom:8px; color:${inStock ? 'var(--secondary)' : 'var(--emergency-red)'};">
                            📦 ${inStock ? `In Stock (${med.stock} units)` : 'Out of Stock'}
                        </div>

                        <!-- 6. Pharmacy, 7. Distance, 8. Open/Closed, 9. Rating, 10. Delivery -->
                        <div style="background:var(--background); padding:8px 10px; border-radius:var(--radius-sm); font-size:11px; margin-bottom:10px; display:flex; flex-direction:column; gap:3px;">
                            <div style="display:flex; justify-content:space-between; font-weight:700; color:var(--text-main);">
                                <span><i class="fa-solid fa-store" style="color:var(--primary);"></i> ${med.pharmacy_name}</span>
                                <span>📍 ${med.pharmacy_distance}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="color:${isOpen ? 'var(--secondary)' : 'var(--emergency-red)'}; font-weight:800;">
                                    ● ${isOpen ? 'OPEN NOW' : 'CLOSED'}
                                </span>
                                <span style="background:var(--warning-light); color:var(--warning-amber); padding:1px 5px; border-radius:3px; font-weight:800;">
                                    ⭐ ${med.pharmacy_rating}
                                </span>
                            </div>
                            <div style="color:var(--primary); font-weight:700; margin-top:2px;">
                                ⚡ ${med.pharmacy_delivery_available ? `Delivery Available (${med.delivery_time})` : 'Pickup Only'}
                            </div>
                        </div>
                    </div>

                    <!-- 3. Price & Action -->
                    <div class="med-price-row" style="margin-top:auto;">
                        <div class="price-box">
                            <span class="current-price">₹${med.price.toFixed(2)}</span>
                            <span class="original-price">₹${(med.price * 1.15).toFixed(2)}</span>
                        </div>
                        <button class="add-cart-btn" ${!inStock ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} onclick="MediApp.addToCart('${med.id}')">
                            <i class="fa-solid fa-plus"></i> Add
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderBottomNav() {
        const tab = this.app.state.customerTab;
        return `
            <nav class="bottom-nav">
                <a href="#" class="nav-item ${tab === 'home' ? 'active' : ''}" onclick="MediApp.setCustomerTab('home')">
                    <i class="fa-solid fa-house"></i><span>Home</span>
                </a>
                <a href="#" class="nav-item ${tab === 'search' ? 'active' : ''}" onclick="MediApp.setCustomerTab('search')">
                    <i class="fa-solid fa-magnifying-glass"></i><span>Search</span>
                </a>
                <a href="#" class="nav-item ${tab === 'pharmacies' ? 'active' : ''}" onclick="MediApp.setCustomerTab('pharmacies')">
                    <i class="fa-solid fa-store"></i><span>Pharmacies</span>
                </a>
                <a href="#" class="nav-item ${tab === 'orders' ? 'active' : ''}" onclick="MediApp.setCustomerTab('orders')">
                    <i class="fa-solid fa-receipt"></i><span>Orders</span>
                </a>
                <a href="#" class="nav-item ${tab === 'profile' ? 'active' : ''}" onclick="MediApp.setCustomerTab('profile')">
                    <i class="fa-solid fa-user"></i><span>Profile</span>
                </a>
            </nav>
        `;
    }

    renderAiFab() {
        return `
            <button class="ai-fab" onclick="MediApp.openAiDrawer()">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                <span>Ask MediAI</span>
            </button>
        `;
    }

    renderSearchPage() {
        const dbMeds = Array.from(firestoreDb.collections.Medicines.values());
        const allMedicines = dbMeds.length > 0 ? dbMeds : this.app.state.medicines;
        const dbPharmacies = Array.from(firestoreDb.collections.Pharmacies.values());
        const allPharmacies = dbPharmacies.length > 0 ? dbPharmacies : MOCK_PHARMACIES;

        this.searchEngine.setDatasets(allMedicines, allPharmacies);
        const { results, spellingCorrection, alternatives } = this.searchEngine.search(this.searchQuery, this.selectedCategory);

        return `
            <header class="navbar-top">
                <button class="icon-btn" onclick="MediApp.setCustomerTab('home')"><i class="fa-solid fa-arrow-left"></i></button>
                <div style="flex:1;">
                    <div class="main-search-bar" style="margin:0;">
                        <i class="fa-solid fa-magnifying-glass search-icon"></i>
                        <input type="text" id="mainSearchInputField" placeholder="Search brand, generic name (e.g. Paracetamol, Dolo 650)..." value="${this.searchQuery}" oninput="MediApp.handleSearchInput(this.value)">
                    </div>
                </div>
            </header>

            <main class="main-content">
                ${spellingCorrection ? `
                    <div style="background:var(--primary-light); color:var(--primary); padding:10px 14px; border-radius:var(--radius-md); font-size:13px; margin-bottom:16px; display:flex; align-items:center; gap:8px;">
                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                        <span>Did you mean <strong style="text-decoration:underline; cursor:pointer;" onclick="MediApp.handleSearchInput('${spellingCorrection}')">"${spellingCorrection}"</strong>?</span>
                    </div>
                ` : ''}

                ${results.length > 0 ? `
                    <div class="cards-grid">
                        ${this.renderMedicineCards(results)}
                    </div>
                ` : `
                    <div style="text-align:center; padding:30px 20px;">
                        <i class="fa-solid fa-magnifying-glass-minus" style="font-size:42px; color:var(--text-muted); margin-bottom:12px;"></i>
                        <h3 style="font-size:18px;">No exact match found for "${this.searchQuery}"</h3>
                        <p style="font-size:13px; color:var(--text-muted); margin-bottom:20px;">We searched brand names, generic chemical compositions, and nearby pharmacy stock.</p>
                    </div>
                `}

                ${alternatives && alternatives.length > 0 ? `
                    <div style="margin-top:24px; background:var(--secondary-light); border:1px solid var(--secondary); border-radius:var(--radius-lg); padding:18px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <h3 style="font-size:16px; color:var(--secondary-hover); font-weight:800;"><i class="fa-solid fa-lightbulb"></i> Recommended Generic Alternatives</h3>
                            <span style="background:var(--secondary); color:white; padding:3px 8px; border-radius:var(--radius-full); font-size:11px; font-weight:800;">SAVE ~25%</span>
                        </div>
                        <p style="font-size:12px; color:var(--text-body); margin-bottom:14px;">Same active chemical composition available in stock at nearby pharmacies:</p>
                        <div class="cards-grid">
                            ${this.renderMedicineCards(alternatives)}
                        </div>
                    </div>
                ` : ''}
            </main>
            ${this.renderBottomNav()}
        `;
    }

    renderOrdersPage() {
        return `
            <header class="navbar-top">
                <h2 style="font-size:18px; flex:1;">My Orders History</h2>
                <button class="icon-btn" onclick="MediApp.openNotificationsModal()" title="Notifications"><i class="fa-solid fa-bell"></i></button>
            </header>

            <main class="main-content">
                ${this.app.state.orders.length === 0 ? `
                    <div style="text-align:center; padding:40px; color:var(--text-muted);">No orders placed yet.</div>
                ` : this.app.state.orders.map(o => {
                    const isCompleted = o.order_status === 'Delivered';
                    const isCancelled = o.order_status === 'Cancelled';
                    const isActive = !isCompleted && !isCancelled;

                    return `
                        <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:18px; margin-bottom:14px; box-shadow:var(--shadow-sm);">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                <div>
                                    <span style="font-weight:800; color:var(--primary); font-size:16px;">${o.id}</span>
                                    <div style="font-size:11px; color:var(--text-muted);">${new Date(o.created_at || Date.now()).toLocaleDateString()}</div>
                                </div>
                                <span class="role-badge-btn" style="background:${isCancelled ? 'var(--emergency-light)' : isCompleted ? 'var(--secondary-light)' : 'var(--primary-light)'}; color:${isCancelled ? 'var(--emergency-red)' : isCompleted ? 'var(--secondary)' : 'var(--primary)'};">${o.order_status}</span>
                            </div>

                            <div style="font-size:13px; margin-bottom:12px; background:var(--background); padding:10px; border-radius:var(--radius-sm);">
                                ${o.items.map(it => `<div>• <b>${it.quantity}x ${it.name}</b> — ₹${(it.price * it.quantity).toFixed(2)}</div>`).join('')}
                                <div style="margin-top:6px; font-weight:800; text-align:right; color:var(--text-main);">Total: ₹${o.total_amount.toFixed(2)}</div>
                            </div>

                            <div style="display:flex; gap:8px; justify-content:flex-end;">
                                ${isActive ? `
                                    <button class="add-cart-btn" onclick="MediApp.openTrackingModal('${o.id}')"><i class="fa-solid fa-map-location-dot"></i> Live Track</button>
                                    <button class="btn-secondary" style="color:var(--emergency-red);" onclick="MediApp.cancelOrder('${o.id}')"><i class="fa-solid fa-ban"></i> Cancel Order</button>
                                ` : `
                                    <button class="add-cart-btn" style="background:var(--secondary);" onclick="MediApp.reorder('${o.id}')"><i class="fa-solid fa-rotate-right"></i> Reorder Items</button>
                                `}
                            </div>
                        </div>
                    `;
                }).join('')}
            </main>
            ${this.renderBottomNav()}
        `;
    }

    renderProfilePage() {
        const user = this.app.authService.getUser() || { name: 'Alex Johnson', email: 'alex@example.com', phone: '+91 98765 43210' };
        const savedAddresses = this.app.state.savedAddresses || [];
        const favoritePharmacies = MOCK_PHARMACIES.filter(p => (this.app.state.favoritePharmacies || []).includes(p.id));

        return `
            <header class="navbar-top">
                <h2 style="font-size:18px; flex:1;">My Customer Account</h2>
                <button class="icon-btn" onclick="MediApp.openNotificationsModal()"><i class="fa-solid fa-bell"></i></button>
            </header>

            <main class="main-content">
                <!-- User Profile Card -->
                <div style="background:var(--card-bg); padding:20px; border-radius:var(--radius-lg); border:1px solid var(--card-border); display:flex; align-items:center; gap:16px; margin-bottom:20px; box-shadow:var(--shadow-sm);">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" style="width:64px; height:64px; border-radius:var(--radius-full); object-fit:cover;">
                    <div style="flex:1;">
                        <h3 style="font-size:18px; margin-bottom:2px;">${user.name}</h3>
                        <div style="font-size:12px; color:var(--text-muted);">${user.phone} • ${user.email}</div>
                    </div>
                    <button class="btn-secondary" style="color:var(--emergency-red); padding:8px 12px; font-size:12px;" onclick="MediApp.logout()"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
                </div>

                <!-- Saved Addresses Section -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:18px; margin-bottom:20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <h3 style="font-size:16px;"><i class="fa-solid fa-location-dot" style="color:var(--primary);"></i> Saved Delivery Addresses</h3>
                        <button class="add-cart-btn" style="padding:6px 12px; font-size:12px;" onclick="MediApp.openAddressModal()"><i class="fa-solid fa-plus"></i> Add Address</button>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        ${savedAddresses.map(addr => `
                            <div style="padding:12px; border:1px solid var(--card-border); border-radius:var(--radius-md); background:var(--background); display:flex; justify-content:space-between; align-items:center;">
                                <div>
                                    <strong style="font-size:13px;"><i class="fa-solid fa-house"></i> ${addr.label}</strong>
                                    <div style="font-size:12px; color:var(--text-muted);">${addr.text}</div>
                                </div>
                                <button class="btn-secondary" style="font-size:11px;" onclick="MediApp.showToast('Address selected as default')">Default</button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Saved Favorite Pharmacies -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:18px;">
                    <h3 style="font-size:16px; margin-bottom:12px;"><i class="fa-solid fa-heart" style="color:var(--emergency-red);"></i> Favorite Pharmacies</h3>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        ${favoritePharmacies.length === 0 ? `
                            <div style="font-size:12px; color:var(--text-muted);">No favorite pharmacies saved yet. Click the heart icon on any pharmacy to save it.</div>
                        ` : favoritePharmacies.map(p => `
                            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--card-border); padding-bottom:8px;">
                                <div>
                                    <strong>${p.shop_name}</strong>
                                    <div style="font-size:12px; color:var(--text-muted);">${p.address}</div>
                                </div>
                                <button class="btn-secondary" onclick="MediApp.viewPharmacyDetails('${p.id}')">Visit Store</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </main>
            ${this.renderBottomNav()}
        `;
    }
}
