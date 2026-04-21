import ProjectCard from "@/app/components/ProjectCard";
import Button from "@/app/components/ui/Button";

export default async function ProyectosPage() {
  const res = await fetch("http://localhost:5000/api/projects", { cache: "no-store" });
  const json = await res.ok ? await res.json() : { data: [] };
  const projects = json.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Mis Proyectos
          </h1>
          <p className="mt-2 text-text-secondary">
            Gestiona tus proyectos de remodelación y construcción
          </p>
        </div>
        <Button href="/proyectos/nuevo" size="md">
          + Nuevo Proyecto
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          {
            label: "Total",
            value: projects.length,
            icon: "📁",
          },
          {
            label: "En progreso",
            value: projects.filter((p: any) => p.status === "en_progreso").length,
            icon: "🔄",
          },
          {
            label: "Completados",
            value: projects.filter((p: any) => p.status === "completado").length,
            icon: "✅",
          },
          {
            label: "Pausados",
            value: projects.filter((p: any) => p.status === "pausado").length,
            icon: "⏸️",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-bg-surface rounded-xl border border-border p-4 text-center"
          >
            <span className="text-xl block mb-1">{stat.icon}</span>
            <p className="text-2xl font-bold text-text-primary">
              {stat.value}
            </p>
            <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: any) => (
          <ProjectCard key={project.id} project={project} />
        ))}

        {/* New project placeholder */}
        <a
          href="/proyectos/nuevo"
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border hover:border-primary/50 p-8 text-center transition-all duration-200 group min-h-[220px]"
        >
          <div className="w-12 h-12 rounded-full bg-bg-surface-light group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-text-muted group-hover:text-primary transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-text-muted group-hover:text-text-primary transition-colors">
            Crear nuevo proyecto
          </p>
        </a>
      </div>
    </div>
  );
}
