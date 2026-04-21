import { formatPrice, getStatusLabel } from "@/app/lib/utils";
import Badge from "@/app/components/ui/Badge";
import Button from "@/app/components/ui/Button";
import ProductCard from "@/app/components/ProductCard";
import { notFound } from "next/navigation";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  
  const res = await fetch(`http://localhost:5000/api/projects/${id}`, { cache: "no-store" });
  if (!res.ok) notFound();
  
  const json = await res.json();
  if (!json.success || !json.data) notFound();
  
  const project = json.data;
  const materials = project.materials || [];
  
  const totalMaterials = project.estimatedCost;

  const statusVariant =
    project.status === "completado"
      ? "success"
      : project.status === "en_progreso"
      ? "warning"
      : "default";

  const suggestedRes = await fetch("http://localhost:5000/api/products?category=pisos-ceramicas&limit=4", { cache: "no-store" });
  const suggestedJson = await suggestedRes.ok ? await suggestedRes.json() : { data: [] };
  const suggestedProducts = suggestedJson.data || [];

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
            {materials.map((mat: any) => (
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
          {suggestedProducts.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
