import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'

const categories = ["All", "Accessories", "Appliances", "Baby & Kids", "Beauty", "Kitchen", "Male Wellness", "Stationery"]

function Shop() {
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const filtered = products.filter((p) => {
    const matchCategory = selectedCategory === "All" || p.category === selectedCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400 text-lg">Loading products...</p>
      </div>
    )
  }

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