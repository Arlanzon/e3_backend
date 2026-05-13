# E3 Backend

Backend REST para una plataforma gastronomica local enfocada en descubrimiento,
gestion y reservaciones de restaurantes. Esta construido con Next.js App Router,
Prisma, PostgreSQL en Neon, autenticacion JWT, validacion con Zod y documentacion
OpenAPI/Swagger.

## Stack

- Next.js 16 con App Router y Route Handlers.
- TypeScript en modo estricto.
- Prisma 7 con PostgreSQL.
- Neon como proveedor de base de datos serverless.
- JWT con `jose`.
- Zod para validacion de entrada.
- Swagger/OpenAPI generado desde comentarios JSDoc en `app/api/v1`.
- Arquitectura por feature: Route -> Service -> Repository -> Prisma.

## Arquitectura

```text
app/api/v1/**/route.ts
  -> src/features/<module>/<module>.service.ts
    -> src/features/<module>/<module>.repository.ts
      -> src/lib/prisma.ts
        -> PostgreSQL / Neon
```

Responsabilidades principales:

- `Route`: parsea request, valida JSON/query params con Zod, exige autenticacion cuando aplica y devuelve respuestas HTTP.
- `Service`: concentra reglas de negocio, permisos, estados validos y errores de dominio con `AppError`.
- `Repository`: encapsula consultas y mutaciones Prisma.
- `Prisma`: cliente compartido configurado con `@prisma/adapter-pg` y `pg`.

## Modulos implementados

- `auth`: registro, login, claims del token actual.
- `users`: perfil autenticado y base para administracion de usuarios.
- `restaurants`: listado, detalle, creacion y actualizacion de restaurantes.
- `business hours`: horarios semanales por restaurante.
- `closures`: cierres especiales por fecha.
- `photos`: galeria de fotos por restaurante.
- `reservations`: creacion, listado, detalle y flujo de estados.
- `reviews`: creacion, edicion y listado de resenas visibles.
- `review responses`: respuesta del restaurante a una resena y edicion posterior.

## Roles y permisos

Roles globales en `UserRole`:

- `CUSTOMER`: usuario comensal. Puede registrarse, iniciar sesion, consultar restaurantes, crear reservaciones, cancelar sus reservaciones confirmadas, crear resenas sobre reservaciones completadas y editar sus propias resenas dentro de la ventana permitida.
- `OWNER`: propietario. Puede crear restaurantes y operar restaurantes donde tenga membership activo.
- `MANAGER`: encargado. Puede operar restaurantes donde tenga membership activo.
- `ADMIN`: rol interno. Actualmente tiene acceso al endpoint base de listado de usuarios.

Permisos por restaurante en `UserRestaurant`:

- `permissionRole`: `OWNER` o `MANAGER`.
- `active`: debe ser `true` para operar recursos del restaurante.

Reglas relevantes:

- Las rutas protegidas usan `Authorization: Bearer <token>`.
- La creacion y modificacion de horarios, cierres, fotos, datos del restaurante y reservaciones del restaurante requiere membership activo.
- Confirmar, rechazar y completar reservaciones requiere membership activo en el restaurante.
- Responder resenas requiere rol global `OWNER` o `MANAGER` y membership activo en el restaurante.
- Un `CUSTOMER` no puede responder resenas.

## Variables de entorno

Crea un archivo `.env` tomando como base `.env.example`.

```env
DATABASE_URL="postgresql://usuario:password@host/dbname?sslmode=require"
DIRECT_URL="postgresql://usuario:password@host/dbname?sslmode=require"
JWT_SECRET="cambia-este-secreto"
JWT_EXPIRES_IN="30m"
```

Notas:

- `DATABASE_URL` es requerida por Prisma y por `src/lib/prisma.ts`.
- `DIRECT_URL` existe en `.env.example` y puede usarse para flujos de base de datos que requieran conexion directa.
- `JWT_SECRET` es requerido al iniciar la app.
- `JWT_EXPIRES_IN` es opcional; si no se define, el token expira en `30m`.

## Instalacion

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Servidor local:

```text
http://localhost:3000
```

Base de la API:

```text
http://localhost:3000/api/v1
```

## Scripts

```bash
npm run dev      # servidor de desarrollo Next.js
npm run build    # build de produccion
npm run start    # iniciar build de produccion
npm run lint     # ejecutar ESLint
```

Comandos Prisma utiles:

