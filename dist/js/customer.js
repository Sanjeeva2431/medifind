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
        this.pharmacySearchQuery = '';
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
        if (tab === 'emergency') return this.renderEmergencyPage();
        return this.renderHome();
    }

    // 1. Home Feed
    renderHome() {
        const userLoc = googleMapsService.getUserLocation();
        const locState = googleMapsService.getLocationState();
        const pharmacies = googleMapsService.getPharmacies();
        const isSearchingGoogle = googleMapsService.isSearchingGoogle;
        const googleApiError = googleMapsService.googleApiError;

        // Evaluate dynamic 30-minute delivery time status for all orders
        (this.app.state.orders || []).forEach(o => {
            if (o && o.order_status !== 'Cancelled' && o.order_status !== 'Delivered') {
                const elapsedMins = (Date.now() - new Date(o.created_at || Date.now()).getTime()) / 60000;
                if (elapsedMins >= 30) {
                    o.order_status = 'Delivered';
                    o.tracking_step = 4;
                    o.payment_status = 'Paid';
                } else if (elapsedMins >= 15 && o.tracking_step < 3) {
                    o.order_status = 'Out for Delivery';
                    o.tracking_step = 3;
                } else if (elapsedMins >= 5 && o.tracking_step < 2) {
                    o.order_status = 'Preparing';
                    o.tracking_step = 2;
                }
            }
        });

        const activeOrder = (this.app.state.orders || []).find(o => o.order_status !== 'Delivered' && o.order_status !== 'Cancelled');
        let activeArrivalText = '';
        if (activeOrder) {
            const elapsedMins = Math.floor((Date.now() - new Date(activeOrder.created_at || Date.now()).getTime()) / 60000);
            const remainingMins = Math.max(0, 30 - elapsedMins);
            activeArrivalText = remainingMins > 0 ? `Estimated Arrival in ${remainingMins} mins` : `Delivered 🏠`;
        }

        const cartCount = this.app.getCartCount();

        const serviceability = googleMapsService.isLocationServiceable(userLoc, 15.0);

        return `
            <!-- Top Navbar -->
            <header class="navbar-top">
                <div class="brand-logo" onclick="MediApp.setCustomerTab('home')">
                    <div class="brand-icon"><i class="fa-solid fa-notes-medical"></i></div>
                    <div>
                        <span class="brand-text">MediFind</span>
                        <div style="font-size:9px; color:var(--text-muted); font-weight:600; white-space:nowrap; margin-top:-2px;">Find Medicines. Find Pharmacies. Get Care Faster.</div>
                    </div>
                </div>

                <div class="location-selector" onclick="MediApp.openAddressModal()">
                    <i class="fa-solid fa-location-dot" style="color:var(--primary);"></i>
                    <div>
                        <div class="location-address" style="font-weight:700;">${userLoc.label}</div>
                    </div>
                    <i class="fa-solid fa-chevron-down" style="font-size:10px; opacity:0.6; margin-left:4px;"></i>
                </div>

                <div class="nav-actions">
                    <button class="icon-btn" onclick="MediApp.openNotificationsModal()" title="Notifications">
                        <i class="fa-solid fa-bell"></i>
                    </button>
                    <button class="icon-btn" onclick="MediApp.setCustomerTab('cart')" title="Cart" style="position:relative;">
                        <i class="fa-solid fa-cart-shopping"></i>
                        ${cartCount > 0 ? `<span class="cart-badge">${cartCount}</span>` : ''}
                    </button>
                </div>
            </header>

            <main class="main-content">
                ${!serviceability.serviceable ? `
                    <!-- Serviceability Restriction Alert Banner -->
                    <div style="background:var(--emergency-light); border:1px solid var(--emergency-red); border-radius:var(--radius-lg); padding:14px 18px; margin-bottom:20px; color:var(--emergency-red); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; box-shadow:var(--shadow-sm);">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <i class="fa-solid fa-circle-exclamation" style="font-size:22px;"></i>
                            <div>
                                <div style="font-weight:800; font-size:14px;">The location is currently not serviceable</div>
                                <div style="font-size:11px; font-weight:600; opacity:0.9;">Delivery is available only within a 15 km radius of our medicine supply store.</div>
                            </div>
                        </div>
                        <button class="btn-secondary" style="font-size:11px; padding:6px 12px; border-color:var(--emergency-red); color:var(--emergency-red);" onclick="MediApp.detectLiveLocation()">
                            <i class="fa-solid fa-location-crosshairs"></i> Change Location
                        </button>
                    </div>
                ` : ''}
                ${activeOrder ? `
                    <!-- Active Live Order Banner -->
                    <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color:white; border-radius:var(--radius-lg); padding:16px 20px; display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; box-shadow:var(--shadow-md);">
                        <div>
                            <div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; font-weight:800;">ACTIVE LIVE ORDER (30-MIN DELIVERY)</div>
                            <div style="font-size:16px; font-weight:800;">${activeOrder.id} - ${activeOrder.order_status}</div>
                            <div style="font-size:12px; opacity:0.9;">${activeArrivalText} • Driver: ${activeOrder.delivery_partner?.name || 'Rohan Verma'}</div>
                        </div>
                        <button class="emergency-btn" onclick="MediApp.openTrackingModal('${activeOrder.id}')">
                            <i class="fa-solid fa-map-location-dot"></i> Live Track
                        </button>
                    </div>
                ` : ''}

                <!-- Medical Store Finder Banner (Google Maps Integration) -->
                <section style="margin-bottom: 24px;">
                    <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color:white; border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-md); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;">
                        <div style="flex:1; min-width:240px;">
                            <div style="display:flex; align-items:center; gap:8px; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:1px; color:#e0f2fe; margin-bottom:4px;">
                                <i class="fa-solid fa-map-location-dot"></i> REAL-TIME GOOGLE MAPS RADAR
                            </div>
                            <h3 style="font-size:20px; font-weight:800; margin-bottom:6px;">Medical Store Finder</h3>
                            <p style="font-size:13px; opacity:0.95; line-height:1.4;">Discover all verified medical stores and chemists nearby your current location in real-time with Google Maps navigation.</p>
                            <div style="font-size:12px; font-weight:700; margin-top:8px; background:rgba(255,255,255,0.2); display:inline-block; padding:4px 12px; border-radius:20px;">
                                📍 ${userLoc.label}
                            </div>
                        </div>
                        <div style="display:flex; align-items:center;">
                            <a href="${googleMapsService.getGoogleMapsSearchUrl(userLoc.lat, userLoc.lng)}" target="_blank" class="add-cart-btn" style="background:white; color:#0284c7; font-weight:800; text-decoration:none; padding:12px 20px; font-size:14px; box-shadow:var(--shadow-sm); white-space:nowrap;">
                                <i class="fa-brands fa-google"></i> Open in Google Maps
                            </a>
                        </div>
                    </div>
                </section>

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

                <!-- Popular Medicines Grid -->
                <section>
                    <div class="section-header">
                        <h3 class="section-title"><i class="fa-solid fa-fire" style="color:var(--warning-amber);"></i> Trending Medicines</h3>
                        <span class="see-all-link" onclick="MediApp.setCustomerTab('search')">Browse All</span>
                    </div>
                    <div class="cards-grid">
                        ${this.renderMedicineCards((this.app.state.medicines || []).slice(0, 8))}
                    </div>
                </section>
            </main>

            ${this.renderBottomNav()}
        `;
    }

    // Render Location State & Permission Banner
    renderLocationStateBanner(locState, userLoc) {
        if (locState.status === 'detecting') {
            return `
                <div style="background:var(--primary-light); color:var(--primary); border-radius:var(--radius-md); padding:12px 16px; margin-bottom:12px; display:flex; align-items:center; justify-content:space-between;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <i class="fa-solid fa-circle-notch fa-spin" style="font-size:18px;"></i>
                        <span style="font-weight:700; font-size:13px;">📍 Finding your location...</span>
                    </div>
                </div>
            `;
        }

        if (locState.status === 'denied') {
            return `
                <div style="background:var(--card-bg); border:1px solid var(--emergency-red); border-radius:var(--radius-md); padding:16px; margin-bottom:16px; box-shadow:var(--shadow-sm);">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">
                        <i class="fa-solid fa-location-crosshairs" style="font-size:24px; color:var(--emergency-red);"></i>
                        <div>
                            <strong style="font-size:14px; color:var(--text-main);">Location access is required to find pharmacies near you.</strong>
                            <div style="font-size:12px; color:var(--text-muted);">Please grant permission or enter your location manually to discover nearby medical stores.</div>
                        </div>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="add-cart-btn" style="padding:8px 14px; font-size:12px;" onclick="MediApp.detectLiveLocation()">
                            <i class="fa-solid fa-location-arrow"></i> Allow Location
                        </button>
                        <button class="btn-secondary" style="padding:8px 14px; font-size:12px;" onclick="MediApp.openAddressModal()">
                            <i class="fa-solid fa-pen-to-square"></i> Enter Location Manually
                        </button>
                    </div>
                </div>
            `;
        }

        if (locState.status === 'error') {
            return `
                <div style="background:var(--card-bg); border:1px solid var(--warning-amber); border-radius:var(--radius-md); padding:16px; margin-bottom:16px; box-shadow:var(--shadow-sm);">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">
                        <i class="fa-solid fa-triangle-exclamation" style="font-size:24px; color:var(--warning-amber);"></i>
                        <div>
                            <strong style="font-size:14px; color:var(--text-main);">Unable to detect your current location.</strong>
                            <div style="font-size:12px; color:var(--text-muted);">${locState.errorMessage || 'Please check your GPS or browser location permissions.'}</div>
                        </div>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="add-cart-btn" style="padding:8px 14px; font-size:12px;" onclick="MediApp.detectLiveLocation()">
                            <i class="fa-solid fa-rotate-right"></i> Try Again
                        </button>
                        <button class="btn-secondary" style="padding:8px 14px; font-size:12px;" onclick="MediApp.openAddressModal()">
                            <i class="fa-solid fa-pen-to-square"></i> Enter Location Manually
                        </button>
                    </div>
                </div>
            `;
        }

        // Granted / Active GPS Location Filter Banner
        return `
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:white; border-radius:var(--radius-lg); padding:16px 20px; display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; box-shadow:var(--shadow-md); border:1px solid rgba(255,255,255,0.1);">
                <div>
                    <div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; font-weight:800; color:var(--primary);">REAL-TIME GPS LOCATION</div>
                    <div style="font-size:15px; font-weight:800; margin-top:2px;">📍 ${userLoc.label} ${userLoc.accuracy ? `<span style="font-size:11px; opacity:0.7; font-weight:normal;">(±${userLoc.accuracy}m)</span>` : ''}</div>
                    <div style="font-size:11px; opacity:0.8; margin-top:2px;">Showing real pharmacies & stock sorted strictly by distance</div>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="add-cart-btn" style="background:var(--primary); color:white; padding:8px 12px; font-size:12px;" onclick="MediApp.detectLiveLocation()">
                        <i class="fa-solid fa-location-crosshairs"></i> Refresh GPS
                    </button>
                    <button class="btn-secondary" style="background:rgba(255,255,255,0.1); color:white; padding:8px 12px; font-size:12px; border:none;" onclick="MediApp.openAddressModal()">
                        Change
                    </button>
                </div>
            </div>
        `;
    }

    // 2. All Pharmacies Page (/pharmacies)
    renderPharmaciesPage() {
        const userLoc = googleMapsService.getUserLocation();
        const pharmacies = googleMapsService.getPharmacies();
        const isSearchingGoogle = googleMapsService.isSearchingGoogle;

        const query = (this.pharmacySearchQuery || '').toLowerCase();
        const filteredPharmacies = pharmacies.filter(p => 
            !query || (p.shop_name || '').toLowerCase().includes(query) || (p.address || '').toLowerCase().includes(query)
        );

        return `
            <header class="navbar-top">
                <button class="icon-btn" onclick="MediApp.setCustomerTab('home')"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 style="font-size:18px; flex:1;">Medical Store Finder (${filteredPharmacies.length})</h2>
                <a href="${googleMapsService.getGoogleMapsSearchUrl(userLoc.lat, userLoc.lng)}" target="_blank" class="add-cart-btn" style="font-size:11px; padding:6px 10px; text-decoration:none; white-space:nowrap;">
                    <i class="fa-brands fa-google"></i> Open in Google Maps
                </a>
            </header>

            <main class="main-content">
                <!-- User Live Location Status Banner -->
                <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:white; border-radius:var(--radius-lg); padding:14px 18px; display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; box-shadow:var(--shadow-sm); flex-wrap:wrap; gap:10px;">
                    <div>
                        <div style="font-size:10px; text-transform:uppercase; letter-spacing:1px; font-weight:800; color:#38bdf8;">YOUR CURRENT LOCATION</div>
                        <div style="font-size:14px; font-weight:800; margin-top:2px;">📍 ${userLoc.label}</div>
                        <div style="font-size:11px; opacity:0.8; margin-top:2px;">Showing medical stores strictly relative to your GPS coordinates</div>
                    </div>
                    <button class="add-cart-btn" style="background:var(--primary); color:white; padding:8px 14px; font-size:12px; font-weight:800;" onclick="MediApp.detectLiveLocation()">
                        <i class="fa-solid fa-location-crosshairs"></i> Use My Live Location
                    </button>
                </div>

                <!-- Interactive Real-Time Map Container -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:12px; margin-bottom:20px; box-shadow:var(--shadow-sm);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-size:13px; font-weight:800; color:var(--primary);"><i class="fa-solid fa-map-location-dot"></i> Live Google Maps Radar • ${userLoc.label}</span>
                        <div style="display:flex; gap:6px;">
                            <button class="btn-secondary" style="font-size:11px; padding:3px 8px;" onclick="MediApp.detectLiveLocation()"><i class="fa-solid fa-location-crosshairs"></i> Refresh GPS</button>
                            <a href="${googleMapsService.getGoogleMapsSearchUrl(userLoc.lat, userLoc.lng)}" target="_blank" class="btn-secondary" style="font-size:11px; padding:3px 8px; text-decoration:none; color:var(--primary); font-weight:700;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Maps</a>
                        </div>
                    </div>
                    <div id="nearbyPharmaciesMapCanvas" style="height:230px; width:100%; border-radius:var(--radius-md); overflow:hidden; border:1px solid var(--card-border);"></div>
                </div>

                ${isSearchingGoogle ? `
                    <div style="text-align:center; padding:40px 20px; color:var(--text-muted);">
                        <i class="fa-solid fa-spinner fa-spin" style="font-size:32px; color:var(--primary); margin-bottom:12px;"></i>
                        <h3>🔎 Scanning nearby medical stores around your location...</h3>
                    </div>
                ` : `
                    <div style="display:flex; flex-direction:column; gap:14px;">
                        ${filteredPharmacies.length === 0 ? `
                            <div style="text-align:center; padding:36px 20px; background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:white; border-radius:var(--radius-lg); box-shadow:var(--shadow-md);">
                                <i class="fa-solid fa-map-location-dot" style="font-size:44px; color:#38bdf8; margin-bottom:12px;"></i>
                                <h3 style="font-size:20px; font-weight:800; margin-bottom:6px;">Find Medical Stores Near You on Google Maps</h3>
                                <p style="font-size:13px; opacity:0.9; margin-bottom:18px; max-width:440px; margin-left:auto; margin-right:auto; line-height:1.4;">
                                    View all open chemists, drugstores, and medical shops around your location (📍 ${userLoc.label}) with live Google Maps directions and contact info.
                                </p>
                                <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
                                    <a href="${googleMapsService.getGoogleMapsSearchUrl(userLoc.lat, userLoc.lng)}" target="_blank" class="add-cart-btn" style="background:#0ea5e9; color:white; font-weight:800; padding:12px 22px; font-size:13px; text-decoration:none; justify-content:center;">
                                        <i class="fa-brands fa-google"></i> Open Google Maps Finder
                                    </a>
                                    <button class="btn-secondary" style="background:rgba(255,255,255,0.1); color:white; border:1px solid rgba(255,255,255,0.3); font-weight:700; padding:12px 18px; font-size:13px;" onclick="MediApp.detectLiveLocation()">
                                        <i class="fa-solid fa-location-crosshairs"></i> Refresh GPS
                                    </button>
                                </div>
                            </div>
                        ` : filteredPharmacies.map(p => {
                            const isFav = (this.app.state.favoritePharmacies || []).includes(p.id);
                            return `
                                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:16px; display:flex; flex-direction:column; gap:12px; box-shadow:var(--shadow-sm); cursor:pointer;"
                                     onclick="MediApp.viewPharmacyDetails('${p.id}')">
                                    <div style="display:flex; gap:14px; align-items:flex-start;">
                                        <img src="${p.logo}" style="width:64px; height:64px; border-radius:var(--radius-md); object-fit:cover;">
                                        <div style="flex:1;">
                                            <div style="font-weight:700; font-size:16px; display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                                                <span>${p.shop_name} <i class="fa-solid fa-circle-check" style="color:var(--primary); font-size:14px;" title="Verified Pharmacy License"></i></span>
                                                <button class="icon-btn" style="padding:4px; color:${isFav ? 'var(--emergency-red)' : 'var(--text-muted)'};" onclick="event.stopPropagation(); MediApp.toggleFavoritePharmacy('${p.id}')">
                                                    <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
                                                </button>
                                            </div>
                                            <div style="font-size:12px; color:var(--text-muted); margin-bottom:6px;"><i class="fa-solid fa-location-dot" style="color:var(--primary);"></i> ${p.address}</div>
                                            <div style="display:flex; gap:8px; font-size:12px; align-items:center; flex-wrap:wrap;">
                                                <span style="background:var(--warning-light); color:var(--warning-amber); padding:2px 8px; border-radius:4px; font-weight:700;"><i class="fa-solid fa-star"></i> ${p.rating || 4.7} ${p.reviews_count ? `(${p.reviews_count})` : ''}</span>
                                                <span style="background:var(--primary-light); color:var(--primary); padding:2px 8px; border-radius:4px; font-weight:700;"><i class="fa-solid fa-route"></i> ${p.distance || '0.8 km'} away</span>
                                                <span style="background:var(--secondary-light); color:var(--secondary); padding:2px 8px; border-radius:4px; font-weight:700;"><i class="fa-solid fa-bolt"></i> ${p.delivery_time || '15-20 mins'}</span>
                                                <span style="font-weight:800; color:${p.status === 'open' ? 'var(--secondary)' : 'var(--emergency-red)'};">${p.status === 'open' ? '🟢 Open Now' : '🔴 Closed'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="display:flex; gap:10px; border-top:1px solid var(--card-border); padding-top:10px;">
                                        ${p.phone ? `
                                            <a href="tel:${p.phone}" class="btn-secondary" style="flex:1; text-align:center; text-decoration:none; padding:8px; font-size:12px; font-weight:700;" onclick="event.stopPropagation();">
                                                <i class="fa-solid fa-phone"></i> Call Store
                                            </a>
                                        ` : ''}
                                        <a href="${googleMapsService.getDirectionsUrl(p)}" target="_blank" class="add-cart-btn" style="flex:1; text-align:center; text-decoration:none; padding:8px; font-size:12px; justify-content:center;" onclick="event.stopPropagation();">
                                            <i class="fa-solid fa-diamond-turn-right"></i> Get Directions
                                        </a>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `}
            </main>
            ${this.renderBottomNav()}
        `;
    }

    // 3. Pharmacy Details Page (/pharmacy/:id)
    renderPharmacyDetailPage() {
        const pharmacies = googleMapsService.getPharmacies();
        const p = pharmacies.find(item => item.id === this.selectedPharmacyId) || MOCK_PHARMACIES.find(item => item.id === this.selectedPharmacyId) || MOCK_PHARMACIES[0];
        
        // Match inventory from MediFind database
        const pMedicines = (this.app.state.medicines || []).filter(m => m.pharmacy_id === p.id);
        const hasMediFindInventory = pMedicines.length > 0;

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
                            <div style="font-size:12px; font-weight:700; color:var(--primary); margin-bottom:4px;">⭐ ${p.rating} rating</div>
                            ${p.license_number ? `<div style="font-size:11px; color:var(--text-muted);">Drug License: <code>${p.license_number}</code></div>` : ''}
                        </div>
                    </div>

                    <div style="display:flex; gap:10px;">
                        ${p.phone ? `
                            <a href="tel:${p.phone}" class="btn-secondary" style="flex:1; justify-content:center; text-decoration:none; align-items:center;">
                                <i class="fa-solid fa-phone"></i> Call Pharmacy
                            </a>
                        ` : ''}
                        <a href="${googleMapsService.getDirectionsUrl(p)}" target="_blank" class="add-cart-btn" style="flex:1; justify-content:center; text-decoration:none; align-items:center;">
                            <i class="fa-solid fa-diamond-turn-right"></i> Get Directions
                        </a>
                    </div>
                </div>

                <h3 style="font-size:16px; margin-bottom:14px;">MediFind Medicine Inventory Status</h3>
                
                ${hasMediFindInventory ? `
                    <div class="cards-grid">
                        ${this.renderMedicineCards(pMedicines)}
                    </div>
                ` : `
                    <div style="background:var(--card-bg); border:1px dashed var(--card-border); border-radius:var(--radius-md); padding:24px; text-align:center; color:var(--text-muted);">
                        <i class="fa-solid fa-clipboard-question" style="font-size:36px; color:var(--text-muted); margin-bottom:8px;"></i>
                        <h4 style="font-size:15px; color:var(--text-main); margin-bottom:4px;">Medicine availability not available</h4>
                        <p style="font-size:12px;">This pharmacy is discovered via Google Places, but does not currently have registered real-time stock data in MediFind's database.</p>
                    </div>
                `}
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
                    <div style="height:100px; width:100%; border-radius:var(--radius-md); background:linear-gradient(135deg, var(--primary-light) 0%, #e0f2fe 100%); color:var(--primary); display:flex; align-items:center; justify-content:center; margin-bottom:16px; position:relative;">
                        <i class="fa-solid fa-pills" style="font-size:44px;"></i>
                        ${med.requires_prescription ? `<span class="rx-badge">Rx PRESCRIPTION REQUIRED</span>` : ''}
                    </div>

                    <h1 style="font-size:22px; margin-bottom:4px;">${med.name}</h1>
                    <div style="font-size:14px; color:var(--primary); font-weight:700; margin-bottom:12px;">Generic: ${med.generic_name}</div>

                    <div style="display:flex; justify-content:space-between; align-items:center; background:var(--background); padding:12px 16px; border-radius:var(--radius-md); margin-bottom:16px;">
                        <div>
                            <span class="current-price" style="font-size:24px;">₹${med.price.toFixed(2)}</span>
                            <span class="original-price" style="font-size:14px; margin-left:8px;">₹${(med.original_price || med.price * 1.15).toFixed(2)}</span>
                        </div>
                        <span style="color:var(--secondary); font-weight:800; font-size:13px;">In Stock (${med.stock} units)</span>
                    </div>

                    <div style="font-size:13px; line-height:1.6; margin-bottom:16px;">
                        <strong>Description:</strong> ${med.description}<br><br>
                        <strong>Dosage:</strong> ${med.dosage}<br>
                        <strong>Manufacturer:</strong> ${med.manufacturer || 'Certified Pharma'}<br>
                        <strong>Expiry Date:</strong> ${med.expiry_date || '2027-12'}<br>
                        <strong>Side Effects:</strong> ${med.side_effects || 'Mild dizziness, nausea'}
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
        // Always sync cart item prices with live admin-configured prices
        (this.app.state.cart || []).forEach(item => {
            const liveMed = (this.app.state.medicines || []).find(m => m.id === item.id);
            if (liveMed && liveMed.price !== undefined) {
                item.price = liveMed.price;
            }
        });

        const userLoc = googleMapsService.getUserLocation();
        const serviceability = googleMapsService.isLocationServiceable(userLoc, 15.0);

        const subtotal = this.app.state.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const distKm = serviceability.distanceKm || 0;
        const deliveryFee = subtotal > 0 ? parseFloat((distKm * 10).toFixed(2)) : 0;
        const discount = this.app.state.appliedCoupon ? (subtotal * 0.2) : 0;
        const tax = parseFloat((subtotal * 0.05).toFixed(2));
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
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                            <h3 style="font-size:16px;">Items in Cart</h3>
                            <button class="btn-secondary" style="font-size:11px; padding:4px 8px; color:var(--emergency-red);" onclick="MediApp.clearCart()"><i class="fa-solid fa-trash"></i> Clear All</button>
                        </div>
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

                        <!-- Delivery Address Input & Picker Actions -->
                        <div style="margin-bottom:16px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                                <label style="font-size:12px; font-weight:700; color:var(--text-muted);">DELIVERY ADDRESS (MAX 15 KM RADIUS)</label>
                                <div style="display:flex; gap:6px;">
                                    <button class="btn-secondary" style="font-size:11px; padding:2px 8px;" onclick="MediApp.detectLiveLocation()"><i class="fa-solid fa-location-crosshairs"></i> Use GPS</button>
                                    <button class="btn-secondary" style="font-size:11px; padding:2px 8px;" onclick="MediApp.openMapPickerModal()"><i class="fa-solid fa-map-pin"></i> Select Map</button>
                                </div>
                            </div>
                            <input type="text" id="deliveryAddressInput" value="${googleMapsService.getUserLocation().label}" 
                                   oninput="MediApp.validateCheckoutAddress(this.value)"
                                   onchange="MediApp.validateCheckoutAddress(this.value)"
                                   placeholder="Type delivery address or select on map..."
                                   style="width:100%; border:1px solid var(--card-border); padding:10px 14px; border-radius:var(--radius-md); font-size:13px;">
                        </div>

                        <!-- Dynamic Serviceability Alert Box -->
                        <div id="checkoutServiceabilityAlert" style="background:var(--emergency-light); border:1px solid var(--emergency-red); border-radius:var(--radius-md); padding:14px; margin-bottom:16px; color:var(--emergency-red); font-weight:800; font-size:13px; display:${!serviceability.serviceable ? 'flex' : 'none'}; align-items:center; gap:10px;">
                            <i class="fa-solid fa-triangle-exclamation" style="font-size:20px;"></i>
                            <div>
                                <div style="font-size:14px; font-weight:800;">The location is currently not serviceable</div>
                                <div style="font-size:11px; font-weight:600; opacity:0.9; margin-top:2px;">Delivery is available only within a 15 km radius of our medicine supply store.</div>
                            </div>
                        </div>

                        <!-- Bill Summary -->
                        <div style="background:var(--background); padding:14px; border-radius:var(--radius-md); font-size:13px; margin-bottom:20px;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                <span>Subtotal</span><span id="cartSubtotalText">₹${subtotal.toFixed(2)}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                <span>Distance to Store</span><span id="cartDistanceText">${distKm.toFixed(1)} km</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                <span>Delivery Charge (₹10/km)</span><span id="cartDeliveryFeeText">₹${deliveryFee.toFixed(2)}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                <span>Taxes (GST 5% on items)</span><span id="cartTaxText">₹${tax.toFixed(2)}</span>
                            </div>
                            ${discount > 0 ? `
                                <div style="display:flex; justify-content:space-between; margin-bottom:4px; color:var(--secondary);">
                                    <span>Coupon Discount (20%)</span><span>-₹${discount.toFixed(2)}</span>
                                </div>
                            ` : ''}
                            <div style="border-top:1px dashed var(--card-border); margin-top:8px; padding-top:8px; display:flex; justify-content:space-between; font-weight:800; font-size:16px;">
                                <span>Total Amount</span><span id="cartTotalText" style="color:var(--primary);">₹${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button id="placeOrderBtn" data-total="${total.toFixed(2)}" class="add-cart-btn" ${!serviceability.serviceable ? 'disabled style="width:100%; justify-content:center; padding:14px; font-size:15px; opacity:0.5; cursor:not-allowed; background:var(--text-muted); border-color:var(--text-muted);"' : 'style="width:100%; justify-content:center; padding:14px; font-size:16px;"'} onclick="MediApp.simulateRazorpayCheckout(${total})">
                            ${!serviceability.serviceable ? '<i class="fa-solid fa-ban"></i> The location is currently not serviceable' : `<i class="fa-solid fa-lock"></i> Place Order • ₹${total.toFixed(2)}`}
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
            const isGoogleDiscovered = med.isGooglePlaceUnregistered;

            return `
                <div class="med-card" style="display:flex; flex-direction:column; justify-content:space-between; position:relative;">
                    <div>
                        <div class="med-img-wrapper" onclick="MediApp.viewMedicineDetails('${med.id}')" style="display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, var(--primary-light) 0%, #e0f2fe 100%); color:var(--primary); position:relative; min-height:90px; border-radius:var(--radius-md); margin-bottom:10px;">
                            <i class="fa-solid fa-pills" style="font-size:36px;"></i>
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

                        <!-- 5. Stock Status / Google Unregistered Notice -->
                        <div style="font-size:11px; font-weight:700; margin-bottom:8px; color:${isGoogleDiscovered ? 'var(--text-muted)' : (inStock ? 'var(--secondary)' : 'var(--emergency-red)')};">
                            ${isGoogleDiscovered ? '⚠️ Medicine availability not available' : (inStock ? `📦 In Stock (${med.stock} units)` : '📦 Out of Stock')}
                        </div>


                    </div>

                    <!-- 3. Price & Action -->
                    <div class="med-price-row" style="margin-top:auto;">
                        <div class="price-box">
                            <span class="current-price">₹${med.price.toFixed(2)}</span>
                            <span class="original-price">₹${(med.price * 1.15).toFixed(2)}</span>
                        </div>
                        <button class="add-cart-btn" ${(!inStock || isGoogleDiscovered) ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} onclick="MediApp.addToCart('${med.id}')">
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
        return '';
    }

    renderSearchPage() {
        const allMedicines = this.app.state.medicines || [];
        const pharmacies = googleMapsService.getPharmacies();

        this.searchEngine.setDatasets(allMedicines, pharmacies);
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
        const currentUser = this.app.authService.getUser();
        let userOrders = [];

        if (currentUser) {
            const userEmail = (currentUser.email || '').toLowerCase();
            const userName = (currentUser.name || '').toLowerCase();
            const userId = String(currentUser.id || '');

            const filtered = (this.app.state.orders || []).filter(o => {
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

            userOrders = (filtered.length > 0) ? filtered : (this.app.state.orders || []);
        } else {
            userOrders = this.app.state.orders || [];
        }

        const activeOrders = userOrders.filter(o => o.order_status !== 'Delivered' && o.order_status !== 'Cancelled');
        const deliveredOrders = userOrders.filter(o => o.order_status === 'Delivered' || o.order_status === 'Cancelled');
        const totalSpent = userOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

        const renderSingleOrderCard = (o, isActive) => {
            const isCompleted = o.order_status === 'Delivered';
            const isCancelled = o.order_status === 'Cancelled';
            const items = o.items || [];
            const itemsSum = items.reduce((sum, it) => sum + (parseFloat(it.price) || 0) * (parseInt(it.quantity) || 1), 0);
            const deliveryFee = o.delivery_fee !== undefined ? o.delivery_fee : (itemsSum > 0 ? (itemsSum > 200 ? 0 : 25) : 0);
            const tax = o.tax !== undefined ? o.tax : parseFloat((itemsSum * 0.05).toFixed(2));
            const discount = o.discount || 0;
            const computedTotal = parseFloat(Math.max(0, itemsSum + deliveryFee + tax - discount).toFixed(2));

            const total = (o.total_amount && items.length > 0 && Math.abs(o.total_amount - computedTotal) < 0.05) ? o.total_amount : computedTotal;
            o.total_amount = total;
            o.subtotal = itemsSum;
            o.tax = tax;
            o.delivery_fee = deliveryFee;
            const formattedDate = o.created_at ? new Date(o.created_at).toLocaleString() : new Date().toLocaleString();

            return `
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:18px; box-shadow:var(--shadow-sm); margin-bottom:14px;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; border-bottom:1px solid var(--card-border); padding-bottom:12px;">
                        <div>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="font-weight:800; color:var(--primary); font-size:16px;">${o.id}</span>
                                <span style="font-size:11px; background:var(--background); padding:2px 6px; border-radius:var(--radius-sm); border:1px solid var(--card-border); color:var(--text-muted); font-weight:600;">${o.payment_method || 'UPI'}</span>
                            </div>
                            <div style="font-size:11px; color:var(--text-muted); margin-top:4px;"><i class="fa-regular fa-clock"></i> ${formattedDate}</div>
                        </div>
                        <span class="role-badge-btn" style="background:${isCancelled ? 'var(--emergency-light)' : isCompleted ? 'var(--secondary-light)' : 'var(--primary-light)'}; color:${isCancelled ? 'var(--emergency-red)' : isCompleted ? 'var(--secondary)' : 'var(--primary)'}; font-weight:700;">
                            ${isActive ? '<i class="fa-solid fa-circle-dot fa-spin" style="margin-right:4px;"></i>' : ''}${o.order_status}
                        </span>
                    </div>

                    <div style="font-size:13px; margin-bottom:14px; background:var(--background); padding:12px; border-radius:var(--radius-md); border:1px solid var(--card-border);">
                        <div style="font-size:11px; font-weight:700; color:var(--text-muted); margin-bottom:6px; text-transform:uppercase;">ORDER ITEMS (${items.length})</div>
                        ${items.map(it => `
                            <div style="display:flex; justify-content:space-between; align-items:center; padding:3px 0; font-size:13px;">
                                <span>• <b>${it.quantity || 1}x</b> ${it.name}</span>
                                <span style="font-weight:600;">₹${((it.price || 0) * (it.quantity || 1)).toFixed(2)}</span>
                            </div>
                        `).join('')}
                        <div style="margin-top:10px; padding-top:8px; border-top:1px dashed var(--card-border); display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:12px; color:var(--text-muted);">Payment: <b>${o.payment_status || 'Paid'}</b></span>
                            <span style="font-size:15px; font-weight:800; color:var(--text-main);">Total: ₹${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end;">
                        ${isActive ? `
                            <button class="add-cart-btn" style="font-size:12px; padding:6px 14px;" onclick="MediApp.openTrackingModal('${o.id}')">
                                <i class="fa-solid fa-map-location-dot"></i> Track Live Delivery
                            </button>
                            <button class="btn-secondary" style="color:var(--emergency-red); font-size:12px; padding:6px 12px;" onclick="MediApp.cancelOrder('${o.id}')">
                                <i class="fa-solid fa-ban"></i> Cancel Order
                            </button>
                        ` : `
                            <button class="btn-secondary" style="font-size:12px; padding:6px 12px;" onclick="MediApp.openGstInvoiceModal('${o.id}')">
                                <i class="fa-solid fa-file-invoice"></i> GST Invoice
                            </button>
                            <button class="add-cart-btn" style="background:var(--secondary); font-size:12px; padding:6px 14px;" onclick="MediApp.reorder('${o.id}')">
                                <i class="fa-solid fa-rotate-right"></i> Reorder Items
                            </button>
                        `}
                    </div>
                </div>
            `;
        };

        return `
            <header class="navbar-top">
                <h2 style="font-size:18px; flex:1;"><i class="fa-solid fa-box-archive" style="color:var(--primary);"></i> Orders & History</h2>
                <button class="icon-btn" onclick="MediApp.loadSavedOrders(); MediApp.render();" title="Refresh Orders"><i class="fa-solid fa-rotate-right"></i></button>
                <button class="icon-btn" onclick="MediApp.openNotificationsModal()" title="Notifications"><i class="fa-solid fa-bell"></i></button>
            </header>

            <main class="main-content">
                <!-- Summary Metrics Bar -->
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-bottom:20px;">
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:12px; text-align:center;">
                        <div style="font-size:18px; font-weight:800; color:var(--primary);">${userOrders.length}</div>
                        <div style="font-size:11px; color:var(--text-muted); font-weight:600;">Total Orders</div>
                    </div>
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:12px; text-align:center;">
                        <div style="font-size:18px; font-weight:800; color:var(--secondary);">${activeOrders.length}</div>
                        <div style="font-size:11px; color:var(--text-muted); font-weight:600;">Active Live</div>
                    </div>
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:12px; text-align:center;">
                        <div style="font-size:18px; font-weight:800; color:var(--warning-amber);">₹${totalSpent.toFixed(0)}</div>
                        <div style="font-size:11px; color:var(--text-muted); font-weight:600;">Total Spent</div>
                    </div>
                </div>

                ${userOrders.length === 0 ? `
                    <div style="text-align:center; padding:60px 20px; background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg);">
                        <i class="fa-solid fa-box-open" style="font-size:48px; color:var(--text-muted); margin-bottom:12px;"></i>
                        <h3 style="font-size:16px; margin-bottom:4px; color:var(--text-main);">No Orders Placed Yet</h3>
                        <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">Your order history will appear here automatically once you place your first medicine order.</p>
                        <button class="add-cart-btn" style="margin:0 auto; padding:10px 20px; font-size:14px;" onclick="MediApp.setCustomerTab('home')">
                            <i class="fa-solid fa-pills"></i> Browse Medicines & Order
                        </button>
                    </div>
                ` : `
                    <!-- SECTION 1: Active Live Orders (Not Delivered) -->
                    <div style="margin-bottom:28px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                            <h3 style="font-size:16px; font-weight:800; display:flex; align-items:center; gap:8px; color:var(--primary);">
                                <i class="fa-solid fa-truck-fast"></i> Active Orders (${activeOrders.length})
                            </h3>
                            <span style="font-size:11px; background:var(--primary-light); color:var(--primary); padding:3px 8px; border-radius:var(--radius-full); font-weight:700;">
                                In-Progress & Live Delivery
                            </span>
                        </div>

                        ${activeOrders.length === 0 ? `
                            <div style="padding:20px; background:var(--card-bg); border:1px dashed var(--card-border); border-radius:var(--radius-md); text-align:center; color:var(--text-muted); font-size:13px;">
                                No active undelivered orders right now.
                            </div>
                        ` : `
                            ${activeOrders.map(o => renderSingleOrderCard(o, true)).join('')}
                        `}
                    </div>

                    <!-- SECTION 2: Order History (Delivered & Completed) -->
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                            <h3 style="font-size:16px; font-weight:800; display:flex; align-items:center; gap:8px; color:var(--text-main);">
                                <i class="fa-solid fa-clock-rotate-left" style="color:var(--secondary);"></i> Order History (${deliveredOrders.length})
                            </h3>
                            <span style="font-size:11px; background:var(--secondary-light); color:var(--secondary); padding:3px 8px; border-radius:var(--radius-full); font-weight:700;">
                                Delivered & Completed Orders
                            </span>
                        </div>

                        ${deliveredOrders.length === 0 ? `
                            <div style="padding:20px; background:var(--card-bg); border:1px dashed var(--card-border); border-radius:var(--radius-md); text-align:center; color:var(--text-muted); font-size:13px;">
                                No past delivered orders yet.
                            </div>
                        ` : `
                            ${deliveredOrders.map(o => renderSingleOrderCard(o, false)).join('')}
                        `}
                    </div>
                `}
            </main>
            ${this.renderBottomNav()}
        `;
    }

    renderProfilePage() {
        const user = this.app.authService.getUser() || { name: 'Customer User', email: 'user@example.com', phone: '+91 98765 43210' };
        const savedAddresses = this.app.state.savedAddresses || [];
        const pharmacies = googleMapsService.getPharmacies();
        const favoritePharmacies = pharmacies.filter(p => (this.app.state.favoritePharmacies || []).includes(p.id));

        return `
            <header class="navbar-top">
                <h2 style="font-size:18px; flex:1;">My Customer Account</h2>
                <button class="icon-btn" onclick="MediApp.openNotificationsModal()"><i class="fa-solid fa-bell"></i></button>
            </header>

            <main class="main-content">
                <!-- User Profile Card -->
                <div style="background:var(--card-bg); padding:20px; border-radius:var(--radius-lg); border:1px solid var(--card-border); display:flex; align-items:center; gap:16px; margin-bottom:20px; box-shadow:var(--shadow-sm);">
                    <div style="width:64px; height:64px; border-radius:var(--radius-full); background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; font-size:28px; flex-shrink:0; border:2px solid var(--primary);">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <div style="flex:1;">
                        <h3 style="font-size:18px; margin-bottom:2px; font-weight:700;">${user ? user.name : 'Customer User'}</h3>
                        <div style="font-size:12px; color:var(--text-muted);">${user ? user.phone : ''} • ${user ? user.email : ''}</div>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <button class="add-cart-btn" style="padding:6px 12px; font-size:12px;" onclick="MediApp.openEditProfileModal()"><i class="fa-solid fa-user-pen"></i> Edit Profile</button>
                        <button class="btn-secondary" style="color:var(--emergency-red); padding:6px 12px; font-size:11px;" onclick="MediApp.logout()"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
                    </div>
                </div>

                <!-- Profile Options List -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:8px; margin-bottom:20px;">
                    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-bottom:1px solid var(--card-border); cursor:pointer;" onclick="MediApp.openEditProfileModal()">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <i class="fa-solid fa-user-pen" style="color:var(--primary); font-size:18px;"></i>
                            <span style="font-weight:700; font-size:14px;">Edit Profile</span>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                    </div>

                    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-bottom:1px solid var(--card-border); cursor:pointer;" onclick="MediApp.setCustomerTab('orders')">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <i class="fa-solid fa-box-archive" style="color:var(--primary); font-size:18px;"></i>
                            <span style="font-weight:700; font-size:14px;">My Orders History</span>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                    </div>


                    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-bottom:1px solid var(--card-border); cursor:pointer;" onclick="MediApp.openNotificationsModal()">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <i class="fa-solid fa-bell" style="color:#9333ea; font-size:18px;"></i>
                            <span style="font-weight:700; font-size:14px;">Notifications</span>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                    </div>

                    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-bottom:1px solid var(--card-border); cursor:pointer;" onclick="MediApp.openHelpSupportModal()">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <i class="fa-solid fa-circle-question" style="color:#0ea5e9; font-size:18px;"></i>
                            <span style="font-weight:700; font-size:14px;">Help & Support</span>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                    </div>

                    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; cursor:pointer;" onclick="MediApp.openAboutModal()">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <i class="fa-solid fa-circle-info" style="color:var(--text-muted); font-size:18px;"></i>
                            <span style="font-weight:700; font-size:14px;">About MediFind</span>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
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

    // 9. Emergency 24/7 Pharmacy View
    renderEmergencyPage() {
        const userLoc = googleMapsService.getUserLocation();
        const pharmacies = googleMapsService.getPharmacies();

        return `
            <header class="navbar-top">
                <button class="icon-btn" onclick="MediApp.setCustomerTab('home')"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 style="font-size:18px; flex:1; color:var(--emergency-red);"><i class="fa-solid fa-truck-medical"></i> Emergency 24/7 Pharmacies</h2>
                <button class="btn-secondary" style="font-size:11px; padding:4px 8px;" onclick="MediApp.refreshNearbyPharmacies()">
                    <i class="fa-solid fa-arrows-rotate"></i> Refresh
                </button>
            </header>

            <main class="main-content">
                <div style="background:var(--emergency-light); border:1px solid var(--emergency-red); border-radius:var(--radius-md); padding:16px; margin-bottom:20px;">
                    <div style="display:flex; align-items:center; gap:10px; color:var(--emergency-red); font-weight:800; font-size:15px; margin-bottom:4px;">
                        <i class="fa-solid fa-triangle-exclamation"></i> Emergency Medical Support Active
                    </div>
                    <div style="font-size:12px; color:var(--text-body);">
                        Showing open 24/7 verified emergency pharmacies near <strong>${userLoc.label}</strong>. Call directly for urgent medicine supply.
                    </div>
                </div>

                <div style="display:flex; flex-direction:column; gap:14px;">
                    ${pharmacies.map(p => `
                        <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:18px; box-shadow:var(--shadow-sm);">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                                <div style="display:flex; gap:12px; align-items:center;">
                                    <img src="${p.logo}" style="width:54px; height:54px; border-radius:var(--radius-md); object-fit:cover;">
                                    <div>
                                        <div style="font-weight:800; font-size:16px; color:var(--text-main);">${p.shop_name}</div>
                                    </div>
                                </div>
                                <span style="background:var(--secondary-light); color:var(--secondary); font-weight:800; font-size:11px; padding:4px 8px; border-radius:4px; white-space:nowrap;">
                                    🟢 OPEN 24/7
                                </span>
                            </div>

                            <div style="display:flex; justify-content:flex-end; align-items:center; font-size:12px; font-weight:700; color:var(--primary); margin-bottom:14px; background:var(--background); padding:8px 12px; border-radius:var(--radius-sm);">
                                <span>⭐ ${p.rating} (${p.reviews_count || 12} reviews)</span>
                            </div>

                            <div style="display:flex; gap:10px;">
                                ${p.phone ? `
                                    <a href="tel:${p.phone}" class="add-cart-btn" style="flex:1; justify-content:center; text-decoration:none; background:var(--emergency-red); border-color:var(--emergency-red);">
                                        <i class="fa-solid fa-phone"></i> Call Pharmacy
                                    </a>
                                ` : `
                                    <a href="tel:+919876543210" class="add-cart-btn" style="flex:1; justify-content:center; text-decoration:none; background:var(--emergency-red); border-color:var(--emergency-red);">
                                        <i class="fa-solid fa-phone"></i> Call Pharmacy
                                    </a>
                                `}
                                <a href="${googleMapsService.getDirectionsUrl(p)}" target="_blank" class="btn-secondary" style="flex:1; justify-content:center; text-decoration:none; align-items:center;">
                                    <i class="fa-solid fa-diamond-turn-right"></i> Get Directions
                                </a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </main>
            ${this.renderBottomNav()}
        `;
    }
}
