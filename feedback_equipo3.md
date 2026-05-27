# Feedback – Equipo 3: Plataforma de Descubrimiento Gastronómico
**Stack:** Next.js (App Router como backend + frontend) · Tailwind CSS · PostgreSQL NEON (Prisma ORM)  
**Fecha de revisión:** 22 de abril de 2025

---

## Resumen general

El equipo toma una decisión arquitectónica interesante y válida: usar Next.js como plataforma unificada donde las Route Handlers (`app/api/v1/...`) funcionan como el backend REST y los componentes React como el frontend. El resultado es un proyecto bien organizado que demuestra comprensión de varios conceptos del curso, aunque la elección del stack genera una pregunta arquitectónica que el equipo debe poder justificar con claridad.

---

## Lo que están haciendo bien ✅

### Arquitectura multicapas dentro de Next.js

Aunque todo vive en un mismo proyecto, el equipo sí separa responsabilidades en 3 capas bien diferenciadas:

- **Capa de presentación:** `app/api/v1/*/route.ts` — recibe la petición HTTP, valida el input con Zod, llama al service y construye la respuesta. No contiene lógica de negocio.
- **Capa de negocio:** `src/features/*/service.ts` — orquesta las operaciones, aplica reglas de negocio (verificar existencia, permisos, validaciones de dominio) y lanza errores semánticos.
- **Capa de datos:** `src/features/*/repository.ts` — acceso a la base de datos con Prisma, sin conocimiento de HTTP ni de negocio.

Esto demuestra que entienden la separación de capas como un principio de diseño, independientemente del framework.

### DTOs con Zod como contratos de entrada y salida

Los esquemas Zod en `restaurants.schema.ts` y `users.schema.ts` cumplen el rol de DTOs: definen exactamente qué campos acepta cada operación (`CreateRestaurantInput`, `UpdateRestaurantInput`, `ListRestaurantsInput`) y validan los datos antes de que lleguen al service. Esto protege las capas internas y hace explícito el contrato de la API.

### Diseño RESTful bien aplicado
La estructura de rutas sigue las convenciones REST correctamente:

- `GET /api/v1/restaurants` — listar con paginación y filtros por query params.
- `POST /api/v1/restaurants` — crear nuevo restaurante (requiere auth).
- `GET /api/v1/restaurants/[id]` — obtener por ID.
- `PUT /api/v1/restaurants/[id]` — actualizar (requiere ser el dueño).
- `GET /api/v1/restaurants/[id]/hours` — subrecurso anidado lógicamente.

El versionamiento en la URL (`/api/v1/`) es una buena práctica de diseño REST que permite evolucionar la API sin romper clientes existentes.

### Clase `AppError` personalizada para manejo de errores

En `src/lib/errors.ts` tienen una clase `AppError` con código semántico, mensaje y status HTTP. Esto permite que el service comunique errores con significado:

```ts
throw new AppError('RESTAURANT_NOT_FOUND', 'Restaurante no encontrado', 404)
throw new AppError('FORBIDDEN', 'No tienes permiso para editar este restaurante', 403)
```

Y el manejador en `handle-error.ts` convierte esos errores en respuestas HTTP correctas. El flujo es limpio y el cliente siempre recibe una respuesta estructurada.

### Validación con Zod en cada route handler

Cada handler usa `safeParse` antes de llamar al service. Si los datos no son válidos, responde inmediatamente con `400` y los detalles del error — el service nunca recibe datos malformados:

```ts
const parsed = createRestaurantSchema.safeParse(body)
if (!parsed.success) {
  return NextResponse.json({ error: 'VALIDATION_ERROR', ... }, { status: 400 })
}
const restaurant = await createRestaurantService(parsed.data, claims.sub)
```

Esto es validación robusta bien ubicada en la capa correcta.

### Autenticación JWT con helpers reutilizables

`requireAuth()` y `requireRole()` en `src/lib/auth.ts` son funciones que encapsulan la lógica de autenticación y se usan en todos los handlers que lo necesitan. Esto evita repetir la misma lógica de verificación en cada route.

### Swagger / OpenAPI configurado

Tienen Swagger configurado en `src/lib/swagger.ts` con comentarios JSDoc en las rutas que generan la documentación automáticamente en `/api/v1/docs`. Los comentarios incluyen descripción de parámetros, request body y posibles respuestas.

---

