import { z } from "zod";
import prisma from "../config/prisma.js";
import { mapHistory } from "../utils/inventoryMappers.js";

const stockAdjustmentSchema = z.object({
  productId: z.string().trim().min(1),
  mode: z.enum(["add", "reduce"]),
  quantity: z.coerce.number().int().positive(),
  note: z.string().optional().default(""),
});

export const getStockHistory = async (_req, res) => {
  const history = await prisma.stockHistory.findMany({
    include: {
      product: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json(history.map(mapHistory));
};

export const adjustStock = async (req, res) => {
  try {
    const payload = stockAdjustmentSchema.parse(req.body);

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: payload.productId },
        include: { stock: true },
      });

      if (!product || !product.isActive) {
        throw new Error("Product not found.");
      }

      const previousQty = product.stock?.quantity ?? 0;
      const delta = payload.mode === "add" ? payload.quantity : -payload.quantity;
      const newQty = previousQty + delta;

      if (newQty < 0) {
        throw new Error("Stock cannot go below zero.");
      }

      if (product.stock) {
        await tx.stock.update({
          where: { productId: payload.productId },
          data: { quantity: { increment: delta } },
        });
      } else {
        await tx.stock.create({
          data: { productId: payload.productId, quantity: newQty },
        });
      }

      await tx.stockHistory.create({
        data: {
          productId: payload.productId,
          type: payload.mode === "add" ? "STOCK_IN" : "STOCK_OUT",
          quantity: delta,
          previousQty,
          newQty,
          notes: payload.note?.trim() || (payload.mode === "add" ? "Manual restock" : "Manual stock reduction"),
          createdById: req.user.id,
        },
      });

      return product.name;
    });

    return res.json({
      message: `${result} stock ${payload.mode === "add" ? "increased" : "reduced"} successfully.`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid stock adjustment input", issues: error.issues });
    }

    if (error.message === "Product not found.") {
      return res.status(404).json({ message: error.message });
    }

    if (error.message === "Stock cannot go below zero.") {
      return res.status(400).json({ message: error.message });
    }

    console.error("Adjust stock error:", error);
    return res.status(500).json({ message: "Unable to adjust stock" });
  }
};
