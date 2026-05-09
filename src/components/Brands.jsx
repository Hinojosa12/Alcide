const brands = [
  {
    name: "D'Jango Gentleman's Apparel",
    description: "Every detail matters. Elevate your style with meticulously crafted men's accessories.",
    bg: "bg-gray-900",
    text: "text-white",
  },
  {
    name: "Blast Zone",
    description: "Discover the Joy of Bouncing Fun. Quality bounce houses for any event.",
    bg: "bg-blue-600",
    text: "text-white",
  },
  {
    name: "Destiny's Clothing",
    description: "Soft on Skin, Big On Comfort. Gentle fabrics designed for your little one.",
    bg: "bg-pink-100",
    text: "text-gray-800",
  },
  {
    name: "Home Essentials",
    description: "Upgrade Your Kitchen. Smart Appliances for Every Home.",
    bg: "bg-yellow-400",
    text: "text-gray-900",
  },
  {
    name: "Hope Jewelry",
    description: "New Arrival Jewelry Collection.",
    bg: "bg-purple-700",
    text: "text-white",
  },
  {
    name: "Pieces Plus Sized",
    description: "Empower Your Every Curve. Lingeries, Underwears, Skincare, Hair Care.",
    bg: "bg-rose-500",
    text: "text-white",
  },
  {
    name: "The Office Depot",
    description: "Bright Tools for Bright Futures. Stationery That Inspires Every Idea.",
    bg: "bg-orange-400",
    text: "text-white",
  },
]

function Brands() {
  return (
    <section className="py-12 px-6">
      <h2 className="text-2xl font-bold text-center mb-8 uppercase tracking-widest">
        Browse Our Brands
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {brands.map((brand) => (
          <div
            key={brand.name}
            className={`${brand.bg} ${brand.text} rounded-lg p-6 flex flex-col justify-between min-h-[160px] cursor-pointer hover:opacity-90 transition`}
          >
            <h3 className="text-lg font-bold mb-2">{brand.name}</h3>
            <p className="text-sm">{brand.description}</p>
            <button className="mt-4 text-sm font-semibold underline text-left">
              Shop Now →
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Brands