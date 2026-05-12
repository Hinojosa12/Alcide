import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { Heart, Search, ShoppingCart } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

function NewArrivals() {
  const [products, setProducts] = useState([])
  const { addToCart } = useCart()

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data.slice(-5)))
      .catch(() => {})
  }, [])

  return (
    <section className="py-12 px-6">
      <h2 className="text-2xl font-bold text-center mb-8 uppercase tracking-widest">
        New Arrivals
      </h2>
      <Swiper
        modules={[Autoplay, Navigation]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        speed={800}
        navigation
        loop
        slidesPerView={5}
        spaceBetween={20}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden group">
              <div className="relative overflow-hidden h-56">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-1000 ease-in-out group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white rounded-full w-9 h-9 flex items-center justify-center shadow hover:bg-gray-100">
                    <Heart size={16} className="text-gray-600" />
                  </button>
                  <button className="bg-white rounded-full w-9 h-9 flex items-center justify-center shadow hover:bg-gray-100">
                    <Search size={16} className="text-gray-600" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-blue-600 py-3 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <ShoppingCart size={16} className="text-white" />
                  <button
                    onClick={() => addToCart(product)}
                    className="text-white text-sm font-bold uppercase tracking-widest"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{product.category}</p>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">{product.name}</h3>
                <div className="flex gap-1 mb-2">
                  {[1,2,3,4,5].map(star => (
                    <span key={star} className="text-gray-300 text-sm">★</span>
                  ))}
                </div>
                {product.price > 0 && (
                  <p className="text-gray-900 font-bold text-lg">${product.price.toLocaleString()}</p>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default NewArrivals