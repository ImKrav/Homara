# 📋 Flujo de Prueba Completo Frontend-Backend

## Estado: ✅ CONEXIÓN LISTA PARA PROBAR

Aquí está el plan detallado para verificar que todo funciona correctamente.

---

## 🔴 PREREQUISITOS

Antes de empezar, asegúrate de tener:
- ✅ Node.js 18+ instalado
- ✅ Docker y Docker Compose instalados (opcional para desarrollo local)
- ✅ Backend en puerto 5000
- ✅ Frontend en puerto 3000

---

## OPCIÓN 1: DESARROLLO LOCAL (Sin Docker)

### Paso 1️⃣: Iniciar Base de Datos (PostgreSQL)

Si tienes PostgreSQL local:
```bash
# Windows (si tienes PostgreSQL en servicios)
# Verifica que esté corriendo en puerto 5432
```

O usa Docker solo para la BD:
```bash
docker run -d \
  --name homara_postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=homara \
  -p 5432:5432 \
  postgres:15
```

### Paso 2️⃣: Iniciar Backend

```bash
# Terminal 1
cd backend
npm install
npm run dev

# Esperado:
# ✅ [tsx] Running src/index.js
# ✅ 🏠 Homara API — Backend activo
# Accesible en http://localhost:5000
```

Verifica que funciona:
```bash
curl http://localhost:5000/

# Respuesta esperada:
# {"message":"🏠 Homara API — Backend activo","version":"1.0.0",...}
```

### Paso 3️⃣: Iniciar Frontend

```bash
# Terminal 2
cd frontend
npm install
npm run dev

# Esperado:
# ▲ Next.js 16.2.3
# ✅ Ready in Xs
# Accesible en http://localhost:3000
```

---

## OPCIÓN 2: CON DOCKER (Recomendado para Producción)

```bash
# Desde la raíz del proyecto
docker-compose up -d

# Verifica que los servicios estén corriendo
docker-compose ps

# Esperado:
# CONTAINER ID  | IMAGE          | STATUS
# ...backend    | homara_backend | Up
# ...frontend   | homara_frontend| Up
# ...postgres   | postgres:15    | Up
```

---

## 🧪 PRUEBAS

### TEST 1: Verificar Salud del Backend

```bash
curl http://localhost:5000/

# Respuesta esperada (status 200):
{
  "message": "🏠 Homara API — Backend activo",
  "version": "1.0.0",
  "endpoints": {
    "categories": "/api/categories",
    "products": "/api/products",
    ...
  }
}
```

✅ **RESULTADO ESPERADO**: Status 200 + JSON con endpoints

---

### TEST 2: Verificar Categorías API

```bash
curl http://localhost:5000/api/categories

# Respuesta esperada (status 200):
{
  "success": true,
  "data": [
    {
      "id": "cat-1",
      "name": "Pisos y Cerámicas",
      "slug": "pisos-ceramicas",
      "description": "...",
      "icon": "🏗️",
      "productCount": 5
    },
    ...
  ]
}
```

✅ **RESULTADO ESPERADO**: Al menos 1 categoría en la respuesta

---

### TEST 3: Verificar Productos API

```bash
curl http://localhost:5000/api/products

# Respuesta esperada (status 200):
{
  "success": true,
  "data": [
    {
      "id": "prod-1",
      "name": "Baldosa Roja 30x30cm",
      "price": 12500,
      "category": { "id": "...", "name": "...", "slug": "..." },
      "inStock": true,
      ...
    },
    ...
  ],
  "total": N,
  "page": 1,
  "limit": 20
}
```

✅ **RESULTADO ESPERADO**: Al menos 1 producto en la respuesta

---

### TEST 4: Página de Prueba Interactiva

1. Abre en tu navegador: **http://localhost:3000/test-connection**

2. Deberías ver 3 pruebas:
   - ✅ Backend (Health Check)
   - ✅ Categorías (GET /api/categories)
   - ✅ Productos (GET /api/products)

3. **RESULTADO ESPERADO**:
   ```
   ✅ Sistema Conectado
   - ✅ Backend (Health Check)
   - ✅ Categorías (N categorías cargadas)
   - ✅ Productos (N productos cargados)
   ```

---

### TEST 5: Catálogo en Vivo

1. Abre: **http://localhost:3000/catalogo**

2. Verifica:
   - ✅ Se cargan las categorías en los botones de filtro
   - ✅ Se cargan los productos en la grilla
   - ✅ Los botones de categoría funcionan (filtran)
   - ✅ El selector de ordenamiento funciona

3. **RESULTADO ESPERADO**: Catálogo con productos reales de la BD

---

### TEST 6: Página Principal (Home)

1. Abre: **http://localhost:3000/**

