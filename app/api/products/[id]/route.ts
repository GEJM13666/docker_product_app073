// app/api/products/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from 'next/server';

// GET: ดึงข้อมูลสินค้าทั้งหมด หรือกรองตาม categoryId
export async function GET(req: NextRequest) { // 1. เปลี่ยน request เป็น NextRequest เพื่อเข้าถึง URL
  try {
    // 2. ดึง searchParams จาก URL ของ request
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');

    // 3. สร้างเงื่อนไข (where clause) สำหรับ Prisma query
    const whereClause = categoryId 
      ? { categoryId: parseInt(categoryId, 10) } 
      : {};

    // 4. ตรวจสอบว่า categoryId ที่ส่งมาเป็นตัวเลขที่ถูกต้องหรือไม่
    if (categoryId && isNaN(parseInt(categoryId, 10))) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: whereClause, // 5. ใช้ where clause ที่สร้างขึ้น
      include: {
        category: true, 
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to fetch products', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}

// POST: สำหรับสร้างสินค้าใหม่ (โค้ดเดิม)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, price, categoryId } = body;

    if (!name || !description || !price || !categoryId) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: { name, description, price, categoryId },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
