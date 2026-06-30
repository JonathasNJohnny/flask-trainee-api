import express from "express";
import routes from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(routes);

export default app;
