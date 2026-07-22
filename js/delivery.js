// MediFind Delivery Partner Portal (Active Tasks, Google Maps Navigation, OTP Verification, Earnings, Delivery History, Availability Duty Toggle & Live GPS Location)

export class DeliveryModule {
    constructor(app) {
        this.app = app;
        this.activeTab = 'tasks'; // tasks, earnings, history, profile
        this.isOnDuty = true;
        this.driverInfo = {
            id: 'partner_1',
            name: 'Rohan Verma',
            vehicle: 'Hero Splendor (KA-01-EQ-9982)',
            phone: '+91 98112 33445',
            rating: 4.9,
            earnings_today: 850,
            base_pay: 600,
            tips: 150,
            bonus: 100,
            total_deliveries: 482
        };
    }

    render() {
        const assignedOrder = this.app.state.orders.find(o => o.delivery_partner && o.delivery_partner.id === 'partner_1' && o.order_status !== 'Delivered' && o.order_status !== 'Cancelled');
        const completedDeliveries = this.app.state.orders.filter(o => o.order_status === 'Delivered');

        return `
            <header class="navbar-top">
                <div class="brand-logo">
                    <div class="brand-icon" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);"><i class="fa-solid fa-motorcycle"></i></div>
                    <div>
                        <span class="brand-text" style="font-size:18px;">MediExpress Driver</span>
                        <div style="font-size:11px; color:var(--text-muted);">${this.driverInfo.vehicle}</div>
                    </div>
                </div>
                <div class="top-actions">
                    <button class="btn-secondary" style="padding:6px 12px; font-size:11px; font-weight:800; color:${this.isOnDuty ? 'var(--secondary)' : 'var(--emergency-red)'}; border:2px solid ${this.isOnDuty ? 'var(--secondary)' : 'var(--emergency-red)'};" onclick="MediApp.toggleDriverDuty()">
                        ● ${this.isOnDuty ? 'ON DUTY (Online)' : 'OFF DUTY (Offline)'}
                    </button>
                    <button class="role-badge-btn" onclick="MediApp.openRoleModal()">
                        <i class="fa-solid fa-user-gear"></i> Role: DRIVER
                    </button>
                </div>
            </header>

            <main class="main-content">
                <!-- Navigation Bar (4 Tabs) -->
                <div style="display:flex; gap:6px; background:var(--card-bg); padding:8px; border-radius:var(--radius-md); border:1px solid var(--card-border); margin-bottom:20px;">
                    <button class="btn-secondary ${this.activeTab === 'tasks' ? 'active' : ''}" 
                            style="${this.activeTab === 'tasks' ? 'background:var(--primary); color:white; font-weight:700;' : ''}"
                            onclick="MediApp.setDeliveryTab('tasks')">
                        <i class="fa-solid fa-map-location-dot"></i> Active Tasks (${assignedOrder ? 1 : 0})
                    </button>
                    <button class="btn-secondary ${this.activeTab === 'earnings' ? 'active' : ''}" 
                            style="${this.activeTab === 'earnings' ? 'background:var(--primary); color:white; font-weight:700;' : ''}"
                            onclick="MediApp.setDeliveryTab('earnings')">
                        <i class="fa-solid fa-indian-rupee-sign"></i> Earnings
                    </button>
                    <button class="btn-secondary ${this.activeTab === 'history' ? 'active' : ''}" 
                            style="${this.activeTab === 'history' ? 'background:var(--primary); color:white; font-weight:700;' : ''}"
                            onclick="MediApp.setDeliveryTab('history')">
                        <i class="fa-solid fa-clock-rotate-left"></i> History (${completedDeliveries.length})
                    </button>
                    <button class="btn-secondary ${this.activeTab === 'profile' ? 'active' : ''}" 
                            style="${this.activeTab === 'profile' ? 'background:var(--primary); color:white; font-weight:700;' : ''}"
                            onclick="MediApp.setDeliveryTab('profile')">
                        <i class="fa-solid fa-id-card"></i> Profile
                    </button>
                </div>

                ${this.renderActiveTab(assignedOrder, completedDeliveries)}
            </main>
        `;
    }

