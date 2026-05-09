import { useState } from 'react'
import { useCart } from '../context/CartContext'

function Checkout() {
  const { cart, total, clearCart } = useCart()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    clearCart()
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">¡Order Placed! 🎉</h1>
        <p className="text-gray-500">Thank you for your purchase. We will contact you shortly.</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
      
      <div>
        <h1 className="text-2xl font-bold mb-6 uppercase tracking-widest">Checkout</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 text-sm outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 text-sm outline-none"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 text-sm outline-none"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 text-sm outline-none"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition mt-4"
          >
            Place Order — ${total.toLocaleString()}
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