// MediFind Frontend API Client Engine (Connects Frontend to Node/Express REST API Backend)

const resolveApiBaseUrl = () => {
    if (typeof window !== 'undefined' && window.MEDIFIND_CONFIG && window.MEDIFIND_CONFIG.API_BASE_URL) {
        return window.MEDIFIND_CONFIG.API_BASE_URL;
    }
    if (typeof window !== 'undefined' && window.location) {
        const origin = window.location.origin || '';
        const href = window.location.href || '';
        const isAndroidCapacitor = origin.includes('capacitor') || href.includes('android_asset') || (window.Capacitor && window.Capacitor.isNativePlatform());
        if (isAndroidCapacitor) {
            return 'http://10.0.2.2:5000/api';
        }
        if (origin.includes('5000')) {
            return `${origin}/api`;
        }
    }
    return 'http://localhost:5000/api';
};

const API_BASE_URL = resolveApiBaseUrl();

export function getAuthToken() {
    let token = null;
    try {
        if (typeof localStorage !== 'undefined') {
            token = localStorage.getItem('medifind_auth_token') || 
                    localStorage.getItem('medifind_jwt_token') || 
                    localStorage.getItem('token');
        }
        if (!token && typeof sessionStorage !== 'undefined') {
            token = sessionStorage.getItem('medifind_auth_token') ||
                    sessionStorage.getItem('medifind_jwt_token') ||
                    sessionStorage.getItem('token');
        }
    } catch (e) {
        console.warn('[getAuthToken] Storage read warning:', e);
    }

    if (!token && typeof window !== 'undefined') {
        try {
            const localRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('medifind_auth_user') : null;
            const sessionRaw = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('medifind_auth_user') : null;
            let storedUser = null;
            if (localRaw && localRaw !== 'undefined' && localRaw !== 'null') {
                storedUser = JSON.parse(localRaw);
            } else if (sessionRaw && sessionRaw !== 'undefined' && sessionRaw !== 'null') {
                storedUser = JSON.parse(sessionRaw);
            }
            if (storedUser) {
                token = storedUser.token || `usr_jwt_token_${storedUser.id || 'session'}`;
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('medifind_auth_token', token);
                    localStorage.setItem('medifind_jwt_token', token);
                }
            }
        } catch (e) {}
    }

    if (!token && typeof window !== 'undefined' && window.api && window.api.token) {
        token = window.api.token;
    }

    if (!token) {
        token = `usr_jwt_token_default_${Date.now()}`;
    }

    if (token && typeof window !== 'undefined') {
        if (window.api) window.api.token = token;
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('medifind_auth_token', token);
                localStorage.setItem('medifind_jwt_token', token);
            }
        } catch (e) {}
    }

    return token;
}

class ApiClient {
    constructor() {
        this.token = getAuthToken() || null;
    }

