const API_BASE =
  import.meta.env.MODE === "development"
    ? "/api"
    : `${import.meta.env.VITE_API_URL}/api`;

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const api = {
  auth: {
    signup: (body: { name: string; email: string; password: string }) =>
      request<{ success: boolean; data: { user: import("../types").User; token: string } }>(
        "/auth/signup",
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      ),

    login: (body: { email: string; password: string }) =>
      request<{ success: boolean; data: { user: import("../types").User; token: string } }>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      ),
  },

  users: {
    getAll: () =>
      request<{ success: boolean; data: import("../types").User[] }>("/users"),

    getAssignees: () =>
      request<{ success: boolean; data: import("../types").User[] }>(
        "/users/assignees"
      ),

    updateRole: (id: string, role: string) =>
      request<{ success: boolean; data: import("../types").User }>(
        `/users/${id}/role`,
        {
          method: "PUT",
          body: JSON.stringify({ role }),
        }
      ),
  },

  tasks: {
    getAll: (filters: import("../types").TaskFilters = {}) => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, String(value));
        }
      });

      const query = params.toString();

      return request<import("../types").ApiResponse<import("../types").Task[]>>(
        `/tasks${query ? `?${query}` : ""}`
      );
    },

    getById: (id: string) =>
      request<{ success: boolean; data: import("../types").Task }>(
        `/tasks/${id}`
      ),

    create: (body: Record<string, unknown>) =>
      request<{ success: boolean; data: import("../types").Task }>("/tasks", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    update: (id: string, body: Record<string, unknown>) =>
      request<{ success: boolean; data: import("../types").Task }>(
        `/tasks/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(body),
        }
      ),

    delete: (id: string) =>
      request<{ success: boolean; data: { message: string } }>(
        `/tasks/${id}`,
        {
          method: "DELETE",
        }
      ),
  },

  comments: {
    getAll: (taskId: string) =>
      request<{ success: boolean; data: import("../types").Comment[] }>(
        `/tasks/${taskId}/comments`
      ),

    create: (taskId: string, message: string) =>
      request<{ success: boolean; data: import("../types").Comment }>(
        `/tasks/${taskId}/comments`,
        {
          method: "POST",
          body: JSON.stringify({ message }),
        }
      ),
  },
};
