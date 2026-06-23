import { Router } from "express";
import { adjustStock, getStockHistory } from "../controllers/stockController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);

router.get("/history", getStockHistory);
router.post("/adjust", adjustStock);

export default router;
