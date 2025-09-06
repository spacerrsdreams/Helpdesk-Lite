const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://jsonplaceholder.typicode.com";

export async function apiRequest<T>(url: string, options: RequestInit = { method: "GET" }): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export const ApiRoutes = {
  posts: {
    create: "/posts",
    getAll: "/posts",
    getById: (id: number) => `/posts/${id}`,
    delete: (id: number) => `/posts/${id}`,
    update: (id: number) => `/posts/${id}`,
  },
  users: {
    getAll: "/users",
    getById: (id: number) => `/users/${id}`,
  },
  notes: {
    getAll: "/comments",
    create: "/comments",
  },
};
