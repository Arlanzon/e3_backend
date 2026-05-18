# Frontend

Este proyecto ya usa Next.js, React y TypeScript. Esta carpeta sirve para organizar piezas del front que luego puedes importar desde `app/page.tsx` u otras rutas dentro de `app/`.

## Tecnologia actual

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

## Estructura sugerida

- `components/`: componentes visuales reutilizables.
- `data/`: datos temporales o mocks para maquetar pantallas.
- `lib/`: funciones auxiliares para consumir APIs o formatear datos.
- `types.ts`: tipos compartidos del front.

Cuando ya conectes con el backend, los datos de `data/` se pueden reemplazar por llamadas reales a `/api/v1`.
