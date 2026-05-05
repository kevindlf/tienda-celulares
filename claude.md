# 📱 TechPhone Store — Documentación de Lógica Funcional

> **Archivo:** `CLAUDE.md`
> **Proyecto:** Tienda de Celulares (Backend + Frontend + WhatsApp Bot)
> **Propósito:** Documentar la lógica actual que SÍ funciona para mantener contexto en futuras iteraciones.

---

## 1. 🏗️ Arquitectura del Proyecto

El proyecto es un **ecommerce fullstack white-label** dividido en tres módulos:

| Módulo | Tecnología | Puerto |
|--------|-----------|--------|
| **Backend** | Spring Boot 4.0.3 + Java 21 | `8081` |
| **Frontend** | Next.js 16.2.4 + React 19.2.4 + Tailwind CSS 4 | `3000` |
| **WhatsApp Bot** | Node.js + `whatsapp-web.js` — **pendiente, se implementará con n8n** | — |

La base de datos es **PostgreSQL** (local en dev, Railway/Supabase en prod).

---

## 2. 🔐 Autenticación y Seguridad

### 2.1 JWT (Json Web Token)
- **Librería:** `jjwt-api/impl/jackson` v0.12.6
- **Flujo:**
  1. El usuario se registra o loguea en `/api/auth/registro` o `/api/auth/login`
  2. El backend genera un token con `email` como `subject` y `rol` como claim
  3. El frontend almacena el token en `localStorage` bajo la key `"token"`
  4. Cada request posterior envía `Authorization: Bearer <token>` automáticamente

```java
// JwtUtil.java — genera token con 24h de expiración
public String generarToken(String email, String rol) {
    return Jwts.builder()
        .subject(email)
        .claim("rol", rol)
        .issuedAt(new Date())
        .expiration(new Date(System.currentTimeMillis() + expiration))
        .signWith(key)
        .compact();
}
```

### 2.2 Spring Security Config
- **CORS:** Configurado dinámicamente desde `app.cors.allowed-origins`
- **CSRF:** Deshabilitado (API REST stateless)
- **Roles:** `ADMIN` y `CLIENTE`
- **Rutas públicas:** `/api/auth/**`, `/api/webhook/**`, `/api/catalogo/**`, `/api/chat`, `/api/configuracion` (GET), `/api/productos` (GET)
- **Rutas protegidas ADMIN:** POST/PUT/DELETE productos, todas las órdenes (GET), ventas físicas, reportes, clientes, configuración (PUT)

### 2.3 JwtFilter
- Interceptor `OncePerRequestFilter` que:
  1. Lee el header `Authorization`
  2. Valida el token con `JwtUtil`
  3. Crea un `UsernamePasswordAuthenticationToken` con `ROLE_<rol>`
  4. Lo setea en el `SecurityContextHolder`

### 2.4 RateLimitFilter
- Implementado con **Bucket4j** (bucket4j-core 8.10.1)
- Limita requests en endpoints críticos para evitar abuso

---

## 3. 👤 Sistema de Usuarios

### 3.1 Modelo `Usuario.java`
```java
@Entity @Table(name = "usuarios")
public class Usuario {
    Long id;
    String nombre;
    String email;        // único
    String password;     // BCrypt
    Rol rol;             // ADMIN | CLIENTE
    String telefono, direccion, ciudad, provincia;
    Boolean activo = true;
    LocalDateTime fechaCreacion;
}
```

### 3.2 AuthController
- `POST /api/auth/registro` — Crea usuario con rol `CLIENTE`, valida email único
- `POST /api/auth/login` — Valida credenciales, devuelve `{ token, rol, nombre }`

### 3.3 AdminController
- `GET /api/admin/clientes` — Lista de usuarios CLIENTE con estadísticas de compra. Solo ADMIN.

### 3.4 Frontend — AuthContext.tsx
- **Estado:** `usuario` (nombre + rol), `token`, `isAuthenticated`, `isAdmin`
- **Persistencia:** `localStorage` con keys `"token"` y `"usuario"`
- **Logout:** Limpia token, usuario y carrito de `localStorage`
- **Protección de rutas:** El Navbar muestra/oculta links según `isAdmin`

---

## 4. 📦 Productos — Lógica Central

