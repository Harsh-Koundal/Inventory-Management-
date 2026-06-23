import { z } from "zod";
import prisma from "../config/prisma.js";
import { mapProduct, normalizeProductMetadata, serializeProductMetadata } from "../utils/inventoryMappers.js";

const productSchema = z.object({
  sku: z.string().trim().min(1),
  name: z.string().trim().min(1),
  category: z.string().trim().min(1),
  price: z.coerce.number().min(0),
  quantity: z.coerce.number().int().min(0),
  minStock: z.coerce.number().int().min(0),
  description: z.string().optional().default(""),
});

export const listProducts = async (_req, res) => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { stock: true },
    orderBy: { createdAt: "desc" },
  });

  return res.json(products.map(mapProduct));
};

export const createProduct = async (req, res) => {
  try {
    const payload = productSchema.parse(req.body);

    const product = await prisma.$transaction(async (tx) => {
      const createdProduct = await tx.product.create({
        data: {
          sku: payload.sku.trim().toUpperCase(),
          name: payload.name.trim(),
          price: payload.price,
          description: serializeProductMetadata(payload),
        },
        include: { stock: true },
      });

      const stock = await tx.stock.create({
        data: {
          productId: createdProduct.id,
          quantity: payload.quantity,
        },
      });

      await tx.stockHistory.create({
        data: {
          productId: createdProduct.id,
          type: "STOCK_IN",
          quantity: payload.quantity,
          previousQty: 0,
          newQty: payload.quantity,
          notes: "Initial stock added",
          createdById: req.user.id,
        },
      });

      return {
        ...createdProduct,
        stock,
      };
    });

    return res.status(201).json({
      message: `${product.name} added successfully.`,
      product: mapProduct(product),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid product input", issues: error.issues });
    }

    if (error.code === "P2002") {
      return res.status(409).json({ message: "SKU already exists. Each product must have a unique SKU." });
    }

    console.error("Create product error:", error);
    return res.status(500).json({ message: "Unable to create product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const payload = productSchema.parse(req.body);

    const existingProduct = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { stock: true },
    });

    if (!existingProduct || !existingProduct.isActive) {
      return res.status(404).json({ message: "Product not found." });
    }

    const previousQuantity = existingProduct.stock?.quantity ?? 0;
    const quantityDelta = payload.quantity - previousQuantity;
    const existingMeta = normalizeProductMetadata(existingProduct.description);

    const updatedProduct = await prisma.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id: req.params.id },
        data: {
          sku: payload.sku.trim().toUpperCase(),
          name: payload.name.trim(),
          price: payload.price,
          description: serializeProductMetadata({
            ...existingMeta,
            ...payload,
          }),
        },
        include: { stock: true },
      });

      const stock = existingProduct.stock
        ? await tx.stock.update({
            where: { productId: req.params.id },
            data: { quantity: payload.quantity },
          })
        : await tx.stock.create({
            data: {
              productId: req.params.id,
              quantity: payload.quantity,
            },
          });

      if (quantityDelta !== 0) {
        await tx.stockHistory.create({
          data: {
            productId: req.params.id,
            type: "ADJUSTMENT",
            quantity: quantityDelta,
            previousQty: previousQuantity,
            newQty: payload.quantity,
            notes: "Adjusted while editing product details",
            createdById: req.user.id,
          },
        });
      }

      return {
        ...product,
        stock,
      };
    });

    return res.json({
      message: `${updatedProduct.name} updated successfully.`,
      product: mapProduct(updatedProduct),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid product input", issues: error.issues });
    }

    if (error.code === "P2002") {
      return res.status(409).json({ message: "SKU already exists. Each product must have a unique SKU." });
    }

    console.error("Update product error:", error);
    return res.status(500).json({ message: "Unable to update product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        orderItems: {
          include: {
            order: true,
          },
        },
      },
    });

    if (!existingProduct || !existingProduct.isActive) {
      return res.status(404).json({ message: "Product not found." });
    }

    const hasActiveOrders = existingProduct.orderItems.some((item) => item.order.status === "PENDING");

    if (hasActiveOrders) {
      return res.status(409).json({
        message: "This product appears in active orders and cannot be deleted.",
      });
    }

    await prisma.product.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });

    return res.json({ message: `${existingProduct.name} deleted successfully.` });
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({ message: "Unable to delete product" });
  }
};
