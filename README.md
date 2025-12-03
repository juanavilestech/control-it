# Control IT - Sistema de Gestión de Servicios IT

Sistema web completo para la gestión de trabajos de servicios IT con autenticación de usuarios, control automático de inventario y dashboard en tiempo real.

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución JavaScript
- **Express.js** - Framework web minimalista
- **Prisma ORM** - ORM moderno para Node.js
- **SQLite** - Base de datos relacional ligera
- **CORS** - Middleware para habilitar CORS
- **dotenv** - Gestión de variables de entorno

### Frontend
- **React 19** - Biblioteca para interfaces de usuario
- **Vite** - Build tool y dev server ultrarrápido
- **React Router DOM** - Enrutamiento del lado del cliente
- **Tailwind CSS** - Framework CSS utility-first

### Herramientas de Desarrollo
- **Nodemon** - Auto-restart del servidor en desarrollo
- **ESLint** - Linter para JavaScript
- **Prisma Studio** - GUI para explorar la base de datos

## 🔐 Sistema de Autenticación

### Credenciales por Defecto
- **Usuario**: `admin`
- **Contraseña**: `admin123`

### Funcionalidades de Autenticación
- ✅ **Login** - Inicio de sesión con usuario y contraseña
- ✅ **Registro** - Crear nuevas cuentas de usuario (todos son admin)
- ✅ **Recuperación de contraseña** - Restablecer contraseña olvidada
- ✅ **Tokens JWT** - Sesiones seguras con expiración de 24 horas
- ✅ **Rutas protegidas** - Todas las funcionalidades requieren autenticación
- ✅ **Persistencia de sesión** - Sesión guardada en localStorage
- ✅ **Logout** - Botón para cerrar sesión en navbar

### Rutas de Autenticación
- `/login` - Iniciar sesión
- `/register` - Crear nueva cuenta
- `/forgot-password` - Restablecer contraseña

## 📋 Funcionalidades

### Autenticación y Seguridad
- ✅ Login con usuario y contraseña
- ✅ Registro de nuevos usuarios
- ✅ Recuperación de contraseña
- ✅ Sesiones seguras con JWT
- ✅ Contraseñas encriptadas con bcrypt
- ✅ Protección de todas las rutas

### Gestión de Trabajos
- ✅ Crear trabajos con título, descripción, fecha, estado y tipo de servicio
- ✅ Editar trabajos existentes
- ✅ Listar todos los trabajos
- ✅ Asignar ítems de inventario a trabajos
- ✅ Validación de stock disponible

### Control de Inventario
- ✅ Agregar nuevos ítems al inventario
- ✅ Listar inventario completo
- ✅ Descuento automático de stock al usar ítems
- ✅ Restauración de stock al editar trabajos
- ✅ Alertas visuales para stock bajo
- ✅ Validación de stock insuficiente

### Dashboard
- ✅ Estadísticas en tiempo real
- ✅ Contador de trabajos pendientes
- ✅ Contador de insumos con stock bajo
- ✅ Contador de trabajos completados

### Navegación
- ✅ SPA (Single Page Application)
- ✅ Resaltado de sección activa
- ✅ Navegación fluida sin recargas

## 🗂️ Estructura del Proyecto

```
control-it/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma      # Esquema de base de datos
│   ├── routes/
│   │   ├── jobs.js            # Rutas de trabajos
│   │   ├── inventory.js       # Rutas de inventario
│   │   └── meta.js            # Rutas de metadata
│   ├── server.js              # Servidor Express
│   ├── seed.js                # Script de datos iniciales
│   ├── .env                   # Variables de entorno
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── JobBoard.jsx       # Lista de trabajos
    │   │   ├── JobForm.jsx        # Formulario de trabajos
    │   │   ├── InventoryTable.jsx # Lista de inventario
    │   │   ├── InventoryForm.jsx  # Formulario de inventario
    │   │   └── Layout.jsx         # Layout principal
    │   ├── pages/
    │   │   └── Dashboard.jsx      # Dashboard
    │   ├── App.jsx                # Componente principal
    │   └── main.jsx               # Punto de entrada
    └── package.json
```

