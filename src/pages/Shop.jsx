import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { ChevronDown, Minus, ShoppingCart, LayoutGrid, AlignJustify } from 'lucide-react'

const COLORS = [
  { name: 'Black',      hex: '#222' },
  { name: 'Blue',       hex: '#3b82f6' },
  { name: 'Green',      hex: '#22c55e' },
  { name: 'Indigo',     hex: '#6366f1' },
  { name: 'Light Blue', hex: '#7dd3fc' },
  { name: 'Red',        hex: '#ef4444' },
  { name: 'Yellow',     hex: '#eab308' },
]
const SIZES = ['XL', 'L', 'M', 'S']
const PAGE_SIZE_OPTIONS = [9, 18, 27]
const DEFAULT_BANNER = {
  image: '', top_text: 'Find the Boundaries. Push Through!',
  title: 'Summer Sale', subtitle: '30% OFF',
  price_text: '$19999', button_text: 'GET YOURS!',
  button_url: '/shop'
}

function StarRating({ rating = 0 }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  )
}

function SideSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-200 py-6">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full mb-4">
        <span className="text-[22px] font-bold text-gray-900">{title}</span>
        {open ? <Minus size={18} className="text-gray-500 flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-500 flex-shrink-0" />}
      </button>
      {open && children}
    </div>
  )
}

