const products = [
  {
    id: 1,
    name: "Coach Crossbody Bags",
    price: "$6,500",
    image: "https://site.carib-zoom.com/wp-content/uploads/2026/04/488-300x300.png",
    category: "Accessories",
  },
  {
    id: 2,
    name: "Black Horse Vital Honey Packs",
    price: "$1,000",
    image: "https://site.carib-zoom.com/wp-content/uploads/2026/04/72-300x300.png",
    category: "Male Wellness",
  },
  {
    id: 3,
    name: "Sokany Coffee Maker",
    price: "$12,000",
    image: "https://site.carib-zoom.com/wp-content/uploads/2025/10/Home-Essentials-Stock-3-2-300x300.png",
    category: "Appliances",
  },
  {
    id: 4,
    name: "Sokany 3-1 Breakfast Maker",
    price: "$15,000",
    image: "https://site.carib-zoom.com/wp-content/uploads/2025/10/437-300x300.png",
    category: "Appliances",
  },
  {
    id: 5,
    name: "Guess 3pcs Handbags",
    price: "",
    image: "https://site.carib-zoom.com/wp-content/uploads/2025/10/283-300x300.png",
    category: "Fashion & Accessories",
  },
  {
    id: 6,
    name: "7pcs Air-Tight Storage Containers",
    price: "$8,000",
    image: "https://site.carib-zoom.com/wp-content/uploads/2025/10/470-1-300x300.png",
    category: "Kitchen",
  },
  {
    id: 7,
    name: "Baby Feeding Chair",
    price: "$25,000",
    image: "https://site.carib-zoom.com/wp-content/uploads/2025/10/485-300x300.webp",
    category: "Parent & Baby Essentials",
  },
  {
    id: 8,
    name: "Baby Bedside Dell",
    price: "$5,000",
    image: "https://site.carib-zoom.com/wp-content/uploads/2025/10/433-1-300x300.webp",
    category: "Parent & Baby Essentials",
  },
]

function FeaturedProducts() {
  return (
    <section className="py-12 px-6 bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-8 uppercase tracking-widest">
        Featured Products
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <p className="text-xs text-gray-400 mb-1">{product.category}</p>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">{product.name}</h3>
              {product.price && (
                <p className="text-blue-600 font-bold">{product.price}</p>
              )}
              <button className="mt-3 w-full bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 transition">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedProducts