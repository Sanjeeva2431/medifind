// MediFind Admin Control Panel Module (8 Sections: Overview, Users, Pharmacies, Medicines, Orders, Partners, Analytics, Reports)

import { MOCK_PHARMACIES, MOCK_MEDICINES } from './data.js';

export class AdminModule {
    constructor(app) {
        this.app = app;
        const savedTab = (typeof sessionStorage !== 'undefined') ? sessionStorage.getItem('medifind_admin_tab') : null;
        this.activeTab = savedTab || 'medicines';
    }

    render() {
        const savedTab = (typeof sessionStorage !== 'undefined') ? sessionStorage.getItem('medifind_admin_tab') : null;
        if (savedTab) {
            this.activeTab = savedTab;
        }

        const totalRevenue = (this.app.state.orders || []).reduce((sum, o) => sum + (o.total_amount || 0), 0);
        const allOrders = this.app.state.orders || [];
        const usersList = (this.app.state && Array.isArray(this.app.state.usersList)) ? this.app.state.usersList : [];

        // Auto-fetch users & orders if empty when rendering Admin Panel
        if (usersList.length === 0 && !this._fetchingUsers) {
            this._fetchingUsers = true;
            Promise.all([this.app.loadAllUsers(), this.app.loadSavedOrders()]).finally(() => {
                this._fetchingUsers = false;
            });
        }

        if (this.activeTab === 'overview' || this.activeTab === 'analytics' || this.activeTab === 'reports') {
            this.activeTab = 'medicines';
        }

        return `
            <header class="navbar-top">
                <div class="brand-logo">
                    <div class="brand-icon" style="background: linear-gradient(135deg, #0284c7 0%, #0f172a 100%);"><i class="fa-solid fa-user-shield"></i></div>
                    <span class="brand-text">MediFind Admin Control</span>
                </div>
                <div class="top-actions">
                    <button class="role-badge-btn" onclick="MediApp.openRoleModal()">
                        <i class="fa-solid fa-user-gear"></i> Role: ADMIN
                    </button>
                    <button class="icon-btn" onclick="MediApp.toggleTheme()">
                        <i class="fa-solid ${this.app.state.darkMode ? 'fa-sun' : 'fa-moon'}"></i>
                    </button>
                </div>
            </header>

            <main class="main-content">
                <!-- Navigation Tabs Bar -->
                <div style="display:flex; gap:6px; background:var(--card-bg); padding:8px; border-radius:var(--radius-md); border:1px solid var(--card-border); margin-bottom:20px; overflow-x:auto; scrollbar-width:none;">
                    <button class="btn-secondary ${this.activeTab === 'users' ? 'active' : ''}" 
                            style="${this.activeTab === 'users' ? 'background:var(--primary); color:white; font-weight:700;' : ''}"
                            onclick="MediApp.setAdminTab('users')">
                        <i class="fa-solid fa-users"></i> Users (${usersList.length})
                    </button>
                    <button class="btn-secondary ${this.activeTab === 'pharmacies' ? 'active' : ''}" 
                            style="${this.activeTab === 'pharmacies' ? 'background:var(--primary); color:white; font-weight:700;' : ''}"
                            onclick="MediApp.setAdminTab('pharmacies')">
                        <i class="fa-solid fa-store-medical"></i> Supply Store
                    </button>
                    <button class="btn-secondary ${this.activeTab === 'medicines' ? 'active' : ''}" 
                            style="${this.activeTab === 'medicines' ? 'background:var(--primary); color:white; font-weight:700;' : ''}"
                            onclick="MediApp.setAdminTab('medicines')">
                        <i class="fa-solid fa-pills"></i> Medicines (${this.app.state.medicines.length})
                    </button>
                    <button class="btn-secondary ${this.activeTab === 'orders' ? 'active' : ''}" 
                            style="${this.activeTab === 'orders' ? 'background:var(--primary); color:white; font-weight:700;' : ''}"
                            onclick="MediApp.setAdminTab('orders')">
                        <i class="fa-solid fa-truck-fast"></i> Orders (${this.app.state.orders.length})
                    </button>
                    <button class="btn-secondary ${this.activeTab === 'partners' ? 'active' : ''}" 
                            style="${this.activeTab === 'partners' ? 'background:var(--primary); color:white; font-weight:700;' : ''}"
                            onclick="MediApp.setAdminTab('partners')">
                        <i class="fa-solid fa-motorcycle"></i> Fleet
                    </button>
                </div>

                ${this.renderActiveTab(totalRevenue, usersList)}
            </main>
        `;
    }

