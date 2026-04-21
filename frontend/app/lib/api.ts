// ============================================
// Homara — API Client Service
// ============================================

// Detectar URL del backend según el ambiente
const getApiUrl = () => {
  // En Docker: http://backend:5000
  // En desarrollo local: http://localhost:5000
  if (typeof window === "undefined") {
    // Server-side (SSR)
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  }
  // Client-side
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "http://backend:5000")
  );
};

const API_BASE_URL = getApiUrl();

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

/**
 * Realiza una petición HTTP al backend
 */
async function apiCall<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Construir URL con parámetros
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const queryString = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    );
    url += `?${queryString.toString()}`;
  }

  // Configuración por defecto
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
    ...fetchOptions,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ─── Categories API ──────────────────────────

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  productCount: number;
}

export const categoriesApi = {
  getAll: async (): Promise<{ success: boolean; data: ApiCategory[] }> => {
    return apiCall("/api/categories");
  },

  getBySlug: async (
    slug: string
  ): Promise<{ success: boolean; data: ApiCategory & { products: any[] } }> => {
    return apiCall(`/api/categories/${slug}`);
  },
};

// ─── Products API ───────────────────────────

export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: { id: string; name: string; slug: string };
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  unit: string;
  tags: string[];
}

export const productsApi = {
  getAll: async (options?: {
    category?: string;
    search?: string;
    sort?: "popular" | "precio-asc" | "precio-desc" | "rating";
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    data: ApiProduct[];
    total: number;
    page: number;
    limit: number;
  }> => {
    return apiCall("/api/products", {
      params: {
        category: options?.category || "todos",
        search: options?.search || "",
        sort: options?.sort || "popular",
        page: options?.page || 1,
        limit: options?.limit || 20,
      },
    });
  },

  getById: async (
    id: string
  ): Promise<{ success: boolean; data: ApiProduct }> => {
    return apiCall(`/api/products/${id}`);
  },
};

// ─── Projects API ───────────────────────────

export interface ApiProject {
  id: string;
  name: string;
  type: "piso" | "pared" | "techo" | "integral";
  status: "en_progreso" | "completado" | "pausado";
  area: number;
  createdAt: string;
  materialCount: number;
  estimatedCost: number;
  thumbnail: string;
}

export const projectsApi = {
  getAll: async (): Promise<{
    success: boolean;
    data: ApiProject[];
  }> => {
    return apiCall("/api/projects");
  },

  getById: async (
    id: string
  ): Promise<{ success: boolean; data: ApiProject }> => {
    return apiCall(`/api/projects/${id}`);
  },

  create: async (data: Partial<ApiProject>): Promise<{
    success: boolean;
    data: ApiProject;
  }> => {
    return apiCall("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: string,
    data: Partial<ApiProject>
  ): Promise<{ success: boolean; data: ApiProject }> => {
    return apiCall(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    return apiCall(`/api/projects/${id}`, { method: "DELETE" });
  },
};

// ─── Cart API ───────────────────────────────

export interface ApiCartItem {
  productId: string;
  quantity: number;
  product?: ApiProduct;
}

export const cartApi = {
  getCart: async (): Promise<{
    success: boolean;
    data: { items: ApiCartItem[]; total: number };
  }> => {
    return apiCall("/api/cart");
  },

  addItem: async (
    productId: string,
    quantity: number
  ): Promise<{ success: boolean; data: ApiCartItem }> => {
    return apiCall("/api/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
  },

  updateItem: async (
    productId: string,
    quantity: number
  ): Promise<{ success: boolean; data: ApiCartItem }> => {
    return apiCall(`/api/cart/${productId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
  },

  removeItem: async (productId: string): Promise<{ success: boolean }> => {
    return apiCall(`/api/cart/${productId}`, { method: "DELETE" });
  },

  clearCart: async (): Promise<{ success: boolean }> => {
    return apiCall("/api/cart", { method: "DELETE" });
  },
};

// ─── Orders API ──────────────────────────────

export interface ApiOrder {
  id: string;
  orderNumber: string;
  status: "pendiente" | "confirmado" | "enviado" | "entregado" | "cancelado";
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  items: any[];
}

export const ordersApi = {
  getAll: async (): Promise<{
    success: boolean;
    data: ApiOrder[];
  }> => {
    return apiCall("/api/orders");
  },

  getById: async (
    id: string
  ): Promise<{ success: boolean; data: ApiOrder }> => {
    return apiCall(`/api/orders/${id}`);
  },

  create: async (data: any): Promise<{
    success: boolean;
    data: ApiOrder;
  }> => {
    return apiCall("/api/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// ─── Users API ───────────────────────────────

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export const usersApi = {
  getProfile: async (): Promise<{
    success: boolean;
    data: ApiUser;
  }> => {
    return apiCall("/api/users/profile");
  },

  updateProfile: async (data: Partial<ApiUser>): Promise<{
    success: boolean;
    data: ApiUser;
  }> => {
    return apiCall("/api/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

// ─── Admin API ───────────────────────────────

export const adminApi = {
  getMetrics: async (): Promise<{
    success: boolean;
    data: {
      totalSales: number;
      totalOrders: number;
      totalProducts: number;
      totalUsers: number;
      thisMonthSales: number;
      thisMonthOrders: number;
      thisMonthProducts: number;
    };
  }> => {
    return apiCall("/api/admin/metrics");
  },

  getOrders: async (): Promise<{
    success: boolean;
    data: ApiOrder[];
  }> => {
    return apiCall("/api/admin/orders");
  },

  getProducts: async (): Promise<{
    success: boolean;
    data: ApiProduct[];
  }> => {
    return apiCall("/api/admin/products");
  },
};

// ─── Health Check ───────────────────────────

export const healthApi = {
  check: async (): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return response.ok;
    } catch {
      return false;
    }
  },
};
