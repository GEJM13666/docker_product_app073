import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedProduct() {
  try {
    const result = await prisma.product.createMany({
      data: [
        {
          name: "Notebook",
          description: "14 inch, Intel i5",
          price: 23900,
        },
        {
          name: "Wireless Mouse",
          description: "Ergonomic design",
          price: 590,
        },
      ],
      skipDuplicates: true, // Optional: avoids inserting duplicates if already present
    });

    console.log(`✅ Seeded ${result.count} products.`);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    throw error; // Rethrow to be caught in main()
  }
}

async function main() {
  await seedProduct();
}

main()
  .then(() => {
    console.log("🎉 Seeding completed.");
  })
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
