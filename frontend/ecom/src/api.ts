const API_URL = "/api";

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

const fetchApi = async (endpoint: string, options?: RequestInit) => {
  const authHeaders = getAuthHeaders();
  const headers: Record<string, string> = { 
    "Content-Type": "application/json",
    ...authHeaders,
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { ...headers, ...options?.headers },
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }
  return response.json();
};

export const api = {
  signup: (data: { name: string; email: string; password: string }) => 
    fetchApi("/auth/signup", { method: "POST", body: JSON.stringify(data) }),
  
  signin: (data: { email: string; password: string }) => 
    fetchApi("/auth/signin", { method: "POST", body: JSON.stringify(data) }),
  
  getProfile: () => fetchApi("/auth/profile"),

  getProducts: (params?: { category?: string; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.set("category", params.category);
    if (params?.search) queryParams.set("search", params.search);
    const query = queryParams.toString();
    return fetchApi(`/products${query ? `?${query}` : ""}`);
  },
  getProduct: (id: number) => fetchApi(`/products/${id}`),
  createProduct: (product: any) => fetchApi("/products", { method: "POST", body: JSON.stringify(product) }),
  updateProduct: (id: number, product: any) => fetchApi(`/products/${id}`, { method: "PUT", body: JSON.stringify(product) }),
  deleteProduct: (id: number) => fetchApi(`/products/${id}`, { method: "DELETE" }),
  getCategories: () => fetchApi("/products/categories"),
  createOrder: (order: any) => fetchApi("/orders", { method: "POST", body: JSON.stringify(order) }),
  getOrders: () => fetchApi("/orders"),
  getAllOrders: () => fetchApi("/orders/all"),
  getOrder: (id: number) => fetchApi(`/orders/${id}`),
  updateOrderStatus: (id: number, status: string) => fetchApi(`/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
  deleteOrder: (id: number) => fetchApi(`/orders/${id}`, { method: "DELETE" }),
  getStats: () => fetchApi("/orders/stats"),
};

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address?: string;
  created_at: string;
  updated_at?: string;
  user_name?: string;
  user_email?: string;
  item_count?: number;
  items_summary?: string;
  items?: OrderItem[];
}
