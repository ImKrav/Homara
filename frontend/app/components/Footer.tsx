import Link from "next/link";

const footerLinks = {
  Productos: [
    { label: "Pisos y Cerámicas", href: "/catalogo?cat=pisos-ceramicas" },
    { label: "Herramientas", href: "/catalogo?cat=herramientas" },
    { label: "Pinturas", href: "/catalogo?cat=pinturas" },
    { label: "Muebles", href: "/catalogo?cat=muebles" },
    { label: "Iluminación", href: "/catalogo?cat=iluminacion" },
  ],
  Empresa: [
    { label: "Sobre Homara", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contacto", href: "#" },
    { label: "Trabaja con nosotros", href: "#" },
  ],
  Soporte: [
    { label: "Centro de ayuda", href: "#" },
    { label: "Envíos y devoluciones", href: "#" },
    { label: "Términos y condiciones", href: "#" },
    { label: "Política de privacidad", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold gradient-text">Homara</span>
            </Link>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              Tu aliado en proyectos de construcción y remodelación. Calcula,
              planifica y compra sin errores.
            </p>
            <div className="flex gap-3 mt-5">
              {["instagram", "facebook", "twitter"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-bg-surface-light text-text-secondary hover:bg-primary hover:text-bg-base transition-all duration-200"
                  aria-label={social}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-text-primary mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © 2026 Homara. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <span>🇨🇴 Colombia</span>
            <span>COP $</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
