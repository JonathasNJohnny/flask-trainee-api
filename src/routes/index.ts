import { Router } from "express";
import testRoutes from "./tests/index.js";
import userRoutes from "./user/index.js";
import enterpriseRoutes from "./enterprise/index.js";

const router = Router();

router.use("/test", testRoutes);
router.use("/user", userRoutes);
router.use("/enterprise", enterpriseRoutes);

export default router;
