# 🚀 INICIO RÁPIDO - CONEXIÓN FRONTEND-BACKEND

## ✅ CÓDIGO YA CONFIGURADO

El código está listo. Solo necesitas iniciar los servicios en 2 terminales separadas.

---

## TERMINAL 1: Backend

```bash
cd backend
npm run dev
```

**Esperado:**
```
✅ 🏠 Homara API — Backend activo
✅ Server escuchando en puerto 5000
```

---

## TERMINAL 2: Frontend

```bash
cd frontend
npm run dev
```

**Esperado:**
```
✅ ▲ Next.js 16.2.3
✅ Ready in ...
✅ Accesible en http://localhost:3000
```

---

## 🧪 VERIFICAR CONEXIÓN

### Opción 1: Test Interactivo
Abre en navegador:
```
http://localhost:3000/test-connection
```

Deberías ver 3 checkmarks verdes ✅

### Opción 2: Visitar Catálogo
Abre:
```
http://localhost:3000/catalogo
```

Deberías ver productos cargados de la BD en tiempo real.

### Opción 3: DevTools Network
1. Abre DevTools (F12)
2. Tab "Network"
3. Navega al catálogo
4. Verifica que haya requests a:
   - `http://localhost:5000/api/categories`
   - `http://localhost:5000/api/products`

---

## 🔧 SI NO FUNCIONA

### Backend no inicia
```bash
cd backend
npm install
npm run dev
```

### Frontend no inicia
```bash
cd frontend
npm install
npm run dev
```

### Error de puerto ocupado
```bash
# Verifica qué está usando el puerto 5000
netstat -ano | findstr :5000

# Verifica qué está usando el puerto 3000
netstat -ano | findstr :3000
```

### Error CORS
- El backend ya tiene CORS habilitado
- Si aún hay error, verifica `backend/src/index.js`

---

## 📊 FLUJO DE DATOS

```
User → Frontend (localhost:3000)
         ↓
       API Client (lib/api.ts)
         ↓
       HTTP → Backend (localhost:5000)
         ↓
       Database (PostgreSQL)
         ↓
       JSON Response
         ↓
       Frontend renderiza datos reales
```

---

## 📁 ARCHIVOS IMPORTANTES

- `frontend/app/lib/api.ts` - Cliente HTTP
- `frontend/.env.local` - Configuración
- `backend/src/index.js` - Punto de entrada
- `CONNECTION_GUIDE.md` - Guía completa
- `TEST_FLOW.md` - Guía de pruebas

---

## ✨ YA ESTÁ LISTO

La conexión está completamente configurada. Solo ejecuta los comandos anteriores en 2 terminales.

¿Necesitas ayuda? Revisa:
- `CONNECTION_GUIDE.md`
- `TEST_FLOW.md`
- `SETUP_SUMMARY.md`
