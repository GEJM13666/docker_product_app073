// app/products/page.tsx
// This page acts as a directory to navigate to different category pages.
'use client';

import Link from 'next/link';
import { List, BookOpen, Home } from 'lucide-react'; // Using lucide-react for icons

// Define a simple structure for our categories for this navigation page
const categories = [
  { id: 7, name: 'Electronics', description: 'Gadgets, computers, and more', icon: <List size={32} /> },
  { id: 8, name: 'Books', description: 'Explore new worlds and ideas', icon: <BookOpen size={32} /> },
  { id: 9, name: 'Home & Kitchen', description: 'Everything for your living space', icon: <Home size={32} /> },
];

export default function ProductsPage() {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">เลือกหมวดหมู่สินค้า</h1>
          <p className="text-lg text-gray-600 mt-2">คลิกที่หมวดหมู่เพื่อดูรายการสินค้า</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {categories.map((category) => (
            // Each Link component will navigate to the dynamic route /category/[id]
            <Link 
              href={`/category/${category.id}`} 
              key={category.id}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:bg-indigo-50 transition-all duration-300 ease-in-out group"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 bg-indigo-500 text-white rounded-full p-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                  <p className="text-gray-500">{category.description}</p>
                </div>
                <div className="ml-auto text-gray-400 group-hover:text-indigo-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
