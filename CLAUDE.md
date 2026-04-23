# CLAUDE.md — Tienda Celulares

Este archivo contiene el contexto y convenciones del proyecto para que cualquier AI assistant (Claude, Gemini, Copilot, etc.) entienda la base de código y mantenga la consistencia.

---

## Descripción del Proyecto

**TechPhone Store** es una aplicación web e-commerce para la venta de celulares, con un panel de administración integrado para gestionar productos, órdenes, stock y ventas (tanto online como en tienda física), reemplazando el uso de Excel.

### Objetivos Principales
- Venta online de celulares con pagos vía MercadoPago
- Panel admin para control de inventario, órdenes y reportes
- Registro de ventas físicas (POS) sin necesidad de pago online
- Gestión de roles: ADMIN (dueño/vendedor) y CLIENTE (comprador)

---

## Stack Tecnológico

### Backend
- **Framework**: Spring Boot 4.0.3
- **Lenguaje**: Java 21
- **Base de datos**: PostgreSQL (nombre: `tienda_celulares`)
- **ORM**: Spring Data JPA / Hibernate
- **Autenticación**: JWT (jjwt 0.12.6)
- **Pagos**: MercadoPago SDK Java 2.1.29
- **Build**: Maven
- **Puerto**: 8081

### Frontend
- **Framework**: Next.js 16.2.4 (App Router)
- **Lenguaje**: TypeScript 5
- **UI**: React 19.2.4
- **Estilos**: TailwindCSS 4 (vía PostCSS)
- **HTTP Client**: Axios 1.15.2
- **Íconos**: Lucide React
- **Imágenes**: Cloudinary (upload directo desde frontend)
- **Puerto**: 3000

---

## Estructura del Proyecto

```
tienda-celulares/
├── backend/                         # API REST (Spring Boot)
│   └── src/main/java/com/tiendacelulares/backend/
│       ├── controller/              # REST Controllers
│       │   ├── AuthController.java  # Login, registro (usa DTO)
│       │   ├── GlobalExceptionHandler.java  # @ControllerAdvice global
│       │   ├── OrdenController.java # CRUD órdenes, pago MP
│       │   ├── ProductoController.java
│       │   ├── ReporteController.java    # Reportes y KPIs
│       │   ├── VentaFisicaController.java # POS ventas en tienda
│       │   └── WebhookController.java    # Webhook MercadoPago IPN
│       ├── dto/                     # Data Transfer Objects
│       │   ├── CrearOrdenRequest.java    # DTO entrada para crear orden
│       │   ├── CrearProductoRequest.java # DTO entrada para crear/editar producto
│       │   ├── LoginRequest.java         # DTO login
│       │   ├── RegistroRequest.java      # DTO registro
│       │   ├── MapperDTO.java       # Mapper manual Entity → DTO
│       │   ├── OrdenDTO.java
│       │   ├── OrdenItemDTO.java
│       │   ├── ProductoDTO.java
│       │   └── UsuarioDTO.java
│       ├── model/                   # Entidades JPA
│       ├── repository/              # Spring Data Repositories
│       ├── security/                # JWT + Spring Security
│       │   ├── JwtFilter.java
│       │   ├── JwtUtil.java         # Configurable via application.properties
│       │   └── SecurityConfig.java  # CORS configurable, webhook público
│       └── service/
│           ├── MercadoPagoService.java  # Incluye procesarNotificacionPago
│           ├── OrdenService.java
│           ├── ProductoService.java
│           └── VentaFisicaService.java  # POS: venta directa
│
├── frontend/                        # Web App (Next.js)
│   ├── app/
│   │   ├── page.tsx                 # Landing page
│   │   ├── layout.tsx               # Layout con AuthProvider, CartProvider, ToastProvider
│   │   ├── login/page.tsx
│   │   ├── registro/page.tsx
│   │   ├── productos/
│   │   │   ├── page.tsx             # Catálogo público
│   │   │   └── [id]/page.tsx        # Detalle de producto
│   │   ├── carrito/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── mis-pedidos/page.tsx     # Historial de pedidos del cliente
│   │   ├── compra/
│   │   │   ├── exitosa/page.tsx     # Resultado pago OK
│   │   │   ├── fallida/page.tsx     # Resultado pago fallido
│   │   │   └── pendiente/page.tsx   # Resultado pago pendiente
│   │   └── dashboard/
│   │       ├── page.tsx             # Dashboard admin
│   │       ├── ventas/page.tsx      # POS ventas físicas
│   │       ├── reportes/page.tsx    # KPIs, gráficos, stock bajo
│   │       └── productos/
│   │           ├── nuevo/page.tsx
│   │           └── [id]/page.tsx
│   ├── components/
│   │   ├── layout/Navbar.tsx        # Navbar con badge carrito + auth
│   │   └── ui/ImageUploader.tsx     # Upload a Cloudinary drag & drop
│   ├── context/
│   │   ├── AuthContext.tsx          # Estado global de autenticación
│   │   ├── CartContext.tsx          # Estado global del carrito
│   │   └── ToastContext.tsx         # Notificaciones toast
│   ├── lib/api.ts                   # Axios + interceptors + API wrappers
│   └── types/index.ts
│
└── CLAUDE.md
```

