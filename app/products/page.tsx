'use client' 
 
import { useEffect, useState } from 'react' 
 
type Product = { 
  id: number 
  name: string 
  description: string 
  price: number 
} 
 
export default function ProductListPage() { 
  const [products, setProducts] = useState<Product[]>([]) 
 
  useEffect(() => { 
       fetch('/api/products') 
      .then((res) => res.json()) 
      .then((data) => setProducts(data)) 
  }, []) 
 
  return ( 
    <div className="p-6"> 
      <h1 className="text-2xl font-bold mb-4">รายการสินคา</h1> 
      <ul className="space-y-4"> 
        {products.map((product) => ( 
          <li key={product.id} className="p-4 border rounded shadow"> 
            <h2 className="text-lg font-semibold">{product.name}</h2> 
            <p className="text-sm text-gray-600">{product.description}</p> 
            <p className="text-md text-green-700 font-bold">ราคา: {product.price} บาท</p> 
          </li> 
        ))} 
      </ul> 
    </div> 
  ) 
} 