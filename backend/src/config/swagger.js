import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Homara API",
      version: "1.0.0",
      description: "Documentación oficial de la API de Homara para E-commerce",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
      },
    ],
  },
  // Anotaciones JSDoc estarán en estos archivos
  apis: ["./src/routes/*.js"],
};

export const specs = swaggerJsDoc(options);
