function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase tracking-widest">Contact Info</h3>
          <p className="text-sm text-gray-400 mb-2">📍 811 Tuschen Housing Scheme East Bank Essequibo</p>
          <p className="text-sm text-gray-400 mb-2">📞 (592) 502-8875 / 613-7666</p>
          <p className="text-sm text-gray-400 mb-2">✉️ info@carib-zoom.com</p>
          <p className="text-sm text-gray-400">🕐 Mon - Sat: 7:00 AM - 10:00 PM</p>
          <p className="text-sm text-gray-400">🕐 Sun: 7:00 AM - 8:00 PM</p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4 uppercase tracking-widest">Customer Service</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="hover:text-white cursor-pointer">Help & FAQs</li>
            <li className="hover:text-white cursor-pointer">Order Tracking</li>
            <li className="hover:text-white cursor-pointer">Shipping & Delivery</li>
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">My Account</li>
            <li className="hover:text-white cursor-pointer">Privacy</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4 uppercase tracking-widest">Newsletter</h3>
          <p className="text-sm text-gray-400 mb-4">Get all the latest information on events, sales and offers.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email..."
              className="flex-1 px-4 py-2 rounded-l text-gray-800 text-sm outline-none"
            />
            <button className="bg-blue-600 px-4 py-2 rounded-r text-sm font-semibold hover:bg-blue-700 transition">
              Subscribe
            </button>
          </div>
        </div>

      </div>
      <div className="border-t border-gray-700 text-center py-4 text-xs text-gray-500">
        © Carib-Zoom Inc. 2025. All Rights Reserved
      </div>
    </footer>
  )
}

export default Footer