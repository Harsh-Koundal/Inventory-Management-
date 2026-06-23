import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("Starting product metadata database migration...");
  const products = await prisma.product.findMany();
  console.log(`Found ${products.length} products to check.`);

  let updatedCount = 0;

  for (const product of products) {
    if (!product.description) {
      console.log(`Product "${product.name}" (SKU: ${product.sku}) has no description. Skipping.`);
      continue;
    }

    try {
      const parsed = JSON.parse(product.description);
      console.log(`Parsed JSON metadata for "${product.name}" (SKU: ${product.sku}):`, parsed);

      const category = parsed.category || product.category || "Electronics";
      const minStock = typeof parsed.minStock === 'number' ? parsed.minStock : (product.minStock || 5);
      const plainDescription = parsed.description || "";

      await prisma.product.update({
        where: { id: product.id },
        data: {
          category,
          minStock,
          description: plainDescription,
        },
      });

      console.log(`Successfully migrated product "${product.name}" (SKU: ${product.sku}). Category: "${category}", MinStock: ${minStock}, Description: "${plainDescription}"`);
      updatedCount++;
    } catch (err) {
      console.log(`Description for "${product.name}" (SKU: ${product.sku}) is not JSON. Skipping migration.`);
    }
  }

  console.log(`Migration finished. Migrated ${updatedCount} products.`);
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
