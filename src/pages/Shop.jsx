import { useState } from 'react'
import { useCart } from '../context/CartContext'

const allProducts = [
  { id: 1, name: "Coach Crossbody Bags", price: 6500, image: "https://site.carib-zoom.com/wp-content/uploads/2026/04/488-300x300.png", category: "Accessories", brand: "D'Jango" },
  { id: 2, name: "Black Horse Vital Honey Packs", price: 1000, image: "https://site.carib-zoom.com/wp-content/uploads/2026/04/72-300x300.png", category: "Male Wellness", brand: "Health" },
  { id: 3, name: "Sokany Coffee Maker", price: 12000, image: "https://site.carib-zoom.com/wp-content/uploads/2025/10/Home-Essentials-Stock-3-2-300x300.png", category: "Appliances", brand: "Home Essentials" },
  { id: 4, name: "Sokany 3-1 Breakfast Maker", price: 15000, image: "https://site.carib-zoom.com/wp-content/uploads/2025/10/437-300x300.png", category: "Appliances", brand: "Home Essentials" },
  { id: 5, name: "Guess 3pcs Handbags", price: 0, image: "https://site.carib-zoom.com/wp-content/uploads/2025/10/283-300x300.png", category: "Accessories", brand: "Guess" },
  { id: 6, name: "7pcs Air-Tight Storage Containers", price: 8000, image: "https://site.carib-zoom.com/wp-content/uploads/2025/10/470-1-300x300.png", category: "Kitchen", brand: "Home Essentials" },
  { id: 7, name: "Baby Feeding Chair", price: 25000, image: "https://site.carib-zoom.com/wp-content/uploads/2025/10/485-300x300.webp", category: "Baby & Kids", brand: "Destiny's Clothing" },
  { id: 8, name: "Baby Bedside Dell", price: 5000, image: "https://site.carib-zoom.com/wp-content/uploads/2025/10/433-1-300x300.webp", category: "Baby & Kids", brand: "Destiny's Clothing" },
  { id: 9, name: "Portable Satin Baby Bed", price: 4500, image: "https://site.carib-zoom.com/wp-content/uploads/2026/05/163-300x300.png", category: "Baby & Kids", brand: "Destiny's Clothing" },
  { id: 10, name: "Mielle Rosemary Mint Hair Care Set", price: 6000, image: "https://site.carib-zoom.com/wp-content/uploads/2026/05/486-300x300.png", category: "Beauty", brand: "Pieces Plus Sized" },
  { id: 11, name: "Kids Learning Foam Clock", price: 1000, image: "https://site.carib-zoom.com/wp-content/uploads/2026/05/355-300x300.png", category: "Stationery", brand: "The Office Depot" },
  { id: 12, name: "Batana Oil Full Hair Care Set", price: 6500, image: "https://site.carib-zoom.com/wp-content/uploads/2026/04/103-300x300.png", category: "Beauty", brand: "Pieces Plus Sized" },
]

const categories = ["All", "Accessories", "Appliances", "Baby & Kids", "Beauty", "Kitchen", "Male Wellness", "Stationery"]

function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [search, setSearch] = useState("")
  const { addToCart } = useCart()

  const filtered = allProducts.filter((p) => {
    const matchCategory = selectedCategory === "All" || p.category === selectedCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 uppercase tracking-widest">Shop</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 text-sm w-full md:w-72 outline-none"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded text-sm font-semibold transition ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <p className="text-xs text-gray-400 mb-1">{product.category}</p>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">{product.name}</h3>
              {product.price > 0 && (
                <p className="text-blue-600 font-bold">${product.price.toLocaleString()}</p>
              )}
              <button 
  onClick={() => addToCart(product)}
  className="mt-3 w-full bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 transition">
  Add to Cart
</button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 mt-12">No products found.</p>
      )}
    </div>
  )
}

export default Shop