import "dotenv/config";
import app from "./app.js";

app.listen(43321, () => {
  console.log("Servidor rodando em http://localhost:43321");
});