---

## Convenciones de Código

### Backend (Java)

- **Idioma del código**: español (nombres de clases, métodos, variables, enums)
- **Lombok**: Usar `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@RequiredArgsConstructor`
- **DTOs**: SIEMPRE devolver DTOs al frontend, NUNCA entidades directamente
- **Mapper**: Usar `MapperDTO` (mapper manual, no MapStruct)
- **Validaciones**: Usar Bean Validation (`@NotBlank`, `@NotNull`, `@Min`, etc.) en entidades
- **Borrado**: Siempre borrado lógico (campo `activo = false`), nunca DELETE real
- **Timestamps**: `@PrePersist` y `@PreUpdate` para fechas automáticas
- **Responses**: Usar `ResponseEntity<>` con status codes apropiados
- **Naming**: Clases en PascalCase, métodos en camelCase español (`obtenerTodos`, `crearOrden`)

### Frontend (TypeScript/React)

- **Idioma**: español para variables de estado y funciones de negocio, inglés para imports/hooks
- **Componentes**: Functional components con hooks
- **Estado global**: Usar `AuthContext` para auth, `CartContext` para carrito, `ToastContext` para notificaciones
- **Estilos**: TailwindCSS 4, clases inline. Paleta principal: blue-600 como primario
- **API calls**: Usar los wrappers de `lib/api.ts` (`productosApi`, `authApi`, `ordenesApi`, `ventasFisicasApi`, `reportesApi`)
- **Tipos**: Definir interfaces en `types/index.ts`
- **Navegación**: `useRouter()` de next/navigation para redirects programáticos
- **Formularios**: Controlados con `useState`, `onChange` handler, `onSubmit` async
- **Auth check**: Usar `useAuth()` hook — NUNCA leer localStorage directamente
- **Notificaciones**: Usar `useToast().showToast()` — NUNCA usar `alert()`
- **Directives**: Agregar `"use client"` en componentes que usen hooks o browser APIs

---

## API Endpoints

### Auth (`/api/auth`) — Público
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/registro` | Registrar nuevo usuario (siempre rol CLIENTE) |
| POST | `/api/auth/login` | Login, devuelve `{token, rol, nombre}` |

### Productos (`/api/productos`)
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/api/productos` | Público | Lista todos los productos activos |
| GET | `/api/productos/{id}` | Público | Detalle de un producto |
| POST | `/api/productos` | ADMIN | Crear producto |
| PUT | `/api/productos/{id}` | ADMIN | Actualizar producto |
| DELETE | `/api/productos/{id}` | ADMIN | Desactivar producto (borrado lógico) |

### Órdenes (`/api/ordenes`)
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/api/ordenes` | Autenticado | Crear orden (descuenta stock) |
| GET | `/api/ordenes/mis-ordenes` | Autenticado | Órdenes del usuario logueado |
| GET | `/api/ordenes` | ADMIN | Todas las órdenes |
| PATCH | `/api/ordenes/{id}/estado` | ADMIN | Cambiar estado de orden |
| POST | `/api/ordenes/{id}/pagar` | Autenticado | Generar preferencia MercadoPago |

### Ventas Físicas (`/api/ventas-fisicas`) — ADMIN
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/api/ventas-fisicas` | ADMIN | Registrar venta en tienda (estado ENTREGADO) |

