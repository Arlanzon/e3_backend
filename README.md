# E3 Backend

Backend REST para una plataforma gastronomica local enfocada en descubrimiento,
gestion, reservaciones y resenas de restaurantes. El proyecto usa Next.js App
Router como capa HTTP, TypeScript estricto, Prisma 7, PostgreSQL y autenticacion
JWT.

## Tipo de Arquitectura

El sistema esta implementado como un monolito modular. No utiliza una
arquitectura de microservicios: las capacidades de negocio conviven en una sola
aplicacion Next.js, desplegable como una unidad, pero estan separadas por
modulos funcionales bajo `src/features`.

La organizacion interna sigue una separacion por capas:

```text
Route Handler -> Schema -> Service -> Repository -> Prisma -> PostgreSQL
```

Esta estructura permite mantener limites claros entre API HTTP, validacion,
reglas de negocio y persistencia, sin introducir comunicacion entre servicios
independientes.

## Stack de Desarrollo

| Capa | Tecnologia | Uso en el proyecto |
| --- | --- | --- |
| Frontend | Next.js 16 App Router | Estructura base de aplicacion y rutas bajo `app`. |
| Frontend | React 19 | Base de UI para paginas y Swagger UI embebido. |
| Frontend | Estado local y consumo HTTP | Las vistas consumen Route Handlers internos bajo `/api/v1`. |
| Frontend | Tailwind CSS 4 y PostCSS | Estilos globales y pipeline CSS del proyecto. |
| Backend | Node.js | Runtime de la aplicacion Next.js. |
| Backend | Next.js Route Handlers | API REST versionada en `app/api/v1`. |
| Backend | TypeScript 6 | Tipado estricto para rutas, servicios, repositorios y utilidades. |
| Backend | Prisma 7 | ORM y cliente de acceso a datos. |
| Backend | Zod 4 | Validacion de payloads, queries y DTOs de entrada. |
| Backend | JWT con `jose` | Firma, verificacion y extraccion de tokens Bearer. |
| Backend | `bcryptjs` | Hash y comparacion de contrasenas. |
| Backend | Swagger/OpenAPI | Documentacion generada desde anotaciones JSDoc en rutas. |
| Base de Datos y DevOps | PostgreSQL | Motor relacional definido en `prisma/schema.prisma`. |
| Base de Datos y DevOps | Neon, `@prisma/adapter-neon`, `@prisma/adapter-pg`, `pg` | Conectividad serverless y adaptadores Prisma para PostgreSQL. |
| Base de Datos y DevOps | Prisma Migrate y Prisma Generate | Evolucion del schema y generacion del cliente. |
| Base de Datos y DevOps | Dockerfile | Empaquetado para ejecucion en contenedor. |
| Base de Datos y DevOps | Vitest | Suite de pruebas unitarias e integracion. |
| Base de Datos y DevOps | ESLint | Analisis estatico del codigo. |
| Base de Datos y DevOps | Vercel compatible | Build con `npm run build`, generacion Swagger y Next.js. |

## Diagrama de Arquitectura

```mermaid
graph TD
  subgraph Client["Capa de Cliente / Frontend"]
    UI["Paginas y componentes React"]
    SwaggerUI["Swagger UI"]
    State["Estado local de UI"]
    APIClient["Consumo HTTP /api/v1"]
  end

  subgraph Server["Capa de Servidor / Backend"]
    Routes["Next.js Route Handlers<br/>app/api/v1/**/route.ts"]
    Validation["Validacion Zod<br/>schemas por feature"]
    Auth["Auth Middleware<br/>requireAuth / requireRole"]
    Services["Servicios de dominio<br/>reglas de negocio"]
    Repositories["Repositorios<br/>consultas y mutaciones"]
    PrismaClient["Prisma Client<br/>src/lib/prisma.ts"]
    ErrorHandling["Manejo de errores<br/>AppError / handleError"]
    SwaggerGen["Generador OpenAPI<br/>swagger-jsdoc"]
  end

  subgraph External["Capas Externas"]
    PostgreSQL[("PostgreSQL / Neon")]
    JWT["JWT Bearer<br/>jose"]
    Passwords["Password hashing<br/>bcryptjs"]
  end

  UI --> State
  UI --> APIClient
  SwaggerUI --> APIClient
  APIClient --> Routes
  Routes --> Validation
  Routes --> Auth
  Routes --> Services
  Routes --> ErrorHandling
  Auth --> JWT
  Services --> Repositories
  Services --> Passwords
  Repositories --> PrismaClient
  PrismaClient --> PostgreSQL
  SwaggerGen --> SwaggerUI
  Routes --> SwaggerGen
```

