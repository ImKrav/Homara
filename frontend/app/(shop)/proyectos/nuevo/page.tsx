import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import Card from "@/app/components/ui/Card";

export default function NuevoProyectoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Nuevo Proyecto</h1>
        <p className="mt-2 text-text-secondary">
          Define tu espacio y calcularemos automáticamente los materiales que
          necesitas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-text-primary mb-6">
              Información del Proyecto
            </h2>
            <div className="space-y-4">
              <Input
                label="Nombre del proyecto"
                placeholder="Ej: Remodelación Sala Principal"
                id="project-name"
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-secondary">
                  Tipo de proyecto <span className="text-error">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { value: "piso", label: "Piso", icon: "🏗️" },
                    { value: "pared", label: "Pared", icon: "🧱" },
                    { value: "techo", label: "Techo", icon: "🏠" },
                    { value: "integral", label: "Integral", icon: "🔨" },
                  ].map((type) => (
                    <label
                      key={type.value}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/50 cursor-pointer transition-all duration-200 text-center"
                    >
                      <input
                        type="radio"
                        name="project-type"
                        value={type.value}
                        className="sr-only"
                      />
                      <span className="text-2xl">{type.icon}</span>
                      <span className="text-sm text-text-primary font-medium">
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-text-primary mb-6">
              Dimensiones del Espacio
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Largo (metros)"
                type="number"
                placeholder="5.0"
                id="length"
                required
              />
              <Input
                label="Ancho (metros)"
                type="number"
                placeholder="7.0"
                id="width"
                required
              />
              <Input
                label="Alto (metros)"
                type="number"
                placeholder="2.5"
                id="height"
              />
            </div>
            <div className="mt-4 p-4 bg-bg-surface-light rounded-lg">
              <p className="text-sm text-text-secondary">
                Área calculada:{" "}
                <span className="text-text-primary font-bold">35.0 m²</span>
              </p>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-text-primary mb-6">
              Preferencias de Material
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-secondary">
                  Tipo de recubrimiento
                </label>
                <select
                  className="bg-bg-surface-light border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  id="material-type"
                >
                  <option value="ceramica">Cerámica</option>
                  <option value="porcelanato">Porcelanato</option>
                  <option value="madera">Madera laminada</option>
                  <option value="vinilo">Vinilo</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-secondary">
                  Formato de baldosa
                </label>
                <select
                  className="bg-bg-surface-light border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  id="tile-format"
                >
                  <option value="60x60">60 x 60 cm</option>
                  <option value="45x45">45 x 45 cm</option>
                  <option value="30x60">30 x 60 cm</option>
                  <option value="20x60">20 x 60 cm</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="bg-bg-surface rounded-xl border border-border p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-text-primary mb-6">
              Materiales Estimados
            </h2>

            <div className="space-y-4">
              {[
                {
                  name: "Porcelanato 60x60",
                  quantity: "39 m²",
                  note: "+10% de desperdicio",
                  icon: "🏗️",
                },
                {
                  name: "Pegante cerámico",
                  quantity: "8 bultos",
                  note: "25kg c/u",
                  icon: "🧱",
                },
                {
                  name: "Boquilla",
                  quantity: "4 kg",
                  note: "",
                  icon: "🪣",
                },
                {
                  name: "Crucetas 2mm",
                  quantity: "2 bolsas",
                  note: "100 unidades c/u",
                  icon: "➕",
                },
              ].map((material) => (
                <div
                  key={material.name}
                  className="flex items-center gap-3 p-3 bg-bg-surface-light rounded-lg"
                >
                  <span className="text-xl">{material.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">
                      {material.name}
                    </p>
                    {material.note && (
                      <p className="text-xs text-text-muted">{material.note}</p>
                    )}
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {material.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-text-secondary">
                  Costo estimado
                </span>
                <span className="text-lg font-bold gradient-text">
                  $2.450.000
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Precios aproximados sujetos a disponibilidad
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <Button size="lg" fullWidth>
                Agregar todo al Carrito
              </Button>
              <Button variant="outline" size="md" fullWidth>
                Guardar Proyecto
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
