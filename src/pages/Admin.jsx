import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const FONTS = [
  { label:'Default', value:'' },
  { label:'Serif',   value:'Georgia, serif' },
  { label:'Impact',  value:'Impact, sans-serif' },
  { label:'Mono',    value:'"Courier New", monospace' },
  { label:'Cursive', value:'cursive' },
  { label:'Narrow',  value:'"Arial Narrow", Arial, sans-serif' },
]

const SIZE_LABELS = {
  square:'⬜ Square (1×1)', wide:'▬ Wide (2×1)',
  tall:'▮ Tall (1×2)', big:'⬛ Big (2×2)',
}

const ABOUT_DEFAULT = {
  hero_subtitle:'Who We Are', hero_title:'About Us',
  hero_description:'We are your ultimate destination for quality, convenience, and style.',
  story_label:'Since 2019', story_heading:'Our story is one of growth, creativity, and purpose.',
  story_text:'Founded in March 2019, Carib-Zoom Inc began as a small social commerce venture.',
  story_image1:'', story_image2:'',
  mission_title:'Our Mission', mission_text:'',
  vision_title:'Our Vision', vision_text:'',
  quality_title:'Our Quality', quality_text:'',
  team_title:'Our Team', team_image:'', team_text:'',
  promise_label:'Our Promise', promise_heading:'', promise_text:'', promise_image:'',
  stat1_number:'100,000+', stat1_label:'Sales in 8 Years',
  stat2_number:'99%', stat2_label:'Customer Satisfaction Rate',
  stat3_number:'2,000+', stat3_label:'Products Available',
}

function defaultBrowseEls(f) {
  return [
    { id:'title', label:'Título',      text:f.title||'Título',         x:5,  y:58, color:'#ffffff', font:'', size:18, bold:true,  italic:false, width:80 },
    { id:'desc',  label:'Descripción', text:f.description||'',         x:5,  y:72, color:'#ffffff', font:'', size:13, bold:false, italic:false, width:80 },
    { id:'btn',   label:'Botón',       text:f.button_text||'Shop Now', x:5,  y:83, color:'#333333', font:'', size:12, bold:true,  italic:false, width:30, url:f.button_url||'#' },
    { id:'wa',    label:'WhatsApp',    text:'Chat on WhatsApp',        x:60, y:83, color:'#ffffff', font:'', size:12, bold:true,  italic:false, width:35, url:f.whatsapp||'' },
  ]
}

function defaultShopEls(f) {
  return [
    { id:'desc',  label:'Texto pequeño', text:f.description||'',              x:5, y:15, color:'#1a1a1a', font:'', size:12, bold:false, italic:false, width:40 },
    { id:'title', label:'Título',        text:f.title||'Título',               x:5, y:23, color:'#1a1a1a', font:'', size:24, bold:true,  italic:false, width:40 },
    { id:'btn',   label:'Botón',         text:f.button_text||'CHECK THE SALE', x:5, y:48, color:'#ffffff', font:'', size:12, bold:true,  italic:false, width:30, url:f.button_url||'#' },
    { id:'wa',    label:'WhatsApp',      text:'Chat on WhatsApp',              x:5, y:62, color:'#ffffff', font:'', size:12, bold:true,  italic:false, width:30, url:f.whatsapp||'' },
  ]
}

function mergeElements(saved, defaults) {
  if (!saved || !saved.length) return defaults
  const savedIds = new Set(saved.map(e => e.id))
  return [...saved, ...defaults.filter(e => !savedIds.has(e.id))]
}

function parseEls(raw) {
  if (!raw) return []
  if (typeof raw === 'string') { try { return JSON.parse(raw) } catch { return [] } }
  return Array.isArray(raw) ? raw : []
}

function elStyle(el) {
  return {
    color:      el.color  || '#1a1a1a',
    fontFamily: el.font   || 'inherit',
    fontSize:   `${el.size || 16}px`,
    fontWeight: el.bold   ? 'bold'   : 'normal',
    fontStyle:  el.italic ? 'italic' : 'normal',
    lineHeight: 1.2,
    whiteSpace: 'pre-wrap',
    display:    'block',
    wordBreak:  'break-word',
  }
}

function Handle({ pos, onMouseDown }) {
  const base = 'absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-sm z-20 hover:bg-blue-100'
  const styles = {
    nw:'top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize',
    n: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-n-resize',
    ne:'top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-ne-resize',
    e: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2 cursor-e-resize',
    se:'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-se-resize',
    s: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-s-resize',
    sw:'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-sw-resize',
    w: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-w-resize',
  }
  return <div className={`${base} ${styles[pos]}`} onMouseDown={e=>{e.stopPropagation();e.preventDefault();onMouseDown(pos)}}/>
}