## Modelo Entidad-Relacion

```mermaid
erDiagram
  USER {
    String id PK
    String name
    String email UK
    String passwordHash
    UserRole role
    Boolean active
    String photoUrl
    DateTime createdAt
    DateTime updatedAt
  }

  USER_RESTAURANT {
    String id PK
    String userId FK
    String restaurantId FK
    StaffRole permissionRole
    Boolean active
    DateTime createdAt
  }

  RESTAURANT {
    String id PK
    String name
    String slug UK
    String description
    String cuisineType
    String address
    Decimal lat
    Decimal lng
    String phone
    Int capacity
    Decimal reservationCapacityFactor
    Int reservationDurationMin
    Int minAdvanceHours
    Int maxAdvanceDays
    String timezone
    RestaurantStatus status
    Decimal ratingAvg
    Int ratingCount
    DateTime createdAt
    DateTime updatedAt
  }

  BUSINESS_HOUR {
    String id PK
    String restaurantId FK
    DayOfWeek dayOfWeek
    Boolean isClosed
    Int openTimeMin
    Int closeTimeMin
  }

  SPECIAL_CLOSURE {
    String id PK
    String restaurantId FK
    DateTime date
    Boolean isClosed
    Int openTimeMin
    Int closeTimeMin
    String reason
    DateTime createdAt
  }

  RESTAURANT_PHOTO {
    String id PK
    String restaurantId FK
    String url
    Boolean isPrimary
    Int order
    DateTime createdAt
  }

  RESERVATION {
    String id PK
    String userId FK
    String restaurantId FK
    DateTime date
    Int timeMin
    Int numPersons
    ReservationStatus status
    String notes
    String rejectionReason
    Int snapshotCapacityTotal
    Decimal snapshotCapacityFactor
    Int snapshotDurationMin
    DateTime confirmedAt
    DateTime rejectedAt
    DateTime cancelledAt
    DateTime completedAt
    DateTime expiredAt
    DateTime createdAt
    DateTime updatedAt
  }

  REVIEW {
    String id PK
    String reservationId FK
    String userId FK
    String restaurantId FK
    Int rating
    String comment
    ReviewStatus status
    String hiddenReason
    String hiddenBy FK
    DateTime hiddenAt
    DateTime editableUntil
    DateTime createdAt
    DateTime updatedAt
  }

  REVIEW_RESPONSE {
    String id PK
    String reviewId FK
    String responderId FK
    String restaurantId FK
    String content
    Boolean isEdited
    DateTime createdAt
    DateTime updatedAt
  }

  REVIEW_REPORT {
    String id PK
    String reviewId FK
    String userId FK
    String reason
    DateTime createdAt
  }

  USER ||--o{ USER_RESTAURANT : has_staff_membership
  RESTAURANT ||--o{ USER_RESTAURANT : has_staff
  USER ||--o{ RESERVATION : creates
  RESTAURANT ||--o{ RESERVATION : receives
  RESTAURANT ||--o{ BUSINESS_HOUR : defines
  RESTAURANT ||--o{ SPECIAL_CLOSURE : defines
  RESTAURANT ||--o{ RESTAURANT_PHOTO : owns
  USER ||--o{ REVIEW : writes
  RESTAURANT ||--o{ REVIEW : receives
  RESERVATION ||--o| REVIEW : produces
  REVIEW ||--o| REVIEW_RESPONSE : has_response
  USER ||--o{ REVIEW_RESPONSE : responds
  RESTAURANT ||--o{ REVIEW_RESPONSE : owns_response
  REVIEW ||--o{ REVIEW_REPORT : receives_report
  USER ||--o{ REVIEW_REPORT : reports
  USER ||--o{ REVIEW : hides
```

## Modulos

| Modulo | Responsabilidad |
| --- | --- |
| `auth` | Registro, login y claims del usuario autenticado. |
| `users` | Perfil autenticado y endpoint base de administracion. |
| `restaurants` | Listado, detalle, creacion, actualizacion y configuracion operativa. |
| `business hours` | Horarios semanales por restaurante. |
| `closures` | Cierres especiales por fecha. |
| `photos` | Galeria y metadata de fotos del restaurante. |
| `reservations` | Creacion, consulta y flujo de estados de reservaciones. |
| `reviews` | Creacion, edicion y consulta de resenas visibles. |
| `review responses` | Respuesta del restaurante a una resena. |
| `docs` | OpenAPI JSON y Swagger UI. |

## Flujo de Capas

