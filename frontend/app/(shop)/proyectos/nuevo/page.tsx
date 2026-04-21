"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import Card from "@/app/components/ui/Card";

export default function NuevoProyectoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState("piso");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [materialType, setMaterialType] = useState("ceramica");
  const [tileFormat, setTileFormat] = useState("60x60");

  const areaCalculation = useMemo(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    if (type === "piso" || type === "techo") return l * w;
    if (type === "pared") return (l + w) * 2 * h; // simplified perimeter calc
    if (type === "integral") return (l * w) + ((l + w) * 2 * h);
    return l * w;
  }, [type, length, width, height]);

  const handleSaveProject = async () => {
    if (!name || !length || !width || (type === "pared" && !height) || (type === "integral" && !height)) {
      alert("Por favor, llena todos los campos obligatorios.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          length: parseFloat(length),
          width: parseFloat(width),
          height: parseFloat(height) || 0,
          area: areaCalculation,
          materialType,
          tileFormat,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/proyectos/${data.data.id}`);
      } else {
        alert("Error al guardar el proyecto");
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                  ].map((t) => (
                    <label
                      key={t.value}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all duration-200 text-center ${
                        type === t.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="project-type"
                        value={t.value}
                        checked={type === t.value}
                        onChange={(e) => setType(e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-2xl">{t.icon}</span>
                      <span className="text-sm text-text-primary font-medium">
                        {t.label}
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
                value={length}
                onChange={(e) => setLength(e.target.value)}
                required
              />
              <Input
                label="Ancho (metros)"
                type="number"
                placeholder="7.0"
                id="width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                required
              />
              <Input
                label="Alto (metros) (opcional si es solo piso/techo)"
                type="number"
                placeholder="2.5"
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className="mt-4 p-4 bg-bg-surface-light rounded-lg">
              <p className="text-sm text-text-secondary">
                Área calculada:{" "}
                <span className="text-text-primary font-bold">{areaCalculation.toFixed(2)} m²</span>
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
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                >
                  <option value="ceramica">Cerámica</option>
                  <option value="porcelanato">Porcelanato</option>
                  <option value="madera border">Madera laminada</option>
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
                  value={tileFormat}
                  onChange={(e) => setTileFormat(e.target.value)}
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

        {/* Preview / Calculate Action */}
        <div className="lg:col-span-2">
          <div className="bg-bg-surface rounded-xl border border-border p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-text-primary mb-6">
              Crear Proyecto
            </h2>

            <p className="text-sm text-text-secondary mb-6">
              Se calcularán automáticamente los materiales necesarios según las dimensiones y preferencias indicadas. Podrás ver y modificar los detalles desde tu panel.
            </p>

            <div className="mt-6 space-y-3">
              <Button onClick={handleSaveProject} disabled={loading} size="lg" fullWidth>
                {loading ? "Calculando..." : "Guardar Proyecto y Calcular"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

