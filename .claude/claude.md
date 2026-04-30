# 📱 TechPhone Store — Documentación de Lógica Funcional

> **Archivo:** `claude.md`
> **Proyecto:** Tienda de Celulares (Backend + Frontend + WhatsApp Bot)
> **Propósito:** Documentar la lógica actual que SÍ funciona para mantener contexto en futuras iteraciones.

---

## 1. 🏗️ Arquitectura del Proyecto

El proyecto es un **ecommerce fullstack** dividido en tres módulos:

| Módulo | Tecnología | Puerto |
|--------|-----------|--------|
| **Backend** | Spring Boot 4.0.3 + Java 21 | `8081` |
| **Frontend** | Next.js 16.2.4 + React 19.2.4 + Tailwind CSS 4 | `3000` |
| **WhatsApp Bot** | Node.js + `whatsapp-web.js` (MVP básico) | — |

La base de datos es **PostgreSQL** (configurada vía Supabase en prod, local en dev).

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
- **Rutas protegidas ADMIN:** POST/PUT/DELETE productos, todas las órdenes, ventas físicas, reportes, configuración (PUT)

### 2.3 JwtFilter
- Interceptor `OncePerRequestFilter` que:
  1. Lee el header `Authorization`
  2. Valida el token con `JwtUtil`
  3. Crea un `UsernamePasswordAuthenticationToken` con `ROLE_<rol>`
  4. Lo setea en el `SecurityContextHolder`

---

## 3. 👤 Sistema de Usuarios

### 3.1 Modelo `Usuario.java`
```java
@Entity @Table(name = "usuarios")
public class Usuario {
    Long id;
    String nombre;
    String email; // único
    String password; // BCrypt
    Rol rol; // ADMIN | CLIENTE
    String telefono, direccion, ciudad, provincia;
    Boolean activo = true;
    LocalDateTime fechaCreacion;
}
```

### 3.2 AuthController
- `POST /api/auth/registro` — Crea usuario con rol `CLIENTE`, valida email único
- `POST /api/auth/login` — Valida credenciales, devuelve `{ token, rol, nombre }`

### 3.3 Frontend — AuthContext.tsx
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
    TipoProducto tipoProducto; // CELULAR | ACCESORIO
    CondicionProducto condicion; // NUEVO | USADO
    Integer nivelBateria;   // Solo USADO (0-100%)
    Integer ciclosCarga;    // Solo USADO
    BigDecimal costoProducto; // Para calcular ganancia
    String categoria;       // Solo ACCESORIOS
    List<String> imagenes;  // URLs de Cloudinary
    Boolean activo = true;
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
    PREPARANDO,  // Admin la está preparando
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
7. Frontend redirige a `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id={preferenceId}`

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

### 6.5 Email Automáticos
Configurado con **Spring Mail (Gmail SMTP)**:
- `CORREO_TIENDA = ventastienda293@gmail.com`
- **Confirmación de orden** (`@Async`): HTML bonito con items, total, branding
- **Actualización de estado** (`@Async`): Notifica al cliente cuando cambia de estado (no PENDIENTE)

---

## 7. 💰 Ventas Físicas (POS / Tienda)

### 7.1 VentaFisicaController
- `POST /api/ventas-fisicas` — Registra venta presencial, solo ADMIN
- La orden se crea con estado `ENTREGADO` directamente
- No requiere usuario autenticado (venta anónima)
- Descuenta stock igual que una orden online

### 7.2 Frontend — Dashboard Ventas
- Pantalla tipo POS con buscador de productos
- Agregar/quitar items, modificar cantidades
- Campo opcional: nombre del cliente
- Botón "Registrar venta" que descuenta stock y marca como entregada

---

## 8. 🤖 Chatbot IA con Gemini

