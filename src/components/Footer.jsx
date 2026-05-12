function Footer() {
  const tags = [
    'Art Supplies', 'baby essentials', 'birthday balloons', 'birthday cups',
    'Birthday Favor Bag', 'birthday party accessories', 'Birthday Party Supplies',
    'birthday party tissues', 'birthday plates', 'Black Lingerie', 'cupcake display stand',
    'dessert stand', 'Detox Tea', 'disposable cups', 'disposable napkins',
    'disposable plates', 'foil balloons', 'Goodie Bag', 'hair treatment',
    'Herbal Tea', 'intimate wear', 'Kids Party Bag', 'kids party balloons',
    'kids party decorations', 'Kids Party Supplies', 'Kitchen Appliance',
    'kitchen organizer', 'Lace Lingerie', 'natural hair care', 'party decorations',
    'party table cover', 'plastic table cover', 'romantic lingerie', 'Sexy Lingerie',
    'Shoulder Bag', 'themed party cups', 'themed party decorations', 'themed party hats',
    'themed party napkins', 'themed party plates', 'Travel Bag', 'Treat Bag',
    'unisex perfume', 'Wellness Tea', "women's lingerie"
  ]

  return (
    <footer className="bg-[#1c1f2a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Contact Info */}
        <div>
          <h3 className="text-sm font-bold mb-6 uppercase tracking-widest">Contact Info</h3>
          <div className="flex flex-col gap-4 text-sm text-gray-400">
            <div>
              <p className="text-white font-semibold text-xs uppercase mb-1">Address:</p>
              <p>Lot 811 Tuschen Housing Scheme</p>
              <p>Essequibo Island-West Demerara, Guyana</p>
            </div>
            <div>
              <p className="text-white font-semibold text-xs uppercase mb-1">Phone:</p>
              <p>(+592) 613 7666</p>
            </div>
            <div>
              <p className="text-white font-semibold text-xs uppercase mb-1">Email:</p>
              <p>info@carib-zoom.com</p>
            </div>
            <div>
              <p className="text-white font-semibold text-xs uppercase mb-1">Working Days/Hours:</p>
              <p>Mon - Sun / 8:00 AM - 5:00 PM</p>
            </div>
            <div className="flex gap-3 mt-2">
              <a href="#" className="bg-gray-700 w-8 h-8 flex items-center justify-center rounded hover:bg-blue-600 transition text-white font-bold text-xs">f</a>
              <a href="#" className="bg-gray-700 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-600 transition text-white font-bold text-xs">𝕏</a>
              <a href="#" className="bg-gray-700 w-8 h-8 flex items-center justify-center rounded hover:bg-pink-600 transition text-white font-bold text-xs">ig</a>
            </div>
          </div>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-sm font-bold mb-6 uppercase tracking-widest">Customer Service</h3>
          <ul className="flex flex-col gap-3 text-sm text-gray-400">
            <li className="hover:text-white cursor-pointer transition">Help & FAQs</li>
            <li className="hover:text-white cursor-pointer transition">Order Tracking</li>
            <li className="hover:text-white cursor-pointer transition">Shipping & Delivery</li>
            <li className="hover:text-white cursor-pointer transition">Orders History</li>
            <li className="hover:text-white cursor-pointer transition">Advanced Search</li>
            <li className="hover:text-white cursor-pointer transition">My Account</li>
            <li className="hover:text-white cursor-pointer transition">Careers</li>
            <li className="hover:text-white cursor-pointer transition">About Us</li>
            <li className="hover:text-white cursor-pointer transition">Corporate Sales</li>
            <li className="hover:text-white cursor-pointer transition">Privacy</li>
          </ul>
        </div>

        {/* Popular Tags */}
        <div>
          <h3 className="text-sm font-bold mb-6 uppercase tracking-widest">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="border border-gray-600 text-gray-400 text-xs px-2 py-1 hover:border-white hover:text-white cursor-pointer transition"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Subscribe Newsletter */}
        <div>
          <h3 className="text-sm font-bold mb-6 uppercase tracking-widest">Subscribe Newsletter</h3>
          <p className="text-sm text-gray-400 mb-4">Get all the latest information on events, sales and offers. Sign up for newsletter:</p>
          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email address"
              className="bg-gray-800 border border-gray-600 text-white px-4 py-2 text-sm outline-none focus:border-blue-500"
            />
            <button className="bg-blue-600 text-white py-2 text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition">
              Subscribe
            </button>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-4">
          <p className="text-xs text-gray-500">© Porto eCommerce. 2026. All Rights Reserved</p>
          <div className="flex items-center gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-5 object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/PayPal_Logo_Icon_2014.svg/200px-PayPal_Logo_Icon_2014.svg.png" alt="PayPal" className="h-5 object-contain" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer