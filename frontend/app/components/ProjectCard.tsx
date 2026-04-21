import Link from "next/link";
import Badge from "@/app/components/ui/Badge";
import {
  type Project,
  formatPrice,
  getStatusLabel,
  getStatusColor,
} from "@/app/lib/utils";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const statusVariant =
    project.status === "completado"
      ? "success"
      : project.status === "en_progreso"
      ? "warning"
      : "default";

  return (
    <Link href={`/proyectos/${project.id}`} className="group block">
      <div className="bg-bg-surface rounded-xl border border-border p-6 card-hover">
        <div className="flex items-start justify-between mb-4">
          <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
            {project.thumbnail}
          </span>
          <Badge variant={statusVariant} size="sm">
            {getStatusLabel(project.status)}
          </Badge>
        </div>

        <h3 className="text-base font-semibold text-text-primary group-hover:text-primary transition-colors duration-200">
          {project.name}
        </h3>

        <div className="mt-3 flex items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            📐 {project.area} m²
          </span>
          <span className="flex items-center gap-1">
            📦 {project.materialCount} materiales
          </span>
        </div>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div>
            <p className="text-xs text-text-muted">Costo estimado</p>
            <p className="text-sm font-bold text-text-primary">
              {formatPrice(project.estimatedCost)}
            </p>
          </div>
          <span className="text-xs text-text-muted">
            {new Date(project.createdAt).toLocaleDateString("es-CO", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}
