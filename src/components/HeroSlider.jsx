import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { useState, useEffect } from 'react'
import slider1 from '../assets/slider1.png'

function HeroSlider() {
  const [slides, setSlides] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/slides`)
      .then(res => res.json())
      .then(data => setSlides(data))
      .catch(() => {})
  }, [])

  const defaultSlides = [
    {
      id: 'default1',
      image: slider1,
      title: 'Summer Sale',
      subtitle: '70% OFF',
      description: 'Starting At $199.99',
      button_text: 'SHOP NOW!',
      button_url: '/shop'
    },
    {
      id: 'default2',
      image: null,
      title: 'EXTRA 20% OFF',
      subtitle: 'Accessories',
      description: 'Summer Sale',
      button_text: 'SHOP ALL SALE',
      button_url: '/shop'
    }
  ]

  const displaySlides = slides.length > 0 ? slides : defaultSlides

  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      speed={1200}
      pagination={{ clickable: true }}
      navigation
      loop
      className="w-full"
      style={{ height: '600px' }}
    >
      {displaySlides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="w-full h-full relative">
            {slide.image ? (
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-white" />
            )}
            <div className="absolute top-0 left-0 h-full w-1/2 flex flex-col justify-center px-16">
              <h1 className="text-6xl font-bold italic text-gray-900 leading-tight mb-2">{slide.title}</h1>
              <h2 className="text-7xl font-black text-gray-900 mb-4">{slide.subtitle}</h2>
              <p className="text-gray-600 mb-6">{slide.description}</p>
              {slide.button_text && (
                <div>
                  <a href={slide.button_url || '/shop'} className="bg-gray-900 text-white px-8 py-3 font-bold uppercase tracking-widest hover:bg-gray-700 transition inline-block">{slide.button_text}</a>
                </div>
              )}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default HeroSlider