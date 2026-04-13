// ============================================
// Homara — Mock Data & TypeScript Types
// ============================================

// --- Types ---

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
  unit: string; // "unidad", "m²", "galón", "kg", etc.
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string; // emoji
  productCount: number;
}

export interface Project {
  id: string;
  name: string;
  type: "piso" | "pared" | "techo" | "integral";
  status: "en_progreso" | "completado" | "pausado";
  area: number; // m²
  createdAt: string;
  materialCount: number;
  estimatedCost: number;
  thumbnail: string; // emoji icon
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: "pendiente" | "procesando" | "enviado" | "entregado" | "cancelado";
  items: number;
  total: number;
  customer: string;
}

export interface AdminMetric {
  label: string;
  value: string;
  change: number; // percentage
  icon: string;
}

// --- Mock Data ---

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Pisos y Cerámicas",
    slug: "pisos-ceramicas",
    description: "Baldosas, porcelanatos y cerámicas para todo tipo de superficies",
    icon: "🏗️",
    productCount: 48,
  },
  {
    id: "cat-2",
    name: "Herramientas",
    slug: "herramientas",
    description: "Herramientas manuales y eléctricas para todo profesional",
    icon: "🔧",
    productCount: 124,
  },
  {
    id: "cat-3",
    name: "Pinturas",
    slug: "pinturas",
    description: "Pinturas de interior, exterior y acabados especiales",
    icon: "🎨",
    productCount: 67,
  },
  {
    id: "cat-4",
    name: "Muebles",
    slug: "muebles",
    description: "Muebles modernos y funcionales para amueblar cada espacio",
    icon: "🪑",
    productCount: 89,
  },
  {
    id: "cat-5",
    name: "Iluminación",
    slug: "iluminacion",
    description: "Lámparas, focos y sistemas de iluminación LED",
    icon: "💡",
    productCount: 56,
  },
  {
    id: "cat-6",
    name: "Materiales de Construcción",
    slug: "materiales-construccion",
    description: "Cemento, bloques, arena y todo material de obra",
    icon: "🧱",
    productCount: 93,
  },
];

