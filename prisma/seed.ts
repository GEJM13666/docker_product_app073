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


async function seedProduct() { 
  await prisma.product.createMany({ 
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
    ], skipDuplicates:true
  }); 
} 
 
async function main() { 
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
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