```text
app/api/v1/**/route.ts
  -> src/features/<module>/<module>.schema.ts
  -> src/features/<module>/<module>.service.ts
  -> src/features/<module>/<module>.repository.ts
  -> src/lib/prisma.ts
  -> PostgreSQL
```

Responsabilidades:

- `Route Handler`: recibe HTTP, parsea JSON/query params, ejecuta validacion, aplica autenticacion y serializa respuestas.
- `Schema`: define contratos de entrada con Zod y DTOs derivados.
- `Service`: concentra reglas de negocio, permisos, transiciones de estado y errores de dominio.
- `Repository`: encapsula operaciones Prisma sin mezclar reglas de negocio.
- `Prisma Client`: adapter hacia PostgreSQL y Neon.

## Roles y Estados

| Enum | Valores |
| --- | --- |
| `UserRole` | `CUSTOMER`, `OWNER`, `MANAGER`, `ADMIN` |
| `StaffRole` | `OWNER`, `MANAGER` |
| `RestaurantStatus` | `ACTIVE`, `INACTIVE`, `SUSPENDED` |
| `DayOfWeek` | `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`, `SUNDAY` |
| `ReservationStatus` | `PENDING`, `CONFIRMED`, `REJECTED`, `CANCELLED`, `COMPLETED`, `EXPIRED` |
| `ReviewStatus` | `VISIBLE`, `PENDING_MODERATION`, `HIDDEN` |

## Endpoints Principales

| Recurso | Rutas principales |
| --- | --- |
| Auth | `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me` |
| Users | `GET /api/v1/users/me`, `GET /api/v1/users` |
| Restaurants | `GET /api/v1/restaurants`, `POST /api/v1/restaurants`, `GET /api/v1/restaurants/{id}`, `PATCH /api/v1/restaurants/{id}` |
| Business Hours | `GET /api/v1/restaurants/{id}/hours`, `PUT /api/v1/restaurants/{id}/hours` |
| Closures | `GET /api/v1/restaurants/{id}/closures`, `POST /api/v1/restaurants/{id}/closures`, `DELETE /api/v1/restaurants/{id}/closures/{closureId}` |
| Photos | `GET /api/v1/restaurants/{id}/photos`, `POST /api/v1/restaurants/{id}/photos`, `PATCH /api/v1/restaurants/{id}/photos/{photoId}`, `DELETE /api/v1/restaurants/{id}/photos/{photoId}` |
| Reservations | `GET /api/v1/reservations`, `POST /api/v1/reservations`, `GET /api/v1/reservations/{id}`, `PATCH /api/v1/reservations/{id}/confirm`, `PATCH /api/v1/reservations/{id}/reject`, `PATCH /api/v1/reservations/{id}/cancel`, `PATCH /api/v1/reservations/{id}/complete` |
| Restaurant Reservations | `GET /api/v1/restaurants/{id}/reservations` |
| Reviews | `POST /api/v1/reviews`, `PATCH /api/v1/reviews/{id}`, `GET /api/v1/restaurants/{id}/reviews` |
| Review Responses | `POST /api/v1/reviews/{id}/response`, `PATCH /api/v1/reviews/{id}/response` |
| Docs | `GET /api/v1/docs`, `GET /api/v1/docs/ui` |

## Variables de Entorno

Crear `.env` a partir de `.env.example`.

```env
DATABASE_URL="postgresql://usuario:password@host/dbname?sslmode=require"
DIRECT_URL="postgresql://usuario:password@host/dbname?sslmode=require"
JWT_SECRET="cambia-este-secreto"
JWT_EXPIRES_IN="30m"
```

## Instalacion y Ejecucion

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

| Script | Descripcion |
| --- | --- |
| `npm run dev` | Inicia Next.js en desarrollo. |
| `npm run generate:swagger` | Genera `public/openapi.json` desde anotaciones Swagger. |
| `npm run build` | Genera Swagger y ejecuta build de produccion Next.js. |
| `npm run start` | Inicia el servidor con el build de produccion. |
| `npm run lint` | Ejecuta ESLint. |
| `npm test` | Ejecuta Vitest en modo run. |
| `npm run test:watch` | Ejecuta Vitest en modo watch. |
| `npm run test:coverage` | Ejecuta pruebas con reporte de cobertura. |

## Documentacion OpenAPI

- JSON OpenAPI: `GET /api/v1/docs`
- Swagger UI: `GET /api/v1/docs/ui`

Swagger UI permite usar el token emitido por `POST /api/v1/auth/login` como
`Authorization: Bearer <token>`.
