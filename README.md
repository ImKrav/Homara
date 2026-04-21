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

## Instalación y Ejecución

Puedes ejecutar el proyecto utilizando **Docker Compose** para un entorno completamente contenedorizado, o de forma **Local** si prefieres tener control directo sobre los procesos.

### Requisitos Previos

- [Docker](https://www.docker.com/) o **Docker Desktop** (para contenedor).
- [Node.js](https://nodejs.org/es/) (v20) y una instancia de **PostgreSQL** (para ejecución local).

---

### Opción 1: Iniciar con Docker (Recomendado)

Inicia los servicios (Frontend, Backend y Base de datos) con un solo comando:

```bash
docker compose up --build -d
```

---

### Opción 2: Iniciar en Local (Sin Docker)

Si prefieres ejecutar los servicios en tu máquina, sigue estos pasos:

#### Configuración del Backend

1. Ingresa a la carpeta del backend:

   ```bash
   cd backend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la carpeta `backend` basado en el `.env.example` (configura tu `DATABASE_URL` apuntando a tu PostgreSQL local).
4. Sincroniza el esquema de la base de datos, ejecuta las semillas (seeds) y levanta el servidor de desarrollo:

   ```bash
   npx prisma db push
   npm run seed
   npm run dev
   ```

   *(Nota: Puedes ejecutar `npm start` para sincronizar, poblar la bd e iniciar en producción).*

#### Configuración del Frontend

1. En una nueva terminal, ingresa a la carpeta del frontend:

   ```bash
   cd frontend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```


---

### Accesos Universales

Una vez en ejecución (ya sea por Docker o Local), los servicios estarán disponibles en:

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **Documentación API (Swagger):** [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---
