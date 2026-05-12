import { useState, useEffect } from 'react'

const SIZE_STYLES = {
  square: { gridColumn:'span 1', gridRow:'span 1' },
  wide:   { gridColumn:'span 2', gridRow:'span 1' },
  tall:   { gridColumn:'span 1', gridRow:'span 2' },
  big:    { gridColumn:'span 2', gridRow:'span 2' },
}

function elementStyle(el) {
  return {
    color:      el.color || '#1a1a1a',
    fontFamily: el.font  || 'inherit',
    fontSize:   `${el.size || 16}px`,
    fontWeight: el.bold  ? 'bold'   : 'normal',
    fontStyle:  el.italic ? 'italic' : 'normal',
    lineHeight: 1.2,
    whiteSpace: 'pre-wrap',
    wordBreak:  'break-word',
    display:    'block',
  }
}

function BrandCard({ banner }) {
  const spanStyle = SIZE_STYLES[banner.size] || SIZE_STYLES.square
  const elements  = banner.elements

  return (
    <div className="relative overflow-hidden cursor-pointer group" style={{ ...spanStyle, minHeight:260 }}>
      <img src={banner.image} alt={banner.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>

      {elements && elements.length > 0
        ? elements.map(el => {
            if (!el.text) return null
            const w = el.width || 40
            if (el.id === 'btn') {
              return (
                <div key={el.id} className="absolute z-10" style={{ left:`${el.x}%`, top:`${el.y}%`, width:`${w}%` }}>
                  <a href={el.url||'#'} className="inline-block bg-[#1a9fd4] text-white text-xs font-bold px-5 py-2 uppercase tracking-widest hover:bg-blue-700 transition">
                    {el.text}
                  </a>
                </div>
              )
            }
            if (el.id === 'wa') {
              return (
                <div key={el.id} className="absolute z-10" style={{ left:`${el.x}%`, top:`${el.y}%` }}>
                  <a href={`https://wa.me/${banner.whatsapp?.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 bg-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-green-600 transition">
                    📱 Reach us on Whatsapp!
                  </a>
                </div>
              )
            }
            return (
              <div key={el.id} className="absolute z-10" style={{ left:`${el.x}%`, top:`${el.y}%`, width:`${w}%` }}>
                <span style={elementStyle(el)}>{el.text}</span>
              </div>
            )
          })
        : (
          <div className="absolute inset-0 flex flex-col justify-between p-5 z-10">
            <div>
              {banner.description && <p className="text-white text-xs uppercase tracking-widest mb-1 opacity-75">{banner.description}</p>}
              {banner.title && <h3 className="text-white font-extrabold text-2xl uppercase leading-tight">{banner.title}</h3>}
            </div>
            <div className="flex flex-col gap-2 items-start">
              {banner.button_text && <a href={banner.button_url||'#'} className="bg-[#1a9fd4] text-white text-xs font-bold px-5 py-2 uppercase">{banner.button_text}</a>}
              {banner.whatsapp && (
                <a href={`https://wa.me/${banner.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  📱 Reach us on Whatsapp!
                </a>
              )}
            </div>
          </div>
        )
      }
      {banner.whatsapp && elements && elements.length > 0 && !elements.find(e=>e.id==='wa') && (
        <a href={`https://wa.me/${banner.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
          className="absolute bottom-3 left-3 z-10 flex items-center gap-2 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-green-600 transition">
          📱 Reach us on Whatsapp!
        </a>
      )}
    </div>
  )
}

export default function BrandsPage() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/shop-brands`)
      .then(r => r.json())
      .then(data => { setBanners(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center items-center h-64"><p className="text-gray-400">Loading...</p></div>
  if (banners.length === 0) return <div className="max-w-screen-xl mx-auto px-3 py-16 text-center text-gray-400">No brands yet.</div>

  return (
    <div className="max-w-screen-xl mx-auto px-3 py-10">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        <span>›</span>
        <span className="text-gray-500 font-medium text-xs tracking-widest uppercase">Shop Our Brands</span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gridAutoRows:'260px', gap:'4px' }}>
        {banners.map(b => <BrandCard key={b.id} banner={b}/>)}
      </div>
    </div>
  )
}