import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

function Cart() {
  const { cart, removeFromCart, total } = useCart()

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="bg-blue-600 text-white px-8 py-3 rounded font-semibold hover:bg-blue-700 transition">
          Go to Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 uppercase tracking-widest">Your Cart</h1>
      <div className="flex flex-col gap-4">
        {cart.map((product) => (
          <div key={product.id} className="flex items-center gap-4 bg-white shadow rounded-lg p-4">
            <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-400">{product.category}</p>
              <p className="text-blue-600 font-bold">${product.price.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
              <p className="font-bold text-gray-800">${(product.price * product.quantity).toLocaleString()}</p>
            </div>
            <button
              onClick={() => removeFromCart(product.id)}
              className="text-red-500 hover:text-red-700 font-bold text-lg"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <div className="bg-gray-50 rounded-lg p-6 w-full md:w-80">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2 text-sm text-gray-600">
            <span>Subtotal</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-4 text-sm text-gray-600">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-4">
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <Link to="/checkout" className="mt-6 block text-center bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart