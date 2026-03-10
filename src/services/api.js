import axios from "axios";
import { API_URL } from "../lib/config";

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: { "Content-Type": "application/json" },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("azrarauthtoken");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error),
    );

    // 401 → avtomatik logout
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("azrarauthtoken");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      },
    );
  }

  setAuthToken(token) {
    if (token) this.api.defaults.headers.Authorization = `Bearer ${token}`;
    else delete this.api.defaults.headers.Authorization;
  }

  // ─── Auth ─────────────────────────────────────────────
  login(phoneNumber, password) {
    return this.api.post("/auth/login", { phoneNumber, password });
  }
  getProfile() {
    return this.api.get("/auth/profile");
  }
  changePassword(currentPassword, newPassword) {
    return this.api.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  }

  // ─── Admin ────────────────────────────────────────────
  getAdmins(params) {
    return this.api.get("/admin", { params });
  }
  getAdmin(id) {
    return this.api.get(`/admin/${id}`);
  }
  createAdmin(data) {
    return this.api.post("/admin", data);
  }
  updateAdmin(id, data) {
    return this.api.put(`/admin/${id}`, data);
  }
  deleteAdmin(id) {
    return this.api.delete(`/admin/${id}`);
  }

  // ─── Category ─────────────────────────────────────────
  getCategories(params) {
    return this.api.get("/categories", { params });
  }
  getCategory(id) {
    return this.api.get(`/categories/${id}`);
  }
  createCategory(data) {
    return this.api.post("/categories", data);
  }
  updateCategory(id, data) {
    return this.api.put(`/categories/${id}`, data);
  }
  deleteCategory(id) {
    return this.api.delete(`/categories/${id}`);
  }

  // ─── Product ──────────────────────────────────────────
  getProducts(params) {
    return this.api.get("/products", { params });
  }
  getProduct(id) {
    return this.api.get(`/products/${id}`);
  }
  createProduct(formData) {
    return this.api.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  updateProduct(id, formData) {
    return this.api.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  deleteProduct(id) {
    return this.api.delete(`/products/${id}`);
  }

  // ─── Order ────────────────────────────────────────────
  getOrders(params) {
    return this.api.get("/orders", { params });
  }
  getOrder(id) {
    return this.api.get(`/orders/${id}`);
  }
  updateOrderStatus(id, status, internalNotes) {
    return this.api.put(`/orders/${id}/status`, { status, internalNotes });
  }
  cancelOrder(id, reason) {
    return this.api.put(`/orders/${id}/cancel`, { reason });
  }

  // ─── Project ──────────────────────────────────────────
  getProjects(params) {
    return this.api.get("/projects", { params });
  }
  getProject(id) {
    return this.api.get(`/projects/${id}`);
  }
  createProject(formData) {
    return this.api.post("/projects", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  updateProject(id, formData) {
    return this.api.put(`/projects/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  deleteProject(id) {
    return this.api.delete(`/projects/${id}`);
  }

  // ─── Testimonial ──────────────────────────────────────
  getTestimonials(params) {
    return this.api.get("/testimonials", { params });
  }
  getTestimonial(id) {
    return this.api.get(`/testimonials/${id}`);
  }
  createTestimonial(formData) {
    return this.api.post("/testimonials", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  updateTestimonial(id, formData) {
    return this.api.put(`/testimonials/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  deleteTestimonial(id) {
    return this.api.delete(`/testimonials/${id}`);
  }
}

export const apiService = new ApiService();
