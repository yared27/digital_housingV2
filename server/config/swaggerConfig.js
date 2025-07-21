import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express'
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Digital Housing API',
      version: '1.0.0',
      description: 'API documentation for the Digital Housing project',
    },
    servers: [
      {
        url: 'http://localhost:5000', 
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Swagger annotations
};

 const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) =>{
    app.use('/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec,
            {
                swaggerOptions: {
                    persistAuthorization: true, // save token between page refreshes,
                    docExpansion: 'none' // cleaner UI
                }
            }
        )
    );
    console.log("Swagger Docs available at /api-docs")
}

export default setupSwagger