## 🛠️ Instalación

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn

### Paso 1: Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd control-it
```

### Paso 2: Instalar dependencias del backend
```bash
cd backend
npm install
```

### Paso 3: Configurar base de datos
```bash
# Crear la base de datos
npx prisma db push

# Poblar con datos iniciales
node seed.js
```

### Paso 4: Instalar dependencias del frontend
```bash
cd ../frontend
npm install
```

## 🚀 Uso

### Iniciar el Backend
```bash
cd backend
npm run dev
```
El servidor estará disponible en `http://localhost:3000`

### Iniciar el Frontend
```bash
cd frontend
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`

### Explorar la Base de Datos (Opcional)
```bash
cd backend
npx prisma studio
```
Prisma Studio estará disponible en `http://localhost:5555`

## 📖 Guía de Uso

### 1. Autenticación

#### Primera Vez (Registro)
1. Abre la aplicación en `http://localhost:5173`
2. Click en **"Crear cuenta"**
3. Completa el formulario:
   - Usuario (requerido)
   - Email (opcional)
   - Contraseña (mínimo 6 caracteres)
   - Confirmar contraseña
4. Click en **"Crear Cuenta"**
5. Serás redirigido automáticamente al dashboard

#### Usuario Existente (Login)
1. Ingresa tus credenciales
2. Click en **"Iniciar Sesión"**
3. Acceso al sistema completo

#### Olvidó su Contraseña
1. Click en **"¿Olvidó su contraseña?"**
2. Ingresa tu nombre de usuario
3. Establece una nueva contraseña
4. Confirma la nueva contraseña
5. Vuelve al login e ingresa con la nueva contraseña

### 2. Dashboard
- Accede a `/` para ver las estadísticas en tiempo real
- Visualiza trabajos pendientes, insumos bajos y trabajos completados

### 3. Gestión de Trabajos

#### Crear un Trabajo
1. Navega a **Trabajos** → **Nuevo Trabajo**
2. Completa el formulario:
   - Título (requerido)
   - Descripción (opcional)
   - Fecha (requerido)
   - Estado (requerido)
   - Tipo de Servicio (requerido)
3. Agrega ítems de inventario:
   - Click en "Agregar Ítem"
   - Selecciona el ítem del dropdown
   - Ingresa la cantidad
4. Click en **Guardar**

#### Editar un Trabajo
1. En la lista de trabajos, click en **Editar**
2. Modifica los campos necesarios
3. El stock se ajustará automáticamente
4. Click en **Guardar**

### 4. Gestión de Inventario

#### Agregar Ítem
1. Navega a **Inventario** → **Agregar Ítem**
2. Completa el formulario:
   - Nombre (requerido)
   - Descripción (opcional)
   - Categoría (opcional)
   - Stock Inicial (requerido)
   - Stock Mínimo (requerido)
3. Click en **Guardar**

#### Ver Inventario
- Los ítems con stock bajo (≤ stock mínimo) se resaltan en rojo
- El stock se actualiza automáticamente al crear/editar trabajos

## 🔄 Flujo de Datos

### Creación de Trabajo con Inventario
```
Usuario → Formulario → POST /api/jobs
                           ↓
                    Validar Stock
                           ↓
                    Crear Trabajo
                           ↓
                    Descontar Stock
                           ↓
                    Respuesta → Usuario
```

### Edición de Trabajo
```
Usuario → Formulario → PUT /api/jobs/:id
                           ↓
                    Obtener Trabajo Actual
                           ↓
                    Restaurar Stock Anterior
                           ↓
                    Validar Nuevo Stock
                           ↓
                    Actualizar Trabajo
                           ↓
                    Descontar Nuevo Stock
                           ↓
                    Respuesta → Usuario
```

## 🔌 API Endpoints

### Autenticación (Públicas)
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar nuevo usuario (admin por defecto)
- `POST /api/auth/reset-password` - Restablecer contraseña
- `GET /api/auth/me` - Obtener información del usuario actual

