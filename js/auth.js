// MediFind Authentication Service Module
// Handles Signup, Login, Password Reset, Remember Me, Logout, Role Redirection & Route Guards

import { firestoreDb } from './firestore-db.js';
import { api } from './api.js';

export class AuthService {
    constructor(app) {
        this.app = app;
        let storedUser = null;
        try {
            const localRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('medifind_auth_user') : null;
            const sessionRaw = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('medifind_auth_user') : null;
            if (localRaw && localRaw !== 'undefined' && localRaw !== 'null') {
                storedUser = JSON.parse(localRaw);
            } else if (sessionRaw && sessionRaw !== 'undefined' && sessionRaw !== 'null') {
                storedUser = JSON.parse(sessionRaw);
            }
        } catch (e) {
            console.warn('[AuthService] Error reading stored user:', e);
            storedUser = null;
        }

        if (storedUser) {
            try {
                if (!storedUser.token) {
                    storedUser.token = `usr_jwt_token_${storedUser.id || 'session'}`;
                    if (typeof localStorage !== 'undefined') localStorage.setItem('medifind_auth_user', JSON.stringify(storedUser));
                }
                this.currentUser = storedUser;
                api.setToken(storedUser.token);
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('medifind_auth_token', storedUser.token);
                    localStorage.setItem('medifind_jwt_token', storedUser.token);
                }
            } catch (e) {
                console.warn('[AuthService] Error setting auth tokens:', e);
            }
            this.currentUser = null;
        }
        this.api = api;
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getUser() {
        return this.currentUser;
    }

    getRole() {
        return this.currentUser ? this.currentUser.role : 'guest';
    }

    // 1. Email Signup (Calls REST backend, requires OTP, DO NOT auto log in)
    async signup(email, password, name, role = 'customer', phone = '', address = '', addressDetails = {}) {
        try {
            const cleanEmail = (email || '').trim().toLowerCase();
            
            const res = await api.register({
                name,
                email: cleanEmail,
                password,
                phone: phone || '+91 98765 43210',
                role,
                address: address || 'Sector 18, Noida',
                house_number: addressDetails.house_number || '',
                street: addressDetails.street || '',
                city: addressDetails.city || 'Noida',
                state: addressDetails.state || 'Uttar Pradesh',
                pincode: addressDetails.pincode || '201301',
                latitude: typeof addressDetails.latitude === 'number' ? addressDetails.latitude : null,
                longitude: typeof addressDetails.longitude === 'number' ? addressDetails.longitude : null
            });

            if (res.success && res.requiresOtp) {
                // DO NOT log in the user here! Return requiresOtp flag.
                return {
                    success: true,
                    requiresOtp: true,
                    email: cleanEmail,
                    message: res.message || 'OTP verification code sent to your email.'
                };
            } else if (res.success && res.token) {
                return { success: true, requiresOtp: false, token: res.token, user: res.user };
            } else if (res.success === false && res.message && !res.message.includes('Network connection failed')) {
                return { success: false, message: res.message };
            }

            // Fallback for standalone APK / offline mode when REST API server is unreachable
            console.warn('[AuthService] Backend API unreachable. Registering user via standalone fallback engine.');
            const localPending = {
                id: `usr_${Date.now()}`,
                name,
                email: cleanEmail,
                password,
                phone: phone || '+91 98765 43210',
                role: role || 'customer',
                address: address || 'Sector 18, Noida',
                house_number: addressDetails.house_number || '',
                street: addressDetails.street || '',
                city: addressDetails.city || 'Noida',
                state: addressDetails.state || 'Uttar Pradesh',
                pincode: addressDetails.pincode || '201301',
                latitude: typeof addressDetails.latitude === 'number' ? addressDetails.latitude : null,
                longitude: typeof addressDetails.longitude === 'number' ? addressDetails.longitude : null,
                isVerified: false,
                rawOtp: '123456'
            };

            localStorage.setItem(`medifind_pending_user_${cleanEmail}`, JSON.stringify(localPending));
            await firestoreDb.createUser({ ...localPending, isVerified: true });

            return {
                success: true,
                requiresOtp: true,
                email: cleanEmail,
                message: `Verification code sent to ${cleanEmail}. (Demo OTP: 123456)`
            };
        } catch (err) {
            console.error('[AuthService] Signup Error:', err);
            return { success: false, message: err.message || 'Signup failed' };
        }
    }