export const products: Product[] = [
  {
    id: "prod-1",
    name: "Porcelanato Mármol Carrara 60x60",
    description:
      "Porcelanato de alta calidad con acabado mármol Carrara. Resistente al tráfico pesado, ideal para salas y cocinas. Superficie antideslizante con brillo natural.",
    price: 45900,
    originalPrice: 52000,
    image: "/products/porcelanato.jpg",
    category: "Pisos y Cerámicas",
    categorySlug: "pisos-ceramicas",
    rating: 4.8,
    reviews: 234,
    inStock: true,
    stockQuantity: 1250,
    unit: "m²",
    tags: ["oferta", "popular"],
  },
  {
    id: "prod-2",
    name: "Taladro Percutor Inalámbrico 20V",
    description:
      "Taladro percutor de alto rendimiento con batería de litio de 20V. Incluye 2 baterías, cargador rápido y maletín. Motor brushless de larga duración.",
    price: 289000,
    image: "/products/taladro.jpg",
    category: "Herramientas",
    categorySlug: "herramientas",
    rating: 4.9,
    reviews: 567,
    inStock: true,
    stockQuantity: 89,
    unit: "unidad",
    tags: ["popular", "nuevo"],
  },
  {
    id: "prod-3",
    name: "Pintura Interior Premium Blanco 5L",
    description:
      "Pintura acrílica de máxima cubrimiento con acabado mate aterciopelado. Lavable, bajo olor y secado rápido. Rendimiento: 12m² por litro.",
    price: 125000,
    originalPrice: 148000,
    image: "/products/pintura.jpg",
    category: "Pinturas",
    categorySlug: "pinturas",
    rating: 4.6,
    reviews: 189,
    inStock: true,
    stockQuantity: 340,
    unit: "galón",
    tags: ["oferta"],
  },
  {
    id: "prod-4",
    name: "Escritorio Nórdico Madera Natural 120cm",
    description:
      "Escritorio minimalista de estilo nórdico fabricado en madera de pino con acabado natural. Patas metálicas negras. Incluye pasacables y organizador.",
    price: 459000,
    image: "/products/escritorio.jpg",
    category: "Muebles",
    categorySlug: "muebles",
    rating: 4.7,
    reviews: 98,
    inStock: true,
    stockQuantity: 24,
    unit: "unidad",
    tags: ["nuevo"],
  },
  {
    id: "prod-5",
    name: "Panel LED Slim 60x60 40W Luz Día",
    description:
      "Panel LED ultradelgado para instalación empotrada o superficial. Luz día 6500K con alto índice de reproducción cromática. Ideal para oficinas y comercios.",
    price: 89000,
    image: "/products/panel-led.jpg",
    category: "Iluminación",
    categorySlug: "iluminacion",
    rating: 4.5,
    reviews: 145,
    inStock: true,
    stockQuantity: 567,
    unit: "unidad",
    tags: [],
  },
  {
    id: "prod-6",
    name: "Cemento Gris Uso General 50kg",
    description:
      "Cemento portland tipo I para uso general en construcción. Alta resistencia y fraguado uniforme. Ideal para cimentaciones, columnas y losas.",
    price: 32000,
    image: "/products/cemento.jpg",
    category: "Materiales de Construcción",
    categorySlug: "materiales-construccion",
    rating: 4.4,
    reviews: 890,
    inStock: true,
    stockQuantity: 2340,
    unit: "bulto",
    tags: ["popular"],
  },
  {
    id: "prod-7",
    name: "Pegante Cerámico Flexible 25kg",
    description:
      "Pegante cementicio flexible de alta adherencia para instalación de cerámica y porcelanato en pisos y paredes. Resistente a la humedad.",
    price: 28500,
    image: "/products/pegante.jpg",
    category: "Materiales de Construcción",
    categorySlug: "materiales-construccion",
    rating: 4.3,
    reviews: 412,
    inStock: true,
    stockQuantity: 1890,
    unit: "bulto",
    tags: [],
  },
  {
    id: "prod-8",
    name: "Lámpara Colgante Industrial Negro",
    description:
      "Lámpara colgante de estilo industrial con acabado negro mate. Cable ajustable hasta 1.5m. Compatible con bombillo E27. Perfecta para comedores y barras.",
    price: 145000,
    originalPrice: 175000,
    image: "/products/lampara.jpg",
    category: "Iluminación",
    categorySlug: "iluminacion",
    rating: 4.6,
    reviews: 67,
    inStock: true,
    stockQuantity: 45,
    unit: "unidad",
    tags: ["oferta"],
  },
  {
    id: "prod-9",
    name: "Sierra Circular 7-1/4\" 1800W",
    description:
      "Sierra circular profesional de alto rendimiento con disco de 7-1/4 pulgadas. Motor de 1800W, guía láser y ajuste de profundidad. Incluye adaptador de extracción de polvo.",
    price: 375000,
    image: "/products/sierra.jpg",
    category: "Herramientas",
    categorySlug: "herramientas",
    rating: 4.8,
    reviews: 203,
    inStock: true,
    stockQuantity: 34,
    unit: "unidad",
    tags: ["popular"],
  },
  {
    id: "prod-10",
    name: "Baldosa Cerámica Madera Roble 20x60",
    description:
      "Baldosa cerámica con efecto madera de roble natural. Resistente al desgaste y fácil mantenimiento. Ideal para habitaciones y salas.",
    price: 38900,
    image: "/products/baldosa-madera.jpg",
    category: "Pisos y Cerámicas",
    categorySlug: "pisos-ceramicas",
    rating: 4.7,
    reviews: 178,
    inStock: true,
    stockQuantity: 980,
    unit: "m²",
    tags: ["nuevo"],
  },
  {
    id: "prod-11",
    name: "Estantería Metálica Industrial 5 Niveles",
    description:
      "Estantería metálica de 5 niveles con acabado negro. Estructura reforzada con capacidad de 175kg por nivel. Fácil ensamble sin herramientas.",
    price: 219000,
    image: "/products/estanteria.jpg",
    category: "Muebles",
    categorySlug: "muebles",
    rating: 4.5,
    reviews: 134,
    inStock: false,
    stockQuantity: 0,
    unit: "unidad",
    tags: [],
  },
  {
    id: "prod-12",
    name: "Rodillo de Pintura Antigoteo 23cm",
    description:
      "Rodillo profesional con sistema antigoteo y mango ergonómico extensible. Felpa de microfibra para acabado perfecto. Incluye bandeja.",
    price: 34500,
    image: "/products/rodillo.jpg",
    category: "Pinturas",
    categorySlug: "pinturas",
    rating: 4.2,
    reviews: 256,
    inStock: true,
    stockQuantity: 678,
    unit: "unidad",
    tags: [],
  },
];

