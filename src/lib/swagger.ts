import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Plataforma Gastronomica Local — API',
      version: '1.0.0',
      description:
        'API REST para descubrimiento y reservaciones de restaurantes locales en Oaxaca. ' +
        'Desarrollada con Next.js 16, Prisma 7 y PostgreSQL (Neon).',
      contact: {
        name: 'TecNM Campus Oaxaca',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT obtenido del endpoint /auth/login',
        },
      },
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'VALIDATION_ERROR' },
                message: { type: 'string', example: 'Datos inválidos' },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'Fernando Arlanzon' },
            email: { type: 'string', format: 'email' },
            role: {
              type: 'string',
              enum: ['CUSTOMER', 'OWNER', 'MANAGER', 'ADMIN'],
            },
            active: { type: 'boolean' },
            photoUrl: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Restaurant: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'La Fonda de Oaxaca' },
            slug: { type: 'string', example: 'la-fonda-de-oaxaca' },
            description: { type: 'string', nullable: true },
            cuisineType: { type: 'string', example: 'fonda' },
            address: { type: 'string' },
            lat: { type: 'number', example: 17.0669 },
            lng: { type: 'number', example: -96.7203 },
            phone: { type: 'string', nullable: true },
            capacity: { type: 'integer', example: 40 },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
            },
            ratingAvg: { type: 'number', nullable: true },
            ratingCount: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Autenticacion y sesion' },
      { name: 'Users', description: 'Gestion de usuarios' },
      { name: 'Restaurants', description: 'Gestion de restaurantes' },
    ],
  },
  apis: ['./app/api/v1/**/*.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)