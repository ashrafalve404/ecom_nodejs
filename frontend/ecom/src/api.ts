const API_URL = "/api";

const fetchApi = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }
  return response.json();
};

export const api = {
  getProducts: (params?: { category?: string; search?: string }) => {
<<<<<<< HEAD
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.set("category", params.category);
    if (params?.search) queryParams.set("search", params.search);
    const query = queryParams.toString();
=======
    const query = new URLSearchParams(params as any).toString();
>>>>>>> 8f9a892d8338df3b8805344876bf40967713147e
    return fetchApi(`/products${query ? `?${query}` : ""}`);
  },
  getProduct: (id: number) => fetchApi(`/products/${id}`),
  createProduct: (product: any) => fetchApi("/products", { method: "POST", body: JSON.stringify(product) }),
  updateProduct: (id: number, product: any) => fetchApi(`/products/${id}`, { method: "PUT", body: JSON.stringify(product) }),
  deleteProduct: (id: number) => fetchApi(`/products/${id}`, { method: "DELETE" }),
  getCategories: () => fetchApi("/products/categories"),
  createOrder: (order: any) => fetchApi("/orders", { method: "POST", body: JSON.stringify(order) }),
  getOrders: () => fetchApi("/orders"),
  getOrder: (id: number) => fetchApi(`/orders/${id}`),
  updateOrderStatus: (id: number, status: string) => fetchApi(`/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
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

export interface Order {
  id: number;
  total: number;
  status: string;
  customer_name?: string;
  customer_email?: string;
  shipping_address?: string;
  created_at: string;
  items_summary?: string;
  item_count?: number;
  items?: any[];
}
