// MediFind Pharmacy Owner Portal (Complete 7 Tabs: Dashboard, Inventory, Orders, Sales, Analytics, Notifications, Profile)

export class PharmacyModule {
    constructor(app) {
        this.app = app;
        this.activeTab = 'dashboard'; // dashboard, inventory, orders, sales, analytics, notifications, profile
    }

    render() {
        const myPharmacyId = 'pharm_1';
        const myPharmacy = this.app.state.pharmacies.find(p => p.id === myPharmacyId) || this.app.state.pharmacies[0];
        const myMedicines = this.app.state.medicines.filter(m => m.pharmacy_id === myPharmacyId || !m.pharmacy_id);
        const myOrders = this.app.state.orders.filter(o => o.pharmacy_id === myPharmacyId || !o.pharmacy_id);
        const lowStockCount = myMedicines.filter(m => m.stock < 20).length;
        const pendingOrders = myOrders.filter(o => o.order_status === 'Order Placed' || o.order_status === 'Pending');

        return `
            <header class="navbar-top">
                <div class="brand-logo">
                    <div class="brand-icon" style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);"><i class="fa-solid fa-clinic-medical"></i></div>
                    <div>
                        <span class="brand-text" style="font-size:18px;">${myPharmacy.shop_name}</span>
                        <div style="font-size:11px; color:var(--text-muted);"><i class="fa-solid fa-certificate" style="color:var(--primary);"></i> License: ${myPharmacy.license_number}</div>
                    </div>
                </div>
                <div class="top-actions">
                    <button class="role-badge-btn" onclick="MediApp.openRoleModal()">
                        <i class="fa-solid fa-user-gear"></i> Role: PHARMACY
                    </button>
                    <button class="icon-btn" onclick="MediApp.toggleTheme()">
                        <i class="fa-solid ${this.app.state.darkMode ? 'fa-sun' : 'fa-moon'}"></i>
                    </button>
                </div>
            </header>

            <main class="main-content">
                <!-- Navigation Tabs Bar (7 Tabs) -->
                <div style="display:flex; gap:6px; background:var(--card-bg); padding:8px; border-radius:var(--radius-md); border:1px solid var(--card-border); margin-bottom:20px; overflow-x:auto; scrollbar-width:none;">
                    <button class="btn-secondary ${this.activeTab === 'dashboard' ? 'active' : ''}" 
                            style="${this.activeTab === 'dashboard' ? 'background:var(--primary); color:white; font-weight:700;' : ''}"
                            onclick="MediApp.setPharmacyTab('dashboard')">
                        <i class="fa-solid fa-chart-line"></i> Dashboard
                    </button>
                    <button class="btn-secondary ${this.activeTab === 'inventory' ? 'active' : ''}" 
                            style="${this.activeTab === 'inventory' ? 'background:var(--primary); color:white; font-weight:700;' : ''}"
                            onclick="MediApp.setPharmacyTab('inventory')">
                        <i class="fa-solid fa-boxes-stacked"></i> Inventory (${myMedicines.length})
                    </button>
                    <button class="btn-secondary ${this.activeTab === 'orders' ? 'active' : ''}" 
                            style="${this.activeTab === 'orders' ? 'background:var(--primary); color:white; font-weight:700;' : ''}"
                            onclick="MediApp.setPharmacyTab('orders')">
                        <i class="fa-solid fa-box"></i> Orders (${myOrders.length})
                    </button>
                    <button class="btn-secondary ${this.activeTab === 'sales' ? 'active' : ''}" 
                            style="${this.activeTab === 'sales' ? 'background:var(--primary); color:white; font-weight:700;' : ''}"
                            onclick="MediApp.setPharmacyTab('sales')">
                        <i class="fa-solid fa-receipt"></i> Sales Ledger
                    </button>
                    <button class="btn-secondary ${this.activeTab === 'analytics' ? 'active' : ''}" 
                            style="${this.activeTab === 'analytics' ? 'background:var(--primary); color:white; font-weight:700;' : ''}"
                            onclick="MediApp.setPharmacyTab('analytics')">
                        <i class="fa-solid fa-chart-pie"></i> Analytics
                    </button>
                    <button class="btn-secondary ${this.activeTab === 'notifications' ? 'active' : ''}" 
                            style="${this.activeTab === 'notifications' ? 'background:var(--primary); color:white; font-weight:700;' : ''}"
                            onclick="MediApp.setPharmacyTab('notifications')">
                        <i class="fa-solid fa-bell"></i> Alerts (${pendingOrders.length + lowStockCount})
                    </button>
                    <button class="btn-secondary ${this.activeTab === 'profile' ? 'active' : ''}" 
                            style="${this.activeTab === 'profile' ? 'background:var(--primary); color:white; font-weight:700;' : ''}"
                            onclick="MediApp.setPharmacyTab('profile')">
                        <i class="fa-solid fa-store"></i> Profile
                    </button>
                </div>

                ${this.renderActiveTab(myPharmacy, myMedicines, myOrders, lowStockCount, pendingOrders)}
            </main>
        `;
    }

