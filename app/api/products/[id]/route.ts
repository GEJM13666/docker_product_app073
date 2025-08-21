// app/api/products/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';

// GET: ดึงข้อมูลสินค้าทั้งหมดพร้อมหมวดหมู่
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      // ใช้ include เพื่อดึงข้อมูล Category ที่มีความสัมพันธ์กันมาด้วย
      include: {
        category: true, 
      },
      orderBy: {
        createdAt: 'desc', // เรียงจากสินค้าใหม่สุดไปเก่าสุด
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

// POST: สำหรับสร้างสินค้าใหม่ (โค้ดเดิมของคุณ)
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
    // ... (error handling code)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
