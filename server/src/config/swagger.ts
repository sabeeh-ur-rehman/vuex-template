import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
    },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Customer: {
          type: 'object',
          required: ['tenantId', 'email'],
          properties: {
            tenantId: {
              type: 'string',
              description: 'Tenant identifier',
              example: '507f1f77bcf86cd799439011',
            },
            email: {
              type: 'string',
              description: 'Customer email',
              example: 'john@example.com',
            },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            phone: { type: 'string', example: '+1-555-123-4567' },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string', example: '123 Main St' },
                city: { type: 'string', example: 'Springfield' },
                state: { type: 'string', example: 'IL' },
                postalCode: { type: 'string', example: '62704' },
                country: { type: 'string', example: 'USA' },
              },
            },
          },
          example: {
            tenantId: '507f1f77bcf86cd799439011',
            email: 'john@example.com',
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1-555-123-4567',
            address: {
              street: '123 Main St',
              city: 'Springfield',
              state: 'IL',
              postalCode: '62704',
              country: 'USA',
            },
          },
        },
        Project: {
          type: 'object',
          required: ['tenantId', 'name'],
          properties: {
            tenantId: {
              type: 'string',
              description: 'Tenant identifier',
              example: '507f1f77bcf86cd799439011',
            },
            customerId: {
              type: 'string',
              description: 'Customer identifier',
              example: '507f1f77bcf86cd799439012',
            },
            name: {
              type: 'string',
              description: 'Project name',
              example: 'Kitchen Remodel',
            },
            status: { type: 'string', example: 'planning' },
            startDate: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              example: '2024-02-01T00:00:00.000Z',
            },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string', example: '123 Main St' },
                city: { type: 'string', example: 'Springfield' },
                state: { type: 'string', example: 'IL' },
                postalCode: { type: 'string', example: '62704' },
                country: { type: 'string', example: 'USA' },
              },
            },
          },
          example: {
            tenantId: '507f1f77bcf86cd799439011',
            customerId: '507f1f77bcf86cd799439012',
            name: 'Kitchen Remodel',
            status: 'planning',
            startDate: '2024-01-01T00:00:00.000Z',
            endDate: '2024-02-01T00:00:00.000Z',
            address: {
              street: '123 Main St',
              city: 'Springfield',
              state: 'IL',
              postalCode: '62704',
              country: 'USA',
            },
          },
        },
        Council: {
          type: 'object',
          required: ['tenantId', 'name'],
          properties: {
            tenantId: {
              type: 'string',
              description: 'Tenant identifier',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              description: 'Council name',
              example: 'Main council',
            },
          },
        },
        EmailMsg: {
          type: 'object',
          required: ['tenantId', 'messageId'],
          properties: {
            tenantId: {
              type: 'string',
              description: 'Tenant identifier',
              example: '507f1f77bcf86cd799439011',
            },
            messageId: {
              type: 'string',
              description: 'Email message identifier',
              example: 'abc123',
            },
          },
        },
        Membership: {
          type: 'object',
          required: ['tenantId', 'userId', 'role'],
          properties: {
            tenantId: {
              type: 'string',
              description: 'Tenant identifier',
              example: '507f1f77bcf86cd799439011',
            },
            userId: {
              type: 'string',
              description: 'User identifier',
              example: '507f1f77bcf86cd799439012',
            },
            role: {
              type: 'string',
              description: 'Role in tenant',
              enum: ['admin', 'member'],
              example: 'admin',
            },
          },
        },
        PriceList: {
          type: 'object',
          required: ['tenantId', 'name'],
          properties: {
            tenantId: {
              type: 'string',
              description: 'Tenant identifier',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              description: 'Price list name',
              example: 'Standard',
            },
            description: { type: 'string', example: 'Default pricing' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['name', 'price'],
                properties: {
                  name: { type: 'string', example: 'Labor' },
                  unit: { type: 'string', example: 'hr' },
                  price: { type: 'number', example: 50 },
                  description: { type: 'string', example: 'Hourly rate' },
                },
              },
            },
          },
          example: {
            tenantId: '507f1f77bcf86cd799439011',
            name: 'Standard',
            description: 'Default pricing',
            items: [
              { name: 'Labor', unit: 'hr', price: 50 },
              { name: 'Material', unit: 'item', price: 20, description: 'Wood plank' },
            ],
          },
        },
        Proposal: {
          type: 'object',
          required: ['tenantId', 'projectId', 'customerId'],
          properties: {
            tenantId: {
              type: 'string',
              description: 'Tenant identifier',
              example: '507f1f77bcf86cd799439011',
            },
            projectId: {
              type: 'string',
              description: 'Project identifier',
              example: '507f1f77bcf86cd799439012',
            },
            customerId: {
              type: 'string',
              description: 'Customer identifier',
              example: '507f1f77bcf86cd799439013',
            },
            priceListId: {
              type: 'string',
              description: 'Associated price list',
              example: '507f1f77bcf86cd799439014',
            },
            notes: { type: 'string', example: 'Initial estimate' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['description', 'unitPrice'],
                properties: {
                  description: { type: 'string', example: 'Install cabinets' },
                  quantity: { type: 'number', example: 1 },
                  unitPrice: { type: 'number', example: 500 },
                },
              },
            },
            total: { type: 'number', example: 800 },
          },
          example: {
            tenantId: '507f1f77bcf86cd799439011',
            projectId: '507f1f77bcf86cd799439012',
            customerId: '507f1f77bcf86cd799439013',
            priceListId: '507f1f77bcf86cd799439014',
            notes: 'Initial estimate',
            items: [
              { description: 'Install cabinets', quantity: 1, unitPrice: 500 },
              { description: 'Paint walls', quantity: 2, unitPrice: 150 },
            ],
            total: 800,
          },
        },
        Step: {
          type: 'object',
          required: ['tenantId', 'projectId', 'name'],
          properties: {
            tenantId: {
              type: 'string',
              description: 'Tenant identifier',
              example: '507f1f77bcf86cd799439011',
            },
            projectId: {
              type: 'string',
              description: 'Project identifier',
              example: '507f1f77bcf86cd799439012',
            },
            name: { type: 'string', description: 'Step name', example: 'Demolition' },
            description: { type: 'string', example: 'Remove old fixtures' },
            order: { type: 'number', example: 1 },
            status: { type: 'string', example: 'pending' },
            startDate: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-02T00:00:00.000Z',
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-05T00:00:00.000Z',
            },
          },
          example: {
            tenantId: '507f1f77bcf86cd799439011',
            projectId: '507f1f77bcf86cd799439012',
            name: 'Demolition',
            description: 'Remove old fixtures',
            order: 1,
            status: 'pending',
            startDate: '2024-01-02T00:00:00.000Z',
            endDate: '2024-01-05T00:00:00.000Z',
          },
        },
        Document: {
          type: 'object',
          required: ['tenantId', 'title'],
          properties: {
            tenantId: {
              type: 'string',
              description: 'Tenant identifier',
              example: '507f1f77bcf86cd799439011',
            },
            title: {
              type: 'string',
              description: 'Document title',
              example: 'Template A',
            },
          },
        },
        Tenant: {
          type: 'object',
          required: ['tenantId', 'name'],
          properties: {
            tenantId: {
              type: 'string',
              description: 'Tenant identifier',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              description: 'Tenant name',
              example: 'Tenant Inc',
            },
          },
        },
        User: {
          type: 'object',
          required: ['tenantId', 'email'],
          properties: {
            tenantId: {
              type: 'string',
              description: 'Tenant identifier',
              example: '507f1f77bcf86cd799439011',
            },
            email: {
              type: 'string',
              description: 'User email',
              example: 'john@example.com',
            },
          },
        },
        Variation: {
          type: 'object',
          required: ['tenantId', 'proposalId', 'name', 'status'],
          properties: {
            tenantId: {
              type: 'string',
              description: 'Tenant identifier',
              example: '507f1f77bcf86cd799439011',
            },
            proposalId: {
              type: 'string',
              description: 'Proposal identifier',
              example: '507f1f77bcf86cd799439012',
            },
            name: {
              type: 'string',
              description: 'Variation name',
              example: 'Lighting Upgrade',
            },
            status: {
              type: 'string',
              description: 'Variation status',
              example: 'Draft',
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  description: {
                    type: 'string',
                    example: 'Premium fixture',
                  },
                  qty: {
                    type: 'number',
                    example: 2,
                  },
                  price: {
                    type: 'number',
                    example: 100,
                  },
                },
              },
            },
          },
        },
        AuthLogin: {
          type: 'object',
          required: ['tenantId', 'userId'],
          properties: {
            tenantId: {
              type: 'string',
              description: 'Tenant identifier',
              example: '507f1f77bcf86cd799439011',
            },
            userId: {
              type: 'string',
              description: 'User identifier',
              example: '507f1f77bcf86cd799439012',
            },
          },
        },
        AuthToken: {
          type: 'object',
          required: ['token'],
          properties: {
            token: {
              type: 'string',
              description: 'JWT token',
              example: 'jwt.token.example',
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['server/src/routes/*.ts'],
};

const spec = swaggerJSDoc(options);

export default spec;
