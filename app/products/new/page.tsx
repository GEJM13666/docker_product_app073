'use client'

import { useState, useEffect, useRef } from 'react'
// Import useRouter for navigation
import { useRouter } from 'next/navigation'
// Add ArrowLeft to the icon imports
import { PlusCircle, Package, Tag, FileText, DollarSign, Save, Loader, AlertCircle, ChevronDown, Check, ArrowLeft } from 'lucide-react'

type Category = {
  id: number;
  name: string;
}

// --- Custom Combobox Component ---
const CategoryCombobox = ({ categories, value, onChange, placeholder, disabled }: {
    categories: Category[],
    value: string,
    onChange: (value: string) => void,
    placeholder: string,
    disabled: boolean
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const comboboxRef = useRef<HTMLDivElement>(null);

    const filteredCategories = value
        ? categories.filter(cat => cat.name.toLowerCase().includes(value.toLowerCase()))
        : categories;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectCategory = (categoryName: string) => {
        onChange(categoryName);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={comboboxRef}>
            <div className="relative">
                <input
                    id="category-input"
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    required
                    disabled={disabled}
                    autoComplete="off"
                />
                <ChevronDown 
                    className={`absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                />
            </div>
            {isOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map(category => (
                            <li
                                key={category.id}
                                onClick={() => handleSelectCategory(category.name)}
                                className="px-4 py-2 hover:bg-indigo-50 cursor-pointer flex justify-between items-center"
                            >
                                {category.name}
                                {value.toLowerCase() === category.name.toLowerCase() && <Check className="h-5 w-5 text-indigo-600" />}
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-2 text-gray-500">No categories found. Type to create a new one.</li>
                    )}
                </ul>
            )}
        </div>
    );
};


export default function NewProductPage() {
  // Initialize the router
  const router = useRouter(); 
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const [categories, setCategories] = useState<Category[]>([])
  const [categoryInput, setCategoryInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch all categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/category');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("API Error:", error);
        setError("Failed to load categories.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryInput.trim()) {
        setError("Category cannot be empty.");
        return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let finalCategoryId: number;

      // 1. Check if the category exists
      const trimmedCategoryInput = categoryInput.trim();
      const existingCategory = categories.find(
        (cat) => cat.name.toLowerCase() === trimmedCategoryInput.toLowerCase()
      );

      if (existingCategory) {
        // 2. Use existing category ID
        finalCategoryId = existingCategory.id;
      } else {
        // 3. Create a new category if it doesn't exist
        const catRes = await fetch('/api/category', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: trimmedCategoryInput }),
        });

        if (!catRes.ok) {
          const errorData = await catRes.json();
          throw new Error(errorData.error || 'Could not create new category.');
        }
        const newCategory: Category = await catRes.json();
        finalCategoryId = newCategory.id;
        // Add new category to the local state to keep UI updated
        setCategories(prev => [...prev, newCategory]);
      }

      // 4. Create the new product with the final category ID
      const productRes = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          categoryId: finalCategoryId,
          imageUrl,
        }),
      });

      if (!productRes.ok) {
        const errorData = await productRes.json();
        throw new Error(errorData.error || 'Failed to create product.');
      }

      setSuccessMessage(`Product "${name}" was added successfully!`);
      // Reset form fields
      setName(''); setDescription(''); setPrice(''); setCategoryInput(''); setImageUrl('');
      
      // Navigate away after a delay
      setTimeout(() => router.push('/products'), 2000);

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        {/* --- ADDED BACK BUTTON --- */}
        <button
            onClick={() => router.back()}
            className="mb-8 flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg"
        >
            <ArrowLeft size={20} />
            <span>Back</span>
        </button>

        <header className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gray-800 flex items-center justify-center">
                <PlusCircle className="mr-4 text-indigo-600" size={48} />
                Add New Product
            </h1>
            <p className="text-lg text-gray-600 mt-2">Fill out the form below to add a new item to the catalog</p>
        </header>

        <div className="p-8 w-full bg-white rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <Package size={16} className="mr-2" /> Product Name
                    </label>
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                </div>
                <div>
                    <label htmlFor="category-input" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <Tag size={16} className="mr-2" /> Category
                    </label>
                    <CategoryCombobox 
                        categories={categories}
                        value={categoryInput}
                        onChange={setCategoryInput}
                        placeholder={isLoading ? 'Loading categories...' : 'Select or type...'}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div>
              <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <FileText size={16} className="mr-2" /> Description
              </label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" rows={4} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="price" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <DollarSign size={16} className="mr-2" /> Price (USD)
                    </label>
                    <input id="price" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                </div>
            </div>

            <div className="pt-4">
                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
                        <AlertCircle className="mr-3" /> {error}
                    </div>
                )}
                {successMessage && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                        {successMessage}
                    </div>
                )}
                <button type="submit"
                    className="w-full flex items-center justify-center bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition-all duration-300"
                    disabled={isLoading || isSubmitting}
                >
                    {isSubmitting ? <><Loader className="animate-spin mr-2" /> Submitting...</> : <><Save className="mr-2" /> Add Product</>}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}