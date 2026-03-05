import axios from "axios";
import { API_URL } from "../lib/config";

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("saipovauthtoken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );
  }

  setAuthToken(token) {
    if (token) {
      this.api.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.Authorization;
    }
  }

  // Auth endpoints
  async login(phoneNumber, password) {
    return this.api.post("/auth/login", { phoneNumber, password });
  }

  async getProfile() {
    return this.api.get("/auth/profile");
  }

  async changePassword(currentPassword, newPassword) {
    return this.api.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  }

  // Admin endpoints
  async getAdmins() {
    return this.api.get("/admin");
  }

  async getAdmin(id) {
    return this.api.get(`/admin/${id}`);
  }

  async createAdmin(data) {
    return this.api.post("/admin", data);
  }

  async updateAdmin(id, data) {
    return this.api.put(`/admin/${id}`, data);
  }

  async deleteAdmin(id) {
    return this.api.delete(`/admin/${id}`);
  }

  // Product endpoints
  async getProducts(params) {
    return this.api.get("/products", { params });
  }

  async getProduct(id) {
    return this.api.get(`/products/${id}`);
  }

  async createProduct(formData) {
    return this.api.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async updateProduct(id, formData) {
    return this.api.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async deleteProduct(id) {
    return this.api.delete(`/products/${id}`);
  }

  async updateInventory(id, stockQuantity) {
    return this.api.patch(`/products/${id}/inventory`, { stockQuantity });
  }

  // Category endpoints
  async getCategories() {
    return this.api.get("/categories");
  }

  async getCategory(id) {
    return this.api.get(`/categories/${id}`);
  }

  async createCategory(data) {
    return this.api.post("/categories", data);
  }

  async updateCategory(id, data) {
    return this.api.put(`/categories/${id}`, data);
  }

  async deleteCategory(id) {
    return this.api.delete(`/categories/${id}`);
  }

  // Order endpoints
  async getOrders(params) {
    return this.api.get(`/orders`, { params });
  }

  async getOrder(id) {
    return this.api.get(`/orders/${id}`);
  }

  async createOrder(data) {
    return this.api.post("/orders", data);
  }

  async updateOrderStatus(id, status, internalNotes) {
    return this.api.put(`/orders/${id}/status`, { status, internalNotes });
  }

  async cancelOrder(id, reason) {
    return this.api.put(`/orders/${id}/cancel`, { reason });
  }
}

export const apiService = new ApiService();