```bash
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

## Swagger

La especificacion OpenAPI se genera desde los comentarios `@swagger` dentro de
`app/api/v1/**/*.ts`.

- JSON OpenAPI: `GET /api/v1/docs`
- Swagger UI: `GET /api/v1/docs/ui`

En Swagger UI se puede usar el boton de autorizacion con el token devuelto por
`POST /api/v1/auth/login`.

## Endpoints principales

Los endpoints listados existen en `app/api/v1`.

### Auth

| Metodo | Ruta | Descripcion | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Registrar usuario `CUSTOMER` | No |
| `POST` | `/api/v1/auth/login` | Iniciar sesion y obtener JWT | No |
| `GET` | `/api/v1/auth/me` | Obtener claims del token actual | Si |

### Users

| Metodo | Ruta | Descripcion | Auth |
| --- | --- | --- | --- |
| `GET` | `/api/v1/users/me` | Obtener perfil desde base de datos | Si |
| `GET` | `/api/v1/users` | Listado base de usuarios, reservado a `ADMIN` | Si |

### Restaurants

| Metodo | Ruta | Descripcion | Auth |
| --- | --- | --- | --- |
| `GET` | `/api/v1/restaurants` | Listar restaurantes con filtros y paginacion | No |
| `POST` | `/api/v1/restaurants` | Crear restaurante | Si |
| `GET` | `/api/v1/restaurants/{id}` | Obtener restaurante por ID | No |
| `PATCH` | `/api/v1/restaurants/{id}` | Actualizar restaurante | Si |

### Business Hours

| Metodo | Ruta | Descripcion | Auth |
| --- | --- | --- | --- |
| `GET` | `/api/v1/restaurants/{id}/hours` | Obtener horarios semanales | No |
| `PUT` | `/api/v1/restaurants/{id}/hours` | Reemplazar horarios semanales | Si |

### Closures

| Metodo | Ruta | Descripcion | Auth |
| --- | --- | --- | --- |
| `GET` | `/api/v1/restaurants/{id}/closures` | Listar cierres especiales | Si |
| `POST` | `/api/v1/restaurants/{id}/closures` | Crear cierre especial | Si |
| `DELETE` | `/api/v1/restaurants/{id}/closures/{closureId}` | Eliminar cierre especial | Si |

### Photos

| Metodo | Ruta | Descripcion | Auth |
| --- | --- | --- | --- |
| `GET` | `/api/v1/restaurants/{id}/photos` | Listar fotos del restaurante | No |
| `POST` | `/api/v1/restaurants/{id}/photos` | Agregar foto | Si |
| `PATCH` | `/api/v1/restaurants/{id}/photos/{photoId}` | Actualizar metadata de foto | Si |
| `DELETE` | `/api/v1/restaurants/{id}/photos/{photoId}` | Eliminar foto | Si |

### Reservations

| Metodo | Ruta | Descripcion | Auth |
| --- | --- | --- | --- |
| `GET` | `/api/v1/reservations` | Listar mis reservaciones | Si |
| `POST` | `/api/v1/reservations` | Crear reservacion en estado `PENDING` | Si |
| `GET` | `/api/v1/reservations/{id}` | Ver detalle de reservacion | Si |
| `PATCH` | `/api/v1/reservations/{id}/cancel` | Cancelar reservacion confirmada propia | Si |
| `PATCH` | `/api/v1/reservations/{id}/confirm` | Confirmar reservacion pendiente | Si |
| `PATCH` | `/api/v1/reservations/{id}/reject` | Rechazar reservacion pendiente | Si |
| `PATCH` | `/api/v1/reservations/{id}/complete` | Marcar reservacion confirmada como completada | Si |
| `GET` | `/api/v1/restaurants/{id}/reservations` | Listar reservaciones de un restaurante | Si |

### Reviews

| Metodo | Ruta | Descripcion | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/v1/reviews` | Crear resena sobre una reservacion completada | Si |
| `PATCH` | `/api/v1/reviews/{id}` | Editar resena propia dentro de la ventana permitida | Si |
| `GET` | `/api/v1/restaurants/{id}/reviews` | Listar resenas visibles de un restaurante | No |

### Review Responses

| Metodo | Ruta | Descripcion | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/v1/reviews/{id}/response` | Responder una resena como `OWNER` o `MANAGER` | Si |
| `PATCH` | `/api/v1/reviews/{id}/response` | Editar respuesta existente | Si |

### Docs

| Metodo | Ruta | Descripcion | Auth |
| --- | --- | --- | --- |
| `GET` | `/api/v1/docs` | Especificacion OpenAPI en JSON | No |
| `GET` | `/api/v1/docs/ui` | Swagger UI | No |

## Flujo de reservaciones

Estados implementados:

```text
PENDING -> CONFIRMED -> COMPLETED
PENDING -> REJECTED
CONFIRMED -> CANCELLED
```

Reglas principales:

- La reservacion valida restaurante activo, horarios, cierres especiales, anticipacion minima/maxima y capacidad reservable.
- La confirmacion revalida disponibilidad antes de cambiar estado.
- La cancelacion solo la realiza el cliente propietario de la reservacion y requiere al menos 2 horas de anticipacion.
- El restaurante puede consultar y gestionar reservaciones si el usuario tiene membership activo.

## Flujo de resenas

- Una resena se crea solo sobre una reservacion completada.
- Solo el usuario propietario de la reservacion puede crear la resena.
- Existe una ventana de 30 dias para crear resena.
- La resena puede editarse durante 7 dias si sigue visible.
- Solo existe una resena por reservacion.
- Solo existe una respuesta por resena.
- La respuesta de restaurante requiere `OWNER` o `MANAGER` global y membership activo.

## Estructura del proyecto

```text
app/api/v1
  auth/
  docs/
  reservations/
  restaurants/
  reviews/
  users/

src/features
  reservations/
  restaurants/
  reviews/
  users/

src/lib
  auth.ts
  errors.ts
  handle-error.ts
  jwt.ts
  prisma.ts
  swagger.ts

prisma
  schema.prisma
  migrations/
```

## Roadmap post-MVP

- Completar administracion de usuarios para `ADMIN`.
- Moderacion de resenas, reportes y estados `PENDING_MODERATION` / `HIDDEN`.
- Invitacion y gestion formal de staff por restaurante.
- Subida real de imagenes a un storage externo en vez de registrar solo URL.
- Notificaciones para confirmacion, rechazo, cancelacion y recordatorios.
- Expiracion automatica de reservaciones pendientes.
- Tests automatizados por capa: servicios, repositorios y rutas criticas.
- Observabilidad: logs estructurados, tracing y metricas de errores.
- Paginacion, filtros y ordenamiento mas extensos para paneles operativos.
- Hardening de seguridad: rate limiting, rotacion de secretos y politicas de CORS.
