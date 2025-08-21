'use client'
import { useState } from 'react' 
import { useRouter } from 'next/navigation' 
 
export default function NewProductPage() { 
  const router = useRouter() 
  const [name, setName] = useState('') 
  const [description, setDescription] = useState('') 
  const [price, setPrice] = useState('') 
 
  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault() 
 
    const res = await fetch('/api/products', { 
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json', 
      }, 
      body: JSON.stringify({ 
        name, 
        description, 
        price: parseFloat(price), 
      }), 
    }) 
 
    if (res.ok) { 
      router.push('/products') // กลับไปหนารายการ 
    } 
  } 
 
  return ( 
    <div className="p-6 max-w-lg mx-auto"> 
      <h1 className="text-2xl font-bold mb-4">เพิ่มสินคาใหม</h1>
        <form onSubmit={handleSubmit} className="space-y-4"> 
        <input 
          type="text" 
          placeholder="ชื่อสินคา" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="w-full p-2 border rounded" 
          required 
        /> 
        <textarea 
          placeholder="รายละเอียดสินคา" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className="w-full p-2 border rounded" 
          required 
        /> 
        <input 
          type="number" 
          placeholder="ราคาสินคา" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          className="w-full p-2 border rounded" 
          required 
        /> 
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" 
        > 
          เพิ่มสินคา 
        </button> 
      </form> 
    </div> 
  ) 
} 