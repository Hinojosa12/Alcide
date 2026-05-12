import { useState, useEffect } from 'react'

const SIZE_STYLES = {
  square: { gridColumn: 'span 1', gridRow: 'span 1' },
  wide:   { gridColumn: 'span 2', gridRow: 'span 1' },
  tall:   { gridColumn: 'span 1', gridRow: 'span 2' },
  big:    { gridColumn: 'span 2', gridRow: 'span 2' },
}

function BrandCard({ banner }) {
  const spanStyle = SIZE_STYLES[banner.size] || SIZE_STYLES.square
  const textColor = banner.text_color || '#1a1a1a'
  const x = banner.text_x ?? 5
  const y = banner.text_y ?? 20

  return (
    <div className="relative overflow-hidden cursor-pointer group" style={{ ...spanStyle, minHeight: 260 }}>
      <img
        src={banner.image}
        alt={banner.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      {/* Texto posicionado según x,y */}
      <div
        className="absolute z-10 flex flex-col items-start"
        style={{ left: `${x}%`, top: `${y}%`, maxWidth: '55%' }}
      >
        {banner.description && (
          <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: textColor, opacity: 0.7 }}>
            {banner.description}
          </p>
        )}
        {banner.title && (
          <h3 className="font-extrabold text-2xl leading-tight uppercase mb-3" style={{ color: textColor }}>
            {banner.title}
          </h3>
        )}
        <div className="w-16 border-t-2 mb-4" style={{ borderColor: textColor, opacity: 0.4 }} />
        {banner.button_text && (
          <a href={banner.button_url || '#'}
            className="inline-block bg-[#1a9fd4] text-white text-xs font-bold px-5 py-2 uppercase tracking-widest hover:bg-blue-700 transition mb-3">
            {banner.button_text}
          </a>
        )}
        {banner.whatsapp && (
          <a href={`https://wa.me/${banner.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 bg-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-green-600 transition">
            <svg className="w-4 h-4 fill-white flex-shrink-0" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Reach us on Whatsapp!
          </a>
        )}
      </div>
    </div>
  )
}

export default function BrandsPage() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/shop-brands`)
      .then(res => res.json())
      .then(data => { setBanners(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center items-center h-64"><p className="text-gray-400">Loading...</p></div>
  if (banners.length === 0) return (
    <div className="max-w-screen-xl mx-auto px-3 py-16 text-center text-gray-400">
      No brands yet. Add some from Admin → 🛍 Shop Our Brands.
    </div>
  )

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
        {banners.map(banner => <BrandCard key={banner.id} banner={banner} />)}
      </div>
    </div>
  )
}