### 4.1 Modelo `Producto.java`
Soporta tanto **CELULARES** como **ACCESORIOS**, y condiciones **NUEVO/USADO**:

```java
public class Producto {
    Long id;
    String nombre, marca, modelo, descripcion;
    BigDecimal precio;
    Integer stock;
    Integer almacenamiento, ram;
    String color;
    TipoProducto tipoProducto;          // CELULAR | ACCESORIO
    CondicionProducto condicion;        // NUEVO | USADO
    Integer nivelBateria;               // Solo USADO (0-100%)
    Integer ciclosCarga;                // Solo USADO
    BigDecimal costoProducto;           // Para calcular ganancia
    String categoria;                   // Solo ACCESORIOS
    List<String> imagenes;              // URLs de Cloudinary
    Boolean activo = true;
    LocalDateTime fechaCreacion, fechaActualizacion;
}
```

### 4.2 Catálogo Hardcodeado (CatalogoService.java)
El backend tiene un catálogo estático de marcas/modelos/colores reales del mercado actual:

| Marca | Modelos disponibles |
|-------|---------------------|
| Apple | iPhone 16 Pro Max, 16 Pro, 16 Plus, 16, 15 series, 14 series, 13 series, 12, SE |
| Samsung | Galaxy S25/S24/S23 series, A55/A35/A25/A15, Z Fold/Flip 6 |
| Motorola | Edge 50 series, Moto G85/G75/G55/G35/G24/G04 |
| Xiaomi | 14 Ultra/Pro/Standard, Redmi Note 13 series, POCO X6/M6 |
| Realme | GT 5 Pro, 12 Pro+/Pro, C55 |
| Honor | Magic 6 Pro, 200 Lite, X8b |
| Google | Pixel 9 series, 8a |
| Nothing | Phone (2a) Plus, (2a), (2) |
| TCL | 50 SE, 40 NxtPaper |

RAM disponibles: `2, 3, 4, 6, 8, 12, 16 GB`
Almacenamiento: `32, 64, 128, 256, 512, 1024 GB`
Categorías accesorio: Funda, Mica, Cargador, Cable, Auriculares, Power Bank, etc.

### 4.3 Endpoints de Productos
| Método | Ruta | Auth |
|--------|------|------|
| GET | `/api/productos` | Público |
| GET | `/api/productos/{id}` | Público |
| POST | `/api/productos` | ADMIN |
| PUT | `/api/productos/{id}` | ADMIN |
| DELETE | `/api/productos/{id}` | ADMIN |

**Borrado lógico:** `DELETE` solo setea `activo = false`, no borra de BD.

### 4.4 Nombre auto-generado para celulares
En el frontend (Dashboard → nuevo celular), el nombre se genera automáticamente:
```
"{marca} {modelo} {almacenamiento}GB {color}"
```

---

## 5. 🛒 Carrito de Compras (Frontend)

### 5.1 CartContext.tsx
- **Persistencia:** `localStorage` key `"carrito"`
- **Estructura:** Array de `Producto + cantidad`
- **Lógica de stock:** No permite agregar más unidades que el stock disponible
- **Funciones:** `agregar()`, `eliminar()`, `cambiarCantidad()`, `vaciar()`
- **Totales:** `cantidadTotal` y `total` calculados en tiempo real

### 5.2 Cross-selling en carrito
Cuando hay items en el carrito, se cargan automáticamente accesorios sugeridos:
- Filtra productos de tipo `ACCESORIO`
- Coincide marca del carrito o marca `"Genérico"`
- Excluye productos ya en el carrito
- Muestra máximo 3 sugeridos aleatorios

---

## 6. 📋 Órdenes y Pagos

### 6.1 Estados de Orden
```java
public enum EstadoOrden {
    PENDIENTE,   // Orden creada, no pagada
    PAGADO,      // Pago confirmado por MP
    ENVIADO,     // Ya despachada
    ENTREGADO,   // Llegó al cliente
    CANCELADO    // Cancelada/rechazada
}
```

### 6.2 Flujo de Compra
1. Cliente agrega productos al carrito
2. Va a checkout, completa datos de envío
3. Frontend envía `POST /api/ordenes` con items y dirección
4. Backend:
   - Valida stock de cada producto
   - Descuenta stock automáticamente
   - Crea la orden con estado `PENDIENTE`
   - Envía email de confirmación (asíncrono)
