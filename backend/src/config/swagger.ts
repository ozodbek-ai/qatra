import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({

  definition: {

    openapi: "3.0.0",

    info: {
      title: "Qatra LMS API",
      version: "1.0.0",
      description:
        "Professional Learning Management System API",
    },

    servers: [
      {
        url: "http://localhost:3000/api/v1",
      },
    ],

    components: {

      securitySchemes: {

        bearerAuth: {

          type: "http",

          scheme: "bearer",

          bearerFormat: "JWT",

        },

      },

    },

    security: [

      {
        bearerAuth: [],
      },

    ],

  },

  apis: [
  "./src/docs/*.ts",
],

});