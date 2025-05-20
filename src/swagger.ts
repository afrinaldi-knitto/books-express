import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Basic Express API",
      version: "1.0.0",
      description: "A simple Express API documented with Swagger",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Book: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "Clean Code" },
            author: { type: "string", example: "Robert C. Martin" },
          },
        },
        BookInput: {
          type: "object",
          properties: {
            title: { type: "string", example: "The Pragmatic Programmer" },
            author: { type: "string", example: "Andrew Hunt" },
          },
          required: ["title", "author"],
        },
        Author: {
          type: "object",
          properties: {
            name: "nal",
          },
          required: ["name"],
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
export const swaggerUiExpress = swaggerUi;
