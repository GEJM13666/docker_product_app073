// \app\api\category\[id]\route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';

// The GET function receives two arguments in the App Router: request and a context object.
// The context object contains `params`, which we can destructure to get the dynamic [id].
export async function GET(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    // 1. Convert the id from the URL (which is a string) to a number.
    const categoryId = parseInt(params.id, 10);

    // 2. Add a check to ensure the ID is a valid number.
    if (isNaN(categoryId)) {
      return NextResponse.json({ error: 'Invalid category ID provided' }, { status: 400 });
    }

    // 3. Use `findMany` with a `where` clause to filter products by `categoryId`.
    const products = await prisma.product.findMany({
      where: {
        categoryId: categoryId,
      },
    });

    // 4. (Optional but good practice) Check if any products were found for that category.
    if (products.length === 0) {
      // It's not an error if a category has no products, 
      // so we can return an empty array with a success status.
      return NextResponse.json([]);
    }

    // 5. Return the found products.
    return NextResponse.json(products);

  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to fetch products', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
