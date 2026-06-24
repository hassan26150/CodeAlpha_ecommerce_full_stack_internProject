const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
    static getToken() {
        return localStorage.getItem('token');
    }

    static async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        const token = this.getToken();
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        // If body is FormData, remove Content-Type to let browser set boundary
        if (options.body instanceof FormData) {
            delete headers['Content-Type'];
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error.message);
            throw error;
        }
    }

    // Auth
    static async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    static async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    static async getProfile() {
        return this.request('/auth/profile');
    }

    static async updateProfile(userData) {
        return this.request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    // Products
    static async getProducts(keyword = '', page = 1, category = '') {
        let qs = `?pageNumber=${page}`;
        if (keyword) qs += `&keyword=${keyword}`;
        if (category) qs += `&category=${category}`;
        
        return this.request(`/products${qs}`);
    }

    static async getProduct(id) {
        return this.request(`/products/${id}`);
    }

    static async createProduct(productData) {
        // Use FormData for file upload
        return this.request('/products', {
            method: 'POST',
            body: productData
        });
    }

    static async updateProduct(id, productData) {
        return this.request(`/products/${id}`, {
            method: 'PUT',
            body: productData
        });
    }

    static async deleteProduct(id) {
        return this.request(`/products/${id}`, {
            method: 'DELETE'
        });
    }

    // Orders
    static async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    static async getOrderDetails(id) {
        return this.request(`/orders/${id}`);
    }

    static async getMyOrders() {
        return this.request('/orders/myorders');
    }

    static async getOrders() {
        return this.request('/orders');
    }

    static async updateOrderStatus(id, status, isPaid = false) {
        return this.request(`/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status, isPaid })
        });
    }

    static async cancelOrder(id) {
        return this.request(`/orders/${id}/cancel`, {
            method: 'PUT'
        });
    }
}

// Global Cart Manager
class CartManager {
    static getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    static addToCart(product, qty) {
        const cart = this.getCart();
        const existItem = cart.find(x => x.product === product._id);

        if (existItem) {
            existItem.qty = qty;
        } else {
            cart.push({
                product: product._id,
                name: product.name,
                image: product.imageUrl,
                price: product.price,
                qty
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartBadge();
    }

    static removeFromCart(id) {
        const cart = this.getCart().filter(x => x.product !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartBadge();
    }

    static clearCart() {
        localStorage.removeItem('cart');
        this.updateCartBadge();
    }

    static updateCartBadge() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const cart = this.getCart();
            const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
            badge.textContent = totalQty;
            badge.style.display = totalQty > 0 ? 'inline-block' : 'none';
        }
    }
}

// Global Auth Manager
class AuthManager {
    static getUser() {
        return JSON.parse(localStorage.getItem('userInfo'));
    }

    static setUser(userData) {
        localStorage.setItem('userInfo', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
    }

    static logout() {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }

    static updateNavLinks() {
        const user = this.getUser();
        const authLinks = document.getElementById('auth-links');
        
        if (authLinks) {
            if (user) {
                let adminLink = '';
                if (user.role === 'admin') {
                    adminLink = `<a href="admin.html" class="nav-link">Admin</a>`;
                }
                
                authLinks.innerHTML = `
                    ${adminLink}
                    <a href="profile.html" class="nav-link"><i class="fas fa-user"></i> ${user.name}</a>
                    <a href="#" id="logout-btn" class="nav-link"><i class="fas fa-sign-out-alt"></i> Logout</a>
                `;

                document.getElementById('logout-btn').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            } else {
                authLinks.innerHTML = `
                    <a href="login.html" class="nav-link"><i class="fas fa-sign-in-alt"></i> Login</a>
                    <a href="register.html" class="btn btn-primary btn-sm">Register</a>
                `;
            }
        }
    }
}

// Utility: Show Toast
function showToast(message, type = 'success') {
    let toast = document.getElementById('app-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'app-toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = `toast show ${type === 'error' ? 'bg-danger' : 'bg-success'}`;
    
    // Quick inline styling for bg colors
    if (type === 'error') {
        toast.style.backgroundColor = 'var(--danger)';
    } else {
        toast.style.backgroundColor = 'var(--success)';
    }

    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}
