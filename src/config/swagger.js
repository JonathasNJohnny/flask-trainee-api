import swaggerJSDoc from "swagger-jsdoc";

const serverUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.API_BASE_URL || "http://localhost:43321";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Trainee API",
      version: "1.0.0",
      description: "Documentação da API",
    },
    servers: [
      {
        url: serverUrl,
      },
    ],
  },
  apis: ["./src/routes/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
