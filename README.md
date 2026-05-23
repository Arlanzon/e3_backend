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

## Patrones de Diseño Utilizados

La arquitectura actual aplica patrones orientados a separar responsabilidades
entre entrada HTTP, validacion, reglas de negocio, acceso a datos,
autenticacion y manejo de errores. Los patrones documentados a continuacion
corresponden a implementaciones existentes en el codigo fuente del proyecto.

| Patron | Categoria | Ubicacion | Problema que resuelve |
| --- | --- | --- | --- |
| Repository Pattern | Arquitectural / Persistencia | `src/features/reservations/reservations.repository.ts`, `src/features/restaurants/restaurants.repository.ts`, `src/features/reviews/reviews.repository.ts`, `src/features/users/users.repository.ts` | Aisla las consultas y mutaciones Prisma para que las capas superiores no dependan directamente del ORM. |
| Service Layer Pattern | Arquitectural / Dominio | `src/features/reservations/reservations.service.ts`, `src/features/restaurants/restaurants.service.ts`, `src/features/reviews/reviews.service.ts`, `src/features/users/users.service.ts` | Centraliza reglas de negocio, permisos, validaciones de estado y coordinacion entre repositorios. |
| Singleton Pattern | Creacional | `src/lib/prisma.ts` | Reutiliza una unica instancia de `PrismaClient` durante el ciclo de vida de la aplicacion, especialmente en desarrollo con recargas frecuentes. |
| Schema Validation Pattern | Validacion / Contratos | `src/features/reservations/reservations.schema.ts`, `src/features/restaurants/restaurants.schema.ts`, `src/features/restaurants/closures.schema.ts`, `src/features/restaurants/photos.schema.ts`, `src/features/reviews/reviews.schema.ts`, `src/features/users/users.schema.ts` | Valida payloads, parametros y DTOs antes de ejecutar reglas de negocio o persistencia. |
| Error Object Pattern | Manejo de errores | `src/lib/errors.ts`, `src/lib/handle-error.ts` | Representa errores de dominio con codigo, mensaje y estado HTTP para responder de forma consistente. |
| Middleware Pattern | Seguridad / Control de acceso | `src/lib/auth.ts` | Encapsula autenticacion y autorizacion mediante `requireAuth` y `requireRole` antes de continuar con la ejecucion protegida. |

### Repository Pattern

El proyecto usa repositorios por modulo bajo `src/features/*/*.repository.ts`.
Estos archivos encapsulan operaciones de Prisma como creacion, busqueda,
actualizacion y consultas agregadas. La eleccion del patron permite mantener la
capa de servicios enfocada en reglas de negocio, mientras el detalle de acceso
a PostgreSQL queda concentrado en una capa especializada.

### Service Layer Pattern

Los servicios ubicados en `src/features/*/*.service.ts` coordinan los casos de
uso principales del dominio. En esta capa se validan permisos, estados,
duplicados, disponibilidad, ownership y transiciones de flujo antes de llamar a
los repositorios. Se eligio este patron porque la plataforma contiene reglas de
negocio que no deben mezclarse con Route Handlers ni con consultas Prisma.

### Singleton Pattern

`src/lib/prisma.ts` mantiene una instancia reutilizable de `PrismaClient` usando
`globalThis` cuando el entorno no es produccion. Esto evita crear multiples
clientes durante recargas de desarrollo de Next.js y centraliza la configuracion
del adapter `PrismaPg` y el pool de PostgreSQL. Se eligio porque Prisma
recomienda controlar la cantidad de instancias para evitar conexiones
innecesarias a la base de datos.

### Schema Validation Pattern

Los schemas Zod se definen por modulo en `src/features/*/*.schema.ts` y se usan
desde los Route Handlers mediante `safeParse`. Esta validacion previa impide que
datos invalidos lleguen a servicios o repositorios, produce respuestas HTTP 400
predecibles y permite derivar tipos TypeScript con `z.infer`. Se eligio para
mantener contratos explicitos entre la API y el dominio.

### Error Object Pattern

`src/lib/errors.ts` define `AppError` como objeto de error con `code`,
`message` y `statusCode`, mientras `src/lib/handle-error.ts` transforma esos
errores en respuestas JSON uniformes. Los servicios lanzan `AppError` para
casos como credenciales invalidas, recursos inexistentes, conflictos y accesos
prohibidos. Se eligio para evitar respuestas inconsistentes y separar la
decision de dominio de la serializacion HTTP.

### Middleware Pattern

`src/lib/auth.ts` implementa funciones reutilizables de seguridad:
`getAuthUser`, `requireAuth` y `requireRole`. Estas funciones extraen y validan
el JWT Bearer con `jose`, y bloquean la ejecucion lanzando `AppError` cuando el
usuario no esta autenticado o no tiene el rol requerido. Se eligio para aplicar
autenticacion y autorizacion de manera uniforme en los Route Handlers
protegidos.

En conjunto, los patrones confirmados favorecen escalabilidad,
mantenibilidad, separacion de responsabilidades, reutilizacion de componentes
tecnicos y facilidad de testing. Al mantener contratos, reglas de negocio,
persistencia, autenticacion y errores en capas separadas, el sistema puede
crecer por modulos sin acoplar indebidamente la API, el dominio y la base de
datos.

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

## Despliegue en Produccion

El despliegue de produccion esta planteado sobre GitHub, Vercel y Neon
PostgreSQL. El frontend y la API viven dentro del mismo proyecto Next.js y se
despliegan como una sola aplicacion en Vercel, mientras que la base de datos
relacional se mantiene como un servicio administrado en Neon PostgreSQL.

GitHub funciona como repositorio principal del codigo fuente. A partir del
branch `master`, Vercel puede ejecutar despliegues automaticos cuando se
integra una nueva version estable del proyecto. Este flujo permite mantener una
linea clara entre desarrollo, revision y publicacion.