export const projects: Project[] = [
  {
    id: "proj-1",
    name: "Remodelación Sala Principal",
    type: "piso",
    status: "en_progreso",
    area: 35,
    createdAt: "2026-03-15",
    materialCount: 8,
    estimatedCost: 2450000,
    thumbnail: "🏠",
  },
  {
    id: "proj-2",
    name: "Baño Master - Enchape completo",
    type: "pared",
    status: "completado",
    area: 18,
    createdAt: "2026-02-20",
    materialCount: 12,
    estimatedCost: 1890000,
    thumbnail: "🚿",
  },
  {
    id: "proj-3",
    name: "Cocina Integral - Piso nuevo",
    type: "piso",
    status: "en_progreso",
    area: 22,
    createdAt: "2026-04-01",
    materialCount: 6,
    estimatedCost: 1650000,
    thumbnail: "🍳",
  },
  {
    id: "proj-4",
    name: "Terraza - Recubrimiento exterior",
    type: "piso",
    status: "pausado",
    area: 40,
    createdAt: "2026-01-10",
    materialCount: 10,
    estimatedCost: 3200000,
    thumbnail: "🌿",
  },
];

export const orders: Order[] = [
  {
    id: "ORD-2026-001",
    date: "2026-04-12",
    status: "enviado",
    items: 5,
    total: 892000,
    customer: "Carlos Martínez",
  },
  {
    id: "ORD-2026-002",
    date: "2026-04-11",
    status: "procesando",
    items: 3,
    total: 456000,
    customer: "María López",
  },
  {
    id: "ORD-2026-003",
    date: "2026-04-10",
    status: "entregado",
    items: 8,
    total: 1234000,
    customer: "Juan Rodríguez",
  },
  {
    id: "ORD-2026-004",
    date: "2026-04-09",
    status: "pendiente",
    items: 2,
    total: 178000,
    customer: "Ana García",
  },
  {
    id: "ORD-2026-005",
    date: "2026-04-08",
    status: "entregado",
    items: 6,
    total: 2100000,
    customer: "Pedro Sánchez",
  },
  {
    id: "ORD-2026-006",
    date: "2026-04-07",
    status: "cancelado",
    items: 1,
    total: 89000,
    customer: "Lucía Hernández",
  },
];

export const adminMetrics: AdminMetric[] = [
  {
    label: "Ventas del Mes",
    value: "$12.450.000",
    change: 12.5,
    icon: "💰",
  },
  {
    label: "Pedidos Activos",
    value: "47",
    change: 8.3,
    icon: "📦",
  },
  {
    label: "Productos",
    value: "384",
    change: 3.1,
    icon: "🏷️",
  },
  {
    label: "Clientes Nuevos",
    value: "126",
    change: -2.4,
    icon: "👥",
  },
];

// --- Utility Functions ---

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getStatusLabel(
  status: Project["status"] | Order["status"]
): string {
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

export function getStatusColor(
  status: Project["status"] | Order["status"]
): string {
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
