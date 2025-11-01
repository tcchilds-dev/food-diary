const API_URL = import.meta.env.VITE_API_URL || "/api";

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Include cookies for auth
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Entries
  getEntries: () => fetchAPI("/entries"),
  createEntry: (data: any) =>
    fetchAPI("/entries", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Auth
  login: (credentials: { email: string; password: string }) =>
    fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  logout: () => fetchAPI("/auth/logout", { method: "POST" }),
};
