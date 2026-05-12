import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { useState, useEffect } from 'react'
import slider1 from '../assets/slider1.png'

function elementStyle(el) {
  return {
    color:      el.color  || '#1a1a1a',
    fontFamily: el.font   || 'inherit',
    fontSize:   `${el.size || 16}px`,
    fontWeight: el.bold   ? 'bold'   : 'normal',
    fontStyle:  el.italic ? 'italic' : 'normal',
    lineHeight: 1.2,
    whiteSpace: 'pre-wrap',
    wordBreak:  'break-word',
    display:    'block',
  }
}

function HeroSlider() {
  const [slides, setSlides] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/slides`)
      .then(r => r.json())
      .then(setSlides)
      .catch(() => {})
  }, [])

  const defaultSlides = [{
    id:'default1', image:slider1,
    title:'Summer Sale', subtitle:'70% OFF',
    description:'Starting At $199.99', button_text:'SHOP NOW!', button_url:'/shop',
    elements: null
  }]

  const displaySlides = slides.length > 0 ? slides : defaultSlides

  return (
    <Swiper modules={[Autoplay, Pagination, Navigation]}
      autoplay={{ delay:5000, disableOnInteraction:false }}
      speed={1200} pagination={{ clickable:true }} navigation
      loop={displaySlides.length > 1}
      className="w-full" style={{ height:'600px' }}>
      {displaySlides.map(slide => (
        <SwiperSlide key={slide.id}>
          <div className="w-full h-full relative">
            {slide.image
              ? <img src={slide.image} alt={slide.title} className="w-full h-full object-cover"/>
              : <div className="w-full h-full bg-white"/>
            }
            {slide.elements && slide.elements.length > 0
              ? slide.elements.map(el => {
                  if (!el.text) return null
                  const w = el.width || 40
                  if (el.id === 'btn') {
                    return (
                      <a key={el.id} href={el.url||'/shop'}
                        className="absolute inline-block bg-gray-900 text-white px-8 py-3 font-bold uppercase tracking-widest hover:bg-gray-700 transition"
                        style={{ left:`${el.x}%`, top:`${el.y}%`, width:`${w}%` }}>
                        <span style={elementStyle(el)}>{el.text}</span>
                      </a>
                    )
                  }
                  return (
                    <div key={el.id} className="absolute" style={{ left:`${el.x}%`, top:`${el.y}%`, width:`${w}%` }}>
                      <span style={elementStyle(el)}>{el.text}</span>
                    </div>
                  )
                })
              : (
                // Legacy fallback
                <div className="absolute flex flex-col items-start" style={{ left:'8%', top:'30%', maxWidth:'45%' }}>
                  {slide.title    && <h1 className="text-6xl font-bold italic text-gray-900 leading-tight mb-2">{slide.title}</h1>}
                  {slide.subtitle && <h2 className="text-7xl font-black text-gray-900 mb-4">{slide.subtitle}</h2>}
                  {slide.description && <p className="text-gray-600 mb-6">{slide.description}</p>}
                  {slide.button_text && <a href={slide.button_url||'/shop'} className="bg-gray-900 text-white px-8 py-3 font-bold uppercase tracking-widest hover:bg-gray-700 transition">{slide.button_text}</a>}
                </div>
              )
            }
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default HeroSlider