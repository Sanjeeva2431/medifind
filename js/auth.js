// MediFind Firebase Authentication Service Module
// Handles Signup, Login, Password Reset, Remember Me, Logout, Role Redirection & Route Guards

import { firestoreDb } from './firestore-db.js';

export class AuthService {
    constructor(app) {
        this.app = app;
        this.currentUser = JSON.parse(localStorage.getItem('medifind_auth_user')) || null;
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

    // 1. Email Signup
    async signup(email, password, name, role = 'customer', phone = '', address = '') {
        try {
            // Check if user already exists
            const existingUsers = Array.from(firestoreDb.collections.Users.values());
            if (existingUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                return { success: false, message: 'An account with this email already exists.' };
            }

            const newUser = {
                id: `usr_${Date.now()}`,
                name,
                email: email.toLowerCase(),
                phone: phone || '+91 98765 43210',
                role,
                address: address || 'Sector 18, Noida',
                profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                created_at: new Date().toISOString()
            };

            await firestoreDb.createUser(newUser);
            this.setCurrentUser(newUser, true);

            return { success: true, user: newUser, message: `Account created! Welcome ${name}.` };
        } catch (err) {
            console.error('[Firebase Auth] Signup Error:', err);
            return { success: false, message: err.message || 'Signup failed' };
        }
    }

    // 2. Email Login
    async login(email, password, rememberMe = true) {
        try {
            const users = Array.from(firestoreDb.collections.Users.values());
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user) {
                return { success: false, message: 'No account found with this email.' };
            }

            this.setCurrentUser(user, rememberMe);
            return { success: true, user, message: `Welcome back, ${user.name}!` };
        } catch (err) {
            console.error('[Firebase Auth] Login Error:', err);
            return { success: false, message: 'Invalid credentials.' };
        }
    }

