import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { Phone, User, Heart, ShoppingCart, Search, ChevronDown } from 'lucide-react'
import logo from '../assets/logo.png'

const ADMIN_EMAIL = 'admin@caribzoom.com'

function Navbar() {
  const { cart } = useCart()
  const { user, logout } = useAuth()
  const location = useLocation()
  const totalItems = cart.reduce((sum, p) => sum + p.quantity, 0)
  const isAdmin = user?.email === ADMIN_EMAIL
  const [search, setSearch] = useState('')

  const navLinks = [
    { label: 'My Account', to: '/login' },
    { label: 'Shop',       to: '/shop' },
    { label: 'Shop Our Brands', to: '/brands' },
    { label: 'About Us',   to: '/about' },
    { label: 'FAQ',        to: '/faq' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="w-full">

      {/* Barra superior oscura */}
      <div className="bg-gray-900 text-white text-sm py-2 px-6 flex items-center justify-center gap-4">
        <span>Get Up to <strong>40% OFF</strong> New-Season Styles</span>
        <button className="bg-gray-700 text-white px-3 py-1 text-xs font-bold hover:bg-gray-600">MEN</button>
        <button className="bg-gray-700 text-white px-3 py-1 text-xs font-bold hover:bg-gray-600">WOMEN</button>
        <span className="text-gray-400 text-xs">* Limited time only.</span>
      </div>

      {/* Barra central blanca */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">

        {/* Logo */}
        <Link to="/">
          <img
            src={logo}
            alt="Carib Zoom Inc"
            className="h-16"
            style={{ mixBlendMode: 'multiply' }}
          />
        </Link>

        {/* Barra de búsqueda */}
        <div className="flex flex-1 mx-8 bg-gray-100 rounded-full items-center px-5 py-3 gap-3">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none text-gray-600"
          />
          <div className="flex items-center gap-1 border-l border-gray-300 pl-4 cursor-pointer text-sm text-gray-500">
            <span>All Categories</span>
            <ChevronDown size={14} />
          </div>
          <Search size={18} className="text-gray-500 cursor-pointer" />
        </div>

        {/* Iconos derecha */}
        <div className="flex items-center gap-6 text-gray-700">
          <div className="flex items-center gap-2">
            <Phone size={32} className="text-gray-600" />
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Call Us Now</p>
              <p className="text-base font-bold text-gray-800">+(592) 613-7666</p>
            </div>
          </div>

          {user ? (
            <div className="cursor-pointer" onClick={logout}>
              <User size={26} className="text-gray-600" />
            </div>
          ) : (
            <Link to="/login">
              <User size={26} className="text-gray-600 hover:text-blue-600" />
            </Link>
          )}

          <button>
            <Heart size={26} className="text-gray-600 hover:text-red-500" />
          </button>

          <Link to="/cart" className="relative">
            <ShoppingCart size={26} className="text-gray-600 hover:text-blue-600" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {isAdmin && (
            <Link to="/admin" className="text-red-600 font-bold text-sm hover:text-red-800">Admin</Link>
          )}
        </div>
      </div>

      {/* Barra inferior azul */}
      <div className="bg-[#1a9fd4] px-6 py-3 flex items-center">
        <div className="flex items-center gap-8 text-sm font-bold uppercase">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={
                isActive(to)
                  ? 'text-white border-b-2 border-white pb-0.5'
                  : 'text-white/80 hover:text-white'
              }
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

    </header>
  )
}

export default Navbar