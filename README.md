# Homara

## Concepto

- Se trata de un E-Commerce de productos para el hogar y ferretería (como herramientas, artículos de construcción, muebles, materiales, entre otros). El proyecto nace de la necesidad de mitigar los errores de cálculo en la compra de materiales de construcción y remodelación, un problema frecuente que genera sobrecostos o retrasos. Homara no solo vende productos, sino que asiste al cliente mediante la creación de "Proyectos", calculando automáticamente las cantidades necesarias (ej. baldosas por metro cuadrado, cantidad de pegante) y sugiriendo artículos complementarios, unificando la planificación y la compra en una sola plataforma.

## Objetivo

- Se persigue reducir en un 30% los errores de compra por cálculos de material incorrectos, aumentar el ticket promedio de venta mediante el sistema de sugerencias cruzadas ("Cross-selling" basado en proyectos) y consolidar una arquitectura de software altamente disponible que soporte picos de tráfico sin comprometer la integridad transaccional del inventario. El alcance esperado se limitará a la implementación del catálogo, el carrito de compras, el motor de cálculo para proyectos de recubrimiento (pisos/paredes) y la pasarela de pago simulada.

## Funcionalidades

- Módulo de Proyectos y Cálculo de Materiales
- Módulo de Catálogo y Búsqueda
- Módulo de Carrito y Transacciones
- Módulo de Inventario y Administración

## Tecnologías

### Frontend

- **Framework:** [Next.js](https://nextjs.org/) (v16.2.3)
- **Interfaz:** [React](https://react.dev/) (v19.2.4)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) (v5.x)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) (v4.2.2)

### Backend

- **Entorno:** [Node.js](https://nodejs.org/es/) (v20)
- **Framework:** [Express](https://expressjs.com/es/) (v5)
- **Base de Datos:** [PostgreSQL](https://postgresql.org/) (v15)
- **ORM:** [Prisma](https://www.prisma.io/) (v7.7.0)

## 🚀 Instalación y Ejecución

Gestión de contenedores mediante **Docker Compose**.

### Requisitos

- [Docker](https://www.docker.com/) o **Docker Desktop**.
- [Node.js](https://nodejs.org/) v20+.

### Pasos

1. **Variables de Entorno:**

   ```bash
   cd backend && cp .env.example .env && cd ..
   ```

2. **Iniciar Contenedores:**

   ```bash
   docker compose up --build -d
   ```

3. **Migraciones y Seed (Primera vez):**
   ```bash
   cd backend
   npx prisma db push
   npm run seed
   ```

### Accesos

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend:** [http://localhost:5000](http://localhost:5000)
- **Swagger:** [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---

### Comandos Útiles

**Detener servicios conservando volúmenes:**

```bash
docker compose down
```
