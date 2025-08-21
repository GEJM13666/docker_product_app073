import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';

/**
 * GET /api/category
 * ดึงข้อมูลหมวดหมู่สินค้าทั้งหมด
 */
export async function GET() {
  try {
    // ดึงข้อมูลหมวดหมู่ทั้งหมด พร้อมกับนับจำนวนสินค้าในแต่ละหมวดหมู่
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        name: 'asc'
      }
    });
    return NextResponse.json(categories);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to fetch categories', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}

/**
 * POST /api/category
 * สร้างหมวดหมู่สินค้าใหม่
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    // 1. ตรวจสอบว่ามีการส่ง 'name' มาใน body และไม่เป็นค่าว่าง
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'กรุณาระบุชื่อหมวดหมู่ (Name is required)' },
        { status: 400 } // 400 Bad Request
      );
    }

    // 2. สร้างหมวดหมู่ใหม่ในฐานข้อมูล
    const newCategory = await prisma.category.create({
      data: {
        name: name.trim(), // ใช้ .trim() เพื่อลบช่องว่างหน้า-หลัง
      },
    });

    return NextResponse.json(newCategory, { status: 201 }); // 201 Created

  } catch (error: any) {
    // 3. จัดการข้อผิดพลาดที่อาจเกิดขึ้น
    // กรณีที่ชื่อหมวดหมู่ซ้ำกัน (Prisma error code 'P2002' for unique constraint violation)
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
        return NextResponse.json(
            { error: `หมวดหมู่ชื่อ "${name}" มีอยู่ในระบบแล้ว` },
            { status: 409 } // 409 Conflict
        );
    }
    
    // จัดการข้อผิดพลาดอื่นๆ
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to create category', details: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
