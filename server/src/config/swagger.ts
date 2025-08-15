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
            name: {
              type: 'string',
              description: 'Project name',
              example: 'Project Alpha',
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
          },
        },
        Proposal: {
          type: 'object',
          required: ['tenantId', 'projectId'],
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
          },
        },
        Step: {
          type: 'object',
          required: ['tenantId', 'projectId'],
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
          required: ['tenantId', 'proposalId'],
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
  },
  apis: ['server/src/routes/*.ts'],
};

const spec = swaggerJSDoc(options);

export default spec;
