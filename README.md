# TechPhone Store

Plataforma de ecommerce fullstack diseñada como producto base white-label para tiendas de tecnología. Unifica la gestión de la tienda física y la virtual en un solo sistema: stock, ventas presenciales, pedidos online, reportes y atención al cliente en tiempo real.

**Demo:** https://tienda-celulares-woad.vercel.app/

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 16.2 · React 19 · Tailwind CSS 4 |
| Backend | Spring Boot 4 · Java 21 |
| Base de datos | PostgreSQL |
| Auth | JWT (jjwt 0.12.6) · Roles ADMIN / CLIENTE |
| Pagos | MercadoPago SDK |
| IA | Google Gemini 2.5 Flash |
| Imágenes | Cloudinary |
| Email | Spring Mail · Gmail SMTP |
| Deploy | Vercel (frontend) · Railway (backend) |

---

## Features

### Tienda pública
- Catálogo con filtros por tipo, marca, condición y precio
- Búsqueda en tiempo real
- Detalle de producto con galería de imágenes
- Carrito persistente (localStorage) con validación de stock
- Cross-selling: sugiere accesorios compatibles en el carrito
- Checkout con integración real de MercadoPago
- Páginas de resultado: compra exitosa / fallida / pendiente
- Historial de pedidos para usuarios registrados

### Panel de administración (`/dashboard`)
- Stats: facturación, ganancia neta, órdenes totales, órdenes del día
- Gráfico de ventas del mes (día por día) y ventas anuales (mes por mes)
- Top 5 productos más vendidos
- Alertas de stock bajo (≤ 2 unidades en rojo, ≤ 5 en naranja)
- CRUD completo de celulares y accesorios con subida de imágenes
- Gestión de órdenes con cambio de estado y exportación a CSV
- POS para ventas físicas en tienda
- Reportes de ventas por estado
- Lista de clientes con estadísticas de compra
- Configuración de tienda: nombre, WhatsApp, dirección, Instagram, mensaje de cabecera

### Autenticación
- Registro y login con JWT
- Roles ADMIN y CLIENTE
- Rutas protegidas por rol en backend y frontend

### Chatbot IA
- Widget flotante en todas las páginas
- Integración con Google Gemini
- Contexto inyectado: inventario real, datos de la tienda, política de canje
- Historial de conversación por sesión

### Emails automáticos
- Confirmación de orden (HTML con branding)
- Notificación de cambio de estado

### Otros
- Tema oscuro / claro con persistencia en localStorage
- Botón directo a WhatsApp con número dinámico
- Webhook de MercadoPago para actualización automática de estados de pago
- Rate limiting en endpoints críticos
- Borrado lógico de productos (nunca se elimina de BD)
- Políticas de privacidad, términos y devoluciones

---

## Estructura del proyecto

```
tienda-celulares/
├── backend/          # Spring Boot API REST
├── frontend/         # Next.js App Router
└── whatsapp-bot/     # Bot de WhatsApp (en desarrollo — integración vía n8n)
```

---

## Instalación local

### Requisitos
- Java 21+
- Node.js 18+
- PostgreSQL 14+

### Backend

```bash
cd backend
cp src/main/resources/application.properties src/main/resources/application-secrets.properties
# Completar variables en application-secrets.properties
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
# Completar variables en .env.local
npm install
npm run dev
```

---

## Variables de entorno

### Backend (`application-secrets.properties`)

```properties
DB_URL=jdbc:postgresql://localhost:5432/tu_base
DB_USERNAME=postgres
DB_PASSWORD=tu_password
JWT_SECRET=clave_larga_aleatoria_minimo_32_caracteres
CORS_ORIGINS=http://localhost:3000
MP_ACCESS_TOKEN=       # MercadoPago access token
MP_PUBLIC_KEY=         # MercadoPago public key
GEMINI_API_KEY=        # Google AI Studio
MAIL_USERNAME=         # Gmail
MAIL_PASSWORD=         # App password de Gmail
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8081
NEXT_PUBLIC_MP_PUBLIC_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

---

## Endpoints principales

| Método | Ruta | Auth |
|--------|------|------|
| POST | `/api/auth/login` | Público |
| POST | `/api/auth/registro` | Público |
| GET | `/api/productos` | Público |
| GET | `/api/configuracion` | Público |
| POST | `/api/chat` | Público |
| POST | `/api/ordenes` | CLIENTE |
| GET | `/api/ordenes/mis-ordenes` | CLIENTE |
| POST | `/api/ordenes/{id}/pagar` | CLIENTE |
| GET | `/api/ordenes` | ADMIN |
| POST | `/api/productos` | ADMIN |
| PUT | `/api/productos/{id}` | ADMIN |
| POST | `/api/ventas-fisicas` | ADMIN |
| GET | `/api/reportes/resumen` | ADMIN |
| GET | `/api/admin/clientes` | ADMIN |
| PUT | `/api/configuracion` | ADMIN |
| POST | `/api/webhook/mercadopago` | Público |

---

## Deploy

El proyecto está configurado para deploy en dos servicios separados:

- **Frontend → Vercel:** Root Directory `frontend`
- **Backend → Railway:** Root Directory `backend` · La variable `PORT` es inyectada automáticamente

Documentación completa de arquitectura y lógica de negocio en [CLAUDE.md](CLAUDE.md).