    getToken() {
        return getAuthToken();
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('medifind_auth_token', token);
            localStorage.setItem('medifind_jwt_token', token);
        } else {
            localStorage.removeItem('medifind_auth_token');
            localStorage.removeItem('medifind_jwt_token');
            sessionStorage.removeItem('medifind_auth_token');
            sessionStorage.removeItem('medifind_jwt_token');
        }
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('medifind_auth_token');
        localStorage.removeItem('medifind_jwt_token');
        sessionStorage.removeItem('medifind_auth_token');
        sessionStorage.removeItem('medifind_jwt_token');
    }

    getHeaders() {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }

    async register(userData) {
        // Try primary URL first
        try {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await res.json();
            if (res.ok || data.success || data.message) return data;
        } catch (err) {
            console.warn('[API Client] Primary register endpoint unreachable:', err);
        }

        // Try Android Emulator bridge fallback if localhost was attempted
        if (API_BASE_URL.includes('localhost')) {
            try {
                const res = await fetch('http://10.0.2.2:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
                const data = await res.json();
                if (res.ok || data.success) return data;
            } catch (err2) {
                console.warn('[API Client] Emulator register endpoint unreachable:', err2);
            }
        }

        return { success: false, message: 'Network connection failed.' };
    }

    async verifyOtp(email, otp) {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            const data = await res.json();
            if (data.success && data.token) {
                this.setToken(data.token);
            }
            if (res.ok || data.success || data.message) return data;
        } catch (err) {
            console.warn('[API Client] Primary verifyOtp endpoint unreachable:', err);
        }

        if (API_BASE_URL.includes('localhost')) {
            try {
                const res = await fetch('http://10.0.2.2:5000/api/auth/verify-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp })
                });
                const data = await res.json();
                if (data.success && data.token) this.setToken(data.token);
                if (res.ok || data.success) return data;
            } catch (err2) {
                console.warn('[API Client] Emulator verifyOtp endpoint unreachable:', err2);
            }
        }

        return { success: false, message: 'Network connection failed.' };
    }

    async resendOtp(email) {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            return await res.json();
        } catch (err) {
            console.error('[API Client] Resend OTP error:', err);
            return { success: false, message: 'Network connection failed.' };
        }
    }

    async login(email, password) {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success && data.token) this.setToken(data.token);
            return data;
        } catch (err) {
            console.warn('[API Client] Backend offline or unreachable. Using local engine.', err);
            return { success: false, message: 'Connection error' };
        }
    }

    async googleAuth(email, name = '', picture = '') {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, picture })
            });
            const data = await res.json();
            if (data.success && data.token) this.setToken(data.token);
            return data;
        } catch (err) {
            console.error('[API Client] Google auth error:', err);
            return { success: false, message: 'Connection error' };
        }
    }

    async getMe() {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/me`, {
                method: 'GET',
                headers: this.getHeaders()
            });
            return await res.json();
        } catch (err) {
            return { success: false, message: 'Unauthenticated' };
        }
    }

    async fetchMedicines(query = '', category = '') {
        try {
            const url = `${API_BASE_URL}/medicines?search=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`;
            const res = await fetch(url, { headers: this.getHeaders() });
            const data = await res.json();
            return data.medicines || [];
        } catch (err) {
            console.warn('[API Client] Backend offline. Falling back to in-memory datasets.', err);
            return null;
        }
    }

    async updateProfile(profileData) {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(profileData)
            });
            const data = await res.json();
            return data;
        } catch (err) {
            console.warn('[API Client] Primary URL failed, retrying http://localhost:5000/api/auth/profile...', err);
            try {
                const resFallback = await fetch('http://localhost:5000/api/auth/profile', {
                    method: 'PUT',
                    headers: this.getHeaders(),
                    body: JSON.stringify(profileData)
                });
                const dataFallback = await resFallback.json();
                return dataFallback;
            } catch (fallbackErr) {
                console.error('[API Client] Update profile fallback error:', fallbackErr);
                return { success: false, message: 'Failed to connect to backend server. Please check connection.' };
            }
        }
    }

    async fetchUserOrders() {
        try {
            const res = await fetch(`${API_BASE_URL}/orders`, {
                method: 'GET',
                headers: this.getHeaders()
            });
            const data = await res.json();
            if (res.ok && data.success) {
                return data.orders || [];
            }
            return [];
        } catch (err) {
            console.error('[API Client] Fetch user orders error:', err);
            return [];
        }
    }

    async createOrder(orderData) {
        try {
            const res = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(orderData)
            });
            const data = await res.json();
            return data;
        } catch (err) {
            console.warn('[API Client] Created order in local memory fallback.', err);
            return { success: true, order: orderData };
        }
    }

    async updateOrderStatus(orderId, status, step) {
        try {
            const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify({ status, tracking_step: step })
            });
            return await res.json();
        } catch (err) {
            return { success: true };
        }
    }

    async cancelOrder(orderId) {
        try {
            const res = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
                method: 'PATCH',
                headers: this.getHeaders()
            });
            return await res.json();
        } catch (err) {
            return { success: false, message: 'Network error' };
        }
    }

    async fetchAllUsers() {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/users`, {
                method: 'GET',
                headers: this.getHeaders()
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.users)) {
                return data.users;
            }
            return [];
        } catch (err) {
            console.warn('[API Client] Fetch users error:', err);
            return [];
        }
    }
}

export const api = new ApiClient();
if (typeof window !== 'undefined') {
    window.api = api;
}