export default function Shop() {
  const [products, setProducts]                 = useState([])
  const [banner, setBanner]                     = useState(DEFAULT_BANNER)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [search, setSearch]                     = useState('')
  const [loading, setLoading]                   = useState(true)
  const [selectedBrands, setSelectedBrands]     = useState([])
  const [maxPrice, setMaxPrice]                 = useState(40000)
  const [priceMax, setPriceMax]                 = useState(40000)
  const [sortBy, setSortBy]                     = useState('default')
  const [pageSize, setPageSize]                 = useState(9)
  const [currentPage, setCurrentPage]           = useState(1)
  const [viewMode, setViewMode]                 = useState('grid')
  const { addToCart } = useCart()

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/products`).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/shop-banner`).then(r => r.json()),
    ]).then(([prods, ban]) => {
      setProducts(prods)
      const top = Math.max(...prods.map(p => p.price || 0), 40000)
      setMaxPrice(top)
      setPriceMax(top)
      if (ban && ban.id) setBanner({ ...DEFAULT_BANNER, ...ban })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const allCategories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))]
  const allBrands     = [...new Set(products.map(p => p.brand).filter(Boolean))]
  const countFor      = cat => cat === 'All' ? products.length : products.filter(p => p.category === cat).length

  const toggleBrand = brand => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])
    setCurrentPage(1)
  }

  let filtered = products.filter(p => {
    const matchCat    = selectedCategory === 'All' || p.category === selectedCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchBrand  = selectedBrands.length === 0 || selectedBrands.includes(p.brand)
    const matchPrice  = (p.price || 0) <= priceMax
    return matchCat && matchSearch && matchBrand && matchPrice
  })

  if (sortBy === 'price-asc')  filtered = [...filtered].sort((a,b) => (a.price||0)-(b.price||0))
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a,b) => (b.price||0)-(a.price||0))
  if (sortBy === 'name')       filtered = [...filtered].sort((a,b) => a.name.localeCompare(b.name))

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginated  = filtered.slice((currentPage-1)*pageSize, currentPage*pageSize)
  const featured   = products.slice(0, 3)

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-gray-400 text-lg">Loading products...</p>
    </div>
  )

  const bannerStyle = banner.image
    ? { minHeight: 220, backgroundImage: `url(${banner.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { minHeight: 220, background: '#2d8a6e' }

  return (
    <div className="max-w-screen-xl mx-auto px-16 py-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        <span>›</span>
        <span className="text-gray-500 font-medium text-xs tracking-widest uppercase">Shop</span>
      </div>

      <div className="flex gap-12">

        {/* ── SIDEBAR ── */}
        <aside className="w-80 flex-shrink-0">
          <SideSection title="Categories">
            <ul className="space-y-3">
              {allCategories.map(cat => (
                <li key={cat} className="flex items-center justify-between">
                  <button
                    onClick={() => { setSelectedCategory(cat); setCurrentPage(1) }}
                    className={`text-[16px] text-left transition-colors leading-snug ${selectedCategory === cat ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}
                  >{cat}</button>
                  <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                    <span className="text-[14px] text-gray-400">({countFor(cat)})</span>
                    {cat !== 'All' && <ChevronDown size={14} className="text-gray-400" />}
                  </div>
                </li>
              ))}
            </ul>
          </SideSection>

          <SideSection title="Price">
            <div>
              <input type="range" min={0} max={maxPrice} value={priceMax}
                onChange={e => { setPriceMax(Number(e.target.value)); setCurrentPage(1) }}
                className="w-full accent-blue-600" />
              <p className="text-[14px] text-gray-500 mt-2">Price: $0 — ${priceMax.toLocaleString()}</p>
              <button onClick={() => setCurrentPage(1)} className="mt-3 bg-gray-800 text-white text-xs font-semibold px-5 py-2 hover:bg-gray-700 transition">Filter</button>
            </div>
          </SideSection>

          {allBrands.length > 0 && (
            <SideSection title="Brands">
              <div className="space-y-3">
                {allBrands.map(brand => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} className="w-4 h-4 accent-blue-600" />
                    <span className="text-[15px] text-gray-600">{brand}</span>
                  </label>
                ))}
              </div>
            </SideSection>
          )}

          <SideSection title="Color">
            <div className="space-y-3">
              {COLORS.map(c => (
                <label key={c.name} className="flex items-center gap-3 cursor-pointer">
                  <span className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0" style={{ backgroundColor: c.hex }} />
                  <span className="text-[15px] text-gray-600">{c.name}</span>
                </label>
              ))}
            </div>
          </SideSection>

          <SideSection title="Sizes">
            <div className="flex gap-2">
              {SIZES.map(s => (
                <button key={s} className="border border-gray-300 text-sm font-medium px-4 py-1.5 hover:border-gray-700 hover:bg-gray-50 transition">{s}</button>
              ))}
            </div>
          </SideSection>

          <SideSection title="Featured">
            <div className="space-y-4">
              {featured.map(p => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-16 h-16 flex-shrink-0 border border-gray-100 bg-gray-50 overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-gray-700 leading-snug line-clamp-2">{p.name}</p>
                    {p.price > 0 && <p className="text-[13px] text-gray-700 font-semibold mt-0.5">${p.price.toLocaleString()}</p>}
                  </div>
                </div>
              ))}
            </div>
          </SideSection>
        </aside>

        {/* ── MAIN ── */}
        <div className="flex-1 min-w-0">

          {/* Banner dinámico */}
          <div className="w-full rounded overflow-hidden mb-6 relative flex items-center px-10 py-8 text-white" style={bannerStyle}>
            <div className="absolute left-20 top-6  w-20 h-20 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute left-36 top-3  w-14 h-14 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute left-8  top-20 w-8  h-8  rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute left-10 bottom-6 w-6 h-6 rounded-full bg-white/10 pointer-events-none" />
            <div className="relative z-10">
              <p className="text-sm font-medium tracking-wide mb-1 opacity-90">{banner.top_text}</p>
              <h2 className="text-5xl font-extrabold italic leading-tight" style={{ fontFamily: 'Georgia, serif' }}>{banner.title}</h2>
              <h2 className="text-5xl font-extrabold leading-tight mb-5">{banner.subtitle}</h2>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">Starting at</span>
                <span className="bg-red-500 text-white font-extrabold px-3 py-1 text-base leading-none">{banner.price_text}</span>
                <a href={banner.button_url} className="bg-gray-900 text-white text-sm font-bold px-6 py-2.5 hover:bg-gray-700 transition uppercase tracking-wide">
                  {banner.button_text}
                </a>
              </div>
            </div>
          </div>

          {/* Sort / Show / View */}
          <div className="flex items-center justify-between mb-4 py-2 border-b border-gray-200">
            <div className="flex items-center gap-3 text-[14px] text-gray-600">
              <span className="font-medium">Sort by:</span>
              <select value={sortBy} onChange={e => { setSortBy(e.target.value); setCurrentPage(1) }} className="border border-gray-200 text-[14px] px-3 py-1.5 outline-none text-gray-700 bg-white">
                <option value="default">Default sorting</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[14px] text-gray-600">
                <span className="font-medium">Show:</span>
                <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1) }} className="border border-gray-200 text-[14px] px-3 py-1.5 outline-none text-gray-700 bg-white">
                  {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 border ${viewMode==='grid' ? 'border-gray-500 text-gray-800' : 'border-gray-200 text-gray-400'}`}><LayoutGrid size={16}/></button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 border ${viewMode==='list' ? 'border-gray-500 text-gray-800' : 'border-gray-200 text-gray-400'}`}><AlignJustify size={16}/></button>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-5">
            <input type="text" placeholder="Search products..." value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
              className="border border-gray-200 px-4 py-2 text-[14px] w-64 outline-none focus:border-gray-400" />
          </div>

          {/* Products */}
          {paginated.length === 0 ? (
            <p className="text-center text-gray-400 mt-16 text-[15px]">No products found.</p>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-3 gap-5">
              {paginated.map(product => (
                <div key={product.id} className="group border border-gray-100 bg-white hover:shadow-md transition overflow-hidden cursor-pointer">

                  {/* Contenedor cuadrado — imagen completa + zoom al hover */}
                  <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: '1 / 1' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                    <button
                      onClick={() => addToCart(product)}
                      className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-xs font-bold py-2.5 uppercase tracking-wider opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2">
                      <ShoppingCart size={14} /> ADD TO CART
                    </button>
                  </div>

                  <div className="p-3">
                    <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">{product.category}</p>
                    <h3 className="text-[14px] text-gray-800 leading-snug mb-1.5 line-clamp-2">{product.name}</h3>
                    <StarRating rating={0} />
                    {product.price > 0 && <p className="text-[15px] font-bold text-gray-800 mt-1.5">${product.price.toLocaleString()}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {paginated.map(product => (
                <div key={product.id} className="flex gap-5 border border-gray-100 bg-white hover:shadow-md transition p-4">
                  <div className="w-28 h-28 flex-shrink-0 bg-gray-50 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-0.5">{product.category}</p>
                    <h3 className="text-[15px] font-semibold text-gray-800 mb-1">{product.name}</h3>
                    <StarRating rating={0} />
                    {product.price > 0 && <p className="text-[15px] font-bold text-gray-800 mt-1">${product.price.toLocaleString()}</p>}
                    <button onClick={() => addToCart(product)}
                      className="mt-3 bg-blue-600 text-white text-xs font-bold px-5 py-2 uppercase tracking-wider hover:bg-blue-700 transition flex items-center gap-2">
                      <ShoppingCart size={13} /> ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200">
              <p className="text-[13px] text-gray-500">
                Showing {Math.min((currentPage-1)*pageSize+1, filtered.length)}–{Math.min(currentPage*pageSize, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(p-1,1))} disabled={currentPage===1} className="w-8 h-8 flex items-center justify-center border border-gray-200 text-sm hover:bg-gray-100 disabled:opacity-30">‹</button>
                {Array.from({ length: totalPages }, (_,i) => i+1).map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center border text-sm transition ${currentPage===page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:bg-gray-100 text-gray-700'}`}>
                    {page}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(p+1,totalPages))} disabled={currentPage===totalPages} className="w-8 h-8 flex items-center justify-center border border-gray-200 text-sm hover:bg-gray-100 disabled:opacity-30">›</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}