function CardCanvas({ image, elements, setElements, width = 400, height = 208 }) {
  const [selectedId, setSelectedId] = useState(null)
  const canvasRef = useRef(null)
  const moving    = useRef(null)
  const resizing  = useRef(null)
  const selected  = elements.find(e => e.id === selectedId)

  const getPct = useCallback(e => {
    const r = canvasRef.current.getBoundingClientRect()
    const cx = e.touches ? e.touches[0].clientX : e.clientX
    const cy = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: Math.max(0, Math.min(90, Math.round(((cx-r.left)/r.width )*100))),
      y: Math.max(0, Math.min(90, Math.round(((cy-r.top) /r.height)*100))),
    }
  }, [])

  const onMove = useCallback(e => {
    if (!canvasRef.current) return
    if (moving.current) {
      const {x,y} = getPct(e)
      setElements(prev => prev.map(el => el.id===moving.current ? {...el,x,y} : el))
      return
    }
    if (resizing.current) {
      const {id,handle,startX,startY,startSize,startWidth} = resizing.current
      const r  = canvasRef.current.getBoundingClientRect()
      const dx = ((e.clientX-startX)/r.width )*100
      const dy = ((e.clientY-startY)/r.height)*100
      setElements(prev => prev.map(el => {
        if (el.id!==id) return el
        let u = {...el}
        if (['e','ne','se'].includes(handle)) u.width = Math.max(5,Math.min(95,Math.round(startWidth+dx)))
        if (['w','nw','sw'].includes(handle)) u.width = Math.max(5,Math.min(95,Math.round(startWidth-dx)))
        if (['se','sw','ne','nw','s'].includes(handle)) {
          const delta = ['ne','nw'].includes(handle) ? -dy : dy
          u.size = Math.max(6,Math.min(200,Math.round(startSize+delta*1.5)))
        }
        return u
      }))
    }
  }, [getPct, setElements])

  const onUp = useCallback(() => { moving.current=null; resizing.current=null }, [])

  useEffect(() => {
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
    return () => { window.removeEventListener('mousemove',onMove); window.removeEventListener('mouseup',onUp) }
  }, [onMove, onUp])

  const updateEl = (id, patch) => setElements(prev => prev.map(el => el.id===id ? {...el,...patch} : el))
  const inp = 'border rounded px-3 py-1.5 text-sm outline-none focus:border-blue-400'

  return (
    <div className="mt-6">
      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
        Canvas — tamaño real {width}×{height}px · arrastra · handles para tamaño/ancho
      </p>

      <div ref={canvasRef}
        className="relative bg-gray-200 overflow-hidden rounded select-none"
        style={{ width, height, cursor:'default' }}
        onClick={() => setSelectedId(null)}>

        {image
          ? <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none"/>
          : <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm pointer-events-none">Sube una imagen</div>
        }

        {elements.map(el => {
          const isSel = selectedId === el.id
          return (
            <div key={el.id}
              className={`absolute ${isSel ? 'outline outline-2 outline-blue-500' : 'hover:outline hover:outline-dashed hover:outline-1 hover:outline-gray-300'}`}
              style={{ left:`${el.x}%`, top:`${el.y}%`, width:`${el.width||40}%`, zIndex:10, cursor:'move' }}
              onMouseDown={e => { e.stopPropagation(); setSelectedId(el.id); moving.current=el.id }}
              onClick={e => e.stopPropagation()}>

              {el.id==='btn'
                ? <span style={{...elStyle(el), display:'inline-block', background:'#111827', color:'#fff', padding:'4px 12px', textTransform:'uppercase', whiteSpace:'nowrap'}}>
                    {el.text||'Botón'}
                  </span>
                : el.id==='wa'
                  ? <span style={{...elStyle(el), display:'inline-flex', alignItems:'center', gap:5, background:'#22c55e', color:'#fff', padding:'3px 10px', borderRadius:4, whiteSpace:'nowrap'}}>
                      📱 {el.text||'WhatsApp'}
                    </span>
                  : <span style={elStyle(el)}>{el.text || <span className="text-gray-400 italic text-xs">{el.label}</span>}</span>
              }

              {isSel && ['nw','n','ne','e','se','s','sw','w'].map(pos => (
                <Handle key={pos} pos={pos} onMouseDown={handle => {
                  resizing.current = { id:el.id, handle, startX:0, startY:0, startSize:el.size||16, startWidth:el.width||40 }
                  const cap = ev => { resizing.current.startX=ev.clientX; resizing.current.startY=ev.clientY; window.removeEventListener('mousemove',cap,{once:true}) }
                  window.addEventListener('mousemove', cap, {once:true})
                  moving.current = null
                }}/>
              ))}

              {isSel && (
                <div className="absolute -top-5 left-0 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none">
                  {el.label} — {el.width||40}% · {el.size||16}px
                </div>
              )}
            </div>
          )
        })}
      </div>

      {selected && (
        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <p className="text-sm font-bold text-blue-800">✏️ {selected.label}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs text-gray-600 mb-1">Texto (Enter = salto de línea)</label>
              <textarea value={selected.text||''} onChange={e=>updateEl(selected.id,{text:e.target.value})} rows={2} className={`${inp} w-full resize-none`}/>
            </div>
            {(selected.id==='btn'||selected.id==='wa') && (
              <div className="col-span-2">
                <label className="block text-xs text-gray-600 mb-1">{selected.id==='wa'?'Número WhatsApp (ej: +5071234567)':'URL del botón'}</label>
                <input value={selected.url||''} onChange={e=>updateEl(selected.id,{url:e.target.value})} className={`${inp} w-full`} placeholder={selected.id==='wa'?'+5071234567':'/shop'}/>
              </div>
            )}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Fuente</label>
              <select value={selected.font||''} onChange={e=>updateEl(selected.id,{font:e.target.value})} className={`${inp} w-full bg-white`}>
                {FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Tamaño (px)</label>
              <input type="number" min="6" max="200" value={selected.size||16} onChange={e=>updateEl(selected.id,{size:parseInt(e.target.value)||16})} className={`${inp} w-full`}/>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Ancho (%)</label>
              <input type="number" min="5" max="95" value={selected.width||40} onChange={e=>updateEl(selected.id,{width:parseInt(e.target.value)||40})} className={`${inp} w-full`}/>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={selected.color||'#1a1a1a'} onChange={e=>updateEl(selected.id,{color:e.target.value})} className="w-10 h-9 border rounded cursor-pointer"/>
                <input value={selected.color||'#1a1a1a'} onChange={e=>updateEl(selected.id,{color:e.target.value})} className={`${inp} flex-1`}/>
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex gap-2 flex-wrap">
                <button type="button" onClick={()=>updateEl(selected.id,{bold:!selected.bold})} className={`px-3 py-1.5 text-sm font-bold rounded border transition ${selected.bold?'bg-gray-900 text-white':'bg-white text-gray-700 border-gray-300'}`}>B</button>
                <button type="button" onClick={()=>updateEl(selected.id,{italic:!selected.italic})} className={`px-3 py-1.5 text-sm italic rounded border transition ${selected.italic?'bg-gray-900 text-white':'bg-white text-gray-700 border-gray-300'}`}>I</button>
                <button type="button" onClick={()=>updateEl(selected.id,{color:'#ffffff'})} className="px-2 py-1 text-xs bg-gray-900 text-white rounded">Blanco</button>
                <button type="button" onClick={()=>updateEl(selected.id,{color:'#1a1a1a'})} className="px-2 py-1 text-xs bg-white text-gray-800 border rounded">Negro</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Toast({ message }) {
  if (!message) return null
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm font-semibold px-5 py-3 rounded-lg shadow-xl flex items-center gap-3" style={{animation:'slideIn 0.3s ease'}}>
      <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
      {message}
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}

const EMPTY_PRODUCT   = { name:'',price:'',image:'',category:'',brand:'',description:'' }
const EMPTY_SLIDE     = { image:'',title:'',subtitle:'',description:'',button_text:'',button_url:'',sort_order:0 }
const EMPTY_BROWSE    = { image:'',title:'',description:'',button_text:'',button_url:'',whatsapp:'',sort_order:0 }
const EMPTY_SHOPBRAND = { image:'',title:'',description:'',button_text:'',button_url:'',whatsapp:'',size:'square',sort_order:0 }
const EMPTY_FAQ       = { question:'',answer:'',sort_order:0 }

function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const API = import.meta.env.VITE_API_URL

  const [products, setProducts]         = useState([])
  const [slides, setSlides]             = useState([])
  const [brandBanners, setBrandBanners] = useState([])
  const [shopBrands, setShopBrands]     = useState([])
  const [faqs, setFaqs]                 = useState([])
  const [activeTab, setActiveTab]       = useState('products')

  const [productForm, setProductForm]         = useState(EMPTY_PRODUCT)
  const [editProductId, setEditProductId]     = useState(null)
  const [slideForm, setSlideForm]             = useState(EMPTY_SLIDE)
  const [editSlideId, setEditSlideId]         = useState(null)
  const [browseForm, setBrowseForm]           = useState(EMPTY_BROWSE)
  const [browseElements, setBrowseElements]   = useState([])
  const [editBrowseId, setEditBrowseId]       = useState(null)
  const [shopBrandForm, setShopBrandForm]     = useState(EMPTY_SHOPBRAND)
  const [shopElements, setShopElements]       = useState([])
  const [editShopBrandId, setEditShopBrandId] = useState(null)
  const [faqForm, setFaqForm]                 = useState(EMPTY_FAQ)
  const [editFaqId, setEditFaqId]             = useState(null)
  const [shopBanner, setShopBanner]           = useState({image:'',top_text:'Find the Boundaries. Push Through!',title:'Summer Sale',subtitle:'30% OFF',price_text:'$19999',button_text:'GET YOURS!',button_url:'/shop'})
  const [savedBanner, setSavedBanner]         = useState(null)
  const [about, setAbout]                     = useState(ABOUT_DEFAULT)
  const [message, setMessage]                 = useState('')
  const [uploading, setUploading]             = useState(false)

  useEffect(() => {
    if (!user) navigate('/login')
    fetchProducts(); fetchSlides(); fetchBrandBanners(); fetchShopBrands()
    fetchShopBanner(); fetchAbout(); fetchFaqs()
  }, [])

  const showMessage = msg => { setMessage(msg); setTimeout(()=>setMessage(''),3000) }
  const fetchProducts     = () => fetch(`${API}/api/products`).then(r=>r.json()).then(setProducts)
  const fetchSlides       = () => fetch(`${API}/api/slides`).then(r=>r.json()).then(setSlides)
  const fetchBrandBanners = () => fetch(`${API}/api/brands`).then(r=>r.json()).then(setBrandBanners)
  const fetchShopBrands   = () => fetch(`${API}/api/shop-brands`).then(r=>r.json()).then(setShopBrands)
  const fetchFaqs         = () => fetch(`${API}/api/faq`).then(r=>r.json()).then(setFaqs)
  const fetchShopBanner   = () => fetch(`${API}/api/shop-banner`).then(r=>r.json()).then(d=>{if(d?.id){setShopBanner(d);setSavedBanner(d)}})
  const fetchAbout        = () => fetch(`${API}/api/about`).then(r=>r.json()).then(d=>{if(d?.id) setAbout({...ABOUT_DEFAULT,...d})})

  const uploadImage = async file => {
    const fd = new FormData()
    fd.append('file',file); fd.append('upload_preset',import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
    return (await (await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,{method:'POST',body:fd})).json()).secure_url
  }
  const handleImgUpload = async (e, setter, current) => {
    const file=e.target.files[0]; if(!file) return
    setUploading(true); setter({...current,image:await uploadImage(file)}); setUploading(false)
  }
  const handleAboutImgUpload = async (e, field) => {
    const file=e.target.files[0]; if(!file) return
    setUploading(true); const url=await uploadImage(file); setAbout(p=>({...p,[field]:url})); setUploading(false)
  }
  const saveItem = async (url, body, editId, onOk) => {
    const res=await fetch(editId?`${url}/${editId}`:url,{method:editId?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
    if(res.ok) onOk()
  }

  const handleSaveProduct = async e => {
    e.preventDefault()
    await saveItem(`${API}/api/products`,{...productForm,price:parseFloat(productForm.price)},editProductId,()=>{
      showMessage(editProductId?'Product updated ✅':'Product added ✅')
      setProductForm(EMPTY_PRODUCT); setEditProductId(null); fetchProducts()
    })
  }
  const handleSaveSlide = async e => {
    e.preventDefault()
    await saveItem(`${API}/api/slides`,slideForm,editSlideId,()=>{
      showMessage('Slide guardado ✅ — ve a la homepage y haz clic en "✏️ Editar slide"')
      setSlideForm(EMPTY_SLIDE); setEditSlideId(null); fetchSlides()
    })
  }
  const handleSaveBrowse = async e => {
    e.preventDefault()
    const waEl = browseElements.find(el=>el.id==='wa')
    const whatsapp = waEl?.url || browseForm.whatsapp
    await saveItem(`${API}/api/brands`,{...browseForm,whatsapp,elements:browseElements},editBrowseId,()=>{
      showMessage(editBrowseId?'Banner updated ✅':'Banner added ✅')
      setBrowseForm(EMPTY_BROWSE); setBrowseElements([]); setEditBrowseId(null); fetchBrandBanners()
    })
  }
  const handleSaveShopBrand = async e => {
    e.preventDefault()
    const waEl = shopElements.find(el=>el.id==='wa')
    const whatsapp = waEl?.url || shopBrandForm.whatsapp
    await saveItem(`${API}/api/shop-brands`,{...shopBrandForm,whatsapp,elements:shopElements},editShopBrandId,()=>{
      showMessage(editShopBrandId?'Brand updated ✅':'Brand added ✅')
      setShopBrandForm(EMPTY_SHOPBRAND); setShopElements([]); setEditShopBrandId(null); fetchShopBrands()
    })
  }
  const handleSaveFaq = async e => {
    e.preventDefault()
    await saveItem(`${API}/api/faq`,faqForm,editFaqId,()=>{
      showMessage(editFaqId?'FAQ updated ✅':'FAQ added ✅')
      setFaqForm(EMPTY_FAQ); setEditFaqId(null); fetchFaqs()
    })
  }
  const handleShopBannerSave = async e => {
    e.preventDefault()
    const res=await fetch(`${API}/api/shop-banner`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(shopBanner)})
    if(res.ok){showMessage('Shop banner updated ✅');setSavedBanner({...shopBanner})}
  }
  const handleAboutSave = async e => {
    e.preventDefault()
    const res=await fetch(`${API}/api/about`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(about)})
    if(res.ok) showMessage('About Us updated ✅')
  }
  const del = async (url,refetch) => { if(!confirm('Delete?'))return; await window.fetch(url,{method:'DELETE'}); refetch() }

  const tabs=[
    {key:'products',   label:'Products'},
    {key:'slides',     label:'Hero Slider'},
    {key:'browse',     label:'🏠 Browse Our Brands'},
    {key:'shopbrands', label:'🛍 Shop Our Brands'},
    {key:'shopbanner', label:'🖼 Shop Banner'},
    {key:'about',      label:'📄 About Us'},
    {key:'faq',        label:'❓ FAQ'},
  ]
  const inp='border rounded px-4 py-2 text-sm outline-none focus:border-blue-400 w-full'
  const ta='border rounded px-4 py-2 text-sm outline-none focus:border-blue-400 w-full resize-none'
  const lbl='block text-sm font-medium text-gray-700 mb-1'
  const editBtn='text-xs bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 px-3 py-1 rounded font-semibold transition'
  const cancelBtn='text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 rounded font-semibold transition'

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
      <Toast message={message}/>

      {/* ── PRODUCTS ── */}
      {activeTab==='products' && (
        <div>
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{editProductId?'✏️ Edit Product':'Add New Product'}</h2>
              {editProductId&&<button onClick={()=>{setProductForm(EMPTY_PRODUCT);setEditProductId(null)}} className={cancelBtn}>✕ Cancel</button>}
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
              <button type="submit" disabled={uploading} className="md:col-span-2 bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50">{editProductId?'Save Changes':'Add Product'}</button>
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
                    <button onClick={()=>del(`${API}/api/products/${p.id}`,fetchProducts)} className="text-xs text-red-500 hover:text-red-700 font-semibold">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── HERO SLIDER ── */}
      {activeTab==='slides' && (
        <div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-5 py-3 mb-6 text-sm text-amber-800 flex items-center justify-between">
            <span>🖼 El Hero Slider se edita en la página. Guarda aquí y haz clic en <strong>"✏️ Editar slide"</strong> sobre el slider.</span>
            <a href="/" target="_blank" className="ml-4 px-4 py-1.5 bg-amber-600 text-white rounded font-semibold text-xs hover:bg-amber-700 whitespace-nowrap">Ir a Homepage →</a>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{editSlideId?'✏️ Edit Slide':'Add New Slide'}</h2>
              {editSlideId&&<button onClick={()=>{setSlideForm(EMPTY_SLIDE);setEditSlideId(null)}} className={cancelBtn}>✕ Cancel</button>}
            </div>
            <form onSubmit={handleSaveSlide} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={lbl}>Imagen del slide</label>
                <input type="file" accept="image/*" onChange={e=>handleImgUpload(e,setSlideForm,slideForm)} className={inp}/>
                {uploading&&<p className="text-blue-500 text-xs mt-1">Uploading...</p>}
                {slideForm.image&&<img src={slideForm.image} className="mt-2 h-28 object-cover rounded w-full"/>}
              </div>
              <div><label className={lbl}>Título</label><input value={slideForm.title} onChange={e=>setSlideForm({...slideForm,title:e.target.value})} className={inp} placeholder="Summer Sale"/></div>
              <div><label className={lbl}>Subtítulo</label><input value={slideForm.subtitle} onChange={e=>setSlideForm({...slideForm,subtitle:e.target.value})} className={inp} placeholder="70% OFF"/></div>
              <div><label className={lbl}>Descripción</label><input value={slideForm.description} onChange={e=>setSlideForm({...slideForm,description:e.target.value})} className={inp}/></div>
              <div><label className={lbl}>Texto botón</label><input value={slideForm.button_text} onChange={e=>setSlideForm({...slideForm,button_text:e.target.value})} className={inp} placeholder="SHOP NOW!"/></div>
              <div><label className={lbl}>URL botón</label><input value={slideForm.button_url} onChange={e=>setSlideForm({...slideForm,button_url:e.target.value})} className={inp} placeholder="/shop"/></div>
              <div><label className={lbl}>Orden</label><input type="number" value={slideForm.sort_order} onChange={e=>setSlideForm({...slideForm,sort_order:e.target.value})} className="border rounded px-4 py-2 text-sm outline-none w-24"/></div>
              <button type="submit" disabled={uploading||(!slideForm.image&&!editSlideId)} className="md:col-span-2 bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                {editSlideId?'Save Changes':'Add Slide'}
              </button>
            </form>
          </div>
          <h2 className="text-xl font-bold mb-4">All Slides ({slides.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {slides.map(s=>(
              <div key={s.id} className={`bg-white rounded-lg shadow overflow-hidden ${editSlideId===s.id?'ring-2 ring-blue-400':''}`}>
                <img src={s.image} alt={s.title} className="w-full h-32 object-cover"/>
                <div className="p-3 flex items-center justify-between">
                  <div><p className="font-bold text-sm text-gray-800">{s.title} {s.subtitle}</p><p className="text-xs text-gray-400">{s.description}</p></div>
                  <div className="flex gap-2">
                    <button onClick={()=>{setSlideForm({image:s.image,title:s.title||'',subtitle:s.subtitle||'',description:s.description||'',button_text:s.button_text||'',button_url:s.button_url||'',sort_order:s.sort_order||0});setEditSlideId(s.id);window.scrollTo({top:0,behavior:'smooth'})}} className={editBtn}>✏️ Edit</button>
                    <button onClick={()=>del(`${API}/api/slides/${s.id}`,fetchSlides)} className="text-xs text-red-500 hover:text-red-700 font-semibold">Delete</button>
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-5 py-3 mb-6 text-sm text-blue-700">
            🏠 Homepage slider · Canvas a <strong>400×208px</strong> — tamaño exacto de producción
          </div>
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{editBrowseId?'✏️ Edit Banner':'Add Brand to Slider'}</h2>
              {editBrowseId&&<button onClick={()=>{setBrowseForm(EMPTY_BROWSE);setBrowseElements([]);setEditBrowseId(null)}} className={cancelBtn}>✕ Cancel</button>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Image</label>
                <input type="file" accept="image/*" onChange={e=>handleImgUpload(e,setBrowseForm,browseForm)} className={inp}/>
                {uploading&&<p className="text-blue-500 text-xs mt-1">Uploading...</p>}
              </div>
              <div><label className={lbl}>Título</label><input value={browseForm.title} onChange={e=>setBrowseForm({...browseForm,title:e.target.value})} className={inp}/></div>
              <div><label className={lbl}>Descripción</label><input value={browseForm.description} onChange={e=>setBrowseForm({...browseForm,description:e.target.value})} className={inp}/></div>
              <div><label className={lbl}>Texto del botón</label><input value={browseForm.button_text} onChange={e=>setBrowseForm({...browseForm,button_text:e.target.value})} className={inp}/></div>
              <div><label className={lbl}>URL del botón</label><input value={browseForm.button_url} onChange={e=>setBrowseForm({...browseForm,button_url:e.target.value})} className={inp}/></div>
              <div><label className={lbl}>Número WhatsApp</label><input value={browseForm.whatsapp} onChange={e=>setBrowseForm({...browseForm,whatsapp:e.target.value})} className={inp} placeholder="+5071234567"/></div>
              <div><label className={lbl}>Orden</label><input type="number" value={browseForm.sort_order} onChange={e=>setBrowseForm({...browseForm,sort_order:e.target.value})} className="border rounded px-4 py-2 text-sm outline-none w-24"/></div>
            </div>
            <CardCanvas
              image={browseForm.image}
              elements={browseElements.length ? browseElements : defaultBrowseEls(browseForm)}
              setElements={setBrowseElements}
              width={400} height={208}
            />
            <button onClick={handleSaveBrowse} disabled={uploading||(!browseForm.image&&!editBrowseId)} className="mt-6 w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50">
              {editBrowseId?'Save Changes':'Add to Slider'}
            </button>
          </div>
          <h2 className="text-xl font-bold mb-4">Slider Items ({brandBanners.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandBanners.map(b=>(
              <div key={b.id} className={`bg-white rounded-lg shadow overflow-hidden ${editBrowseId===b.id?'ring-2 ring-blue-400':''}`}>
                <div className="relative h-40"><img src={b.image} alt={b.title} className="w-full h-full object-cover"/></div>
                <div className="p-3 flex items-center justify-between">
                  <p className="font-bold text-sm text-gray-800">{b.title}</p>
                  <div className="flex gap-2">
                    <button onClick={()=>{
                      setBrowseForm({image:b.image,title:b.title||'',description:b.description||'',button_text:b.button_text||'',button_url:b.button_url||'',whatsapp:b.whatsapp||'',sort_order:b.sort_order||0})
                      setBrowseElements(mergeElements(parseEls(b.elements), defaultBrowseEls(b)))
                      setEditBrowseId(b.id); window.scrollTo({top:0,behavior:'smooth'})
                    }} className={editBtn}>✏️ Edit</button>
                    <button onClick={()=>del(`${API}/api/brands/${b.id}`,fetchBrandBanners)} className="text-xs text-red-500 hover:text-red-700 font-semibold">Delete</button>
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
            🛍 Página /brands · Canvas a <strong>400×260px</strong> (o 400×520 para Tall/Big) — tamaño exacto de producción
          </div>
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{editShopBrandId?'✏️ Edit Brand Card':'Add Brand Card'}</h2>
              {editShopBrandId&&<button onClick={()=>{setShopBrandForm(EMPTY_SHOPBRAND);setShopElements([]);setEditShopBrandId(null)}} className={cancelBtn}>✕ Cancel</button>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Imagen de fondo</label>
                <input type="file" accept="image/*" onChange={e=>handleImgUpload(e,setShopBrandForm,shopBrandForm)} className={inp}/>
                {uploading&&<p className="text-blue-500 text-xs mt-1">Uploading...</p>}
              </div>
              <div>
                <label className={lbl}>Tamaño</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {Object.entries(SIZE_LABELS).map(([val,label])=>(
                    <label key={val} className={`flex items-center gap-2 border-2 rounded-lg p-2 cursor-pointer transition text-sm ${shopBrandForm.size===val?'border-blue-600 bg-blue-50':'border-gray-200 hover:border-gray-400'}`}>
                      <input type="radio" name="size" value={val} checked={shopBrandForm.size===val} onChange={e=>setShopBrandForm({...shopBrandForm,size:e.target.value})} className="hidden"/>
                      <span>{label.split(' ')[0]}</span><span className="text-xs text-gray-600">{label.split(' ').slice(1).join(' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div><label className={lbl}>Texto pequeño</label><input value={shopBrandForm.description} onChange={e=>setShopBrandForm({...shopBrandForm,description:e.target.value})} className={inp} placeholder="CHECK OUT"/></div>
              <div><label className={lbl}>Título</label><input value={shopBrandForm.title} onChange={e=>setShopBrandForm({...shopBrandForm,title:e.target.value})} className={inp}/></div>
              <div><label className={lbl}>Texto del botón</label><input value={shopBrandForm.button_text} onChange={e=>setShopBrandForm({...shopBrandForm,button_text:e.target.value})} className={inp}/></div>
              <div><label className={lbl}>URL del botón</label><input value={shopBrandForm.button_url} onChange={e=>setShopBrandForm({...shopBrandForm,button_url:e.target.value})} className={inp} placeholder="/shop"/></div>
              <div><label className={lbl}>Número WhatsApp</label><input value={shopBrandForm.whatsapp} onChange={e=>setShopBrandForm({...shopBrandForm,whatsapp:e.target.value})} className={inp}/></div>
              <div><label className={lbl}>Orden</label><input type="number" value={shopBrandForm.sort_order} onChange={e=>setShopBrandForm({...shopBrandForm,sort_order:e.target.value})} className="border rounded px-4 py-2 text-sm outline-none w-24"/></div>
            </div>
            <CardCanvas
              image={shopBrandForm.image}
              elements={shopElements.length ? shopElements : defaultShopEls(shopBrandForm)}
              setElements={setShopElements}
              width={400}
              height={(shopBrandForm.size==='tall'||shopBrandForm.size==='big') ? 520 : 260}
            />
            <button onClick={handleSaveShopBrand} disabled={uploading||(!shopBrandForm.image&&!editShopBrandId)} className="mt-6 w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50">
              {editShopBrandId?'Save Changes':'Add Brand Card'}
            </button>
          </div>
          <h2 className="text-xl font-bold mb-4">All Brand Cards ({shopBrands.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shopBrands.map(b=>(
              <div key={b.id} className={`bg-white rounded-lg shadow overflow-hidden ${editShopBrandId===b.id?'ring-2 ring-blue-400':''}`}>
                <img src={b.image} alt={b.title} className="w-full h-32 object-cover"/>
                <div className="p-3">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold uppercase">{b.size||'square'}</span>
                  <p className="font-bold text-sm text-gray-800 mt-1">{b.title}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={()=>{
                      setShopBrandForm({image:b.image,title:b.title||'',description:b.description||'',button_text:b.button_text||'',button_url:b.button_url||'',whatsapp:b.whatsapp||'',size:b.size||'square',sort_order:b.sort_order||0})
                      setShopElements(mergeElements(parseEls(b.elements), defaultShopEls(b)))
                      setEditShopBrandId(b.id); window.scrollTo({top:0,behavior:'smooth'})
                    }} className={editBtn}>✏️ Edit</button>
                    <button onClick={()=>del(`${API}/api/shop-brands/${b.id}`,fetchShopBrands)} className="text-xs text-red-500 hover:text-red-700 font-semibold">Delete</button>
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
                  <div className="flex gap-3 pt-1">
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
              <h2 className="text-xl font-bold">{editFaqId?'✏️ Edit FAQ':'Add New FAQ'}</h2>
              {editFaqId&&<button onClick={()=>{setFaqForm(EMPTY_FAQ);setEditFaqId(null)}} className={cancelBtn}>✕ Cancel</button>}
            </div>
            <form onSubmit={handleSaveFaq} className="flex flex-col gap-4">
              <div><label className={lbl}>Question</label><input value={faqForm.question} onChange={e=>setFaqForm({...faqForm,question:e.target.value})} required className={inp}/></div>
              <div><label className={lbl}>Answer</label><textarea value={faqForm.answer} onChange={e=>setFaqForm({...faqForm,answer:e.target.value})} required rows={4} className={ta}/></div>
              <div><label className={lbl}>Order</label><input type="number" value={faqForm.sort_order} onChange={e=>setFaqForm({...faqForm,sort_order:e.target.value})} className="border rounded px-4 py-2 text-sm outline-none w-32"/></div>
              <button type="submit" className="bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition">{editFaqId?'Save Changes':'Add FAQ'}</button>
            </form>
          </div>
          <h2 className="text-xl font-bold mb-4">All FAQs ({faqs.length})</h2>
          <div className="flex flex-col gap-3">
            {faqs.map((f,i)=>(
              <div key={f.id} className={`bg-white border rounded-lg p-4 flex gap-4 ${editFaqId===f.id?'ring-2 ring-blue-400':''}`}>
                <span className="text-blue-600 font-bold text-lg flex-shrink-0">{i+1}.</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 mb-1">{f.question}</p>
                  <p className="text-sm text-gray-500">{f.answer}</p>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button onClick={()=>{setFaqForm({question:f.question,answer:f.answer,sort_order:f.sort_order||0});setEditFaqId(f.id);window.scrollTo({top:0,behavior:'smooth'})}} className={editBtn}>✏️ Edit</button>
                  <button onClick={()=>del(`${API}/api/faq/${f.id}`,fetchFaqs)} className="text-xs text-red-500 hover:text-red-700 font-semibold">Delete</button>
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