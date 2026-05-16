export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Notes App API',
    version: '1.0.0',
    description: 'REST API for a multi-user notes application.'
  },
  servers: [{ url: '/' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      AuthPayload: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 }
        }
      },
      Note: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          content: { type: 'string' },
          is_favorite: { type: 'boolean' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  paths: {
    '/register': {
      post: {
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthPayload' } } }
        },
        responses: { 201: { description: 'Created' }, 409: { description: 'Email already registered' } }
      }
    },
    '/login': {
      post: {
        summary: 'Authenticate a user',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthPayload' } } }
        },
        responses: { 200: { description: 'JWT token returned' }, 401: { description: 'Invalid credentials' } }
      }
    },
    '/notes': {
      get: {
        summary: 'Get notes owned by the authenticated user',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100 } }
        ],
        responses: { 200: { description: 'List of notes' } }
      },
      post: {
        summary: 'Create a note',
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: 'Created note' } }
      }
    },
    '/notes/{id}': {
      get: {
        summary: 'Get an owned or shared note by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'Note' }, 404: { description: 'Not found' } }
      },
      put: {
        summary: 'Update an owned note',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'Updated note' }, 404: { description: 'Not found' } }
      },
      delete: {
        summary: 'Delete an owned note',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 204: { description: 'Deleted' }, 404: { description: 'Not found' } }
      }
    },
    '/notes/{id}/share': {
      post: {
        summary: 'Share an owned note with another user',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'Shared' }, 404: { description: 'Not found' } }
      }
    },
    '/notes/{id}/favorite': {
      patch: {
        summary: 'Custom feature: mark an owned note as favorite or not favorite',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'Updated favorite state' } }
      }
    },
    '/search': {
      get: {
        summary: 'Search owned and shared notes',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'q', in: 'query', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Matching notes' } }
      }
    },
    '/openapi.json': { get: { summary: 'OpenAPI document', responses: { 200: { description: 'OpenAPI JSON' } } } },
    '/about': { get: { summary: 'Application metadata', responses: { 200: { description: 'About payload' } } } }
  }
};