## Áreas de mejora 🔧

### El README es el template por defecto de Next.js

El README actual es literalmente el que genera `create-next-app` sin ninguna modificación. No hay descripción del sistema, instrucciones para configurar la base de datos (NEON), variables de entorno necesarias, ni diagrama de arquitectura. Para la presentación final esto es un problema crítico porque es lo primero que cualquier evaluador abre.

### Justificación arquitectónica pendiente

La decisión de usar Next.js como plataforma unificada es válida, pero en el contexto del curso donde vimos separación de responsabilidades y arquitecturas cliente-servidor, el equipo **debe poder justificar esta elección** en la presentación. Preguntas que deben preparar:

- ¿Qué ventajas tiene esta arquitectura respecto a tener un backend dedicado?
- ¿Qué desventajas o limitaciones tiene? (por ejemplo: ¿cómo escalarías solo el backend si la carga aumenta?)
- ¿En qué casos del mundo real se usa este enfoque?

Poder responder esto demuestra que la decisión fue consciente y técnicamente fundamentada.

### Cobertura de recursos — verificar mínimo requerido

El proyecto tiene implementados `restaurants` y `users`. Para la actividad 10 se requieren al menos 3 recursos con relaciones entre sí. Verificar que se agreguen los recursos pendientes del dominio (reseñas, reservaciones, etc.) antes de la entrega.

### Sin script de seed de base de datos

No se encontró un script para poblar la base de datos con datos de prueba. Para la demo en la presentación es fundamental poder mostrar el sistema con datos reales desde el inicio, sin tener que crear todo manualmente.

---

## Calificación conceptual

| Criterio | Evaluación |
|---|---|
| Arquitectura multicapas (dentro de Next.js) | ✅ Bien aplicado |
| DTOs con Zod | ✅ Bien implementado |
| Diseño RESTful | ✅ Excelente |
| Manejo de errores con `AppError` | ✅ Excelente |
| Validación de inputs | ✅ Robusta y bien ubicada |
| Autenticación JWT | ✅ Implementado |
| Swagger / OpenAPI | ✅ Configurado |
| README | ❌ Solo el template por defecto |
| Diagrama de arquitectura | ❌ No encontrado |
| Cobertura de recursos (mín. 3) | ⚠️ Verificar |
| Seed de datos | ⚠️ No encontrado |

---

## Recomendación final

Tienen código de buena calidad y buenos patrones aplicados. El riesgo más grande es la ausencia total de documentación. Prioridad máxima antes de la presentación: (1) README completo con descripción, instrucciones de configuración y diagrama, y (2) preparar la justificación de por qué eligieron esta arquitectura y qué trade-offs implica. Eso, bien explicado en la presentación, convierte la elección arquitectónica en una fortaleza en lugar de una pregunta sin respuesta.

---

## Sugerencias adicionales de buenas prácticas

Estas son mejoras aplicables en el tiempo que queda, sin afectar la funcionalidad:

**1. Crear un archivo `.env.example` en el repositorio**
Agregar un archivo con los nombres de las variables de entorno necesarias (sin valores reales) para que cualquier persona pueda configurar el proyecto:
```
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your_secret_here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**2. Usar códigos de error consistentes en toda la API**
Ya tienen `AppError` con código semántico, lo que es excelente. Asegúrense de que todos los handlers usen ese patrón y que no haya respuestas de error sin código ni formato inconsistente entre endpoints.

**3. Agregar el campo `updatedAt` en los modelos de Prisma**
El esquema de Prisma debería incluir `createdAt` y `updatedAt` con `@updatedAt` en los modelos principales. Esto permite saber cuándo fue la última modificación sin esfuerzo adicional:
```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

**4. Hacer explícitos los status codes en todos los handlers**
Algunos handlers retornan respuestas sin especificar el status code (usa 200 por defecto). Ser explícito mejora la legibilidad y la documentación Swagger:
```ts
return NextResponse.json({ success: true, data: restaurant }, { status: 201 })
```

**5. Agregar un endpoint de health check**
Un `GET /api/health` que retorne `{ status: 'ok', timestamp: new Date() }` es útil para verificar que el servidor funciona correctamente, especialmente en ambientes desplegados. En Next.js App Router:
```ts
// app/api/health/route.ts
export function GET() {
  return Response.json({ status: 'ok', timestamp: new Date().toISOString() })
}
```