### 8.1 ChatService.java
- **Modelo:** `gemini-2.5-flash` (Google Generative Language API)
- **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- **Contexto inyectado:**
  - Nombre de la tienda, dirección, WhatsApp
  - Inventario actual (solo productos con stock > 0)
  - Reglas: no inventar precios, hablar en español argentino, ser breve
  - **Plan Canje:** Ofrecemos canje de celulares usados. Solo válido en Mendoza (Zona Este). Cliente va a tienda o dueño va a domicilio (con costo de envío).

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

## 9. 📱 Integración WhatsApp

### 9.1 WhatsAppService.java (Twilio)
- **Librería:** Twilio SDK v10.0.0
- **Configuración:** `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- Si no está configurado, loguea error pero no crashea

### 9.2 WhatsAppController (Webhook Twilio)
- `POST /api/webhook/whatsapp` — Recibe mensajes entrantes de Twilio
- Formato: `application/x-www-form-urlencoded` con params `From` y `Body`
- Procesa mensaje de forma asíncrona (en un `new Thread`) para no bloquear a Twilio
- Pasa el mensaje a `ChatService` (Gemini) y responde automáticamente

### 9.3 WhatsAppButton (Frontend)
- Botón flotante verde `#25D366` en esquina inferior derecha
- Carga número dinámico desde `/api/configuracion`
- Abre `https://wa.me/{numero}?text={mensaje}` en nueva pestaña

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
- `PUT /api/configuracion` — ADMIN

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
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=***
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=***
```

---

## 13. 🌓 Tema Oscuro / Claro

### 13.1 Implementación
- CSS custom properties en `globals.css` con `:root` (light) y `.dark` (dark)
- Colores Starbucks-inspired: verde `#00704A` como primary
- Toggle en Navbar con iconos Sun/Moon
- Persistencia en `localStorage` key `"theme"`
- Detecta `prefers-color-scheme` si no hay preferencia guardada

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
# Base de datos
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/mi_base_local}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD:root}

# JWT
jwt.secret=${JWT_SECRET:}
jwt.expiration=${JWT_EXPIRATION:86400000}

