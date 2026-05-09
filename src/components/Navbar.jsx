import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const ADMIN_EMAIL = 'admin@caribzoom.com'

function Navbar() {
  const { cart } = useCart()
  const { user, logout } = useAuth()
  const totalItems = cart.reduce((sum, p) => sum + p.quantity, 0)
  const isAdmin = user?.email === ADMIN_EMAIL

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between">
      <Link to="/">
        <img 
          src="https://carib.adityaprasad.dev/wordpress/wp-content/uploads/2025/10/Carib-Zoom-Inc-Logo-.jpg" 
          alt="Carib Zoom" 
          className="h-14"
        />
      </Link>
      <ul className="flex gap-6 text-sm font-semibold text-gray-700">
        <li><Link to="/shop" className="hover:text-blue-600">Shop</Link></li>
        <li><Link to="/brands" className="hover:text-blue-600">Brands</Link></li>
        <li><Link to="/my-orders" className="hover:text-blue-600">My Orders</Link></li>
        <li><Link to="/about" className="hover:text-blue-600">About Us</Link></li>
        {isAdmin && (
          <li><Link to="/admin" className="text-red-600 hover:text-red-800 font-bold">Admin</Link></li>
        )}
      </ul>
      <div className="flex items-center gap-4 text-gray-600 text-sm">
        <span>📞 +(592) 613-7666</span>
        {user ? (
          <>
            <span className="font-semibold text-blue-600">Hi, {user.name}</span>
            <button onClick={logout} className="hover:text-red-500">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-600">Login</Link>
            <Link to="/register" className="hover:text-blue-600">Register</Link>
          </>
        )}
        <span className="cursor-pointer">❤️ Wishlist</span>
        <Link to="/cart" className="cursor-pointer relative">
          🛒 Cart
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  )
}

export default Navbar