URLs de referencia para produccion:

- URL produccion: `https://TU-APP.vercel.app`
- Swagger: `https://TU-APP.vercel.app/api/v1/docs/ui`

Vercel fue adecuado para este proyecto porque ofrece integracion nativa con
Next.js App Router, configuracion simplificada de build, CI/CD automatico y
previews por Pull Request. Para un MVP, este stack serverless reduce la carga
operativa inicial, facilita publicar cambios incrementales y permite enfocar el
esfuerzo tecnico en las reglas de negocio de la plataforma.

## Infraestructura de la Aplicacion

```mermaid
flowchart LR
  User[Usuario] --> Vercel[Vercel: Next.js App]
  Vercel --> API[API Routes /api/v1]
  API --> Service[Service Layer]
  Service --> Repository[Repository Layer]
  Repository --> Prisma[Prisma ORM]
  Prisma --> Neon[(Neon PostgreSQL)]
  GitHub[GitHub Repository] --> Vercel
```

El frontend corre en Vercel como parte de la aplicacion Next.js. Las paginas y
componentes React se sirven desde el mismo despliegue que contiene las rutas de
API.

El backend tambien corre en Vercel mediante Route Handlers de Next.js bajo
`app/api/v1`. Estas rutas reciben peticiones HTTP, aplican validacion,
autenticacion cuando corresponde y delegan la ejecucion del caso de uso a la
capa de servicios.

La base de datos vive en Neon PostgreSQL. Prisma actua como ORM y como punto de
acceso tipado hacia la persistencia, usando la configuracion definida en
`src/lib/prisma.ts` y `prisma/schema.prisma`.

El flujo de una peticion inicia en el usuario, llega a Vercel, entra por una
ruta `/api/v1`, pasa por validacion y autenticacion, ejecuta reglas de negocio
en la capa de servicios, consulta o modifica datos mediante repositorios y
Prisma, y finalmente retorna una respuesta JSON al cliente.

## Docker

El proyecto incluye un `Dockerfile` multi-stage preparado para construir una
imagen de produccion de la aplicacion Next.js. Su objetivo es empaquetar el
runtime, dependencias, build y artefactos necesarios en una imagen portable y
reproducible.

Ventajas del enfoque con Docker:

- Entorno reproducible para ejecucion fuera del entorno local.
- Despliegue portable en plataformas que acepten contenedores.
- Optimizacion para produccion al separar instalacion, build y runtime.

Stages definidos:

| Stage | Responsabilidad |
| --- | --- |
| `deps` | Instala dependencias con `npm ci` usando Node.js 20 Alpine. |
| `builder` | Copia dependencias y codigo fuente, genera Prisma Client y ejecuta `npm run build`. |
| `runner` | Ejecuta la salida standalone de Next.js con usuario no privilegiado y `NODE_ENV=production`. |

Comandos de referencia:

```bash
docker build -t plataforma-gastronomica .
docker run -p 3000:3000 --env-file .env plataforma-gastronomica
```

En el flujo actual con Vercel no se requiere publicar la imagen en Docker Hub.
Docker queda preparado como alternativa para futuros despliegues externos o
ambientes donde se necesite ejecutar la aplicacion como contenedor.

## Variables de Entorno

Crear `.env` a partir de `.env.example`.

| Variable | Descripcion |
| -------- | ----------- |
| `DATABASE_URL` | Cadena de conexion principal hacia Neon PostgreSQL usada por Prisma en runtime. |
| `DIRECT_URL` | Cadena directa para operaciones de Prisma que requieren conexion directa a PostgreSQL. |
| `JWT_SECRET` | Secreto utilizado por `jose` para firmar y verificar tokens JWT. |
| `JWT_EXPIRES_IN` | Tiempo de expiracion configurado para los tokens emitidos por la API. |
| `NODE_ENV` | Define el entorno de ejecucion; en produccion debe usar `production`. |

```env
DATABASE_URL="postgresql://usuario:password@host/dbname?sslmode=require"
DIRECT_URL="postgresql://usuario:password@host/dbname?sslmode=require"
JWT_SECRET="cambia-este-secreto"
JWT_EXPIRES_IN="30m"
```

En Vercel, estas variables deben configurarse como Environment Variables del
proyecto. En ejecucion local o con Docker pueden cargarse desde `.env`.

## CI/CD

El flujo de integracion y despliegue sigue una estrategia incremental basada en
GitHub y Vercel:

```text
feature/* -> Pull Request -> merge a master -> deploy automatico en Vercel
```

Las ramas `feature/*` se usan para cambios acotados por funcionalidad. La rama
`feature/frontend-base` representa una base de trabajo para la capa frontend, y
`master` concentra la version estable que alimenta el despliegue automatico.

El repositorio incluye un workflow de GitHub Actions en
`.github/workflows/ci.yml` con validaciones de instalacion, generacion de
Prisma Client, TypeScript, tests y build de produccion. Estas validaciones
ayudan a detectar errores antes de integrar cambios a las ramas principales.

| Etapa | Validacion |
| --- | --- |
| Pull Request | Revision del cambio antes de integrarlo. |
| TypeScript | `npx tsc --noEmit` verifica tipos sin generar artefactos. |
| Tests | `npm test` ejecuta la suite automatizada configurada con Vitest. |
| Build | `npm run build` genera Swagger y valida el build de Next.js. |
| Deploy | Vercel despliega automaticamente la version integrada en `master`. |

La estrategia incremental permite evolucionar el monolito modular por capas y
por funcionalidades, reduciendo el riesgo de cambios grandes y facilitando la
revision tecnica antes de publicar una nueva version.

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