### Reportes (`/api/reportes`) — ADMIN
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/api/reportes/resumen` | ADMIN | KPIs: ingresos, órdenes, productos, stock bajo |
| GET | `/api/reportes/stock-bajo` | ADMIN | Productos con stock ≤ 5 |
| GET | `/api/reportes/ventas-por-estado` | ADMIN | Distribución de ventas por estado |

### Webhook (`/api/webhook`) — Público
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/api/webhook/mercadopago` | Público | Recibe notificaciones IPN de MP |

---

## Modelo de Datos

### Relaciones
```
Usuario (1) ──── (N) Orden
Orden (1) ──── (N) OrdenItem
OrdenItem (N) ──── (1) Producto
Producto (1) ──── (N) Imágenes (ElementCollection)
```

### Estados de Orden
`PENDIENTE` → `PAGADO` → `PREPARANDO` → `ENVIADO` → `ENTREGADO`
                                                          ↘ `CANCELADO` (desde cualquier estado)

### Roles
- `ADMIN`: Gestiona productos, ve todas las órdenes, cambia estados, accede al dashboard
- `CLIENTE`: Compra productos, ve sus propias órdenes

---

## Configuración

### Variables de Entorno — Backend
```properties
# application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/tienda_celulares
spring.datasource.username=postgres
spring.datasource.password=${DB_PASSWORD}    # ⚠️ Mover a env var
server.port=8081

# application-secrets.properties (NO commitear)
mercadopago.access-token=${MP_ACCESS_TOKEN}
mercadopago.public-key=${MP_PUBLIC_KEY}
```

### Variables de Entorno — Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:8081
NEXT_PUBLIC_MP_PUBLIC_KEY=<mercadopago-public-key>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<cloudinary-cloud>
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<cloudinary-preset>
```

---

## Cómo Correr el Proyecto

### Backend
```bash
cd backend
./mvnw spring-boot:run
# Corre en http://localhost:8081
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Corre en http://localhost:3000
```

### Requisitos
- Java 21+
- Node.js 18+
- PostgreSQL corriendo con base de datos `tienda_celulares` creada
- (Opcional) Cuenta de MercadoPago para pagos en sandbox

---

## Patrones Importantes

### Autenticación
1. El usuario hace login → backend genera JWT con `email` + `rol`
2. Frontend guarda token en `localStorage` y datos del usuario (`nombre`, `rol`)
3. Cada request de Axios inyecta `Authorization: Bearer <token>` automáticamente
4. `JwtFilter` valida el token y setea `SecurityContext` con `ROLE_ADMIN` o `ROLE_CLIENTE`

### Flujo de Compra
1. Cliente navega productos → agrega al carrito (localStorage)
2. Va al checkout → completa datos de envío
3. Se crea la orden en backend (descuenta stock)
4. Se genera preferencia de MercadoPago
5. Redirect al checkout de MercadoPago (sandbox)
6. MercadoPago envía webhook IPN → backend actualiza estado a PAGADO automáticamente
7. Usuario es redirigido a `/compra/exitosa`, `/compra/fallida` o `/compra/pendiente`

### Gestión de Stock (Admin)
- Desde dashboard, editar producto → ajustar stock manualmente con botones +/-
- El stock se descuenta automáticamente al crear una orden online
- El stock se descuenta al registrar una venta física (POS)

---

## Issues Conocidos y TODOs

### Resueltos ✅
- [x] Interceptor de Axios duplicado
- [x] Botón de registro con estilos incorrectos
- [x] JWT secret hardcodeado
- [x] Password de DB expuesto
- [x] GlobalExceptionHandler
- [x] DTOs de entrada para seguridad
- [x] AuthContext, CartContext, ToastContext
- [x] Webhook MercadoPago
- [x] ImageUploader con Cloudinary
- [x] POS ventas físicas
- [x] Reportes y KPIs

### Pendientes
- [ ] Paginación en endpoints de listado (cuando haya muchos productos)
- [ ] Exportar reportes a CSV/Excel/PDF
- [ ] Roles más granulares (VENDEDOR, VIEWER)
- [ ] Estadísticas con gráficos temporales (ventas por día/semana/mes)
- [ ] Multi-sucursal
- [ ] Integración contable (AFIP)
