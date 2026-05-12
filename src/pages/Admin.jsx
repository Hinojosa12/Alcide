import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Toast({ message }) {
  if (!message) return null
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm font-semibold px-5 py-3 rounded-lg shadow-xl flex items-center gap-3"
      style={{ animation: 'slideIn 0.3s ease' }}>
      <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
      </svg>
      {message}
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}

// Preview with draggable text and correct aspect ratio per size
function BrandPreview({ form, onPositionChange }) {
  const containerRef = useRef(null)
  const dragging = useRef(false)

  // Height based on size
  const previewHeight = (form.size === 'tall' || form.size === 'big') ? 520 : 260
  const isDoubleWide = form.size === 'wide' || form.size === 'big'

  const getPos = useCallback((e, rect) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const x = Math.max(0, Math.min(75, ((clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(80, ((clientY - rect.top) / rect.height) * 100))
    return { x: Math.round(x), y: Math.round(y) }
  }, [])

  const onMove = useCallback((e) => {
    if (!dragging.current || !containerRef.current) return
    const { x, y } = getPos(e, containerRef.current.getBoundingClientRect())
    onPositionChange(x, y)
  }, [getPos, onPositionChange])

  const onUp = useCallback(() => { dragging.current = false }, [])

  useEffect(() => {
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [onMove, onUp])

  const textColor = form.text_color || '#1a1a1a'

  return (
    <div className="mt-2">
      <p className="text-sm font-medium text-gray-700 mb-2">
        👆 Preview — <span className="text-blue-600 font-semibold">haz clic para mover el texto</span>
        {isDoubleWide && <span className="ml-2 text-xs text-orange-500">(este card ocupa 2 columnas en la página)</span>}
      </p>
      <div
        ref={containerRef}
        className="relative bg-gray-200 overflow-hidden rounded select-none w-full"
        style={{ height: previewHeight, cursor: 'crosshair', transition: 'height 0.3s ease' }}
        onMouseDown={(e) => {
          dragging.current = true
          const { x, y } = getPos(e, containerRef.current.getBoundingClientRect())
          onPositionChange(x, y)
        }}
      >
        {form.image
          ? <img src={form.image} alt="preview" className="absolute inset-0 w-full h-full object-contain pointer-events-none" style={{ objectPosition: 'right center' }} />
          : <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm pointer-events-none">Sube una imagen para ver el preview</div>
        }

        {/* Text overlay */}
        <div className="absolute z-10 flex flex-col items-start pointer-events-none"
          style={{ left: `${form.text_x ?? 5}%`, top: `${form.text_y ?? 20}%`, maxWidth: '55%' }}>
          {form.description && (
            <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: textColor, opacity: 0.75 }}>
              {form.description}
            </p>
          )}
          {form.title && (
            <h3 className="font-extrabold text-xl leading-tight uppercase mb-2" style={{ color: textColor }}>
              {form.title}
            </h3>
          )}
          <div className="w-12 border-t-2 mb-3" style={{ borderColor: textColor, opacity: 0.4 }} />
          {form.button_text && (
            <span className="inline-block bg-[#1a9fd4] text-white text-xs font-bold px-4 py-1.5 uppercase mb-2">
              {form.button_text}
            </span>
          )}
          {form.whatsapp && (
            <span className="flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              📱 Reach us on Whatsapp!
            </span>
          )}
        </div>

        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded pointer-events-none">
          x:{form.text_x ?? 5}% y:{form.text_y ?? 20}%
        </div>
      </div>
    </div>
  )
}

const SIZE_LABELS = {
  square: '⬜ Square (1×1)', wide: '▬ Wide (2×1)',
  tall:   '▮ Tall (1×2)',   big:  '⬛ Big (2×2)',
}

const ABOUT_DEFAULT = {
  hero_subtitle:'Who We Are', hero_title:'About Us',
  hero_description:'We are your ultimate destination for quality, convenience, and style.',
  story_label:'Since 2019', story_heading:'Our story is one of growth, creativity, and purpose.',
  story_text:'Founded in March 2019, Carib-Zoom Inc began as a small social commerce venture.',
  story_image1:'', story_image2:'',
  mission_title:'Our Mission', mission_text:'',
  vision_title:'Our Vision',   vision_text:'',
  quality_title:'Our Quality', quality_text:'',
  team_title:'Our Team', team_image:'', team_text:'',
  promise_label:'Our Promise', promise_heading:'', promise_text:'', promise_image:'',
  stat1_number:'100,000+', stat1_label:'Sales in 8 Years',
  stat2_number:'99%',      stat2_label:'Customer Satisfaction Rate',
  stat3_number:'2,000+',   stat3_label:'Products Available',
}

const EMPTY_PRODUCT    = { name:'',price:'',image:'',category:'',brand:'',description:'' }
const EMPTY_SLIDE      = { image:'',title:'',subtitle:'',description:'',button_text:'',button_url:'',sort_order:0 }
const EMPTY_BROWSE     = { image:'',title:'',description:'',button_text:'',button_url:'',sort_order:0 }
const EMPTY_SHOPBRAND  = { image:'',title:'',description:'',button_text:'',button_url:'',whatsapp:'',size:'square',text_x:5,text_y:20,text_color:'#1a1a1a',sort_order:0 }
const EMPTY_FAQ        = { question:'',answer:'',sort_order:0 }

function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [products, setProducts]         = useState([])
  const [slides, setSlides]             = useState([])
  const [brandBanners, setBrandBanners] = useState([])
  const [shopBrands, setShopBrands]     = useState([])
  const [faqs, setFaqs]                 = useState([])
  const [activeTab, setActiveTab]       = useState('products')

  const [productForm, setProductForm]     = useState(EMPTY_PRODUCT)
  const [editProductId, setEditProductId] = useState(null)
  const [slideForm, setSlideForm]         = useState(EMPTY_SLIDE)
  const [editSlideId, setEditSlideId]     = useState(null)
  const [browseForm, setBrowseForm]       = useState(EMPTY_BROWSE)
  const [editBrowseId, setEditBrowseId]   = useState(null)
  const [shopBrandForm, setShopBrandForm] = useState(EMPTY_SHOPBRAND)
  const [editShopBrandId, setEditShopBrandId] = useState(null)
  const [faqForm, setFaqForm]             = useState(EMPTY_FAQ)
  const [editFaqId, setEditFaqId]         = useState(null)

  const [shopBanner, setShopBanner]   = useState({ image:'',top_text:'Find the Boundaries. Push Through!',title:'Summer Sale',subtitle:'30% OFF',price_text:'$19999',button_text:'GET YOURS!',button_url:'/shop' })
  const [savedBanner, setSavedBanner] = useState(null)
  const [about, setAbout]             = useState(ABOUT_DEFAULT)

  const [message, setMessage]     = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!user) navigate('/login')
    fetchProducts(); fetchSlides(); fetchBrandBanners(); fetchShopBrands()
    fetchShopBanner(); fetchAbout(); fetchFaqs()
  }, [])

  const showMessage = msg => { setMessage(msg); setTimeout(() => setMessage(''), 3000) }
  const API = import.meta.env.VITE_API_URL

  const fetchProducts     = () => fetch(`${API}/api/products`).then(r=>r.json()).then(setProducts)
  const fetchSlides       = () => fetch(`${API}/api/slides`).then(r=>r.json()).then(setSlides)
  const fetchBrandBanners = () => fetch(`${API}/api/brands`).then(r=>r.json()).then(setBrandBanners)
  const fetchShopBrands   = () => fetch(`${API}/api/shop-brands`).then(r=>r.json()).then(setShopBrands)
  const fetchFaqs         = () => fetch(`${API}/api/faq`).then(r=>r.json()).then(setFaqs)
  const fetchShopBanner   = () => fetch(`${API}/api/shop-banner`).then(r=>r.json()).then(d=>{if(d?.id){setShopBanner(d);setSavedBanner(d)}})
  const fetchAbout        = () => fetch(`${API}/api/about`).then(r=>r.json()).then(d=>{if(d?.id) setAbout({...ABOUT_DEFAULT,...d})})

  const uploadImage = async file => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
    const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,{method:'POST',body:fd})
    return (await res.json()).secure_url
  }
  const handleImgUpload = async (e, setter, current) => {
    const file = e.target.files[0]; if(!file) return
    setUploading(true); setter({...current, image: await uploadImage(file)}); setUploading(false)
  }
  const handleAboutImgUpload = async (e, field) => {
    const file = e.target.files[0]; if(!file) return
    setUploading(true); setAbout(async p=>({...p,[field]: await uploadImage(file)})); setUploading(false)
  }

  // ── Generic save (create or update)
  const saveItem = async (url, body, isEdit, onSuccess) => {
    const method = isEdit ? 'PUT' : 'POST'
    const endpoint = isEdit ? `${url}/${isEdit}` : url
    const res = await fetch(endpoint, {method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)})
    if (res.ok) onSuccess()
  }

  // ── Products
  const handleSaveProduct = async e => {
    e.preventDefault()
    await saveItem(`${API}/api/products`, {...productForm, price: parseFloat(productForm.price)}, editProductId, () => {
      showMessage(editProductId ? 'Product updated ✅' : 'Product added ✅')
      setProductForm(EMPTY_PRODUCT); setEditProductId(null); fetchProducts()
    })
  }

  // ── Slides
  const handleSaveSlide = async e => {
    e.preventDefault()
    await saveItem(`${API}/api/slides`, slideForm, editSlideId, () => {
      showMessage(editSlideId ? 'Slide updated ✅' : 'Slide added ✅')
      setSlideForm(EMPTY_SLIDE); setEditSlideId(null); fetchSlides()
    })
  }

  // ── Browse brands
  const handleSaveBrowse = async e => {
    e.preventDefault()
    await saveItem(`${API}/api/brands`, browseForm, editBrowseId, () => {
      showMessage(editBrowseId ? 'Banner updated ✅' : 'Banner added ✅')
      setBrowseForm(EMPTY_BROWSE); setEditBrowseId(null); fetchBrandBanners()
    })
  }

  // ── Shop brands
  const handleSaveShopBrand = async e => {
    e.preventDefault()
    await saveItem(`${API}/api/shop-brands`, shopBrandForm, editShopBrandId, () => {
      showMessage(editShopBrandId ? 'Brand updated ✅' : 'Brand added ✅')
      setShopBrandForm(EMPTY_SHOPBRAND); setEditShopBrandId(null); fetchShopBrands()
    })
  }

  // ── FAQ
  const handleSaveFaq = async e => {
    e.preventDefault()
    await saveItem(`${API}/api/faq`, faqForm, editFaqId, () => {
      showMessage(editFaqId ? 'FAQ updated ✅' : 'FAQ added ✅')
      setFaqForm(EMPTY_FAQ); setEditFaqId(null); fetchFaqs()
    })
  }

  // ── Delete helpers
  const del = async (url, fetch) => { if(!confirm('Delete?'))return; await window.fetch(url,{method:'DELETE'}); fetch() }

  const handleShopBannerSave = async e => {
    e.preventDefault()
    const res = await fetch(`${API}/api/shop-banner`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(shopBanner)})
    if(res.ok){showMessage('Shop banner updated ✅');setSavedBanner({...shopBanner})}
  }
  const handleAboutSave = async e => {
    e.preventDefault()
    const res = await fetch(`${API}/api/about`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(about)})
    if(res.ok) showMessage('About Us updated ✅')
  }

  const handleTextPosition = useCallback((x, y) => {
    setShopBrandForm(prev => ({ ...prev, text_x: x, text_y: y }))
  }, [])

  const tabs = [
    {key:'products',   label:'Products'},
    {key:'slides',     label:'Hero Slider'},
    {key:'browse',     label:'🏠 Browse Our Brands'},
    {key:'shopbrands', label:'🛍 Shop Our Brands'},
    {key:'shopbanner', label:'🖼 Shop Banner'},
    {key:'about',      label:'📄 About Us'},
    {key:'faq',        label:'❓ FAQ'},
  ]

  const inp = 'border rounded px-4 py-2 text-sm outline-none focus:border-blue-400 w-full'
  const ta  = 'border rounded px-4 py-2 text-sm outline-none focus:border-blue-400 w-full resize-none'
  const lbl = 'block text-sm font-medium text-gray-700 mb-1'
  const editBtn = 'text-xs bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 px-3 py-1 rounded font-semibold transition'
  const cancelBtn = 'text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 rounded font-semibold transition'

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 uppercase tracking-widest">Admin Panel</h1>

      <div className="flex gap-3 mb-8 flex-wrap">
        {tabs.map(t=>(
          <button key={t.key} onClick={()=>setActiveTab(t.key)}
            className={`px-5 py-2 rounded font-semibold transition text-sm ${activeTab===t.key?'bg-blue-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <Toast message={message} />

      {/* ── PRODUCTS ── */}
      {activeTab==='products' && (
        <div>
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{editProductId ? '✏️ Edit Product' : 'Add New Product'}</h2>
              {editProductId && <button onClick={()=>{setProductForm(EMPTY_PRODUCT);setEditProductId(null)}} className={cancelBtn}>✕ Cancel</button>}
            </div>
            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" placeholder="Product Name" value={productForm.name} onChange={e=>setProductForm({...productForm,[e.target.name]:e.target.value})} required className={inp}/>
              <input name="price" placeholder="Price" type="number" value={productForm.price} onChange={e=>setProductForm({...productForm,[e.target.name]:e.target.value})} required className={inp}/>
              <div className="md:col-span-2">
                <label className={lbl}>Product Image</label>
                <input type="file" accept="image/*" onChange={e=>handleImgUpload(e,setProductForm,productForm)} className={inp}/>
                {uploading&&<p className="text-blue-500 text-xs mt-1">Uploading...</p>}
                {productForm.image&&<img src={productForm.image} className="mt-2 h-20 object-cover rounded"/>}
              </div>
              <input name="category" placeholder="Category" value={productForm.category} onChange={e=>setProductForm({...productForm,[e.target.name]:e.target.value})} required className={inp}/>
              <input name="brand" placeholder="Brand" value={productForm.brand} onChange={e=>setProductForm({...productForm,[e.target.name]:e.target.value})} required className={inp}/>
              <input name="description" placeholder="Description" value={productForm.description} onChange={e=>setProductForm({...productForm,[e.target.name]:e.target.value})} className={`${inp} md:col-span-2`}/>
              <button type="submit" disabled={uploading} className="md:col-span-2 bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                {editProductId ? 'Save Changes' : 'Add Product'}
              </button>
            </form>
          </div>
          <h2 className="text-xl font-bold mb-4">All Products ({products.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p=>(
              <div key={p.id} className={`bg-white rounded-lg shadow p-4 flex gap-4 ${editProductId===p.id?'ring-2 ring-blue-400':''}`}>
                <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded"/>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-800">{p.name}</h3>
                  <p className="text-xs text-gray-400">{p.category} · {p.brand}</p>
                  <p className="text-blue-600 font-bold text-sm">${p.price?.toLocaleString()}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={()=>{setProductForm({name:p.name,price:p.price,image:p.image,category:p.category,brand:p.brand,description:p.description||''});setEditProductId(p.id);window.scrollTo({top:0,behavior:'smooth'})}} className={editBtn}>✏️ Edit</button>
                    <button onClick={()=>del(`${API}/api/products/${p.id}`, fetchProducts)} className="text-xs text-red-500 hover:text-red-700 font-semibold">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SLIDES ── */}
      {activeTab==='slides' && (
        <div>
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{editSlideId ? '✏️ Edit Slide' : 'Add New Slide'}</h2>
              {editSlideId && <button onClick={()=>{setSlideForm(EMPTY_SLIDE);setEditSlideId(null)}} className={cancelBtn}>✕ Cancel</button>}
            </div>
            <form onSubmit={handleSaveSlide} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={lbl}>Slide Image</label>
                <input type="file" accept="image/*" onChange={e=>handleImgUpload(e,setSlideForm,slideForm)} className={inp}/>
                {uploading&&<p className="text-blue-500 text-xs mt-1">Uploading...</p>}
                {slideForm.image&&<img src={slideForm.image} className="mt-2 h-32 object-cover rounded w-full"/>}
              </div>
              <input name="title" placeholder="Title" value={slideForm.title} onChange={e=>setSlideForm({...slideForm,[e.target.name]:e.target.value})} className={inp}/>
              <input name="subtitle" placeholder="Subtitle" value={slideForm.subtitle} onChange={e=>setSlideForm({...slideForm,[e.target.name]:e.target.value})} className={inp}/>
              <input name="description" placeholder="Description" value={slideForm.description} onChange={e=>setSlideForm({...slideForm,[e.target.name]:e.target.value})} className={inp}/>
              <input name="button_text" placeholder="Button Text" value={slideForm.button_text} onChange={e=>setSlideForm({...slideForm,[e.target.name]:e.target.value})} className={inp}/>
              <input name="button_url" placeholder="Button URL" value={slideForm.button_url} onChange={e=>setSlideForm({...slideForm,[e.target.name]:e.target.value})} className={inp}/>
              <input name="sort_order" placeholder="Order" type="number" value={slideForm.sort_order} onChange={e=>setSlideForm({...slideForm,[e.target.name]:e.target.value})} className={inp}/>
              <button type="submit" disabled={uploading} className="md:col-span-2 bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                {editSlideId ? 'Save Changes' : 'Add Slide'}
              </button>
            </form>
          </div>
          <h2 className="text-xl font-bold mb-4">All Slides ({slides.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {slides.map(s=>(
              <div key={s.id} className={`bg-white rounded-lg shadow overflow-hidden ${editSlideId===s.id?'ring-2 ring-blue-400':''}`}>
                <img src={s.image} alt={s.title} className="w-full h-40 object-cover"/>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800">{s.title}</h3>
                  <p className="text-blue-600 font-bold">{s.subtitle}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={()=>{setSlideForm({image:s.image,title:s.title||'',subtitle:s.subtitle||'',description:s.description||'',button_text:s.button_text||'',button_url:s.button_url||'',sort_order:s.sort_order||0});setEditSlideId(s.id);window.scrollTo({top:0,behavior:'smooth'})}} className={editBtn}>✏️ Edit</button>
                    <button onClick={()=>del(`${API}/api/slides/${s.id}`, fetchSlides)} className="text-xs text-red-500 hover:text-red-700 font-semibold">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── BROWSE OUR BRANDS ── */}
      {activeTab==='browse' && (
        <div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-5 py-3 mb-6 text-sm text-blue-700">🏠 Slider en la <strong>homepage</strong>.</div>
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{editBrowseId ? '✏️ Edit Banner' : 'Add Brand to Slider'}</h2>
              {editBrowseId && <button onClick={()=>{setBrowseForm(EMPTY_BROWSE);setEditBrowseId(null)}} className={cancelBtn}>✕ Cancel</button>}
            </div>
            <form onSubmit={handleSaveBrowse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={lbl}>Image</label>
                <input type="file" accept="image/*" onChange={e=>handleImgUpload(e,setBrowseForm,browseForm)} className={inp}/>
                {uploading&&<p className="text-blue-500 text-xs mt-1">Uploading...</p>}
                {browseForm.image&&<img src={browseForm.image} className="mt-2 h-32 object-cover rounded w-full"/>}
              </div>
              <input name="title" placeholder="Title" value={browseForm.title} onChange={e=>setBrowseForm({...browseForm,[e.target.name]:e.target.value})} className={inp}/>
              <input name="description" placeholder="Description" value={browseForm.description} onChange={e=>setBrowseForm({...browseForm,[e.target.name]:e.target.value})} className={inp}/>
              <input name="button_text" placeholder="Button Text" value={browseForm.button_text} onChange={e=>setBrowseForm({...browseForm,[e.target.name]:e.target.value})} className={inp}/>
              <input name="button_url" placeholder="Button URL" value={browseForm.button_url} onChange={e=>setBrowseForm({...browseForm,[e.target.name]:e.target.value})} className={inp}/>
              <input name="sort_order" placeholder="Order" type="number" value={browseForm.sort_order} onChange={e=>setBrowseForm({...browseForm,[e.target.name]:e.target.value})} className={inp}/>
              <button type="submit" disabled={uploading||(!browseForm.image&&!editBrowseId)} className="md:col-span-2 bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                {editBrowseId ? 'Save Changes' : 'Add to Slider'}
              </button>
            </form>
          </div>
          <h2 className="text-xl font-bold mb-4">Slider Items ({brandBanners.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandBanners.map(b=>(
              <div key={b.id} className={`bg-white rounded-lg shadow overflow-hidden ${editBrowseId===b.id?'ring-2 ring-blue-400':''}`}>
                <img src={b.image} alt={b.title} className="w-full h-40 object-cover"/>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800">{b.title}</h3>
                  <p className="text-sm text-gray-500">{b.description}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={()=>{setBrowseForm({image:b.image,title:b.title||'',description:b.description||'',button_text:b.button_text||'',button_url:b.button_url||'',sort_order:b.sort_order||0});setEditBrowseId(b.id);window.scrollTo({top:0,behavior:'smooth'})}} className={editBtn}>✏️ Edit</button>
                    <button onClick={()=>del(`${API}/api/brands/${b.id}`, fetchBrandBanners)} className="text-xs text-red-500 hover:text-red-700 font-semibold">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SHOP OUR BRANDS ── */}
      {activeTab==='shopbrands' && (
        <div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-5 py-3 mb-6 text-sm text-blue-700">
            🛍 Grid de cards en la página <strong>/brands</strong>. Arrastra el texto en el preview.
          </div>
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{editShopBrandId ? '✏️ Edit Brand Card' : 'Add Brand Card'}</h2>
              {editShopBrandId && <button onClick={()=>{setShopBrandForm(EMPTY_SHOPBRAND);setEditShopBrandId(null)}} className={cancelBtn}>✕ Cancel</button>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className={lbl}>Imagen de fondo</label>
                  <input type="file" accept="image/*" onChange={e=>handleImgUpload(e,setShopBrandForm,shopBrandForm)} className={inp}/>
                  {uploading&&<p className="text-blue-500 text-xs mt-1">Uploading...</p>}
                </div>
                <div>
                  <label className={lbl}>Tamaño del card</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(SIZE_LABELS).map(([val,label])=>(
                      <label key={val} className={`flex items-center gap-2 border-2 rounded-lg p-2 cursor-pointer transition text-sm ${shopBrandForm.size===val?'border-blue-600 bg-blue-50':'border-gray-200 hover:border-gray-400'}`}>
                        <input type="radio" name="size" value={val} checked={shopBrandForm.size===val} onChange={e=>setShopBrandForm({...shopBrandForm,size:e.target.value})} className="hidden"/>
                        <span>{label.split(' ')[0]}</span>
                        <span className="text-xs text-gray-600">{label.split(' ').slice(1).join(' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div><label className={lbl}>Texto pequeño (descripción)</label><input placeholder="e.g. CHECK OUT" value={shopBrandForm.description} onChange={e=>setShopBrandForm({...shopBrandForm,description:e.target.value})} className={inp}/></div>
                <div><label className={lbl}>Título principal</label><input placeholder="e.g. DENTINY'S CLOTHING" value={shopBrandForm.title} onChange={e=>setShopBrandForm({...shopBrandForm,title:e.target.value})} className={inp}/></div>
                <div>
                  <label className={lbl}>Color del texto</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={shopBrandForm.text_color} onChange={e=>setShopBrandForm({...shopBrandForm,text_color:e.target.value})} className="w-12 h-10 border rounded cursor-pointer"/>
                    <input type="text" value={shopBrandForm.text_color} onChange={e=>setShopBrandForm({...shopBrandForm,text_color:e.target.value})} className="border rounded px-3 py-2 text-sm outline-none flex-1"/>
                    <button type="button" onClick={()=>setShopBrandForm({...shopBrandForm,text_color:'#1a1a1a'})} className="text-xs bg-gray-900 text-white px-2 py-1 rounded">Negro</button>
                    <button type="button" onClick={()=>setShopBrandForm({...shopBrandForm,text_color:'#ffffff'})} className="text-xs bg-white text-gray-800 border px-2 py-1 rounded">Blanco</button>
                  </div>
                </div>
                <div><label className={lbl}>Texto del botón</label><input placeholder="e.g. CHECK THE SALE" value={shopBrandForm.button_text} onChange={e=>setShopBrandForm({...shopBrandForm,button_text:e.target.value})} className={inp}/></div>
                <div><label className={lbl}>URL del botón</label><input placeholder="/shop" value={shopBrandForm.button_url} onChange={e=>setShopBrandForm({...shopBrandForm,button_url:e.target.value})} className={inp}/></div>
                <div><label className={lbl}>Número WhatsApp</label><input placeholder="+15921234567" value={shopBrandForm.whatsapp} onChange={e=>setShopBrandForm({...shopBrandForm,whatsapp:e.target.value})} className={inp}/></div>
                <div><label className={lbl}>Orden</label><input type="number" value={shopBrandForm.sort_order} onChange={e=>setShopBrandForm({...shopBrandForm,sort_order:e.target.value})} className="border rounded px-4 py-2 text-sm outline-none w-24"/></div>
              </div>
              <div><BrandPreview form={shopBrandForm} onPositionChange={handleTextPosition}/></div>
            </div>
            <button onClick={handleSaveShopBrand} disabled={uploading||(!shopBrandForm.image&&!editShopBrandId)}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50">
              {editShopBrandId ? 'Save Changes' : 'Add Brand Card'}
            </button>
          </div>

          <h2 className="text-xl font-bold mb-4">All Brand Cards ({shopBrands.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shopBrands.map(b=>(
              <div key={b.id} className={`bg-white rounded-lg shadow overflow-hidden ${editShopBrandId===b.id?'ring-2 ring-blue-400':''}`}>
                <div className="relative h-40 bg-gray-100">
                  <img src={b.image} alt={b.title} className="w-full h-full object-contain" style={{objectPosition:'right center'}}/>
                  <div className="absolute z-10 pointer-events-none" style={{left:`${b.text_x??5}%`,top:`${b.text_y??20}%`,maxWidth:'60%'}}>
                    {b.description&&<p className="text-xs uppercase tracking-wide font-medium" style={{color:b.text_color||'#1a1a1a',opacity:0.7}}>{b.description}</p>}
                    {b.title&&<p className="font-extrabold text-sm uppercase leading-tight" style={{color:b.text_color||'#1a1a1a'}}>{b.title}</p>}
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold uppercase">{b.size||'square'}</span>
                    <span className="w-4 h-4 rounded-full border border-gray-200" style={{backgroundColor:b.text_color||'#1a1a1a'}}/>
                  </div>
                  {b.whatsapp&&<p className="text-xs text-green-600">📱 {b.whatsapp}</p>}
                  <div className="flex gap-2 mt-2">
                    <button onClick={()=>{setShopBrandForm({image:b.image,title:b.title||'',description:b.description||'',button_text:b.button_text||'',button_url:b.button_url||'',whatsapp:b.whatsapp||'',size:b.size||'square',text_x:b.text_x??5,text_y:b.text_y??20,text_color:b.text_color||'#1a1a1a',sort_order:b.sort_order||0});setEditShopBrandId(b.id);window.scrollTo({top:0,behavior:'smooth'})}} className={editBtn}>✏️ Edit</button>
                    <button onClick={()=>del(`${API}/api/shop-brands/${b.id}`, fetchShopBrands)} className="text-xs text-red-500 hover:text-red-700 font-semibold">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SHOP BANNER ── */}
      {activeTab==='shopbanner' && (
        <div>
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-1">Shop Banner</h2>
            <p className="text-sm text-gray-500 mb-6">Banner en la parte superior de la página Shop.</p>
            <form onSubmit={handleShopBannerSave} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className={lbl}>Imagen de fondo</label>
                <input type="file" accept="image/*" onChange={async e=>{const f=e.target.files[0];if(!f)return;setUploading(true);const url=await uploadImage(f);setShopBanner(p=>({...p,image:url}));setUploading(false)}} className={inp}/>
                {uploading&&<p className="text-blue-500 text-xs mt-1">Uploading...</p>}
                {shopBanner.image&&<img src={shopBanner.image} className="mt-3 h-40 object-cover rounded w-full"/>}
              </div>
              <div className="md:col-span-2"><label className={lbl}>Texto pequeño</label><input type="text" value={shopBanner.top_text} onChange={e=>setShopBanner({...shopBanner,top_text:e.target.value})} className={inp}/></div>
              <div><label className={lbl}>Título principal</label><input type="text" value={shopBanner.title} onChange={e=>setShopBanner({...shopBanner,title:e.target.value})} className={inp}/></div>
              <div><label className={lbl}>Subtítulo</label><input type="text" value={shopBanner.subtitle} onChange={e=>setShopBanner({...shopBanner,subtitle:e.target.value})} className={inp}/></div>
              <div><label className={lbl}>Texto de precio</label><input type="text" value={shopBanner.price_text} onChange={e=>setShopBanner({...shopBanner,price_text:e.target.value})} className={inp}/></div>
              <div><label className={lbl}>Texto del botón</label><input type="text" value={shopBanner.button_text} onChange={e=>setShopBanner({...shopBanner,button_text:e.target.value})} className={inp}/></div>
              <div className="md:col-span-2"><label className={lbl}>URL del botón</label><input type="text" value={shopBanner.button_url} onChange={e=>setShopBanner({...shopBanner,button_url:e.target.value})} className={inp}/></div>
              <button type="submit" disabled={uploading} className="md:col-span-2 bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50">Guardar Banner</button>
            </form>
          </div>
          {savedBanner&&(
            <div>
              <h2 className="text-xl font-bold mb-4">Banner actual</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden max-w-2xl">
                {savedBanner.image&&<img src={savedBanner.image} className="w-full h-48 object-cover"/>}
                <div className="p-4 space-y-1">
                  <p className="text-xs text-gray-400 italic">{savedBanner.top_text}</p>
                  <h3 className="font-extrabold text-gray-800 text-lg">{savedBanner.title}</h3>
                  <p className="text-blue-600 font-bold">{savedBanner.subtitle}</p>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">{savedBanner.price_text}</span>
                    <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded">{savedBanner.button_text}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ABOUT US ── */}
      {activeTab==='about' && (
        <div>
          <form onSubmit={handleAboutSave} className="space-y-10">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">1. Hero</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={lbl}>Subtítulo azul</label><input value={about.hero_subtitle} onChange={e=>setAbout({...about,hero_subtitle:e.target.value})} className={inp}/></div>
                <div><label className={lbl}>Título grande</label><input value={about.hero_title} onChange={e=>setAbout({...about,hero_title:e.target.value})} className={inp}/></div>
                <div className="md:col-span-2"><label className={lbl}>Descripción</label><textarea value={about.hero_description} onChange={e=>setAbout({...about,hero_description:e.target.value})} rows={3} className={ta}/></div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">2. Our Story</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={lbl}>Label azul</label><input value={about.story_label} onChange={e=>setAbout({...about,story_label:e.target.value})} className={inp}/></div>
                <div><label className={lbl}>Título</label><input value={about.story_heading} onChange={e=>setAbout({...about,story_heading:e.target.value})} className={inp}/></div>
                <div className="md:col-span-2"><label className={lbl}>Texto</label><textarea value={about.story_text} onChange={e=>setAbout({...about,story_text:e.target.value})} rows={3} className={ta}/></div>
                <div><label className={lbl}>Imagen 1</label><input type="file" accept="image/*" onChange={e=>handleAboutImgUpload(e,'story_image1')} className={inp}/>{about.story_image1&&<img src={about.story_image1} className="mt-2 h-24 object-cover rounded w-full"/>}</div>
                <div><label className={lbl}>Imagen 2</label><input type="file" accept="image/*" onChange={e=>handleAboutImgUpload(e,'story_image2')} className={inp}/>{about.story_image2&&<img src={about.story_image2} className="mt-2 h-24 object-cover rounded w-full"/>}</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">3. Mission / Vision / Quality</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[['mission','Mission'],['vision','Vision'],['quality','Quality']].map(([key,name])=>(
                  <div key={key} className="space-y-3">
                    <div><label className={lbl}>Título {name}</label><input value={about[`${key}_title`]} onChange={e=>setAbout({...about,[`${key}_title`]:e.target.value})} className={inp}/></div>
                    <div><label className={lbl}>Texto</label><textarea value={about[`${key}_text`]} onChange={e=>setAbout({...about,[`${key}_text`]:e.target.value})} rows={4} className={ta}/></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">4. Our Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={lbl}>Título</label><input value={about.team_title} onChange={e=>setAbout({...about,team_title:e.target.value})} className={inp}/></div>
                <div className="md:col-span-2"><label className={lbl}>Texto</label><textarea value={about.team_text} onChange={e=>setAbout({...about,team_text:e.target.value})} rows={2} className={ta}/></div>
                <div className="md:col-span-2"><label className={lbl}>Foto</label><input type="file" accept="image/*" onChange={e=>handleAboutImgUpload(e,'team_image')} className={inp}/>{about.team_image&&<img src={about.team_image} className="mt-2 h-40 object-cover rounded w-full"/>}</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">5. Our Promise</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={lbl}>Label azul</label><input value={about.promise_label} onChange={e=>setAbout({...about,promise_label:e.target.value})} className={inp}/></div>
                <div><label className={lbl}>Título</label><input value={about.promise_heading} onChange={e=>setAbout({...about,promise_heading:e.target.value})} className={inp}/></div>
                <div className="md:col-span-2"><label className={lbl}>Texto</label><textarea value={about.promise_text} onChange={e=>setAbout({...about,promise_text:e.target.value})} rows={3} className={ta}/></div>
                <div className="md:col-span-2"><label className={lbl}>Imagen derecha</label><input type="file" accept="image/*" onChange={e=>handleAboutImgUpload(e,'promise_image')} className={inp}/>{about.promise_image&&<img src={about.promise_image} className="mt-2 h-32 object-cover rounded w-full"/>}</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">6. Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1,2,3].map(n=>(
                  <div key={n} className="space-y-3">
                    <div><label className={lbl}>Número {n}</label><input value={about[`stat${n}_number`]} onChange={e=>setAbout({...about,[`stat${n}_number`]:e.target.value})} className={inp}/></div>
                    <div><label className={lbl}>Etiqueta {n}</label><input value={about[`stat${n}_label`]} onChange={e=>setAbout({...about,[`stat${n}_label`]:e.target.value})} className={inp}/></div>
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" disabled={uploading} className="w-full bg-blue-600 text-white py-4 rounded font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50">💾 Save About Us</button>
          </form>
        </div>
      )}

      {/* ── FAQ ── */}
      {activeTab==='faq' && (
        <div>
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{editFaqId ? '✏️ Edit FAQ' : 'Add New FAQ'}</h2>
              {editFaqId && <button onClick={()=>{setFaqForm(EMPTY_FAQ);setEditFaqId(null)}} className={cancelBtn}>✕ Cancel</button>}
            </div>
            <form onSubmit={handleSaveFaq} className="flex flex-col gap-4">
              <div><label className={lbl}>Question</label><input value={faqForm.question} onChange={e=>setFaqForm({...faqForm,question:e.target.value})} required className={inp}/></div>
              <div><label className={lbl}>Answer</label><textarea value={faqForm.answer} onChange={e=>setFaqForm({...faqForm,answer:e.target.value})} required rows={4} className={ta}/></div>
              <div><label className={lbl}>Order</label><input type="number" value={faqForm.sort_order} onChange={e=>setFaqForm({...faqForm,sort_order:e.target.value})} className="border rounded px-4 py-2 text-sm outline-none w-32"/></div>
              <button type="submit" className="bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition">
                {editFaqId ? 'Save Changes' : 'Add FAQ'}
              </button>
            </form>
          </div>
          <h2 className="text-xl font-bold mb-4">All FAQs ({faqs.length})</h2>
          <div className="flex flex-col gap-3">
            {faqs.map((f,i)=>(
              <div key={f.id} className={`bg-white border border-gray-100 rounded-lg p-4 flex gap-4 ${editFaqId===f.id?'ring-2 ring-blue-400':''}`}>
                <span className="text-blue-600 font-bold text-lg flex-shrink-0">{i+1}.</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 mb-1">{f.question}</p>
                  <p className="text-sm text-gray-500">{f.answer}</p>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button onClick={()=>{setFaqForm({question:f.question,answer:f.answer,sort_order:f.sort_order||0});setEditFaqId(f.id);window.scrollTo({top:0,behavior:'smooth'})}} className={editBtn}>✏️ Edit</button>
                  <button onClick={()=>del(`${API}/api/faq/${f.id}`, fetchFaqs)} className="text-xs text-red-500 hover:text-red-700 font-semibold">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin