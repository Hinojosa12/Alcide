import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { useState, useEffect } from 'react'

function Brands() {
  const [banners, setBanners] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/brands`)
      .then(res => res.json())
      .then(data => setBanners(data))
      .catch(() => {})
  }, [])

  if (banners.length === 0) return null

  // Loop solo si hay suficientes slides para evitar el warning
  const enableLoop = banners.length >= 6

  return (
    <section className="py-12 px-6">
      <h2 className="text-2xl font-bold text-center mb-8 uppercase tracking-widest">
        Browse Our Brands
      </h2>
      <Swiper
        modules={[Autoplay, Navigation]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        speed={1000}
        navigation
        loop={enableLoop}
        slidesPerView={3}
        spaceBetween={20}
        breakpoints={{
          0:    { slidesPerView: 1 },
          768:  { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative rounded-lg overflow-hidden h-52 cursor-pointer">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h3 className="text-white text-lg font-bold">{banner.title}</h3>
                <p className="text-white text-sm mb-2">{banner.description}</p>
                <button className="bg-white text-gray-800 px-4 py-1 rounded text-sm font-semibold hover:bg-gray-100 transition">
                  {banner.button_text || 'Shop Now'}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default Brands