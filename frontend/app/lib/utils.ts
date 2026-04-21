// ============================================
// Homara — TypeScript Types & Utilities
// ============================================

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  categorySlug: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  stockQuantity: number;
  unit: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  productCount: number;
}

export interface Project {
  id: string;
  name: string;
  type: string;
  status: string;
  area: number;
  createdAt: string;
  materialCount: number;
  estimatedCost: number;
  thumbnail: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: string;
  items: number;
  total: number;
  customer: string;
}

export interface AdminMetric {
  label: string;
  value: string;
  change: number;
  icon: string;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    en_progreso: "En progreso",
    completado: "Completado",
    pausado: "Pausado",
    pendiente: "Pendiente",
    procesando: "Procesando",
    enviado: "Enviado",
    entregado: "Entregado",
    cancelado: "Cancelado",
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    en_progreso: "bg-amber-500/20 text-amber-400",
    completado: "bg-emerald-500/20 text-emerald-400",
    pausado: "bg-slate-500/20 text-slate-400",
    pendiente: "bg-amber-500/20 text-amber-400",
    procesando: "bg-blue-500/20 text-blue-400",
    enviado: "bg-purple-500/20 text-purple-400",
    entregado: "bg-emerald-500/20 text-emerald-400",
    cancelado: "bg-red-500/20 text-red-400",
  };
  return colors[status] || "bg-slate-500/20 text-slate-400";
}
