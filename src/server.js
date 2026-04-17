import "dotenv/config";
import app from "./app.js";
import { connect } from "./connect/index.js";

const startServer = async () => {
  await connect.pingDatabase();
  console.log("Pinged your deployment. You successfully connected to MongoDB!");

  app.listen(43321, () => {
    console.log("Servidor rodando em http://localhost:43321");
  });
};

startServer().catch((error) => {
  console.error("Erro ao iniciar servidor:", error);
  process.exit(1);
});