2. Verifica:
   - ✅ Se cargan las categorías en "Explora por Categoría"
   - ✅ Se cargan productos populares
   - ✅ No hay errores en consola

3. **RESULTADO ESPERADO**: Home con datos reales

---

### TEST 7: DevTools Network

1. Abre en navegador: **http://localhost:3000/catalogo**

2. Abre DevTools (F12) → Tab "Network"

3. Verifica que haya requests a:
   - `GET http://localhost:5000/api/categories`
   - `GET http://localhost:5000/api/products`

4. **RESULTADO ESPERADO**: Requests status 200

---

## 🎯 FLUJO COMPLETO DE USUARIO

Este es un flujo de usuario completo que prueba la conexión:

### Paso 1: Visitar Home
```
http://localhost:3000/
↓
Debería cargar categorías y productos populares desde /api/categories y /api/products
```

### Paso 2: Navegar a Catálogo
```
http://localhost:3000/catalogo
↓
Debería mostrar todos los productos
```

### Paso 3: Filtrar por Categoría
```
Click en categoría (ej: "Pisos y Cerámicas")
↓
Request: GET /api/products?category=pisos-ceramicas
↓
Se filtran los productos
```

### Paso 4: Ordenar Productos
```
Cambiar selector de ordenamiento a "Precio: menor a mayor"
↓
Request: GET /api/products?sort=precio-asc
↓
Productos se reordenan
```

### Paso 5: Ver Página de Prueba
```
http://localhost:3000/test-connection
↓
Verifica que 3/3 pruebas pasen
```

---

## ✅ CHECKLIST DE VALIDACIÓN

Marca cada una cuando verifiques que funcione:

```
[ ] ✅ Backend responde en http://localhost:5000
[ ] ✅ /api/categories devuelve datos
[ ] ✅ /api/products devuelve datos
[ ] ✅ Página de prueba: http://localhost:3000/test-connection PASA
[ ] ✅ Página home: http://localhost:3000 carga con datos reales
[ ] ✅ Catálogo: http://localhost:3000/catalogo carga con datos reales
[ ] ✅ Filtros de categoría funcionan
[ ] ✅ Ordenamiento funciona
[ ] ✅ DevTools Network muestra requests al backend
[ ] ✅ No hay errores en la consola (F12)
```

---

## 🚨 SI ALGO NO FUNCIONA

### Error: "Failed to fetch from backend"

**Causas posibles:**
1. Backend no está corriendo
2. Puerto 5000 está siendo usado por otra app
3. Firewall bloqueando la conexión

**Solución:**
```bash
# Verifica si algo está en puerto 5000
netstat -ano | findstr :5000

# Inicia el backend
cd backend && npm run dev
```

---

### Error: "CORS Error"

**Causas posibles:**
1. Backend no tiene CORS habilitado (pero debería)
2. URL del backend incorrecta

**Solución:**
- Verifica `frontend/.env.local`
- Debería tener: `NEXT_PUBLIC_API_URL=http://localhost:5000`

---

### Error: "No se pudieron cargar las categorías"

**Causas posibles:**
1. Base de datos no está corriendo
2. No hay datos en la BD (falta seed)

**Solución:**
```bash
# En terminal del backend, corre el seed
npm run seed

# Debería mostrar:
# ✅ Categories created
# ✅ Products created
```

---

### Error: "Timeout"

**Causas posibles:**
1. Backend lento
2. Base de datos lenta

**Solución:**
```bash
# En terminal del backend, verifica logs
# Si ves errores de DB, reinicia:
docker-compose restart db
docker-compose up backend
```

---

## 📊 DATOS ESPERADOS

Después de que todo funcione, deberías ver:

- **Categorías**: 6 categorías (Pisos, Herramientas, Pinturas, Muebles, Iluminación, Materiales)
- **Productos**: 20-30 productos en la base de datos
- **Conectividad**: Latencia < 200ms en requests

---

## 🎉 CONCLUSIÓN

Si TODOS los checks ✅ están completados:

### ✅ **CONEXIÓN EXITOSA**

El frontend está comunicándose correctamente con el backend.

**Próximos pasos:**
1. Agregar funcionalidad de carrito
2. Implementar checkout
3. Agregar autenticación
4. Implementar proyectos y cálculos

---

## 📝 NOTAS

- Los datos mostrados son **datos REALES** de la base de datos PostgreSQL
- No hay más datos mock (mock-data.ts es solo para referencia)
- Cada request es **en tiempo real**
- Los cambios en la BD se reflejan inmediatamente en el frontend

---

¿Necesitas ayuda? Revisa:
- 📖 [CONNECTION_GUIDE.md](./CONNECTION_GUIDE.md) - Guía técnica
- 📁 `backend/src/` - Endpoints del backend
- 📁 `frontend/app/lib/api.ts` - Cliente HTTP
