// app/category/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // 1. Import useParams to get URL parameters

// 2. Update the Product type to match your actual data structure
type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  createdAt: string;
};

export default function CategoryProductListPage() {
  const params = useParams(); // 3. Get parameters from the URL
  const id = params.id; // The 'id' from /category/[id]

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // State for loading status
  const [error, setError] = useState<string | null>(null); // State for error messages

  useEffect(() => {
    // 4. Don't fetch if the id isn't available yet
    if (!id) return;

    setLoading(true); // Start loading
    setError(null);

    // 5. Use the dynamic id in the fetch URL
    fetch(`/api/category/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('ไม่สามารถโหลดข้อมูลได้');
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false); // Stop loading regardless of success or failure
      });
  }, [id]); // 6. Re-run this effect whenever the 'id' changes

  // --- UI Rendering ---

  if (loading) {
    return <div className="p-6 text-center">กำลังโหลดข้อมูลสินค้า...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">เกิดข้อผิดพลาด: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">รายการสินค้าในหมวดหมู่ #{id}</h1>
      
      {products.length === 0 ? (
        <p>ไม่พบสินค้าในหมวดหมู่นี้</p>
      ) : (
        <ul className="space-y-4">
          {products.map((product) => (
            <li key={product.id} className="p-4 border rounded-lg shadow-sm bg-white">
              <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
              <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{product.description}</p>
              <p className="text-md text-indigo-600 font-bold mt-2">
                {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(product.price)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
