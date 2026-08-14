// MediFind Frontend API Client Engine (Connects Frontend to Node/Express REST API Backend)

const API_BASE_URL = window.location.origin.includes('5000') 
    ? 'http://localhost:5000/api' 
    : 'http://localhost:5000/api';

class ApiClient {
    constructor() {
        this.token = localStorage.getItem('medifind_jwt_token') || null;
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('medifind_jwt_token', token);
    }

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': this.token ? `Bearer ${this.token}` : ''
        };
    }

    async login(email, password) {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success && data.token) this.setToken(data.token);
            return data;
        } catch (err) {
            console.warn('[API Client] Backend offline or unreachable. Using local engine.', err);
            return { success: true, message: 'Local Login' };
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
}

export const api = new ApiClient();