5. Frontend llama `POST /api/ordenes/{id}/pagar`
6. Backend crea preferencia de MercadoPago
7. Frontend redirige al checkout de MercadoPago

### 6.3 Webhook de MercadoPago
- **Ruta POST:** `/api/webhook/mercadopago`
- **Payload:** `{ type: "payment", data: { id: "..." } }`
- **Proceso:**
  1. Recibe notificación
  2. Consulta el pago vía `PaymentClient`
  3. Si `status == "approved"` → orden pasa a `PAGADO`
  4. Si `status == "rejected"` → orden pasa a `CANCELADO`
  5. Si `status == "pending"` → loguea, no cambia estado
- **IMPORTANTE:** Siempre retorna HTTP 200 para que MP no reintente

### 6.4 URLs de retorno (back_urls)
- En **localhost**: se omite `backUrls` y `autoReturn` (MP los rechaza)
- En **producción**: redirige a `/compra/exitosa`, `/compra/fallida`, `/compra/pendiente`

### 6.5 Emails Automáticos
Configurado con **Spring Mail (Gmail SMTP)**:
- `CORREO_TIENDA = ventastienda293@gmail.com`
- **Confirmación de orden** (`@Async`): HTML con items, total y branding
- **Actualización de estado** (`@Async`): Notifica al cliente cuando cambia de estado (no PENDIENTE)

---

## 7. 💰 Ventas Físicas (POS / Tienda)

### 7.1 VentaFisicaController
- `POST /api/ventas-fisicas` — Registra venta presencial, solo ADMIN
- La orden se crea con estado `ENTREGADO` directamente
- No requiere usuario autenticado (venta anónima)
- Descuenta stock igual que una orden online

### 7.2 Frontend — Dashboard Ventas (`/dashboard/ventas`)
- Pantalla tipo POS con buscador de productos
- Agregar/quitar items, modificar cantidades
- Campo opcional: nombre del cliente
- Botón "Registrar venta" que descuenta stock y marca como entregada

---

## 8. 🤖 Chatbot IA con Gemini

### 8.1 ChatService.java
- **Modelo:** `gemini-2.5-flash`
- **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- **Contexto inyectado:**
  - Nombre de la tienda, dirección, WhatsApp
  - Inventario actual (solo productos con stock > 0)
  - Reglas: no inventar precios, hablar en español argentino, ser breve
  - **Plan Canje:** canje de celulares usados, solo en Mendoza Zona Este
- **Si `GEMINI_API_KEY` no está configurada:** retorna mensaje pidiendo contactar por WhatsApp, no crashea

### 8.2 ChatController
- `POST /api/chat` — Público, sin auth
- Recibe `{ mensaje, historial }`
- El historial es array de `{ role: "user"|"model", text: "..." }`
- Retorna `{ respuesta: "..." }`

### 8.3 Frontend — ChatWidget.tsx
- Widget flotante en esquina inferior derecha
- Mantiene historial de conversación en estado local
- Envía historial completo al backend para contexto
- Diseño con burbujas de chat, avatar de bot, indicador de typing

---

## 9. 📱 WhatsApp

### 9.1 Estado actual
- **Twilio: NO implementado.** El CLAUDE.md anterior lo mencionaba por error.
- **whatsapp-web.js:** instalado en `whatsapp-bot/package.json` pero sin código implementado.
- **Plan:** implementar la automatización de WhatsApp con **n8n** (workflows sin código).

### 9.2 WhatsAppButton (Frontend)
- Botón flotante verde `#25D366` en esquina inferior derecha
- Carga número dinámico desde `/api/configuracion`
- Abre `https://wa.me/{numero}?text={mensaje}` en nueva pestaña
- **Es solo un link directo — no hay automatización todavía**

### 9.3 Plan con n8n
- Webhook de n8n recibe mensajes entrantes de WhatsApp
- Llama al endpoint `POST /api/chat` del backend (Gemini)
- Responde automáticamente al cliente
- No requiere cambios en el backend

---

## 10. 📊 Dashboard y Reportes

### 10.1 Dashboard Principal (`/dashboard`)
**Stats cards:**
- Facturación total (excluyendo CANCELADO)
- **Ganancia neta** (precio venta - costoProducto, solo órdenes PAGADO/ENTREGADO)
- Total órdenes, órdenes hoy, productos activos

