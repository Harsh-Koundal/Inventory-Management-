import { Router } from "express";
import { createProduct, deleteProduct, listProducts, updateProduct } from "../controllers/productController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", listProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
