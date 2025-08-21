// app/api/category/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // ดึงข้อมูลหมวดหมู่ทั้งหมด พร้อมกับนับจำนวนสินค้าในแต่ละหมวดหมู่
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    return NextResponse.json(categories);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to fetch categories', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