    renderActiveTab(myPharmacy, myMedicines, myOrders, lowStockCount, pendingOrders) {
        // TAB 1: Dashboard Overview
        if (this.activeTab === 'dashboard') {
            const todayRevenue = myOrders.reduce((sum, o) => sum + o.total_amount, 0);

            return `
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#dcfce7; color:#16a34a;"><i class="fa-solid fa-indian-rupee-sign"></i></div>
                        <div>
                            <div class="metric-val">₹${todayRevenue.toFixed(2)}</div>
                            <div class="metric-lbl">Total Pharmacy Revenue</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#e0f2fe; color:#0284c7;"><i class="fa-solid fa-bag-shopping"></i></div>
                        <div>
                            <div class="metric-val">${myOrders.length}</div>
                            <div class="metric-lbl">Total Orders Received</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#fef3c7; color:#d97706;"><i class="fa-solid fa-clock"></i></div>
                        <div>
                            <div class="metric-val">${pendingOrders.length}</div>
                            <div class="metric-lbl">Pending Order Actions</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#fee2e2; color:#ef4444;"><i class="fa-solid fa-triangle-exclamation"></i></div>
                        <div>
                            <div class="metric-val">${lowStockCount}</div>
                            <div class="metric-lbl">Low Stock Alerts</div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions Bar -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:16px; margin-bottom:24px; display:flex; gap:12px; flex-wrap:wrap;">
                    <button class="add-cart-btn" onclick="MediApp.openAddMedicineModal()"><i class="fa-solid fa-plus"></i> Add New Medicine</button>
                    <button class="btn-secondary" onclick="MediApp.setPharmacyTab('orders')"><i class="fa-solid fa-box"></i> View Incoming Orders (${pendingOrders.length})</button>
                    <button class="btn-secondary" onclick="MediApp.setPharmacyTab('analytics')"><i class="fa-solid fa-chart-line"></i> Sales Performance</button>
                </div>

                <!-- Recent Incoming Orders -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:20px; margin-bottom:24px;">
                    <h3 style="font-size:16px; margin-bottom:14px;"><i class="fa-solid fa-bell-concierge" style="color:var(--primary);"></i> Live Pending Orders</h3>
                    ${pendingOrders.length === 0 ? `
                        <div style="text-align:center; padding:30px; color:var(--text-muted);">
                            <i class="fa-solid fa-circle-check" style="font-size:32px; color:var(--secondary); margin-bottom:8px;"></i>
                            <p>All incoming customer orders have been processed!</p>
                        </div>
                    ` : pendingOrders.map(order => `
                        <div style="background:var(--background); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:16px; margin-bottom:12px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                <div>
                                    <strong style="color:var(--primary); font-size:15px;">${order.id}</strong>
                                    <span style="font-size:12px; color:var(--text-muted); margin-left:8px;">${order.customer_name} (${order.customer_phone})</span>
                                </div>
                                <span class="role-badge-btn" style="background:var(--warning-light); color:var(--warning-amber);">${order.order_status}</span>
                            </div>
                            <div style="font-size:13px; margin-bottom:12px;">
                                Items: ${order.items.map(it => `<b>${it.quantity}x ${it.name}</b>`).join(', ')}<br>
                                Delivery Address: <span>${order.customer_address}</span>
                            </div>
                            <div style="display:flex; gap:10px; justify-content:flex-end;">
                                <button class="add-cart-btn" onclick="MediApp.acceptOrder('${order.id}')"><i class="fa-solid fa-check"></i> Accept Order</button>
                                <button class="btn-secondary" style="color:var(--emergency-red);" onclick="MediApp.rejectOrder('${order.id}')"><i class="fa-solid fa-xmark"></i> Reject</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // TAB 2: Inventory Management
        if (this.activeTab === 'inventory') {
            return `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <div>
                        <h3 style="font-size:18px;">Pharmacy Inventory Management</h3>
                        <p style="font-size:12px; color:var(--text-muted);">Manage stock quantities, prices, and product availability instantly</p>
                    </div>
                    <button class="add-cart-btn" onclick="MediApp.openAddMedicineModal()"><i class="fa-solid fa-plus"></i> Add New Medicine</button>
                </div>

                <div class="data-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Medicine & Composition</th>
                                <th>Category</th>
                                <th>Unit Price (₹)</th>
                                <th>Live Stock Quantity</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${myMedicines.map(m => `
                                <tr>
                                    <td>
                                        <strong>${m.name}</strong><br>
                                        <span style="font-size:11px; color:var(--primary);">🧪 ${m.generic_name}</span><br>
                                        <span style="font-size:10px; color:var(--text-muted);">🏢 ${m.manufacturer || 'Micro Labs'}</span>
                                    </td>
                                    <td><span style="background:var(--primary-light); color:var(--primary); padding:2px 8px; border-radius:4px; font-size:11px; font-weight:700;">${m.category}</span></td>
                                    <td>
                                        <div style="display:flex; align-items:center; gap:4px;">
                                            ₹<input type="number" value="${m.price}" step="0.5" style="width:70px; padding:4px; border:1px solid var(--card-border); border-radius:4px; font-size:13px; font-weight:700;" onchange="MediApp.updatePrice('${m.id}', this.value)">
                                        </div>
                                    </td>
                                    <td>
                                        <div style="display:flex; align-items:center; gap:6px;">
                                            <input type="number" value="${m.stock}" style="width:65px; padding:4px; border:1px solid ${m.stock < 20 ? 'var(--emergency-red)' : 'var(--card-border)'}; border-radius:4px; font-size:13px; font-weight:800; color:${m.stock < 20 ? 'var(--emergency-red)' : 'var(--text-main)'};" onchange="MediApp.updateStock('${m.id}', this.value)">
                                            <span style="font-size:11px; color:var(--text-muted);">units</span>
                                        </div>
                                    </td>
                                    <td>
                                        <button class="btn-secondary" style="padding:4px 8px; font-size:11px; color:${m.stock > 0 ? 'var(--secondary)' : 'var(--emergency-red)'}; font-weight:800;" onclick="MediApp.toggleAvailability('${m.id}')">
                                            ● ${m.stock > 0 ? 'Available' : 'Unavailable'}
                                        </button>
                                    </td>
                                    <td>
                                        <div style="display:flex; gap:6px;">
                                            <button class="btn-secondary" title="Edit Medicine" onclick="MediApp.editMedicine('${m.id}')"><i class="fa-solid fa-pen"></i></button>
                                            <button class="btn-secondary" style="color:var(--emergency-red);" title="Delete" onclick="MediApp.deleteMedicine('${m.id}')"><i class="fa-solid fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        // TAB 3: Orders Processing
        if (this.activeTab === 'orders') {
            return `
                <h3 style="font-size:18px; margin-bottom:16px;">Orders Processing Center</h3>
                <div style="display:flex; flex-direction:column; gap:14px;">
                    ${myOrders.length === 0 ? `
                        <div style="text-align:center; padding:40px; color:var(--text-muted);">No orders found.</div>
                    ` : myOrders.map(order => `
                        <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:18px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                                <div>
                                    <span style="font-weight:800; color:var(--primary); font-size:16px;">${order.id}</span>
                                    <span style="font-size:12px; color:var(--text-muted); margin-left:8px;">Customer: <strong>${order.customer_name}</strong> (${order.customer_phone})</span>
                                </div>
                                <span class="role-badge-btn">${order.order_status}</span>
                            </div>
                            <div style="background:var(--background); padding:12px; border-radius:var(--radius-sm); font-size:13px; margin-bottom:14px;">
                                <strong>Order Items:</strong>
                                <ul>
                                    ${order.items.map(it => `<li>${it.quantity}x <b>${it.name}</b> — ₹${(it.price * it.quantity).toFixed(2)}</li>`).join('')}
                                </ul>
                                <div style="margin-top:6px; text-align:right; font-weight:800; font-size:14px; color:var(--primary);">Total: ₹${order.total_amount.toFixed(2)}</div>
                            </div>
                            <div style="display:flex; gap:10px; justify-content:flex-end;">
                                <button class="btn-secondary" onclick="MediApp.acceptOrder('${order.id}')"><i class="fa-solid fa-check"></i> Accept & Prepare</button>
                                <button class="add-cart-btn" onclick="MediApp.updateOrderStatus('${order.id}', 'Ready For Pickup')"><i class="fa-solid fa-box"></i> Ready For Pickup</button>
                                <button class="btn-secondary" style="color:var(--emergency-red);" onclick="MediApp.rejectOrder('${order.id}')"><i class="fa-solid fa-xmark"></i> Reject</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // TAB 4: Sales Ledger
        if (this.activeTab === 'sales') {
            const completedOrders = myOrders.filter(o => o.order_status === 'Delivered' || o.payment_status === 'Paid');
            const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total_amount, 0);

            return `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <div>
                        <h3 style="font-size:18px;">Pharmacy Sales Ledger</h3>
                        <p style="font-size:12px; color:var(--text-muted);">Completed transactions and financial logs</p>
                    </div>
                    <div style="font-size:18px; font-weight:800; color:var(--secondary);">Total Sales: ₹${totalRevenue.toFixed(2)}</div>
                </div>

                <div class="data-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Payment Method</th>
                                <th>Amount (₹)</th>
                                <th>Payment Status</th>
                                <th>Order Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${completedOrders.map(o => `
                                <tr>
                                    <td><strong>${o.id}</strong></td>
                                    <td>${o.customer_name}</td>
                                    <td><span style="font-weight:700;">💳 ${o.payment_method || 'UPI'}</span></td>
                                    <td><strong style="color:var(--secondary);">₹${o.total_amount.toFixed(2)}</strong></td>
                                    <td><span style="color:var(--secondary); font-weight:800;">Paid</span></td>
                                    <td><span class="role-badge-btn">${o.order_status}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        // TAB 5: Chart.js Analytics
        if (this.activeTab === 'analytics') {
            return `
                <h3 style="font-size:18px; margin-bottom:16px;">Sales & Inventory Performance Analytics</h3>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:24px;">
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:20px;">
                        <h4 style="font-size:14px; margin-bottom:14px;">Weekly Revenue Trend (₹)</h4>
                        <canvas id="salesChart" style="max-height:240px; width:100%;"></canvas>
                    </div>
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:20px;">
                        <h4 style="font-size:14px; margin-bottom:14px;">Category Sales Breakdown</h4>
                        <canvas id="categoryChart" style="max-height:240px; width:100%;"></canvas>
                    </div>
                </div>
            `;
        }

        // TAB 6: Notifications & Alerts
        if (this.activeTab === 'notifications') {
            return `
                <h3 style="font-size:18px; margin-bottom:16px;">Pharmacy Real-Time Notifications & Stock Alerts</h3>
                <div style="display:flex; flex-direction:column; gap:12px;">
                    ${lowStockCount > 0 ? `
                        <div style="background:var(--warning-light); border:1px solid var(--warning-amber); padding:16px; border-radius:var(--radius-md); display:flex; gap:12px; align-items:center;">
                            <i class="fa-solid fa-triangle-exclamation" style="font-size:24px; color:var(--warning-amber);"></i>
                            <div>
                                <strong style="color:var(--warning-amber);">Low Stock Warning</strong>
                                <div style="font-size:12px;">You have ${lowStockCount} medicines with stock quantity below 20 units. Please restock inventory.</div>
                            </div>
                        </div>
                    ` : ''}

                    ${pendingOrders.map(o => `
                        <div style="background:var(--card-bg); border:1px solid var(--card-border); padding:16px; border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center;">
                            <div style="display:flex; gap:12px; align-items:center;">
                                <i class="fa-solid fa-bell" style="font-size:20px; color:var(--primary);"></i>
                                <div>
                                    <strong>New Order Received: ${o.id}</strong>
                                    <div style="font-size:12px; color:var(--text-muted);">${o.customer_name} placed an order for ₹${o.total_amount.toFixed(2)}</div>
                                </div>
                            </div>
                            <button class="add-cart-btn" onclick="MediApp.setPharmacyTab('orders')">Process Order</button>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // TAB 7: Pharmacy Profile & Settings
        if (this.activeTab === 'profile') {
            return `
                <h3 style="font-size:18px; margin-bottom:16px;">Pharmacy Store Configuration & License Details</h3>
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:24px;">
                    <div style="display:flex; gap:20px; align-items:center; margin-bottom:20px;">
                        <img src="${myPharmacy.logo}" style="width:90px; height:90px; border-radius:var(--radius-md); object-fit:cover;">
                        <div>
                            <h2 style="font-size:22px; margin-bottom:4px;">${myPharmacy.shop_name}</h2>
                            <div style="font-size:13px; color:var(--text-muted); margin-bottom:4px;">Owner: <strong>${myPharmacy.owner_name}</strong></div>
                            <div style="font-size:12px; color:var(--secondary); font-weight:800;"><i class="fa-solid fa-circle-check"></i> Drug License Verified • DL-2023-APO891</div>
                        </div>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:14px;">
                        <div>
                            <label style="font-size:12px; font-weight:700;">Pharmacy Address</label>
                            <input type="text" value="${myPharmacy.address}" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                        </div>
                        <div style="display:flex; gap:12px;">
                            <div style="flex:1;">
                                <label style="font-size:12px; font-weight:700;">GST Number</label>
                                <input type="text" value="${myPharmacy.gst || '07AAAAA0000A1Z5'}" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                            </div>
                            <div style="flex:1;">
                                <label style="font-size:12px; font-weight:700;">Phone Number</label>
                                <input type="text" value="${myPharmacy.phone}" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                            </div>
                        </div>

                        <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; margin-top:10px;" onclick="MediApp.showToast('Pharmacy profile updated successfully!')">
                            <i class="fa-solid fa-floppy-disk"></i> Save Profile Settings
                        </button>
                    </div>
                </div>
            `;
        }
    }

    initCharts() {
        if (this.activeTab !== 'analytics') return;
        const salesCtx = document.getElementById('salesChart');
        const catCtx = document.getElementById('categoryChart');

        if (salesCtx && typeof Chart !== 'undefined') {
            new Chart(salesCtx, {
                type: 'bar',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Sales Revenue (₹)',
                        data: [4200, 5800, 6900, 8100, 9400, 12500, 14850],
                        backgroundColor: '#16a34a',
                        borderRadius: 6
                    }]
                },
                options: { responsive: true, plugins: { legend: { display: false } } }
            });
        }

        if (catCtx && typeof Chart !== 'undefined') {
            new Chart(catCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Pain Relief', 'Antibiotics', 'Diabetes', 'Cardiac', 'Vitamins'],
                    datasets: [{
                        data: [35, 25, 20, 12, 8],
                        backgroundColor: ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']
                    }]
                },
                options: { responsive: true }
            });
        }
    }
}