**Alertas de stock:**
- Productos con stock = 0 (badge rojo)
- Productos con stock < 3 (badge naranja)

**Gráficos (Recharts):**
- Ventas del mes actual (día por día, AreaChart)
- Histórico mensual del año (BarChart)
- Top 5 productos más vendidos

**Tablas:**
- Productos con precio, costo, margen %, stock, estado
- Órdenes recientes con cambio de estado vía dropdown
- Exportar órdenes a CSV

### 10.2 Reportes (`/dashboard/reportes`)
- KPIs: Ingresos, órdenes, productos, stock bajo
- Ventas por estado (barras de progreso)
- Productos con stock bajo (links a edición)

### 10.3 Clientes (`/dashboard/clientes`)
- Lista de usuarios con rol CLIENTE
- Estadísticas de compra por cliente

---

## 11. ⚙️ Configuración de Tienda

### 11.1 Modelo ConfiguracionTienda
```java
public class ConfiguracionTienda {
    String nombreTienda;
    String telefonoWhatsApp;
    String direccionFisica;
    String linkInstagram;
    BigDecimal montoEnvioGratis;
    String mensajeCabecera;
}
```

### 11.2 Comportamiento
- Si no existe registro en BD, se crea automáticamente con valores por defecto:
  - Nombre: "Tienda Celulares"
  - WhatsApp: "5492634383534"
  - Dirección: "Av. Principal 123, Mendoza"
  - Envío gratis: $100,000
  - Mensaje: "¡Aprovechá 3 cuotas sin interés!"
- `GET /api/configuracion` — Público
- `PUT /api/configuracion` — ADMIN (`/dashboard/configuracion`)

### 11.3 Uso en Frontend
- Navbar carga nombre de tienda y mensaje de cabecera
- WhatsAppButton carga número dinámico
- ChatBot incluye info de la tienda en el prompt

---

## 12. 🖼️ Subida de Imágenes (Cloudinary)

### 12.1 ImageUploader.tsx
- Componente reutilizable para formularios de producto
- Soporta drag & drop y click para seleccionar
- Sube directamente a Cloudinary vía `fetch`
- Máximo 5 imágenes por producto
- Preview con botón de eliminar

### 12.2 Variables de entorno necesarias
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

---

## 13. 🌓 Tema Oscuro / Claro

### 13.1 Implementación
- CSS custom properties en `globals.css` con `:root` (light) y `.dark` (dark)
- Paleta verde oscuro (Starbucks-inspired): `#00704A` como primary
- Toggle en Navbar con iconos Sun/Moon
- Persistencia en `localStorage` key `"theme"`
- Detecta `prefers-color-scheme` si no hay preferencia guardada
- Fuentes: **Syne** (display/headings) + **DM Sans** (body)

### 13.2 Variables CSS
```css
:root {
  --background: #F9F9F9;
  --foreground: #1E3932;
  --primary: #00704A;
  --primary-hover: #005A3B;
  --card-bg: #FFFFFF;
  --card-border: #E5E7EB;
  --accent: #D4E9E2;
  --nav-bg: rgba(255, 255, 255, 0.9);
}

.dark {
  --background: #11211C;
  --foreground: #F9F9F9;
  --card-bg: #182E27;
  --card-border: #1E3932;
  --accent: #1E3932;
  --nav-bg: rgba(24, 46, 39, 0.9);
}
```

---

## 14. 🔧 Variables de Entorno

### Backend (`application.properties`)
```properties
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/mi_base_local}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD:root}
jwt.secret=${JWT_SECRET:}
jwt.expiration=${JWT_EXPIRATION:86400000}
app.cors.allowed-origins=${CORS_ORIGINS:http://localhost:3000}
mercadopago.access-token=${MP_ACCESS_TOKEN:}
mercadopago.public-key=${MP_PUBLIC_KEY:}
spring.mail.username=${MAIL_USERNAME:}
spring.mail.password=${MAIL_PASSWORD:}
gemini.api.key=${GEMINI_API_KEY:}
server.port=${PORT:8081}
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8081
NEXT_PUBLIC_MP_PUBLIC_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

---

## 15. 🚀 Cómo Ejecutar el Proyecto

### Backend
```bash
cd backend
./mvnw spring-boot:run
# Windows:
mvnw.cmd spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Base de datos
- Requiere PostgreSQL local o configurar `DB_URL` apuntando a Railway/Supabase
- Las tablas se crean automáticamente (`ddl-auto=update`)

