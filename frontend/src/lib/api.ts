const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || error.message || "Request failed");
  }

  return response.json();
}

export const api = {
  // Auth
  register: (data: { email: string; password: string; name?: string }) =>
    fetchAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: async (credentials: { email: string; password: string }) => {
    const result = await fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (result.token) {
      localStorage.setItem("authToken", result.token);
    }
    return result;
  },

  logout: () => {
    localStorage.removeItem("authToken");
    // Call backend logout if you have session cleanup
  },

  getProfile: () => fetchAPI("/auth/profile"),

  // Entries
  getEntries: () => fetchAPI("/entries"),

  getEntry: (id: string) => fetchAPI(`/entries/${id}`),

  createEntry: (data: any) =>
    fetchAPI("/entries", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateEntry: (id: string, data: any) =>
    fetchAPI(`/entries/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteEntry: (id: string) =>
    fetchAPI(`/entries/${id}`, {
      method: "DELETE",
    }),
};
