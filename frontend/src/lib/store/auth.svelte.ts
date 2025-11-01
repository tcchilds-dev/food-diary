import { api } from "$lib/api";

class AuthStore {
  user = $state<any>(null);
  loading = $state(false);

  async login(credentials: { email: string; password: string }) {
    this.loading = true;
    try {
      const result = await api.login(credentials);
      this.user = result.user;
      return result;
    } finally {
      this.loading = false;
    }
  }

  async register(data: { email: string; password: string; name?: string }) {
    this.loading = true;
    try {
      const result = await api.register(data);
      this.user = result.user;
      if (result.token) {
        localStorage.setItem("authToken", result.token);
      }
      return result;
    } finally {
      this.loading = false;
    }
  }

  logout() {
    api.logout();
    this.user = null;
  }

  async checkAuth() {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      this.user = await api.getProfile();
    } catch (error) {
      this.logout();
    }
  }
}

export const authStore = new AuthStore();
