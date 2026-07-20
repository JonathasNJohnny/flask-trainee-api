import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  apis: [
    path.resolve(process.cwd(), "src/routes/**/*.ts"),
    path.resolve(process.cwd(), "dist/routes/**/*.js"),
    path.resolve(__dirname, "../routes/**/*.ts"),
    path.resolve(__dirname, "../routes/**/*.js"),
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
