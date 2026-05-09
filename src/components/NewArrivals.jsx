const newArrivals = [
  {
    id: 1,
    name: "Portable Satin Baby Bed",
    price: "$4,500",
    image: "https://site.carib-zoom.com/wp-content/uploads/2026/05/163-300x300.png",
    category: "Parent & Baby Essentials",
  },
  {
    id: 2,
    name: "Baby Portable Bed - Small",
    price: "$3,500",
    image: "https://site.carib-zoom.com/wp-content/uploads/2026/05/158-300x300.png",
    category: "Parent & Baby Essentials",
  },
  {
    id: 3,
    name: "Mielle Rosemary Mint Full Hair Care Set",
    price: "$6,000",
    image: "https://site.carib-zoom.com/wp-content/uploads/2026/05/486-300x300.png",
    category: "Beauty & Styling",
  },
  {
    id: 4,
    name: "Kids Learning Foam Clock",
    price: "$1,000",
    image: "https://site.carib-zoom.com/wp-content/uploads/2026/05/355-300x300.png",
    category: "Stationery & School Supplies",
  },
  {
    id: 5,
    name: "Batana Oil Full Hair Care Set",
    price: "$6,500",
    image: "https://site.carib-zoom.com/wp-content/uploads/2026/04/103-300x300.png",
    category: "Beauty & Styling",
  },
]

function NewArrivals() {
  return (
    <section className="py-12 px-6">
      <h2 className="text-2xl font-bold text-center mb-8 uppercase tracking-widest">
        New Arrivals
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {newArrivals.map((product) => (
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
              <p className="text-blue-600 font-bold">{product.price}</p>
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

export default NewArrivals