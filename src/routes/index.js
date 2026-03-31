import { Router } from "express";
import testRoutes from "./tests/index.js";

const router = Router();

router.use("/tests", testRoutes);

export default router;
