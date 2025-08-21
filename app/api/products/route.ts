import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server' 


export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to fetch products', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // 1. ดึง categoryId ออกมาจาก body ที่ส่งมาจากหน้าฟอร์ม
    const { name, description, price, categoryId } = body;

    // 2. ตรวจสอบข้อมูลให้ครบถ้วน รวมถึง categoryId
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลสินค้าและเลือกหมวดหมู่ให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // 3. สร้าง Product ใหม่โดยใช้ categoryId เพื่อเชื่อมความสัมพันธ์
    const newProduct = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: price,
        categoryId: categoryId, // <--- จุดที่แก้ไข
      },
    });

    return NextResponse.json(newProduct, { status: 201 }); // 201 Created

  } catch (error: unknown) {
    // เพิ่มการจัดการ Error ให้ละเอียดขึ้น
    if (error instanceof Error) {
      // กรณีที่ Prisma ไม่สามารถสร้างข้อมูลได้ (เช่น foreign key ไม่ถูกต้อง)
      if ('code' in error && error.code === 'P2003') {
         return NextResponse.json({ error: 'Category ID ที่ระบุไม่ถูกต้องหรือไม่พบในระบบ' }, { status: 400 });
      }
      return NextResponse.json({ error: 'Failed to create product', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}