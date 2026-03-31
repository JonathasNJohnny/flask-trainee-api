import { Router } from "express";
import testRoutes from "./tests/index.js";
import userRoutes from "./user/index.js";

const router = Router();

//Routes
router.use("/tests", testRoutes);
router.use("/user", userRoutes);

export default router;
