import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'

const API    = import.meta.env.VITE_API_URL
const CARD_W = 400
const CARD_H = 208

const FONTS = [
  { label:'Default', value:'' },
  { label:'Serif',   value:'Georgia, serif' },
  { label:'Impact',  value:'Impact, sans-serif' },
  { label:'Mono',    value:'"Courier New", monospace' },
  { label:'Cursive', value:'cursive' },
  { label:'Narrow',  value:'"Arial Narrow", Arial, sans-serif' },
]

function defaultBrowseEls(f) {
  return [
    { id:'title', label:'Título',      text:f.title||'Título',         x:5,  y:58, color:'#ffffff', font:'', size:18, bold:true,  italic:false, width:80 },
    { id:'desc',  label:'Descripción', text:f.description||'',         x:5,  y:72, color:'#ffffff', font:'', size:13, bold:false, italic:false, width:80 },
    { id:'btn',   label:'Botón',       text:f.button_text||'Shop Now', x:5,  y:83, color:'#333333', font:'', size:12, bold:true,  italic:false, width:30, url:f.button_url||'#' },
    { id:'wa',    label:'WhatsApp',    text:'Chat on WhatsApp',        x:60, y:83, color:'#ffffff', font:'', size:12, bold:true,  italic:false, width:35, url:f.whatsapp||'' },
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
    color:      el.color  || '#ffffff',
    fontFamily: el.font   || 'inherit',
    fontSize:   `${el.size || 14}px`,
    fontWeight: el.bold   ? 'bold'   : 'normal',
    fontStyle:  el.italic ? 'italic' : 'normal',
    lineHeight: 1.3,
    whiteSpace: 'pre-wrap',
    wordBreak:  'break-word',
    display:    'block',
  }
}

function Handle({ pos, onMouseDown }) {
  const p = {
    nw:{top:0,left:0,transform:'translate(-50%,-50%)',cursor:'nw-resize'},
    n: {top:0,left:'50%',transform:'translate(-50%,-50%)',cursor:'n-resize'},
    ne:{top:0,right:0,transform:'translate(50%,-50%)',cursor:'ne-resize'},
    e: {top:'50%',right:0,transform:'translate(50%,-50%)',cursor:'e-resize'},
    se:{bottom:0,right:0,transform:'translate(50%,50%)',cursor:'se-resize'},
    s: {bottom:0,left:'50%',transform:'translate(-50%,50%)',cursor:'s-resize'},
    sw:{bottom:0,left:0,transform:'translate(-50%,50%)',cursor:'sw-resize'},
    w: {top:'50%',left:0,transform:'translate(-50%,-50%)',cursor:'w-resize'},
  }
  return (
    <div onMouseDown={e=>{e.stopPropagation();e.preventDefault();onMouseDown(pos)}}
      style={{position:'absolute',width:10,height:10,background:'white',border:'2px solid #3b82f6',borderRadius:2,zIndex:30,...p[pos]}}/>
  )
}

