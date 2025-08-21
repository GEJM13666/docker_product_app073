//product-app073\prisma\seed.ts
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient();

async function seedUser() { 
  await prisma.user.create({ 
    data: { 
      name: "Sakan", 
      email: "sakan@gmail.com", 
      password: "123456", 
     
    }, 
  });

}
async function seedCategory() {
  console.log('Seeding categories...');
  await prisma.category.createMany({
    data: [
      { name: 'Electronics' },
      { name: 'Books' },
      { name: 'Home & Kitchen' },
    ],
    skipDuplicates: true, // ไม่สร้างซ้ำถ้ามีชื่อนี้อยู่แล้ว
  });
  console.log('Categories seeded successfully.');
}

async function seedProduct() { 
  console.log('Seeding products...');
  
  // ดึงข้อมูล ID ของ Category ที่เพิ่งสร้างไป
  const electronics = await prisma.category.findUnique({ where: { name: 'Electronics' } });
  const books = await prisma.category.findUnique({ where: { name: 'Books' } });
  const homeAndKitchen = await prisma.category.findUnique({ where: { name: 'Home & Kitchen' } });

  // ตรวจสอบว่าหา Category เจอก่อนจะสร้าง Product
  if (!electronics || !books || !homeAndKitchen) {
    console.error('Could not find categories. Please seed categories first.');
    return;
  }

  const productData = [
    // === 5 Products for Electronics ===
    { name: 'Laptop Pro 14"', description: 'M3 Chip, 18GB RAM, 512GB SSD', price: 59900, categoryId: electronics.id },
    { name: 'Wireless Ergonomic Mouse', description: 'Bluetooth 5.0, Silent Click', price: 1290, categoryId: electronics.id },
    { name: '4K UHD Monitor 27"', description: 'IPS Panel, 144Hz Refresh Rate', price: 9800, categoryId: electronics.id },
    { name: 'Mechanical Keyboard', description: 'RGB Backlit, Brown Switches', price: 2550, categoryId: electronics.id },
    { name: 'Noise Cancelling Headphones', description: 'Over-ear, 30-hour battery', price: 4990, categoryId: electronics.id },

    // === 5 Products for Books ===
    { name: 'The Art of Programming', description: 'A classic computer science textbook', price: 990, categoryId: books.id },
    { name: 'Sapiens: A Brief History of Humankind', description: 'By Yuval Noah Harari', price: 450, categoryId: books.id },
    { name: 'Dune', description: 'Classic science fiction novel by Frank Herbert', price: 380, categoryId: books.id },
    { name: 'Atomic Habits', description: 'An Easy & Proven Way to Build Good Habits', price: 320, categoryId: books.id },
    { name: 'The Pragmatic Programmer', description: 'From journeyman to master', price: 750, categoryId: books.id },

    // === 5 Products for Home & Kitchen ===
    { name: 'Air Fryer 5.5L', description: 'Digital touch screen, 1700W', price: 2990, categoryId: homeAndKitchen.id },
    { name: 'Espresso Coffee Machine', description: '15 Bar pump pressure', price: 5400, categoryId: homeAndKitchen.id },
    { name: 'Robot Vacuum Cleaner', description: 'Smart mapping and navigation', price: 8900, categoryId: homeAndKitchen.id },
    { name: 'Electric Kettle 1.7L', description: 'Stainless steel, Fast boiling', price: 850, categoryId: homeAndKitchen.id },
    { name: 'Blender for Smoothies', description: '6-blade, 1200W motor', price: 1800, categoryId: homeAndKitchen.id },
  ];

  await prisma.product.createMany({
    data: productData,
    skipDuplicates: true,
  });
  console.log('Products seeded successfully.');
}
 
async function main() { 
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await seedCategory(); 
  await seedUser(); 
  await seedProduct(); 
 
  console.log("seeded");
} 
 
main() 
  .then(() => prisma.$disconnect()) 
  .catch((e) => { 
    console.error(e); 
    prisma.$disconnect() 
    process.exit(1) 
  }); 