# CORS
app.cors.allowed-origins=${CORS_ORIGINS:http://localhost:3000}

# MercadoPago
mercadopago.access-token=${MP_ACCESS_TOKEN:}
mercadopago.public-key=${MP_PUBLIC_KEY:}

# Mail
spring.mail.username=${MAIL_USERNAME:}
spring.mail.password=${MAIL_PASSWORD:}

# APIs externas
gemini.api.key=${GEMINI_API_KEY:}
twilio.account-sid=${TWILIO_ACCOUNT_SID:}
twilio.auth-token=${TWILIO_AUTH_TOKEN:}
twilio.phone-number=${TWILIO_PHONE_NUMBER:}
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8081
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=***
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=***
```

---

## 15. 🚀 Cómo Ejecutar el Proyecto

### Backend
```bash
cd backend
./mvnw spring-boot:run
# o en Windows:
mvnw.cmd spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Base de datos
- Requiere PostgreSQL local o configurar `DB_URL` apuntando a Supabase
- Las tablas se crean automáticamente (`spring.jpa.hibernate.ddl-auto=update`)

---

## 16. 📁 Estructura de Archivos Clave

```
backend/
├── src/main/java/com/tiendacelulares/backend/
│   ├── BackendApplication.java          # @EnableAsync
│   ├── controller/
│   │   ├── AuthController.java          # Registro/login
│   │   ├── ProductoController.java      # CRUD productos
│   │   ├── OrdenController.java         # Crear orden + pagar + estado
│   │   ├── CatalogoController.java      # Marcas, modelos, colores
│   │   ├── VentaFisicaController.java   # POS tienda
│   │   ├── ReporteController.java       # Resumen, stock, ventas
│   │   ├── ChatController.java          # Gemini chatbot
│   │   ├── WhatsAppController.java      # Webhook Twilio
│   │   ├── WebhookController.java       # Notificaciones MP
│   │   ├── ConfiguracionTiendaController.java
│   │   └── GlobalExceptionHandler.java  # Manejo centralizado errores
│   ├── service/
│   │   ├── ProductoService.java         # Borrado lógico
│   │   ├── OrdenService.java            # Stock + email async
│   │   ├── MercadoPagoService.java      # Preferencias + webhook
│   │   ├── VentaFisicaService.java      # Orden ENTREGADA directa
│   │   ├── CatalogoService.java         # Catálogo hardcodeado
│   │   ├── ChatService.java             # Gemini API
│   │   ├── WhatsAppService.java         # Twilio
│   │   ├── EmailService.java            # HTML emails
│   │   └── ConfiguracionTiendaService.java
│   ├── security/
│   │   ├── JwtUtil.java                 # Generar/validar tokens
│   │   ├── JwtFilter.java               # Filtro de requests
│   │   └── SecurityConfig.java          # Rutas y CORS
│   ├── model/                           # Entidades JPA
│   ├── dto/                             # Request/Response DTOs
│   └── repository/                      # JPA Repositories
└── src/main/resources/application.properties

frontend/
├── app/                                 # App Router de Next.js
│   ├── page.tsx                         # Home con hero y destacados
│   ├── productos/page.tsx               # Catálogo con filtros
│   ├── productos/[id]/page.tsx          # Detalle de producto
│   ├── carrito/page.tsx                 # Carrito + sugerencias
│   ├── checkout/page.tsx                # Checkout con MP
│   ├── login/page.tsx                   # Login
│   ├── registro/page.tsx                # Registro
│   ├── dashboard/page.tsx               # Panel admin
│   ├── dashboard/ventas/page.tsx        # POS físico
│   ├── dashboard/reportes/page.tsx      # Reportes
│   └── ...                              # Otras páginas
├── components/
│   ├── layout/Navbar.tsx                # Nav con theme toggle
│   └── ui/
│       ├── ChatWidget.tsx               # Chatbot flotante
│       ├── WhatsAppButton.tsx           # WA flotante
│       └── ImageUploader.tsx            # Cloudinary upload
├── context/
│   ├── AuthContext.tsx                  # Estado auth global
│   ├── CartContext.tsx                  # Estado carrito
│   └── ToastContext.tsx                 # Notificaciones toast
├── lib/api.ts                           # Axios config + APIs
└── types/index.ts                       # TypeScript interfaces

whatsapp-bot/
├── package.json                         # whatsapp-web.js
└── (MVP - aún sin código fuente principal)
```

---

## 17. ✅ Resumen de Features Funcionales

| Feature | Estado | Notas |
|---------|--------|-------|
| Registro/Login con JWT | ✅ Funciona | Roles ADMIN/CLIENTE |
| CRUD Productos | ✅ Funciona | Borrado lógico |
| Carrito con localStorage | ✅ Funciona | Límite de stock |
| Checkout con MP | ✅ Funciona | Sandbox |
| Webhook MP | ✅ Funciona | Actualiza estado automáticamente |
| Emails automáticos | ✅ Funciona | HTML con branding |
| Chatbot IA (Gemini) | ✅ Funciona | Contexto de inventario real |
| WhatsApp (Twilio) | ✅ Funciona | Webhook + respuestas IA |
| Ventas físicas (POS) | ✅ Funciona | Descuenta stock |
| Dashboard con gráficos | ✅ Funciona | Recharts |
| Reportes | ✅ Funciona | Stock bajo, ventas por estado |
| Configuración tienda | ✅ Funciona | Persiste en BD |
| Subida de imágenes | ✅ Funciona | Cloudinary |
| Tema oscuro/claro | ✅ Funciona | CSS variables + localStorage |
| Cross-selling | ✅ Funciona | Sugiere accesorios en carrito |
| Exportar CSV | ✅ Funciona | Órdenes |
| Filtros de productos | ✅ Funciona | Por tipo, marca, condición, precio |

---

> **Última actualización:** Basado en el código actual del repositorio.
> **Nota:** Mantener este archivo actualizado ante cualquier cambio significativo en la lógica de negocio.