function CardEditor({ banner, onClose, onSaved }) {
  const [elements, setElements]     = useState(() => mergeElements(parseEls(banner.elements), defaultBrowseEls(banner)))
  const [selectedId, setSelectedId] = useState(null)
  const [saving, setSaving]         = useState(false)
  const canvasRef = useRef(null)
  const moving    = useRef(null)
  const resizing  = useRef(null)
  const selected  = elements.find(e => e.id === selectedId)

  const getPct = useCallback(e => {
    const r = canvasRef.current.getBoundingClientRect()
    return {
      x: Math.max(0, Math.min(90, Math.round(((e.clientX-r.left)/r.width )*100))),
      y: Math.max(0, Math.min(90, Math.round(((e.clientY-r.top) /r.height)*100))),
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
  }, [getPct])

  const onUp = useCallback(() => { moving.current=null; resizing.current=null }, [])

  useEffect(() => {
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
    return () => { window.removeEventListener('mousemove',onMove); window.removeEventListener('mouseup',onUp) }
  }, [onMove, onUp])

  const updateEl = (id, patch) => setElements(prev => prev.map(el => el.id===id ? {...el,...patch} : el))

  const handleSave = async () => {
    setSaving(true)
    const waEl    = elements.find(e => e.id==='wa')
    const whatsapp = waEl?.url || banner.whatsapp || ''
    await fetch(`${API}/api/brands/${banner.id}`, {
      method:'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({...banner, whatsapp, elements})
    })
    setSaving(false); onSaved(); onClose()
  }

  const s = {border:'1px solid #4b5563',borderRadius:6,padding:'6px 10px',fontSize:13,outline:'none',width:'100%',boxSizing:'border-box',background:'#374151',color:'white'}

  return (
    <div style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.92)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{background:'#111827',borderRadius:12,overflow:'hidden',maxHeight:'95vh',overflowY:'auto',width:'100%',maxWidth:900}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',borderBottom:'1px solid #374151'}}>
          <span style={{color:'white',fontWeight:'bold',fontSize:15}}>✏️ Editando: {banner.title||'Banner'}</span>
          <div style={{display:'flex',gap:10}}>
            <button onClick={handleSave} disabled={saving} style={{background:'#2563eb',color:'white',border:'none',padding:'8px 22px',borderRadius:6,cursor:'pointer',fontWeight:'bold',fontSize:13}}>
              {saving?'Guardando...':'💾 Guardar'}
            </button>
            <button onClick={onClose} style={{background:'#374151',color:'white',border:'none',padding:'8px 16px',borderRadius:6,cursor:'pointer',fontSize:13}}>✕</button>
          </div>
        </div>
        <p style={{color:'#9ca3af',fontSize:12,padding:'10px 20px 4px',margin:0}}>Arrastra los textos · Handles de esquina = tamaño · Handles E/W = ancho</p>
        <div style={{padding:'12px 20px'}}>
          <div ref={canvasRef}
            style={{position:'relative',width:CARD_W,height:CARD_H,overflow:'hidden',cursor:'default',borderRadius:8,boxShadow:'0 0 0 2px #3b82f6',background:'#000'}}
            onClick={() => setSelectedId(null)}>
            {/* contain para ver la imagen completa en el editor también */}
            <img src={banner.image} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'contain',pointerEvents:'none'}}/>
            {elements.map(el => {
              const isSel = selectedId===el.id
              return (
                <div key={el.id}
                  style={{position:'absolute',left:`${el.x}%`,top:`${el.y}%`,width:`${el.width||80}%`,zIndex:10,cursor:'move',outline:isSel?'2px solid #3b82f6':'1px dashed rgba(255,255,255,0.3)'}}
                  onMouseDown={e=>{e.stopPropagation();setSelectedId(el.id);moving.current=el.id}}
                  onClick={e=>e.stopPropagation()}>
                  {el.id==='btn'
                    ? <span style={{...elStyle(el),display:'inline-block',background:'white',padding:'3px 12px',borderRadius:3,color:el.color||'#333',whiteSpace:'nowrap'}}>{el.text||'Botón'}</span>
                    : el.id==='wa'
                      ? <span style={{...elStyle(el),display:'inline-flex',alignItems:'center',gap:5,background:'#22c55e',color:'#fff',padding:'3px 10px',borderRadius:4,whiteSpace:'nowrap'}}>📱 {el.text||'WhatsApp'}</span>
                      : <span style={elStyle(el)}>{el.text}</span>
                  }
                  {isSel && ['nw','n','ne','e','se','s','sw','w'].map(pos=>(
                    <Handle key={pos} pos={pos} onMouseDown={handle=>{
                      resizing.current={id:el.id,handle,startX:0,startY:0,startSize:el.size||14,startWidth:el.width||80}
                      const cap=ev=>{resizing.current.startX=ev.clientX;resizing.current.startY=ev.clientY;window.removeEventListener('mousemove',cap,{once:true})}
                      window.addEventListener('mousemove',cap,{once:true})
                      moving.current=null
                    }}/>
                  ))}
                  {isSel && (
                    <div style={{position:'absolute',top:-20,left:0,background:'#2563eb',color:'white',fontSize:10,padding:'2px 6px',borderRadius:3,whiteSpace:'nowrap',pointerEvents:'none'}}>
                      {el.label} — {el.width||80}% · {el.size||14}px
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <p style={{color:'#6b7280',fontSize:11,marginTop:6}}>📐 {CARD_W}×{CARD_H}px — tamaño real en producción</p>
        </div>
        {selected && (
          <div style={{background:'#1f2937',borderTop:'1px solid #374151',padding:'16px 20px'}}>
            <p style={{color:'#93c5fd',fontWeight:'bold',marginBottom:12,fontSize:13}}>✏️ {selected.label}</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div style={{gridColumn:'1/-1'}}>
                <label style={{fontSize:12,color:'#9ca3af',display:'block',marginBottom:4}}>Texto</label>
                <textarea value={selected.text||''} onChange={e=>updateEl(selected.id,{text:e.target.value})} rows={2} style={{...s,resize:'vertical'}}/>
              </div>
              {(selected.id==='btn'||selected.id==='wa') && (
                <div style={{gridColumn:'1/-1'}}>
                  <label style={{fontSize:12,color:'#9ca3af',display:'block',marginBottom:4}}>{selected.id==='wa'?'Número WhatsApp':'URL del botón'}</label>
                  <input value={selected.url||''} onChange={e=>updateEl(selected.id,{url:e.target.value})} style={s} placeholder={selected.id==='wa'?'+5071234567':'/shop'}/>
                </div>
              )}
              <div>
                <label style={{fontSize:12,color:'#9ca3af',display:'block',marginBottom:4}}>Fuente</label>
                <select value={selected.font||''} onChange={e=>updateEl(selected.id,{font:e.target.value})} style={s}>
                  {FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:12,color:'#9ca3af',display:'block',marginBottom:4}}>Tamaño (px)</label>
                <input type="number" min="6" max="100" value={selected.size||14} onChange={e=>updateEl(selected.id,{size:parseInt(e.target.value)||14})} style={s}/>
              </div>
              <div>
                <label style={{fontSize:12,color:'#9ca3af',display:'block',marginBottom:4}}>Ancho (%)</label>
                <input type="number" min="5" max="95" value={selected.width||80} onChange={e=>updateEl(selected.id,{width:parseInt(e.target.value)||80})} style={s}/>
              </div>
              <div>
                <label style={{fontSize:12,color:'#9ca3af',display:'block',marginBottom:4}}>Color</label>
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  <input type="color" value={selected.color||'#ffffff'} onChange={e=>updateEl(selected.id,{color:e.target.value})} style={{width:36,height:32,border:'1px solid #4b5563',borderRadius:4,cursor:'pointer',padding:2,background:'transparent'}}/>
                  <input value={selected.color||'#ffffff'} onChange={e=>updateEl(selected.id,{color:e.target.value})} style={{...s,flex:1}}/>
                </div>
              </div>
              <div style={{gridColumn:'1/-1',display:'flex',gap:8,flexWrap:'wrap'}}>
                <button onClick={()=>updateEl(selected.id,{bold:!selected.bold})} style={{padding:'6px 14px',fontWeight:'bold',borderRadius:4,border:'1px solid #4b5563',cursor:'pointer',background:selected.bold?'white':'#374151',color:selected.bold?'#111':'white'}}>B</button>
                <button onClick={()=>updateEl(selected.id,{italic:!selected.italic})} style={{padding:'6px 14px',fontStyle:'italic',borderRadius:4,border:'1px solid #4b5563',cursor:'pointer',background:selected.italic?'white':'#374151',color:selected.italic?'#111':'white'}}>I</button>
                <button onClick={()=>updateEl(selected.id,{color:'#ffffff'})} style={{padding:'6px 12px',background:'white',color:'#111',border:'none',borderRadius:4,cursor:'pointer',fontSize:12}}>Blanco</button>
                <button onClick={()=>updateEl(selected.id,{color:'#1a1a1a'})} style={{padding:'6px 12px',background:'#111',color:'white',border:'none',borderRadius:4,cursor:'pointer',fontSize:12}}>Negro</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function BrandCard({ banner, isAdmin, onEdit }) {
  const elements = parseEls(banner.elements)
  const hasEls   = elements.length > 0
  const hasWaEl  = hasEls && elements.some(e => e.id==='wa')

  return (
    <div style={{position:'relative',borderRadius:8,overflow:'hidden',height:CARD_H,cursor:'pointer',background:'#000'}}>
      {/* object-fit: contain — imagen completa, sin recortar */}
      <img src={banner.image} alt={banner.title}
        style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'contain'}}/>

      {hasEls ? (
        <>
          {elements.map(el => {
            if (!el.text) return null
            const w = el.width||80
            if (el.id==='btn') return (
              <div key={el.id} style={{position:'absolute',left:`${el.x}%`,top:`${el.y}%`,width:`${w}%`}}>
                {el.url
                  ? <a href={el.url} style={{display:'inline-block',background:'white',color:el.color||'#333',padding:'4px 14px',borderRadius:3,fontSize:`${el.size||12}px`,fontWeight:'bold',textDecoration:'none',whiteSpace:'nowrap'}}>{el.text}</a>
                  : <span style={{display:'inline-block',background:'white',color:el.color||'#333',padding:'4px 14px',borderRadius:3,fontSize:`${el.size||12}px`,fontWeight:'bold',whiteSpace:'nowrap'}}>{el.text}</span>
                }
              </div>
            )
            if (el.id==='wa') {
              if (!el.url) return null
              return (
                <div key={el.id} style={{position:'absolute',left:`${el.x}%`,top:`${el.y}%`,width:`${w}%`}}>
                  <a href={`https://wa.me/${el.url.replace(/[^0-9]/g,'')}`} target="_blank" rel="noopener noreferrer"
                    style={{display:'inline-flex',alignItems:'center',gap:5,background:'#22c55e',color:'white',padding:'4px 12px',borderRadius:4,fontSize:`${el.size||12}px`,fontWeight:'bold',textDecoration:'none',whiteSpace:'nowrap'}}
                    onClick={e=>e.stopPropagation()}>
                    📱 {el.text||'Chat on WhatsApp'}
                  </a>
                </div>
              )
            }
            return (
              <div key={el.id} style={{position:'absolute',left:`${el.x}%`,top:`${el.y}%`,width:`${w}%`}}>
                <span style={elStyle(el)}>{el.text}</span>
              </div>
            )
          })}
          {!hasWaEl && banner.whatsapp && (
            <div style={{position:'absolute',left:'5%',bottom:'5%'}}>
              <a href={`https://wa.me/${banner.whatsapp.replace(/[^0-9]/g,'')}`} target="_blank" rel="noopener noreferrer"
                style={{display:'inline-flex',alignItems:'center',gap:5,background:'#22c55e',color:'white',padding:'4px 12px',borderRadius:4,fontSize:12,fontWeight:'bold',textDecoration:'none',whiteSpace:'nowrap'}}
                onClick={e=>e.stopPropagation()}>
                📱 Chat on WhatsApp
              </a>
            </div>
          )}
        </>
      ) : (
        <div style={{position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(to top,rgba(0,0,0,0.7),transparent)',padding:16}}>
          <h3 style={{color:'white',fontWeight:'bold',fontSize:16,margin:0}}>{banner.title}</h3>
          {banner.description && <p style={{color:'white',fontSize:13,margin:'4px 0'}}>{banner.description}</p>}
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:6}}>
            {banner.button_text && <button style={{background:'white',color:'#333',border:'none',padding:'4px 14px',borderRadius:3,fontWeight:'bold',fontSize:12,cursor:'pointer',whiteSpace:'nowrap'}}>{banner.button_text}</button>}
            {banner.whatsapp && (
              <a href={`https://wa.me/${banner.whatsapp.replace(/[^0-9]/g,'')}`} target="_blank" rel="noopener noreferrer"
                style={{display:'inline-flex',alignItems:'center',gap:4,background:'#22c55e',color:'white',padding:'4px 12px',borderRadius:4,fontSize:12,fontWeight:'bold',textDecoration:'none',whiteSpace:'nowrap'}}
                onClick={e=>e.stopPropagation()}>
                📱 Chat on WhatsApp
              </a>
            )}
          </div>
        </div>
      )}

      {isAdmin && (
        <button onClick={e=>{e.stopPropagation();onEdit(banner)}}
          style={{position:'absolute',top:8,right:8,background:'#2563eb',color:'white',border:'none',padding:'5px 12px',borderRadius:5,cursor:'pointer',fontWeight:'bold',fontSize:11,zIndex:20,boxShadow:'0 2px 6px rgba(0,0,0,0.4)',whiteSpace:'nowrap'}}>
          ✏️ Editar
        </button>
      )}
    </div>
  )
}

function Brands() {
  const [banners, setBanners]       = useState([])
  const [editBanner, setEditBanner] = useState(null)
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const load = () => fetch(`${API}/api/brands`).then(r=>r.json()).then(setBanners).catch(()=>{})

  useEffect(() => { load() }, [])

  if (banners.length === 0) return null

  return (
    <section className="py-12 px-6">
      {editBanner && <CardEditor banner={editBanner} onClose={()=>setEditBanner(null)} onSaved={load}/>}

      <h2 className="text-2xl font-bold text-center mb-8 uppercase tracking-widest">Browse Our Brands</h2>
      <Swiper
        modules={[Autoplay, Navigation]}
        autoplay={isAdmin ? false : {delay:4000,disableOnInteraction:false}}
        speed={1000} navigation loop={banners.length>=6}
        slidesPerView={3} spaceBetween={20}
        breakpoints={{0:{slidesPerView:1},768:{slidesPerView:2},1024:{slidesPerView:3}}}>
        {banners.map(banner=>(
          <SwiperSlide key={banner.id}>
            <BrandCard banner={banner} isAdmin={isAdmin} onEdit={setEditBanner}/>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default Brands