### Trabajos (Protegidas - Requieren JWT)
- `GET /api/jobs` - Lista todos los trabajos
- `GET /api/jobs/:id` - Obtiene un trabajo específico
- `POST /api/jobs` - Crea un nuevo trabajo
- `PUT /api/jobs/:id` - Actualiza un trabajo

### Inventario (Protegidas - Requieren JWT)
- `GET /api/inventory` - Lista todos los ítems
- `POST /api/inventory` - Agrega un nuevo ítem

### Metadata (Protegidas - Requieren JWT)
- `GET /api/meta/statuses` - Lista estados disponibles
- `GET /api/meta/service-types` - Lista tipos de servicio

> **Nota**: Las rutas protegidas requieren el header `Authorization: Bearer <token>`

## 🗄️ Modelo de Datos

### User (Usuario)
```javascript
{
  id: Int,
  username: String (unique),
  password: String (hashed),
  email: String?,
  role: String (default: "admin"),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Job (Trabajo)
```javascript
{
  id: Int,
  title: String,
  description: String?,
  date: DateTime,
  statusId: Int,
  serviceTypeId: Int,
  itemsUsed: JobItem[],
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### InventoryItem (Ítem de Inventario)
```javascript
{
  id: Int,
  name: String,
  description: String?,
  category: String?,
  stock: Int,
  minStock: Int
}
```

### JobItem (Relación Trabajo-Inventario)
```javascript
{
  id: Int,
  jobId: Int,
  itemId: Int,
  quantity: Int
}
```

## ⚙️ Configuración

### Variables de Entorno (backend/.env)
```env
DATABASE_URL="file:./dev.db"
PORT=3000
```

## 🧪 Datos de Prueba

El script `seed.js` crea automáticamente:

**Usuario por Defecto:**
- Username: `admin`
- Password: `admin123`
- Role: `admin`

**Estados:**
- Pendiente
- En Progreso
- Completado
- Cancelado

**Tipos de Servicio:**
- Mantenimiento
- Reparación
- Instalación
- Consultoría

**Ítems de Inventario:**
- Cable UTP Cat6 (500 unidades)
- Conector RJ45 (200 unidades)
- Disco SSD 500GB (10 unidades)
- Memoria RAM 8GB (15 unidades)
- Mouse Óptico (30 unidades)

## 🐛 Solución de Problemas

### El backend no inicia
```bash
# Verificar que el puerto 3000 esté disponible
# Regenerar Prisma Client
cd backend
npx prisma generate
```

### El frontend no se conecta al backend
- Verificar que el backend esté corriendo en `http://localhost:3000`
- Revisar la consola del navegador para errores de CORS

### La base de datos está vacía
```bash
# Re-ejecutar el seed
cd backend
node seed.js
```

## 📝 Notas Importantes

- **Autenticación Requerida**: Todas las funcionalidades requieren estar autenticado
- **Usuarios Admin**: Todos los usuarios registrados tienen rol de administrador
- **Sesión Persistente**: El token JWT se guarda en localStorage y expira en 24 horas
- **Stock Automático**: El sistema descuenta automáticamente el stock al crear trabajos y lo restaura al editar
- **Validación**: No se permite crear/editar trabajos si no hay stock suficiente
- **Transacciones**: Todas las operaciones de stock usan transacciones para garantizar consistencia
- **SQLite**: Base de datos local, ideal para desarrollo. Para producción considerar PostgreSQL o MySQL
- **Seguridad**: Contraseñas hasheadas con bcrypt (10 rounds). Cambiar JWT_SECRET en producción

## 🚀 Próximas Mejoras

- [ ] Roles de usuario diferenciados (admin, técnico, viewer)
- [ ] Reportes y gráficos
- [ ] Exportación a PDF/Excel
- [ ] Notificaciones de stock bajo
- [ ] Historial de cambios
- [ ] Búsqueda y filtros avanzados
- [ ] Edición de ítems de inventario
- [ ] Eliminación de trabajos

## 📄 Licencia

Este proyecto es de uso interno.

## 👤 Autor

Desarrollado para gestión de servicios IT.
