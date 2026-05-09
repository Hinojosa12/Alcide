import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: '', price: '', image: '', category: '', brand: '', description: ''
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user) navigate('/login')
    fetchProducts()
  }, [])

  const fetchProducts = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: parseFloat(form.price) })
    })
    if (res.ok) {
      setMessage('Product added ✅')
      setForm({ name: '', price: '', image: '', category: '', brand: '', description: '' })
      fetchProducts()
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, { method: 'DELETE' })
    fetchProducts()
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 uppercase tracking-widest">Admin Panel</h1>

      <div className="bg-gray-50 rounded-lg p-6 mb-12">
        <h2 className="text-xl font-bold mb-4">Add New Product</h2>
        {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required className="border rounded px-4 py-2 text-sm outline-none" />
          <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} required className="border rounded px-4 py-2 text-sm outline-none" />
          <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} required className="border rounded px-4 py-2 text-sm outline-none" />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required className="border rounded px-4 py-2 text-sm outline-none" />
          <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} required className="border rounded px-4 py-2 text-sm outline-none" />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border rounded px-4 py-2 text-sm outline-none" />
          <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition">
            Add Product
          </button>
        </form>
      </div>

      <h2 className="text-xl font-bold mb-4">All Products ({products.length})</h2>
      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow p-4 flex gap-4">
              <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-gray-800">{product.name}</h3>
                <p className="text-xs text-gray-400">{product.category} · {product.brand}</p>
                <p className="text-blue-600 font-bold text-sm">${product.price?.toLocaleString()}</p>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="mt-2 text-xs text-red-500 hover:text-red-700 font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Admin