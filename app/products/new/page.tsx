'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Category = {
  id: number;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  
  // State สำหรับ Combobox
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryInput, setCategoryInput] = useState('') // เก็บค่าที่ user พิมพ์หรือเลือก
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ดึงข้อมูลหมวดหมู่ทั้งหมด
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/category');
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true);

    let finalCategoryId: number;

    // 1. ตรวจสอบว่าหมวดหมู่ที่ผู้ใช้ป้อนมีอยู่ในลิสต์หรือไม่
    const existingCategory = categories.find(
      (cat) => cat.name.toLowerCase() === categoryInput.trim().toLowerCase()
    );

    if (existingCategory) {
      // 2. ถ้ามีอยู่แล้ว, ใช้ ID ของหมวดหมู่นั้น
      finalCategoryId = existingCategory.id;
    } else {
      // 3. ถ้าไม่มี, สร้างหมวดหมู่ใหม่ผ่าน API
      try {
        const res = await fetch('/api/category', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: categoryInput.trim() }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'ไม่สามารถสร้างหมวดหมู่ใหม่ได้');
        }

        const newCategory: Category = await res.json();
        finalCategoryId = newCategory.id;
      } catch (error: any) {
        alert(`เกิดข้อผิดพลาด: ${error.message}`);
        setIsSubmitting(false);
        return;
      }
    }

    // 4. สร้างสินค้าโดยใช้ finalCategoryId ที่ได้มา
    try {
      const productRes = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          categoryId: finalCategoryId,
        }),
      });

      if (productRes.ok) {
        router.push('/products');
      } else {
        throw new Error('ไม่สามารถเพิ่มสินค้าได้');
      }
    } catch (error: any) {
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="p-8 max-w-2xl w-full mx-auto bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">เพิ่มสินค้าใหม่</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg" required />
          </div>

          {/* Category Combobox */}
          <div>
            <label htmlFor="category-input" className="block text-sm font-medium text-gray-700 mb-1">
              หมวดหมู่ (เลือกหรือพิมพ์เพื่อสร้างใหม่)
            </label>
            <input
              id="category-input"
              type="text"
              list="category-list"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              placeholder={isLoading ? 'กำลังโหลดหมวดหมู่...' : 'เช่น Electronics'}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
              disabled={isLoading}
            />
            <datalist id="category-list">
              {categories.map((category) => (
                <option key={category.id} value={category.name} />
              ))}
            </datalist>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดสินค้า</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg" rows={4} required />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">ราคา (บาท)</label>
            <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg" required />
          </div>

          <button type="submit"
            className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400"
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting ? 'กำลังบันทึก...' : 'เพิ่มสินค้า'}
          </button>
        </form>
      </div>
    </div>
  )
}