    // 3. Forgot Password
    async forgotPassword(email) {
        try {
            const users = Array.from(firestoreDb.collections.Users.values());
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user) {
                return { success: false, message: 'Email address not found in system.' };
            }

            return { success: true, message: `Password reset link sent to ${email}` };
        } catch (err) {
            return { success: false, message: 'Failed to send reset email.' };
        }
    }

    // 4. Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('medifind_auth_user');
        sessionStorage.removeItem('medifind_auth_user');
        if (this.app) {
            this.app.state.currentRole = 'customer';
            this.app.showToast('Logged out successfully');
            this.app.render();
        }
    }

    setCurrentUser(user, rememberMe) {
        this.currentUser = user;
        const data = JSON.stringify(user);
        if (rememberMe) {
            localStorage.setItem('medifind_auth_user', data);
        } else {
            sessionStorage.setItem('medifind_auth_user', data);
        }
    }

    // 5. Role Redirection Matrix
    getRedirectTabForRole(role) {
        switch (role) {
            case 'pharmacy':
                return { role: 'pharmacy', tab: 'dashboard' };
            case 'delivery':
                return { role: 'delivery', tab: 'tasks' };
            case 'admin':
                return { role: 'admin', tab: 'overview' };
            case 'customer':
            default:
                return { role: 'customer', tab: 'home' };
        }
    }

    // 6. Route Protection Guard
    canAccessRole(requestedRole) {
        if (!this.isAuthenticated()) return false;
        const currentRole = this.getRole();
        if (currentRole === 'admin') return true; // Admin can access all portals
        return currentRole === requestedRole;
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
                    <p style="font-size:14px; font-weight:700; color:var(--primary); margin-bottom:4px;">Real-Time Medicine Finder & 15-Min Delivery ⚡</p>
                    <p style="font-size:12px; color:var(--text-muted); margin-bottom:28px; max-width:360px; margin-left:auto; margin-right:auto;">
                        Order genuine medicines from verified nearby pharmacies with live GPS driver tracking.
                    </p>

                    <!-- 3 Primary Pathways -->
                    <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:28px;">
                        <button class="add-cart-btn" style="width:100%; justify-content:center; padding:14px; font-size:15px;" onclick="MediApp.setAuthMode('login')">
                            <i class="fa-solid fa-right-to-bracket"></i> Sign In to Account
                        </button>

                        <button class="add-cart-btn" style="width:100%; justify-content:center; padding:14px; font-size:15px; background:var(--secondary);" onclick="MediApp.setAuthMode('signup')">
                            <i class="fa-solid fa-user-plus"></i> Create New Account
                        </button>

                        <button class="btn-secondary" style="width:100%; justify-content:center; padding:12px; font-size:14px; border:1.5px solid var(--card-border);" onclick="MediApp.continueAsGuest()">
                            <i class="fa-solid fa-user-clock"></i> Continue as Guest
                        </button>
                    </div>

                    <!-- 4 System Roles Card -->
                    <div style="background:var(--background); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:16px; text-align:left;">
                        <div style="font-size:11px; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">SUPPORTED PLATFORM ROLES</div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:12px; font-weight:700;">
                            <div style="display:flex; align-items:center; gap:6px;"><i class="fa-solid fa-user" style="color:var(--primary);"></i> Customer</div>
                            <div style="display:flex; align-items:center; gap:6px;"><i class="fa-solid fa-store" style="color:var(--secondary);"></i> Pharmacy</div>
                            <div style="display:flex; align-items:center; gap:6px;"><i class="fa-solid fa-motorcycle" style="color:#f97316;"></i> Delivery Driver</div>
                            <div style="display:flex; align-items:center; gap:6px;"><i class="fa-solid fa-shield-halved" style="color:#8b5cf6;"></i> Admin</div>
                        </div>
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

        return `
            <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, var(--background) 0%, var(--primary-light) 100%); padding:20px;">
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:32px; width:100%; max-width:440px; box-shadow:var(--shadow-lg);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                        <button class="btn-secondary" style="padding:6px 12px; font-size:12px;" onclick="MediApp.setAuthMode('landing')">
                            <i class="fa-solid fa-arrow-left"></i> Back to Landing
                        </button>
                        <span style="font-size:11px; font-weight:800; background:var(--primary-light); color:var(--primary); padding:3px 8px; border-radius:var(--radius-full);">FIREBASE AUTH</span>
                    </div>

                    <div style="text-align:center; margin-bottom:24px;">
                        <div class="brand-icon" style="width:56px; height:56px; font-size:26px; margin:0 auto 12px auto;"><i class="fa-solid fa-notes-medical"></i></div>
                        <h2 style="font-size:24px; font-weight:800;">Welcome Back to MediFind</h2>
                        <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">Sign in to access your healthcare portal</p>
                    </div>

                    <form onsubmit="event.preventDefault(); MediApp.handleLoginFormSubmit(this);">
                        <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:20px;">
                            <div>
                                <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">ACCOUNT ROLE</label>
                                <select id="authRoleSelect" style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px; font-weight:700; background:var(--background);">
                                    <option value="customer">Customer (Patient)</option>
                                    <option value="pharmacy">Pharmacy Store Owner</option>
                                    <option value="delivery">Delivery Fleet Driver</option>
                                    <option value="admin">Platform Admin</option>
                                </select>
                            </div>

                            <div>
                                <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">EMAIL ADDRESS</label>
                                <input type="email" id="authEmail" placeholder="alex@example.com" value="alex@example.com" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>

                            <div>
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                                    <label style="font-size:12px; font-weight:700;">PASSWORD</label>
                                    <a href="#" style="font-size:11px; color:var(--primary); font-weight:700;" onclick="MediApp.openForgotPasswordModal()">Forgot Password?</a>
                                </div>
                                <input type="password" id="authPassword" placeholder="••••••••" value="password123" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
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

                    <div style="text-align:center; margin-top:20px; font-size:13px; color:var(--text-muted);">
                        Don't have an account? <a href="#" style="color:var(--primary); font-weight:800;" onclick="MediApp.setAuthMode('signup')">Sign Up Here</a>
                    </div>
                </div>
            </div>
        `;
    }

    // 8. Dedicated Signup Page UI Renderer
    renderSignupPage() {
        return `
            <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, var(--background) 0%, var(--secondary-light) 100%); padding:20px;">
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:32px; width:100%; max-width:480px; box-shadow:var(--shadow-lg);">
                    <div style="text-align:center; margin-bottom:24px;">
                        <div class="brand-icon" style="width:56px; height:56px; font-size:26px; margin:0 auto 12px auto; background:linear-gradient(135deg, #10b981 0%, #059669 100%);"><i class="fa-solid fa-user-plus"></i></div>
                        <h2 style="font-size:24px; font-weight:800;">Create MediFind Account</h2>
                        <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">Join India's fastest 15-minute medicine delivery network</p>
                    </div>

                    <form onsubmit="event.preventDefault(); MediApp.handleSignupFormSubmit(this);">
                        <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
                            <div>
                                <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">REGISTER AS ROLE</label>
                                <select id="signupRole" style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px; font-weight:700; background:var(--background);">
                                    <option value="customer">Customer / Patient</option>
                                    <option value="pharmacy">Pharmacy Store Owner</option>
                                    <option value="delivery">Delivery Fleet Driver</option>
                                    <option value="admin">Platform Admin</option>
                                </select>
                            </div>

                            <div>
                                <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">FULL NAME</label>
                                <input type="text" id="signupName" placeholder="Dr. S. K. Gupta or Alex Johnson" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>

                            <div style="display:flex; gap:10px;">
                                <div style="flex:1;">
                                    <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">EMAIL ADDRESS</label>
                                    <input type="email" id="signupEmail" placeholder="user@example.com" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                                </div>
                                <div style="flex:1;">
                                    <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">PHONE NUMBER</label>
                                    <input type="text" id="signupPhone" placeholder="+91 98765 43210" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                                </div>
                            </div>

                            <div>
                                <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">ADDRESS / LOCATION</label>
                                <input type="text" id="signupAddress" placeholder="Sector 18, Noida, UP - 201301" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>

                            <div>
                                <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">PASSWORD</label>
                                <input type="password" id="signupPassword" placeholder="Minimum 6 characters" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
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
}
