export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Notes App API',
    version: '1.0.0',
    description: 'REST API for a multi-user notes application with AI-powered features and real-time collaboration potential.',
    contact: {
      name: 'API Support',
      email: 'support@epifi.example.com'
    }
  },
  servers: [
    {
      url: '/',
      description: 'Development server'
    }
  ],
  tags: [
    { name: 'Auth', description: 'User registration and authentication' },
    { name: 'Notes', description: 'Core note management operations' },
    { name: 'Meta', description: 'API metadata and health checks' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token in the format: <token>'
      }
    },
    schemas: {
      AuthPayload: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          password: { type: 'string', minLength: 8, example: 'password123' }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
        }
      },
      RegisterResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'User registered successfully' }
        }
      },
      Note: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
          title: { type: 'string', example: 'Meeting Notes' },
          content: { type: 'string', example: 'Discuss project timelines and budget.' },
          is_favorite: { type: 'boolean', example: false },
          created_at: { type: 'string', format: 'date-time', example: '2023-10-27T10:00:00Z' },
          updated_at: { type: 'string', format: 'date-time', example: '2023-10-27T11:30:00Z' }
        }
      },
      SharedNote: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          sender_email: { type: 'string', format: 'email' }
        }
      },
      NotePayload: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 120, example: 'My Awesome Note' },
          content: { type: 'string', minLength: 1, maxLength: 10000, example: '<p>Some content here...</p>' }
        }
      },
      SharePayload: {
        type: 'object',
        required: ['share_with_email'],
        properties: {
          share_with_email: { type: 'string', format: 'email', example: 'friend@example.com' }
        }
      },
      FavoritePayload: {
        type: 'object',
        required: ['is_favorite'],
        properties: {
          is_favorite: { type: 'boolean', example: true }
        }
      },
      ImprovePayload: {
        type: 'object',
        required: ['content'],
        properties: {
          content: { type: 'string', minLength: 1, maxLength: 10000, example: 'Fix grammar in this text: He go to school.' }
        }
      },
      ImproveResponse: {
        type: 'object',
        properties: {
          improved_content: { type: 'string', example: 'He goes to school.' }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Detailed error message here' }
        }
      },
      HealthResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Notes App API' },
          docs: { type: 'string', example: '/openapi.json' },
          about: { type: 'string', example: '/about' }
        }
      },
      AboutResponse: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Developer Name' },
          email: { type: 'string', example: 'dev@example.com' },
          'my features': {
            type: 'object',
            additionalProperties: { type: 'string' }
          }
        }
      }
    }
  },
  paths: {
    '/': {
      get: {
        tags: ['Meta'],
        summary: 'API Root / Health Check',
        description: 'Returns the API status and links to documentation.',
        responses: {
          200: {
            description: 'API is healthy',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/HealthResponse' } } }
          }
        }
      }
    },
    '/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        description: 'Creates a new user account with the provided email and password.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthPayload' } } }
        },
        responses: {
          201: {
            description: 'User created successfully',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterResponse' } } }
          },
          400: {
            description: 'Validation error',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
          },
          409: {
            description: 'Email already registered',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
          }
        }
      }
    },
    '/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authenticate a user',
        description: 'Verifies credentials and returns a JWT access token.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthPayload' } } }
        },
        responses: {
          200: {
            description: 'Authentication successful',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } }
          },
          401: {
            description: 'Invalid credentials',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
          }
        }
      }
    },
    '/notes': {
      get: {
        tags: ['Notes'],
        summary: 'List owned notes',
        description: 'Returns a paginated list of notes owned by the authenticated user.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number (starts from 1)',
            schema: { type: 'integer', default: 1, minimum: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Items per page',
            schema: { type: 'integer', default: 20, minimum: 1, maximum: 100 }
          }
        ],
        responses: {
          200: {
            description: 'List of notes',
            headers: {
              'X-Total-Count': { description: 'Total number of notes', schema: { type: 'integer' } },
              'X-Page': { description: 'Current page', schema: { type: 'integer' } },
              'X-Limit': { description: 'Items per page', schema: { type: 'integer' } }
            },
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Note' } } } }
          },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      post: {
        tags: ['Notes'],
        summary: 'Create a new note',
        description: 'Creates a new note for the authenticated user.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/NotePayload' } } }
        },
        responses: {
          201: {
            description: 'Note created successfully',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Note' } } }
          },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/notes/shared': {
      get: {
        tags: ['Notes'],
        summary: 'List shared notes',
        description: 'Returns a list of notes shared with the authenticated user by others.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'List of shared notes',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/SharedNote' } } } }
          },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/notes/improve': {
      post: {
        tags: ['Notes'],
        summary: 'Improve note content (AI)',
        description: 'Uses Google Gemini AI to improve the readability and flow of the provided note content.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ImprovePayload' } } }
        },
        responses: {
          200: {
            description: 'Improvement successful',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ImproveResponse' } } }
          },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'AI service error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/notes/{id}': {
      get: {
        tags: ['Notes'],
        summary: 'Get note by ID',
        description: 'Fetches a single note if the user is the owner or if it has been shared with them.',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, description: 'Note UUID', schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: {
            description: 'Note found',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Note' } } }
          },
          404: { description: 'Note not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      put: {
        tags: ['Notes'],
        summary: 'Update note',
        description: 'Updates an existing note. Only the owner can update a note.',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, description: 'Note UUID', schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/NotePayload' } } }
        },
        responses: {
          200: {
            description: 'Note updated successfully',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Note' } } }
          },
          404: { description: 'Note not found or not owned', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      delete: {
        tags: ['Notes'],
        summary: 'Delete note',
        description: 'Permanently deletes a note. Only the owner can delete a note.',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, description: 'Note UUID', schema: { type: 'string', format: 'uuid' } }],
        responses: {
          204: { description: 'Note deleted successfully' },
          404: { description: 'Note not found or not owned', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/notes/{id}/share': {
      post: {
        tags: ['Notes'],
        summary: 'Share note',
        description: 'Shares the note with another user identified by their email.',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, description: 'Note UUID', schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/SharePayload' } } }
        },
        responses: {
          200: {
            description: 'Note shared successfully',
            content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } }
          },
          404: { description: 'Note or recipient user not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/notes/{id}/favorite': {
      patch: {
        tags: ['Notes'],
        summary: 'Toggle favorite',
        description: 'Marks or unmarks a note as a favorite.',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, description: 'Note UUID', schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/FavoritePayload' } } }
        },
        responses: {
          200: {
            description: 'Favorite status updated',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Note' } } }
          },
          404: { description: 'Note not found or not owned', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/search': {
      get: {
        tags: ['Notes'],
        summary: 'Search notes',
        description: 'Performs a full-text search across owned and shared notes.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            description: 'Search query string',
            schema: { type: 'string', minLength: 1, maxLength: 120 }
          }
        ],
        responses: {
          200: {
            description: 'Matching notes',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Note' } } } }
          },
          400: { description: 'Invalid search query', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/openapi.json': {
      get: {
        tags: ['Meta'],
        summary: 'OpenAPI specification',
        description: 'Returns the full OpenAPI 3.0 specification in JSON format.',
        responses: {
          200: {
            description: 'Success',
            content: { 'application/json': { schema: { type: 'object' } } }
          }
        }
      }
    },
    '/about': {
      get: {
        tags: ['Meta'],
        summary: 'About the API',
        description: 'Returns metadata about the API, including developer info and key features.',
        responses: {
          200: {
            description: 'Success',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AboutResponse' } } }
          }
        }
      }
    }
  }
};
