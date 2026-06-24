import { Router } from "express";
import { cancelOrder, createOrder, listOrders, updateOrderStatus } from "../controllers/orderController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", listOrders);
router.post("/", createOrder);
router.patch("/:id/cancel", cancelOrder);
router.patch("/:id/status", updateOrderStatus);

export default router;
