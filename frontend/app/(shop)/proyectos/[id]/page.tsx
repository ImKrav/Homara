import { projects, products, formatPrice, getStatusLabel } from "@/app/lib/mock-data";
import Badge from "@/app/components/ui/Badge";
import Button from "@/app/components/ui/Button";
import ProductCard from "@/app/components/ProductCard";
import { notFound } from "next/navigation";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const statusVariant =
    project.status === "completado"
      ? "success"
      : project.status === "en_progreso"
      ? "warning"
      : "default";

  const suggestedProducts = products
    .filter((p) => p.categorySlug === "pisos-ceramicas" || p.categorySlug === "materiales-construccion")
    .slice(0, 4);

  const materials = [
    { name: "Porcelanato Mármol Carrara 60x60", quantity: `${project.area + 4} m²`, price: 45900 * (project.area + 4), icon: "🏗️" },
    { name: "Pegante cerámico flexible 25kg", quantity: `${Math.ceil(project.area / 4)} bultos`, price: 28500 * Math.ceil(project.area / 4), icon: "🧱" },
    { name: "Boquilla Beige 2kg", quantity: `${Math.ceil(project.area / 8)} kg`, price: 12000 * Math.ceil(project.area / 8), icon: "🪣" },
    { name: "Crucetas 2mm", quantity: `${Math.ceil(project.area / 15)} bolsas`, price: 8500 * Math.ceil(project.area / 15), icon: "➕" },
    { name: "Nivel de burbuja 60cm", quantity: "1 unidad", price: 35000, icon: "📏" },
  ];

  const totalMaterials = materials.reduce((sum, m) => sum + m.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
        <a href="/proyectos" className="hover:text-primary transition-colors">
          Proyectos
        </a>
        <span>/</span>
        <span className="text-text-secondary">{project.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{project.thumbnail}</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
              {project.name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant={statusVariant}>
                {getStatusLabel(project.status)}
              </Badge>
              <span className="text-sm text-text-muted">
                Creado el{" "}
                {new Date(project.createdAt).toLocaleDateString("es-CO", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            Editar
          </Button>
          <Button variant="danger" size="sm">
            Eliminar
          </Button>
        </div>
      </div>

      {/* Project Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Tipo", value: project.type.charAt(0).toUpperCase() + project.type.slice(1), icon: "📋" },
          { label: "Área", value: `${project.area} m²`, icon: "📐" },
          { label: "Materiales", value: `${project.materialCount}`, icon: "📦" },
          { label: "Costo estimado", value: formatPrice(project.estimatedCost), icon: "💰" },
        ].map((info) => (
          <div
            key={info.label}
            className="bg-bg-surface rounded-xl border border-border p-4"
          >
            <span className="text-xl block mb-2">{info.icon}</span>
            <p className="text-lg font-bold text-text-primary">{info.value}</p>
            <p className="text-xs text-text-muted">{info.label}</p>
          </div>
        ))}
      </div>

      {/* Materials List */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-text-primary mb-6">
          Materiales Calculados
        </h2>
        <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {materials.map((mat) => (
              <div
                key={mat.name}
                className="flex items-center gap-4 p-4 hover:bg-bg-surface-light transition-colors"
              >
                <span className="text-2xl">{mat.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">
                    {mat.name}
                  </p>
                </div>
                <span className="text-sm font-medium text-text-secondary">
                  {mat.quantity}
                </span>
                <span className="text-sm font-bold text-text-primary w-28 text-right">
                  {formatPrice(mat.price)}
                </span>
              </div>
            ))}
          </div>
          <div className="p-4 bg-bg-surface-light flex items-center justify-between">
            <span className="text-sm font-semibold text-text-primary">
              Total Estimado
            </span>
            <span className="text-xl font-bold gradient-text">
              {formatPrice(totalMaterials)}
            </span>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <Button size="md">
            Agregar todo al Carrito
          </Button>
          <Button variant="outline" size="md">
            Exportar lista
          </Button>
        </div>
      </div>

      {/* Suggested Products */}
      <section>
        <h2 className="text-xl font-bold text-text-primary mb-6">
          Productos Sugeridos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {suggestedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
