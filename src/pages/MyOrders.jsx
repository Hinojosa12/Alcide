import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function MyOrders() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/orders?email=${user.email}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400 text-lg">Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 uppercase tracking-widest">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 text-lg mb-4">You have no orders yet.</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-blue-600 text-white px-8 py-3 rounded font-semibold hover:bg-blue-700 transition"
          >
            Go Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-400">Order #{order.id}</p>
                  <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600 text-lg">${order.total?.toLocaleString()}</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold uppercase">
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyOrders