// MediFind Admin Control Panel Module (8 Sections: Overview, Users, Pharmacies, Medicines, Orders, Partners, Analytics, Reports)

import { MOCK_PHARMACIES, MOCK_MEDICINES } from './data.js';

export class AdminModule {
    constructor(app) {
        this.app = app;
        this.activeTab = 'overview'; // overview, users, pharmacies, medicines, orders, partners, analytics, reports
    }

    render() {
        const totalRevenue = this.app.state.orders.reduce((sum, o) => sum + o.total_amount, 0);
        const usersList = this.app.state.usersList || [
            { id: 'usr_1', name: 'Alex Johnson', email: 'alex@example.com', role: 'customer', status: 'Active' },
            { id: 'usr_2', name: 'Priya Sharma', email: 'priya@example.com', role: 'customer', status: 'Active' },
            { id: 'usr_pharm_1', name: 'Dr. S. K. Gupta', email: 'apollo@example.com', role: 'pharmacy', status: 'Active' },
            { id: 'usr_driver_1', name: 'Rohan Verma', email: 'rohan@example.com', role: 'delivery', status: 'Active' }
        ];

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
                <!-- Navigation Tabs Bar (8 Sections) -->
                <div style="display:flex; gap:6px; background:var(--card-bg); padding:8px; border-radius:var(--radius-md); border:1px solid var(--card-border); margin-bottom:20px; overflow-x:auto; scrollbar-width:none;">
                    <button class="btn-secondary ${this.activeTab === 'overview' ? 'active' : ''}" 
                            style="${this.activeTab === 'overview' ? 'background:var(--primary); color:white; font-weight:700;' : ''}"
                            onclick="MediApp.setAdminTab('overview')">
                        <i class="fa-solid fa-chart-pie"></i> Overview
                    </button>
                    <button class="btn-secondary ${this.activeTab === 'users' ? 'active' : ''}" 
                            style="${this.activeTab === 'users' ? 'background:var(--primary); color:white; font-weight:700;' : ''}"
                            onclick="MediApp.setAdminTab('users')">
                        <i class="fa-solid fa-users"></i> Users (${usersList.length})
                    </button>
                    <button class="btn-secondary ${this.activeTab === 'pharmacies' ? 'active' : ''}" 
                            style="${this.activeTab === 'pharmacies' ? 'background:var(--primary); color:white; font-weight:700;' : ''}"
                            onclick="MediApp.setAdminTab('pharmacies')">
                        <i class="fa-solid fa-store"></i> Pharmacies (${this.app.state.pharmacies.length})
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
                    <button class="btn-secondary ${this.activeTab === 'analytics' ? 'active' : ''}" 
                            style="${this.activeTab === 'analytics' ? 'background:var(--primary); color:white; font-weight:700;' : ''}"
                            onclick="MediApp.setAdminTab('analytics')">
                        <i class="fa-solid fa-chart-line"></i> Financials
                    </button>
                    <button class="btn-secondary ${this.activeTab === 'reports' ? 'active' : ''}" 
                            style="${this.activeTab === 'reports' ? 'background:var(--primary); color:white; font-weight:700;' : ''}"
                            onclick="MediApp.setAdminTab('reports')">
                        <i class="fa-solid fa-file-export"></i> Reports
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
                        <div class="metric-icon" style="background:#dcfce7; color:#16a34a;"><i class="fa-solid fa-store"></i></div>
                        <div>
                            <div class="metric-val">${this.app.state.pharmacies.length}</div>
                            <div class="metric-lbl">Verified Pharmacies</div>
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
                    <button class="add-cart-btn" onclick="MediApp.setAdminTab('pharmacies')"><i class="fa-solid fa-check-double"></i> Review Pharmacy Registrations</button>
                    <button class="btn-secondary" onclick="MediApp.setAdminTab('users')"><i class="fa-solid fa-user-shield"></i> Manage User Statuses</button>
                    <button class="btn-secondary" onclick="MediApp.generateAdminReport()"><i class="fa-solid fa-download"></i> Export Audit Report</button>
                </div>

                <!-- Revenue Chart Preview -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:20px; margin-bottom:24px;">
                    <h3 style="font-size:16px; margin-bottom:16px;">Platform Order Volume Growth</h3>
                    <canvas id="adminAnalyticsChart" style="max-height:240px; width:100%;"></canvas>
                </div>
            `;
        }

        // TAB 2: User Management (Suspend / Activate)
        if (this.activeTab === 'users') {
            return `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <div>
                        <h3 style="font-size:18px;">Platform User Management</h3>
                        <p style="font-size:12px; color:var(--text-muted);">Manage registered customer, pharmacy, and driver accounts</p>
                    </div>
                </div>

                <div class="data-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>User ID & Name</th>
                                <th>Email</th>
                                <th>Assigned Role</th>
                                <th>Account Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${usersList.map(u => {
                                const isSuspended = u.status === 'Suspended';
                                return `
                                    <tr>
                                        <td><strong>${u.name}</strong><br><span style="font-size:11px; color:var(--text-muted);">${u.id}</span></td>
                                        <td>${u.email}</td>
                                        <td><span class="role-badge-btn" style="text-transform:uppercase;">${u.role}</span></td>
                                        <td><span style="font-weight:800; color:${isSuspended ? 'var(--emergency-red)' : 'var(--secondary)'};">${u.status || 'Active'}</span></td>
                                        <td>
                                            <button class="btn-secondary" style="color:${isSuspended ? 'var(--secondary)' : 'var(--emergency-red)'}; font-weight:700;" onclick="MediApp.toggleUserStatus('${u.id}')">
                                                <i class="fa-solid ${isSuspended ? 'fa-user-check' : 'fa-user-slash'}"></i> ${isSuspended ? 'Activate User' : 'Suspend User'}
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        // TAB 3: Pharmacy Approvals & Suspension
        if (this.activeTab === 'pharmacies') {
            return `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <div>
                        <h3 style="font-size:18px;">Registered Pharmacies & License Approvals</h3>
                        <p style="font-size:12px; color:var(--text-muted);">Verify drug license compliance and control store operational statuses</p>
                    </div>
                </div>

                <div class="data-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Pharmacy Shop</th>
                                <th>Owner</th>
                                <th>Drug License</th>
                                <th>Rating</th>
                                <th>Verification Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.app.state.pharmacies.map(p => {
                                const isVerified = p.license_verified !== false;
                                const isSuspended = p.status === 'suspended';
                                return `
                                    <tr>
                                        <td><strong>${p.shop_name}</strong><br><span style="font-size:11px; color:var(--text-muted);">${p.address}</span></td>
                                        <td>${p.owner_name}</td>
                                        <td><code>${p.license_number}</code></td>
                                        <td><span class="star-rating"><i class="fa-solid fa-star"></i> ${p.rating}</span></td>
                                        <td>
                                            <span style="font-weight:800; color:${isSuspended ? 'var(--emergency-red)' : isVerified ? 'var(--secondary)' : 'var(--warning-amber)'};">
                                                ${isSuspended ? 'Suspended' : isVerified ? 'Verified ✅' : 'Pending Approval ⏳'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style="display:flex; gap:6px;">
                                                ${!isVerified ? `
                                                    <button class="add-cart-btn" style="padding:4px 8px; font-size:11px;" onclick="MediApp.approvePharmacy('${p.id}')"><i class="fa-solid fa-check"></i> Approve License</button>
                                                ` : ''}
                                                <button class="btn-secondary" style="color:${isSuspended ? 'var(--secondary)' : 'var(--emergency-red)'}; padding:4px 8px; font-size:11px;" onclick="MediApp.suspendPharmacy('${p.id}')">
                                                    <i class="fa-solid ${isSuspended ? 'fa-rotate-left' : 'fa-ban'}"></i> ${isSuspended ? 'Restore' : 'Suspend'}
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

        // TAB 4: Master Medicines Catalog
        if (this.activeTab === 'medicines') {
            return `
                <h3 style="font-size:18px; margin-bottom:16px;">Master Medicines Catalog (${this.app.state.medicines.length} Items)</h3>
                <div class="data-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Brand & Generic Composition</th>
                                <th>Category</th>
                                <th>Mfr</th>
                                <th>Unit Price</th>
                                <th>Total Stock</th>
                                <th>Pharmacy</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.app.state.medicines.slice(0, 15).map(m => `
                                <tr>
                                    <td><strong>${m.name}</strong><br><span style="font-size:11px; color:var(--primary);">🧪 ${m.generic_name}</span></td>
                                    <td>${m.category}</td>
                                    <td>${m.manufacturer || 'Micro Labs'}</td>
                                    <td>₹${m.price.toFixed(2)}</td>
                                    <td><span style="font-weight:800; color:${m.stock < 20 ? 'var(--emergency-red)' : 'var(--secondary)'};">${m.stock} units</span></td>
                                    <td>${m.pharmacy_name}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        // TAB 5: Platform Orders Stream
        if (this.activeTab === 'orders') {
            return `
                <h3 style="font-size:18px; margin-bottom:16px;">Platform Live Orders Stream</h3>
                <div style="display:flex; flex-direction:column; gap:12px;">
                    ${this.app.state.orders.map(o => `
                        <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:16px; display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <strong style="color:var(--primary); font-size:15px;">${o.id}</strong>
                                <span style="font-size:12px; color:var(--text-muted); margin-left:8px;">Customer: ${o.customer_name} • Pharmacy: ${o.pharmacy_name}</span>
                                <div style="font-size:12px; margin-top:4px;">Items: ${o.items.map(it => `${it.quantity}x ${it.name}`).join(', ')}</div>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-weight:800; font-size:16px; color:var(--secondary);">₹${o.total_amount.toFixed(2)}</div>
                                <span class="role-badge-btn">${o.order_status}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
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
