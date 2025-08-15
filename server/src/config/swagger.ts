import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
    },
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
      },
    },
  },
  apis: ['server/src/routes/*.ts'],
};

const spec = swaggerJSDoc(options);

export default spec;
