import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

function Checkout() {
  const { cart, total, clearCart } = useCart()
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleMMGPayment = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const checkoutRes = await fetch(`${import.meta.env.VITE_API_URL}/api/mmg/generate-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          description: `Carib Zoom Order - ${cart.length} item(s)`,
          nombre: form.name,
          email: form.email,
        })
      })

      const checkoutData = await checkoutRes.json()
      if (!checkoutRes.ok) return setError(checkoutData.message)

      await fetch(`${import.meta.env.VITE_API_URL}/api/mmg/save-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id || null,
          total,
          items: cart,
          merchantTransactionId: checkoutData.merchantTransactionId
        })
      })

      clearCart()
      window.location.href = checkoutData.checkoutUrl

    } catch (err) {
      setError('Error connecting to payment service')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">No items in cart</h1>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">

      <div>
        <h1 className="text-2xl font-bold mb-6 uppercase tracking-widest">Checkout</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleMMGPayment} className="flex flex-col gap-4">
          <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="border border-gray-300 rounded px-4 py-2 text-sm outline-none" />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="border border-gray-300 rounded px-4 py-2 text-sm outline-none" />
          <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required className="border border-gray-300 rounded px-4 py-2 text-sm outline-none" />
          <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} required className="border border-gray-300 rounded px-4 py-2 text-sm outline-none" />
          <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} required className="border border-gray-300 rounded px-4 py-2 text-sm outline-none" />
          <button type="submit" disabled={loading} className="bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700 transition mt-4 disabled:opacity-50">
            {loading ? 'Redirecting to MMG...' : `Pay with MMG — $${total.toLocaleString()}`}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 uppercase tracking-widest">Your Order</h2>
        <div className="flex flex-col gap-4">
          {cart.map((product) => (
            <div key={product.id} className="flex items-center gap-4 bg-white shadow rounded-lg p-4">
              <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-800">{product.name}</h3>
                <p className="text-xs text-gray-400">Qty: {product.quantity}</p>
              </div>
              <p className="font-bold text-blue-600">${(product.price * product.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${total.toLocaleString()}</span>
        </div>
      </div>

    </div>
  )
}

export default Checkout