    renderActiveTab(assignedOrder, completedDeliveries) {
        // TAB 1: Active Delivery Tasks & GPS Canvas
        if (this.activeTab === 'tasks') {
            if (!this.isOnDuty) {
                return `
                    <div style="text-align:center; padding:60px 20px; background:var(--card-bg); border-radius:var(--radius-lg); border:1px solid var(--card-border);">
                        <i class="fa-solid fa-moon" style="font-size:56px; color:var(--text-muted); margin-bottom:16px;"></i>
                        <h3 style="font-size:20px; margin-bottom:8px;">You Are Currently Off Duty</h3>
                        <p style="font-size:13px; color:var(--text-muted); margin-bottom:20px;">Toggle your duty status to Online to start receiving instant medicine delivery orders.</p>
                        <button class="add-cart-btn" onclick="MediApp.toggleDriverDuty()"><i class="fa-solid fa-power-off"></i> Go On Duty (Online)</button>
                    </div>
                `;
            }

            return `
                <!-- Active Assigned Delivery Order -->
                ${assignedOrder ? `
                    <div style="background:var(--card-bg); border:2px solid var(--primary); border-radius:var(--radius-lg); padding:20px; margin-bottom:24px; box-shadow:var(--shadow-md);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <span class="rx-badge" style="background:var(--primary); font-size:12px;">ACTIVE ASSIGNED ORDER</span>
                            <span style="font-weight:800; font-size:16px; color:var(--primary);">${assignedOrder.id}</span>
                        </div>

                        <!-- Live Navigation Map Canvas -->
                        <div class="tracking-map-box" style="margin-bottom:16px;">
                            <canvas id="driverMapCanvas" class="tracking-canvas"></canvas>
                        </div>

                        <!-- Google Maps Route Navigation Button -->
                        <div style="margin-bottom:16px;">
                            <a href="https://www.google.com/maps/search/?api=1&query=Sector+18+Noida" target="_blank" class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; background:linear-gradient(135deg, #4285F4 0%, #34A853 100%); text-decoration:none;">
                                <i class="fa-solid fa-diamond-turn-right"></i> Open Turn-By-Turn Navigation in Google Maps
                            </a>
                        </div>

                        <!-- Pickup & Dropoff Details -->
                        <div style="background:var(--background); padding:16px; border-radius:var(--radius-md); margin-bottom:16px; display:flex; flex-direction:column; gap:10px;">
                            <div style="font-size:13px; border-bottom:1px solid var(--card-border); padding-bottom:8px;">
                                <strong style="color:var(--primary);"><i class="fa-solid fa-store"></i> PICKUP PHARMACY:</strong><br>
                                <b>${assignedOrder.pharmacy_name}</b> (Sector 18, Noida)
                            </div>
                            <div style="font-size:13px;">
                                <strong style="color:var(--emergency-red);"><i class="fa-solid fa-house-user"></i> DELIVER TO CUSTOMER:</strong><br>
                                <b>${assignedOrder.customer_name}</b> (${assignedOrder.customer_phone})<br>
                                <span style="color:var(--text-muted); font-size:12px;">${assignedOrder.customer_address}</span>
                            </div>
                        </div>

                        <!-- Delivery Status Workflow Control Buttons -->
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            <div style="display:flex; gap:8px;">
                                <button class="btn-secondary" style="flex:1; justify-content:center;" onclick="MediApp.updateOrderStatus('${assignedOrder.id}', 'Arrived at Pharmacy', 2)">
                                    <i class="fa-solid fa-building-circle-check"></i> Arrived at Store
                                </button>
                                <button class="btn-secondary" style="flex:1; justify-content:center;" onclick="MediApp.updateOrderStatus('${assignedOrder.id}', 'Out for Delivery', 4)">
                                    <i class="fa-solid fa-box-open"></i> Order Picked Up
                                </button>
                            </div>

                            <div style="display:flex; gap:8px;">
                                <button class="add-cart-btn" style="flex:2; justify-content:center; padding:12px; font-size:15px;" onclick="MediApp.openOtpVerificationModal('${assignedOrder.id}')">
                                    <i class="fa-solid fa-shield-check"></i> Verify Customer OTP & Complete
                                </button>
                                <button class="btn-secondary" style="flex:1; justify-content:center; color:var(--emergency-red);" onclick="MediApp.rejectDelivery('${assignedOrder.id}')">
                                    <i class="fa-solid fa-xmark"></i> Decline
                                </button>
                            </div>
                        </div>
                    </div>
                ` : `
                    <div style="text-align:center; padding:50px 20px; background:var(--card-bg); border-radius:var(--radius-lg); border:1px solid var(--card-border);">
                        <i class="fa-solid fa-circle-check" style="font-size:52px; color:var(--secondary); margin-bottom:12px;"></i>
                        <h3 style="font-weight:700; font-size:18px;">You Are On Duty & Ready</h3>
                        <p style="font-size:13px; color:var(--text-muted);">Incoming delivery requests from nearby pharmacies will appear here automatically.</p>
                    </div>
                `}
            `;
        }

        // TAB 2: Earnings Ledger
        if (this.activeTab === 'earnings') {
            return `
                <h3 style="font-size:18px; margin-bottom:16px;">Driver Earnings Ledger</h3>
                
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:20px; margin-bottom:20px;">
                    <div style="text-align:center; margin-bottom:20px;">
                        <div style="font-size:12px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px;">TODAY'S TOTAL EARNINGS</div>
                        <div style="font-size:36px; font-weight:800; color:var(--secondary);">₹${this.driverInfo.earnings_today}</div>
                    </div>

                    <div style="background:var(--background); padding:16px; border-radius:var(--radius-md); font-size:13px; display:flex; flex-direction:column; gap:10px;">
                        <div style="display:flex; justify-content:space-between;">
                            <span>Base Trip Pay (${this.driverInfo.total_deliveries} trips)</span>
                            <strong>₹${this.driverInfo.base_pay}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span>Distance & Express Bonus</span>
                            <strong>₹${this.driverInfo.bonus}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span>Customer Tips ❤️</span>
                            <strong style="color:var(--secondary);">₹${this.driverInfo.tips}</strong>
                        </div>
                        <div style="border-top:1px dashed var(--card-border); pt:8px; margin-top:4px; display:flex; justify-content:space-between; font-weight:800; font-size:15px;">
                            <span>Net Payout</span>
                            <span style="color:var(--primary);">₹${this.driverInfo.earnings_today}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // TAB 3: Delivery History Log
        if (this.activeTab === 'history') {
            return `
                <h3 style="font-size:18px; margin-bottom:16px;">Completed Delivery History (${completedDeliveries.length})</h3>
                <div style="display:flex; flex-direction:column; gap:12px;">
                    ${completedDeliveries.length === 0 ? `
                        <div style="text-align:center; padding:40px; color:var(--text-muted);">No completed deliveries logged today.</div>
                    ` : completedDeliveries.map(o => `
                        <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:16px; display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <strong style="color:var(--primary);">${o.id}</strong>
                                <div style="font-size:12px; color:var(--text-body); margin-top:2px;">Customer: ${o.customer_name} • ${o.pharmacy_name}</div>
                                <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">OTP Verified: ${o.delivery_partner?.otp || '8912'}</div>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-weight:800; color:var(--secondary); font-size:15px;">+₹45.00</div>
                                <span class="role-badge-btn" style="background:var(--secondary-light); color:var(--secondary);">Delivered</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // TAB 4: Driver Profile
        if (this.activeTab === 'profile') {
            return `
                <h3 style="font-size:18px; margin-bottom:16px;">Driver Profile & Vehicle Information</h3>
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:20px;">
                    <div style="display:flex; gap:16px; align-items:center; margin-bottom:20px;">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" style="width:70px; height:70px; border-radius:var(--radius-full); object-fit:cover;">
                        <div>
                            <h3 style="font-size:18px; margin-bottom:2px;">${this.driverInfo.name}</h3>
                            <div style="font-size:12px; color:var(--text-muted);">${this.driverInfo.vehicle}</div>
                            <div style="font-size:12px; color:var(--warning-amber); font-weight:800; margin-top:2px;"><i class="fa-solid fa-star"></i> ${this.driverInfo.rating} Rating (${this.driverInfo.total_deliveries} deliveries)</div>
                        </div>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <div>
                            <label style="font-size:12px; font-weight:700;">Duty Availability</label>
                            <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; background:${this.isOnDuty ? 'var(--secondary)' : 'var(--emergency-red)'};" onclick="MediApp.toggleDriverDuty()">
                                ● ${this.isOnDuty ? 'ON DUTY (Online)' : 'OFF DUTY (Offline)'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}