---

## 16. 📁 Estructura de Archivos Clave

```
backend/src/main/java/com/tiendacelulares/backend/
├── BackendApplication.java
├── controller/
│   ├── AdminController.java              # GET /api/admin/clientes
│   ├── AuthController.java               # Registro/login
│   ├── CatalogoController.java           # Marcas, modelos, colores, RAM, almacenamiento
│   ├── ChatController.java               # Gemini chatbot
│   ├── ConfiguracionTiendaController.java
│   ├── GlobalExceptionHandler.java       # Manejo centralizado errores
│   ├── OrdenController.java              # Crear orden + pagar + estado
│   ├── ProductoController.java           # CRUD productos
│   ├── ReporteController.java            # Resumen, stock bajo, ventas por estado
│   ├── VentaFisicaController.java        # POS tienda
│   └── WebhookController.java            # Notificaciones MercadoPago
├── security/
│   ├── JwtUtil.java
│   ├── JwtFilter.java
│   ├── RateLimitFilter.java              # Bucket4j rate limiting
│   └── SecurityConfig.java
└── service/
    ├── CatalogoService.java
    ├── ChatService.java                  # Gemini API
    ├── ConfiguracionTiendaService.java
    ├── EmailService.java                 # HTML emails async
    ├── MercadoPagoService.java
    ├── OrdenService.java
    ├── ProductoService.java
    └── VentaFisicaService.java

frontend/app/
├── page.tsx                              # Home
├── productos/page.tsx                    # Catálogo
├── productos/[id]/page.tsx               # Detalle producto
├── carrito/page.tsx
├── checkout/page.tsx
├── compra/{exitosa,fallida,pendiente}/   # Resultados de pago
├── login/ y registro/
├── mis-pedidos/page.tsx                  # Historial de órdenes del cliente
├── dashboard/page.tsx                    # Panel admin principal
├── dashboard/ventas/page.tsx             # POS físico
├── dashboard/reportes/page.tsx
├── dashboard/clientes/page.tsx
├── dashboard/configuracion/page.tsx
├── dashboard/productos/nuevo-celular/
├── dashboard/productos/nuevo-accesorio/
├── dashboard/productos/[id]/             # Editar producto
└── politicas/{privacidad,terminos,devoluciones}/

frontend/components/
├── layout/Navbar.tsx
├── layout/Footer.tsx
└── ui/{ChatWidget,WhatsAppButton,ImageUploader}.tsx
```

---

## 17. ✅ Estado Real de Features

| Feature | Estado | Notas |
|---------|--------|-------|
| Registro/Login con JWT | ✅ | Roles ADMIN/CLIENTE |
| CRUD Productos | ✅ | Borrado lógico |
| Carrito con localStorage | ✅ | Límite de stock |
| Checkout con MP | ✅ | Sandbox/demo |
| Webhook MP | ✅ | Actualiza estado automáticamente |
| Emails automáticos | ✅ | HTML con branding |
| Chatbot IA (Gemini) | ✅ | Contexto de inventario real |
| Ventas físicas (POS) | ✅ | Descuenta stock |
| Dashboard con gráficos | ✅ | Recharts |
| Reportes | ✅ | Stock bajo, ventas por estado |
| Clientes admin | ✅ | Lista con estadísticas |
| Configuración tienda | ✅ | Persiste en BD |
| Subida de imágenes | ✅ | Cloudinary |
| Tema oscuro/claro | ✅ | CSS variables + localStorage |
| Cross-selling | ✅ | Sugiere accesorios en carrito |
| Exportar CSV | ✅ | Órdenes |
| Rate limiting | ✅ | Bucket4j |
| Políticas (privacidad/términos) | ✅ | Páginas estáticas |
| WhatsApp automatizado | ⏳ | Pendiente — se hará con n8n |
| Twilio | ❌ | Nunca implementado, descartado |

---

> **Última actualización:** Mayo 2025
> **Nota:** Este archivo refleja el estado real del código. El WhatsApp bot está pendiente y se implementará con n8n sin necesidad de cambios en el backend.
