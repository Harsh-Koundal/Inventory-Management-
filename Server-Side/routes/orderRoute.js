import { Router } from "express";
import { cancelOrder, createOrder, listOrders } from "../controllers/orderController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", listOrders);
router.post("/", createOrder);
router.patch("/:id/cancel", cancelOrder);

export default router;