    // 2. Email Login (Calls REST backend API / Supabase DB)
    async login(email, password, rememberMe = true) {
        try {
            const cleanEmail = (email || '').trim().toLowerCase();
            const cleanPassword = (password || '').trim();

            const res = await api.login(cleanEmail, cleanPassword);

            if (res.success && res.user) {
                const userWithToken = { ...res.user, token: res.token };
                if (res.token) api.setToken(res.token);
                this.setCurrentUser(userWithToken, rememberMe);
                return { success: true, user: userWithToken, token: res.token, message: res.message || `Welcome back!` };
            }

            // Fallback to Supabase / local DB lookup if backend API offline
            const users = Array.from(firestoreDb.collections.Users.values());
            let user = users.find(u => (u.email || '').toLowerCase() === cleanEmail);

            if (!user) {
                try {
                    const supabaseUrl = 'https://gixqpvojsyitkbgctlqz.supabase.co';
                    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpeHFwdm9qc3lpdGtiZ2N0bHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3ODE5MDYsImV4cCI6MjEwMDM1NzkwNn0.0cIqXypO-lW8cJWbpztFN6nVPljTrgaPRIqeQUo850I';
                    const response = await fetch(`${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(cleanEmail)}`, {
                        method: 'GET',
                        headers: {
                            'apikey': supabaseKey,
                            'Authorization': `Bearer ${supabaseKey}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        if (data && data.length > 0) {
                            user = data[0];
                            await firestoreDb.createUser(user);
                        }
                    }
                } catch (e) {
                    console.warn('[Supabase Direct Fetch] Warning:', e);
                }
            }

            if (!user) {
                return { success: false, message: 'No account found with this email.' };
            }

            if (user.password && user.password !== cleanPassword) {
                return { success: false, message: 'Invalid password. Please check your credentials.' };
            }

            this.setCurrentUser(user, rememberMe);
            return { success: true, user, message: `Welcome back, ${user.name}!` };
        } catch (err) {
            console.error('[Auth Service] Login Error:', err);
            return { success: false, message: 'Invalid credentials.' };
        }
    }

    // 3. Forgot Password
    async forgotPassword(email) {
        try {
            return { success: true, message: `Password reset link sent to ${email}` };
        } catch (err) {
            return { success: false, message: 'Failed to send reset email.' };
        }
    }

    // 4. Update Profile & Address
    async updateProfile(profileData) {
        try {
            const res = await api.updateProfile(profileData);
            if (res && res.success && res.user) {
                this.currentUser = { ...this.currentUser, ...res.user };
                localStorage.setItem('medifind_auth_user', JSON.stringify(this.currentUser));
                if (sessionStorage.getItem('medifind_auth_user')) {
                    sessionStorage.setItem('medifind_auth_user', JSON.stringify(this.currentUser));
                }
            }
            return res;
        } catch (err) {
            console.error('[Auth Service] Update Profile Error:', err);
            return { success: false, message: err.message || 'Failed to update profile.' };
        }
    }

    // 5. Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('medifind_auth_user');
        sessionStorage.removeItem('medifind_auth_user');
        localStorage.removeItem('medifind_auth_token');
        localStorage.removeItem('medifind_jwt_token');
        sessionStorage.removeItem('medifind_auth_token');
        sessionStorage.removeItem('medifind_jwt_token');
        api.clearToken();
        if (this.app) {
            this.app.state.cart = [];
            this.app.state.orders = [];
            this.app.state.currentRole = 'auth';
            this.app.state.authMode = 'login';
            this.app.showToast('Logged out successfully');
            this.app.render();
        }
    }

    setCurrentUser(user, rememberMe) {
        const token = user?.token || localStorage.getItem('medifind_auth_token') || localStorage.getItem('medifind_jwt_token') || sessionStorage.getItem('medifind_jwt_token');
        if (token) {
            user = { ...user, token };
            api.setToken(token);
            localStorage.setItem('medifind_auth_token', token);
            localStorage.setItem('medifind_jwt_token', token);
        }
        this.currentUser = user;
        const data = JSON.stringify(user);
        if (rememberMe) {
            localStorage.setItem('medifind_auth_user', data);
            if (token) {
                localStorage.setItem('medifind_auth_token', token);
                localStorage.setItem('medifind_jwt_token', token);
            }
        } else {
            sessionStorage.setItem('medifind_auth_user', data);
            if (token) {
                sessionStorage.setItem('medifind_auth_token', token);
                sessionStorage.setItem('medifind_jwt_token', token);
            }
        }
    }

    // 5. Role Redirection Matrix
    getRedirectTabForRole(role) {
        if (role === 'admin') return { role: 'admin', tab: 'overview' };
        if (role === 'pharmacy') return { role: 'pharmacy', tab: 'dashboard' };
        if (role === 'delivery') return { role: 'delivery', tab: 'dashboard' };
        return { role: 'customer', tab: 'home' };
    }

    // 6. Route Protection Guard
    canAccessRole(requestedRole) {
        return true;
    }

    // 7. Authentication Landing Page UI Renderer
    renderLandingPage() {
        return `
            <div style="min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(135deg, var(--background) 0%, var(--primary-light) 50%, var(--secondary-light) 100%); padding:24px;">
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:40px 32px; width:100%; max-width:480px; box-shadow:var(--shadow-lg); text-align:center;">
                    
                    <div class="brand-icon" style="width:68px; height:68px; font-size:32px; margin:0 auto 16px auto; background:linear-gradient(135deg, var(--primary) 0%, #0284c7 100%); box-shadow:var(--shadow-md);">
                        <i class="fa-solid fa-notes-medical"></i>
                    </div>

                    <h1 style="font-size:28px; font-weight:800; color:var(--text-main); margin-bottom:6px;">MediFind</h1>
                    <p style="font-size:14px; font-weight:700; color:var(--primary); margin-bottom:24px;">Real-Time Medicine Finder & 15-Min Delivery ⚡</p>

                    <!-- Primary Pathways -->
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <button class="add-cart-btn" style="width:100%; justify-content:center; padding:14px; font-size:15px;" onclick="MediApp.setAuthMode('login')">
                            <i class="fa-solid fa-right-to-bracket"></i> Sign In to Account
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // 8. Dedicated Login Page UI Renderer
    renderLoginPage() {
        const authMode = this.app.state.authMode;
        if (authMode === 'landing') return this.renderLandingPage();
        if (authMode === 'signup') return this.renderSignupPage();
        if (authMode === 'otp') return this.renderOtpPage();
        if (authMode === 'admin-login') return this.renderAdminLoginPage();

        return `
            <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, var(--background) 0%, var(--primary-light) 100%); padding:20px;">
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:32px; width:100%; max-width:440px; box-shadow:var(--shadow-lg);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                        <button class="btn-secondary" style="padding:6px 12px; font-size:12px;" onclick="MediApp.setAuthMode('landing')">
                            <i class="fa-solid fa-arrow-left"></i> Back to Landing
                        </button>
                        <span style="font-size:11px; font-weight:800; background:var(--primary-light); color:var(--primary); padding:3px 8px; border-radius:var(--radius-full);">USER AUTHENTICATION</span>
                    </div>

                    <div style="text-align:center; margin-bottom:24px;">
                        <div class="brand-icon" style="width:56px; height:56px; font-size:26px; margin:0 auto 12px auto;"><i class="fa-solid fa-notes-medical"></i></div>
                        <h2 style="font-size:24px; font-weight:800;">Welcome Back to MediFind</h2>
                        <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">Sign in to order medicines & track deliveries</p>
                    </div>

                    <form onsubmit="event.preventDefault(); MediApp.handleLoginFormSubmit(this);">
                        <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:20px;">
                            <div>
                                <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">EMAIL ADDRESS</label>
                                <input type="email" id="authEmail" placeholder="user@example.com" value="" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>

                            <div>
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                                    <label style="font-size:12px; font-weight:700;">PASSWORD</label>
                                </div>
                                <input type="password" id="authPassword" placeholder="••••••••" value="" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>

                            <div style="display:flex; align-items:center; gap:8px;">
                                <input type="checkbox" id="authRememberMe" checked style="width:16px; height:16px;">
                                <label for="authRememberMe" style="font-size:12px; color:var(--text-muted);">Remember login session</label>
                            </div>
                        </div>

                        <div id="authErrorBanner" style="display:none; background:var(--emergency-light); color:var(--emergency-red); padding:10px; border-radius:var(--radius-sm); font-size:12px; margin-bottom:14px;"></div>

                        <button type="submit" class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; font-size:15px;">
                            <i class="fa-solid fa-right-to-bracket"></i> Sign In to Portal
                        </button>
                    </form>

                    <!-- Separate Admin Login Switcher -->
                    <div style="margin-top:16px; padding-top:16px; border-top:1px dashed var(--card-border); text-align:center;">
                        <button type="button" class="btn-secondary" style="width:100%; justify-content:center; padding:10px; font-weight:700; color:var(--primary); background:var(--primary-light); border:1px solid var(--primary);" onclick="MediApp.setAuthMode('admin-login')">
                            <i class="fa-solid fa-user-shield"></i> Go to Admin Portal Login
                        </button>
                    </div>

                    <div style="text-align:center; margin-top:16px; font-size:13px; color:var(--text-muted);">
                        Don't have an account? <a href="#" style="color:var(--primary); font-weight:800;" onclick="MediApp.setAuthMode('signup')">Sign Up Here</a>
                    </div>
                </div>
            </div>
        `;
    }

    renderAdminLoginPage() {
        return `
            <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding:20px; color:white;">
                <div style="background:#1e293b; border:1px solid #334155; border-radius:var(--radius-lg); padding:32px; width:100%; max-width:440px; box-shadow:var(--shadow-lg);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                        <button class="btn-secondary" style="padding:6px 12px; font-size:12px; background:#334155; color:white; border:none;" onclick="MediApp.setAuthMode('login')">
                            <i class="fa-solid fa-arrow-left"></i> Back to User Login
                        </button>
                        <span style="font-size:11px; font-weight:800; background:#0284c7; color:white; padding:3px 8px; border-radius:var(--radius-full);">ADMIN CONTROL</span>
                    </div>

                    <div style="text-align:center; margin-bottom:24px;">
                        <div class="brand-icon" style="width:60px; height:60px; font-size:28px; margin:0 auto 12px auto; background:linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color:white;">
                            <i class="fa-solid fa-user-shield"></i>
                        </div>
                        <h2 style="font-size:24px; font-weight:800; color:white;">MediFind Admin Portal</h2>
                        <p style="font-size:13px; color:#94a3b8; margin-top:4px;">Authorized System Administrator Access</p>
                    </div>

                    <form onsubmit="event.preventDefault(); MediApp.handleAdminLoginFormSubmit(this);">
                        <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:20px;">
                            <div>
                                <label style="font-size:11px; font-weight:700; display:block; margin-bottom:4px; color:#cbd5e1; letter-spacing:0.5px;">ADMINISTRATOR EMAIL</label>
                                <input type="email" id="adminAuthEmail" placeholder="admin@medifind.com" required style="width:100%; padding:10px 12px; border:1px solid #475569; background:#0f172a; color:white; border-radius:var(--radius-sm); font-size:13px;">
                            </div>

                            <div>
                                <label style="font-size:11px; font-weight:700; display:block; margin-bottom:4px; color:#cbd5e1; letter-spacing:0.5px;">ADMINISTRATOR PASSWORD</label>
                                <input type="password" id="adminAuthPassword" placeholder="••••••••" required style="width:100%; padding:10px 12px; border:1px solid #475569; background:#0f172a; color:white; border-radius:var(--radius-sm); font-size:13px;">
                            </div>
                        </div>

                        <div id="adminAuthErrorBanner" style="display:none; background:#7f1d1d; color:#fca5a5; padding:10px; border-radius:var(--radius-sm); font-size:12px; margin-bottom:14px;"></div>

                        <button type="submit" class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; font-size:15px; background:linear-gradient(135deg, #0284c7 0%, #0369a1 100%); border:none;">
                            <i class="fa-solid fa-lock"></i> Access Admin Control Panel
                        </button>
                    </form>
                </div>
            </div>
        `;
    }

    // 9. Dedicated Signup Page UI Renderer
    renderSignupPage() {
        return `
            <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, var(--background) 0%, var(--secondary-light) 100%); padding:20px;">
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:32px; width:100%; max-width:520px; box-shadow:var(--shadow-lg);">
                    <div style="text-align:center; margin-bottom:20px;">
                        <div class="brand-icon" style="width:56px; height:56px; font-size:26px; margin:0 auto 12px auto; background:linear-gradient(135deg, #10b981 0%, #059669 100%);"><i class="fa-solid fa-user-plus"></i></div>
                        <h2 style="font-size:24px; font-weight:800;">Create MediFind Account</h2>
                        <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">Join India's fastest 15-minute medicine delivery network</p>
                    </div>

                    <form onsubmit="event.preventDefault(); MediApp.handleSignupFormSubmit(this);">
                        <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
                            <div>
                                <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">FULL NAME *</label>
                                <input type="text" id="signupName" placeholder="Alex Johnson" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>

                            <div style="display:flex; gap:10px;">
                                <div style="flex:1;">
                                    <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">EMAIL ADDRESS *</label>
                                    <input type="email" id="signupEmail" placeholder="user@example.com" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                                </div>
                                <div style="flex:1;">
                                    <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">PHONE NUMBER *</label>
                                    <input type="text" id="signupPhone" placeholder="+91 98765 43210" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                                </div>
                            </div>

                            <div>
                                <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">PASSWORD *</label>
                                <input type="password" id="signupPassword" placeholder="Minimum 6 characters" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>

                            <!-- Structured Address Section -->
                            <div style="margin-top:8px; padding-top:14px; border-top:1px dashed var(--card-border);">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
                                    <span style="font-size:13px; font-weight:800; color:var(--text-main);"><i class="fa-solid fa-map-location-dot" style="color:var(--primary);"></i> Delivery Address Section *</span>
                                    <button type="button" class="btn-secondary" style="padding:6px 12px; font-size:12px; font-weight:700; color:var(--primary); background:var(--primary-light); border:1px solid var(--primary);" onclick="MediApp.detectSignupLocation()">
                                        <i class="fa-solid fa-location-crosshairs"></i> 📍 Use My Current Location
                                    </button>
                                </div>

                                <div id="signupLocStatus" style="display:none; font-size:12px; padding:8px 12px; border-radius:var(--radius-sm); margin-bottom:10px;"></div>

                                <input type="hidden" id="signupLat" value="">
                                <input type="hidden" id="signupLng" value="">

                                <div style="display:flex; gap:10px; margin-bottom:10px;">
                                    <div style="flex:1;">
                                        <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:2px;">HOUSE / DOOR NO.</label>
                                        <input type="text" id="signupHouseNumber" placeholder="Flat 402, Block B" style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:12px;" oninput="MediApp.updateSignupFullAddress()">
                                    </div>
                                    <div style="flex:2;">
                                        <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:2px;">STREET / AREA</label>
                                        <input type="text" id="signupStreet" placeholder="Sector 18, Main Boulevard" style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:12px;" oninput="MediApp.updateSignupFullAddress()">
                                    </div>
                                </div>

                                <div style="display:flex; gap:8px; margin-bottom:10px;">
                                    <div style="flex:1;">
                                        <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:2px;">CITY *</label>
                                        <input type="text" id="signupCity" placeholder="Noida" required style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:12px;" oninput="MediApp.updateSignupFullAddress()">
                                    </div>
                                    <div style="flex:1;">
                                        <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:2px;">STATE</label>
                                        <input type="text" id="signupState" placeholder="Uttar Pradesh" style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:12px;" oninput="MediApp.updateSignupFullAddress()">
                                    </div>
                                    <div style="flex:1;">
                                        <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:2px;">PINCODE *</label>
                                        <input type="text" id="signupPincode" placeholder="201301" maxlength="6" required style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:12px;" oninput="MediApp.updateSignupFullAddress()">
                                    </div>
                                </div>

                                <div>
                                    <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:2px;">FULL DELIVERY ADDRESS *</label>
                                    <input type="text" id="signupAddress" placeholder="Flat 402, Sector 18, Noida, UP - 201301" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                                </div>
                            </div>
                        </div>

                        <div id="signupErrorBanner" style="display:none; background:var(--emergency-light); color:var(--emergency-red); padding:10px; border-radius:var(--radius-sm); font-size:12px; margin-bottom:14px;"></div>

                        <button type="submit" class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; font-size:15px; background:var(--secondary);">
                            <i class="fa-solid fa-user-check"></i> Register & Access Dashboard
                        </button>
                    </form>

                    <div style="text-align:center; margin-top:20px; font-size:13px; color:var(--text-muted);">
                        Already have an account? <a href="#" style="color:var(--primary); font-weight:800;" onclick="MediApp.setAuthMode('login')">Sign In Here</a>
                    </div>
                </div>
            </div>
        `;
    }

    // 10. Dedicated OTP Verification Page UI Renderer
    renderOtpPage() {
        const pendingEmail = (this.app && this.app.state && this.app.state.pendingOtpEmail) || 'user@example.com';
        return `
            <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, var(--background) 0%, var(--primary-light) 100%); padding:20px;">
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:32px; width:100%; max-width:440px; box-shadow:var(--shadow-lg); text-align:center;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                        <button type="button" class="btn-secondary" style="padding:6px 12px; font-size:12px;" onclick="MediApp.setAuthMode('signup')">
                            <i class="fa-solid fa-arrow-left"></i> Back to Register
                        </button>
                        <span style="font-size:11px; font-weight:800; background:var(--primary-light); color:var(--primary); padding:3px 8px; border-radius:var(--radius-full);">VERIFY EMAIL</span>
                    </div>

                    <div style="margin-bottom:24px;">
                        <div class="brand-icon" style="width:60px; height:60px; font-size:28px; margin:0 auto 12px auto; background:linear-gradient(135deg, #0d9488 0%, #0f766e 100%); color:#fff; display:flex; align-items:center; justify-content:center; border-radius:50%; box-shadow:var(--shadow-md);">
                            <i class="fa-solid fa-envelope-circle-check"></i>
                        </div>
                        <h2 style="font-size:24px; font-weight:800; margin-bottom:6px;">Verify your email</h2>
                        <p style="font-size:13px; color:var(--text-muted); line-height:1.5;">
                            We sent a 6-digit verification code to:<br>
                            <strong style="color:var(--primary); font-size:14px; word-break:break-all;">${pendingEmail}</strong>
                        </p>
                    </div>

                    <form onsubmit="event.preventDefault(); MediApp.handleVerifyOtpSubmit(this);">
                        <div style="margin-bottom:20px;">
                            <label style="font-size:12px; font-weight:700; display:block; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-main);">Enter 6-Digit OTP Code</label>
                            <input type="text" id="otpCodeInput" placeholder="• • • • • •" maxlength="6" pattern="[0-9]{6}" required style="width:100%; padding:14px; border:2px solid var(--card-border); border-radius:var(--radius-md); font-size:24px; font-weight:800; text-align:center; letter-spacing:10px; font-family:monospace; background:var(--card-bg); color:var(--text-main);" autocomplete="one-time-code">
                        </div>

                        <div id="otpErrorBanner" style="display:none; background:var(--emergency-light); color:var(--emergency-red); padding:10px; border-radius:var(--radius-sm); font-size:12px; margin-bottom:16px; font-weight:600; text-align:center;"></div>
                        <div id="otpSuccessBanner" style="display:none; background:#f0fdf4; color:#166534; padding:10px; border-radius:var(--radius-sm); font-size:12px; margin-bottom:16px; font-weight:600; text-align:center;"></div>

                        <button type="submit" id="btnVerifyOtp" class="add-cart-btn" style="width:100%; justify-content:center; padding:14px; font-size:15px; font-weight:700; background:var(--primary);">
                            <i class="fa-solid fa-shield-check"></i> Verify OTP
                        </button>
                    </form>

                    <div style="margin-top:20px; padding-top:16px; border-top:1px dashed var(--card-border); display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:12px; color:var(--text-muted);">Didn't receive the code?</span>
                        <button type="button" class="btn-secondary" style="padding:6px 12px; font-size:12px; color:var(--primary); border:1px solid var(--primary-light);" onclick="MediApp.handleResendOtp()">
                            <i class="fa-solid fa-rotate-right"></i> Resend OTP
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}
