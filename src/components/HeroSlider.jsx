import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

function HeroSlider() {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      autoplay={{ delay: 4000 }}
      pagination={{ clickable: true }}
      navigation
      loop
      className="w-full h-[500px]"
    >
      <SwiperSlide>
        <div className="w-full h-full bg-[#1a1a2e] flex flex-col items-center justify-center text-white text-center px-10">
          <p className="text-lg mb-2">D'Jango Gentleman's Apparel</p>
          <h1 className="text-5xl font-bold mb-4">Summer Sale</h1>
          <p className="text-6xl font-extrabold text-yellow-400 mb-2">70% OFF</p>
          <p className="mb-6">Starting at <strong>$19,999</strong></p>
          <button className="bg-yellow-400 text-black font-bold px-8 py-3 rounded hover:bg-yellow-300">
            SHOP NOW
          </button>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="w-full h-full bg-[#2d6a4f] flex flex-col items-center justify-center text-white text-center px-10">
          <p className="text-lg mb-2">Summer Sale</p>
          <h1 className="text-5xl font-bold mb-4">EXTRA 20% OFF</h1>
          <p className="text-2xl mb-6">Accessories</p>
          <button className="bg-white text-green-800 font-bold px-8 py-3 rounded hover:bg-gray-100">
            SHOP ALL SALE
          </button>
        </div>
      </SwiperSlide>
    </Swiper>
  )
}

export default HeroSlider