    renderActiveTab(totalRevenue, usersList) {
        // TAB 1: Overview KPIs
        if (this.activeTab === 'overview') {
            return `
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#e0f2fe; color:#0284c7;"><i class="fa-solid fa-chart-line"></i></div>
                        <div>
                            <div class="metric-val">₹${totalRevenue.toFixed(0)}</div>
                            <div class="metric-lbl">Total Gross Revenue</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#dcfce7; color:#16a34a;"><i class="fa-solid fa-store-medical"></i></div>
                        <div>
                            <div class="metric-val">1 Store</div>
                            <div class="metric-lbl">Medicine Supply Store</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#fef3c7; color:#d97706;"><i class="fa-solid fa-pills"></i></div>
                        <div>
                            <div class="metric-val">${this.app.state.medicines.length}</div>
                            <div class="metric-lbl">Master Medicines</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#f3e8ff; color:#9333ea;"><i class="fa-solid fa-truck-fast"></i></div>
                        <div>
                            <div class="metric-val">${this.app.state.orders.length}</div>
                            <div class="metric-lbl">Total Platform Orders</div>
                        </div>
                    </div>
                </div>

                <!-- Admin Action Center Bar -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:16px; margin-bottom:24px; display:flex; gap:12px; flex-wrap:wrap;">
                    <button class="add-cart-btn" onclick="MediApp.setAdminTab('pharmacies')"><i class="fa-solid fa-store-medical"></i> Manage Medicine Supply Store</button>
                    <button class="btn-secondary" onclick="MediApp.setAdminTab('users')"><i class="fa-solid fa-user-shield"></i> Manage User Statuses</button>
                    <button class="btn-secondary" style="color:var(--emergency-red); font-weight:700;" onclick="MediApp.resetAdminOrdersAndRevenue()"><i class="fa-solid fa-rotate-left"></i> Reset Orders & Revenue (₹0)</button>
                    <button class="btn-secondary" onclick="MediApp.generateAdminReport()"><i class="fa-solid fa-download"></i> Export Audit Report</button>
                </div>

                <!-- Revenue Chart Preview -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:20px; margin-bottom:24px;">
                    <h3 style="font-size:16px; margin-bottom:16px;">Platform Order Volume Growth</h3>
                    <canvas id="adminAnalyticsChart" style="max-height:240px; width:100%;"></canvas>
                </div>
            `;
        }

        // TAB 2: User Management (Admin & Users with Placed Orders Only)
        if (this.activeTab === 'users') {
            const allOrders = this.app.state.orders || [];

            return `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
                    <div>
                        <h3 style="font-size:18px;">Active Users & Order Activity (${usersList.length} Accounts)</h3>
                        <p style="font-size:12px; color:var(--text-muted);">Displays System Admin and users with active/completed orders</p>
                    </div>
                    <button class="btn-secondary" style="padding:6px 12px; font-size:12px; font-weight:700;" onclick="MediApp.fetchRealtimeAdminUsers()">
                        <i class="fa-solid fa-rotate"></i> Sync Live Users Data
                    </button>
                </div>

                <div class="data-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>User ID & Name</th>
                                <th>Email & Phone</th>
                                <th>Role</th>
                                <th>Real-Time Orders</th>
                                <th>Total Spend</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${usersList.map(u => {
                                const isSuspended = u.status === 'Suspended';
                                const userOrders = allOrders.filter(o => o.user_id === u.id || (o.customer_name && u.name && o.customer_name.toLowerCase() === u.name.toLowerCase()));
                                const userTotalSpent = userOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
                                return `
                                    <tr>
                                        <td>
                                            <strong>${u.name}</strong><br>
                                            <span style="font-size:10px; color:var(--text-muted); font-family:monospace;">${u.id}</span>
                                        </td>
                                        <td>
                                            <span style="font-size:13px;">${u.email}</span><br>
                                            <span style="font-size:11px; color:var(--text-muted);">${u.phone || '+91 98765 43210'}</span>
                                        </td>
                                        <td>
                                            <span class="role-badge-btn" style="text-transform:uppercase; font-size:10px;">${u.role}</span>
                                        </td>
                                        <td>
                                            <strong style="color:var(--primary);">${userOrders.length} Orders</strong>
                                            ${userOrders.length > 0 ? `
                                                <br><span style="font-size:10px; color:var(--text-muted);">Latest: ${userOrders[0].id}</span>
                                            ` : ''}
                                        </td>
                                        <td>
                                            <strong style="color:var(--secondary); font-size:14px;">₹${userTotalSpent.toFixed(2)}</strong>
                                        </td>
                                        <td>
                                            <span style="font-weight:800; color:${isSuspended ? 'var(--emergency-red)' : 'var(--secondary)'}; font-size:12px;">
                                                ${isSuspended ? 'Suspended 🚫' : 'Active ✅'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style="display:flex; gap:6px;">
                                                <button class="add-cart-btn" style="padding:4px 8px; font-size:11px;" onclick="MediApp.viewUserOrdersModal('${u.id}', '${u.name}')">
                                                    <i class="fa-solid fa-receipt"></i> Orders (${userOrders.length})
                                                </button>
                                                <button class="btn-secondary" style="color:${isSuspended ? 'var(--secondary)' : 'var(--emergency-red)'}; padding:4px 8px; font-size:11px;" onclick="MediApp.toggleUserStatus('${u.id}')">
                                                    <i class="fa-solid ${isSuspended ? 'fa-user-check' : 'fa-user-slash'}"></i> ${isSuspended ? 'Activate' : 'Suspend'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        // TAB 3: Medicine Supply Store Management
        if (this.activeTab === 'pharmacies') {
            return `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
                    <div>
                        <h3 style="font-size:18px;"><i class="fa-solid fa-store-medical" style="color:var(--primary);"></i> Medicine Supply Store Management</h3>
                        <p style="font-size:12px; color:var(--text-muted);">Manage official supply store location, coordinates, delivery radius & pricing rules</p>
                    </div>
                    <a href="https://maps.app.goo.gl/GAJhNha3TsA4P29r7" target="_blank" class="add-cart-btn" style="padding:8px 14px; font-size:12px; text-decoration:none;">
                        <i class="fa-solid fa-map-location-dot"></i> Open Google Maps Link
                    </a>
                </div>

                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:20px; margin-bottom:20px; box-shadow:var(--shadow-sm);">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; flex-wrap:wrap; gap:12px;">
                        <div>
                            <div style="display:flex; align-items:center; gap:10px;">
                                <h2 style="font-size:20px; font-weight:800; color:var(--text-main);">Nazarathpet Medicine Supply Store</h2>
                                <span style="background:var(--secondary-light); color:var(--secondary); padding:2px 8px; border-radius:var(--radius-full); font-size:11px; font-weight:800;">ACTIVE & SERVING ORDERS ✅</span>
                            </div>
                            <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">
                                <i class="fa-solid fa-location-dot" style="color:var(--emergency-red);"></i> Nazarathpet, Thirumazhisai, Poonamallee, Chennai, Tamil Nadu
                            </p>
                        </div>
                        <a href="https://maps.app.goo.gl/GAJhNha3TsA4P29r7" target="_blank" style="font-size:12px; font-weight:700; color:var(--primary); text-decoration:none; display:flex; align-items:center; gap:6px;">
                            <span>https://maps.app.goo.gl/GAJhNha3TsA4P29r7</span>
                            <i class="fa-solid fa-up-right-from-square"></i>
                        </a>
                    </div>

                    <div class="metrics-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-bottom:20px;">
                        <div style="background:var(--background); border:1px solid var(--card-border); padding:14px; border-radius:var(--radius-md);">
                            <div style="font-size:11px; font-weight:700; color:var(--text-muted);">GPS COORDINATES</div>
                            <div style="font-size:14px; font-weight:800; color:var(--primary); margin-top:2px;">13.043913, 80.074262</div>
                        </div>
                        <div style="background:var(--background); border:1px solid var(--card-border); padding:14px; border-radius:var(--radius-md);">
                            <div style="font-size:11px; font-weight:700; color:var(--text-muted);">DELIVERY RADIUS</div>
                            <div style="font-size:14px; font-weight:800; color:var(--secondary); margin-top:2px;">Strictly 15.0 Km</div>
                        </div>
                        <div style="background:var(--background); border:1px solid var(--card-border); padding:14px; border-radius:var(--radius-md);">
                            <div style="font-size:11px; font-weight:700; color:var(--text-muted);">DELIVERY RATE</div>
                            <div style="font-size:14px; font-weight:800; color:var(--primary); margin-top:2px;">₹10.00 / Km</div>
                        </div>
                        <div style="background:var(--background); border:1px solid var(--card-border); padding:14px; border-radius:var(--radius-md);">
                            <div style="font-size:11px; font-weight:700; color:var(--text-muted);">TAX RATE</div>
                            <div style="font-size:14px; font-weight:800; color:var(--text-main); margin-top:2px;">5% GST</div>
                        </div>
                    </div>

                    <div style="border-top:1px dashed var(--card-border); padding-top:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                        <div style="font-size:12px; color:var(--text-muted);">
                            <strong>Drug License:</strong> <code>TN-MED-SUPPLY-2026-908</code> • <strong>Phone:</strong> +91 98765 12345 • <strong>Operating Hours:</strong> 24/7 Open
                        </div>
                        <button class="btn-secondary" style="font-size:12px;" onclick="MediApp.showToast('✅ Supply store configuration updated')">
                            <i class="fa-solid fa-gear"></i> Update Settings
                        </button>
                    </div>
                </div>
            `;
        }

        // TAB 4: Master Medicines Catalog & Price Management
        if (this.activeTab === 'medicines') {
            return `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
                    <div>
                        <h3 style="font-size:18px;">Master Medicines Catalog (${this.app.state.medicines.length} Items)</h3>
                        <p style="font-size:12px; color:var(--text-muted);">Add new medicines, edit prices, and manage stock inventory</p>
                    </div>
                    <button class="add-cart-btn" style="padding:8px 14px; font-size:12px;" onclick="MediApp.openAddMedicineModal()">
                        <i class="fa-solid fa-plus"></i> Add New Medicine
                    </button>
                </div>

                <div class="data-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Brand & Generic Composition</th>
                                <th>Category</th>
                                <th>Manufacturer</th>
                                <th>Unit Price</th>
                                <th>Total Stock</th>
                                <th>Supply Store</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.app.state.medicines.map(m => `
                                <tr id="med_row_${m.id}">
                                    <td><strong>${m.name}</strong><br><span style="font-size:11px; color:var(--primary);">🧪 ${m.generic_name}</span></td>
                                    <td><span style="font-size:11px; background:var(--primary-light); color:var(--primary); padding:2px 6px; border-radius:4px; font-weight:700;">${m.category}</span></td>
                                    <td>${m.manufacturer || 'Micro Labs'}</td>
                                    <td><strong id="med_price_${m.id}" style="color:var(--secondary); font-size:14px;">₹${parseFloat(m.price).toFixed(2)}</strong></td>
                                    <td><span id="med_stock_${m.id}" style="font-weight:800; color:${m.stock < 20 ? 'var(--emergency-red)' : 'var(--text-main)'};">${m.stock} units</span></td>
                                    <td>Nazarathpet Medicine Supply Store</td>
                                    <td>
                                        <div style="display:flex; gap:6px;">
                                            <button type="button" class="add-cart-btn" style="padding:4px 8px; font-size:11px;" onclick="MediApp.openEditMedicinePriceModal('${m.id}')">
                                                <i class="fa-solid fa-pen-to-square"></i> Change Price & Stock
                                            </button>
                                            <button type="button" class="btn-secondary" style="color:var(--emergency-red); padding:4px 8px; font-size:11px;" onclick="MediApp.deleteMedicine('${m.id}')">
                                                <i class="fa-solid fa-trash"></i> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        // TAB 5: Platform Orders Stream
        if (this.activeTab === 'orders') {
            const allOrders = this.app.state.orders || [];

            return `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
                    <div>
                        <h3 style="font-size:18px;">Platform Live Orders Stream (${allOrders.length} Orders)</h3>
                        <p style="font-size:12px; color:var(--text-muted);">Real-time stream of all platform orders across customers and pharmacies</p>
                    </div>
                    <button class="btn-secondary" style="padding:6px 12px; font-size:12px; font-weight:700;" onclick="MediApp.loadSavedOrders(); MediApp.render();">
                        <i class="fa-solid fa-rotate"></i> Sync Live Orders Data
                    </button>
                </div>

                ${allOrders.length === 0 ? `
                    <div style="padding:40px; background:var(--card-bg); border:1px dashed var(--card-border); border-radius:var(--radius-lg); text-align:center; color:var(--text-muted);">
                        <i class="fa-solid fa-box-open" style="font-size:36px; margin-bottom:12px; color:var(--primary);"></i>
                        <h4 style="font-size:16px; color:var(--text-main); margin-bottom:4px;">No Orders in Live Stream</h4>
                        <p style="font-size:12px; max-width:400px; margin:0 auto 16px auto;">New customer orders will appear here automatically via WebSockets in real time.</p>
                        <button class="add-cart-btn" style="margin:0 auto; padding:8px 16px; font-size:13px;" onclick="MediApp.loadSavedOrders(); MediApp.render();">
                            <i class="fa-solid fa-sync"></i> Refresh Orders Stream
                        </button>
                    </div>
                ` : `
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        ${allOrders.map(o => {
                            const items = o.items || [];
                            const total = o.total_amount || 0;
                            return `
                                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:16px; display:flex; justify-content:space-between; align-items:center; box-shadow:var(--shadow-sm);">
                                    <div>
                                        <strong style="color:var(--primary); font-size:15px;">${o.id}</strong>
                                        <span style="font-size:12px; color:var(--text-muted); margin-left:8px;">Customer: <b>${o.customer_name || o.user_id}</b> • Pharmacy: <b>${o.pharmacy_name || 'Apollo Pharmacy'}</b></span>
                                        <div style="font-size:12px; margin-top:6px; background:var(--background); padding:6px 10px; border-radius:var(--radius-sm); border:1px solid var(--card-border);">
                                            Items: ${items.map(it => `<b>${it.quantity || 1}x</b> ${it.name}`).join(', ')}
                                        </div>
                                    </div>
                                    <div style="text-align:right;">
                                        <div style="font-weight:800; font-size:16px; color:var(--secondary);">₹${total.toFixed(2)}</div>
                                        <span class="role-badge-btn" style="margin-top:4px; display:inline-block;">${o.order_status}</span>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `}
            `;
        }

        // TAB 6: Delivery Fleet Partners
        if (this.activeTab === 'partners') {
            const partners = [
                { id: 'partner_1', name: 'Rohan Verma', vehicle: 'Hero Splendor (KA-01-EQ-9982)', phone: '+91 98112 33445', rating: 4.9, active: true, deliveries: 482 },
                { id: 'partner_2', name: 'Vikram Patel', vehicle: 'TVS NTORQ (UP-16-BD-1122)', phone: '+91 98222 55667', rating: 4.7, active: true, deliveries: 310 }
            ];

            return `
                <h3 style="font-size:18px; margin-bottom:16px;">Delivery Fleet Management</h3>
                <div class="data-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Driver Name</th>
                                <th>Vehicle Details</th>
                                <th>Phone</th>
                                <th>Rating</th>
                                <th>Completed Deliveries</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${partners.map(dp => `
                                <tr>
                                    <td><strong>${dp.name}</strong></td>
                                    <td>${dp.vehicle}</td>
                                    <td>${dp.phone}</td>
                                    <td><span class="star-rating"><i class="fa-solid fa-star"></i> ${dp.rating}</span></td>
                                    <td><strong>${dp.deliveries} orders</strong></td>
                                    <td><span style="color:var(--secondary); font-weight:800;">● Active Duty</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        // TAB 7: Financial Analytics & Growth
        if (this.activeTab === 'analytics') {
            return `
                <h3 style="font-size:18px; margin-bottom:16px;">Platform Financial & Revenue Analytics</h3>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:20px;">
                        <h4 style="font-size:14px; margin-bottom:14px;">Monthly Revenue Growth (₹)</h4>
                        <canvas id="adminAnalyticsChart" style="max-height:240px; width:100%;"></canvas>
                    </div>
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:20px;">
                        <h4 style="font-size:14px; margin-bottom:14px;">Payment Method Distribution</h4>
                        <canvas id="adminPaymentChart" style="max-height:240px; width:100%;"></canvas>
                    </div>
                </div>
            `;
        }

        // TAB 8: Reports Exporter
        if (this.activeTab === 'reports') {
            return `
                <h3 style="font-size:18px; margin-bottom:16px;">Platform Audit Reports & Exporter</h3>
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:24px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                        <div>
                            <h4 style="font-size:16px;">Financial & Compliance Audit Report</h4>
                            <p style="font-size:12px; color:var(--text-muted);">Generate platform audit report with revenue logs and pharmacy compliance metrics.</p>
                        </div>
                        <button class="add-cart-btn" onclick="MediApp.generateAdminReport()"><i class="fa-solid fa-file-pdf"></i> Generate Audit Report</button>
                    </div>

                    <div style="background:var(--background); padding:16px; border-radius:var(--radius-md); font-size:13px;">
                        <strong>Report Summary Parameters:</strong>
                        <ul style="margin-top:8px; padding-left:20px;">
                            <li>Gross Platform Revenue: <b>₹${totalRevenue.toFixed(2)}</b></li>
                            <li>Registered Pharmacies: <b>${this.app.state.pharmacies.length} Stores</b></li>
                            <li>Master Medicine SKU Catalog: <b>${this.app.state.medicines.length} Medicines</b></li>
                            <li>Processed Orders Count: <b>${this.app.state.orders.length} Orders</b></li>
                        </ul>
                    </div>
                </div>
            `;
        }
    }

    initCharts() {
        if (this.activeTab !== 'overview' && this.activeTab !== 'analytics') return;
        const mainCtx = document.getElementById('adminAnalyticsChart');
        const payCtx = document.getElementById('adminPaymentChart');

        if (mainCtx && typeof Chart !== 'undefined') {
            new Chart(mainCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                    datasets: [{
                        label: 'Monthly Platform Volume (₹)',
                        data: [120000, 190000, 300000, 500000, 420000, 680000, 890000],
                        backgroundColor: '#0284c7',
                        borderRadius: 6
                    }]
                },
                options: { responsive: true, plugins: { legend: { display: false } } }
            });
        }

        if (payCtx && typeof Chart !== 'undefined') {
            new Chart(payCtx, {
                type: 'pie',
                data: {
                    labels: ['UPI (GPay/PhonePe)', 'Credit/Debit Card', 'Cash on Delivery'],
                    datasets: [{
                        data: [65, 25, 10],
                        backgroundColor: ['#22c55e', '#0ea5e9', '#f59e0b']
                    }]
                },
                options: { responsive: true }
            });
        }
    }
}
