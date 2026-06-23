import { z } from "zod";
import prisma from "../config/prisma.js";
import { mapOrder } from "../utils/inventoryMappers.js";

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      pid: z.string().trim().min(1),
      qty: z.coerce.number().int().positive(),
    })
  ).min(1),
  note: z.string().optional().default(""),
});

const createOrderNumber = () => `ORD-${Date.now().toString().slice(-6)}`;

export const listOrders = async (_req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json(orders.map(mapOrder));
};

export const createOrder = async (req, res) => {
  try {
    const payload = createOrderSchema.parse(req.body);
    const uniqueIds = new Set(payload.items.map((item) => item.pid));

    if (uniqueIds.size !== payload.items.length) {
      return res.status(400).json({
        message: "Duplicate products are not allowed. Use a single row with a higher quantity instead.",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: {
          id: { in: payload.items.map((item) => item.pid) },
          isActive: true,
        },
        include: { stock: true },
      });

      if (products.length !== payload.items.length) {
        throw new Error("One or more selected products no longer exist.");
      }

      const lineItems = payload.items.map((item) => {
        const product = products.find((entry) => entry.id === item.pid);

        if (!product) {
          throw new Error("One or more selected products no longer exist.");
        }

        const availableQty = product.stock?.quantity ?? 0;

        if (availableQty < item.qty) {
          throw new Error(`Insufficient stock for "${product.name}". Available: ${availableQty}.`);
        }

        return {
          product,
          qty: item.qty,
          subtotal: Number(product.price) * item.qty,
        };
      });

      const order = await tx.order.create({
        data: {
          orderNumber: createOrderNumber(),
          status: "PENDING",
          totalAmount: lineItems.reduce((sum, item) => sum + item.subtotal, 0),
          createdById: req.user.id,
          items: {
            create: lineItems.map((item) => ({
              productId: item.product.id,
              quantity: item.qty,
              unitPrice: item.product.price,
              subtotal: item.subtotal,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      for (const item of lineItems) {
        const previousQty = item.product.stock?.quantity ?? 0;
        const newQty = previousQty - item.qty;

        await tx.stock.update({
          where: { productId: item.product.id },
          data: { quantity: newQty },
        });

        await tx.stockHistory.create({
          data: {
            productId: item.product.id,
            type: "ORDER_PLACED",
            quantity: -item.qty,
            previousQty,
            newQty,
            referenceId: order.id,
            notes: `Order ${order.orderNumber}`,
            createdById: req.user.id,
          },
        });
      }

      return order;
    });

    return res.status(201).json({
      message: `Order ${result.orderNumber} created successfully.`,
      order: mapOrder(result),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid order input", issues: error.issues });
    }

    console.error("Create order error:", error);
    return res.status(400).json({ message: error.message || "Unable to create order" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                stock: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (order.status !== "PENDING") {
      return res.status(409).json({ message: "Only pending orders can be cancelled." });
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const cancelledOrder = await tx.order.update({
        where: { id: req.params.id },
        data: { status: "CANCELLED" },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      for (const item of order.items) {
        const previousQty = item.product.stock?.quantity ?? 0;
        const newQty = previousQty + item.quantity;

        await tx.stock.update({
          where: { productId: item.productId },
          data: { quantity: newQty },
        });

        await tx.stockHistory.create({
          data: {
            productId: item.productId,
            type: "ORDER_CANCELLED",
            quantity: item.quantity,
            previousQty,
            newQty,
            referenceId: order.id,
            notes: `Order ${order.orderNumber} cancelled`,
            createdById: req.user.id,
          },
        });
      }

      return cancelledOrder;
    });

    return res.json({
      message: `Order ${order.orderNumber} cancelled and stock restored.`,
      order: mapOrder(updatedOrder),
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    return res.status(500).json({ message: "Unable to cancel order" });
  }
};
