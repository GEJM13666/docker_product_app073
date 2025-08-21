// app/products/page.tsx
// This page displays a list of products with a category filter on the left, fetched from a live API.
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // Import the Link component
import { Tag, ShoppingCart, Package, Loader, AlertCircle, PlusCircle } from 'lucide-react'; // Add PlusCircle icon

// --- Interfaces for our data structures ---
interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrl: string; // Assuming the API provides an imageUrl
}

export default function ProductsPage() {
  // --- State Management ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(0); // 0 for 'All'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch both categories and products from the API concurrently
        const [catResponse, prodResponse] = await Promise.all([
          fetch('/api/category'),
          fetch('/api/products')
        ]);

        // Check if both responses are OK
        if (!catResponse.ok) {
          throw new Error(`Failed to fetch categories: ${catResponse.statusText}`);
        }
        if (!prodResponse.ok) {
          throw new Error(`Failed to fetch products: ${prodResponse.statusText}`);
        }

        const catData: Category[] = await catResponse.json();
        const prodData: Product[] = await prodResponse.json();

        // Add the "All" category to the beginning of the list for filtering
        setCategories([{ id: 0, name: 'All' }, ...catData]);
        setProducts(prodData);
        setFilteredProducts(prodData); // Initially show all products

      } catch (err: any) {
        setError(err.message || 'Failed to load data. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Filtering Logic ---
  // This function handles filtering the product list based on the selected category ID.
  const handleCategorySelect = (selectedCatId: number) => {
    setSelectedCategory(selectedCatId);

    // If the 'All' category (ID 0) is selected, display the original full list of products.
    if (selectedCatId === 0) {
      setFilteredProducts(products);
    } else {
      // Otherwise, filter the products array.
      // It creates a new array containing only the products where the product's 'categoryId'
      // perfectly matches the 'selectedCatId' from the button that was clicked.
      const filtered = products.filter(product => product.categoryId === selectedCatId);
      setFilteredProducts(filtered);
    }
  };

  // --- UI Components ---
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-full text-gray-500">
      <Loader className="animate-spin h-12 w-12 mb-4" />
      <p className="text-lg">Loading Products...</p>
    </div>
  );

  const ErrorDisplay = () => (
     <div className="flex flex-col items-center justify-center h-full text-red-600 bg-red-50 p-8 rounded-lg">
      <AlertCircle className="h-12 w-12 mb-4" />
      <p className="text-lg font-semibold">An Error Occurred</p>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8">
        {/* --- MODIFIED HEADER SECTION --- */}
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-12">
          <div className="text-center sm:text-left">
            <h1 className="text-5xl font-extrabold text-gray-800">Our Products</h1>
            <p className="text-lg text-gray-600 mt-2">Find what you're looking for</p>
          </div>
          {/* --- ADDED BUTTON --- */}
          <Link href="/products/new">
            <button className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <PlusCircle size={22} />
              <span>Add New Product</span>
            </button>
          </Link>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* --- Sidebar for Filters --- */}
          <aside className="w-full md:w-1/4 lg:w-1/5">
            <div className="bg-white p-6 rounded-xl shadow-md sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Tag className="mr-3 text-indigo-600" /> Categories
              </h2>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleCategorySelect(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 text-md font-medium flex items-center ${
                        selectedCategory === category.id
                          ? 'bg-indigo-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-800'
                      }`}
                    >
                      <Package size={20} className="mr-3" />
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* --- Main Content for Products --- */}
          <main className="w-full md:w-3/4 lg:w-4/5">
            {isLoading ? <LoadingSpinner /> : error ? <ErrorDisplay /> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.length > 0 ? filteredProducts.map((product) => {
                  const category = categories.find(cat => cat.id === product.categoryId);
                  const categoryName = category ? category.name : 'Uncategorized';

                  return (
                    <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col">
                      <img 
                        src={product.imageUrl || 'https://placehold.co/600x400/cccccc/ffffff?text=No+Image'} 
                        alt={product.name} 
                        className="w-full h-48 object-cover"
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Image+Error'; }}
                      />
                      <div className="p-5 flex flex-col flex-grow">
                        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold mb-3 px-2.5 py-0.5 rounded-full self-start">
                          {categoryName}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 flex-grow">{product.description}</p>
                        <div className="flex justify-between items-center mt-auto">
                          <p className="text-2xl font-black text-indigo-600">${product.price.toFixed(2)}</p>
                          <button className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors shadow-md">
                            <ShoppingCart size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="col-span-full text-center py-16">
                     <p className="text-xl text-gray-500">No products found in this category.</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}