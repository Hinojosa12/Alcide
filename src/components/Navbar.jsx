function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between">
      <img 
        src="https://carib.adityaprasad.dev/wordpress/wp-content/uploads/2025/10/Carib-Zoom-Inc-Logo-.jpg" 
        alt="Carib Zoom" 
        className="h-14"
      />
      <ul className="flex gap-6 text-sm font-semibold text-gray-700">
        <li className="hover:text-blue-600 cursor-pointer">Shop</li>
        <li className="hover:text-blue-600 cursor-pointer">Brands</li>
        <li className="hover:text-blue-600 cursor-pointer">My Orders</li>
        <li className="hover:text-blue-600 cursor-pointer">About Us</li>
      </ul>
      <div className="flex items-center gap-4 text-gray-600 text-sm">
        <span>📞 +(592) 613-7666</span>
        <span className="cursor-pointer">❤️ Wishlist</span>
        <span className="cursor-pointer">🛒 Cart</span>
      </div>
    </nav>
  )
}

export default Navbar