import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { useState, useEffect } from 'react'

function elementStyle(el) {
  return {
    color:      el.color || '#ffffff',
    fontFamily: el.font  || 'inherit',
    fontSize:   `${el.size || 14}px`,
    fontWeight: el.bold  ? 'bold'   : 'normal',
    fontStyle:  el.italic ? 'italic' : 'normal',
    lineHeight: 1.3,
    whiteSpace: 'pre-wrap',
    wordBreak:  'break-word',
    display:    'block',
  }
}

function BrandCard({ banner }) {
  const elements = banner.elements
  return (
    <div className="relative rounded-lg overflow-hidden h-52 cursor-pointer">
      <img src={banner.image} alt={banner.title} className="w-full h-full object-cover"/>
      {elements && elements.length > 0
        ? elements.map(el => {
            if (!el.text) return null
            const w = el.width || 80
            if (el.id === 'btn') {
              return (
                <div key={el.id} className="absolute" style={{ left:`${el.x}%`, top:`${el.y}%`, width:`${w}%` }}>
                  <span className="inline-block bg-white text-gray-800 px-4 py-1 rounded text-xs font-semibold" style={{color:el.color||'#333333'}}>{el.text}</span>
                </div>
              )
            }
            return (
              <div key={el.id} className="absolute" style={{ left:`${el.x}%`, top:`${el.y}%`, width:`${w}%` }}>
                <span style={elementStyle(el)}>{el.text}</span>
              </div>
            )
          })
        : (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h3 className="text-white text-lg font-bold">{banner.title}</h3>
            <p className="text-white text-sm mb-2">{banner.description}</p>
            {banner.button_text && <button className="bg-white text-gray-800 px-4 py-1 rounded text-sm font-semibold">{banner.button_text}</button>}
          </div>
        )
      }
    </div>
  )
}

function Brands() {
  const [banners, setBanners] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/brands`)
      .then(r => r.json())
      .then(setBanners)
      .catch(() => {})
  }, [])

  if (banners.length === 0) return null

  return (
    <section className="py-12 px-6">
      <h2 className="text-2xl font-bold text-center mb-8 uppercase tracking-widest">Browse Our Brands</h2>
      <Swiper modules={[Autoplay, Navigation]}
        autoplay={{ delay:4000, disableOnInteraction:false }}
        speed={1000} navigation loop={banners.length >= 6}
        slidesPerView={3} spaceBetween={20}
        breakpoints={{ 0:{slidesPerView:1}, 768:{slidesPerView:2}, 1024:{slidesPerView:3} }}>
        {banners.map(banner => (
          <SwiperSlide key={banner.id}>
            <BrandCard banner={banner}/>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default Brands