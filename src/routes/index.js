import { Router } from "express";
import testRoutes from "./tests/index.js";
import userRoutes from "./user/index.js";

const router = Router();

router.use("/test", testRoutes);
router.use("/user", userRoutes);

export default router;
