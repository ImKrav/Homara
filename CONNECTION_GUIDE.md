# Guía de Conexión Frontend-Backend

## Estado Actual: ✅ CONFIGURADO

Se ha establecido una comunicación completa entre el frontend (Next.js) y el backend (Express).

---

## 📁 Archivos Creados/Modificados

### Nuevos Archivos:
1. **`frontend/app/lib/api.ts`** - Cliente HTTP centralizado
   - Define tipos de datos (`ApiProduct`, `ApiCategory`, etc.)
   - Expone servicios: `categoriesApi`, `productsApi`, `projectsApi`, `cartApi`, `ordersApi`, `usersApi`, `adminApi`
   - Maneja CORS y errores automáticamente

2. **`frontend/.env.local`** - Configuración de variables de entorno
   - `NEXT_PUBLIC_API_URL=http://localhost:5000`

3. **`frontend/app/lib/test-connection.ts`** - Funciones de prueba
   - `testConnection()` - Verifica conectividad

4. **`frontend/app/test-connection/page.tsx`** - Página de prueba interactiva
   - Acceso: `http://localhost:3000/test-connection`
   - Prueba 3 endpoints: health check, categorías, productos

### Archivos Modificados:
1. **`frontend/app/page.tsx`**
   - Cambio a Server Component
   - Carga datos reales del backend
   - Manejo de errores

2. **`frontend/app/(shop)/catalogo/page.tsx`**
   - Usa `productsApi` y `categoriesApi`
   - Estados de carga, error y datos vacíos
   - Sincronización con filtros y ordenamiento

3. **`frontend/app/components/ProductCard.tsx`**
   - Compatibilidad con `Product` (mock) y `ApiProduct` (real)
   - Detección automática de campos

---

## 🚀 Cómo Usar

### 1. Iniciar Backend Localmente (para desarrollo)
```bash
cd backend
npm install
npm run dev
# Backend corriendo en http://localhost:5000
```

### 2. Iniciar Frontend Localmente
```bash
cd frontend
npm install
npm run dev
# Frontend corriendo en http://localhost:3000
```

### 3. Verificar Conexión
Abre cualquiera de estas URLs:
- **Página de Prueba**: `http://localhost:3000/test-connection`
- **Catálogo**: `http://localhost:3000/catalogo`
- **Home**: `http://localhost:3000`

---

## 🐳 Con Docker

### Iniciar los servicios
```bash
docker-compose up -d
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Base de datos: postgresql://postgres:postgres@localhost:51214
```

**Nota:** Dentro de Docker, el frontend accede al backend en `http://backend:5000` (automáticamente detectado)

---

## 🔌 API Disponibles

### Categories
```typescript
categoriesApi.getAll() // GET /api/categories
categoriesApi.getBySlug(slug) // GET /api/categories/:slug
```

### Products
```typescript
productsApi.getAll(options) // GET /api/products?category=...&sort=...
productsApi.getById(id) // GET /api/products/:id
```

### Projects
```typescript
projectsApi.getAll() // GET /api/projects
projectsApi.getById(id) // GET /api/projects/:id
projectsApi.create(data) // POST /api/projects
projectsApi.update(id, data) // PUT /api/projects/:id
projectsApi.delete(id) // DELETE /api/projects/:id
```

### Cart
```typescript
cartApi.getCart() // GET /api/cart
cartApi.addItem(productId, quantity) // POST /api/cart
cartApi.updateItem(productId, quantity) // PUT /api/cart/:productId
cartApi.removeItem(productId) // DELETE /api/cart/:productId
cartApi.clearCart() // DELETE /api/cart
```

### Orders
```typescript
ordersApi.getAll() // GET /api/orders
ordersApi.getById(id) // GET /api/orders/:id
ordersApi.create(data) // POST /api/orders
```

### Users
```typescript
usersApi.getProfile() // GET /api/users/profile
usersApi.updateProfile(data) // PUT /api/users/profile
```

### Admin
```typescript
adminApi.getMetrics() // GET /api/admin/metrics
adminApi.getOrders() // GET /api/admin/orders
adminApi.getProducts() // GET /api/admin/products
```

---

## 🧪 Flujo de Prueba Completo

### Test 1: Cargar Catálogo
```bash
# 1. Abre http://localhost:3000/catalogo
# 2. Verifica que se carguen categorías y productos
# 3. Prueba filtros y ordenamiento
```

### Test 2: Ver Detalles de Producto
```bash
# 1. Haz clic en un producto
# 2. Verifica que se muestre la información
```

### Test 3: Página de Prueba
```bash
# 1. Abre http://localhost:3000/test-connection
# 2. Verifica que todos los tests pasen
# 3. Debe mostrar:
#    - ✅ Backend conectado
#    - ✅ N categorías cargadas
#    - ✅ N productos cargados
```

---

## ⚙️ Configuración de Ambiente

### Para Desarrollo Local
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Para Docker
Automático: `http://backend:5000`

### Para Producción
```env
NEXT_PUBLIC_API_URL=https://tu-api.com
```

---

## 🔧 Troubleshooting

### "Failed to fetch from backend"
- ✅ Verifica que el backend esté corriendo
- ✅ Verifica que esté en el puerto 5000
- ✅ Verifica que no haya firewall bloqueando

### "CORS Error"
- ✅ El backend ya tiene CORS configurado
- ✅ Si aún hay error, revisa `backend/src/index.js`

### "Products not loading"
- ✅ Verifica que la base de datos esté corriendo
- ✅ Verifica que haya datos seeded en la DB
- ✅ Revisa la consola del backend para errores

---

## 📊 Estructura de Respuestas API

### Success
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "...",
      ...
    }
  ]
}
```

### Error
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🔐 CORS Configuration

El backend permite requests de:
- `http://localhost:3000` (desarrollo)
- `http://localhost:3001` (desarrollo alternativo)
- `http://homara_frontend:3000` (Docker)
- Cualquier origen (wildcard `*`)

Métodos permitidos: GET, POST, PUT, DELETE, OPTIONS

---

## 📝 Próximos Pasos

1. **Implementar Autenticación**
   - JWT tokens
   - Login/Register endpoints

2. **Agregar más Páginas**
   - Detalle de producto
   - Carrito de compras
   - Checkout

3. **Implementar Cálculo de Materiales**
   - Proyecto → Cálculo → Carrito automático

4. **Testing**
   - Tests unitarios
   - Tests de integración
   - Tests E2E con Cypress/Playwright

---

## 📞 Soporte

Para preguntas o problemas:
1. Revisa los logs del backend: `docker logs homara_backend`
2. Revisa los logs del frontend: `npm run dev` en terminal
3. Abre el DevTools en el navegador (F12)
4. Verifica la consola de red (Network tab)
